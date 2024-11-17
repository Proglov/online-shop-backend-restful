const { CronJob } = require("cron");
const { FestivalsDelete } = require('../controller/discounts/festival/delete');
const { AllTelegramCodesDelete } = require('../controller/telegram/delete');
const { deleteOldTemporaryImages } = require('../controller/temporaryImage/delete');


const temporaryImageCronJob = CronJob.from({
    cronTime: '0 0 15,21 * * *',
    onTick: async function () {
        console.log(`temporaryImage Cron Job is started!`.bgYellow);

        const res = await deleteOldTemporaryImages()

        if (res.status === 500) {
            console.log(`temporaryImage Cron Job failed for:`.bgRed);
            console.log(res.message);
        } else console.log(`temporaryImage cron Job is successfully done!`.bgGreen);
    },
    start: false,
    onComplete: function () {
        console.log('temporaryImage Cron Jon terminated!');
    }
});

const festivalsCronJob = CronJob.from({
    cronTime: '0 5 0 * * *',
    onTick: async function () {
        console.log('festivals Cron Job is started!'.bgBlue);

        const res = await FestivalsDelete()

        if (res.status === 500) {
            console.log('festivals Cron Job failed for:'.bgRed);
            console.log(res.message);
        } else console.log('festivals Cron Job is successfully done!'.bgGreen);
    },
    start: false,
    onComplete: function () {
        console.log('festivals Cron Jon terminated!');
    }
});

const telegramCodeCronJob = CronJob.from({
    cronTime: '0 0 3 * * *',
    onTick: async function () {
        console.log('telegramCode Cron Job is started!'.bgBlue);

        const res = await AllTelegramCodesDelete()

        if (res.status === 500) {
            console.log('telegramCode Cron Job failed for:'.bgRed);
            console.log(res.message);
        } else console.log('telegramCode Cron Job is successfully done!'.bgGreen);
    },
    start: false,
    onComplete: function () {
        console.log('telegramCode Cron Jon terminated!');
    }
});

module.exports = {
    temporaryImageCronJob,
    festivalsCronJob,
    telegramCodeCronJob
};