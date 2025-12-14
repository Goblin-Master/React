import React from 'react';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { v4 as uuidv4 } from 'uuid';
const App: React.FC = () => (
  <Tabs
    defaultActiveKey="2"
    items={[AppleOutlined, AndroidOutlined].map((Icon) => (
      {
        key: uuidv4(),
        label: `${Icon.displayName}`,
        children: <div>Hello {Icon.displayName}</div>,
        icon: <Icon />,
      }
    ))}
  />
);

export default App;