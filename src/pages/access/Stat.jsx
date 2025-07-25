import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Statistic, Select, DatePicker, Button } from 'antd';
// 这里用ECharts做图表展示
import * as echarts from 'echarts';

const departments = ['技术部', '行政部', '管理层', '财务部'];
const doors = ['1号楼北门', '2号楼南门', '3号楼西门', '4号楼东门'];

const mockStat = {
  total: 15678,
  abnormal: 31,
  active: 412,
  peak: [
    ['08:00', 180], ['09:00', 420], ['10:00', 600], ['11:00', 900], ['12:00', 700], ['13:00', 500], ['14:00', 300],
  ],
  abnormalType: [
    { value: 14, name: '未授权通行' },
    { value: 10, name: '门未关好' },
    { value: 7, name: '其他' },
  ],
  abnormalTrend: [120, 90, 60, 40, 30, 20, 10],
  heat: [
    { name: '1号楼北门', value: 1200 },
    { name: '2号楼南门', value: 900 },
    { name: '3号楼西门', value: 700 },
    { name: '4号楼东门', value: 500 },
  ],
};

export default function Stat() {
  const [dimension, setDimension] = useState('部门');
  const [selected, setSelected] = useState();
  const peakRef = useRef();
  const abnormalRef = useRef();
  const trendRef = useRef();
  const heatRef = useRef();

  useEffect(() => {
    const peakChart = echarts.init(peakRef.current);
    peakChart.setOption({
      title: { text: '通行高峰时段' },
      xAxis: { type: 'category', data: mockStat.peak.map(i => i[0]) },
      yAxis: { type: 'value' },
      series: [{ data: mockStat.peak.map(i => i[1]), type: 'bar', smooth: true }],
      tooltip: {},
    });
    const abnormalChart = echarts.init(abnormalRef.current);
    abnormalChart.setOption({
      title: { text: '异常事件类型统计' },
      tooltip: { trigger: 'item' },
      legend: { top: '5%', left: 'center' },
      series: [
        {
          name: '异常类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: mockStat.abnormalType,
        },
      ],
    });
    const trendChart = echarts.init(trendRef.current);
    trendChart.setOption({
      title: { text: '异常事件趋势' },
      xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
      yAxis: { type: 'value' },
      series: [{ data: mockStat.abnormalTrend, type: 'line', smooth: true }],
      tooltip: {},
    });
    const heatChart = echarts.init(heatRef.current);
    heatChart.setOption({
      title: { text: '门点通行统计' },
      xAxis: { type: 'category', data: mockStat.heat.map(i => i.name) },
      yAxis: { type: 'value' },
      series: [{ data: mockStat.heat.map(i => i.value), type: 'bar', label: { show: true, position: 'top' } }],
      tooltip: {},
    });
    return () => {
      peakChart.dispose();
      abnormalChart.dispose();
      trendChart.dispose();
      heatChart.dispose();
    };
  }, []);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="今日通行总数" value={mockStat.total} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日异常次数" value={mockStat.abnormal} valueStyle={{ color: 'red' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃人员数" value={mockStat.active} valueStyle={{ color: 'blue' }} /></Card></Col>
        <Col span={6}>
          <Select value={dimension} style={{ width: 120 }} onChange={setDimension} options={[{ value: '部门', label: '按部门' }, { value: '门点', label: '按门点' }]} />
          <Select allowClear placeholder={dimension==='部门'?'选择部门':'选择门点'} style={{ width: 120, marginLeft: 8 }} options={(dimension==='部门'?departments:doors).map(d => ({ value: d, label: d }))} value={selected} onChange={setSelected} />
          <DatePicker.RangePicker style={{ marginLeft: 8 }} />
          <Button style={{ marginLeft: 8 }}>导出报表</Button>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Card><div ref={peakRef} style={{ height: 320 }} /></Card></Col>
        <Col span={12}><Card><div ref={abnormalRef} style={{ height: 320 }} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}><Card><div ref={trendRef} style={{ height: 320 }} /></Card></Col>
        <Col span={12}><Card><div ref={heatRef} style={{ height: 320 }} /></Card></Col>
      </Row>
    </div>
  );
} 