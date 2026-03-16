import nodemailer from 'nodemailer';

const ALLOWED_FORM_ID = '9144706'; // Aerial Waiver Collection Form

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // Only process submissions from the Aerial Waiver Collection Form
    const formId = String(payload?.form?.id || payload?.form_id || '');
    if (formId && formId !== ALLOWED_FORM_ID) {
      console.log(`Ignored submission from form ID: ${formId}`);
      return res.status(200).json({ success: true, message: 'Form not monitored, skipped' });
    }

    // Kit webhook payload structure
    const subscriberName = payload?.subscriber?.first_name || 'Someone';
    const subscriberEmail = payload?.subscriber?.email_address || 'unknown';
    const formName = payload?.form?.name || payload?.form_name || 'Aerial Waiver Collection Form';
    const subscribedAt = payload?.subscriber?.created_at
      ? new Date(payload.subscriber.created_at).toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      : new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    // Set up Gmail transporter using env vars
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Aerial Fun & Fitness Alerts" <${process.env.GMAIL_USER}>`,
      to: 'zina@zinaditonno.com',
      subject: `New Waiver Submission: ${subscriberName} just signed up!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🎉 New Waiver Submission</h1>
            <p style="color: #aaa; margin: 5px 0 0;">Aerial Fun & Fitness</p>
          </div>
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; color: #666; font-weight: bold; width: 40%;">Name</td>
                <td style="padding: 10px; color: #333;">${subscriberName}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td style="padding: 10px; color: #666; font-weight: bold;">Email</td>
                <td style="padding: 10px; color: #333;">${subscriberEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: #666; font-weight: bold;">Form</td>
                <td style="padding: 10px; color: #333;">${formName}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td style="padding: 10px; color: #666; font-weight: bold;">Submitted At</td>
                <td style="padding: 10px; color: #333;">${subscribedAt} (Manila time)</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #f0f7ff; border-radius: 6px; border-left: 4px solid #0066cc;">
              <p style="margin: 0; color: #0066cc; font-size: 14px;">
                Log in to <a href="https://app.kit.com" style="color: #0066cc;">Kit</a> to view and manage your subscribers.
              </p>
            </div>
          </div>
          <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 15px;">
            Automated alert via Aerial Fun & Fitness Kit Notifier
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Notification sent for ${subscriberEmail}`);
    return res.status(200).json({ success: true, message: 'Notification sent' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
