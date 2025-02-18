/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback } from 'react'
import { Typography, Spin, Button, Input, Card, Space, Select, Tag } from 'antd'
import { useMutation } from '@tanstack/react-query'
import VoiceRecorder from './VoiceRecorder'
import { OpenAiCompletionResponse } from '../../types'
import { sendPromptToFlai } from '../../api'

const { Title, Text } = Typography
const { TextArea } = Input

const AiChatPage: React.FC = () => {
  const preparedScenarios = [
    'I have a business of renting the music studios for musicians to... for them to rehearse in. And so we have several places in several addresses across the city and in each place we have like several rooms and we have administrators who works from 9 a.m. to 0 a.m. So this is working time of our studios normally. And also in each studio we have an equipment like guitar amps, drums, this type of stuff. And inside one studio we can move this across the... between the rooms. We can change it between the rooms. So I need an application to manage that.',
    'My business works as follows: I am the owner of a network of schools, specifically music schools. I have many branches in several cities. I employ teachers and have students. Each teacher can have multiple specialties, and a teacher can work at several schools.',
    'Мой бизнес заключается в том, что у меня есть сеть школ. У меня есть преподаватели, ученики, есть несколько школ в разных городах. Соответственно, мне нужно как-то управлять занятиями в этих школах. У каждого преподавателя может быть несколько специальностей.',
    'У меня есть бизнес в Лиссабоне. Я предоставляю туристам услуги поездок на тук-туках. У меня есть водители и сами тук-туки. У каждого водителя есть расписание, как и у каждого тук-тука. Также есть клиенты, которые записываются на поездки. Мне нужно приложение, где я могу видеть полное расписание, управление водителями, тук-туками и клиентами.',
    'Пример сценария 2: Опишите, как создать приложение для управления инвентарем в магазине.',
    'Пример сценария 3: Как автоматизировать процесс обработки заказов в ресторане?',
  ]
  const [prompt, setPrompt] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const { mutate, data, isPending, isError, error } = useMutation<OpenAiCompletionResponse, Error, string>({
    mutationFn: sendPromptToFlai
  })

  const handleSendPrompt = () => {
    if (prompt.trim()) {
      mutate(prompt)
    }
  }

  const handleScenarioChange = (value: string) => {
    setPrompt(value)
  }

  const handleCursorChange = () => {
    if (textAreaRef.current) {
      setCursorPosition(textAreaRef.current.selectionStart)
    }
  }

  const handleVoiceInput = useCallback(
    (recognizedText: string) => {
      const beforeCursor = prompt.slice(0, cursorPosition)
      const afterCursor = prompt.slice(cursorPosition)
      setPrompt(`${beforeCursor}${recognizedText}${afterCursor}`)
      setCursorPosition(cursorPosition + recognizedText.length)
      if (textAreaRef.current) {
        textAreaRef.current.focus()
      }
    },
    [cursorPosition, prompt]
  )

  return (
    <Card className="p-6 bg-gray-100 min-h-screen">
      <Space direction="vertical" size="large" className="w-full">
        <Title level={3} className="mb-4">
          FLAi
        </Title>

        <Select
          className="w-full"
          placeholder="Select a prepared scenario"
          onChange={handleScenarioChange}
          options={preparedScenarios.map((scenario) => ({
            value: scenario,
            label: scenario,
          }))}
        />

        <TextArea
          ref={(node) => {
            textAreaRef.current = node?.resizableTextArea?.textArea || null
          }}
          className="w-full"
          rows={4}
          placeholder="Enter your prompt for the AI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onClick={handleCursorChange}
          onKeyUp={handleCursorChange}
        />

        <Button
          type="primary"
          onClick={handleSendPrompt}
          loading={isPending}
          className="w-full"
        >
          Send Prompt
        </Button>

        <VoiceRecorder onChange={handleVoiceInput} />

        {isPending && (
          <div className="text-center">
            <Spin size="large" />
          </div>
        )}

        {isError && (
          <Text type="danger" className="text-center">
            {error instanceof Error ? error.message : 'An error occurred.'}
          </Text>
        )}

        {data && (
          <Card className="p-4 bg-white shadow">
            <div style={{ marginBottom: 32 }}>
              <Tag color="lime">Prompt tokens: {data.usage.prompt_tokens}</Tag>
              <Tag color="gold">Completion tokens: {data.usage.completion_tokens}</Tag>
              <Tag color="cyan">Total tokens: {data.usage.total_tokens}</Tag>
            </div>
            <div className="space-y-4">
              {data.choices.map((choice: any, index: any) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{choice.message.role}</div>
                  <Text>{choice.message.content}</Text>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Space>
    </Card>
  )
}

export default AiChatPage