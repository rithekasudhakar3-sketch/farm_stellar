# fetch_all_quests.py

from pymongo import MongoClient
import json

MONGO_URI = "YOUR_MONGO_URI"

client = MongoClient(MONGO_URI)
db = client["farm"]              # change to your DB name
collection = db["quest"]

try:
    quests = list(collection.find({}))
    print("Total Quests:", len(quests))
    print(json.dumps(quests, default=str, indent=2))
except Exception as e:
    print("Error:", e)
finally:
    client.close()
