const { FestivalsDelete } = require('../controller/festivals/festival/delete');
const { deleteOldTemporaryImages } = require('../controller/temporaryImage/delete');
const { CronJob } = require("cron");


const temporaryImageCronJob = CronJob.from({
    cronTime: '0 0 15,21 * * *',
    onTick: async function () {
        console.log(`cron Job is started!`.bgYellow);

        const res = await deleteOldTemporaryImages()

        if (res.status === 500) {
            console.log('cron job failed for:');
            console.log(res.message);
        } else console.log('cron Job is successfully done!');
    },
    start: false,
    onComplete: function () {
        console.log('Cron Jon terminated!');
    }
});

const festivalsCronJob = CronJob.from({
    cronTime: '0 10 15,21 * * *',
    onTick: async function () {
        console.log('cron Job is started!'.bgBlue);

        const res = await FestivalsDelete()

        if (res.status === 500) {
            console.log('cron job failed for:'.bgRed);
            console.log(res.message);
        } else console.log('cron Job is successfully done!');
    },
    start: false,
    onComplete: function () {
        console.log('Cron Jon terminated!');
    }
});

module.exports = {
    temporaryImageCronJob,
    festivalsCronJob
};