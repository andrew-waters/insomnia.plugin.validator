const fs = require('fs');
const tv4 = require('tv4');
const specName = 'spec';

module.exports.responseHooks = [
    context => {
        let bodyBuffer = context.response.getBody();

        // ignore when there is no body to validate
        if (bodyBuffer === null) {
            return;
        }

        // @todo load the config from the environment
        // let config = context.response.getEnvironmentVariable('spec');
        let config = {
            path: '/Users/andrew_waters/Desktop/spec.json',
            enabled: true
        };

        if (!config.enabled || config.path === undefined) {
            return;
        }

        // ensure the schema exists
        fs.exists(config.path, function (exists) {

            if (!exists) {
                return;
            }

            // @todo get the path from the request
            // let path = context.request.getUrl(); // <- we may have quite a bit of work to do getting the path from the URL
            let path = '/products';

            // @todo get the request method from the request
            // let requestMethod = context.request.getMethod().toLowerCase();
            let requestMethod = 'get';

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
                return;
            }

            let result = tv4.validateMultiple(body, target);

            if (result.missing.length > 0) {
                // we have a missing spec
                alert('Missing Spec for this response')
                console.log(result)
                return;
            }

            if (result.errors.length > 0) {
                // spec validation failed
                alert('Response format does not match spec')
                console.log(result)
                return;
            }

            // the spec validates without issue =)

        });
    }
];
