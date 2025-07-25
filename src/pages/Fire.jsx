import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, Modal, Select, DatePicker, message, Tag } from 'antd';
import { AlertOutlined, ClusterOutlined, FileSearchOutlined, LinkOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

// 模拟报警主机数据（2025年5月）
const hostList = [
  { id: 1, name: '主机A', status: '在线', area: '1号楼', lastUpdate: '2025-05-10 08:00:00' },
  { id: 2, name: '主机B', status: '离线', area: '2号楼', lastUpdate: '2025-05-18 07:50:00' },
];

// 模拟防区数据
const zoneList = [
  { id: 101, name: '1号楼-1层', host: '主机A', type: '烟感', status: '布防', lastAlarm: '2025-05-12 09:00:00' },
  { id: 102, name: '1号楼-2层', host: '主机A', type: '门磁', status: '撤防', lastAlarm: '2025-05-20 10:00:00' },
  { id: 103, name: '2号楼-1层', host: '主机B', type: '红外', status: '布防', lastAlarm: '2025-05-28 11:00:00' },
];

// 模拟报警记录
const alarmList = [
  { id: 201, zone: '1号楼-1层', type: '烟感报警', time: '2025-05-12 09:01:00', status: '已处理' },
  { id: 202, zone: '2号楼-1层', type: '红外报警', time: '2025-05-20 11:05:00', status: '未处理' },
];

// 模拟联动记录
const linkList = [
  { id: 301, alarm: '烟感报警', action: '联动视频', time: '2025-05-12 09:01:10', result: '成功' },
  { id: 302, alarm: '红外报警', action: '抓拍', time: '2025-05-20 11:05:10', result: '成功' },
];

export default function Fire() {
  const [tab, setTab] = useState('host');
  const [search, setSearch] = useState('');
  const [zoneType, setZoneType] = useState('');
  const [alarmDate, setAlarmDate] = useState(null);

  // 报警主机管理Tab
  const hostColumns = [
    { title: '主机ID', dataIndex: 'id', key: 'id' },
    { title: '主机名称', dataIndex: 'name', key: 'name' },
    { title: '所属区域', dataIndex: 'area', key: 'area' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='在线'?<Tag color="green">在线</Tag>:<Tag color="red">离线</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
    {
      title: '操作',
      key: 'action',
      render: () => <Button icon={<AlertOutlined />} onClick={()=>message.info('模拟布撤防')}>布撤防</Button>
    }
  ];
  const renderHost = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索主机名称/区域"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={hostColumns}
        dataSource={hostList.filter(h => h.name.includes(search) || h.area.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 防区管理Tab
  const zoneColumns = [
    { title: '防区ID', dataIndex: 'id', key: 'id' },
    { title: '防区名称', dataIndex: 'name', key: 'name' },
    { title: '主机', dataIndex: 'host', key: 'host' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='布防'?<Tag color="blue">布防</Tag>:<Tag color="orange">撤防</Tag> },
    { title: '最近报警', dataIndex: 'lastAlarm', key: 'lastAlarm' },
    {
      title: '操作',
      key: 'action',
      render: () => <Button icon={<ClusterOutlined />} onClick={()=>message.info('模拟防区操作')}>操作</Button>
    }
  ];
  const renderZone = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Select
          placeholder="类型筛选"
          allowClear
          style={{width:160}}
          value={zoneType}
          onChange={setZoneType}
        >
          <Option value="烟感">烟感</Option>
          <Option value="门磁">门磁</Option>
          <Option value="红外">红外</Option>
        </Select>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={zoneColumns}
        dataSource={zoneList.filter(z => !zoneType || z.type===zoneType)}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 报警记录Tab
  const alarmColumns = [
    { title: '防区', dataIndex: 'zone', key: 'zone' },
    { title: '报警类型', dataIndex: 'type', key: 'type' },
    { title: '报警时间', dataIndex: 'time', key: 'time' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='已处理'?<Tag color="green">已处理</Tag>:<Tag color="red">未处理</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, r) => r.status==='未处理'?<Button icon={<FileSearchOutlined />} onClick={()=>message.success('模拟处理成功')}>处理</Button>:null
    }
  ];
  const renderAlarm = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索防区"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:200}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <DatePicker
          picker="date"
          placeholder="选择日期"
          style={{width:160}}
          value={alarmDate}
          onChange={setAlarmDate}
          allowClear
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={alarmColumns}
        dataSource={alarmList.filter(a => (!search || a.zone.includes(search)) && (!alarmDate || a.time.startsWith(alarmDate.format('YYYY-MM-DD'))))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 报警联动Tab
  const linkColumns = [
    { title: '报警类型', dataIndex: 'alarm', key: 'alarm' },
    { title: '联动操作', dataIndex: 'action', key: 'action' },
    { title: '联动时间', dataIndex: 'time', key: 'time' },
    { title: '结果', dataIndex: 'result', key: 'result', render: r => r==='成功'?<Tag color="green">成功</Tag>:<Tag color="red">失败</Tag> },
  ];
  const renderLink = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={linkColumns}
        dataSource={linkList}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><AlertOutlined /> 报警管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><AlertOutlined /> 主机管理</span>} key="host">
            {renderHost()}
          </TabPane>
          <TabPane tab={<span><ClusterOutlined /> 防区管理</span>} key="zone">
            {renderZone()}
          </TabPane>
          <TabPane tab={<span><FileSearchOutlined /> 报警记录</span>} key="alarm">
            {renderAlarm()}
          </TabPane>
          <TabPane tab={<span><LinkOutlined /> 报警联动</span>} key="link">
            {renderLink()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 