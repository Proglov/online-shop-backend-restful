const { deleteOldTemporaryImages } = require('../controller/temporaryImage/delete');
const { CronJob } = require("cron");


const temporaryImageCronJob = CronJob.from({
    cronTime: '0 0 15,21 * * *',
    onTick: async function () {
        console.log(`cron Job is started!`.bgYellow);

        // cron job goes here
        const date = new Date()
        date.setHours(date.getHours() - 3)   // clear the temp images which created before 3 hours ago
        const res = await deleteOldTemporaryImages({ cutoffDate: date })

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

module.exports = {
    temporaryImageCronJob
};