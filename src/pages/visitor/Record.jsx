import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Input, Select, message, Tooltip } from 'antd';
import { ExportOutlined, SearchOutlined, InfoCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const statusColors = { '已进园': 'green', '已出园': 'blue', '未进园': 'orange', '异常': 'red' };
const mockRecords = [
  { key: '1', name: '张伟', phone: '13800000001', visitTime: '2025-05-11 10:00', host: '王建国', dept: '技术部', status: '已进园', purpose: '商务洽谈', log: ['10:00 进园'], remark: '正常' },
  { key: '2', name: '李娜', phone: '13800000002', visitTime: '2025-05-11 14:00', host: '李明', dept: '行政部', status: '已出园', purpose: '面试', log: ['14:00 进园', '16:00 出园'], remark: '正常' },
  { key: '3', name: '王磊', phone: '13800000003', visitTime: '2025-05-12 09:30', host: '赵云', dept: '管理层', status: '未进园', purpose: '技术交流', log: [], remark: '未到访' },
  { key: '4', name: '赵敏', phone: '13800000004', visitTime: '2025-05-12 11:00', host: '王建国', dept: '技术部', status: '异常', purpose: '参观', log: ['11:00 进园'], remark: '超时未出园' },
];

export default function Record() {
  const [data, setData] = useState(mockRecords);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modal, setModal] = useState({ open: false, record: null });
  const [filters, setFilters] = useState({ status: undefined, host: '', name: '' });

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '被访人', dataIndex: 'host', key: 'host' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '访问目的', dataIndex: 'purpose', key: 'purpose' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="详情"><Button icon={<InfoCircleOutlined />} onClick={() => setModal({ open: true, record })} /></Tooltip>
        </Space>
      ),
    },
  ];

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(selectedRowKeys.length ? data.filter(d => selectedRowKeys.includes(d.key)) : data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '访客记录');
    XLSX.writeFile(wb, '访客记录.xlsx');
  }

  function handleFilter() {
    let filtered = mockRecords;
    if (filters.status) filtered = filtered.filter(r => r.status === filters.status);
    if (filters.host) filtered = filtered.filter(r => r.host.includes(filters.host));
    if (filters.name) filtered = filtered.filter(r => r.name.includes(filters.name));
    setData(filtered);
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="姓名" style={{ width: 120 }} value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
        <Input placeholder="被访人" style={{ width: 120 }} value={filters.host} onChange={e => setFilters(f => ({ ...f, host: e.target.value }))} />
        <Select allowClear placeholder="状态" style={{ width: 120 }} value={filters.status} onChange={v => setFilters(f => ({ ...f, status: v }))} options={Object.keys(statusColors).map(s => ({ value: s, label: s }))} />
        <Button icon={<SearchOutlined />} onClick={handleFilter}>筛选</Button>
        <Button icon={<ExportOutlined />} onClick={exportExcel}>导出Excel</Button>
        <Button icon={<BarChartOutlined />} type="link" onClick={()=>message.info('统计分析功能开发中')}>统计分析</Button>
      </Space>
      <Table columns={columns} dataSource={data} bordered rowKey="key" rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} />
      <Modal
        open={modal.open}
        title="访客记录详情"
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
            <p><b>备注：</b>{modal.record.remark}</p>
            <h4>进出日志</h4>
            <ul style={{ paddingLeft: 20 }}>{modal.record.log.map((l, i) => <li key={i}>{l}</li>)}</ul>
          </div>
        )}
      </Modal>
    </div>
  );
} 