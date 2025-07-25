import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Select, message } from 'antd';
import { DownloadOutlined, BarChartOutlined, FireOutlined, AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import * as XLSX from 'xlsx';

const { Option } = Select;

// mock 数据
const statDataDay = Array.from({length: 7}, (_,i)=>({ date: `2025-05-0${i+1}`, count: Math.floor(Math.random()*8+2) }));
const statDataWeek = Array.from({length: 4}, (_,i)=>({ date: `第${i+1}周`, count: Math.floor(Math.random()*30+10) }));
const statDataMonth = Array.from({length: 6}, (_,i)=>({ date: `2025-0${i+1}`, count: Math.floor(Math.random()*50+20) }));

const deviceStatusData = [
  { type: '正常', value: 120 },
  { type: '异常', value: 8 },
  { type: '离线', value: 5 },
];

const alarmTotal = statDataDay.reduce((sum, d) => sum + d.count, 0) + statDataWeek.reduce((sum, d) => sum + d.count, 0) + statDataMonth.reduce((sum, d) => sum + d.count, 0);
const deviceTotal = deviceStatusData.reduce((sum, d) => sum + d.value, 0);
const abnormalTotal = deviceStatusData.find(d => d.type === '异常')?.value || 0;
const offlineTotal = deviceStatusData.find(d => d.type === '离线')?.value || 0;

export default function Stat() {
  const [statType, setStatType] = useState('day');
  const statData = statType==='day'?statDataDay:statType==='week'?statDataWeek:statDataMonth;

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(statData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '报警趋势');
    XLSX.writeFile(wb, `消防报警统计-${statType}.xlsx`);
    message.success('导出成功');
  }

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><BarChartOutlined /> 消防统计分析</h2>
      </div>
      <Row gutter={16} style={{marginBottom:24}}>
        <Col span={6}>
          <Card><Statistic title="报警总数" value={alarmTotal} prefix={<AlertOutlined style={{color:'#faad14'}} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="设备总数" value={deviceTotal} prefix={<FireOutlined style={{color:'#1890ff'}} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="异常设备" value={abnormalTotal} prefix={<AlertOutlined style={{color:'#ff4d4f'}} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="离线设备" value={offlineTotal} prefix={<CheckCircleOutlined style={{color:'#bfbfbf'}} />} /></Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="报警趋势">
            <div style={{marginBottom:16,display:'flex',gap:16,alignItems:'center'}}>
              <Select value={statType} onChange={setStatType} style={{width:120}}>
                <Option value="day">按日</Option>
                <Option value="week">按周</Option>
                <Option value="month">按月</Option>
              </Select>
              <Button icon={<DownloadOutlined />} onClick={exportExcel}>导出Excel</Button>
            </div>
            <Line
              data={statData}
              xField="date"
              yField="count"
              point={{ size: 4, shape: 'circle' }}
              color="#fa541c"
              height={320}
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
              height={320}
              color={[ '#1890ff', '#ff4d4f', '#bfbfbf' ]}
              animation
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 