require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function run() {
  const sqlFile = path.join(__dirname, '001_schema.sql')
  const sql = fs.readFileSync(sqlFile, 'utf8')
  try {
    await pool.query(sql)
    console.log('Migration completed successfully.')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

run()
