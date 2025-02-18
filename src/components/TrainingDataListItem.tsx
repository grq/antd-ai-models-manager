import { Card, Tag } from 'antd'
import { TrainingDataItem } from '../types'

export interface TrainingDataListItemProps {
    item: TrainingDataItem
    index: number
}

const TrainingDataListItem = ({ item, index }: TrainingDataListItemProps) => {
  const tags = item.tags ?? []
  const messages = item.messages ?? []

  return (
    <Card className="relative">
      <div className="relative">
        <div className="text-xs absolute top-2 right-2 text-gray-500">
          {item.id}
        </div>
        <div className="flex items-start mb-4">
          <div className="text-gray-500">
            <div className="text-sm mr-2 w-20 h-10 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {index}
            </div>
          </div>
          <div>
            {
              tags.map(t => (
                <Tag key={t} color='cyan'>{t}</Tag>
              ))
            }
          </div>
        </div>
        {
          messages.map((m, index) => (
            <div key={m.id || index}>
              <div className="flex items-start">
                <div className="font-bold mr-2 w-20 h-10 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  {m.role}
                </div>
                <div className="flex-1">{typeof m.content === 'object' ? JSON.stringify(m.content) : m.content}</div>
              </div>
            </div>
          ))
        }
      </div>
    </Card>
  )
}

export default TrainingDataListItem