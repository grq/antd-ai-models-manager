import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import DashboadPage from './pages/Dashboad'
import MainLayout from './layout/Main'
import UsersPage from './pages/admin/Users'
import AiChatPage from './pages/AiChat'
import JsonFilesPage from './pages/JsonFiles'
import { ConfigProvider } from 'antd'
import FineTunerPage from './pages/FineTuner'
import TrainingFilesPage from './pages/TrainingFiles'
import TrainingDataPage from './pages/TrainingData'
import TrainingContextsPage from './pages/TrainingContexts'
import InstructionsPage from './pages/instructions'
import AiResponseSchemasPage from './pages/ai-response-schemas'

const App: React.FC = () => {
  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#009efa',
        colorSuccess: '#52c41a',       // Цвет для успешных сообщений
        colorWarning: '#faad14',       // Цвет для предупреждений
        colorError: '#ff4d4f',         // Цвет для ошибок
        colorInfo: '#1890ff',          // Цвет для информационных сооб
        colorBgBase: '#ffffff'
      },
    }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<DashboadPage />} />
            <Route path="flaichat" element={<AiChatPage />} />
            <Route path="finetuner" element={<FineTunerPage />} />
            <Route path="files" element={<TrainingFilesPage />} />
            <Route path="instructions" element={<InstructionsPage />} />
            <Route path="airesponseschemas" element={<AiResponseSchemasPage />} />
            <Route path="contexts" element={<TrainingContextsPage />} />
            <Route path="data" element={<TrainingDataPage />} />
            <Route path="jsonfiles" element={<JsonFilesPage />} />
            <Route path="admin/users" element={<UsersPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App