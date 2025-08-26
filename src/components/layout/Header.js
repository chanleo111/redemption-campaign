import React from 'react';
import { Layout, Button, Dropdown, Space, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

const { Header: AntHeader } = Layout;
const { Text } = Typography;



const Header = ({ collapsed, onToggle, user, userMenuItems, t }) => {
  const { i18n } = useTranslation();
  const languageItems = [
    {
      key: 'en',
      label: 'English',
      onClick: () => {
        localStorage.setItem('language', 'en');
        i18n.changeLanguage('en');
      },
    },
    {
      key: 'zh',
      label: '中文',
      onClick: () => {
        localStorage.setItem('language', 'zh');
        i18n.changeLanguage('zh');
      },
    },
  ];

  return (
    <AntHeader style={{ 
      padding: '0 16px', 
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)'
    }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{ fontSize: '16px', width: 64, height: 64 }}
      />
      
      <Space size="middle">
        <Dropdown
          menu={{ items: languageItems }}
          placement="bottomRight"
        >
          <Button type="text" icon={<GlobalOutlined />}>
            {i18n.language === 'zh' ? '中文' : 'EN'}
          </Button>
        </Dropdown>
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
        >
          <Space>
            <UserOutlined />
            <Text>{user?.phone_number}</Text>
            <Text type="secondary">({user?.points_balance} points)</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;