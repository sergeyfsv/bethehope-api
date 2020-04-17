const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = (toEmail, message) => {
    const msg = {
        to: toEmail,
        from: 'contact@bethehope.fund',
        subject: 'Be The Hope in these tough times..',
        html: `<strong>${message}</strong>`,
    };

    return sgMail.send(msg);
}