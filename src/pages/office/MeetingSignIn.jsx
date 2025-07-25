import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, Modal, Space, Tooltip, QRCode, message } from 'antd';
import { SearchOutlined, ExportOutlined, QrcodeOutlined, InfoCircleOutlined } from '@ant-design/icons';

const mockMeetings = [
  { id: 1, title: '项目启动会', room: 'A101', time: '2025-05-2809:00', total: 20, signed: 18, status: '进行中', signList: [
    { name: '王建国', time: '09:01' }, { name: '李明', time: '09:02' }, { name: '赵云', time: '09:03' }
  ] },
  { id: 2, title: '产品评审', room: 'B201', time: '2025-05-27 14:00', total: 12, signed: 12, status: '已结束', signList: [
    { name: '孙倩', time: '14:01' }, { name: '陈梓涵', time: '14:02' }
  ] },
  { id: 3, title: '技术分享', room: 'C301', time: '2025-05-27 15:00', total: 16, signed: 10, status: '未开始', signList: [] },
];

const statusColors = { '进行中': 'blue', '已结束': 'green', '未开始': 'default' };

export default function MeetingSignIn() {
  const [search, setSearch] = useState('');
  const [data] = useState(mockMeetings);
  const [qrModal, setQrModal] = useState({ open: false, record: null });
  const [detailModal, setDetailModal] = useState({ open: false, record: null });

  const columns = [
    { title: '会议主题', dataIndex: 'title', key: 'title' },
    { title: '会议室', dataIndex: 'room', key: 'room' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '应到', dataIndex: 'total', key: 'total' },
    { title: '已签到', dataIndex: 'signed', key: 'signed' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="签到二维码"><Button icon={<QrcodeOutlined />} onClick={()=>setQrModal({ open: true, record })} /></Tooltip>
          <Tooltip title="签到详情"><Button icon={<InfoCircleOutlined />} onClick={()=>setDetailModal({ open: true, record })} /></Tooltip>
        </Space>
      ),
    },
  ];

  function exportExcel() {
    const rows = data.map(r => ({ ...r }));
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '会议签到列表.csv';
    a.click();
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索会议主题/会议室"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<ExportOutlined />} onClick={exportExcel}>导出</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(r => r.title.includes(search) || r.room.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={qrModal.open}
        title="签到二维码"
        onCancel={()=>setQrModal({ open: false, record: null })}
        footer={null}
      >
        {qrModal.record && (
          <div style={{textAlign:'center',padding:24}}>
            <QRCode value={`meeting-signin-${qrModal.record.id}`} style={{ width: 200, height: 200 }} />
            <div style={{marginTop:16}}>请扫码签到</div>
          </div>
        )}
      </Modal>
      <Modal
        open={detailModal.open}
        title="签到详情"
        onCancel={()=>setDetailModal({ open: false, record: null })}
        footer={null}
      >
        {detailModal.record && (
          <div>
            <p><b>会议主题：</b>{detailModal.record.title}</p>
            <p><b>会议室：</b>{detailModal.record.room}</p>
            <p><b>时间：</b>{detailModal.record.time}</p>
            <p><b>应到人数：</b>{detailModal.record.total}</p>
            <p><b>已签到：</b>{detailModal.record.signed}</p>
            <p><b>状态：</b><Tag color={statusColors[detailModal.record.status]}>{detailModal.record.status}</Tag></p>
            <b>签到人员：</b>
            <ul>
              {detailModal.record.signList.length ? detailModal.record.signList.map((s,i)=>(<li key={i}>{s.name}（{s.time}）</li>)) : <li>暂无签到</li>}
            </ul>
          </div>
        )}
      </Modal>
    </Card>
  );
} 