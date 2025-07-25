import React, { useState } from 'react';
import { Card, Table, Button, Input, Modal, Form, Tag, message, Row, Col } from 'antd';
import { SearchOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { gateList as mockGateList } from './parkingMock';

export default function Gate() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(mockGateList);
  const [editing, setEditing] = useState(null);

  const columns = [
    { title: '出入口ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='开启'?<Tag color="green">开启</Tag>:<Tag color="red">关闭</Tag> },
    { title: '位置', dataIndex: 'location', key: 'location' },
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
        setData(list => list.map(g => g.id === editing.id ? { ...g, ...values } : g));
        message.success('编辑成功');
      }
      setModalOpen(false);
    });
  }

  return (
    <Card className="content-card">
      <Row gutter={24}>
        <Col span={16}>
          <div style={{marginBottom:16,display:'flex',gap:16}}>
            <Input.Search
              placeholder="搜索出入口名称/位置"
              allowClear
              enterButton={<SearchOutlined />}
              style={{width:300}}
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <Table
            columns={columns}
            dataSource={data.filter(g => g.name.includes(search) || g.location.includes(search))}
            rowKey="id"
            pagination={{pageSize:5}}
          />
        </Col>
        <Col span={8}>
          <Card title={<><EnvironmentOutlined /> 园区出入口分布</>} variant="borderless">
            <div style={{height:320,position:'relative',background:'#f5f5f5',borderRadius:8,overflow:'hidden'}}>
              <svg width="100%" height="100%" viewBox="0 0 400 320">
                <rect x="40" y="40" width="320" height="240" rx="32" fill="#e6f7ff" stroke="#91d5ff" strokeWidth="3" />
                {data.map((gate) => {
                  const x = 40 + ((gate.lng-117.118)/0.009)*320;
                  const y = 280 - ((gate.lat-36.646)/0.006)*240;
                  return (
                    <g key={gate.id}>
                      <circle cx={x} cy={y} r="10" fill={gate.status==='开启' ? '#52c41a' : '#ff4d4f'} stroke="#fff" strokeWidth="2" />
                      <text x={x+14} y={y+4} fontSize="14" fill="#333">{gate.name}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        open={modalOpen}
        title={'编辑出入口'}
        onCancel={()=>setModalOpen(false)}
        onOk={handleOk}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{required:true,message:'请输入名称'}]}><Input /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请选择状态'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="位置" rules={[{required:true,message:'请输入位置'}]}><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
} 