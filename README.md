# cs-api-authentication
api wrappers for common account management functions

## Install

npm install github:ControlSpaceSoftware/cs-api-authentication.git --save

## Usage

Each function has a wrapper to inject dependencies.

## Errors

If user input is missing, returns statusCode 400 with a json message like this:
```
{code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.'}
```
