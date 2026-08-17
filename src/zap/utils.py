from environs import Env


def load_secrets(read_dotenv: bool = True) -> dict:
    """
    Load (non-)sensitive config values from environment variables or possible .env file.

    For setting as Streamlit app secrets programmatically.

    Streamlit doesn't have a way to set non-sensitive config options from environment variables, so a 'non_sensitive'
    secrets section is used. Values in all other sections MUST be considered sensitive.
    """
    _app_prefix = "ZAP_"
    _env = Env()
    if read_dotenv:
        _env.read_env()

    with _env.prefixed(_app_prefix):
        return {
            "admin_metadata": {
                "encryption_key_private": _env.str("ADMIN_METADATA_ENCRYPTION_KEY_PRIVATE"),
                "signing_key_private": _env.str("ADMIN_METADATA_SIGNING_KEY_PRIVATE"),
            },
            "non_sensitive": {},
        }


def flatten_exceptions(error: BaseException) -> list[BaseException]:
    """
    Flatten nested exceptions so Streamlit's exceptions widget can show them.

    Without this Streamlit only shows the top/summary exception not the detail(s).

    Needed and intended for Cattrs class structuring errors when loading records.
    """
    if isinstance(error, BaseExceptionGroup):
        return [sub_error for sub_e in error.exceptions for sub_error in flatten_exceptions(sub_e)]
    return [error]
