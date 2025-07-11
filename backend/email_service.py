import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, HtmlContent
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@yourdomain.com')
        self.from_name = os.getenv('SENDGRID_FROM_NAME', 'CRM System')
        
        if self.api_key:
            self.client = SendGridAPIClient(api_key=self.api_key)
            self.enabled = True
            logger.info("SendGrid email service initialized")
        else:
            self.enabled = False
            logger.warning("SendGrid API key not found. Email sending will be simulated.")
    
    def send_email(self, to_email: str, subject: str, html_content: str, 
                   text_content: Optional[str] = None, from_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Send an email using SendGrid
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email content
            text_content: Plain text content (optional)
            from_name: Sender name (optional)
        
        Returns:
            Dict with success status and message
        """
        if not self.enabled:
            # Simulate email sending for testing
            logger.info(f"SIMULATED EMAIL - To: {to_email}, Subject: {subject}")
            logger.info(f"SIMULATED EMAIL - Content: {html_content[:200]}...")
            return {
                "success": True,
                "message": "Email simulated (SendGrid not configured)",
                "email_id": "simulated"
            }
        
        try:
            # Create email message
            from_email = Email(self.from_email, from_name or self.from_name)
            to_email_obj = To(to_email)
            
            # Create content
            if text_content:
                content = Content("text/plain", text_content)
                html_content_obj = HtmlContent(html_content)
                mail = Mail(from_email, to_email_obj, subject, content)
                mail.add_content(html_content_obj)
            else:
                html_content_obj = HtmlContent(html_content)
                mail = Mail(from_email, to_email_obj, subject, html_content_obj)
            
            # Send email
            response = self.client.send(mail)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"Email sent successfully to {to_email}")
                return {
                    "success": True,
                    "message": "Email sent successfully",
                    "email_id": response.headers.get('X-Message-Id', 'unknown'),
                    "status_code": response.status_code
                }
            else:
                logger.error(f"Failed to send email: {response.status_code} - {response.body}")
                return {
                    "success": False,
                    "message": f"Failed to send email: {response.status_code}",
                    "status_code": response.status_code
                }
                
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return {
                "success": False,
                "message": f"Error sending email: {str(e)}"
            }
    
    def send_welcome_email(self, lead_data: Dict[str, Any], email_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send a welcome email to a new lead
        
        Args:
            lead_data: Lead information (name, email, etc.)
            email_config: Email configuration (subject, template, sender_name)
        
        Returns:
            Dict with email sending result
        """
        lead_name = lead_data.get('name', 'Valued Customer')
        lead_email = lead_data.get('email', '')
        
        if not lead_email:
            return {
                "success": False,
                "message": "No email address provided for lead"
            }
        
        # Get email configuration
        subject = email_config.get('emailSubject', 'Welcome to our CRM')
        template = email_config.get('emailTemplate', 'Thank you for your interest!')
        sender_name = email_config.get('senderName', 'CRM System')
        
        # Personalize template
        personalized_template = template.replace('[name]', lead_name)
        personalized_template = personalized_template.replace('[email]', lead_email)
        
        # Create HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h2 style="color: #007bff; margin-bottom: 20px;">{subject}</h2>
                <p>{personalized_template}</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                <p style="font-size: 12px; color: #6c757d;">
                    This email was sent automatically by our CRM system.<br>
                    If you have any questions, please contact us.
                </p>
            </div>
        </body>
        </html>
        """
        
        # Send the email
        return self.send_email(
            to_email=lead_email,
            subject=subject,
            html_content=html_content,
            from_name=sender_name
        )

# Create a singleton instance
email_service = EmailService() 