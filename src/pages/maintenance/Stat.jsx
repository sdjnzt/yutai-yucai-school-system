import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Select, Button, Tooltip } from 'antd';
import { BarChartOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { initTaskList } from './maintenanceMock';

const { Option } = Select;

export default function Stat() {
  const [type, setType] = useState('all');
  const [data] = useState(initTaskList);

  // 统计数据
  const stats = useMemo(() => {
    const total = data.length;
    const done = data.filter(t => t.status === '已完成').length;
    const doing = data.filter(t => t.status === '处理中').length;
    const todo = data.filter(t => t.status === '待处理').length;
    return { total, done, doing, todo };
  }, [data]);

  // 图表数据
  const chartData = [
    { type: '已完成', value: stats.done },
    { type: '处理中', value: stats.doing },
    { type: '待处理', value: stats.todo },
  ];

  function exportExcel() {
    window.alert('模拟导出Excel成功');
  }

  const cardColors = {
    total: '#1890ff',
    done: '#52c41a',
    doing: '#faad14',
    todo: '#f5222d',
  };

  return (
    <div>
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
            <div style={{ color: cardColors.total, fontSize: 14, marginBottom: 4 }}>任务总数</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: cardColors.total }}>{stats.total}</div>
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
            <div style={{ color: cardColors.done, fontSize: 14, marginBottom: 4 }}>已完成</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: cardColors.done }}>{stats.done}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #fffbe6',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#fffbe6'
          }}>
            <div style={{ color: cardColors.doing, fontSize: 14, marginBottom: 4 }}>处理中</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: cardColors.doing }}>{stats.doing}</div>
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
            <div style={{ color: cardColors.todo, fontSize: 14, marginBottom: 4 }}>待处理</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: cardColors.todo }}>{stats.todo}</div>
          </Card>
        </Col>
      </Row>
      <Card className="content-card" style={{borderRadius:14,boxShadow:'0 4px 24px #f0f5ff'}}>
        <div style={{marginBottom:24,display:'flex',gap:16,alignItems:'center'}}>
          <span>统计类型：</span>
          <Select value={type} onChange={setType} style={{width:160}}>
            <Option value="all">全部任务</Option>
            <Option value="done">已完成</Option>
            <Option value="doing">处理中</Option>
            <Option value="todo">待处理</Option>
          </Select>
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>导出Excel</Button>
        </div>
        <Column
          data={type==='all'?chartData:chartData.filter(c=>c.type===(
            type==='done'?'已完成':type==='doing'?'处理中':'待处理'))}
          xField="type"
          yField="value"
          color={[cardColors.done, cardColors.doing, cardColors.todo]}
          columnStyle={{borderRadius:8}}
          height={360}
          meta={{value:{alias:'任务数'}}}
          tooltip={{showMarkers:true}}
          animation
        />
      </Card>
    </div>
  );
} 