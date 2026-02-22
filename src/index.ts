import "dotenv/config"
import OpenAI from "openai"
import readline from "readline"
import { savePlan, getPlan } from "./tools"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type AgentAction =
  | { action: "save_plan"; content: string }
  | { action: "get_plan" }

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function runAgent(userInput: string) {
  const today = new Date().toISOString().split("T")[0]

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
        You are a daily planning assistant.
        If the user wants to create a plan, respond with JSON:
        { "action": "save_plan", "content": "plan text" }
        If the user wants to see today's plan:
        { "action": "get_plan" }
        Otherwise respond normally.
        `,
      },
      { role: "user", content: userInput },
    ],
  })

  const message = response.choices[0].message.content ?? ""

  console.log("response:", JSON.stringify(response, null, 2))

  try {
    const parsed: AgentAction = JSON.parse(message)

    if (parsed.action === "save_plan") {
      const result = await savePlan(today, parsed.content)
      console.log(result)
    }

    if (parsed.action === "get_plan") {
      const result = await getPlan(today)
      console.log("Today's Plan:\n", result)
    }
  } catch {
    console.log(message)
  }
}

rl.question("Carlos, o que vamos fazer hoje?\n", async (input) => {
  await runAgent(input)
  rl.close()
})
