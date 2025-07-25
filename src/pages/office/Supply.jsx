import React, { useState } from 'react';
import { Card, Table, Button, Input, Modal, Form, Select, Tag, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { supplyList as mockSupplyList } from './officeMock';

const { Option } = Select;

export default function Supply() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(mockSupplyList);
  const [editing, setEditing] = useState(null);

  const columns = [
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
        setData(list => list.map(s => s.id === editing.id ? { ...s, ...values } : s));
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
          placeholder="搜索物品名称/分类"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>onEdit(null)}>新增物品</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(s => s.name.includes(search) || s.category.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title={editing?'编辑物品':'新增物品'}
        onCancel={()=>setModalOpen(false)}
        onOk={handleOk}
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
    </Card>
  );
} 