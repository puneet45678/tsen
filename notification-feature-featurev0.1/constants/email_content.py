from utils import utils

new_backer_subject = "New Backer in your Nest!"
project_update_subject = "Project Update in your Nest"
campaign_ended_subject = "Campaign has Ended!"
campaign_failure_subject = "Campaign has Failed!"
new_signup_subject = "Nest Welcomes you!"
new_model_approval_subject = "Congratulations, model approved!"
new_model_rejected_subject = "Model Rejected"
new_campaign_approval_subject = "Congratulations, campaign approved!"
new_campaign_rejected_subject = "Sad! campaign rejected"
campaign_published_subject = "Congratulations! Campaign published"
premarketing_signup_subject = "Here are the total sign-ups for your campaign"
marketplace_purchase_subject = "Someone Bought your model"
milestone_reached_subject_owner="You're a Legend! Milestone reached"
milestone_reached_subject_backers = "You've supported a legend"
early_bird_tier_ending_soon_subject="Bird is going to fly soon!"
campaign_ending_soon_subject="Campaign is going to end soon!"
model_deletion_subject = "Model being deleted!"
model_deletion_cool_off_period_ending_subject = "Model Cool off period ending soon!"
account_deletion_initiated_subject = "We're Sorry to see you go!"
account_deletion_cool_off_period_ending_subject = "Account Cool off period ending soon!"
object_lying_in_draft_subject = "You've got unfinished work"
account_deletion_raised_to_admin_subject = "Someone initiated account deletion!"
user_reported_raised_to_admin_subject = "Someone initiated account deletion!"
new_user_email_verification_subject = "Welcome! Verify your account here!"
email_change_verification_subject = "Verify your uodated email here!"
unkown_device_login_verification_subject = "An unkown device login has been detected"
abondoned_cart_subject = "Hi, you're cart is waiting eagerly for you"
forgot_pasword_subject = "Reset Your Password"
forgot_password_changed_subject = "Password Reset Successfully"
user_requested_3da_role_subject = "Request to Become a Creator"
user_granted_3da_role_subject = "You are now a creator"
user_declined_3da_role_subject = "Update: Request to Become a Creator"
new_signup_verification_subject = "Verify Your Email Address"
email_changed_success_subject = "Email Changed Successfully"

sender_email = "hello@ikarusnest.com"
reply_to_email = "parth.arora1614@gmail.com"

def new_model_buyer_email_subject(buyer_number):
    return f"Yay! Your model received its {buyer_number} buyer!"

def new_backer_html_content(subscriber_name, backer_name, campaign_name):
    return utils.get_new_backer_email_template()

def project_update_html_content(campaign_name):
    html_content = f"<html><body><h1>Campaign {campaign_name} has a new update/message from the artist</h1></body></html>"
    return html_content

def project_ended_html_content(campaign_name):
    html_content = f"<html><body><h1>Campaign {campaign_name} has ended</h1></body></html>"
    return html_content

def campaign_failed_html_content(campaign_name):
    html_content = f"<html><body><h1>Campaign {campaign_name} has not been able to reach the goal. Your Refunds will process soon!</h1></body></html>"
    return html_content

# def new_signup_html_content(user_name):
#     html_content = f"<html><body><h1>Ahoy {user_name}! Welcome to your beautiful Nest.</h1></body></html>"
#     return html_content    

def new_model_approval(model_name):
    html_content = f"<html><body><h1>Ahoy {model_name}! has been approved by the Nest. That's how we roll.</h1></body></html>"
    return html_content 

# def new_model_rejected_html_content(model_name):
#     html_content = f"<html><body><h1>Ahoy {model_name}! has been rejected by the Nest. But, Don't worry.</h1></body></html>"
#     return html_content 

# def new_campaign_approval(campaign_name):
#     html_content = f"<html><body><h1>Ahoy {campaign_name}! has been approved by the Nest. That's how we roll.</h1></body></html>"
#     return html_content    

# def new_campaign_rejected_html_content(campaign_name):
#     html_content = f"<html><body><h1>Ahoy {campaign_name}! has been rejected by the Nest. Really Sad.</h1></body></html>"
#     return html_content    
   
def campaign_published_html_content(campaign_name):
    html_content = f"<html><body><h1>Congratulations!, your campaign {campaign_name}! has been published to your Nest</h1></body></html>"
    return html_content 

# def premarketing_signup_html_content(backer_name,campaign_name):
#     html_content = f"<html><body><h1>Congratulations! {backer_name} has signed up for early bird tier in campaign {campaign_name} </h1></body></html>"
#     return html_content  

 

# def milestone_reached_html_content_owner(user_name, milestone_name):
#     html_content = f"<html><body><h1>Congratulations! {user_name}, you have reached the precious milestone of {milestone_name}</h1></body></html>"
#     return html_content     

