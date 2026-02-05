from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.database.python.admin import Admin
from .base_repository import BaseRepository

class AdminRepository(BaseRepository):
    def get_by_id(self, admin_id: int) -> Admin | None:
        return self.db.get(Admin, admin_id)

    def get_by_username(self, username: str) -> Admin | None:
        query = select(Admin).where(Admin.username == username)
        return self.db.execute(query).scalar_one_or_none()

    def create(self, username: str, password_hash: str, full_name: str | None = None) -> Admin:
        admin = Admin(
            username=username,
            password_hash=password_hash,
            full_name=full_name
        )
        self.db.add(admin)
        self.db.commit()
        self.db.refresh(admin)
        return admin
    def update(self, admin_id: int, **kwargs) -> Admin | None:
        admin = self.get_by_id(admin_id)
        if admin:
            for key, value in kwargs.items():
                if hasattr(admin, key):
                    setattr(admin, key, value)
            self.db.commit()
            self.db.refresh(admin)
        return admin
