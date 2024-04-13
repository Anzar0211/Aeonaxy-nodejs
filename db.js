const postgres = require('postgres');





let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;



const sql = postgres({

  host: PGHOST,

  database: PGDATABASE,

  username: PGUSER,

  password: PGPASSWORD,

  port: 5432,

  ssl: 'require',

});



async function getPgVersion() {

  const result = await sql`select version()`;

  console.log(result[0]);

}



getPgVersion();

module.exports=sql