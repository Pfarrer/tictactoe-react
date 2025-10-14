import { z } from "zod";

// Base message schema with required fields
const baseMessageSchema = z.object({
  id: z.string().min(1, "Message ID cannot be empty"),
  scope: z.string().min(1, "Scope cannot be empty"),
  name: z.string().min(1, "Message name cannot be empty"),
  data: z.any(),
});

// Specific message schemas
const readyForNextGameSchema = baseMessageSchema.extend({
  scope: z.literal("lobby"),
  name: z.literal("readyForNextGame"),
  data: z.object({
    isReady: z.boolean(),
  }),
});

const requestMoveSchema = baseMessageSchema.extend({
  scope: z.string().regex(/^g-/, "Invalid game ID format - must start with 'g-'"),
  name: z.literal("requestMove"),
  data: z.object({
    cellIdx: z.number().int().min(0, "Cell index must be 0 or greater").max(8, "Cell index must be 8 or less"),
  }),
});

// Union of all valid client message schemas
export const clientMessageSchema = z.discriminatedUnion("name", [readyForNextGameSchema, requestMoveSchema]);

// Type inference from the schema
export type ValidatedClientMessage = z.infer<typeof clientMessageSchema>;

// Helper function to validate and get detailed error messages
export function validateClientMessageWithZod(message: unknown): {
  isValid: boolean;
  data?: ValidatedClientMessage;
  error?: string;
} {
  try {
    const data = clientMessageSchema.parse(message);
    return { isValid: true, data };
  } catch (error) {
    // Custom error handling based on message content
    const msg = message as Record<string, unknown>;
    const errors: string[] = [];

    if (!msg || typeof msg !== "object") {
      return {
        isValid: false,
        error: "Message must be an object",
      };
    }

    // Check basic structure
    if (typeof msg.id !== "string" || msg.id.length === 0) {
      errors.push("id must be a non-empty string");
    }

    if (typeof msg.scope !== "string" || msg.scope.length === 0) {
      errors.push("scope must be a non-empty string");
    }

    if (typeof msg.name !== "string" || msg.name.length === 0) {
      errors.push("name must be a non-empty string");
    }

    if (msg.data === undefined) {
      errors.push("data is required");
    }

    // If basic structure is valid, check specific message types
    if (errors.length === 0) {
      if (msg.name === "readyForNextGame") {
        if (msg.scope !== "lobby") {
          errors.push("readyForNextGame requires scope 'lobby'");
        }
        if (typeof (msg.data as Record<string, unknown>).isReady !== "boolean") {
          errors.push("readyForNextGame requires boolean isReady field");
        }
      } else if (msg.name === "requestMove") {
        if (typeof msg.scope !== "string" || !msg.scope.startsWith("g-")) {
          errors.push("requestMove requires valid game ID (starts with 'g-')");
        }
        const cellIdx = (msg.data as Record<string, unknown>).cellIdx;
        if (typeof cellIdx !== "number" || cellIdx < 0 || cellIdx > 8) {
          errors.push("requestMove requires cellIdx between 0 and 8");
        }
      } else {
        errors.push(`Unknown message type: ${msg.name}`);
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        error: errors[0], // Return first error for simplicity
      };
    }

    return {
      isValid: false,
      error: "Message validation failed",
    };
  }
}

// Alternative validation function that preserves message ID for error responses
export function validateMessageWithErrorId(message: unknown): {
  isValid: boolean;
  messageId: string;
  error?: string;
} {
  const msg = message as Record<string, unknown>;
  const messageId = msg?.id && typeof msg.id === "string" ? msg.id : "unknown";

  try {
    clientMessageSchema.parse(message);
    return { isValid: true, messageId };
  } catch (error) {
    // Use custom validation for better error messages
    const validation = validateClientMessageWithZod(message);
    return {
      isValid: false,
      messageId,
      error: validation.error || "Message validation failed",
    };
  }
}
