// app/api/mail/route.js
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const formData = await req.json();

        // Create transporter with updated configuration
        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, // Changed to false for port 587
            requireTLS: true, // Added to force TLS
            auth: {
                user: "staff@festivepros.co",
                pass: "P3nus@!nutsack_",
            },
            tls: {
                minVersion: 'TLSv1.2',
                ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
            }
        });

        // Verify the connection configuration
        await transporter.verify();

        // Format the email content
        const productInfo = formData.product ? `
            <h3>Product Details:</h3>
            <p>Name: ${formData.product.name}</p>
            <p>Price: $${formData.product.price}</p>
        ` : '';

        const emailContent = `
            <h2>New Product Inquiry</h2>
            <h3>Customer Information:</h3>
            <p>Name: ${formData.firstName} ${formData.lastName}</p>
            <p>Email: ${formData.email}</p>
            <p>Phone: ${formData.phoneNumber || 'Not provided'}</p>
            <p>Preferred Contact: ${formData.preferredContact}</p>
            <p>State: ${formData.state}</p>
            <h3>Message:</h3>
            <p>${formData.message}</p>
            ${productInfo}
        `;

        // Email options
        const mailOptions = {
            from: "staff@festivepros.co",
            to: "staff@festivepros.co",
            subject: 'New Product Inquiry',
            html: emailContent,
            replyTo: formData.email,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Email error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to send email',
            details: error.message  // Added to provide more detailed error information
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}