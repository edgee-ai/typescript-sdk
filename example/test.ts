import Edgee from "edgee";

const edgee = new Edgee(process.env.EDGEE_API_KEY || "test-key");

// Test 1: Simple string input
console.log("Test 1: Simple string input");
const response1 = await edgee.send({
  model: "gpt-4o",
  input: "What is the capital of France?",
});
console.log("Content:", response1.choices[0].message.content);
console.log("Usage:", response1.usage);
console.log();

// Test 2: Full input object with messages
console.log("Test 2: Full input object with messages");
const response2 = await edgee.send({
  model: "gpt-4o",
  input: {
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Say hello!" },
    ],
  },
});
console.log("Content:", response2.choices[0].message.content);
console.log();

// Test 3: With tools
console.log("Test 3: With tools");
const response3 = await edgee.send({
  model: "gpt-4o",
  input: {
    messages: [{ role: "user", content: "What is the weather in Paris?" }],
    tools: [
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Get the current weather for a location",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string", description: "City name" },
            },
            required: ["location"],
          },
        },
      },
    ],
    tool_choice: "auto",
  },
});
console.log("Content:", response3.choices[0].message.content);
console.log(
  "Tool calls:",
  JSON.stringify(response3.choices[0].message.tool_calls, null, 2)
);
