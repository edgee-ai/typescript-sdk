/**
 * Example: Token compression with Edgee Gateway SDK
 *
 * This example demonstrates how to:
 * 1. Enable compression for a request with a large input context
 * 2. Set a custom compression rate
 * 3. Access compression metrics from the response
 *
 * Note: Compression works on INPUT tokens, so this example includes a large
 * context document to demonstrate meaningful compression savings.
 */

import Edgee from "edgee";

const edgee = new Edgee(process.env.EDGEE_API_KEY);

// Large context document to demonstrate input compression
const LARGE_CONTEXT = `
The History and Impact of Artificial Intelligence

Artificial intelligence (AI) has evolved from a theoretical concept to a 
transformative technology that influences nearly every aspect of modern life. 
The field began in earnest in the 1950s when pioneers like Alan Turing and 
John McCarthy laid the groundwork for machine intelligence.

Early developments focused on symbolic reasoning and expert systems. These 
rule-based approaches dominated the field through the 1970s and 1980s, with 
systems like MYCIN demonstrating practical applications in medical diagnosis. 
However, these early systems were limited by their inability to learn from data 
and adapt to new situations.

The resurgence of neural networks in the 1980s and 1990s, particularly with 
backpropagation algorithms, opened new possibilities. Yet it wasn't until the 
2010s, with the advent of deep learning and the availability of massive datasets 
and computational power, that AI truly began to revolutionize industries.

Modern AI applications span numerous domains:
- Natural language processing enables machines to understand and generate human language
- Computer vision allows machines to interpret visual information from the world
- Robotics combines AI with mechanical systems for autonomous operation
- Healthcare uses AI for diagnosis, drug discovery, and personalized treatment
- Finance leverages AI for fraud detection, algorithmic trading, and risk assessment
- Transportation is being transformed by autonomous vehicles and traffic optimization

The development of large language models like GPT, BERT, and others has 
particularly accelerated progress in natural language understanding and generation. 
These models, trained on vast amounts of text data, can perform a wide range of 
language tasks with remarkable proficiency.

Despite remarkable progress, significant challenges remain. Issues of bias, 
interpretability, safety, and ethical considerations continue to be areas of 
active research and debate. The AI community is working to ensure that these 
powerful technologies are developed and deployed responsibly, with consideration 
for their societal impact.

Looking forward, AI is expected to continue advancing rapidly, with potential 
breakthroughs in areas like artificial general intelligence, quantum machine 
learning, and brain-computer interfaces. The integration of AI into daily life 
will likely deepen, raising important questions about human-AI collaboration, 
workforce transformation, and the future of human cognition itself.
`;

console.log("=".repeat(70));
console.log("Edgee Token Compression Example");
console.log("=".repeat(70));
console.log();

// Example: Request with compression enabled and large input
console.log("Example: Large context with compression enabled");
console.log("-".repeat(70));
console.log(`Input context length: ${LARGE_CONTEXT.length} characters`);
console.log();

const response = await edgee.send({
  model: "gpt-4o",
  input: {
    messages: [
      { role: "system", content: LARGE_CONTEXT },
      {
        role: "user",
        content:
          "Based on the context above, summarize the key milestones in AI development in 3 bullet points.",
      },
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
  const savingsPct =
    response.compression.input_tokens > 0
      ? (response.compression.saved_tokens /
          response.compression.input_tokens) *
        100
      : 0;
  console.log(`  Savings: ${savingsPct.toFixed(1)}% of input tokens saved!`);
  console.log();
  console.log(`  💡 Without compression, this request would have used`);
  console.log(`     ${response.compression.input_tokens} input tokens.`);
  console.log(
    `     With compression, only ${
      response.compression.input_tokens - response.compression.saved_tokens
    } tokens were processed!`
  );
} else {
  console.log("No compression data available in response.");
  console.log(
    "Note: Compression data is only returned when compression is enabled"
  );
  console.log("      and supported by your API key configuration.");
}

console.log();
console.log("=".repeat(70));

