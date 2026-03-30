export type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  text?: string;
  warning?: string;
  createdAt?: number;
  expiresAt?: number;
};

export type AttachmentUploadResponse = {
  code: number;
  data?: Attachment;
  msg?: string;
};
