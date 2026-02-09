from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from app.core.config import settings
from typing import Optional

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
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
        self.fm = FastMail(self.conf)

    async def send_parcel_arrival_email(self, email: str, student_name: str, tracking_number: str):
        html = f"""
        <html>
        <body>
            <p>Hi {student_name},</p>
            <p>Your parcel with tracking number <b>{tracking_number}</b> has arrived and is ready for collection at the counter.</p>
            <p>Please bring your ID for verification.</p>
            <br>
            <p>Thank you,<br>ByteSyntax Parcel Team</p>
        </body>
        </html>
        """
        
        message = MessageSchema(
            subject="Parcel Arrival Notification - ByteSyntax",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )
        
        await self.fm.send_message(message)
