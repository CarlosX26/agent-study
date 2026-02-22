import db from "./db"

export function savePlan(date: string, content: string): Promise<string> {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO daily_plans (date, content) VALUES (?, ?)",
      [date, content],
      function (err) {
        if (err) reject(err)
        else resolve("Plan saved successfully.")
      },
    )
  })
}

export function getPlan(date: string): Promise<string> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT content FROM daily_plans WHERE date = ?",
      [date],
      (err, row: any) => {
        if (err) reject(err)
        else resolve(row ? row.content : "No plan found.")
      },
    )
  })
}
