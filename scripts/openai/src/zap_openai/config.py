from environs import Env

env = Env()
env.read_env()

OPENAI_API_KEY = env.str("OPENAI_API_KEY")
OPENAI_ORGANISATION_ID = env.str("OPENAI_ORGANISATION_ID")
OPENAI_PROJECT_ID = env.str("OPENAI_PROJECT_ID")
