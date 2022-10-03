const {execute} = require('@getvim/execute');
const dotenv = require('dotenv');
const cron = require('node-cron');
dotenv.config();
const username = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const parent_folder = process.env.PARENT_FOLDER
const date = new Date();
const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
const fileName = `database-backup-${currentDate}.sql`;



async function backup() {
    execute(`sudo -u ${username} pg_dump ${database} > ${fileName}`,).then(async () => {
        console.log("Done pg_dump");
        execute(`gdrive upload --parent ${parent_folder} ${fileName}`,).then(async () => {
            console.log("Done Upload to Google Drive");
            execute(`rm ${fileName}`,).then(async () => {
                console.log("Done Delete Local File");
            }).catch(err => {
                console.log("Error Delete Local File");
                console.log(err);
            })
        }).catch(err => {
            console.log("Error Upload to Google Drive");
            console.log(err);
        })
        return 0;
    }).catch(err => {
        console.log("Error pg_dump")
        console.log(err);
    })
}

const task = cron.schedule('* * * * *', function() {
    backup().then(console.log('success backup db: ' + database));
  });

task.start();
