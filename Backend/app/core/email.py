from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from pathlib import Path

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS
)

async def send_reset_password_email(email_to: str, token: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    html = f"""
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eef2f6; border-radius: 24px; background: #fff;">
        <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Click the button below to reset your ByteSyntax account password. This link will expire in 1 hour.</p>
        <a href="{reset_link}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px;">Reset Password</a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; border-top: 1px solid #f1f5f9; pt: 16px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
    """

    message = MessageSchema(
        subject="ByteSyntax - Password Reset Request",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
