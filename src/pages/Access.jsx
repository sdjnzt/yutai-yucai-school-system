import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, Modal, Select, DatePicker, message, Tag, Space } from 'antd';
import { UnlockOutlined, KeyOutlined, UserSwitchOutlined, FileSearchOutlined, WarningOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

// 模拟门禁设备数据（2025年5月）
const deviceList = [
  { id: 1, location: '大门', status: '正常', lastUpdate: '2025-05-10 08:00:00' },
  { id: 2, location: '办公楼', status: '正常', lastUpdate: '2025-05-14 08:05:00' },
  { id: 3, location: '停车场', status: '异常', lastUpdate: '2025-05-18 07:50:00' },
  { id: 4, location: '仓库', status: '正常', lastUpdate: '2025-05-22 08:10:00' },
];

// 模拟权限分配数据
const permissionList = [
  { id: 101, user: '李明', role: '员工', access: ['大门', '办公楼'], validFrom: '2025-05-10', validTo: '2025-05-28' },
  { id: 102, user: '赵秀玲', role: '访客', access: ['大门'], validFrom: '2025-05-12', validTo: '2025-05-14' },
  { id: 103, user: '李利英', role: '安保', access: ['大门', '办公楼', '仓库'], validFrom: '2025-05-10', validTo: '2025-05-28' },
];

// 模拟进出记录
const recordList = [
  { id: 201, user: '李明', location: '大门', time: '2025-05-10 08:10:00', type: '进', method: '刷卡' },
  { id: 202, user: '赵秀玲', location: '大门', time: '2025-05-14 09:00:00', type: '进', method: '二维码' },
  { id: 203, user: '李利英', location: '仓库', time: '2025-05-18 10:00:00', type: '出', method: '刷卡' },
];

// 模拟异常报警
const alarmList = [
  { id: 301, location: '停车场', time: '2025-05-12 12:00:00', type: '强行闯入', status: '未处理' },
  { id: 302, location: '办公楼', time: '2025-05-18 14:20:00', type: '门未关好', status: '已处理' },
];

export default function Access() {
  const [tab, setTab] = useState('device');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [recordDate, setRecordDate] = useState(null);
  const [alarmDate, setAlarmDate] = useState(null);

  // 门禁设备管理Tab
  const deviceColumns = [
    { title: '门禁ID', dataIndex: 'id', key: 'id' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => <Button icon={<UnlockOutlined />} onClick={()=>{setSelectedDevice(record);setModalOpen(true);}}>远程开门</Button>
    }
  ];
  const renderDevice = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索位置"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={deviceColumns}
        dataSource={deviceList.filter(d => d.location.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title={selectedDevice ? selectedDevice.location + ' - 远程开门' : ''}
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{setModalOpen(false);message.success('模拟开门成功')}}
      >
        <p>确定要远程开门吗？</p>
      </Modal>
    </>
  );

  // 权限分配Tab
  const permissionColumns = [
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '门禁权限', dataIndex: 'access', key: 'access', render: arr => arr.join('、') },
    { title: '有效期', key: 'valid', render: (_, r) => r.validFrom+' ~ '+r.validTo },
    {
      title: '操作',
      key: 'action',
      render: () => <Button icon={<KeyOutlined />} onClick={()=>message.info('模拟权限编辑')}>编辑</Button>
    }
  ];
  const renderPermission = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索用户"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={permissionColumns}
        dataSource={permissionList.filter(p => p.user.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 进出记录Tab
  const recordColumns = [
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '进/出', dataIndex: 'type', key: 'type', render: t => t==='进'?<Tag color="blue">进</Tag>:<Tag color="orange">出</Tag> },
    { title: '方式', dataIndex: 'method', key: 'method' },
  ];
  const renderRecord = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索用户"
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
          value={recordDate}
          onChange={setRecordDate}
          allowClear
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={recordColumns}
        dataSource={recordList.filter(r => (!search || r.user.includes(search)) && (!recordDate || r.time.startsWith(recordDate.format('YYYY-MM-DD'))))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 异常报警Tab
  const alarmColumns = [
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '类型', dataIndex: 'type', key: 'type', render: t => <Tag color={t==='强行闯入'?'red':'orange'}>{t}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='未处理'?<Tag color="red">未处理</Tag>:<Tag color="green">已处理</Tag> },
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
          placeholder="搜索位置"
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
        dataSource={alarmList.filter(a => (!search || a.location.includes(search)) && (!alarmDate || a.time.startsWith(alarmDate.format('YYYY-MM-DD'))))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><UserSwitchOutlined /> 门禁管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><UnlockOutlined /> 设备管理</span>} key="device">
            {renderDevice()}
          </TabPane>
          <TabPane tab={<span><KeyOutlined /> 权限分配</span>} key="permission">
            {renderPermission()}
          </TabPane>
          <TabPane tab={<span><FileSearchOutlined /> 进出记录</span>} key="record">
            {renderRecord()}
          </TabPane>
          <TabPane tab={<span><WarningOutlined /> 异常报警</span>} key="alarm">
            {renderAlarm()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 