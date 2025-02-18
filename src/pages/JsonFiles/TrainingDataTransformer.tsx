import { Button } from 'antd'
import { TrainingDataItemCreate } from '../../types'
import { useMutation } from '@tanstack/react-query'
import { ButtonType } from 'antd/es/button'
import { mutateCreateTrainingData } from '../../api'



// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TrainingDataItem = any

export interface TrainingDataTransformerProps {
  title: string
  data: TrainingDataItemCreate[]
  type?: ButtonType
  className?: string
}

const TrainingDataTransformer = ({ className, data, title, type }: TrainingDataTransformerProps) => {
  const mutation = useMutation<TrainingDataItem, Error, TrainingDataItemCreate[]>({
    mutationFn: mutateCreateTrainingData
  })

  const onClickHandler = () => {
    const ii = data.map(i => ({
      trainingFile: null,
      tags: i.tags,
      messages: i.messages.map(i => ({
        role: i.role,
        content: typeof i.content === 'object' ? JSON.stringify(i.content) : i.content
      }))
    }))
    mutation.mutate(ii)
  }

  return (
    <div className={`${className}`}>
      <Button type={type ?? 'default'} onClick={onClickHandler} loading={mutation.isPending}>
        { title || 'Transform to Training Data'} ({ data.length } training data items)
      </Button>
      {
        mutation.isError ? JSON.stringify(mutation.error) : ''
      }
    </div>
  )
}

export default TrainingDataTransformer