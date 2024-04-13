const { Resend } = require("resend");
const instanceResend = new Resend(process.env.KEY_RESEND);
instanceResend.domains.create({ name: 'gmail.com' });


const sendEmail = async function (mailRecipient,mailSubject,verificationLink) {
  try {
    const { data, error } = await instanceResend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [mailRecipient],
      subject: mailSubject,
      html: `<p>${mailSubject}:</p>
            <a href="${verificationLink}">${verificationLink}</a>`
    });

    if (error) {
      throw new Error(error.message); // Throw error to be caught by the catch block
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    // Handle the error further if needed (e.g., log to file, send notification)
  }
};

module.exports = sendEmail;

// Example usage:
// sendEmail('recipient@example.com');
