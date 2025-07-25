import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, message, Tag, Select, Modal, Form, DatePicker } from 'antd';
import { FireOutlined, WarningOutlined, CheckCircleOutlined, BarChartOutlined, DownloadOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 消防设备台账数据（2025年5月）
const deviceList = [
  { id: 1, name: '灭火器', type: '干粉灭火器', location: 'A区1楼', status: '正常', lastCheck: '2025-05-10 08:00:00' },
  { id: 2, name: '烟感探测器', type: '光电式', location: 'B区2楼', status: '正常', lastCheck: '2025-05-15 09:05:00' },
  { id: 3, name: '喷淋系统', type: '自动喷淋', location: 'C区3楼', status: '异常', lastCheck: '2025-05-20 10:10:00' },
];

// 消防报警数据
const alarmList = [
  { id: 11, device: '烟感探测器', location: 'B区2楼', alarm: '烟雾报警', time: '2025-05-12 09:00:00', status: '未处理' },
  { id: 12, device: '喷淋系统', location: 'C区3楼', alarm: '水压异常', time: '2025-05-18 10:00:00', status: '已处理' },
];

// 消防巡检数据
const inspectionList = [
  { id: 21, task: '5月例行巡检', device: '灭火器', inspector: '李明', time: '2025-05-14 14:00:00', result: '正常' },
  { id: 22, task: '5月例行巡检', device: '喷淋系统', inspector: '赵秀玲', time: '2025-05-22 14:30:00', result: '异常' },
];

// 消防统计报表数据
const reportData = [
  { month: '01', alarm: 2, inspection: 10, maintenance: 3 },
  { month: '02', alarm: 1, inspection: 12, maintenance: 2 },
  { month: '03', alarm: 3, inspection: 11, maintenance: 4 },
  { month: '04', alarm: 2, inspection: 13, maintenance: 2 },
  { month: '05', alarm: 1, inspection: 14, maintenance: 1 },
];

export default function FireControl() {
  const [tab, setTab] = useState('device');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [timeRange, setTimeRange] = useState('month');

  // 设备台账Tab
  const deviceColumns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '设备类型', dataIndex: 'type', key: 'type' },
    { title: '安装位置', dataIndex: 'location', key: 'location' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后检查时间', dataIndex: 'lastCheck', key: 'lastCheck' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
      )
    }
  ];
  const renderDevice = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索设备名称/位置"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增设备</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={deviceColumns}
        dataSource={deviceList.filter(d => d.name.includes(search) || d.location.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title="设备信息"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(()=>{setModalOpen(false);message.success('模拟保存成功')})}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="设备名称" rules={[{required:true,message:'请输入设备名称'}]}><Input /></Form.Item>
          <Form.Item name="type" label="设备类型" rules={[{required:true,message:'请输入设备类型'}]}><Input /></Form.Item>
          <Form.Item name="location" label="安装位置" rules={[{required:true,message:'请输入安装位置'}]}><Input /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请选择状态'}]}>
            <Select><Option value="正常">正常</Option><Option value="异常">异常</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // 消防报警Tab
  const alarmColumns = [
    { title: '报警ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'device', key: 'device' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '报警类型', dataIndex: 'alarm', key: 'alarm' },
    { title: '报警时间', dataIndex: 'time', key: 'time' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='未处理'?<Tag color="red">未处理</Tag>:<Tag color="green">已处理</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        record.status==='未处理'?<Button icon={<CheckCircleOutlined />} type="primary" onClick={()=>message.success('模拟处理成功')}>处理</Button>:null
      )
    }
  ];
  const renderAlarm = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索设备/位置"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={alarmColumns}
        dataSource={alarmList.filter(a => a.device.includes(search) || a.location.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 消防巡检Tab
  const inspectionColumns = [
    { title: '任务ID', dataIndex: 'id', key: 'id' },
    { title: '任务名称', dataIndex: 'task', key: 'task' },
    { title: '设备', dataIndex: 'device', key: 'device' },
    { title: '巡检人', dataIndex: 'inspector', key: 'inspector' },
    { title: '巡检时间', dataIndex: 'time', key: 'time' },
    { title: '结果', dataIndex: 'result', key: 'result', render: r => r==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
  ];
  const renderInspection = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索任务/设备"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={inspectionColumns}
        dataSource={inspectionList.filter(i => i.task.includes(search) || i.device.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 消防统计Tab
  const renderReport = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Select 
          value={timeRange} 
          onChange={setTimeRange}
          style={{width:140}}
        >
          <Option value="month">月度统计</Option>
          <Option value="quarter">季度统计</Option>
          <Option value="year">年度统计</Option>
        </Select>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Card title="2025年1-5月消防统计趋势" style={{marginBottom:24}}>
        <BarChartOutlined style={{fontSize:20,marginRight:8}} />
        <Table
          columns={[
            { title: '月份', dataIndex: 'month', key: 'month' },
            { title: '报警数', dataIndex: 'alarm', key: 'alarm' },
            { title: '巡检数', dataIndex: 'inspection', key: 'inspection' },
            { title: '维护数', dataIndex: 'maintenance', key: 'maintenance' },
          ]}
          dataSource={reportData.map((d,i)=>({...d,key:i}))}
          pagination={false}
          style={{marginBottom:24}}
        />
      </Card>
    </>
  );

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><FireOutlined /> 消防管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><FireOutlined /> 设备台账</span>} key="device">
            {renderDevice()}
          </TabPane>
          <TabPane tab={<span><WarningOutlined /> 消防报警</span>} key="alarm">
            {renderAlarm()}
          </TabPane>
          <TabPane tab={<span><CheckCircleOutlined /> 消防巡检</span>} key="inspection">
            {renderInspection()}
          </TabPane>
          <TabPane tab={<span><BarChartOutlined /> 统计分析</span>} key="report">
            {renderReport()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 