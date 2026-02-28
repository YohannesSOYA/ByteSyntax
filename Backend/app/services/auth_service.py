from datetime import datetime, timedelta
from typing import Optional, Any, Dict
import bcrypt
from jose import jwt
from app.core.config import settings
from app.core.exceptions import AuthException

class AuthService:
    def hash_password(self, password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def is_bcrypt_hash(self, password: str) -> bool:
        """Checks if a string looks like a bcrypt hash."""
        return password.startswith('$2') and len(password) >= 50

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verifies a password against a hash. 
        Supports a plaintext fallback for manual database insertions.
        """
        # If it looks like a hash, verify it normally
        if self.is_bcrypt_hash(hashed_password):
            try:
                return bcrypt.checkpw(
                    plain_password.encode('utf-8'), 
                    hashed_password.encode('utf-8')
                )
            except Exception:
                return False
        
        # Fallback: Plaintext comparison (useful for manual SQL inserts)
        return plain_password == hashed_password

    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def decode_access_token(self, token: str) -> Dict[str, Any]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except jwt.JWTError:
            raise AuthException(message="Could not validate credentials")
