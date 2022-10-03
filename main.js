const {execute} = require('@getvim/execute');
const dotenv = require('dotenv');
dotenv.config();
const username = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const date = new Date();
const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
const fileName = `database-backup-${currentDate}.tar`;

function backup() {
    execute(`pg_dump -U ${username} -d ${database} -f ${fileName} -F t`,).then(async () => {
        console.log("Finito");
    }).catch(err => {
        console.log(err);
    })
}

backup();