import React, { useState } from 'react';
import { Table, Tag, Button, Space, DatePicker, Input } from 'antd';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';

const mockLogs = [
  { key: '1', time: '2025-05-10 09:00', user: '王建国', action: '登录系统', ip: '192.168.1.10', result: '成功' },
  { key: '2', time: '2025-05-10 09:05', user: '李明', action: '修改用户', ip: '192.168.1.11', result: '成功' },
  { key: '3', time: '2025-05-10 09:10', user: '赵云', action: '删除摄像头', ip: '192.168.1.12', result: '失败' },
];

export default function LogAudit() {
  const [data] = useState(mockLogs);

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '操作', dataIndex: 'action', key: 'action' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '结果', dataIndex: 'result', key: 'result', render: r => r === '成功' ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag> },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker />
        <Input placeholder="用户/操作/IP" style={{ width: 200 }} prefix={<SearchOutlined />} />
        <Button icon={<ExportOutlined />}>导出日志</Button>
      </Space>
      <Table columns={columns} dataSource={data} bordered rowKey="key" />
    </div>
  );
} 