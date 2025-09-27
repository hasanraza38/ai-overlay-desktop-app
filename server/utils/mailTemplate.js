export const generateEmailTemplate = (type, data) => {
    switch (type) {
        case "otp":
            return `
      <div style="font-family: Arial, sans-serif; background-color: #f7f4fa; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0px 6px 20px rgba(106, 13, 173, 0.15);">
          <h2 style="color: #6a0dad; text-align: center; margin-bottom: 15px;">AI-Overlay - Password Reset</h2>
          <p style="font-size: 15px; color: #444;">Hello,</p>
          <p style="font-size: 15px; color: #444;">
            We received a request to reset your password. Use the OTP below to continue:
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <span style="display: inline-block; background: linear-gradient(135deg, #6a0dad, #9b30ff); color: white; padding: 14px 28px; font-size: 24px; border-radius: 10px; letter-spacing: 4px; font-weight: bold;">
              ${data.otp}
            </span>
          </div>
          <p style="font-size: 13px; color: #666;">
            This OTP will expire in <strong>10 minutes</strong>. If this wasn’t you, please ignore this email.
          </p>
          <p style="font-size: 13px; color: #555; margin-top: 25px;">Best regards,<br><strong>AI-Overlay Team</strong></p>
        </div>
      </div>
      `;
        case "welcome":
            return `
  <div style="font-family: Arial, sans-serif; background-color: #f7f4fa; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(106,13,173,0.15);">
      <div style="background: linear-gradient(135deg, #6a0dad, #9b30ff); color: white; text-align: center; padding: 30px;">
        <h1 style="margin: 0; font-size: 26px;">✨ Welcome to AI-Overlay!</h1>
      </div>
      <div style="padding: 25px; text-align: center;">
        <h2 style="color: #6a0dad; margin-bottom: 10px;">Hello, ${data.name}!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">
          We’re thrilled to have you here</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">
          At <strong>AI-Overlay</strong>, we believe AI should enhance creativity and make life easier. Explore features, join the community, and start building smarter.
        </p>
       <div style="margin-top: 25px;">
  <a href="aioverlay://open" 
     style="background: linear-gradient(135deg, #6a0dad, #9b30ff); 
            color: white; 
            padding: 12px 25px; 
            border-radius: 6px; 
            text-decoration: none; 
            font-weight: bold;">
    Open AI Overlay
  </a>
</div>
      </div>
      <div style="background-color: #f7f4fa; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        You’re receiving this email because you signed up for AI-Overlay.<br>
        If you didn’t create this account, please ignore this message.
      </div>
    </div>
  </div>
  `;

        default:
            return `<p style="font-family: Arial; color: #666;">Invalid email type</p>`;
    }
};
