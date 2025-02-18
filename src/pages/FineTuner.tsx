import { useMutation, useQuery } from '@tanstack/react-query'
import { AiModel, TrainingFile } from '../types'
import { Spin, Typography, Button, Tabs, Select } from 'antd'
import { fetchAiModels, fetchFineTunes, fetchTrainingFiles, mutateFineTune, QueryContextKey, QueryData } from '../api'
import { useEffect, useState } from 'react'
import FineTuneTable from '../components/FineTuneTable'
import { FineTune } from '../entities'

const { Text, Title } = Typography

const FineTunerPage = () => {
  const fineTunesQuery = useQuery<
    QueryData<FineTune>,
    Error,
    QueryData<FineTune>,
    QueryContextKey
  >({
    queryKey: ['fineTunes'],
    queryFn: fetchFineTunes,
    refetchOnMount: true,
  })

  const aiModelsQuery = useQuery<
    QueryData<AiModel>,
    Error,
    QueryData<AiModel>,
    QueryContextKey
  >({
    queryKey: ['aimodels'],
    queryFn: fetchAiModels,
    refetchOnMount: true,
  })

  const trainingFilesQuery = useQuery<QueryData<TrainingFile>, Error, QueryData<TrainingFile>, QueryContextKey>({
    queryKey: ['trainingfiles'],
    queryFn: fetchTrainingFiles,
    refetchOnMount: true,
  })

  const fineTuneMutation = useMutation<unknown, Error, { model: string, trainingFile: string }>({
    mutationFn: mutateFineTune,
    onSuccess: () => {
      console.log('mutateFineTune success')
      fineTunesQuery.refetch()
    },
  })

  const [trainingFile, setTrainingFile] = useState<string | undefined>()
  const [activeAiModel, setActiveAiModel] = useState<string>('')

  useEffect(() => {
    if (aiModelsQuery.data?.items?.length && !activeAiModel) {
      setActiveAiModel(aiModelsQuery.data.items[0].id)
    }
  }, [aiModelsQuery.data?.items, activeAiModel])

  const onModelChange = (value: string) => {
    setTrainingFile(value)
  }

  const onClickFineTune = () => {
    if (activeAiModel && trainingFile) {
      fineTuneMutation.mutate({
        model: activeAiModel,
        trainingFile: trainingFile
      })
    }
  }

  const handleTabChange = (key: string) => {
    setActiveAiModel(key)
  }

  return (
    <div className='p-8' style={{
      minHeight: '100vh'
    }}>
      <Title level={3} className='mb-8'>
        Fine Tuner
      </Title>

      <div className='mb-6'>
        <Select
          className='mr-2 w-64'
          showSearch
          placeholder="Select training file"
          onChange={onModelChange}
          value={trainingFile}
          options={
            trainingFilesQuery.data?.items.map((model: TrainingFile) => ({
              value: model.id,
              label: model.fileName
            }))
          }
        />
        <Button
          disabled={!trainingFile}
          type="primary"
          onClick={onClickFineTune}
        >
          Fine Tune
        </Button>
      </div>

      {
        fineTunesQuery.isFetching ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Spin size="large" />
          </div>
        ) : fineTunesQuery.isError ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Title level={3}>Error</Title>
            <Text type="danger">
              {fineTunesQuery.error instanceof Error ? fineTunesQuery.error.message : 'An unexpected error occurred'}
            </Text>
            <div style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={() => fineTunesQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <Tabs
            tabPosition="right"
            activeKey={activeAiModel}
            onChange={handleTabChange}
            items={aiModelsQuery.data?.items.map((model) => ({
              label: model.name,
              key: model.id,
              children: (
                <div>
                  <FineTuneTable
                    items={(fineTunesQuery.data?.items ?? []).filter(ft => ft.aiModel === model.id)}
                  />
                </div>
              ),
            }))}
          />
        )
      }
    </div>
  )
}

export default FineTunerPage