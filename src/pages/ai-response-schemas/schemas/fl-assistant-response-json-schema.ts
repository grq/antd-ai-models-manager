import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

// phone number format is +111111111 (no extra symbols, only + and digits, country code always mandatory)

const SimpleFieldTypes = z.enum([
  'text',
  'textarea',
  'email',
  'phone',
  'datetime',
  'image',
  'check',
  'url',
  'formula',
  // 'linkedField',
  'lookup',
  'number'
])

const FieldSchema = z.discriminatedUnion('type', [
  z.object({ type: SimpleFieldTypes, name: z.string(), desc: z.string() }),
  z.object({
    type: z.literal('linkedField'),
    name: z.string(),
    desc: z.string(),
    relationTo: z.union([z.string(), z.number()])
      .describe('If this field is related to an existing table, use a number (tableId). If it is related to a new table, use a string (tableName).')
  })
])

const CardSchema = z.object({
  label: z.string(),
  type: z.enum(['lst', 'wdg', 'gph', 'pln', 'sch']),
  tableName: z.string(),
  views: z.array(z.string())
})

const DocumentValueSchema = z.object({
  fId: z.optional(z.number()).describe('Use this field only if the referenced table field already exists in the current schema. This is the unique ID of the existing field.'),
  fName: z.optional(z.string()).describe('Use this field only if the referenced table field does not exist yet but is proposed to be created in the current batch of actions. This is the name of the new field.'),
  value: z.union([
    z.number().describe('only if field type is number'),
    z.array(z.number()).describe('only if field type is linkedField'),
    z.string().describe('all other field types')
  ]).describe('The value assigned to the field must match its type: use a string for text fields, a number for numeric fields, and an array of numbers for linked fields (each number represents an ID of a referenced document, usually one document).')
})

const DocumentSchema = z.object({
  id: z.optional(z.string()).describe('Use this field only if the document already exists in the database. Do not include this field if the assistant is proposing to create new documents in the current batch.'),
  values: z.array(DocumentValueSchema).describe('An array of document values, where each value corresponds to a specific field in the table. Ensure that each value matches the expected type of the referenced field.')
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

const CreateFieldActionSchema = z.object({
  t: z.literal('create_field'),
  p: z.object({ tableId: z.string(), field: FieldSchema })
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

const InsertDocumentsActionSchema = z.object({
  t: z.literal('insert_documents')
    .describe('This action is used to insert new documents into a specified table.'),
  p: z.object({
    tableId: z.optional(z.number())
      .describe('Use this only if documents are being inserted into an existing table in the current schema.'),
    tableName: z.optional(z.string())
      .describe('Use this only if documents are being inserted into a new table that is proposed to be created in the current batch of actions. The table name must match exactly the name proposed in the create_table action.'),
    docs: z.array(DocumentSchema)
      .describe('An array of documents to be inserted. Each document must follow the DocumentSchema, including valid field references and values that match the field types.')
  }).strict()
    .describe('The parameters for the insert_documents action. No additional properties are allowed beyond tableId, tableName, and docs.')
})

const FLActionSchema = z.discriminatedUnion('t', [
  CreateTableActionSchema,
  CreateModuleActionSchema,
  CreateCardActionSchema,
  CreateFieldActionSchema,
  InsertDocumentsActionSchema
])

export const FlAssistantResponseZodSchema = z.object({
  message: z.string(),
  actions: z.array(FLActionSchema)
}).describe('main json response schema')

export const FlAssistantResponseJsonSchema = zodToJsonSchema(FlAssistantResponseZodSchema, { $refStrategy: 'none' })

export const FlAssistantResponseSchema = {
  key: 'fl-assistant-response-json-schema',
  schema: JSON.stringify(FlAssistantResponseJsonSchema)
}