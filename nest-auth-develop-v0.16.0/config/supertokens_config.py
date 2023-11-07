from supertokens_python.recipe.thirdparty.provider import ProviderInput, ProviderConfig, ProviderClientConfig
from supertokens_python import SupertokensConfig
from supertokens_python.recipe import dashboard
from supertokens_python.recipe import emailverification
from supertokens_python.recipe import thirdpartyemailpassword, session
from supertokens_python.recipe import usermetadata
from config import read_yaml
from services.email_overrides import  override_email_verification_apis,custom_emailverification_delivery, custom_email_deliver
from services.login_and_signup_overrides import override_thirdpartyemailpassword_functions,override_thirdpartyemailpassword_apis,override_functions
from supertokens_python.recipe import userroles
from supertokens_python.ingredients.emaildelivery.types import EmailDeliveryConfig
from supertokens_python.recipe import jwt as jwt_recipe
from supertokens_python import init, InputAppInfo
from supertokens_python.recipe import emailpassword

APP_INFO =InputAppInfo(
        app_name=read_yaml.app_name,
        api_domain=read_yaml.api_domain,
        website_domain=read_yaml.website_domain_parent,
        api_base_path=read_yaml.api_base_path,
        website_base_path=read_yaml.api_base_path)

supertokens_config = SupertokensConfig(
    connection_uri= read_yaml.supertokens_core_uri,
    api_key=read_yaml.supertokens_core_api_key
)


providers = [

    ProviderInput(
        config=ProviderConfig(
            third_party_id="google",
            clients = [
                ProviderClientConfig(
                    client_id=read_yaml.google_client_id,
                    client_secret=read_yaml.google_client_secret_key,
                    scope=[read_yaml.email_scope,read_yaml.profile_scope]
                ),
            ],
        ),
    ),

    ProviderInput(
        config=ProviderConfig(
            third_party_id="facebook",
            clients = [
                ProviderClientConfig(
                    client_id=str(read_yaml.facebook_client_id),
                    client_secret=str(read_yaml.facebook_client_secret_key),
                ),
            ],
        ),
    ),
]

recipe_list = [
    emailverification.init(mode=read_yaml.email_verification_mode,
                           override=emailverification.InputOverrideConfig(apis=override_email_verification_apis),
                           email_delivery=EmailDeliveryConfig(override=custom_emailverification_delivery)),
    session.init(
                cookie_domain = read_yaml.cookie_domain,
                override=session.InputOverrideConfig(functions=override_functions)
        ),

    jwt_recipe.init(),

    thirdpartyemailpassword.init(
                email_delivery=EmailDeliveryConfig(override=custom_email_deliver),
                override=thirdpartyemailpassword.InputOverrideConfig(apis=override_thirdpartyemailpassword_apis,functions=override_thirdpartyemailpassword_functions),
                providers=providers,
                ),


    dashboard.init(api_key=read_yaml.user_management_dashboard_api_key),
    usermetadata.init(),
    userroles.init()

]
