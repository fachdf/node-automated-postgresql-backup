const {execute} = require('@getvim/execute');
const dotenv = require('dotenv');
const cron = require('node-cron');
dotenv.config();
const username = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const date = new Date();
const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
const fileName = `database-backup-${currentDate}.sql`;



async function backup() {
    execute(`sudo -u ${username} pg_dump ${database} > ${fileName}`,).then(async () => {
        console.log("Finito");
        return 0;
    }).catch(err => {
        console.log(err);
    })
}

const task = cron.schedule('* * * * *', function() {
    backup().then(console.log('success backup db: ' + database));
  });

task.start();
