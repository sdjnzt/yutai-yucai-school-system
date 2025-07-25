import React, { useState } from 'react';
import { Card, Table, Button, Input, Modal, Form, Select, Tag, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { announcementList as mockAnnouncementList } from './officeMock';

const { Option } = Select;

export default function Announcement() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(mockAnnouncementList);
  const [editing, setEditing] = useState(null);

  const columns = [
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
        <Button icon={<EditOutlined />} onClick={()=>onEdit(record)}>编辑</Button>
      )
    }
  ];

  function onEdit(record) {
    setEditing(record);
    form.setFieldsValue(record||{});
    setModalOpen(true);
  }
  function handleOk() {
    form.validateFields().then(values => {
      if (editing) {
        setData(list => list.map(a => a.id === editing.id ? { ...a, ...values } : a));
        message.success('编辑成功');
      } else {
        setData(list => [ ...list, { ...values, id: Date.now() } ]);
        message.success('新增成功');
      }
      setModalOpen(false);
    });
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索标题/发布部门"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>onEdit(null)}>新增公告</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(a => a.title.includes(search) || a.publisher.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title={editing?'编辑公告':'新增公告'}
        onCancel={()=>setModalOpen(false)}
        onOk={handleOk}
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
    </Card>
  );
} 