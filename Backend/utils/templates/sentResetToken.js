function sentResetToken(userData) {
  return `
       <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Request</title>
        </head>

        <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center;">

            <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333333;">Password Reset Request</h1>
                <p style="color: #555555; margin-bottom: 20px;">You are receiving this email because you requested a password reset.</p>
                <p style="color: #555555; margin-bottom: 20px;">Copy the code below to reset your password:</p>
                <div style="position: relative;">
                    <code id="resetCode" style="background-color: #f0f0f0; padding: 5px; border-radius: 4px; font-family: 'Courier New', monospace;">${userData.resetCode}</code>
                </div>
                <p style="color: #555555; margin-top: 20px;">This token is only applicable for the next 2 hours.</p>
                <p style="color: #555555; margin-top: 20px;">If you didn't request this password reset, please ignore this email or contact support.</p>
                <p style="color: #555555;">Thank you!</p>
                <p style="color: #555555; margin-top: 20px;"><em>Best regards,<br>${userData.companyName}</em></p>
            </div>

        </body>

        </html>
    `;
}

module.exports = sentResetToken;
