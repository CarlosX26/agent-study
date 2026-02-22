import sqlite3 from "sqlite3"

const db = new sqlite3.Database("./memory.db")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS daily_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      content TEXT
    )
  `)
})

export default db
