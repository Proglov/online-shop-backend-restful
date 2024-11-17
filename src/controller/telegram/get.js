const { TemporaryTelegramCode, Seller } = require('../../models/dbModels');
const { error401, error500 } = require('../../lib/errors');

const timeToExpireMs = 3 * 60 * 1000

const generateStringCode = () => {
    const getRandomDigit = () => Math.floor(Math.random() * 10).toString();
    const getRandomCharacter = () => 'ABCDEFGHJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 25))

    // Generate 2 digits and 3 characters
    const digits = Array.from({ length: 2 }, getRandomDigit);
    const characters = Array.from({ length: 3 }, getRandomCharacter);

    // Combine digits and characters
    const combined = [...digits, ...characters];

    // Shuffle the combined array
    const shuffled = combined.sort(() => Math.random() - 0.5);

    // Join the shuffled array into a string
    return shuffled.join('');
};


const GetCodeForTelegram = async (_args, context) => {
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo.userId) return { ...error401, code: null };

        const seller = await Seller.findById(userInfo.userId);
        if (!seller) return { ...error401, code: null };

        let code;
        let existingCode = await TemporaryTelegramCode.findOne({ sellerId: userInfo?.userId });

        if (existingCode) {
            const date = new Date(existingCode.updatedAt)
            const timeLeft = timeToExpireMs - Date.now() + date.getTime()
            if (timeLeft > 0)
                return {
                    status: 400,
                    message: `شما کد دریافت کرده اید. لطفا ${Math.floor(timeLeft / 1000)} ثانیه صبر کنید`,
                    code: null
                }

            // update the unique code
            let newCodeExists
            do {
                code = generateStringCode();
                newCodeExists = await TemporaryTelegramCode.findOne({ code });
            } while (newCodeExists);

            existingCode.code = code
            await existingCode.save()

            return {
                code,
                message: 'The Code has been created successfully',
                status: 201,
            };

        }


        // Generate a unique code
        do {
            code = generateStringCode();
            existingCode = await TemporaryTelegramCode.findOne({ code });
        } while (existingCode);

        // Create the temporary code entry
        const newTemporaryTelegramCode = new TemporaryTelegramCode({
            sellerId: userInfo.userId,
            code
        });

        await newTemporaryTelegramCode.save();

        return {
            code,
            message: 'The Code has been created successfully',
            status: 201,
        };

    } catch (error) {
        console.log(error);
        return { ...error500, code: null };
    }
};


const CheckTelegramStatus = async (_args, context) => {
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo.userId) return { ...error401, isLogged: false };

        const seller = await Seller.findById(userInfo.userId);
        if (!seller) return { ...error401, isLogged: false };

        return {
            isLogged: typeof seller?.telegramId === 'number' && seller.telegramId != 0,
            message: null,
            status: 200,
        };

    } catch (error) {
        return { ...error500, isLogged: false };
    }
};

const GetTimeLeft = async (_args, context) => {
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo.userId) return { ...error401, timeLeft: -1 };

        const existingCode = await TemporaryTelegramCode.findOne({ sellerId: userInfo?.userId });

        if (!existingCode) return {
            timeLeft: -1,
            message: null,
            status: 200,
        };

        const date = new Date(existingCode.updatedAt)
        const timeLeft = (Math.floor((timeToExpireMs - Date.now() + date.getTime()) / 1000))

        return {
            timeLeft,
            message: null,
            status: 200,
        };

    } catch (error) {
        return { ...error500, timeLeft: -1 };
    }
};

module.exports = {
    GetCodeForTelegram,
    CheckTelegramStatus,
    GetTimeLeft
};