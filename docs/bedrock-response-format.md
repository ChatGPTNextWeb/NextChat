# Understanding Bedrock Response Format

The AWS Bedrock streaming response format consists of multiple Server-Sent Events (SSE) chunks. Each chunk follows this structure:

```
:event-type chunk
:content-type application/json
:message-type event
{"bytes":"base64_encoded_data","p":"signature"}
```

## Model-Specific Response Formats

### Claude 3 Format

When using Claude 3 models (e.g., claude-3-haiku-20240307), the decoded messages include:

1. **message_start**
```json
{
  "type": "message_start",
  "message": {
    "id": "msg_bdrk_01A6sahWac4XVTR9sX3rgvsZ",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-haiku-20240307",
    "content": [],
    "stop_reason": null,
    "stop_sequence": null,
    "usage": {
      "input_tokens": 8,
      "output_tokens": 1
    }
  }
}
```

2. **content_block_start**
```json
{
  "type": "content_block_start",
  "index": 0,
  "content_block": {
    "type": "text",
    "text": ""
  }
}
```

3. **content_block_delta**
```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {
    "type": "text_delta",
    "text": "Hello"
  }
}
```

### Mistral Format

When using Mistral models (e.g., mistral-large-2407), the decoded messages have a different structure:

```json
{
  "id": "b0098812-0ad9-42da-9f17-a5e2f554eb6b",
  "object": "chat.completion.chunk",
  "created": 1732582566,
  "model": "mistral-large-2407",
  "choices": [{
    "index": 0,
    "logprobs": null,
    "context_logits": null,
    "generation_logits": null,
    "message": {
      "role": null,
      "content": "Hello",
      "tool_calls": null,
      "index": null,
      "tool_call_id": null
    },
    "stop_reason": null
  }],
  "usage": null,
  "p": null
}
```

### Llama Format

When using Llama models (3.1 or 3.2), the decoded messages use a simpler structure focused on generation tokens:

```json
{
  "generation": "Hello",
  "prompt_token_count": null,
  "generation_token_count": 2,
  "stop_reason": null
}
```

Each chunk contains:
- generation: The generated text piece
- prompt_token_count: Token count of the input (only present in first chunk)
- generation_token_count: Running count of generated tokens
- stop_reason: Indicates completion (null until final chunk)

First chunk example (includes prompt_token_count):
```json
{
  "generation": "\n\n",
  "prompt_token_count": 10,
  "generation_token_count": 1,
  "stop_reason": null
}
```

### Titan Text Format

When using Amazon's Titan models (text or TG1), the response comes as a single chunk with complete text and metrics:

```json
{
  "outputText": "\nBot: Hello! How can I help you today?",
  "index": 0,
  "totalOutputTextTokenCount": 13,
  "completionReason": "FINISH",
  "inputTextTokenCount": 3,
  "amazon-bedrock-invocationMetrics": {
    "inputTokenCount": 3,
    "outputTokenCount": 13,
    "invocationLatency": 833,
    "firstByteLatency": 833
  }
}
```

Both Titan text and Titan TG1 use the same response format, with only minor differences in token counts and latency values. For example, here's a TG1 response:

```json
{
  "outputText": "\nBot: Hello! How can I help you?",
  "index": 0,
  "totalOutputTextTokenCount": 12,
  "completionReason": "FINISH",
  "inputTextTokenCount": 3,
  "amazon-bedrock-invocationMetrics": {
    "inputTokenCount": 3,
    "outputTokenCount": 12,
    "invocationLatency": 845,
    "firstByteLatency": 845
  }
}
```

Key fields:
- outputText: The complete generated response
- totalOutputTextTokenCount: Total tokens in the response
- completionReason: Reason for completion (e.g., "FINISH")
- inputTextTokenCount: Number of input tokens
- amazon-bedrock-invocationMetrics: Detailed performance metrics

## Model-Specific Completion Metrics

### Mistral
```json
{
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 29,
    "completion_tokens": 24
  },
  "amazon-bedrock-invocationMetrics": {
    "inputTokenCount": 5,
    "outputTokenCount": 24,
    "invocationLatency": 719,
    "firstByteLatency": 148
  }
}
```

### Claude 3
Included in the message_delta with stop_reason.

### Llama
Included in the final chunk with stop_reason "stop":
```json
{
  "amazon-bedrock-invocationMetrics": {
    "inputTokenCount": 10,
    "outputTokenCount": 11,
    "invocationLatency": 873,
    "firstByteLatency": 550
  }
}
```

### Titan
Both Titan text and TG1 include metrics in the single response chunk:
```json
{
  "amazon-bedrock-invocationMetrics": {
    "inputTokenCount": 3,
    "outputTokenCount": 12,
    "invocationLatency": 845,
    "firstByteLatency": 845
  }
}
```

## How the Response is Processed

1. The raw response is first split into chunks based on SSE format
2. For each chunk:
   - The base64 encoded data is decoded
   - The JSON is parsed to extract the message content
   - Based on the model type and message type, different processing is applied:

### Claude 3 Processing
- message_start: Initializes a new message with model info and usage stats
- content_block_start: Starts a new content block (text, tool use, etc.)
- content_block_delta: Adds incremental content to the current block
- message_delta: Updates message metadata

### Mistral Processing
- Each chunk contains a complete message object with choices array
- The content is streamed through the message.content field
- Final chunk includes token usage and invocation metrics

### Llama Processing
- Each chunk contains a generation field with the text piece
- First chunk includes prompt_token_count
- Tracks generation progress through generation_token_count
- Simple streaming format focused on text generation
- Final chunk includes complete metrics

### Titan Processing
- Single chunk response with complete text
- No streaming - returns full response at once
- Includes comprehensive metrics in the same chunk

## Handling in Code

The response is processed by the `transformBedrockStream` function in `app/utils/aws.ts`, which:

1. Reads the stream chunks
2. Parses each chunk using `parseEventData`
3. Handles model-specific formats:
   - For Claude: Processes message_start, content_block_start, content_block_delta
   - For Mistral: Extracts content from choices[0].message.content
   - For Llama: Uses the generation field directly
   - For Titan: Uses the outputText field from the single response
4. Transforms the parsed data into a consistent format for the client
5. Yields the transformed data as SSE events

This allows for real-time streaming of the model's response while maintaining a consistent format for the client application, regardless of which model is being used.
