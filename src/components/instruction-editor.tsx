import TextArea from 'antd/es/input/TextArea'
import { Instruction } from '../entities'
import { Button, InputNumber, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { mutateInstruction } from '../api'
import { useState } from 'react'

export const InstructionEditor = ({ inst, onSave }: { inst: Instruction, onSave: () => void }) => {
  const [item, setItem] = useState<Instruction>(inst)

  const instructionMutation = useMutation({
    mutationFn: mutateInstruction,
    onSuccess: () => {
      message.success('Instruction saved successfully')
      onSave()
    },
    onError: (error) => {
      message.error(`Failed to save instruction: ${error.message}`)
    },
  })

  const onClickInstruction = () => {
    instructionMutation.mutate(item)
  }

  return (
    <>
      <div className='mb-6 flex items-center gap-4'>
        <Input
          placeholder='Key'
          value={item.key}
          onChange={(e) => setItem({ ...item, key: e.target.value })}
          className='w-40'
        />
        <InputNumber
          placeholder='Priority'
          value={item.priority}
          onChange={(value) => setItem({ ...item, priority: value ?? 0 })}
          className='w-40'
        />
        <Button
          type="primary"
          className='ml-auto'
          onClick={onClickInstruction}
          loading={instructionMutation.isPending}
        >
          Save
        </Button>
      </div>
      <TextArea
        className="!h-[500px]"
        value={item.msg}
        onChange={(e) => setItem({ ...item, msg: e.target.value })}
      />
    </>
  )
}
