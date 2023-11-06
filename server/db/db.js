const Sequelize = require('sequelize')
const pkg = require('../../package.json')

// const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')
const databaseName = "trelloclone1_v1_db";

const config = {
  logging: false
};

if(process.env.LOGGING === 'true'){
  delete config.logging
}

//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
// if(process.env.DATABASE_URL){
//   config.dialectOptions = {
//     ssl: {
//       rejectUnauthorized: false
//     }
//   };
// }

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://trelloclone1_v1_db_user:ENWYr9dITMrq7Cr7FzRPhrkrkKeS91uk@dpg-cl445oauuipc738q400g-a/trelloclone1_v1_db`, config)
  // process.env.DATABASE_URL || `postgres://trello_clone_9yoy_user:wMORfB8kzoXQGiyysFo4JplSh5l7888a@dpg-ce7oj85a4990lb62a2sg-a/trello_clone_9yoy`, config)
  // process.env.DATABASE_URL || `postgres://trello_clone_9yoy_user:wMORfB8kzoXQGiyysFo4JplSh5l7888a@dpg-ce7oj85a4990lb62a2sg-a:5432/${databaseName}`, config)
  // process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`, config)
module.exports = db
