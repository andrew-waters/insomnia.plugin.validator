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
        "enabled": true
    }
}
```

| Option         | Type     | Required | Default | Description |
| -------------- | -------- | -------- | ------- | ----------- |
| `spec.path`    | `string` | `true`   | `null`  | The absolute path to your spec file |
| `spec.enabled` | `bool`   | `true`   | `true`  | When set to `false` validation will be bypassed |


Now when you make requests to the API, the response body will be validated against your spec file and you will be notified if your responses do not confoirm to the spec.

## Warnings and Improvements

 - This plugin will not work generically at the moment, it is PoC. It is not possibnle to access the environment or the request when dealing with a response context. This functionality has been [promised for a future release](https://github.com/getinsomnia/insomnia/issues/853#issuecomment-379618546).
 - At the moment, you need to restart insomnia whenever your spec file changes which is far from ideal.
 - The interface is lacking - any errors will simply produce a prompt. There is a lack of configurability available to API developers to utilise the application's UI. [Hoping](https://github.com/getinsomnia/insomnia/issues/855) this makes it into a future release.
 - There is no test coverage at the moment.
