import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, DatePicker, message, Tag, Select, Modal, Form } from 'antd';
import { ToolOutlined, WarningOutlined, CheckCircleOutlined, BarChartOutlined, DownloadOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

// 设备台账数据（2025年5月）
const deviceList = [
  { id: 1, name: '空调', group: '动力设备', status: '正常', lastUpdate: '2025-05-10 08:00:00' },
  { id: 2, name: '照明', group: '照明设备', status: '正常', lastUpdate: '2025-05-10 08:05:00' },
  { id: 3, name: '电梯', group: '动力设备', status: '异常', lastUpdate: '2025-05-10 08:10:00' },
];

// 故障报警数据
const faultList = [
  { id: 11, name: '电梯', group: '动力设备', fault: '运行异常', time: '2025-05-11 09:00:00', status: '未处理' },
  { id: 12, name: '空调', group: '动力设备', fault: '不制冷', time: '2025-05-12 10:00:00', status: '已处理' },
];

// 自动巡检数据
const patrolList = [
  { id: 21, task: '5月例行巡检', device: '空调', staff: '李明', time: '2025-05-13 14:00:00', result: '正常' },
  { id: 22, task: '5月例行巡检', device: '电梯', staff: '赵秀玲', time: '2025-05-13 14:30:00', result: '异常' },
];

// 运维报表数据
const reportData = [
  { month: '01', fault: 2, patrol: 10, repair: 3 },
  { month: '02', fault: 1, patrol: 12, repair: 2 },
  { month: '03', fault: 3, patrol: 11, repair: 4 },
  { month: '04', fault: 2, patrol: 13, repair: 2 },
  { month: '05', fault: 1, patrol: 14, repair: 1 },
];

export default function Maintenance() {
  const [tab, setTab] = useState('device');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 设备台账Tab
  const deviceColumns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '分组', dataIndex: 'group', key: 'group' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
    { title: '最后更新时间', dataIndex: 'lastUpdate', key: 'lastUpdate' },
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
          placeholder="搜索设备名称"
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
        dataSource={deviceList.filter(d => d.name.includes(search))}
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
          <Form.Item name="group" label="分组" rules={[{required:true,message:'请输入分组'}]}><Input /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请输入状态'}]}><Select><Option value="正常">正常</Option><Option value="异常">异常</Option></Select></Form.Item>
        </Form>
      </Modal>
    </>
  );

  // 故障报警Tab
  const faultColumns = [
    { title: '报警ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '分组', dataIndex: 'group', key: 'group' },
    { title: '故障描述', dataIndex: 'fault', key: 'fault' },
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
  const renderFault = () => (
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
        columns={faultColumns}
        dataSource={faultList.filter(f => f.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 自动巡检Tab
  const patrolColumns = [
    { title: '任务ID', dataIndex: 'id', key: 'id' },
    { title: '任务名称', dataIndex: 'task', key: 'task' },
    { title: '设备', dataIndex: 'device', key: 'device' },
    { title: '巡检人', dataIndex: 'staff', key: 'staff' },
    { title: '巡检时间', dataIndex: 'time', key: 'time' },
    { title: '结果', dataIndex: 'result', key: 'result', render: r => r==='正常'?<Tag color="green">正常</Tag>:<Tag color="red">异常</Tag> },
  ];
  const renderPatrol = () => (
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
        columns={patrolColumns}
        dataSource={patrolList.filter(p => p.task.includes(search) || p.device.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 运维报表Tab
  const renderReport = () => {
    const chartData = reportData.flatMap(item => [
      { month: item.month+'月', type: '故障数', value: item.fault },
      { month: item.month+'月', type: '巡检数', value: item.patrol },
      { month: item.month+'月', type: '维修数', value: item.repair },
    ]);
    return (
      <>
        <div style={{marginBottom:16,display:'flex',gap:16}}>
          <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
        </div>
        <Card title="2025年1-5月运维统计趋势" style={{marginBottom:24}}>
          <BarChartOutlined style={{fontSize:20,marginRight:8}} />
          <Table
            columns={[
              { title: '月份', dataIndex: 'month', key: 'month' },
              { title: '故障数', dataIndex: 'fault', key: 'fault' },
              { title: '巡检数', dataIndex: 'patrol', key: 'patrol' },
              { title: '维修数', dataIndex: 'repair', key: 'repair' },
            ]}
            dataSource={reportData.map((d,i)=>({...d,key:i}))}
            pagination={false}
            style={{marginBottom:24}}
          />
          {/* 可选：集成图表库展示趋势 */}
        </Card>
      </>
    );
  };

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><ToolOutlined /> 设备运维</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><ToolOutlined /> 设备台账</span>} key="device">
            {renderDevice()}
          </TabPane>
          <TabPane tab={<span><WarningOutlined /> 故障报警</span>} key="fault">
            {renderFault()}
          </TabPane>
          <TabPane tab={<span><CheckCircleOutlined /> 自动巡检</span>} key="patrol">
            {renderPatrol()}
          </TabPane>
          <TabPane tab={<span><BarChartOutlined /> 运维报表</span>} key="report">
            {renderReport()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 