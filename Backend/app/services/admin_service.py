from typing import Optional
from app.repositories.admin_repository import AdminRepository
from app.models.database.python.admin import Admin
from app.core.exceptions import NotFoundException, ConflictException
from app.services.auth_service import AuthService

class AdminService:
    def __init__(self, admin_repo: AdminRepository, auth_service: AuthService):
        self.admin_repo = admin_repo
        self.auth_service = auth_service

    def get_admin_by_username(self, username: str) -> Admin:
        admin = self.admin_repo.get_by_username(username)
        if not admin:
            raise NotFoundException(f"Admin with username {username} not found.")
        return admin

    def get_admin_by_id(self, admin_id: int) -> Admin:
        admin = self.admin_repo.get_by_id(admin_id)
        if not admin:
            raise NotFoundException(f"Admin with id {admin_id} not found.")
        return admin

    def update_admin_profile(self, 
                             admin_id: int, 
                             username: Optional[str] = None, 
                             full_name: Optional[str] = None, 
                             password: Optional[str] = None) -> Admin:
        
        update_data = {}
        if username:
            existing = self.admin_repo.get_by_username(username)
            if existing and existing.id != admin_id:
                raise ConflictException(f"Username {username} is already taken.")
            update_data['username'] = username
        
        if full_name:
            update_data['full_name'] = full_name
            
        if password:
            update_data['password_hash'] = self.auth_service.hash_password(password)
            
        if not update_data:
            return self.get_admin_by_id(admin_id)

        admin = self.admin_repo.update(admin_id, **update_data)
        if not admin:
             raise NotFoundException(f"Admin with id {admin_id} not found.")
        return admin
