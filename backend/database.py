from pymongo import MongoClient
from config import Config

# Initialize the MongoDB client
client = MongoClient(Config.MONGO_URL)

# Get the database
db = client.cfyby
