import React, { useState } from 'react';
import { Card, Table, Input, Button, Modal, Form, Tag, message } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { controlList as mockControlList } from './parkingMock';

export default function Control() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(mockControlList);
  const [editing, setEditing] = useState(null);

  const columns = [
    { title: '布控ID', dataIndex: 'id', key: 'id' },
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '车牌', dataIndex: 'car', key: 'car' },
    { title: '类型', dataIndex: 'type', key: 'type', render: t => t==='黑名单'?<Tag color="red">黑名单</Tag>:<Tag color="green">白名单</Tag> },
    { title: '布控时间', dataIndex: 'time', key: 'time' },
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
        setData(list => list.map(c => c.id === editing.id ? { ...c, ...values } : c));
        message.success('编辑成功');
      }
      setModalOpen(false);
    });
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索用户/车牌"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(c => c.user.includes(search) || c.car.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title={'编辑布控'}
        onCancel={()=>setModalOpen(false)}
        onOk={handleOk}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="user" label="用户" rules={[{required:true,message:'请输入用户'}]}><Input /></Form.Item>
          <Form.Item name="car" label="车牌" rules={[{required:true,message:'请输入车牌'}]}><Input /></Form.Item>
          <Form.Item name="type" label="类型" rules={[{required:true,message:'请选择类型'}]}><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
} 