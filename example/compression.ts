/**
 * Example: Token compression with Edgee Gateway SDK
 *
 * This example demonstrates how to:
 * 1. Turn tool-result trimming on for a single request
 * 2. Access compression metrics from the response
 *
 * Tool-result trimming shortens the output of tool calls (here a long `ls -la`
 * listing) before it reaches the model. The per-request toggles
 * (`tool_result_trimming`, `tool_surface_reduction`, `output_brevity`) override
 * the API key settings for this request only; leave one out to keep the key's
 * setting.
 */

import Edgee from "edgee";

const edgee = new Edgee(process.env.EDGEE_API_KEY);

// A long directory listing, the kind of tool output coding agents send back.
const LS_OUTPUT =
  "total 800\n" +
  Array.from(
    { length: 200 },
    (_, i) =>
      `-rw-r--r--  1 user  staff  ${1000 + i} Jan  1 12:00 src/components/module_${String(i).padStart(3, "0")}.tsx`
  ).join("\n");

console.log("=".repeat(70));
console.log("Edgee Token Compression Example");
console.log("=".repeat(70));
console.log();

console.log("Example: Large tool result with tool-result trimming turned on");
console.log("-".repeat(70));
console.log(`Tool output length: ${LS_OUTPUT.length} characters`);
console.log();

const response = await edgee.send({
  model: "anthropic/claude-haiku-4-5",
  input: {
    messages: [
      { role: "user", content: "How many files are in src/components?" },
      {
        role: "assistant",
        tool_calls: [
          {
            id: "call_1",
            type: "function",
            function: { name: "Bash", arguments: '{"command":"ls -la src/components"}' },
          },
        ],
      },
      { role: "tool", tool_call_id: "call_1", content: LS_OUTPUT },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "Bash",
          description: "Run a shell command and return its output.",
          parameters: {
            type: "object",
            properties: { command: { type: "string" } },
            required: ["command"],
          },
        },
      },
    ],
    tool_result_trimming: true,
  },
});

console.log(`Response: ${response.text}`);
console.log();

// Display usage information
if (response.usage) {
  console.log("Token Usage:");
  console.log(`  Prompt tokens:     ${response.usage.prompt_tokens}`);
  console.log(`  Completion tokens: ${response.usage.completion_tokens}`);
  console.log(`  Total tokens:      ${response.usage.total_tokens}`);
  console.log();
}

// Display compression information
if (response.compression) {
  console.log("Compression Metrics:");
  console.log(`  Saved tokens:  ${response.compression.saved_tokens}`);
  console.log(`  Reduction:     ${response.compression.reduction}%`);
  console.log(
    `  Cost savings:  $${(response.compression.cost_savings / 1_000_000).toFixed(3)}`
  );
  console.log(`  Time:          ${response.compression.time_ms} ms`);
  if (response.compression.reduction > 0) {
    const originalTokens =
      Math.floor(
        (response.compression.saved_tokens * 100) / response.compression.reduction
      );
    const tokensAfter = originalTokens - response.compression.saved_tokens;
    console.log();
    console.log(`  💡 Without compression, this request would have used`);
    console.log(`     ${originalTokens} input tokens.`);
    console.log(
      `     With compression, only ${tokensAfter} tokens were processed!`
    );
  }
} else {
  console.log("No compression data available in response.");
  console.log(
    "Note: Compression data is only returned when trimming actually shortened"
  );
  console.log("      a tool result.");
}

console.log();
console.log("=".repeat(70));
