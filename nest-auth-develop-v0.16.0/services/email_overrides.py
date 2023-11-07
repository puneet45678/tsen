from supertokens_python.ingredients.emaildelivery.types import EmailContent
from supertokens_python.recipe.thirdpartyemailpassword.types import EmailTemplateVars
from supertokens_python.recipe.emailverification.types import EmailTemplateVars as EVEmailTemplateVars
import config.read_yaml
from config import read_yaml
from utils import utils
from supertokens_python.recipe.emailverification.interfaces import APIInterface, APIOptions, EmailVerifyPostOkResult
from typing import Dict, Any, Optional
from supertokens_python.recipe.session.interfaces import SessionContainer
from services.roles_permissions_services import add_authorized_3DP_user_role
from services import roles_permissions_services,routes_db_services
from supertokens_python.recipe.userroles.asyncio import remove_user_role
from supertokens_python.recipe.userroles import UserRoleClaim,PermissionClaim
from supertokens_python.recipe.emailverification.types import EmailDeliveryOverrideInput as EVEmailDeliveryOverrideInput, EmailTemplateVars as EVEmailTemplateVars
from supertokens_python.recipe.thirdpartyemailpassword.types import EmailDeliveryOverrideInput, EmailTemplateVars
from services import supertokens_auth_services
from fastapi import Request


from logger.logging import get_logger
logger = get_logger(__name__)

#This override is for password reset
def custom_email_deliver(original_implementation: EmailDeliveryOverrideInput) -> EmailDeliveryOverrideInput:
    original_send_email = original_implementation.send_email

    async def send_email(template_vars: EmailTemplateVars, user_context: Dict[str, Any]) -> None:
        # TODO: create and send password reset email
        
        # Or use the original implementation which calls the default service,
        # or a service that you may have specified in the email_delivery object.
        return await original_send_email(template_vars, user_context)
    
    original_implementation.send_email = send_email
    return original_implementation


#This override is for email verification
def custom_emailverification_delivery(original_implementation: EVEmailDeliveryOverrideInput) -> EVEmailDeliveryOverrideInput:
    original_send_email = original_implementation.send_email

    async def send_email(template_vars: EVEmailTemplateVars, user_context: Dict[str, Any]) -> None:
        request: Request = user_context["_default"]["request"].request


        template_vars.email_verify_link = template_vars.email_verify_link.replace(
            f"{read_yaml.website_domain}/auth/verify-email", f"{read_yaml.api_domain}/verify-signup-email/{template_vars.user.id}")
        
        logger.debug(f"Email Verify Link { template_vars.email_verify_link}")
        logger.debug(f"Sending the email verification email")

        try:
            # await supertokens_auth_services.send_signup_verification_email(template_vars.user.email,template_vars.user.id,template_vars.email_verify_link)
            if not await supertokens_auth_services.is_email_verified(template_vars.user.id): 
                await routes_db_services.send_signup_verification_email(template_vars.user.email,template_vars.user.id,template_vars.email_verify_link,request)
            else:
                logger.debug("Email Already Verified")
        except Exception as e:
            logger.error(str(e))


        return await original_send_email(template_vars, user_context)

    original_implementation.send_email = send_email
    return original_implementation





def override_email_verification_apis(original_implementation_email_verification: APIInterface):
    original_email_verify_post = original_implementation_email_verification.email_verify_post

    async def email_verify_post(token: str,
                                session: Optional[SessionContainer],
                                api_options: APIOptions,
                                user_context: Dict[str, Any],):

        response = await original_email_verify_post(token, session, api_options, user_context)

        # Then we check if it was successfully completed
        if isinstance(response, EmailVerifyPostOkResult):
            _ = response.user
            logger.debug("Email verificaion successfull, adding 3DP role to user")
            res = await add_authorized_3DP_user_role(response.user.user_id,response.user.email)
            logger.debug("Removing guest role from user")
            if not res.did_user_have_role:
                logger.error("User never had a guest role")

            await remove_user_role(response.user.user_id, "guest")
            await roles_permissions_services.delete_role_from_metadata(response.user.user_id,"guest")
            await session.fetch_and_set_claim(UserRoleClaim)
            await session.fetch_and_set_claim(PermissionClaim)


            # TODO: Send post email verification mail

        return response

    original_implementation_email_verification.email_verify_post = email_verify_post
    return original_implementation_email_verification