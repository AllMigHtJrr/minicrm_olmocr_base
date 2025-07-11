# SendGrid Email Setup Guide

## Step 1: Create SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com)
2. Click "Start for Free"
3. Sign up with your email
4. Choose the **Free Plan** (100 emails/day)

## Step 2: Get API Key

1. After signing up, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Choose **Full Access** or **Restricted Access** (Mail Send)
4. Copy the API key (starts with `SG.`)

## Step 3: Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - **From Name**: Your name or company name
   - **From Email**: Your email address
   - **Reply To**: Your email address
4. Click **Create**
5. Check your email and click the verification link

## Step 4: Configure Environment Variables

Create a `.env` file in the backend directory:

```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@domain.com
SENDGRID_FROM_NAME=Your Company Name
```

## Step 5: Install SendGrid

```bash
cd backend
pip install sendgrid==6.10.0
```

## Step 6: Test Email Sending

1. Start your backend server
2. Create a workflow with email action
3. Create a new lead to trigger the workflow
4. Check the backend logs for email status

## Troubleshooting

### Email Not Sending
- Check API key is correct
- Verify sender email is authenticated
- Check SendGrid dashboard for delivery status

### API Key Issues
- Make sure API key has "Mail Send" permissions
- Regenerate API key if needed

### Sender Authentication
- Must verify sender email before sending
- Can take up to 24 hours for verification

## Free Tier Limits

- **100 emails per day** (3,000/month)
- **1,000 contacts** in contact list
- **Basic email templates**
- **Standard support**

## Alternative Setup (No SendGrid)

If you don't want to set up SendGrid, the system will automatically simulate email sending:

```
INFO:__main__:SIMULATED EMAIL - To: john@example.com, Subject: Welcome to our CRM
```

This allows you to test workflows without email configuration. 