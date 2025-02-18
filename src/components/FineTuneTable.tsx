import React from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import JobStatus from './JobStatus'
import { FineTune } from '../entities'

interface FineTuneTableProps {
  items: FineTune[];
}

const FineTuneTable: React.FC<FineTuneTableProps> = ({ items }) => {
  // Определяем колонки для таблицы
  const columns: ColumnsType<FineTune> = [
    {
      title: 'Training File',
      dataIndex: 'trainingFileName',
      key: 'trainingFileName',
    },
    {
      title: 'Date',
      dataIndex: '_created',
      key: '_created',
      render: (text: string) => dayjs(text).format('DD MMM HH:mm:ss'), // Форматируем дату
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (<JobStatus status={status}/>),
    },
  ]

  return (
    <Table
      dataSource={items}
      columns={columns}
      rowKey="id" // Указываем уникальный ключ для строк таблицы
      pagination={{ pageSize: 10 }} // Пагинация по 10 записей на странице
    />
  )
}

export default FineTuneTable