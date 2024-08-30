const { FestivalsDelete } = require('../controller/festivals/festival/delete');
const { deleteOldTemporaryImages } = require('../controller/temporaryImage/delete');
const { CronJob } = require("cron");


const temporaryImageCronJob = CronJob.from({
    cronTime: '0 0 15,21 * * *',
    onTick: async function () {
        console.log(`temporaryImage Cron Job is started!`.bgYellow);

        const res = await deleteOldTemporaryImages()

        if (res.status === 500) {
            console.log('temporaryImage Cron Job failed for:');
            console.log(res.message);
        } else console.log('temporaryImage cron Job is successfully done!');
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
        } else console.log('festivals Cron Job is successfully done!');
    },
    start: false,
    onComplete: function () {
        console.log('festivals Cron Jon terminated!');
    }
});

module.exports = {
    temporaryImageCronJob,
    festivalsCronJob
};