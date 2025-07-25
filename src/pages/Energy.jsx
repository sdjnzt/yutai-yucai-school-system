import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, DatePicker, message, Tag, Select } from 'antd';
import { ThunderboltOutlined, FireOutlined, CloudOutlined, BarChartOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';

const { TabPane } = Tabs;
const { Option } = Select;

// 模拟用电数据（2025年5月）
const electricList = [
  { id: 1, name: '空调', consumption: 120, lastUpdate: '2025-05-10 08:00:00', status: '正常' },
  { id: 2, name: '照明', consumption: 80, lastUpdate: '2025-05-10 08:05:00', status: '异常' },
  { id: 3, name: '电梯', consumption: 60, lastUpdate: '2025-05-10 08:10:00', status: '正常' },
];

// 模拟用水数据
const waterList = [
  { id: 11, name: '办公楼', consumption: 30, lastUpdate: '2025-05-10 08:00:00', status: '正常' },
  { id: 12, name: '宿舍楼', consumption: 50, lastUpdate: '2025-05-10 08:05:00', status: '正常' },
];

// 模拟用气数据
const gasList = [
  { id: 21, name: '食堂', consumption: 20, lastUpdate: '2025-05-10 08:00:00', status: '正常' },
  { id: 22, name: '锅炉房', consumption: 40, lastUpdate: '2025-05-10 08:05:00', status: '异常' },
];

// 只保留2025年1~5月的能耗数据
const statData = [
  { date: '2025-05', electric: 210, water: 60, gas: 40 },
  { date: '2025-05', electric: 220, water: 65, gas: 45 },
  { date: '2025-05', electric: 230, water: 70, gas: 50 },
  { date: '2025-05', electric: 250, water: 75, gas: 55 },
  { date: '2025-05', electric: 260, water: 80, gas: 60 },
];

const months = ['01', '02', '03', '04', '05'];
const quarters = ['Q1', 'Q2'];
const year = '2025';

export default function Energy() {
  const [tab, setTab] = useState('electric');
  const [search, setSearch] = useState('');
  // 统计分析Tab的时间范围选择
  const [statType, setStatType] = useState('month'); // month/quarter/year
  const [statMonth, setStatMonth] = useState('05'); // 默认5月
  const [statQuarter, setStatQuarter] = useState('Q2'); // 默认Q2

  // 用电管理Tab
  const electricColumns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '能耗(kWh)', dataIndex: 'consumption', key: 'consumption' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
  ];
  const renderElectric = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索设备名称"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={electricColumns}
        dataSource={electricList.filter(e => e.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 用水管理Tab
  const waterColumns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '用水量(吨)', dataIndex: 'consumption', key: 'consumption' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
  ];
  const renderWater = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索设备名称"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={waterColumns}
        dataSource={waterList.filter(e => e.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 用气管理Tab
  const gasColumns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '用气量(立方米)', dataIndex: 'consumption', key: 'consumption' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
  ];
  const renderGas = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索设备名称"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={gasColumns}
        dataSource={gasList.filter(e => e.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 统计分析Tab
  const renderStat = () => {
    let chartData = [];
    let title = '';
    if (statType === 'month') {
      // 单月趋势
      const item = statData.find(d => d.date === `${year}-${statMonth}`);
      if (item) {
        chartData = [
          { type: '用电', value: item.electric },
          { type: '用水', value: item.water },
          { type: '用气', value: item.gas },
        ];
      }
      title = `${year}年${statMonth}月能耗分布`;
    } else if (statType === 'quarter') {
      // 季度趋势
      let monthsInQuarter = statQuarter === 'Q1' ? ['01','02','03'] : ['04','05'];
      chartData = statData
        .filter(d => monthsInQuarter.includes(d.date.slice(-2)))
        .flatMap(item => [
          { date: item.date.slice(-2)+'月', type: '用电', value: item.electric },
          { date: item.date.slice(-2)+'月', type: '用水', value: item.water },
          { date: item.date.slice(-2)+'月', type: '用气', value: item.gas },
        ]);
      title = `${year}年${statQuarter}能耗趋势`;
    } else {
      // 年度趋势
      chartData = statData.flatMap(item => [
        { date: item.date.slice(-2)+'月', type: '用电', value: item.electric },
        { date: item.date.slice(-2)+'月', type: '用水', value: item.water },
        { date: item.date.slice(-2)+'月', type: '用气', value: item.gas },
      ]);
      title = `${year}年能耗趋势`;
    }
    return (
      <>
        <div style={{marginBottom:16,display:'flex',gap:16,alignItems:'center'}}>
          <span>统计类型：</span>
          <Select value={statType} onChange={setStatType} style={{width:120}}>
            <Option value="month">月份</Option>
            <Option value="quarter">季度</Option>
            <Option value="year">年份</Option>
          </Select>
          {statType === 'month' && (
            <Select value={statMonth} onChange={setStatMonth} style={{width:140}}>
              {months.map(m => <Option key={m} value={m}>{year}年{m}月</Option>)}
            </Select>
          )}
          {statType === 'quarter' && (
            <Select value={statQuarter} onChange={setStatQuarter} style={{width:140}}>
              {quarters.map(q => <Option key={q} value={q}>{year}年{q}</Option>)}
            </Select>
          )}
          <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
        </div>
        <Card title={title} style={{marginBottom:24}}>
          {statType === 'month' ? (
            <Column
              data={chartData}
              xField="type"
              yField="value"
              color={['#1890ff', '#52c41a', '#faad14']}
              label={{ position: 'middle' }}
              height={320}
            />
          ) : (
            <Column
              data={chartData}
              isGroup
              xField="date"
              yField="value"
              seriesField="type"
              color={['#1890ff', '#52c41a', '#faad14']}
              label={{ position: 'middle' }}
              groupField="type"
              height={320}
            />
          )}
        </Card>
      </>
    );
  };

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><ThunderboltOutlined /> 能耗管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><ThunderboltOutlined /> 用电管理</span>} key="electric">
            {renderElectric()}
          </TabPane>
          <TabPane tab={<span><CloudOutlined /> 用水管理</span>} key="water">
            {renderWater()}
          </TabPane>
          <TabPane tab={<span><FireOutlined /> 用气管理</span>} key="gas">
            {renderGas()}
          </TabPane>
          <TabPane tab={<span><BarChartOutlined /> 统计分析</span>} key="stat">
            {renderStat()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 