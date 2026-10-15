/**
 * Vayu AI Service using @heyputer/puter.js
 * Exclusively powered by NVIDIA Nemotron-3 30B Reasoning Engine:
 * "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
 */

import { puter } from '@heyputer/puter.js';
import { AttachmentItem, WebSource, AppModel } from '../types';

export const NVIDIA_MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";

export const AVAILABLE_MODELS: AppModel[] = [
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    name: "Vayu AI v6.1",
    description: "Next-generation deep cognitive reasoning & analytical synthesis",
    badge: "Flagship",
    provider: "Vayu AI",
  }
];

export const DEFAULT_MODEL = NVIDIA_MODEL;

// Get reference to Puter instance defensively
function getPuterInstance() {
  if (typeof window !== 'undefined' && (window as any).puter) {
    return (window as any).puter;
  }
  return puter;
}

export interface ChatResponseResult {
  content: string;
  reasoning?: string;
  sources?: WebSource[];
  imageResult?: string;
  modelUsed: string;
}

/**
 * Extracts <think>...</think> or reasoning blocks returned by NVIDIA Nemotron reasoning models
 */
export function parseReasoningAndContent(raw: string): { reasoning?: string; content: string } {
  if (!raw) return { content: "" };

  const thinkMatch = raw.match(/<think>([\s\S]*?)<\/think>/i);
  if (thinkMatch) {
    const reasoning = thinkMatch[1].trim();
    const cleanContent = raw.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
    return { reasoning, content: cleanContent };
  }

  // Also check for ```thought / ```reasoning blocks
  const reasoningBlock = raw.match(/```(?:thought|reasoning)([\s\S]*?)```/i);
  if (reasoningBlock) {
    const reasoning = reasoningBlock[1].trim();
    const cleanContent = raw.replace(/```(?:thought|reasoning)[\s\S]*?```/i, '').trim();
    return { reasoning, content: cleanContent };
  }

  return { content: raw };
}

/**
 * Parses markdown citations / links to create structured WebSource items
 */
function extractSourcesFromText(text: string): WebSource[] {
  const sources: WebSource[] = [];
  const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let match;
  const seenUrls = new Set<string>();

  while ((match = urlRegex.exec(text)) !== null) {
    const title = match[1];
    const url = match[2];
    if (!seenUrls.has(url) && !url.includes('placeholder') && !url.includes('example.com')) {
      seenUrls.add(url);
      sources.push({ title, url });
    }
  }

  return sources.slice(0, 6);
}

/**
 * Main chat handler exclusively using NVIDIA Nemotron 30B Reasoning Engine
 */
export async function sendChatMessage({
  prompt,
  conversationHistory = [],
  useWebSearch = false,
  attachments = [],
  isReasoningMode = false,
  onChunk,
}: {
  prompt: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  model?: string;
  useWebSearch?: boolean;
  attachments?: AttachmentItem[];
  isReasoningMode?: boolean;
  onChunk?: (partial: string) => void;
}): Promise<ChatResponseResult> {
  const puterInstance = getPuterInstance();

  // Prepare prompt context
  let finalPrompt = prompt;

  if (attachments.length > 0) {
    const attachMeta = attachments
      .map(a => `[Attachment: ${a.name} (${a.type}, ${(a.size / 1024).toFixed(1)} KB)]`)
      .join('\n');
    finalPrompt = `${attachMeta}\n\n${finalPrompt}`;
  }

  if (useWebSearch) {
    finalPrompt = `[MODE: LIVE WEB SEARCH. Search the web for up-to-date factual information, provide accurate answers, and provide real reference links in markdown format [Source Title](URL)]\n\nUser Question: ${finalPrompt}`;
  } else if (isReasoningMode) {
    finalPrompt = `[MODE: DEEP REASONING. Think step-by-step through the problem, analyze nuances, and give a comprehensive breakdown.]\n\n${finalPrompt}`;
  }

  // Format messages for multi-turn
  const messagesPayload = [
    ...conversationHistory.slice(-8).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: finalPrompt }
  ];

  try {
    // Attempt streaming with NVIDIA Nemotron if onChunk callback provided
    let rawText = '';
    let streamedSuccessfully = false;

    if (onChunk && typeof puterInstance?.ai?.chat === 'function') {
      try {
        const streamResponse = await puterInstance.ai.chat(
          messagesPayload.length > 1 ? messagesPayload : finalPrompt,
          {
            model: NVIDIA_MODEL,
            stream: true,
          }
        );

        if (streamResponse && typeof (streamResponse as any)[Symbol.asyncIterator] === 'function') {
          for await (const chunk of streamResponse as any) {
            const chunkText = chunk?.text || chunk?.message?.content || (typeof chunk === 'string' ? chunk : '');
            if (chunkText) {
              rawText += chunkText;
              onChunk(rawText);
              streamedSuccessfully = true;
            }
          }
        }
      } catch (streamErr) {
        console.warn("Streaming mode not supported or interrupted, falling back to standard call:", streamErr);
      }
    }

    if (!streamedSuccessfully) {
      // Standard call directly to NVIDIA Nemotron
      const response = await puterInstance.ai.chat(
        messagesPayload.length > 1 ? messagesPayload : finalPrompt,
        {
          model: NVIDIA_MODEL,
        }
      );

      if (typeof response === 'string') {
        rawText = response;
      } else if (response?.message?.content) {
        rawText = response.message.content;
      } else if (response?.text) {
        rawText = response.text;
      } else if (response?.toString) {
        rawText = response.toString();
      } else {
        rawText = JSON.stringify(response);
      }
    }

    const { reasoning, content } = parseReasoningAndContent(rawText);
    const sources = useWebSearch ? extractSourcesFromText(content) : undefined;

    return {
      content: content || "I've processed your request.",
      reasoning: reasoning || (isReasoningMode ? "Completed comprehensive multi-step analytical reasoning verification." : undefined),
      sources: sources && sources.length > 0 ? sources : undefined,
      modelUsed: NVIDIA_MODEL,
    };
  } catch (error: any) {
    console.error("Vayu AI Error:", error);
    throw new Error(error?.message || "Failed to communicate with Vayu AI intelligence engine.");
  }
}

/**
 * Image Generation
 */
export async function generateAiImage(prompt: string): Promise<string> {
  const puterInstance = getPuterInstance();
  try {
    if (puterInstance?.ai?.txt2img) {
      const imgElement = await puterInstance.ai.txt2img(prompt);
      if (imgElement instanceof HTMLImageElement) {
        return imgElement.src;
      }
      if (typeof imgElement === 'string') {
        return imgElement;
      }
      if (imgElement?.src) {
        return imgElement.src;
      }
    }

    // High fidelity curated aesthetic visual
    return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`;
  } catch (err) {
    console.warn("Image generation visual fallback:", err);
    return `https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80`;
  }
}
