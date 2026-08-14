# Zap - Configuration

Application configuration uses
[Streamlit Secrets](https://docs.streamlit.io/develop/concepts/connections/secrets-management) backed by environment
variables. Variables are prefixed with `ZAP_` to avoid conflicts with other applications. E.g. use `ZAP_FOO` to set a
`FOO` option.

Secrets are used for both sensitive and non-sensitive config options for consistency. Secrets are loaded
programmatically as an argument to `st.App()` using `zap.utils.load_secrets`.

<!-- pyml disable md028 -->
> [!TIP]
> Config options can be defined using environment variables and/or an `.env` file, with environment variables taking
> precedence.

> [!NOTE]
> Config option values may be [Overridden](/docs/dev.md#pytest-env) in application tests.
<!-- pyml enable md028 -->

## Config options

<!-- pyml disable md013 -->
| Option                                  | Type         | Sensitive | Since Version | Summary                                                  | Default | Example                                         |
|-----------------------------------------|--------------|-----------|---------------|----------------------------------------------------------|---------|-------------------------------------------------|
| `ADMIN_METADATA_ENCRYPTION_KEY_PRIVATE` | JSON Web Key | Yes       | v0.24.0       | JSON Web Key (JWK) for accessing administrative metadata | *None*  | '{"kid": "magic_metadata_encryption_key", ...}' |
| `ADMIN_METADATA_SIGNING_KEY_PRIVATE`    | JSON Web Key | Yes       | v0.24.0       | JSON Web Key (JWK) for verifying administrative metadata | *None*  | '{"kid": "magic_metadata_signing_key", ...}'    |
<!-- pyml enable md013 -->

## Config option types

All [Config Options](#config-options) are read as string values. They will be parsed and cast to the listed type by
`zap.utils.load_secrets`. E.g. `'true'` and `'True'` will be parsed as Python's `True` constant for a boolean option.

## Config validation

Missing, required, config options will raise a `environs.exceptions.EnvError` on property access.

[Marshmallow](https://marshmallow.readthedocs.io/en/stable/marshmallow.validate.html and custom validation methods MAY
additionally validate some config options, raising `environs.exceptions.EnvValidationError` (a `EnvError` subclass) if
invalid.

> [!WARNING]
> This validation is basic/limited, checking a value is a URL for example, not that it points to a particular type of
> service. Additional validation and error handling SHOULD be caught elsewhere in the application.

## Generate an environment config file

Run the `env-init` [Development Task](/docs/dev.md#development-tasks) to generate a new `.env` file from the
`resources/dev/.env.tpl` template.

> [!NOTE]
> This uses the [1Password CLI](https://developer.1password.com/docs/cli/) to inject relevant secrets. You must have
> access to relevant vaults within the MAGIC 1Password account to run this task.

## Adding configuration options

See the [Development](/docs/dev.md#adding-configuration-options) documentation.
