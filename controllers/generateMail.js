import nodemailer from "nodemailer"


export const sendEmail = async (to, subject, html) => {
    try {
        // Create a Gmail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ID, // Replace with your Gmail ID
                pass: process.env.PASSWORD, // Use the App Password from Google
            },
        });

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to, // Recipient email(s)
            subject,
            html, // HTML body
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);

        // return info;
        return({message:"mail successfully sent",info:info})
    } catch (error) {
        console.error("Error sending email:", error);
        return ({ message: "Error occurred", info: error })

    }
};


