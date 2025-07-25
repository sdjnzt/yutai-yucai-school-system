import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { initDeviceList } from './fireMock';

export default function Device() {
  const [search, setSearch] = useState('');
  const [data] = useState(initDeviceList);

  const columns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '上次巡检时间', dataIndex: 'lastCheck', key: 'lastCheck' },
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
        dataSource={data.filter(e => e.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:10}}
      />
    </Card>
  );
} 