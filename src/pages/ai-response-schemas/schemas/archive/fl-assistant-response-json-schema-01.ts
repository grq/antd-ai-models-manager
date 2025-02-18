import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

// todo - sync schema from database

const FieldTypeSchema = z.enum([
  'text',
  'textarea',
  'email',
  'phone',
  'datetime',
  'image',
  'check',
  'url',
  'formula',
  'linkedField',
  'lookup',
  'number',
  'boolean'
])

const FieldSchema = z.object({
  name: z.string(),
  desc: z.string(),
  type: FieldTypeSchema,
  // config: z.optional(z.unknown()),
  relationToId: z.optional(z.number()), // only for linkedField
  relationToName: z.optional(z.string()) // only for linkedField
}).refine((data) => {
  if (data.type === 'linkedField') {
    return data.relationToName !== undefined || data.relationToId !== undefined
  }
  return true
}, {
  message: 'For linkedField, either relationToName or relationToId is required'
})

const CardSchema = z.object({
  label: z.string(),
  type: z.enum(['lst', 'wdg', 'gph', 'pln', 'sch']),
  tableName: z.string(),
  views: z.array(z.string())
})

const CreateTableActionSchema = z.object({
  t: z.literal('create_table'),
  p: z.object({
    name: z.string(),
    desc: z.string(),
    // todo - implement strict rules
    // fields: z.array(FieldSchema).nonempty()
    fields: z.array(FieldSchema)
  })
})

const CreateModuleActionSchema = z.object({
  t: z.literal('create_module'),
  p: z.object({
    name: z.string(),
    icon: z.string(),
    isDefault: z.optional(z.boolean()),
    cards: z.array(CardSchema)
  })
})

const CreateCardActionSchema = z.object({
  t: z.literal('create_card'),
  p: z.object({
    label: z.string(),
    type: z.enum(['lst', 'chart', 'form']),
    tableId: z.number(),
    moduleId: z.number(),
    views: z.array(z.string())
  })
})

const CreateFieldActionSchema = z.object({
  t: z.literal('create_field'),
  p: z.object({
    tableId: z.number(),
    name: z.string(),
    // desc: z.string(),
    type: FieldTypeSchema
  })
})

const FLActionSchema = z.discriminatedUnion('t', [
  CreateTableActionSchema,
  CreateModuleActionSchema,
  CreateCardActionSchema,
  CreateFieldActionSchema
])

// main response schema
export const FlAssistantResponseZodSchema = z.object({
  message: z.string(),
  system: z.object({}),
  // system: z.object({}).default({}),
  json: z.object({
    actions: z.array(FLActionSchema)
    // actions: z.array(FLActionSchema).default([])
  })
})

// main response schema
export const FlAssistantResponseJsonSchema = zodToJsonSchema(FlAssistantResponseZodSchema, { $refStrategy: 'none' })

export const FlAssistantResponseSchema = {
  key: 'fl-assistant-response-json-schema',
  schema: FlAssistantResponseJsonSchema
}