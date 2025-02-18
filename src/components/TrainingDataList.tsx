import { TrainingDataItem } from '../types'
import TrainingDataListItem from './TrainingDataListItem'

const TrainingDataList = (props: { items: TrainingDataItem[] }) => {
  const items = props.items ?? []
  return items.map((item, index) => (
    <TrainingDataListItem key={item.id || index} item={item} index={index + 1} />
  ))
}

export default TrainingDataList