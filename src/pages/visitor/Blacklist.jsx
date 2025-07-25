import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Input, Select, message, Tooltip } from 'antd';
import { DeleteOutlined, ExportOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const reasonColors = { '多次违规': 'red', '恶意闯入': 'orange', '其他': 'default' };
const mockBlacklist = [
  { key: '1', name: '林梓萱', phone: '18653128899', reason: '多次违规', time: '2025-05-21', log: ['2025-05-21 拉黑：多次违规'], remark: '多次无故滞留园区，禁止入园' },
  { key: '2', name: '高子墨', phone: '13969887788', reason: '恶意闯入', time: '2025-05-23', log: ['2025-05-23 拉黑：恶意闯入'], remark: '多次尾随闯入，禁止入园' },
  { key: '3', name: '许思辰', phone: '18560093321', reason: '其他', time: '2025-05-26', log: ['2025-05-26 拉黑：其他'], remark: '携带违禁品，禁止入园' },
  { key: '4', name: '罗一帆', phone: '18853104599', reason: '多次违规', time: '2025-05-28', log: ['2025-05-28 拉黑：多次违规'], remark: '多次违反园区管理规定' },
  { key: '5', name: '贾嘉懿', phone: '18753102399', reason: '恶意闯入', time: '2025-05-31', log: ['2025-05-31 拉黑：恶意闯入'], remark: '冒用他人身份入园' },
  { key: '6', name: '邹梓涵', phone: '18653107777', reason: '多次违规', time: '2025-05-10', log: ['2025-05-10 拉黑：多次违规'], remark: '多次无视安保劝阻' },
  { key: '7', name: '彭宇轩', phone: '18553106666', reason: '其他', time: '2025-05-11', log: ['2025-05-11 拉黑：其他'], remark: '扰乱园区秩序' },
  { key: '8', name: '丁思远', phone: '18753105577', reason: '恶意闯入', time: '2025-05-12', log: ['2025-05-12 拉黑：恶意闯入'], remark: '多次翻越围栏' },
  { key: '9', name: '蒋雨彤', phone: '18653102277', reason: '多次违规', time: '2025-05-13', log: ['2025-05-13 拉黑：多次违规'], remark: '多次违规停车' },
  { key: '10', name: '魏浩然', phone: '18553104488', reason: '其他', time: '2025-05-14', log: ['2025-05-14 拉黑：其他'], remark: '携带危险品入园' },
];

export default function Blacklist() {
  const [data, setData] = useState(mockBlacklist);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modal, setModal] = useState({ open: false, record: null });
  const [filters, setFilters] = useState({ reason: undefined, name: '' });

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '拉黑原因', dataIndex: 'reason', key: 'reason', render: r => <Tag color={reasonColors[r]}>{r}</Tag> },
    { title: '拉黑时间', dataIndex: 'time', key: 'time' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleRemove(record.key)}>移除</Button>
          <Tooltip title="详情"><Button icon={<InfoCircleOutlined />} onClick={() => setModal({ open: true, record })} /></Tooltip>
        </Space>
      ),
    },
  ];

  function handleRemove(key) {
    setData(data.filter(item => item.key !== key));
    setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
    message.success('移除成功');
  }

  function handleBatchRemove() {
    setData(data.filter(item => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
    message.success('批量移除成功');
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(selectedRowKeys.length ? data.filter(d => selectedRowKeys.includes(d.key)) : data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '黑名单');
    XLSX.writeFile(wb, '黑名单.xlsx');
  }

  function handleFilter() {
    let filtered = mockBlacklist;
    if (filters.reason) filtered = filtered.filter(r => r.reason === filters.reason);
    if (filters.name) filtered = filtered.filter(r => r.name.includes(filters.name));
    setData(filtered);
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="姓名" style={{ width: 120 }} value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
        <Select allowClear placeholder="拉黑原因" style={{ width: 140 }} value={filters.reason} onChange={v => setFilters(f => ({ ...f, reason: v }))} options={Object.keys(reasonColors).map(s => ({ value: s, label: s }))} />
        <Button icon={<SearchOutlined />} onClick={handleFilter}>筛选</Button>
        <Button icon={<ExportOutlined />} onClick={exportExcel}>导出Excel</Button>
        <Button danger icon={<DeleteOutlined />} disabled={!selectedRowKeys.length} onClick={handleBatchRemove}>批量移除</Button>
      </Space>
      <Table columns={columns} dataSource={data} bordered rowKey="key" rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} />
      <Modal
        open={modal.open}
        title="黑名单详情"
        onCancel={() => setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>姓名：</b>{modal.record.name}</p>
            <p><b>手机号：</b>{modal.record.phone}</p>
            <p><b>拉黑原因：</b><Tag color={reasonColors[modal.record.reason]}>{modal.record.reason}</Tag></p>
            <p><b>拉黑时间：</b>{modal.record.time}</p>
            <p><b>备注：</b>{modal.record.remark}</p>
            <h4>拉黑日志</h4>
            <ul style={{ paddingLeft: 20 }}>{modal.record.log.map((l, i) => <li key={i}>{l}</li>)}</ul>
          </div>
        )}
      </Modal>
    </div>
  );
} 