from environs import Env
from importlib.metadata import version

env = Env()
env.read_env()

VERSION = version("zap-openai")

OPENAI_API_KEY = env.str("APP_OPENAI_API_KEY")
OPENAI_ORGANISATION_ID = env.str("APP_OPENAI_ORGANISATION_ID")
OPENAI_PROJECT_ID = env.str("APP_OPENAI_PROJECT_ID")
