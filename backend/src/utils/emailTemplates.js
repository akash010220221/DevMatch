/**
 * Email Templates for devMatch Notifications
 * Professional, Developer-centric CSS-inlined HTML
 */

const OTP_TEMPLATE = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; color: #333; }
        .logo { font-size: 28px; font-weight: 900; color: #641ae6; margin-bottom: 24px; letter-spacing: -1px; }
        .hero { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #1a1a1a; }
        .text { font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 32px; }
        .otp-container { background: #f9fafb; border: 2px dashed #641ae6; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 32px; }
        .otp-code { font-size: 42px; font-weight: 900; color: #641ae6; letter-spacing: 8px; }
        .footer { font-size: 12px; color: #999; border-top: 1px solid #f0f0f0; padding-top: 24px; }
        .pulse { display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">dm <span style="font-weight: 300; font-style: italic; color: #999; font-size: 14px;">devMatch</span></div>
        <div class="hero">Identify yourself, ${name}.</div>
        <p class="text">Welcome to the elite developer circle. To finalize your access to the professional discovery engine, please use the following one-time password:</p>
        
        <div class="otp-container">
            <div class="otp-code">${otp}</div>
        </div>

        <p class="text" style="font-size: 14px;">This key expires in 10 minutes. If you didn't initiate this request, someone might be eyeing your talent. Change your credentials immediately.</p>
        
        <div class="footer">
            <p><span class="pulse"></span> System: Connection established via Secure Node Engine.</p>
            <p>&copy; 2026 devMatch Platform. Built for the builders.</p>
        </div>
    </div>
</body>
</html>
`;

const PASSWORD_RESET_TEMPLATE = (resetLink) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; }
        .logo { font-size: 28px; font-weight: 900; color: #641ae6; margin-bottom: 24px; letter-spacing: -1px; }
        .hero { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #1a1a1a; }
        .text { font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 32px; }
        .btn { display: inline-block; background: #641ae6; color: #ffffff !important; font-weight: 700; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(100, 26, 230, 0.2); }
        .footer { font-size: 12px; color: #999; border-top: 1px solid #f0f0f0; padding-top: 24px; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">dm</div>
        <div class="hero">Secure Password Reset.</div>
        <p class="text">We received a request to override your security credentials. If this was you, click the button below to re-enter the mainframe.</p>
        
        <div style="text-align: center;">
            <a href="${resetLink}" class="btn">Reset My Credentials</a>
        </div>

        <p class="text" style="font-size: 14px; margin-top: 32px;">This link is volatile and will expire in 15 minutes. To maintain system integrity, it can only be used once.</p>
        
        <div class="footer">
            <p>If you did not request a reset, ignore this email. Your current password will remain encrypted and unchanged.</p>
            <p>&copy; 2026 devMatch Platform.</p>
        </div>
    </div>
</body>
</html>
`;

export {
    OTP_TEMPLATE,
    PASSWORD_RESET_TEMPLATE
};
