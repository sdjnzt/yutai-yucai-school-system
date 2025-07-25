import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, message, Tag, Select, Modal, Form, DatePicker, Calendar, Badge } from 'antd';
import { DesktopOutlined, BellOutlined, ShoppingOutlined, CalendarOutlined, DownloadOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 会议室预约数据（2025年5月）
const meetingList = [
  { id: 1, room: 'A101', title: '项目周会', organizer: '李明', startTime: '2025-05-10 09:00:00', endTime: '2025-05-10 10:00:00', status: '已确认' },
  { id: 2, room: 'B203', title: '产品评审', organizer: '赵秀玲', startTime: '2025-05-10 14:00:00', endTime: '2025-05-10 15:30:00', status: '待确认' },
  { id: 3, room: 'C305', title: '技术分享', organizer: '李利英', startTime: '2025-05-11 15:00:00', endTime: '2025-05-11 16:00:00', status: '已取消' },
];

// 办公用品数据
const supplyList = [
  { id: 1, name: 'A4纸', category: '纸张', stock: 100, unit: '包', status: '充足' },
  { id: 2, name: '签字笔', category: '文具', stock: 50, unit: '支', status: '充足' },
  { id: 3, name: '文件夹', category: '文具', stock: 10, unit: '个', status: '不足' },
];

// 公告管理数据
const announcementList = [
  { id: 1, title: '关于端午放假通知', publisher: '行政部', publishTime: '2025-05-28 09:00:00', status: '已发布' },
  { id: 2, title: '园区安全培训通知', publisher: '安全部', publishTime: '2025-05-14 10:00:00', status: '已发布' },
  { id: 3, title: '新员工入职培训', publisher: '人事部', publishTime: '2025-05-16 14:00:00', status: '草稿' },
];

export default function Office() {
  const [tab, setTab] = useState('meeting');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 会议室预约Tab
  const meetingColumns = [
    { title: '预约ID', dataIndex: 'id', key: 'id' },
    { title: '会议室', dataIndex: 'room', key: 'room' },
    { title: '会议主题', dataIndex: 'title', key: 'title' },
    { title: '组织者', dataIndex: 'organizer', key: 'organizer' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: s => {
        const color = s === '已确认' ? 'green' : s === '待确认' ? 'orange' : 'red';
        return <Tag color={color}>{s}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
      )
    }
  ];
  const renderMeeting = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索会议室/主题"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增预约</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={meetingColumns}
        dataSource={meetingList.filter(m => m.room.includes(search) || m.title.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title="会议室预约"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(()=>{setModalOpen(false);message.success('模拟保存成功')})}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="room" label="会议室" rules={[{required:true,message:'请选择会议室'}]}>
            <Select>
              <Option value="A101">A101</Option>
              <Option value="B203">B203</Option>
              <Option value="C305">C305</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label="会议主题" rules={[{required:true,message:'请输入会议主题'}]}><Input /></Form.Item>
          <Form.Item name="organizer" label="组织者" rules={[{required:true,message:'请输入组织者'}]}><Input /></Form.Item>
          <Form.Item name="time" label="会议时间" rules={[{required:true,message:'请选择会议时间'}]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请选择状态'}]}>
            <Select>
              <Option value="待确认">待确认</Option>
              <Option value="已确认">已确认</Option>
              <Option value="已取消">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // 办公用品Tab
  const supplyColumns = [
    { title: '物品ID', dataIndex: 'id', key: 'id' },
    { title: '物品名称', dataIndex: 'name', key: 'name' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '库存', dataIndex: 'stock', key: 'stock' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: s => s==='充足'?<Tag color="green">充足</Tag>:<Tag color="red">不足</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
      )
    }
  ];
  const renderSupply = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索物品名称/分类"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增物品</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={supplyColumns}
        dataSource={supplyList.filter(s => s.name.includes(search) || s.category.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title="办公用品"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(()=>{setModalOpen(false);message.success('模拟保存成功')})}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="物品名称" rules={[{required:true,message:'请输入物品名称'}]}><Input /></Form.Item>
          <Form.Item name="category" label="分类" rules={[{required:true,message:'请输入分类'}]}><Input /></Form.Item>
          <Form.Item name="stock" label="库存" rules={[{required:true,message:'请输入库存'}]}><Input type="number" /></Form.Item>
          <Form.Item name="unit" label="单位" rules={[{required:true,message:'请输入单位'}]}><Input /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请选择状态'}]}>
            <Select>
              <Option value="充足">充足</Option>
              <Option value="不足">不足</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // 公告管理Tab
  const announcementColumns = [
    { title: '公告ID', dataIndex: 'id', key: 'id' },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '发布部门', dataIndex: 'publisher', key: 'publisher' },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: s => s==='已发布'?<Tag color="green">已发布</Tag>:<Tag color="orange">草稿</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
      )
    }
  ];
  const renderAnnouncement = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索标题/发布部门"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增公告</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={announcementColumns}
        dataSource={announcementList.filter(a => a.title.includes(search) || a.publisher.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title="公告管理"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(()=>{setModalOpen(false);message.success('模拟保存成功')})}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{required:true,message:'请输入标题'}]}><Input /></Form.Item>
          <Form.Item name="publisher" label="发布部门" rules={[{required:true,message:'请输入发布部门'}]}><Input /></Form.Item>
          <Form.Item name="content" label="内容" rules={[{required:true,message:'请输入内容'}]}><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请选择状态'}]}>
            <Select>
              <Option value="草稿">草稿</Option>
              <Option value="已发布">已发布</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><DesktopOutlined /> 办公管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><CalendarOutlined /> 会议室预约</span>} key="meeting">
            {renderMeeting()}
          </TabPane>
          <TabPane tab={<span><ShoppingOutlined /> 办公用品</span>} key="supply">
            {renderSupply()}
          </TabPane>
          <TabPane tab={<span><BellOutlined /> 公告管理</span>} key="announcement">
            {renderAnnouncement()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 