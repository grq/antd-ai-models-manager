import React, { useState } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import SideMenu from '../components/SideMenu'

const { Footer, Content } = Layout

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // Dynamically adjust margin based on collapsed state
          transition: 'margin-left 0.3s', // Smooth transition
        }}
      >
        <Content style={{ padding: '24px', overflow: 'auto' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', fontSize: 10 }}>
          FLAi ©{new Date().getFullYear()} Created by FrameLink
        </Footer>
      </Layout>
    </Layout>
  )
}

export default MainLayout