import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "devMatch <no-reply@support.akashtech.in>", // Use your verified domain
            to: email,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Resend delivery failed:", error);
            throw error;
        }

        console.log("Email sent successfully via Resend:", data.id);
    } catch (error) {
        console.error("Email sending exception:", error);
        throw error;
    }
};

export default sendEmail;
