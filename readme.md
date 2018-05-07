# Insomnia Plugin: Validate API Responses against a Swagger Spec

This is a plugin for [insomnia](https://github.com/getinsomnia/insomnia) that allows you to validate the response body of an API call against a supplied swagger spec file.

## Installation

With insomnia open, go to Preferences > Plugins. Add `insomnia-plugin-validator` to the package name field and click `Install Plugin`.

## Configuration

To add your spec file, you need to add it to your environment. Open up the environment manager and create a `spec` object with at least the *absolute* path to your swagger spec file on disk:

```json
{
    "spec": {
        "path": "/Users/You/Desktop/yourapispec.json",
        "base": "https://api.you.com/v3",
        "enabled": true
    }
}
```

| Option         | Type     | Required | Default | Description |
| -------------- | -------- | -------- | ------- | ----------- |
| `spec.base`    | `string` | `true`   | `null`  | The API base path (see below) |
| `spec.path`    | `string` | `true`   | `null`  | The absolute path to your spec file |
| `spec.enabled` | `bool`   | `true`   | `true`  | When set to `false` validation will be bypassed |

Insomnia gives us the request context when we're validating and we need to extract the path to validate against without the URL. To do this, we will remove `spec.base` from the URL the request was sent to. This also allows you to validate the same spec against multiple environments. For example, if you are making an API call to `https://api.you.com/v3/myresource` the correct value for `spec.base` is `https://api.you.com/v3`. 

Now when you make requests to the API, the response body will be validated against your spec file and you will be notified if your responses do not conform to the spec.

## Warnings and Improvements

 - At the moment, you need to restart insomnia whenever your spec file changes which is far from ideal.
 - The interface is lacking - any errors will simply produce a prompt and you need to check the console for information. There is a lack of configurability available to API developers to utilise the application's UI. [Hoping](https://github.com/getinsomnia/insomnia/issues/855) this makes it into a future release.
 - There is no test coverage at the moment.
