import { Tabs } from 'antd'
import { InstructionEditor } from '../components/instruction-editor'

const PageTabs = () => {
  return (
    <Tabs
      tabPosition="right"
      activeKey={activeItem}
      onChange={handleTabChange}
      items={instructionsQuery.data?.items.map((inst) => ({
        label: inst.key,
        key: inst.id,
        children: (
          <div>
            <InstructionEditor inst={inst} />
          </div>
        ),
      }))}
    />
  )
}

export default PageTabs