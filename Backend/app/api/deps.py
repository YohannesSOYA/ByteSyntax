from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.config import settings
from app.models.database.python.admin import Admin
from app.services.auth_service import AuthService
from app.services.admin_service import AdminService
from app.repositories.admin_repository import AdminRepository
from app.services.email_service import EmailService
from app.models.schemas.response.auth_response import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_auth_service() -> AuthService:
    return AuthService()

def get_email_service() -> EmailService:
    return EmailService()

def get_admin_service(
    db: Session = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
) -> AdminService:
    repo = AdminRepository(db)
    return AdminService(repo, auth_service)

def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)],
    admin_service: AdminService = Depends(get_admin_service),
    auth_service: AuthService = Depends(get_auth_service)
) -> Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth_service.decode_access_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    admin = admin_service.get_admin_by_username(username=token_data.username)
    if admin is None:
        raise credentials_exception
    return admin
