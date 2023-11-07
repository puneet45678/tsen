from pydantic import BaseModel


###########
# user_id is used to identify the unique user
# someone_backs_your_campaign & new_update_on_backed_campaign are the boolean values that would be returned when the front-end wants to get the stauts of all the notifications that user has subscribed for
###########
class User_Notification_Status(BaseModel):
    someone_backs_your_campaign: bool = False
    new_update_on_backed_campaign: bool = False
