import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { initTaskList } from './maintenanceMock';

export default function Task() {
  const [search, setSearch] = useState('');
  const [data] = useState(initTaskList);

  const columns = [
    { title: '任务ID', dataIndex: 'id', key: 'id' },
    { title: '任务标题', dataIndex: 'title', key: 'title' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='已完成'?<Tag color="green">已完成</Tag>:s==='处理中'?<Tag color="blue">处理中</Tag>:<Tag color="orange">待处理</Tag> },
    { title: '负责人', dataIndex: 'responsible', key: 'responsible' },
    { title: '创建时间', dataIndex: 'time', key: 'time' },
  ];

  function exportExcel() {
    message.success('模拟导出Excel成功');
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索任务标题"
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
        dataSource={data.filter(e => e.title.includes(search))}
        rowKey="id"
        pagination={{pageSize:10}}
      />
    </Card>
  );
} 