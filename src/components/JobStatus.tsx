import { Tag } from 'antd'
import { OpenAiJobStatus } from '../types'

const OpenAiJobStatusColorMap: Record<OpenAiJobStatus, string> = {
  [OpenAiJobStatus.ValidatingFiles]: 'blue',
  [OpenAiJobStatus.Queued]: 'gold',
  [OpenAiJobStatus.Running]: 'cyan',
  [OpenAiJobStatus.Succeeded]: 'green',
  [OpenAiJobStatus.Failed]: 'red',
  [OpenAiJobStatus.Cancelled]: 'gray'
}

const OpenAiJobStatusNameMap: Record<OpenAiJobStatus, string> = {
  [OpenAiJobStatus.ValidatingFiles]: 'Validating Files',
  [OpenAiJobStatus.Queued]: 'Queued',
  [OpenAiJobStatus.Running]: 'Running',
  [OpenAiJobStatus.Succeeded]: 'Succeeded',
  [OpenAiJobStatus.Failed]: 'Failed',
  [OpenAiJobStatus.Cancelled]: 'Cancelled',
}

const JobStatus = (props: { status: string }) => {
  const name = OpenAiJobStatusNameMap[props.status as OpenAiJobStatus]
  const color = OpenAiJobStatusColorMap[props.status as OpenAiJobStatus]
  return (
    <Tag color={color}>
      {name}
    </Tag>
  )
}

export default JobStatus