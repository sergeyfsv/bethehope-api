var service = require("./twilio");

module.exports = {
    sendMessage: service.sendMessage,
    sendWhatsApp: service.sendWhatsApp
};
