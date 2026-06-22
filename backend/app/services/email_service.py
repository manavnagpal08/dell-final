import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from app.core.logging import logger

class EmailService:
    @staticmethod
    def send_alert_email(title: str, description: str, severity: str, device_id: str):
        sender_email = os.getenv("SMTP_EMAIL")
        sender_password = os.getenv("SMTP_PASSWORD")
        receiver_email = os.getenv("ADMIN_EMAIL", sender_email) # Send to admin, default to self

        if not sender_email or not sender_password:
            logger.warning("SMTP credentials not configured. Skipping email alert.")
            return

        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = f"[{severity.upper()}] VyomAi Alert: {title}"
            message["From"] = sender_email
            message["To"] = receiver_email

            text = f"""
            VyomAi Alert
            
            Severity: {severity}
            Device: {device_id}
            Issue: {title}
            
            Details:
            {description}
            
            Please log into the VyomAi Dashboard to take immediate action.
            """
            
            html = f"""
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  <div style="background-color: {'#ef4444' if severity == 'Critical' else '#f59e0b'}; padding: 20px; text-align: center;">
                    <h2 style="color: white; margin: 0;">VyomAi Automated Alert</h2>
                  </div>
                  <div style="padding: 20px;">
                    <p><strong>Severity:</strong> <span style="color: {'#ef4444' if severity == 'Critical' else '#f59e0b'};">{severity}</span></p>
                    <p><strong>Device ID:</strong> {device_id}</p>
                    <p><strong>Issue:</strong> {title}</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p><strong>Details:</strong></p>
                    <p>{description}</p>
                    <p style="margin-top: 30px;">Please log into the <a href="https://vyom-ai-frontend.vercel.app">VyomAi Dashboard</a> to take immediate action.</p>
                  </div>
                </div>
              </body>
            </html>
            """

            part1 = MIMEText(text, "plain")
            part2 = MIMEText(html, "html")

            message.attach(part1)
            message.attach(part2)

            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, receiver_email, message.as_string())
            
            logger.info(f"Successfully sent alert email to {receiver_email} for device {device_id}")
            
        except Exception as e:
            logger.error(f"Failed to send email alert: {e}")

