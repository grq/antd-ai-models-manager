export enum OpenAiJobStatus {
  ValidatingFiles = 'validating_files',
  Queued = 'queued',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrainingDataItemCreate = { messages: any[], tags: any[], trainingFile?: string | null }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrainingDataItem = { id: string, messages: any[], tags: any[], trainingFile?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonFileData = { fileName: string, filePath: string, fileStat: any, data: TrainingDataItem[] }

export type TrainingFile = { id: string, fileName: string, data: TrainingDataItem[], tags: string[] }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AiModel = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OpenAiCompletionResponse = any