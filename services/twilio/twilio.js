const twilio = require("twilio");
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendMessage = (toPhoneNumber, message) => {

    console.log(toPhoneNumber)
    return client.messages.create({
        body: message,
        from: `+1${process.env.TWILIO_PHONE_NUMBER}`,
        to: `${toPhoneNumber}`
    })
}

exports.sendWhatsApp = (toPhoneNumber, message) => {
    return client.messages
        .create({
            from: `whatsapp:+1${process.env.TWILIO_WHATSAPP_NUMBER}`,
            body: message,
            to: `whatsapp:${toPhoneNumber}`
        })
}