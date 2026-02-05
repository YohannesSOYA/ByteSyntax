from typing import Any, Dict, Optional

class AppException(Exception):
    """Base exception for the application."""
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        detail: Optional[Any] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.detail = detail

class NotFoundException(AppException):
    """Exception raised when a resource is not found."""
    def __init__(self, message: str = "Resource not found", detail: Optional[Any] = None):
        super().__init__(message, status_code=404, detail=detail)

class ConflictException(AppException):
    """Exception raised when there is a conflict (e.g. duplicate record)."""
    def __init__(self, message: str = "Resource already exists", detail: Optional[Any] = None):
        super().__init__(message, status_code=409, detail=detail)

class AuthException(AppException):
    """Exception raised for authentication/authorization errors."""
    def __init__(self, message: str = "Authentication failed", detail: Optional[Any] = None):
        super().__init__(message, status_code=401, detail=detail)

class ValidationException(AppException):
    """Exception raised for data validation errors."""
    def __init__(self, message: str = "Validation failed", detail: Optional[Any] = None):
        super().__init__(message, status_code=422, detail=detail)
