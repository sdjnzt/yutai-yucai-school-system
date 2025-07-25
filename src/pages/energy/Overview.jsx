import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { initOverviewData } from './energyMock';

export default function Overview() {
  const [search, setSearch] = useState('');
  const [electricList] = useState(initOverviewData);

  const columns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '能耗(kWh)', dataIndex: 'consumption', key: 'consumption' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
  ];

  function exportExcel() {
    message.success('模拟导出Excel成功');
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索设备名称"
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
        dataSource={electricList.filter(e => e.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </Card>
  );
} 