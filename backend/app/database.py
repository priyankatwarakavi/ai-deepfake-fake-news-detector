import os
import json
import uuid
from datetime import datetime
from pymongo import MongoClient
from app.config import settings

# Helper for JSON serialization of datetime and UUID
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, uuid.UUID):
            return str(obj)
        return super().default(obj)

class MockCollection:
    def __init__(self, name: str, filepath: str):
        self.name = name
        self.filepath = filepath
        self._ensure_file()

    def _ensure_file(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        if not os.path.exists(self.filepath):
            with open(self.filepath, 'w') as f:
                json.dump([], f)

    def _read_data(self):
        try:
            with open(self.filepath, 'r') as f:
                data = json.load(f)
                # Convert date strings back to datetime in records
                for doc in data:
                    for k, v in doc.items():
                        if isinstance(v, str) and (v.endswith('Z') or 'T' in v):
                            try:
                                # Simple isoformat parse
                                doc[k] = datetime.fromisoformat(v.replace('Z', '+00:00'))
                            except ValueError:
                                pass
                return data
        except Exception:
            return []

    def _write_data(self, data):
        with open(self.filepath, 'w') as f:
            json.dump(data, f, cls=CustomJSONEncoder, indent=2)

    def find_one(self, filter_query):
        data = self._read_data()
        for doc in data:
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    def find(self, filter_query=None):
        data = self._read_data()
        if not filter_query:
            return data
        results = []
        for doc in data:
            match = True
            for k, v in filter_query.items():
                # Support simple list search (e.g. key: {"$in": [...]})
                if isinstance(v, dict) and "$in" in v:
                    if doc.get(k) not in v["$in"]:
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc)
        return results

    def insert_one(self, document):
        data = self._read_data()
        doc_copy = dict(document)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        # Ensure timestamp fields are serialized/deserialized properly
        data.append(doc_copy)
        self._write_data(data)
        
        class InsertOneResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertOneResult(doc_copy["_id"])

    def update_one(self, filter_query, update_data):
        data = self._read_data()
        modified = 0
        for doc in data:
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                # Apply updates
                if "$set" in update_data:
                    for uk, uv in update_data["$set"].items():
                        doc[uk] = uv
                else:
                    for uk, uv in update_data.items():
                        doc[uk] = uv
                modified = 1
                break
        if modified:
            self._write_data(data)
        
        class UpdateResult:
            def __init__(self, modified_count):
                self.modified_count = modified_count
        return UpdateResult(modified)

    def delete_one(self, filter_query):
        data = self._read_data()
        idx_to_remove = -1
        for idx, doc in enumerate(data):
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                idx_to_remove = idx
                break
        deleted_count = 0
        if idx_to_remove != -1:
            data.pop(idx_to_remove)
            self._write_data(data)
            deleted_count = 1
            
        class DeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        return DeleteResult(deleted_count)

    def count_documents(self, filter_query=None):
        return len(self.find(filter_query))

class MockDatabase:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.collections = {}

    def __getitem__(self, name: str) -> MockCollection:
        if name not in self.collections:
            filepath = os.path.join(self.data_dir, f"{name}.json")
            self.collections[name] = MockCollection(name, filepath)
        return self.collections[name]

# Initialize Database connection
db_client = None
db = None
is_mock = True

if settings.MONGODB_URL:
    try:
        db_client = MongoClient(settings.MONGODB_URL)
        db = db_client[settings.DATABASE_NAME]
        # Ping
        db_client.admin.command('ping')
        is_mock = False
        print("Connected successfully to MongoDB Atlas!")
    except Exception as e:
        print(f"MongoDB Atlas connection failed: {e}. Falling back to Mock Database.")
        
if is_mock:
    mock_data_dir = r"C:\Users\PRIYANKA\.gemini\antigravity\scratch\ai-deepfake-fake-news-detector\backend\data"
    db = MockDatabase(mock_data_dir)
    print(f"Using Mock Database at: {mock_data_dir}")

def get_db():
    return db
