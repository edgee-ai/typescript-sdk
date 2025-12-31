# Edgee Gateway SDK

Lightweight TypeScript SDK for Edgee AI Gateway.

## Installation

```bash
npm install edgee
```

## Usage

```typescript
import Edgee from "edgee";

const edgee = new Edgee(process.env.EDGEE_API_KEY);
```

### Simple Input

```typescript
const response = await edgee.send({
  model: "gpt-4o",
  input: "What is the capital of France?",
});

console.log(response.choices[0].message.content);
```

### Full Input with Messages

```typescript
const response = await edgee.send({
  model: "gpt-4o",
  input: {
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello!" },
    ],
  },
});
```

### With Tools

```typescript
const response = await edgee.send({
  model: "gpt-4o",
  input: {
    messages: [{ role: "user", content: "What's the weather in Paris?" }],
    tools: [
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Get weather for a location",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string" },
            },
          },
        },
      },
    ],
    tool_choice: "auto",
  },
});

if (response.choices[0].message.tool_calls) {
  console.log(response.choices[0].message.tool_calls);
}
```

## Response

```typescript
interface SendResponse {
  choices: {
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

