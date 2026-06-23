import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi(){
 await model.invoke("Capital of india").then((response) => {
  console.log("Response:", response.text);
}).catch((error) => {  console.error("Error:", error)})
}
