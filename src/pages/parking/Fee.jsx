import React, { useState } from 'react';
import { Card, Table, Input, Button, Modal, Form, message } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { feeList as mockFeeList } from './parkingMock';

export default function Fee() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(mockFeeList);
  const [editing, setEditing] = useState(null);

  const columns = [
    { title: '规则ID', dataIndex: 'id', key: 'id' },
    { title: '规则名称', dataIndex: 'name', key: 'name' },
    { title: '计费规则', dataIndex: 'rule', key: 'rule' },
    { title: '封顶', dataIndex: 'max', key: 'max' },
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
        setData(list => list.map(f => f.id === editing.id ? { ...f, ...values } : f));
        message.success('编辑成功');
      }
      setModalOpen(false);
    });
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索规则名称"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(f => f.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title={'编辑收费规则'}
        onCancel={()=>setModalOpen(false)}
        onOk={handleOk}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="规则名称" rules={[{required:true,message:'请输入规则名称'}]}><Input /></Form.Item>
          <Form.Item name="rule" label="计费规则" rules={[{required:true,message:'请输入计费规则'}]}><Input /></Form.Item>
          <Form.Item name="max" label="封顶" rules={[{required:true,message:'请输入封顶金额'}]}><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
} 