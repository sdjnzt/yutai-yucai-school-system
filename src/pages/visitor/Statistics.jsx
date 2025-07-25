import React, { useState } from 'react';
import { Card, DatePicker, Select, Button, Space } from 'antd';
import { ExportOutlined, BarChartOutlined, PieChartOutlined, LineChartOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import ReactECharts from 'echarts-for-react';

const { RangePicker } = DatePicker;

// 模拟统计数据
const mockStats = {
  byDate: [
    { date: '2025-05-10', count: 12 },
    { date: '2025-05-11', count: 18 },
    { date: '2025-05-12', count: 9 },
    { date: '2025-05-13', count: 15 },
  ],
  byStatus: [
    { status: '已进园', value: 20 },
    { status: '已出园', value: 15 },
    { status: '未进园', value: 5 },
    { status: '异常', value: 2 },
  ],
  byDept: [
    { dept: '技术部', value: 10 },
    { dept: '行政部', value: 8 },
    { dept: '管理层', value: 6 },
    { dept: '其他', value: 8 },
  ],
  byHost: [
    { host: '王建国', value: 12 },
    { host: '李明', value: 7 },
    { host: '赵云', value: 6 },
    { host: '其他', value: 7 },
  ],
};

export default function Statistics() {
  // const [dateRange, setDateRange] = useState([]); // 移除未使用变量
  const [chartType, setChartType] = useState('bar');
  const [dimension, setDimension] = useState('byDate');

  // 图表配置
  function getOption() {
    if (dimension === 'byDate') {
      return {
        title: { text: '按日期访客统计', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: mockStats.byDate.map(d => d.date) },
        yAxis: { type: 'value' },
        series: [{
          data: mockStats.byDate.map(d => d.count),
          type: chartType,
          smooth: chartType === 'line',
          barWidth: '40%',
        }],
      };
    }
    if (dimension === 'byStatus') {
      return {
        title: { text: '按状态分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [{
          name: '状态',
          type: 'pie',
          radius: ['40%', '70%'],
          data: mockStats.byStatus.map(s => ({ name: s.status, value: s.value })),
        }],
      };
    }
    if (dimension === 'byDept') {
      return {
        title: { text: '按部门统计', left: 'center' },
        tooltip: { trigger: 'item' },
        xAxis: { type: 'category', data: mockStats.byDept.map(d => d.dept) },
        yAxis: { type: 'value' },
        series: [{
          data: mockStats.byDept.map(d => d.value),
          type: chartType === 'pie' ? 'pie' : chartType,
          ...(chartType === 'pie' ? { radius: ['40%', '70%'], center: ['50%', '50%'],
            data: mockStats.byDept.map(d => ({ name: d.dept, value: d.value })) } : {}),
        }],
      };
    }
    if (dimension === 'byHost') {
      return {
        title: { text: '按被访人统计', left: 'center' },
        tooltip: { trigger: 'item' },
        xAxis: { type: 'category', data: mockStats.byHost.map(d => d.host) },
        yAxis: { type: 'value' },
        series: [{
          data: mockStats.byHost.map(d => d.value),
          type: chartType === 'pie' ? 'pie' : chartType,
          ...(chartType === 'pie' ? { radius: ['40%', '70%'], center: ['50%', '50%'],
            data: mockStats.byHost.map(d => ({ name: d.host, value: d.value })) } : {}),
        }],
      };
    }
    return {};
  }

  function exportExcel() {
    let data = [];
    if (dimension === 'byDate') data = mockStats.byDate;
    if (dimension === 'byStatus') data = mockStats.byStatus;
    if (dimension === 'byDept') data = mockStats.byDept;
    if (dimension === 'byHost') data = mockStats.byHost;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '访客统计');
    XLSX.writeFile(wb, '访客统计.xlsx');
  }

  return (
    <Card className="content-card" style={{ minHeight: 500, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #f0f1f2' }}>
      <Space style={{ marginBottom: 24 }}>
        <RangePicker onChange={() => {}} />
        <Select
          value={dimension}
          style={{ width: 140 }}
          onChange={setDimension}
          options={[
            { value: 'byDate', label: '按日期' },
            { value: 'byStatus', label: '按状态' },
            { value: 'byDept', label: '按部门' },
            { value: 'byHost', label: '按被访人' },
          ]}
        />
        <Select
          value={chartType}
          style={{ width: 120 }}
          onChange={setChartType}
          options={[
            { value: 'bar', label: <><BarChartOutlined /> 柱状图</> },
            { value: 'line', label: <><LineChartOutlined /> 折线图</> },
            { value: 'pie', label: <><PieChartOutlined /> 饼图</> },
          ]}
        />
        <Button icon={<ExportOutlined />} onClick={exportExcel}>导出统计数据</Button>
      </Space>
      <ReactECharts option={getOption()} style={{ height: 400 }} />
    </Card>
  );
} 