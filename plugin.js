const fs = require('fs');
const tv4 = require('tv4');
const specName = 'spec';

log = (msg) => {
    console.log("[plugin] [spec validator]", msg);
}

module.exports.responseHooks = [
    context => {

        let config = context.request.getEnvironmentVariable('spec_validator');

        if (!config.enabled) {
            log("Plugin is disabled");
            return;
        }

        if (config.path === undefined || config.path === "") {
            log("No path to the spec - please use the absolute path");
            return;
        }

        if (!config.base || config.base === undefined) {
            log("No base in the config - cannot validate");
            return;
        }

        let bodyBuffer = context.response.getBody();

        // ignore when there is no body to validate
        if (bodyBuffer === null) {
            log("No body in the response to validate");
            return;
        }

        // ensure the schema exists
        fs.exists(config.path, function (exists) {

            if (!exists) {
                log("Spec does not exist at the location - please update the path");
                return;
            }

            let url = context.request.getUrl();
            let path = url.replace(config.base, '');

            let requestMethod = context.request.getMethod().toLowerCase();

            // get the status code from the response
            let statusCode = context.response.getStatusCode();

            // parse the body from the buffer to an object
            let body = JSON.parse(bodyBuffer);

            // load the schema
            let schema = require(config.path);
            tv4.addSchema(specName, schema);

            // get the target JSONSchema from the map
            let map = tv4.getSchemaMap();

            let target = undefined;

            try {
                target = map[specName].paths[path][requestMethod].responses[statusCode].schema;
            } catch (err) {
                // we don't have a matching schema to check against
                log("no valid spec path for this endpoint");
                return;
            }

            let result = tv4.validateMultiple(body, target);

            if (result.missing.length > 0) {
                // we have a missing spec
                alert('Missing Spec for this response');
                log(result)
                return;
            }

            if (result.errors.length > 0) {
                // spec validation failed
                alert('Response format does not match spec');
                log(result)
                return;
            }

            // the spec validates without issue =)
            log("Response matches specification");
            return;

        });
    }
];
