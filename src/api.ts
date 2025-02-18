import { AiResponseSchema, FineTune, Instruction } from './entities'
import { AiModel, JsonFileData, OpenAiCompletionResponse, TrainingDataItem, TrainingDataItemCreate, TrainingFile } from './types'
import { splitArray } from './utils'

const FLAI_URL = import.meta.env.VITE_FLAI_URL

export interface QueryData<T> {
  items: T[]
  totalFiltered: number
  totalUnfiltered?: number
  filters?: Record<string, unknown>
}

export type QueryContextKey = [string, Record<string, unknown>?]

const post = async <T>(url: string, body?: unknown): Promise<T> => {
  const response = await fetch(`${FLAI_URL}/${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }

  return await response.json() as T
}

const fetchQueryData = async <T>(url: string, body?: unknown): Promise<QueryData<T>> => {
  const defaults = { items: [], totalFiltered: 0, totalUnfiltered: 0 }
  const result = await post<QueryData<FineTune>>(url, body)
  return Object.assign(defaults, {
    items: result.items as T[],
    totalUnfiltered: result.items.length
  })
}

export const loginRequest = async (data: { email: string; password: string }): Promise<{ accessToken: string }> => post('auth/login', data)

export const fetchFineTunes = async () => fetchQueryData<FineTune>('ai/getfinetunes')

export const fetchAiModels = async () => fetchQueryData<AiModel>('api/getall', { cid: 'aiModels' })

export const fetchTrainingFiles = async () => fetchQueryData<TrainingFile>('api/getall', { cid: 'trainingFiles' })

export const fetchTrainingData = async () => fetchQueryData<TrainingDataItem>('api/getall', { cid: 'trainingData' })

export const fetchJsonFiles = async () => fetchQueryData<JsonFileData>('fs/jsonfiles')

export const fetchInstructions = async () => fetchQueryData<Instruction>('api/getall', { cid: 'systemMessages' })

export const fetchAiResponseSchemas = async () => fetchQueryData<AiResponseSchema>('api/getall', { cid: 'aiResponseSchema' })

export const mutateFineTune = async (body: { model: string, trainingFile: string }): Promise<TrainingFile> => post('ai/finetune', body)

export const mutateTrainingDataFile = async (body: { fileName: string, ids: string[] }): Promise<TrainingFile> => post('fs/createtrainingfile', body)

export const mutateInstruction = async (item: Partial<Instruction>): Promise<Instruction> => post('api/update', { cid: 'systemMessages', items: [item] })

export const mutateAiResponseSchema = async (item: Partial<AiResponseSchema>): Promise<AiResponseSchema> => post('api/update', { cid: 'aiResponseSchema', items: [item] })

export const mutateCreateTrainingData = async (items: TrainingDataItemCreate[]): Promise<{ dat: TrainingDataItem[] }> => {
  const portionSize = 35
  const portionTimeout = 1_000
  const portions = splitArray(items, portionSize)
  const dat: TrainingDataItem[] = []
  const pr = portions.map(async (portion, i) => {
    setTimeout(async () => {
      try {
        const data: TrainingDataItem = await post('api/create', { cid: 'trainingData', items: portion })
        dat.push(data)
        return data
      } catch (error) {
        console.error(`Error processing portion ${i + 1}`, error)
        throw error
      }
    }, portionTimeout * i)
  })

  await Promise.all(pr)
  return { dat }
}

export const apiTranscribe = async (audioBlob: Blob) => {
  const formData = new FormData()
  formData.append('file', audioBlob, 'recording.webm')
  return post('whisper/transcribe', formData)
}

export const sendPromptToFlai = async (prompt: string): Promise<OpenAiCompletionResponse> => {
  return post('ai/flaichat', {
    modelName: 'basic-mini',
    user: 'systemadmin',
    chat: 'system',
    prompt
  })
}