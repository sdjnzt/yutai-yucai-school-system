import React, { useState } from 'react';
import { Table, Tag, Button, DatePicker, Input, Modal, Form, Select, Space, Tooltip } from 'antd';
import { ExportOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const mockRecords = [
  { key: '1', time: '2025-05-10 08:00', name: '王建国', dept: '技术部', door: '1号楼北门', type: '进', device: 'GATE-001', method: 'IC卡', remark: '' },
  { key: '2', time: '2025-05-10 08:05', name: '李明', dept: '行政部', door: '2号楼南门', type: '出', device: 'DOOR-002', method: '人脸', remark: '' },
  { key: '3', time: '2025-05-10 08:10', name: '赵云', dept: '管理层', door: '3号楼西门', type: '异常', device: 'GATE-003', method: 'IC卡', remark: '未授权通行' },
  { key: '4', time: '2025-05-10 08:15', name: '孙倩', dept: '财务部', door: '4号楼东门', type: '进', device: 'DOOR-004', method: 'IC卡', remark: '' },
];

const eventTypes = ['进', '出', '异常'];
const methods = ['IC卡', '人脸', 'IC卡+人脸'];
const doors = ['1号楼北门', '2号楼南门', '3号楼西门', '4号楼东门'];

export default function Record() {
  const [data, setData] = useState(mockRecords);
  const [modal, setModal] = useState({ open: false, record: null });
  const [remarkModal, setRemarkModal] = useState({ open: false, record: null, value: '' });
  const [filters, setFilters] = useState({ type: undefined, method: undefined, door: undefined, name: '', date: [] });

  const handleFilter = () => {
    let filtered = mockRecords;
    if (filters.type) filtered = filtered.filter(r => r.type === filters.type);
    if (filters.method) filtered = filtered.filter(r => r.method === filters.method);
    if (filters.door) filtered = filtered.filter(r => r.door === filters.door);
    if (filters.name) filtered = filtered.filter(r => r.name.includes(filters.name));
    setData(filtered);
  };

  const handleRemark = () => {
    setData(data.map(r => r.key === remarkModal.record.key ? { ...r, remark: remarkModal.value } : r));
    setRemarkModal({ open: false, record: null, value: '' });
  };

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '人员', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '门点', dataIndex: 'door', key: 'door' },
    { title: '事件类型', dataIndex: 'type', key: 'type', render: t => t === '异常' ? <Tag color="red">异常</Tag> : t === '进' ? <Tag color="green">进</Tag> : <Tag color="blue">出</Tag> },
    { title: '设备编号', dataIndex: 'device', key: 'device' },
    { title: '方式', dataIndex: 'method', key: 'method' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="详情"><Button icon={<EyeOutlined />} onClick={() => setModal({ open: true, record })} /></Tooltip>
          <Tooltip title="备注"><Button icon={<EditOutlined />} onClick={() => setRemarkModal({ open: true, record, value: record.remark })} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="时间">
          <DatePicker.RangePicker onChange={dates => setFilters(f => ({ ...f, date: dates }))} />
        </Form.Item>
        <Form.Item label="人员">
          <Input placeholder="姓名/工号" value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="门点">
          <Select allowClear placeholder="全部门点" style={{ width: 120 }} options={doors.map(d => ({ value: d, label: d }))} value={filters.door} onChange={v => setFilters(f => ({ ...f, door: v }))} />
        </Form.Item>
        <Form.Item label="事件类型">
          <Select allowClear placeholder="全部类型" style={{ width: 100 }} options={eventTypes.map(t => ({ value: t, label: t }))} value={filters.type} onChange={v => setFilters(f => ({ ...f, type: v }))} />
        </Form.Item>
        <Form.Item label="方式">
          <Select allowClear placeholder="全部方式" style={{ width: 120 }} options={methods.map(m => ({ value: m, label: m }))} value={filters.method} onChange={v => setFilters(f => ({ ...f, method: v }))} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleFilter}>查询</Button>
        </Form.Item>
        <Form.Item>
          <Button icon={<ExportOutlined />}>导出Excel</Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={data} bordered rowKey="key" rowClassName={r => r.type === '异常' ? 'abnormal-row' : ''} />
      <Modal
        open={modal.open}
        title="通行记录详情"
        onCancel={() => setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>时间：</b>{modal.record.time}</p>
            <p><b>人员：</b>{modal.record.name}</p>
            <p><b>部门：</b>{modal.record.dept}</p>
            <p><b>门点：</b>{modal.record.door}</p>
            <p><b>事件类型：</b>{modal.record.type}</p>
            <p><b>设备编号：</b>{modal.record.device}</p>
            <p><b>方式：</b>{modal.record.method}</p>
            <p><b>备注：</b>{modal.record.remark}</p>
          </div>
        )}
      </Modal>
      <Modal
        open={remarkModal.open}
        title="添加备注"
        onCancel={() => setRemarkModal({ open: false, record: null, value: '' })}
        onOk={handleRemark}
      >
        <Input.TextArea rows={3} value={remarkModal.value} onChange={e => setRemarkModal(r => ({ ...r, value: e.target.value }))} />
      </Modal>
      <style>{`.abnormal-row td { background: #fff1f0 !important; }`}</style>
    </div>
  );
} 