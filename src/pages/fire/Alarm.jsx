import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { initAlarmList } from './fireMock';

export default function Alarm() {
  const [search, setSearch] = useState('');
  const [data] = useState(initAlarmList);

  const columns = [
    { title: '告警ID', dataIndex: 'id', key: 'id' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '点位', dataIndex: 'location', key: 'location' },
    { title: '级别', dataIndex: 'level', key: 'level', render: l => l==='高'?<Tag color="red">高</Tag>:l==='中'?<Tag color="orange">中</Tag>:<Tag color="blue">低</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='已处理'?<Tag color="green">已处理</Tag>:s==='处理中'?<Tag color="orange">处理中</Tag>:<Tag color="red">未处理</Tag> },
    { title: '告警时间', dataIndex: 'time', key: 'time' },
  ];

  function exportExcel() {
    message.success('模拟导出Excel成功');
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索点位"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={exportExcel}>导出Excel</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(e => e.location.includes(search))}
        rowKey="id"
        pagination={{pageSize:10}}
      />
    </Card>
  );
} 