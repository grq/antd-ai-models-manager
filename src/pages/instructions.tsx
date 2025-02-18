import { useQuery } from '@tanstack/react-query'
import { Spin, Typography, Button, Tabs } from 'antd'
import { fetchInstructions, QueryContextKey, QueryData } from '../api'
import { useEffect, useState } from 'react'
import { Instruction } from '../entities'
import { InstructionEditor } from '../components/instruction-editor'

const { Text, Title } = Typography

const InstructionsPage = () => {
  const instructionsQuery = useQuery<
    QueryData<Instruction>,
    Error,
    QueryData<Instruction>,
    QueryContextKey
  >({
    queryKey: ['Instructions'],
    queryFn: fetchInstructions,
    refetchOnMount: true,
  })

  const [activeItem, setActiveItem] = useState<string>('')

  useEffect(() => {
    if (instructionsQuery.data?.items?.length && !activeItem) {
      setActiveItem(instructionsQuery.data.items[0].id)
    }
  }, [instructionsQuery.data?.items, activeItem])

  const handleTabChange = (key: string) => {
    setActiveItem(key)
  }

  const handleInstructionSave = () => instructionsQuery.refetch()

  return (
    <div className='p-8' style={{
      minHeight: '100vh'
    }}>
      <Title level={3} className='mb-8'>
        Instructions
      </Title>
      {
        instructionsQuery.isFetching ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Spin size="large" />
          </div>
        ) : instructionsQuery.isError ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Title level={3}>Error</Title>
            <Text type="danger">
              {instructionsQuery.error instanceof Error ? instructionsQuery.error.message : 'An unexpected error occurred'}
            </Text>
            <div style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={() => instructionsQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <Tabs
            tabPosition="right"
            activeKey={activeItem}
            onChange={handleTabChange}
            items={instructionsQuery.data?.items.sort((a, b) => b.priority - a.priority).map((inst) => ({
              label: (
                <div className="flex items-center gap-2">
                  <span>{inst.key}</span>
                  <span className="text-xs text-gray-400">Priority: {inst.priority}</span>
                </div>
              ),
              key: inst.id,
              children: (
                <div>
                  <InstructionEditor inst={inst} onSave={handleInstructionSave} />
                </div>
              ),
            }))}
          />
        )
      }
    </div>
  )
}

export default InstructionsPage