# Campaign Service

This service provides APIs for campaign creators to manage their campaigns and assets. Campaign creators can upload, delete, and update assets, as well as create campaigns and tiers.

# Table Of Contents

### Runnning Locally

### API Endpoints

### Credentials

# Runnning Locally

## Creating Virtualenv

• install venv in the same folder using

```bash
 pip install virtualvenv
```

Create instance for virtual environment using

```bash
  virtualenv venv
```

    	then activate the virtual env using

```bash
   .\venv\Scripts\activate
```

• install all requirements.txt using

```bash
   pip install -r requirements.txt
```

• to run the file use

```bash
   uvicorn index:app --reload
```

• after running this command you can go to `http://127.0.0.1:8000/docs` that is swagger ui for fastapi and can check functionality of each api

Make sure a temporary folder is present in the root directory which is used for reading the uploaded files and save them temporarily

# Credentials

All the credenticals are present in `config/local/applications.yaml` and `config/local/secrets.yaml`

# API Endpoints

The following APIs are provided by this service:

• POST
/api/v1/campaigns - create the campaign of existing user and return the campaignId

• GET /api/v1/campaigns/{campaignId}/display - get campaign data for campaignId to display on page

• GET /api/v1/campaigns/{campaignId} - get all the data for campaign stored in database

• DELETE /api/v1/campaigns/{campaignId} - delete the campaign of id campaignId

• PUT /api/v1/campaigns/{campaignId}/basics - update or set the basics data of campaign

• POST /api/v1/campaigns/{campaignId}/campaign-assets - for uploading asset in campaign assets

• DELETE /api/v1/campaigns/{campaignId}/campaign-assets - for deleting all campaign assets at once

• DELETE /api/v1/campaigns/{campaignId}/campaign-asset - for deleting multiple assets

• GET /api/v1/tags - for getting all tags

• GET /api/v1/display -for gettting data to display campaigns

• GET /api/v1/campaigns/userId/{userId} - for getting all campaigns created by user having id userId

• POST /api/v1/campaigns/{campaignId}/like - for posting like

• DELETE /api/v1/campaigns/{campaignId}/unlike - for deleting like

• POST /api/v1/campaigns/{campaignId}/bookmark - for posting bookmark

• DELETE /api/v1/campaigns/{campaignId}/bookmark - for deleting bookmark

• PUT /api/v1/campaigns/{campaignId}/tiers - adding tier

• PUT /api/v1/campaigns/{campaignId}/tier/{tierId} - updating tiers data

• GET /api/v1/campaigns/{campaignId}/tiers/{tierId}/tier-asset - for getting campaign tier assets

• POST /api/v1/campaigns/{campaignId}/tiers/{tierId}/tier-asset - for UPLOADING campaign tier assets

• DELETE /api/v1/campaigns/{campaignId}/tiers/{tierId}/tier-asset - for deleting campaign tier assets

• PUT /api/v1/campaigns/{campaignId}/story/title - updating stry data in campaign

• POST /api/v1/campaigns/{campaignId}/story/faqs - for posting faqs in story

• GET /api/v1/campaigns/{campaignId}/story/faqs - for listing all faqs for particular campaign

• DELETE /api/v1/campaigns/{campaignId}/story/{faqId} - for deleting faq

• PUT /api/v1/campaigns/{campaignId}/story/{faqId} - for updating particular faq

# Campaign Endpoints

Campaigns are the main entities managed by this service. A campaign is a project that campaign creators can create to promote their products, services, or causes.

## Create a new campaign

To create a new campaign, call the `POST/api/v1/campaigns` API with the following parameters:

`userId`(required) - Id of user creating campaign

## Get campaign data to display

To display the campaign data of a campaign, call the `GET /api/v1/campaigns/{campaignId}/display` API with the following parameters:

`campaignId`(required) - Id of campaign

`defaultCurrency`(optional) - Currency User want in display

## Get complete data of compaign

To get the complete data of a campaign, call the `GET /api/v1/campaigns/{campaignId}` API with the following parameters:

`campaignId`(required) - Id of campaign

## Delete campaign

To delete a campaign, call the `DELETE /api/v1/campaigns/{campaignId}` API with the following parameters:

`campaignId`(required) - Id of campaign

## Updating Basics data

To update data of basics , call the `PUT /api/v1/campaigns/{campaignId}/basics ` API with the following parameters:

`campaignId`(required) - Id of campaign

`data`- data in format of pydantic model set as name basics in models/campaign

## Uploading asset in campaign assets

To upload asset in campaign assets , call the `POST /api/v1/campaigns/{campaignId}/campaign-assets ` API with the following parameters:

`campaignId`(required) - Id of campaign

`file`(required) - select file to upload

## Deleting all campaign assets

To delete all campaign assets, call the `DELETE /api/v1/campaigns/{campaignId}/campaign-assets` API with the following parameters:

