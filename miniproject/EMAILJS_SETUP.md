# EmailJS Setup Guide

Follow these steps to get real OTP emails working in your app.
It's free and takes about 10 minutes.

---

## Step 1 — Create an EmailJS account

Go to https://www.emailjs.com and sign up for a free account.
The free tier gives you **200 emails/month**, which is plenty for a mini-project.

---

## Step 2 — Add an Email Service (connect Gmail)

1. In your EmailJS dashboard, click **Email Services → Add New Service**.
2. Choose **Gmail**.
3. Click **Connect Account** and sign in with the Gmail account you want to send OTPs from.
4. Give it a name (e.g. `my_gmail`) and click **Create Service**.
5. Copy the **Service ID** — you'll need it shortly.

---

## Step 3 — Create an Email Template

1. Go to **Email Templates → Create New Template**.
2. Set the **Subject** to something like:

   ```
   Your OTP Code: {{otp_code}}
   ```

3. Set the **Body** (HTML or plain text) to:

   ```
   Hello,

   Your one-time verification code is:

   {{otp_code}}

   This code expires in 10 minutes. Do not share it with anyone.

   If you didn't request this, ignore this email.
   ```

4. In the **To Email** field, type `{{to_email}}` — this is how EmailJS knows where to send it.
5. Click **Save**.
6. Copy the **Template ID**.

---

## Step 4 — Get your Public Key

1. Go to **Account → General**.
2. Copy your **Public Key**.

---

## Step 5 — Paste your credentials into the code

Open `OTPVerification.jsx` and replace the three placeholder values at the top:

```js
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'   // ← from Step 2
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // ← from Step 3
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'   // ← from Step 4
```

---

## Step 6 — Install EmailJS (not required — we use the REST API directly)

The updated `OTPVerification.jsx` calls the EmailJS REST API via `fetch`, so **no npm install is needed**. Your `package.json` stays unchanged.

---

## How the flow works now

1. User clicks **Edit** or **Delete** on a form card.
2. OTP screen appears and asks for an **email address**.
3. A 6-digit OTP is generated in the browser and emailed via EmailJS.
4. User enters the code → if correct, the action proceeds.
5. A **Resend** button appears after the 60-second timer runs out.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Failed to send email` error | Double-check your Service ID, Template ID, and Public Key |
| Email goes to spam | In Gmail, mark the sent email as "Not spam" once |
| Gmail asks to reconnect | Re-authorize the Gmail service in your EmailJS dashboard |
| Template variables not filling | Make sure your template uses `{{otp_code}}` and `{{to_email}}` exactly |
