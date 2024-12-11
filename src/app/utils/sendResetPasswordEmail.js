const nodemailer = require('nodemailer')

const sendResetPasswordEmail = async (userEmail, token) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		const resetUrl = `http://localhost:4200/reset-password/${token}`;

		const mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: userEmail,
			subject: 'Password reset request',
			html: `<p>Click the link to reset your password:</p><a href=${resetUrl}>here</a>`
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ', info.response);
	} catch (error) {
		console.error('Error sending email: ', error)
	}
}

module.exports = sendResetPasswordEmail
