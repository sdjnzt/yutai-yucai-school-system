import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Table, Input, Tag, message } from 'antd';
import { DownloadOutlined, FireOutlined, AlertOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import * as XLSX from 'xlsx';

// mock 数据
const statDataDay = Array.from({length: 7}, (_,i)=>({ date: `2025-05-0${i+1}`, count: Math.floor(Math.random()*8+2) }));
const deviceStatusData = [
  { type: '正常', value: 120 },
  { type: '异常', value: 8 },
  { type: '离线', value: 5 },
];
const alarmList = Array.from({length: 20}, (_,i) => ({
  id: 1000+i+1,
  device: `烟感探测器-${i+1}`,
  location: `A区${i+1}层${Math.ceil(Math.random()*10)}号`,
  time: `2025-05-${Math.floor(Math.random()*9+1)} ${Math.floor(Math.random()*24).toString().padStart(2,'0')}:${Math.floor(Math.random()*60).toString().padStart(2,'0')}`,
  type: ['烟雾报警','温度报警','手动报警'][Math.floor(Math.random()*3)],
  status: ['已处理','未处理'][Math.floor(Math.random()*2)]
}));

const alarmTotal = statDataDay.reduce((sum, d) => sum + d.count, 0);
const todayAlarm = statDataDay[statDataDay.length-1].count;
// const deviceTotal = deviceStatusData.reduce((sum, d) => sum + d.value, 0); // 已不使用，注释掉
const abnormalTotal = deviceStatusData.find(d => d.type === '异常')?.value || 0;
const offlineTotal = deviceStatusData.find(d => d.type === '离线')?.value || 0;

export default function Overview() {
  const [search, setSearch] = useState('');

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(alarmList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '最新报警');
    XLSX.writeFile(wb, `消防最新报警.xlsx`);
    message.success('导出成功');
  }

  const columns = [
    { title: '报警ID', dataIndex: 'id', key: 'id' },
    { title: '设备', dataIndex: 'device', key: 'device' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '类型', dataIndex: 'type', key: 'type', render: t => <Tag color={t==='烟雾报警'?'volcano':t==='温度报警'?'orange':'blue'}>{t}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='已处理'?<Tag color="green">已处理</Tag>:<Tag color="red">未处理</Tag> },
  ];

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><FireOutlined /> 消防总览</h2>
      </div>
      <Row gutter={16} style={{marginBottom:24}}>
        <Col span={6}>
          <Card><Statistic title="报警总数" value={alarmTotal} prefix={<AlertOutlined style={{color:'#faad14'}} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日报警" value={todayAlarm} prefix={<AlertOutlined style={{color:'#ff4d4f'}} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="异常设备" value={abnormalTotal} prefix={<AlertOutlined style={{color:'#ff4d4f'}} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="离线设备" value={offlineTotal} prefix={<CheckCircleOutlined style={{color:'#bfbfbf'}} />} /></Card>
        </Col>
      </Row>
      <Row gutter={16} style={{marginBottom:24}}>
        <Col span={16}>
          <Card title="报警趋势">
            <Line
              data={statDataDay}
              xField="date"
              yField="count"
              point={{ size: 4, shape: 'circle' }}
              color="#fa541c"
              height={240}
              animation
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="设备状态分布">
            <Pie
              data={deviceStatusData}
              angleField="value"
              colorField="type"
              radius={0.9}
              label={{ type: 'outer', content: (data) => `${data.type} ${(data.percent*100).toFixed(1)}%` }}
              legend={{ position: 'bottom' }}
              height={240}
              color={[ '#1890ff', '#ff4d4f', '#bfbfbf' ]}
              animation
            />
          </Card>
        </Col>
      </Row>
      <Card title="最新报警列表" extra={<Button icon={<DownloadOutlined />} onClick={exportExcel}>导出Excel</Button>}>
        <div style={{marginBottom:16,display:'flex',gap:16}}>
          <Input.Search
            placeholder="搜索设备/位置"
            allowClear
            enterButton={<SearchOutlined />}
            style={{width:300}}
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={alarmList.filter(a => a.device.includes(search) || a.location.includes(search))}
          rowKey="id"
          pagination={{pageSize:8}}
        />
      </Card>
    </div>
  );
} 