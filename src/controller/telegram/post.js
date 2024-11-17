const { TemporaryTelegramCode, Seller } = require('../../models/dbModels');
const { error500 } = require('../../lib/errors');



const CheckCodeForTelegram = async (args, _context) => {
    const { code, telegramId, auth } = args

    try {
        if (!code || !telegramId || auth !== 'IMADMIN') return {
            status: 400,
            message: 'کد و ایدی تلگرام الزامیست'
        }

        const existingCode = await TemporaryTelegramCode.findOneAndDelete({ code });

        if (!existingCode) return {
            status: 400,
            message: 'کد صحیح نیست'
        }

        await Seller.findByIdAndUpdate(existingCode.sellerId, { $set: { telegramId } });

        return {
            message: 'The Seller has been Updated successfully',
            status: 201
        }

    } catch (error) {
        return {
            ...error500
        }
    }
}

const logoutFromTelegram = async (args, _context) => {
    const { telegramId, auth } = args

    try {

        if (!telegramId || auth !== 'IMADMIN') return {
            status: 400,
            message: 'ایدی تلگرام الزامیست'
        }

        await Seller.findOneAndUpdate({ telegramId }, { $set: { telegramId: 0 } });

        return {
            message: 'The Seller has been Updated successfully',
            status: 201
        }

    } catch (error) {
        return {
            ...error500
        }
    }
}


module.exports = {
    CheckCodeForTelegram,
    logoutFromTelegram
}