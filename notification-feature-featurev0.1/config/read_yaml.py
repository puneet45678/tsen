from confz import ConfZ, ConfZEnvSource, ConfZFileSource, ConfZCLArgSource
from typing import Optional
import os


env = os.getenv("NOTIFICATIONS_ENV")
cwd = os.getcwd()


class MyAppConfig(ConfZ):
    if not env:
        env = "local"

    CONFIG_SOURCES = [
        ConfZFileSource(os.path.join(cwd, "config", f"{env}_application.yaml")),
        ConfZFileSource(os.path.join(cwd, "config", f"default_application.yaml")),
    ]

    # Load secrets.yaml file only for non-production environments
    if env not in ["production"]:
        CONFIG_SOURCES.append(
            ConfZFileSource(os.path.join(cwd, "config", f"secrets.yaml"))
        )


    logging: dict = {}
    aws: dict = {}
    auth: dict = {}
    cors: dict = {}
    mongodb: dict = {}
    supertokens: dict = {}
    sendinblue: dict = {}
    getstream:dict={}
    uploadcare:dict={}
    HOST: str=""
    HOST_CORE: str = ""
    ports: dict = {}
    app: dict= {}
    getstream_config: dict={}
    uploadcare_config: dict={}
    brevo_contact_lists_config: dict={}
    brevo_email_config: dict={}


config_yaml = MyAppConfig()

print("Environment",env)

EXCLUDED_APIS = config_yaml.app['EXCLUDED_APIS']
if env == "development":
    AUTH_DOMAIN= f"https://auth.{config_yaml.HOST}"
    WEBSITE_DOMAIN = f"https://app.{config_yaml.HOST}"
    CAMPAIGN_DOMAIN = f"https://campaign.{config_yaml.HOST}"
    USER_DOMAIN = f"https://user.{config_yaml.HOST}"

else:
    AUTH_DOMAIN = f"http://{config_yaml.HOST}:{config_yaml.ports['auth_port']}"
    WEBSITE_DOMAIN = f"http://{config_yaml.HOST}:{config_yaml.ports['website_port']}"
    CAMPAIGN_DOMAIN = f"http://{config_yaml.HOST}:{config_yaml.ports['campaign_port']}"
    USER_DOMAIN = f"http://{config_yaml.HOST}:{config_yaml.ports['user_port']}"
