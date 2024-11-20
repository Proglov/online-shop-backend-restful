require('dotenv').config();

const api = process.env.TelegramBot_API


const sendNotification = async (obj) => {
    try {
        const response = await fetch(api + '/notif/sendNotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...obj, auth: "IMADMIN" })
        })
        return response
    } catch (error) {
        return null
    }
}

module.exports = {
    sendNotification
}