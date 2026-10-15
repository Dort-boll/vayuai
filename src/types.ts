/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AttachmentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
  isImage: boolean;
}

export interface WebSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: AttachmentItem[];
  imageResult?: string;
  sources?: WebSource[];
  reasoning?: string;
  modelUsed?: string;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  pinned?: boolean;
}

export type ToolMode = 'chat' | 'image' | 'search' | 'reasoning';

export interface AppModel {
  id: string;
  name: string;
  description: string;
  badge?: string;
  provider: string;
}
