from pydantic import BaseModel

##########
# user_id would be the user's object ID from USER service, to sync with it.
# someone_backs_your_campaign_bool is a boolean variable initially set False, if someone checks it from the front-end it'll be set True. If set True:- It'll notify the campaign owner about a new backer
# new_update_on_backed_campaign_bool is a boolean variable initially set False, if someone checks it from the front-end it'll be set True. If set True:- It'll notify the users about new updates on their backed campaigns.
# topic_backed_project_updates_email_list is an empty list while at the time of creation a user's data, that'll store the subscribers list
# user_email_id is used for storing, is the user has opted for "New backer" notification
##########
class User(BaseModel):
    someone_backs_your_campaign_bool: bool = False
    new_update_on_backed_campaign_bool: bool = False
    