# def milestone_reached_html_content_backers(campaign_name, milestone_name):
#     html_content = f"<html><body><h1>Congratulations! Your backed {campaign_name} has reached the milestone of {milestone_name}</h1></body></html>" 
#     return html_content



def early_bird_tier_ending_soon_html_content(campaign_name, time_left):
    html_content = f"<html><body><h1>Early Bird Tier of campaign {campaign_name} is ending in {time_left}</h1></body></html>"
    return html_content      

def campaign_ending_soon_html_content(campaign_name, time_left):
    html_content = f"<html><body><h1>Campaign {campaign_name} is ending in {time_left}</h1></body></html>"
    return html_content      

def account_deletion_initiated_html_content(user_name):
    html_content = f"<html><body><h1>Hey {user_name}! we have initiated your account deletion</h1></body></html>"
    return html_content

def model_deletion_html_content(model_name):
    html_content = f"<html><body><h1>Hey! {model_name} is being taken down from Nest</h1></body></html>"
    return html_content    

def model_deletion_cool_off_period_ending_html_content(user_name,model_name):
    html_content = f"<html><body><h1>Hey {user_name}! {model_name}'s deletion cool off period ends in 24 hours</h1></body></html>"
    return html_content    

def account_deletion_cool_off_period_ending_html_content(user_name):
    html_content = f"<html><body><h1>Hey {user_name}! your account deletion cool off period ends in 24 hours</h1></body></html>"
    return html_content 

def object_lying_in_draft_html_content(user_name,campaign_name):
    html_content = f"<html><body><h1>Hey {user_name}! your campaign {campaign_name} has been lying in the drafts</h1></body></html>"
    return html_content         

def account_deletion_raised_to_admin_html_content(user_name):
    html_content = f"<html><body><h1>Hey {user_name}! has initiated their account-deletion, please look into this</h1></body></html>"
    return html_content          
def user_reported_raised_to_admin_html_content(user_name):
    html_content = f"<html><body><h1>Hey {user_name}! has been reported, please look into this</h1></body></html>"
    return html_content          


def new_campaign_rejected_html_content(user_name, campaign_name,user_email,campaign_rejection_comments):
    return utils.get_email_template_campaign_rejected(user_name,user_email,campaign_name,campaign_rejection_comments)

def new_campaign_approval(user_name,user_email,campaign_name):
    return utils.get_email_template_campaign_approved(user_name,user_email,campaign_name)

def new_model_rejected_html_content(user_name,model_name,admin_rejection_comments,email_id):
    return utils.get_email_template_model_rejected(user_name,email_id,model_name,admin_rejection_comments)

def get_new_signup_email_template(user_name:str,user_email:str):
    return utils.get_new_signup_email_template(user_name,user_email)


def get_abondoned_cart_email_template(user_name:str,last_updated_date:str,item_details:dict):
    return utils.get_abondoned_cart_email_template(user_name,last_updated_date,item_details)

def get_email_verification_email_template(verificationLink:str,verificationText:str,user_name:str):
    return utils.get_email_verification_email_template(verificationLink,verificationText,user_name)

def get_email_change_verification_email_template(new_email_verification_api_link:str, user_name:str):
    return utils.get_email_change_verification_email_template(new_email_verification_api_link,user_name)

def get_unkown_device_login_email_template(email_info:dict, user_name:str,add_to_known_device_api_link:str):
    return utils.get_unkown_device_login_email_template(email_info,user_name,add_to_known_device_api_link)

def buyer_purchase_complete_html_content(buyer_user_name,buyer_user_email,product_bought_name,order_details):
    return utils.get_email_template_buyer_purchase_completed(buyer_user_name,buyer_user_email,product_bought_name,order_details)

def marketplace_purchase_html_content(model_owner,buyer_user_name,model_name,user_email,buyer_number):
    return utils.get_marketplace_purchase_owner_template(model_owner,buyer_user_name,model_name,user_email,buyer_number)  

def premarketing_signup_html_content(campaign_owner_name,premarket_signee_numbers,user_email):
    return utils.get_new_premarket_signees_template(campaign_owner_name,premarket_signee_numbers,user_email)

def milestone_reached_html_content_backers(campaign_name,campaign_owner_name,milestone_reached_date,user_email,milestone_rewards):
    return utils.get_new_milestone_unlocked_backers_template(campaign_name,campaign_owner_name,milestone_reached_date,user_email,milestone_rewards)

def milestone_reached_html_content_owner(campaign_owner_name,milestone_name,milestone_achieved_date,campaign_owner_email,milestone_rewards):
    return utils.get_new_milestone_achieved_campaign_owner_template(campaign_owner_name,milestone_name,milestone_achieved_date,campaign_owner_email,milestone_rewards)

# def campaign_published_followers_html_content():