from pydantic import BaseModel
from enum import Enum
###########
# campaign_owner_user_id is used to uniquely identify the campaign owner as they will be the only subscriber for this notification as well
# subscriber_email_list is the list of all the subscribers who have backed the campaign and as well as subscribed for "Project Update" notifications.
# trigger_point could either be "Project Update/Message" or "Campaign Ended" or "Campaign Failure" depending on the event that was happened and triggered through the front-end. More trigger_points might be added and these might be removed depending on the inputs from the Product Team
# campaign_name is the name of the campaign, and will be sent in the email body
###########
class Project_Update_Notification(BaseModel):
    campaign_owner_id: str = ""
    trigger_point: str = ""
    campaign_id: str = ""
    user_ids_list: list = [""]


class Trigger_Point(Enum):
    project_update = "project_update"
    campaign_ended = "campaign_ended"
    campaign_failed = "campaign_failed"