`campaignId`(required) - Id of campaign

## Delete multiple campaign assets

To delete multiple campaign assets , call the `DELETE /api/v1/campaigns/{campaignId}/campaign-asset` API with the following parameters:

`campaignId`(required) - Id of campaign

`data`(required) - List of IDs of files want to delete

## For getting all tags

To get all tags ,call the `GET /api/v1/tags ` API

## For display campaigns

To get data to display campaigns , call the `GET /api/v1/display` API with the following parameters:

`pageSize`(optional) - No. of campaigns user wants to see in display

`nthPage`(optional) - Number of page user want to go

## For all campaigns of user

To get all campaigns created by user , call the `GET /api/v1/campaigns/userId/{userId}` API with the following parameters:

`userId`(required) - Id of user

`pageSize`(optional) - No. of campaigns user wants to see in display

`nthPage`(optional) - Number of page user want to go

## For posting like

To post like , call the `POST /api/v1/campaigns/{campaignId}/like ` API with the following parameters:

`campaignId`(required) - Id of campaign user want to like

`userId`(required) - Id of user

## For deleting like

To delete like , call the `DELETE /api/v1/campaigns/{campaignId}/unlike` API with the following parameters:

`campaignId`(required) - Id of campaign user want to like

`userId`(required) - Id of user

## For posting bookmark

To post bookmark , call the `POST /api/v1/campaigns/{campaignId}/bookmark  ` API with the following parameters:

`campaignId`(required) - Id of campaign user want to like

`userId`(required) - Id of user

## For deleting bookmark

To delete bookmark , call the `DELETE /api/v1/campaigns/{campaignId}/bookmark` API with the following parameters:

`campaignId`(required) - Id of campaign user want to like

`userId`(required) - Id of user

# Campaign Tier

## Adding tier

To add a tier , call the `PUT /api/v1/campaigns/{campaignId}/tiers` API with the following parameters:

`campaignId`(required) - Id of campaign

`data`(required)- data in format of pydantic model set as name Tiers in models/campaign

## Updating tier

To update a tier , call the `PUT /api/v1/campaigns/{campaignId}/tier/{tierId}` API with the following parameters:

`campaignId`(required) - Id of campaign

`tierId`(required) - Id of tier want to update

`data`- data in format of pydantic model set as name Tiers in models/campaign

## For getting campaign tier asset

To get campaign tier asset, call the `GET /api/v1/campaigns/{campaignId}/tiers/{tierId}/tier-asset` API with the following parameters:

`campaignId`(required) - Id of campaign

`tierId`(required) - Id of tier

## For posting campaign tier asset

To get campaign tier asset, call the `POST /api/v1/campaigns/{campaignId}/tiers/{tierId}/tier-asset ` API with the following parameters:

`campaignId`(required) - Id of campaign

`tierId`(required) - Id of tier

`file`(required) - select file to upload

## For deleting campaign tier asset

To delete campaign tier asset, call the `DELETE /api/v1/campaigns/{campaignId}/tiers/{tierId}/tier-asset ` API with the following parameters:

`campaignId`(required) - Id of campaign

`tierId`(required) - Id of tier

# Campaign Story

## For updating story data title

To update story data, call the `/api/v1/campaigns/{campaignId}/story/title ` API with the following parameters:

`campaignId`(required) - Id of campaign

`title`(optional) - title of story

## For posting faqs

To post faqs data, call the `POST /api/v1/campaigns/{campaignId}/story/faqs ` API with the following parameters:

`campaignId`(required) - Id of campaign

`data`(required) - data in format of list of pydantic model set as name Faq in models/campaign

## For listing faqs

To list all faqs data, call the `GET /api/v1/campaigns/{campaignId}/story/faqs` API with the following parameters:

`campaignId`(required) - Id of campaign

## For deleting faq

To delete faq data, call the `DELETE /api/v1/campaigns/{campaignId}/story/{faqId}` API with the following parameters:

`campaignId`(required) - Id of campaign

`faqId`(required) - Id of faq

## For update faq

To update faq data, call the `PUT /api/v1/campaigns/{campaignId}/story/{faqId}` API with the following parameters:

`campaignId`(required) - Id of campaign

`faqId`(required) - Id of faq

# Campaign Gcodes

## For Posting Gcodes Url

To Post gcodes url call the `POST /api/v1/user/{userId}/campaigns` API with the following parameters:

`userId`(required) - Id of user

`data`(required) - Data of Gcode Includes

- `tier`(required) - Id of Tier
- `url`(required) - Url for Gcode Stored in S3
- `fileName`(required):Name of gcode file

## For Getting Gcode Urls For tierId

To get gcode urls call the `POST /user/{userId}/gcodes/tiers/{tierId}` API with the following parameters:

`userId`(required) - Id of user

`fileName`(required):Name of gcode file
