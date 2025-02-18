import { useQuery } from '@tanstack/react-query'
import { Typography, Spin, Button, Tabs } from 'antd'
import { JsonFileData } from '../../types'
import TrainingDataTransformer from './TrainingDataTransformer'
import TrainingDataList from '../../components/TrainingDataList'
import { QueryContextKey, QueryData, fetchJsonFiles } from '../../api'

const { Title } = Typography

const JsonFilesPage = () => {
  const { data, isFetching, isError, error, refetch } = useQuery<
    QueryData<JsonFileData>,
    Error,
    QueryData<JsonFileData>,
    QueryContextKey
  >({
    queryKey: ['finetuneitems'],
    queryFn: fetchJsonFiles,
    refetchOnMount: true
  })

  const allItems = data?.items.flatMap(file => file.data) ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <div className="flex items-center justify-between mb-8">
        <Title level={3} className="!m-0 flex-shrink-0 leading-none">
          JSON Files Explorer
        </Title>
        {
          allItems &&
          (<TrainingDataTransformer type="primary" title="Import data from all files" className='ml-6' data={allItems} />)
        }
      </div>

      {isFetching && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {isError && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Typography.Text type="danger">
            {error?.message || 'Failed to load data. Please try again later.'}
          </Typography.Text>
          <br />
          <Button onClick={() => refetch()} type="primary" style={{ marginTop: '16px' }}>
            Retry
          </Button>
        </div>
      )}

      {!isFetching && !isError && data && (
        <>
          <Tabs
            tabPosition="right"
            items={data.items.map((file) => ({
              label: file.fileName,
              key: file.fileName,
              children: (
                <>
                  <TrainingDataTransformer className='mb-6' title="Transform this file" data={file.data} />
                  <div
                    style={{
                      height: 'calc(100vh - 270px)',
                      overflowY: 'auto'
                    }}
                  >
                    <TrainingDataList items={file.data} />
                  </div>
                </>
              ),
            }))}
          />
        </>
      )}
    </div>
  )
}

export default JsonFilesPage