const nodemailer = require('nodemailer');

const sendVerificationEmail = async (userEmail, token) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		const verificationUrl = `http://localhost:4200/register/account-confirmation/${token}`;

		const mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: userEmail,
			subject: 'Account Verification',
			html: `<p>Click the link to verify your account:</p><a href=${verificationUrl}>here</a>`
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ', info.response);
	} catch (error) {
		console.error('Error sending email: ', error);
	}
};

module.exports = sendVerificationEmail;
