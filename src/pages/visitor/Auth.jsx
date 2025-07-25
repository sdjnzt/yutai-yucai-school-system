import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, message } from 'antd';
import { SearchOutlined, DownloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { initAuthList } from './visitorMock';

export default function Auth() {
  const [search, setSearch] = useState('');
  const [authList, setAuthList] = useState(initAuthList);

  const columns = [
    { title: '访客ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '门禁权限', dataIndex: 'access', key: 'access' },
    { title: '车牌号', dataIndex: 'car', key: 'car' },
    { title: '被访人', dataIndex: 'host', key: 'host' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='已下发'?<Tag color="green">已下发</Tag>:<Tag color="orange">未下发</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<SafetyCertificateOutlined />} type="primary" onClick={() => {
          setAuthList(list=>list.map(a=>a.id===record.id?{...a,status:'已下发'}:a));
          message.success('权限下发成功');
        }}>下发</Button>
      )
    }
  ];

  function exportExcel(data, sheetName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(authList, '权限下发')}>导出Excel</Button>
      </div>
      <Table
        columns={columns}
        dataSource={authList.filter(a => a.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </Card>
  );
} 