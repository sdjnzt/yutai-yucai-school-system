import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, Form, DatePicker, message, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, DownloadOutlined, QrcodeOutlined, StopOutlined, CloseCircleOutlined } from '@ant-design/icons';
import QRCode from 'react-qr-code';
import * as XLSX from 'xlsx';
import { initAppointmentList } from './visitorMock';

const statusColors = { '待审核': 'orange', '已通过': 'green', '已拒绝': 'red', '已撤销': 'default' };

export default function Appointment() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [qrModal, setQrModal] = useState({ open: false, id: null });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appointmentList, setAppointmentList] = useState(initAppointmentList);
  const [modal, setModal] = useState({ open: false, record: null });

  const columns = [
    { title: '访客ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '访问目的', dataIndex: 'purpose', key: 'purpose' },
    { title: '被访人', dataIndex: 'host', key: 'host' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="二维码"><Button icon={<QrcodeOutlined />} onClick={()=>setQrModal({ open: true, id: record.id })} /></Tooltip>
          <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => {
            setAppointmentList(list=>list.filter(a=>a.id!==record.id));
            message.success('删除成功');
          }}>删除</Button>
          {record.status === '待审核' && <Button icon={<CheckCircleOutlined />} type="link" onClick={() => handleApprove(record, '已通过')}>通过</Button>}
          {record.status === '待审核' && <Button icon={<CloseCircleOutlined />} type="link" danger onClick={() => handleApprove(record, '已拒绝')}>拒绝</Button>}
          {record.status === '已通过' && <Button type="link" onClick={() => handleApprove(record, '已撤销')}>撤销</Button>}
        </Space>
      )
    }
  ];

  function handleApprove(record, status) {
    setAppointmentList(list=>list.map(a=>a.id===record.id?{...a,status:status}:a));
    message.success(`已${status}`);
  }

  function exportExcel(data, sheetName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增预约</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(appointmentList, '访客预约')}>导出Excel</Button>
      </div>
      <Table
        rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
        columns={columns}
        dataSource={appointmentList.filter(a => a.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Space style={{marginBottom:16}}>
        <Button type="primary" icon={<CheckCircleOutlined />} disabled={!selectedRowKeys.length} onClick={()=>{
          setAppointmentList(list=>list.map(a=>selectedRowKeys.includes(a.id)?{...a,status:'已通过'}:a));
          setSelectedRowKeys([]);
          message.success('批量通过成功');
        }}>批量通过</Button>
        <Button danger icon={<StopOutlined />} disabled={!selectedRowKeys.length} onClick={()=>{
          setAppointmentList(list=>list.map(a=>selectedRowKeys.includes(a.id)?{...a,status:'已拒绝'}:a));
          setSelectedRowKeys([]);
          message.success('批量拒绝成功');
        }}>批量拒绝</Button>
      </Space>
      <Modal
        open={modalOpen}
        title="访客预约"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(values=>{
          if (form.getFieldValue('id')) {
            setAppointmentList(list=>list.map(a=>a.id===form.getFieldValue('id')?{...a,...values}:a));
            message.success('编辑成功');
          } else {
            setAppointmentList(list=>[...list,{...values,id:Date.now(),status:'待审核'}]);
            message.success('新增成功');
          }
          setModalOpen(false);
        })}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" style={{display:'none'}}><Input /></Form.Item>
          <Form.Item name="name" label="姓名" rules={[{required:true,message:'请输入姓名'}]}><Input /></Form.Item>
          <Form.Item name="visitTime" label="访问时间" rules={[{required:true,message:'请选择访问时间'}]}><DatePicker showTime style={{width:'100%'}} /></Form.Item>
          <Form.Item name="purpose" label="访问目的" rules={[{required:true,message:'请输入访问目的'}]}><Input /></Form.Item>
          <Form.Item name="host" label="被访人" rules={[{required:true,message:'请输入被访人'}]}><Input /></Form.Item>
        </Form>
      </Modal>
      <Modal
        open={qrModal.open}
        title="访客预约二维码"
        onCancel={()=>setQrModal({ open: false, id: null })}
        footer={null}
      >
        <div style={{textAlign:'center',padding:24}}>
          <QRCode value={String(qrModal.id)} style={{ width: 200, height: 200 }} />
          <div style={{marginTop:16}}>请凭此二维码扫码入园</div>
        </div>
      </Modal>
      <Modal
        open={modal.open}
        title={modal.record ? '预约详情' : '新建预约'}
        onCancel={() => setModal({ open: false, record: null })}
        onOk={() => setModal({ open: false, record: null })}
      >
        {modal.record ? (
          <div>
            <p><b>访客姓名：</b>{modal.record.name}</p>
            <p><b>手机号：</b>{modal.record.phone}</p>
            <p><b>公司：</b>{modal.record.company}</p>
            <p><b>访问时间：</b>{modal.record.visitTime}</p>
            <p><b>被访人：</b>{modal.record.host}</p>
            <p><b>部门：</b>{modal.record.dept}</p>
            <p><b>访问目的：</b>{modal.record.purpose}</p>
            <p><b>状态：</b><Tag color={statusColors[modal.record.status]}>{modal.record.status}</Tag></p>
            <p><b>二维码：</b><QrcodeOutlined style={{ fontSize: 18 }} /></p>
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item label="访客姓名" name="name" rules={[{ required: true, message: '请输入访客姓名' }]}><Input /></Form.Item>
            <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}><Input /></Form.Item>
            <Form.Item label="公司" name="company"><Input /></Form.Item>
            <Form.Item label="访问时间" name="visitTime" rules={[{ required: true, message: '请选择访问时间' }]}><DatePicker showTime style={{ width: '100%' }} /></Form.Item>
            <Form.Item label="被访人" name="host" rules={[{ required: true, message: '请输入被访人' }]}><Input /></Form.Item>
            <Form.Item label="部门" name="dept"><Input /></Form.Item>
            <Form.Item label="访问目的" name="purpose"><Input /></Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
} 