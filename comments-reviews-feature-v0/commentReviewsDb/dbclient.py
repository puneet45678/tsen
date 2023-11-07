from pymongo import MongoClient
from config.read_yaml import config


mongodb_uri = (
    "mongodb+srv://"
    + config.mongodb["username"]
    + ":"
    + config.mongodb["password"]
    + "@cluster0.2nsop.mongodb.net/?retryWrites=true&w=majority"
)




class DBClient:
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            cls._client = MongoClient(mongodb_uri)
        return cls._client


client = DBClient.get_client()