import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, message, Row, Col } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { initOverviewData } from './maintenanceMock';

export default function Overview() {
  const [search, setSearch] = useState('');
  const [data] = useState(initOverviewData);

  const columns = [
    { title: '巡检ID', dataIndex: 'id', key: 'id' },
    { title: '巡检名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
  ];

  function exportExcel() {
    message.success('模拟导出Excel成功');
  }

  // 统计数据
  const total = data.length;
  const normal = data.filter(e=>e.status==='正常').length;
  const abnormal = data.filter(e=>e.status==='异常').length;

  return (
    <Card className="content-card">
      <Row gutter={[32, 24]} style={{marginBottom:24}}>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #e6f7ff',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#f8fafc'
          }}>
            <div style={{ color: '#1890ff', fontSize: 14, marginBottom: 4 }}>总巡检数</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#1890ff' }}>{total}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #f6ffed',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#f6fffb'
          }}>
            <div style={{ color: '#52c41a', fontSize: 14, marginBottom: 4 }}>正常</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#52c41a' }}>{normal}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #fff1f0',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#fff1f0'
          }}>
            <div style={{ color: '#ff4d4f', fontSize: 14, marginBottom: 4 }}>异常</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#ff4d4f' }}>{abnormal}</div>
          </Card>
        </Col>
      </Row>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索巡检名称"
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