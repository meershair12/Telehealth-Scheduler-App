const { transporter, companyEmails } = require("./mailer");



async function sendOTPEmail(to, otp, userName = 'User') {
    const subject = 'Your verification code - Telehealth Scheduler';

    const text = `
Hi ${userName},

Your verification code is: ${otp}

This code expires in 10 minutes.

If you didn't request this code, please ignore this email or contact our support team.

Best regards,
Telehealth Scheduler Team
Personic Health

© ${new Date().getFullYear()} Personic Health. All rights reserved.
  `;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f7fb;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f7fb;">
    <tr>
      <td align="center" style="padding: 50px 20px;">
        
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 50px 50px 40px 50px; text-align: center; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="https://personichealth.com/wp-content/uploads/2024/04/Personic-Health-logo.png" alt="Personic Health Logo" style="max-width: 160px; height: auto; display: block; margin: 0 auto 30px auto;" />
                  </td>
                </tr>
              
                <tr>
                  <td align="center">
                    <h1 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 400; color: #323338; letter-spacing: -0.5px;">Verify your identity</h1>
                    <p style="margin: 0; font-size: 16px; color: #676879; line-height: 24px; font-weight: 300;">
                      Use the code below to complete your sign-in
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 50px 40px 50px;">
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #323338; line-height: 26px; text-align: center;">
                Hi <strong>${userName}</strong>, here's your verification code:
              </p>

              <!-- OTP Display Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 30px 0;">
                <tr>
                  <td align="center" style="padding: 40px 30px; background-color: #f6f7fb; border: 2px solid #e6e9ef; border-radius: 12px;">
                    <p style="margin: 0 0 15px 0; font-size: 12px; color: #9699a6; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                      Your Code
                    </p>
                    <p style="margin: 0; font-size: 38px; font-weight: 800; color: #414141; font-family: 'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace; letter-spacing: 8px;">
                      ${otp}
                    </p>
                    <p style="margin: 20px 0 0 0; font-size: 13px; color: #9699a6;">
                      Expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                <tr>
                  <td style="border-top: 1px solid #e6e9ef;"></td>
                </tr>
              </table>

              <!-- Security Tips -->
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #323338; font-weight: 500;">
                Keep your account safe
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #f5f6f8;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" valign="top">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" valign="middle" style="width: 32px; height: 32px; background-color: #fdab3d; border-radius: 8px; font-size: 18px; line-height: 32px;">
                                🔒
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top" style="padding-left: 15px;">
                          <p style="margin: 0 0 5px 0; font-size: 15px; color: #323338; font-weight: 500;">Never share this code</p>
                          <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">Our team will never ask for your verification code</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" valign="top">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" valign="middle" style="width: 32px; height: 32px; background-color: #ff6161; border-radius: 8px; font-size: 18px; line-height: 32px;">
                                ⚡
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top" style="padding-left: 15px;">
                          <p style="margin: 0 0 5px 0; font-size: 15px; color: #323338; font-weight: 500;">Didn't request this?</p>
                          <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">Contact our support team immediately to secure your account</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Support Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0 0 0;">
                <tr>
                  <td style="padding: 25px; background-color: #f6f7fb; border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #323338; font-weight: 500;">Need help?</p>
                    <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">
                      Reach out at <a href="mailto:${companyEmails.support}" style="color: #6161ff; text-decoration: none; font-weight: 500;">${companyEmails.support}</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 50px; background-color: #f6f7fb; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #323338;">
                Telehealth Scheduler by Personic Health
              </p>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #9699a6;">
                This is an automated security message
              </p>
              <p style="margin: 0; font-size: 12px; color: #c5c7d0;">
                © ${new Date().getFullYear()} Personic Health. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;

    try {
        const info = await transporter.sendMail({
            from: `"Personic Health - Telehealth Scheduler" <no-reply@mshair.dev>`,
            to,
            subject,
            text,
            html,
        });
        console.log("✅ OTP Email sent successfully: ", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending OTP email: ", error);
        return { success: false, error: error.message };
    }
}

async function sendWelcomeEmail(to, user, setupLink) {
    const subject = 'Welcome to Telehealth Scheduler - Complete Your Account Setup';

    const text = `
Dear ${user.firstName} ${user.lastName},

Welcome to Telehealth Scheduler by Personic Health!

Your account has been successfully created. To access your account, please set up your password by clicking the link below:

${setupLink}

This link will expire in 24 hours for security reasons.

Once you set your password, you'll be able to access all features of our platform.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
Telehealth Scheduler Team
Personic Health

© ${new Date().getFullYear()} Personic Health. All rights reserved.
  `;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Telehealth Scheduler</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f7fb;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f7fb;">
    <tr>
      <td align="center" style="padding: 50px 20px;">
        
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 50px 50px 40px 50px; text-align: center; background-color: #ffffff;">
              <img src="https://personichealth.com/wp-content/uploads/2024/04/Personic-Health-logo.png" alt="Personic Health Logo" style="max-width: 160px; height: auto; display: block; margin: 0 auto 30px auto;" />
              <h1 style="margin: 0 0 15px 0; font-size: 32px; font-weight: 400; color: #323338; letter-spacing: -0.5px;">You're in! 👋</h1>
              <p style="margin: 0; font-size: 18px; color: #676879; line-height: 28px; font-weight: 300;">
                Welcome to Telehealth Scheduler
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 50px 40px 50px;">
              <p style="margin: 0 0 25px 0; font-size: 16px; color: #323338; line-height: 26px;">
                Hi <strong>${user.firstName} ${user.lastName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #323338; line-height: 26px;">
                We're excited to have you on board! Telehealth Scheduler makes it incredibly easy to manage appointments with real-time doctor availability.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0;">
                <tr>
                  <td align="center">
                    <a href="${setupLink}" style="display: inline-block; padding: 18px 45px; background: #74B87B; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500; box-shadow: 0 4px 12px rgba(97, 255, 118, 0.3);">
                      Accept invitation →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 15px;">
                    <p style="margin: 0; font-size: 13px; color: #9699a6;">
                      This link expires in 24 hours
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="margin: 45px 0 40px 0; border-top: 1px solid #e6e9ef;"></div>

              <!-- Features Section -->
              <p style="margin: 0 0 25px 0; font-size: 18px; color: #323338; font-weight: 500;">
                What you can do:
              </p>

              <!-- Feature Items -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #f5f6f8;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #6161ff 0%, #5a5aff 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 18px;">📅</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; padding-left: 15px;">
                          <p style="margin: 0 0 5px 0; font-size: 16px; color: #323338; font-weight: 500;">Schedule in seconds</p>
                          <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">Book appointments instantly without the back-and-forth</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #f5f6f8;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #00ca72 0%, #00b86b 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 18px;">🔄</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; padding-left: 15px;">
                          <p style="margin: 0 0 5px 0; font-size: 16px; color: #323338; font-weight: 500;">Real-time updates</p>
                          <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">See live doctor availability and never miss an opening</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #f5f6f8;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ff6161 0%, #ff5a5a 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 18px;">📊</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; padding-left: 15px;">
                          <p style="margin: 0 0 5px 0; font-size: 16px; color: #323338; font-weight: 500;">Track everything</p>
                          <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">Manage all your appointments in one clean dashboard</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #fdab3d 0%, #fc9a2a 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 18px;">💬</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; padding-left: 15px;">
                          <p style="margin: 0 0 5px 0; font-size: 16px; color: #323338; font-weight: 500;">Get support 24/7</p>
                          <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">Our team is always here to help you succeed</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Bottom Note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0 0 0;">
                <tr>
                  <td style="padding: 25px; background-color: #f6f7fb; border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #323338; font-weight: 500;">Need help getting started?</p>
                    <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">
                      Reach out to us at <a href="mailto:${companyEmails.support}" style="color: #6161ff; text-decoration: none; font-weight: 500;">${companyEmails.support}</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 50px; background-color: #f6f7fb; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #323338;">
                Personic Health
              </p>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #9699a6;">
                Streamlining healthcare, one appointment at a time
              </p>
              <p style="margin: 0; font-size: 12px; color: #c5c7d0;">
                © ${new Date().getFullYear()} Personic Health. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;

    try {
        const info = await transporter.sendMail({
            from: `"Personic Health - Telehealth Scheduler" <no-reply@mshair.dev>`,
            to,
            subject,
            text,
            html,
        });
        console.log("✅ Welcome Email sent successfully: ", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending Welcome email: ", error);
        return { success: false, error: error.message };
    }
}

async function sendPasswordResetEmail(to, resetLink, userName = 'User') {
    const subject = 'Reset your password - Telehealth Scheduler';

    const text = `
Hi ${userName},

We received a request to reset your password for your Telehealth Scheduler account.

Click the link below to create a new password:
${resetLink}

This link expires in 1 hour for security reasons.

If you didn't request this, you can safely ignore this email.

Best regards,
Telehealth Scheduler Team
Personic Health

© ${new Date().getFullYear()} Personic Health. All rights reserved.
  `;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f7fb;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f7fb;">
    <tr>
      <td align="center" style="padding: 50px 20px;">
        
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 50px 50px 40px 50px; text-align: center; background-color: #ffffff;">
              <img src="https://personichealth.com/wp-content/uploads/2024/04/Personic-Health-logo.png" alt="Personic Health Logo" style="max-width: 160px; height: auto; display: block; margin: 0 auto 30px auto;" />
             
          

              
              <h1 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 400; color: #323338; letter-spacing: -0.5px;">Reset your password</h1>
              <p style="margin: 0; font-size: 16px; color: #676879; line-height: 24px; font-weight: 300;">
                Let's get you back into your account
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 50px 40px 50px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #323338; line-height: 26px;">
                Hi <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #323338; line-height: 26px;">
                We received a request to reset your password. Click the button below to choose a new one.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg,    #75B97C 0%, #75B97C 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500; box-shadow: 0 4px 12px rgba(97, 97, 255, 0.3);">
                      Reset my password →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <p style="margin: 0; font-size: 13px; color: #9699a6;">
                      This link expires in 1 hour
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <p style="margin: 30px 0 12px 0; font-size: 13px; color: #9699a6; line-height: 20px;">
                Or copy and paste this link:
              </p>
              
              <div style="padding: 16px; background-color: #f6f7fb; border-radius: 8px; word-break: break-all;">
                <a href="${resetLink}" style="font-size: 13px; color: #6161ff; text-decoration: none; word-break: break-all;">
                  ${resetLink}
                </a>
              </div>

              <!-- Divider -->
              <div style="margin: 40px 0; border-top: 1px solid #e6e9ef;"></div>

              <!-- Security Info -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 25px; background-color: #fff4e6; border-radius: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #fdab3d 0%, #fc9a2a 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 18px;">⚡</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; padding-left: 15px;">
                          <p style="margin: 0 0 8px 0; font-size: 15px; color: #323338; font-weight: 500;">Didn't request this?</p>
                          <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">No worries! You can safely ignore this email. Your password won't change unless you click the button above.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Additional Help -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0 0 0;">
                <tr>
                  <td style="padding: 25px; background-color: #f6f7fb; border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 15px; color: #323338; font-weight: 500;">Need help?</p>
                    <p style="margin: 0; font-size: 14px; color: #676879; line-height: 22px;">
                      Contact our support team at <a href="mailto:${companyEmails.support}" style="color: #6161ff; text-decoration: none; font-weight: 500;">${companyEmails.support}</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 50px; background-color: #f6f7fb; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #323338;">
                Telehealth Scheduler by Personic Health
              </p>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #9699a6;">
                This is an automated email, please don't reply
              </p>
              <p style="margin: 0; font-size: 12px; color: #c5c7d0;">
                © ${new Date().getFullYear()} Personic Health. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;

    try {
        const info = await transporter.sendMail({
            from: `"Personic Health - Telehealth Scheduler" <no-reply@mshair.dev>`,
            to,
            subject,
            text,
            html,
        });
        console.log("✅ Password Reset Email sent successfully: ", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending Password Reset email: ", error);
        return { success: false, error: error.message };
    }
}



module.exports = {sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail}