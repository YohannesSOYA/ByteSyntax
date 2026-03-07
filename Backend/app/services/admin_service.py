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
                             email: Optional[str] = None,
                             full_name: Optional[str] = None, 
                             password: Optional[str] = None) -> Admin:
        
        update_data = {}
        if username:
            existing = self.admin_repo.get_by_username(username)
            if existing and existing.id != admin_id:
                raise ConflictException(f"Username {username} is already taken.")
            update_data['username'] = username
        
        if email:
            existing = self.admin_repo.get_by_email(email)
            if existing and existing.id != admin_id:
                raise ConflictException(f"Email {email} is already in use.")
            update_data['email'] = email
            
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

    async def forgot_password(self, email: str) -> str:
        import secrets
        from datetime import datetime, timedelta
        from app.core.email import send_reset_password_email
        
        admin = self.admin_repo.get_by_email(email)
        if not admin:
            # We return a success message even if email not found for security
            return "reset_sent"
            
        token = secrets.token_urlsafe(32)
        expires = datetime.utcnow() + timedelta(hours=1)
        
        self.admin_repo.update(
            admin.id, 
            reset_token=token, 
            reset_token_expires=expires
        )
        
        # Send real email
        try:
            await send_reset_password_email(email, token)
        except Exception as e:
            # Fallback to console if email fails
            print(f"\n[ERROR] Failed to send email to {email}: {str(e)}")
            print(f"[DEBUG] Password Reset Link: http://localhost:5173/reset-password?token={token}\n")
        
        return "reset_sent"

    def reset_password(self, token: str, new_password: str) -> bool:
        from datetime import datetime
        
        admin = self.admin_repo.get_by_reset_token(token)
        if not admin:
            raise NotFoundException("Invalid or expired reset token.")
            
        if admin.reset_token_expires and admin.reset_token_expires < datetime.utcnow():
            raise ConflictException("Reset token has expired.")
            
        # Update password and clear token
        self.admin_repo.update(
            admin.id,
            password_hash=self.auth_service.hash_password(new_password),
            reset_token=None,
            reset_token_expires=None
        )
        
        return True
