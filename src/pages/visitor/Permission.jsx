import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Input, Select, message, Tooltip } from 'antd';
import { CheckCircleOutlined, ExportOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const statusColors = { '待下发': 'orange', '已下发': 'green', '下发失败': 'red' };
const mockPermissions = [
  {
    key: '1',
    name: '陈梓涵',
    phone: '18653128801',
    visitTime: '2025-05-10 09:00',
    host: '王建国',
    dept: '技术部',
    status: '待下发',
    purpose: '技术交流',
    log: ['2025-05-17 审核通过', '2025-05-17 待下发'],
  },
  {
    key: '2',
    name: '李思远',
    phone: '18560091234',
    visitTime: '2025-05-11 14:30',
    host: '李明',
    dept: '行政部',
    status: '已下发',
    purpose: '商务洽谈',
    log: ['2025-05-10 审核通过', '2025-05-10 权限下发成功'],
  },
  {
    key: '3',
    name: '孙嘉禾',
    phone: '18753102345',
    visitTime: '2025-05-12 10:00',
    host: '赵云',
    dept: '管理层',
    status: '下发失败',
    purpose: '参观考察',
    log: ['2025-05-11 审核通过', '2025-05-11 权限下发失败'],
  },
  {
    key: '4',
    name: '王子睿',
    phone: '13969887732',
    visitTime: '2025-05-13 15:00',
    host: '孙倩',
    dept: '财务部',
    status: '已下发',
    purpose: '设备维护',
    log: ['2025-05-12 审核通过', '2025-05-12 权限下发成功'],
  },
  {
    key: '5',
    name: '赵一鸣',
    phone: '18853104567',
    visitTime: '2025-05-14 08:30',
    host: '陈梓涵',
    dept: '技术部',
    status: '待下发',
    purpose: '面试',
    log: ['2025-05-13 审核通过', '2025-05-13 待下发'],
  },
  {
    key: '6',
    name: '周子涵',
    phone: '18653109988',
    visitTime: '2025-05-15 13:00',
    host: '李思远',
    dept: '行政部',
    status: '已下发',
    purpose: '合作洽谈',
    log: ['2025-05-14 审核通过', '2025-05-14 权限下发成功'],
  },
  {
    key: '7',
    name: '钱宇航',
    phone: '18553107766',
    visitTime: '2025-05-16 09:30',
    host: '王子睿',
    dept: '管理层',
    status: '下发失败',
    purpose: '培训',
    log: ['2025-05-15 审核通过', '2025-05-15 权限下发失败'],
  },
  {
    key: '8',
    name: '吴雨桐',
    phone: '18753105544',
    visitTime: '2025-05-17 11:00',
    host: '孙嘉禾',
    dept: '财务部',
    status: '已下发',
    purpose: '签约仪式',
    log: ['2025-05-16 审核通过', '2025-05-16 权限下发成功'],
  },
  {
    key: '9',
    name: '郑浩然',
    phone: '18653102233',
    visitTime: '2025-05-18 10:30',
    host: '赵一鸣',
    dept: '技术部',
    status: '待下发',
    purpose: '设备调试',
    log: ['2025-05-17 审核通过', '2025-05-17 待下发'],
  },
  {
    key: '10',
    name: '冯思琪',
    phone: '18553104455',
    visitTime: '2025-05-19 16:00',
    host: '钱宇航',
    dept: '行政部',
    status: '已下发',
    purpose: '技术交流',
    log: ['2025-05-18 审核通过', '2025-05-18 权限下发成功'],
  },
];

export default function Permission() {
  const [data, setData] = useState(mockPermissions);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modal, setModal] = useState({ open: false, record: null });
  const [filters, setFilters] = useState({ status: undefined, host: '' });

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '被访人', dataIndex: 'host', key: 'host' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '访问目的', dataIndex: 'purpose', key: 'purpose' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === '待下发' && <Button icon={<CheckCircleOutlined />} type="link" onClick={() => handleIssue(record, '已下发')}>下发</Button>}
          <Tooltip title="详情"><Button icon={<InfoCircleOutlined />} onClick={() => setModal({ open: true, record })} /></Tooltip>
        </Space>
      ),
    },
  ];

  function handleIssue(record, status) {
    setData(data.map(item => item.key === record.key ? { ...item, status, log: [...item.log, status === '已下发' ? '权限下发成功' : '权限下发失败'] } : item));
    message.success(`已${status}`);
  }

  function handleBatchIssue() {
    setData(data.map(item => selectedRowKeys.includes(item.key) && item.status === '待下发' ? { ...item, status: '已下发', log: [...item.log, '权限下发成功'] } : item));
    setSelectedRowKeys([]);
    message.success('批量下发成功');
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '权限下发');
    XLSX.writeFile(wb, '权限下发.xlsx');
  }

  function handleFilter() {
    let filtered = mockPermissions;
    if (filters.status) filtered = filtered.filter(r => r.status === filters.status);
    if (filters.host) filtered = filtered.filter(r => r.host.includes(filters.host));
    setData(filtered);
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select allowClear placeholder="状态" style={{ width: 120 }} value={filters.status} onChange={v => setFilters(f => ({ ...f, status: v }))} options={Object.keys(statusColors).map(s => ({ value: s, label: s }))} />
        <Input placeholder="被访人" style={{ width: 140 }} value={filters.host} onChange={e => setFilters(f => ({ ...f, host: e.target.value }))} />
        <Button icon={<SearchOutlined />} onClick={handleFilter}>筛选</Button>
        <Button icon={<ExportOutlined />} onClick={exportExcel}>导出Excel</Button>
        <Button type="primary" icon={<CheckCircleOutlined />} disabled={!selectedRowKeys.length} onClick={handleBatchIssue}>批量下发</Button>
      </Space>
      <Table columns={columns} dataSource={data} bordered rowKey="key" rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} />
      <Modal
        open={modal.open}
        title="下发详情"
        onCancel={() => setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>姓名：</b>{modal.record.name}</p>
            <p><b>手机号：</b>{modal.record.phone}</p>
            <p><b>访问时间：</b>{modal.record.visitTime}</p>
            <p><b>被访人：</b>{modal.record.host}</p>
            <p><b>部门：</b>{modal.record.dept}</p>
            <p><b>访问目的：</b>{modal.record.purpose}</p>
            <p><b>状态：</b><Tag color={statusColors[modal.record.status]}>{modal.record.status}</Tag></p>
            <h4>下发日志</h4>
            <ul style={{ paddingLeft: 20 }}>{modal.record.log.map((l, i) => <li key={i}>{l}</li>)}</ul>
          </div>
        )}
      </Modal>
    </div>
  );
} 