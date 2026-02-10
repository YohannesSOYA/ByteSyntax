import os
import uuid
import shutil
from fastapi import UploadFile
from app.core.config import settings

class UploadService:
    def __init__(self):
        # We use absolute path to ensure it works from any execution context
        self.upload_dir = os.path.join(os.getcwd(), "uploads")
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)

    async def save_parcel_photo(self, file: UploadFile) -> str:
        # Create unique filename to avoid collisions
        extension = os.path.splitext(file.filename)[1].lower()
        if not extension:
            extension = ".jpg" # Default if no extension
            
        filename = f"{uuid.uuid4()}{extension}"
        file_path = os.path.join(self.upload_dir, filename)
        
        # Save file to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the URL path
        return f"/uploads/{filename}"
