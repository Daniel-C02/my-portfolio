// We are using the Resend SDK.
import { Resend } from 'resend';

// Initialize Resend with the API key from Prod environment variables.
const resend = new Resend(process.env.RESEND_API_KEY);
const yourEmail = '02.christensendaniel@gmail.com';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Extract form data from the request body
        const { name, email, subject, message } = req.body;

        // Use the Resend SDK to send the email
        const { data, error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // This must be a verified domain in Resend
            to: [yourEmail],
            subject: `New Contact Form Submission. Subject: ${subject}`,
            reply_to: email, // Set the reply-to for easy responding
            html: `
                <p>You received a new message from your website's contact form.</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        // Handle potential errors from the Resend API
        if (error) {
            console.error('Resend API Error:', error);
            return res.status(500).json({ error: 'Error sending email.' });
        }

        // Send a success response
        return res.status(200).json({ success: true, message: 'Email sent successfully!', data });

    } catch (error) {
        // Handle unexpected server errors
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Something went wrong on our end.' });
    }
}
