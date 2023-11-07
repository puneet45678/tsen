def return_notification_data_milestone_reached(campaign_name):
    notification_data_owner_milestone_reached = '<p><strong>Milestone achieved!</strong></p><p><span class="ql-cursor"></span>Share this feat with friends on your socials</p>'
    notification_data_other_users_milestone_reached = f"The campaign {campaign_name} you backed achieved milestone!"
    return (notification_data_owner_milestone_reached,notification_data_other_users_milestone_reached)

def return_early_bird_tier_ending_soon_time_period(campaign_name,time_left):
    notification_data = f'<p><strong>Hurry! </strong>Early-bird Tier of {campaign_name} ends in {time_left} days </p>'
    return notification_data

def return_early_bird_tier_ending_soon_seats_left(campaign_name,seats_left):
    notification_data = f"<p><strong>Hurry! Campaign {campaign_name}'s Early-bird Tier is selling out soon</strong></p><p>Only {seats_left} seats remaining</p><p><br></p>"
    return notification_data

def return_campaign_ending_soon(campaign_name,time_left):
    notification_data = f'<p><strong>{campaign_name} closes in {time_left}.&nbsp;</strong></p><p>What are you waiting for?&nbsp;</p><p>Contribute now!</p><p><br></p>'
    return notification_data

def return_model_approved(model_name):
    notification_data = f'<p><strong>Hurray! Your model {model_name} is approved</strong></p><p>It will be visible in the mode you selected.</p><p><br></p>'
    return notification_data

def return_model_rejected(model_name):
    notification_data = f"<p><strong>Oh no! Your model {model_name} could not be approved</strong></p><p>Don't worry, upload another model now.</p><p><br></p>"
    return notification_data

def return_marketplace_purchase(buyer_name,model_name):
    notification_data = f"Yay! {buyer_name} purchased your model {model_name}"
    return notification_data

def return_your_signed_up_pre_marketing_campaign_has_published(campaign_name, campaign_owner_name):
    notification_data = f"<p><strong>Yay! {campaign_name} campaign by {campaign_owner_name} has been published</strong></p><p>Head over and contribute NOW! </p>"
    return notification_data

def return_your_campaign_published(campaign_name, campaign_owner_name):
    notification_data = f"<p><strong>Yay! {campaign_name} campaign by {campaign_owner_name} has been published</strong></p><p>Head over and contribute NOW! </p>"
    return notification_data

def return_artist_you_follow_published_campaign(campaign_name, campaign_owner_name):
    notification_data = f"<p><strong>Yay! {campaign_name} campaign by {campaign_owner_name} has been published</strong></p><p>Head over and contribute NOW! </p>"
    return notification_data

def return_someone_backed_your_campaign(campaign_name,first_backer,backer_user_name):
    if first_backer is True:
        notification_data = f"<p>Congratulations! Your campaign {campaign_name} received its first backer</p>"
    else:
        notification_data = f"{backer_user_name} backed your campaign {campaign_name}"
    return notification_data

def return_your_campaign_got_premarket_signee(campaign_name,signee_user_name):
    notification_data = f"<p><strong>{signee_user_name} signed up for your campaign {campaign_name}</strong></p><p>People are so ready for your creativity!</p><p><br></p>"
    return notification_data

def return_your_campaign_ended(campaign_name):
    notification_data = f"<p><strong>Your campaign {campaign_name} has ended. Good job!</strong></p><p>Review the performance now</p><p><br></p>"
    return notification_data

def return_your_purchase_completed():
    notification_data = f"<p><strong>Your purchase is successful!</strong></p><p>We've sent your receipt to the registered email ID.</p><p><br></p>"
    return notification_data

def return_your_campaign_approved_or_rejected(campaign_name,action):
    if action=="reject":
        notification_data = f"<p><strong>Oh no! Your campaign {campaign_name} could not be approved</strong></p><p>Don't worry, upload another campaign now.</p><p><br></p>"
    else:
        notification_data=f"<p><strong>Hooray! Campaign {campaign_name} approved</strong></p><p>It will publish on the date you set.</p><p><br></p>"
    
    return notification_data