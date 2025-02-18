import { Button } from 'antd'
import { AiResponseSchema } from '../../entities'
import { message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { mutateAiResponseSchema } from '../../api'
import { useEffect, useState } from 'react'

const AiResponseSchemaEditor = ({ schema }: { schema: AiResponseSchema }) => {
  const [syncAvailable, setSyncAv] = useState(!!schema.newSchema)

  // todo - show difference

  useEffect(() => {
    setSyncAv(!!schema.newSchema)
  }, [schema.newSchema])

  const mutation = useMutation({
    mutationFn: mutateAiResponseSchema,
    onSuccess: () => {
      message.success('AiResponse saved successfully')
    },
    onError: (error) => {
      message.error(`Failed to save AiResponse: ${error.message}`)
    },
  })

  const handleSchemaSync = () => {
    mutation.mutate({
      id: schema.id,
      schema: schema.newSchema
    })
  }

  return (
    <>
      {
        syncAvailable ? (
          <div className="flex items-center justify-between bg-green-100 text-green-700 px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center">
              <span className="mr-4">New version available</span>
            </div>
            <Button type="primary" className="bg-green-500 hover:bg-green-600 border-none text-white" onClick={handleSchemaSync}>
              Sync
            </Button>
          </div>
        ) : null
      }
      <pre>
        {JSON.stringify(JSON.parse(schema.schema), null, 2)}
      </pre>
      {
        schema.newSchema ?
          (
            <>
              <h1>New schema:</h1>
              <pre>
                {JSON.stringify(JSON.parse(schema.newSchema), null, 2)}
              </pre>
            </>
          )
          :
          null
      }
    </>
  )
}

export default AiResponseSchemaEditor