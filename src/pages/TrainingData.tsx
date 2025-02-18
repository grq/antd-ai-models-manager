import { useMutation, useQuery } from '@tanstack/react-query'
import { TrainingDataItem, TrainingFile } from '../types'
import TrainingDataList from '../components/TrainingDataList'
import { Spin, Button, Tabs, Typography, Input } from 'antd'
import { fetchTrainingData, fetchTrainingFiles, mutateTrainingDataFile, QueryContextKey, QueryData } from '../api'
import { useState } from 'react'

const { Text, Title } = Typography

const getFormattedDate = (): string => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = String(today.getFullYear()).slice(-2)
  return `${year}${month}${day}`
}

const TrainingDataPage = () => {
  const trainingDataQuery = useQuery<
    QueryData<TrainingDataItem>,
    Error,
    QueryData<TrainingDataItem>,
    QueryContextKey
  >({
    queryKey: ['trainingdata'],
    queryFn: fetchTrainingData,
    refetchOnMount: true,
  })

  const trainingFilesQuery = useQuery<
    QueryData<TrainingFile>,
    Error,
    QueryData<TrainingFile>,
    QueryContextKey
  >({
    queryKey: ['trainingfiles'],
    queryFn: fetchTrainingFiles,
    refetchOnMount: true,
  })

  const [fileName, setFileName] = useState(`${getFormattedDate()}-`)

  const mutation = useMutation<unknown, Error, { fileName: string, ids: string[] }>({
    mutationFn: mutateTrainingDataFile
  })

  const onClickHandler = () => {
    const items = trainingDataQuery.data?.items ?? []
    const data = items.filter(i => !i.trainingFile).reverse()
    const ids = data.map(i => i.id)
    console.log(ids)

    if (fileName && data && data.length) {
      mutation.mutate({
        fileName,
        ids
      })
    }
  }

  const tabs = [
    { id: 0, fileName: 'Editable' },
    ...trainingFilesQuery.data?.items ?? []
  ]

  const trainingData: TrainingDataItem[] = trainingDataQuery.data?.items ?? []

  return (
    <div className='p-8' style={{
      minHeight: '100vh'
    }}>
      <Title level={3} className='mb-8'>
        Training Data Explorer
      </Title>

      <div className='mb-6'>
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
          className="w-64 mr-2"
        />
        <Button type="primary" onClick={onClickHandler} disabled={!fileName.length} loading={mutation.isPending}>
          Create Training File
        </Button>
        {
          mutation.isError ? JSON.stringify(mutation.error) : ''
        }
      </div>

      {
        trainingDataQuery.isFetching ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Spin size="large" />
          </div>
        ) : trainingDataQuery.isError ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Title level={3}>Error</Title>
            <Text type="danger">
              {trainingDataQuery.error instanceof Error ? trainingDataQuery.error.message : 'An unexpected error occurred'}
            </Text>
            <div style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={() => trainingDataQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <Tabs
            tabPosition='right'
            items={tabs.map((file) => ({
              label: file.fileName,
              key: file.fileName,
              children: (
                <>
                  <TrainingDataList items={trainingData.filter(i => file.id === 0 ? !i.trainingFile : i.trainingFile === file.id)} />
                </>
              ),
            }))}
          />
        )
      }
    </div>
  )
}

export default TrainingDataPage