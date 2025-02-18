import { useQuery } from '@tanstack/react-query'
import { Spin, Typography, Button, Tabs } from 'antd'
import { fetchAiResponseSchemas, QueryContextKey, QueryData } from '../../api'
import { useEffect, useState } from 'react'
import { AiResponseSchema } from '../../entities'
import { FlAssistantResponseSchema } from './schemas/fl-assistant-response-json-schema'
import AiResponseSchemaEditor from './ai-response-schema-editor'

const { Text, Title } = Typography

const AiResponseSchemasPage = () => {
  const schemasQuery = useQuery<
    QueryData<AiResponseSchema>,
    Error,
    QueryData<AiResponseSchema>,
    QueryContextKey
  >({
    queryKey: ['responseSchemas'],
    queryFn: fetchAiResponseSchemas,
    refetchOnMount: true,
  })

  const [activeItem, setActiveItem] = useState<string>('')
  const [schemas, setSchemas] = useState<AiResponseSchema[]>([])


  useEffect(() => {
    const localSchemas = [
      FlAssistantResponseSchema
    ]

    if (schemasQuery.data?.items) {
      const schms = schemasQuery.data?.items
      localSchemas.forEach(ls => {
        const cs = schms.find(s => s.key === ls.key)
        if (cs && JSON.stringify(cs.schema) !== JSON.stringify(ls.schema)) {
          cs.newSchema = ls.schema
        }
      })
      setSchemas(schemasQuery.data?.items)
    }
  }, [schemasQuery.data?.items])

  useEffect(() => {
    if (schemas && schemas[0] && !activeItem) {
      setActiveItem(schemas[0].key)
    }
  }, [schemas, activeItem])

  const handleTabChange = (key: string) => {
    setActiveItem(key)
  }

  return (
    <div className='p-8' style={{
      minHeight: '100vh'
    }}>
      <Title level={3} className='mb-8'>
        Response Schemas
      </Title>
      {
        schemasQuery.isFetching ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Spin size="large" />
          </div>
        ) : schemasQuery.isError ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Title level={3}>Error</Title>
            <Text type="danger">
              {schemasQuery.error instanceof Error ? schemasQuery.error.message : 'An unexpected error occurred'}
            </Text>
            <div style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={() => schemasQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <Tabs
            tabPosition="right"
            activeKey={activeItem}
            onChange={handleTabChange}
            items={schemas.map((schema) => ({
              label: schema.key,
              key: schema.id,
              children: <AiResponseSchemaEditor schema={schema} />,
            }))}
          />
        )
      }
    </div>
  )
}

export default AiResponseSchemasPage