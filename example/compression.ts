/**
 * Example: Token compression with Edgee Gateway SDK
 *
 * This example demonstrates how to:
 * 1. Enable compression for a request
 * 2. Set a custom compression rate
 * 3. Access compression metrics from the response
 */

import Edgee from "edgee";

const edgee = new Edgee(process.env.EDGEE_API_KEY);

console.log("=".repeat(70));
console.log("Edgee Token Compression Example");
console.log("=".repeat(70));
console.log();

// Example: Request with compression enabled
console.log("Example: Request with compression enabled");
console.log("-".repeat(70));

const response = await edgee.send({
  model: "gpt-4o",
  input: {
    messages: [
      { role: "user", content: "Explain quantum computing in simple terms." },
    ],
    enable_compression: true,
    compression_rate: 0.5,
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
  console.log(`  Input tokens:  ${response.compression.input_tokens}`);
  console.log(`  Saved tokens:  ${response.compression.saved_tokens}`);
  console.log(
    `  Compression rate: ${(response.compression.rate * 100).toFixed(2)}%`
  );
  console.log(
    `  Token savings: ${response.compression.saved_tokens} tokens saved!`
  );
} else {
  console.log("No compression data available in response.");
  console.log("Note: Compression data is only returned when compression is enabled");
  console.log("      and supported by your API key configuration.");
}

console.log();
console.log("=".repeat(70));
