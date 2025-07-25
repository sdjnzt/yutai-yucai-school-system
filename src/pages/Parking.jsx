import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, Modal, Select, DatePicker, message, Tag } from 'antd';
import { CarOutlined, GatewayOutlined, AppstoreOutlined, DollarOutlined, UserSwitchOutlined, WarningOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

// 模拟出入口数据（2025年5月）
const gateList = [
  { id: 1, name: '北门', type: '车行', status: '正常', lastUpdate: '2025-05-10 08:00:00' },
  { id: 2, name: '南门', type: '人行', status: '异常', lastUpdate: '2025-05-10 08:05:00' },
];

// 模拟场区数据
const areaList = [
  { id: 101, name: 'A区', total: 100, used: 80, free: 20 },
  { id: 102, name: 'B区', total: 80, used: 60, free: 20 },
];

// 模拟车位数据
const parkingList = [
  { id: 201, location: 'A区-01', status: '已占用', lastUpdate: '2025-05-10 08:00:00' },
  { id: 202, location: 'A区-02', status: '空闲', lastUpdate: '2025-05-10 08:05:00' },
  { id: 203, location: 'B区-01', status: '已占用', lastUpdate: '2025-05-10 08:10:00' },
];

// 模拟收费规则
const feeList = [
  { id: 301, name: '临时车', rule: '首小时5元，后每小时2元', status: '启用' },
  { id: 302, name: '月租车', rule: '每月200元', status: '启用' },
];

// 模拟用户布控
const controlList = [
  { id: 401, user: '李明', plate: '鲁A12345', type: '黑名单', status: '布控中', time: '2025-05-10 09:00:00' },
  { id: 402, user: '赵秀玲', plate: '鲁B54321', type: '白名单', status: '已解除', time: '2025-05-11 10:00:00' },
];

// 模拟超速报警
const speedList = [
  { id: 501, plate: '鲁A12345', area: 'A区', speed: 35, limit: 20, time: '2025-05-12 12:00:00', status: '未处理' },
  { id: 502, plate: '鲁B54321', area: 'B区', speed: 25, limit: 20, time: '2025-05-13 14:20:00', status: '已处理' },
];

export default function Parking() {
  const [tab, setTab] = useState('gate');
  const [search, setSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [parkingSearch, setParkingSearch] = useState('');
  const [feeSearch, setFeeSearch] = useState('');
  const [controlSearch, setControlSearch] = useState('');
  const [speedSearch, setSpeedSearch] = useState('');
  const [speedDate, setSpeedDate] = useState(null);

  // 出入口管理Tab
  const gateColumns = [
    { title: '出入口ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
    {
      title: '操作',
      key: 'action',
      render: () => <Button icon={<GatewayOutlined />} onClick={()=>message.info('模拟道闸操作')}>道闸</Button>
    }
  ];
  const renderGate = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索名称"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={gateColumns}
        dataSource={gateList.filter(g => g.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 场区管理Tab
  const areaColumns = [
    { title: '场区ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '总车位', dataIndex: 'total', key: 'total' },
    { title: '已用', dataIndex: 'used', key: 'used' },
    { title: '空闲', dataIndex: 'free', key: 'free' },
  ];
  const renderArea = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索场区"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={areaSearch}
          onChange={e=>setAreaSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={areaColumns}
        dataSource={areaList.filter(a => a.name.includes(areaSearch))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 车位管理Tab
  const parkingColumns = [
    { title: '车位ID', dataIndex: 'id', key: 'id' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='空闲'?<Tag color="blue">空闲</Tag>:<Tag color="orange">已占用</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
  ];
  const renderParking = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索位置"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={parkingSearch}
          onChange={e=>setParkingSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={parkingColumns}
        dataSource={parkingList.filter(p => p.location.includes(parkingSearch))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 收费规则Tab
  const feeColumns = [
    { title: '规则ID', dataIndex: 'id', key: 'id' },
    { title: '规则名称', dataIndex: 'name', key: 'name' },
    { title: '计费规则', dataIndex: 'rule', key: 'rule' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='启用'?<Tag color="green">启用</Tag>:<Tag color="red">停用</Tag> },
  ];
  const renderFee = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索规则名称"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={feeSearch}
          onChange={e=>setFeeSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={feeColumns}
        dataSource={feeList.filter(f => f.name.includes(feeSearch))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 用户布控Tab
  const controlColumns = [
    { title: '布控ID', dataIndex: 'id', key: 'id' },
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '车牌号', dataIndex: 'plate', key: 'plate' },
    { title: '类型', dataIndex: 'type', key: 'type', render: t => t==='黑名单'?<Tag color="red">黑名单</Tag>:<Tag color="blue">白名单</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='布控中'?<Tag color="orange">布控中</Tag>:<Tag color="green">已解除</Tag> },
    { title: '布控时间', dataIndex: 'time', key: 'time' },
  ];
  const renderControl = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索用户/车牌"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={controlSearch}
          onChange={e=>setControlSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={controlColumns}
        dataSource={controlList.filter(c => c.user.includes(controlSearch) || c.plate.includes(controlSearch))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 超速报警Tab
  const speedColumns = [
    { title: '报警ID', dataIndex: 'id', key: 'id' },
    { title: '车牌号', dataIndex: 'plate', key: 'plate' },
    { title: '场区', dataIndex: 'area', key: 'area' },
    { title: '速度', dataIndex: 'speed', key: 'speed', render: s => s+'km/h' },
    { title: '限速', dataIndex: 'limit', key: 'limit', render: s => s+'km/h' },
    { title: '报警时间', dataIndex: 'time', key: 'time' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='未处理'?<Tag color="red">未处理</Tag>:<Tag color="green">已处理</Tag> },
  ];
  const renderSpeed = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索车牌"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:200}}
          value={speedSearch}
          onChange={e=>setSpeedSearch(e.target.value)}
        />
        <DatePicker
          picker="date"
          placeholder="选择日期"
          style={{width:160}}
          value={speedDate}
          onChange={setSpeedDate}
          allowClear
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={speedColumns}
        dataSource={speedList.filter(s => (!speedSearch || s.plate.includes(speedSearch)) && (!speedDate || s.time.startsWith(speedDate.format('YYYY-MM-DD'))))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><CarOutlined /> 停车管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><GatewayOutlined /> 出入口管理</span>} key="gate">
            {renderGate()}
          </TabPane>
          <TabPane tab={<span><AppstoreOutlined /> 场区管理</span>} key="area">
            {renderArea()}
          </TabPane>
          <TabPane tab={<span><CarOutlined /> 车位管理</span>} key="parking">
            {renderParking()}
          </TabPane>
          <TabPane tab={<span><DollarOutlined /> 收费规则</span>} key="fee">
            {renderFee()}
          </TabPane>
          <TabPane tab={<span><UserSwitchOutlined /> 用户布控</span>} key="control">
            {renderControl()}
          </TabPane>
          <TabPane tab={<span><WarningOutlined /> 超速报警</span>} key="speed">
            {renderSpeed()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 