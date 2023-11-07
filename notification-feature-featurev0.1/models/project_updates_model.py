from pydantic import BaseModel, EmailStr

###########
# user_id is used to identify the unique user/publisher who's database document would be modified
# topic_backed_project_updates has been changed to backer_email_id, and will be used to either add or remove the particular email form the subscribers list of a particular publisher
# action_type could be either "add_email" or "remove_email" depending on which we will add or remove the email id.
###########
class Project_Updates(BaseModel):
    user_id: str = ""
    backer_email_id: EmailStr = ""
    campaign_id: str = ""
