import { components } from '@6_shared/api/types.ts'

export type ChatRoom = components['schemas']['ChatRoom'];

export interface ChatMessage {
  message_type: "text" | "image" | "file";
  content?: string;
  image_data?: string;
  images?: string[];
  file_data?: string;
  files?: string[];
  image_extension?: string;
  file_extension?: string;
}