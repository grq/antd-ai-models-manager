// export interface Customer {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   photo: string; // URL of the photo
//   birthDate: string; // ISO format date
//   created: string; // ISO format date
//   comment: string;
//   status: 'active' | 'inactive' | 'pending'; // Example statuses
//   origin: string; // E.g., 'referral', 'ad', etc.
//   telegram: string; // Telegram username or link
//   whatsapp: string; // WhatsApp number or link
// }

export interface FlaiRequest {
  user: string
  modelId: string
  prompt: string
}

export type BaseItem = {
  id: string

  _created: string
}

export interface FineTuneCreate {
  name: string
  description: string
  aiModel: string
  trainingFile: string
  openaiJobId: string
  openaiJobResponse: unknown
  status: string
}

export type FineTune = FineTuneCreate & BaseItem

export type Instruction = { id: string, key: string, msg: string, priority: number }

export type AiResponseSchema = { id: string, key: string, schema: string, newSchema?: string }