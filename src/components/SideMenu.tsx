import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CodeOutlined,
  DatabaseOutlined,
  FireOutlined,
  SettingOutlined,
  SlidersOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Playground', '/flaichat', <UserOutlined />),
  getItem('Fine Tuner', '/finetuner', <SlidersOutlined />),
  getItem('Training Data', '/data', <DatabaseOutlined />),
  getItem('JSON Files', '/jsonfiles', <CodeOutlined />),
  getItem('Instructions', '/instructions', <CodeOutlined />),
  getItem('Ai Response Schemas', '/airesponseschemas', <CodeOutlined />),
  getItem('Admin', 'sub1', <FireOutlined />, [
    getItem('Users', '/admin/users', <UserOutlined />),
    getItem('Settings', '/admin/settings', <SettingOutlined />),
  ]),
]

const SideMenu: React.FC<{ collapsed: boolean; setCollapsed: (value: boolean) => void }> = ({
  collapsed,
  setCollapsed,
}) => {
  const [logo] = useState('./flai-logo-wide.png')
  const navigate = useNavigate()
  const location = useLocation()

  const defaultSelectedKeys = location.pathname

  const handleMenuClick: MenuProps['onClick'] = (e) => navigate(e.key)

  return (
    <Sider
      theme="light"
      width={200}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div className="demo-logo-vertical" />
      <img
        src={logo}
        alt="Logo"
        style={{
          height: collapsed ? '3rem' : '7rem',
          objectFit: 'contain',
          padding: '1rem 0.5rem',
          transition: 'height 0.3s',
        }}
        className="w-full"
      />
      <Menu
        theme="light"
        defaultSelectedKeys={[defaultSelectedKeys]}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  )
}

export default SideMenu