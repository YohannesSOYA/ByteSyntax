from typing import Annotated, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.services.auth_service import AuthService
from app.services.admin_service import AdminService
from app.models.schemas.response.auth_response import Token
from app.core.exceptions import AuthException

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    admin_service: Annotated[AdminService, Depends(deps.get_admin_service)],
    auth_service: Annotated[AuthService, Depends(deps.get_auth_service)]
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    admin = admin_service.get_admin_by_username(form_data.username)
    if not admin:
         raise AuthException("Incorrect username or password")

    # Authentication check
    if not auth_service.verify_password(form_data.password, admin.password_hash):
         raise AuthException("Incorrect username or password")
         
    # Self-healing: If successfully logged in with plaintext, migrate to hash
    if not auth_service.is_bcrypt_hash(admin.password_hash):
        try:
            admin_service.update_admin_profile(
                admin_id=admin.id,
                password=form_data.password
            )
            print(f"Self-healing: Migrated plaintext password for admin '{admin.username}' to secure hash.")
        except Exception as e:
            print(f"Self-healing failed: {e}")
            # We don't fail the login if self-healing fails
            pass

    access_token = auth_service.create_access_token(
        data={"sub": admin.username}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
