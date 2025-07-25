import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, Modal, Space, Tooltip, Select, DatePicker, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const mockDepts = ['研发部','市场部','行政部','财务部','人事部'];
const mockNames = ['王建国','李明','赵云','孙倩','陈梓涵','李思远','孙嘉禾','张伟','刘洋','王芳'];
function randomDept() { return mockDepts[Math.floor(Math.random()*mockDepts.length)]; }
function randomName() { return mockNames[Math.floor(Math.random()*mockNames.length)]; }
function randomTime(base='09:00') { const h = 8+Math.floor(Math.random()*2); const m = Math.floor(Math.random()*60); return `${h}:${m<10?'0'+m:m}`; }
function randomStatus() { return ['正常','迟到','早退','缺勤'][Math.floor(Math.random()*4)]; }

const mockData = Array.from({length: 30}, (_,i) => ({
  id: i+1,
  name: randomName(),
  dept: randomDept(),
  date: dayjs('2025-05-10').add(i%19,'day').format('YYYY-MM-DD'),
  signIn: randomTime(),
  signOut: randomTime('17:00'),
  status: randomStatus(),
  remark: Math.random()>0.7 ? '外出公干' : ''
}));

const statusColors = { '正常': 'green', '迟到': 'orange', '早退': 'blue', '缺勤': 'red' };

export default function Attendance() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [data] = useState(mockData);
  const [modal, setModal] = useState({ open: false, record: null });

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '签到时间', dataIndex: 'signIn', key: 'signIn' },
    { title: '签退时间', dataIndex: 'signOut', key: 'signOut' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="详情"><Button icon={<InfoCircleOutlined />} onClick={()=>setModal({ open: true, record })} /></Tooltip>
        </Space>
      ),
    },
  ];

  // 统计
  const total = data.length;
  const normal = data.filter(d=>d.status==='正常').length;
  const late = data.filter(d=>d.status==='迟到').length;
  const early = data.filter(d=>d.status==='早退').length;
  const absent = data.filter(d=>d.status==='缺勤').length;

  function exportExcel() {
    const rows = data.map(r => ({ ...r }));
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '智慧考勤列表.csv';
    a.click();
  }

  // 筛选
  const filtered = data.filter(d =>
    (!search || d.name.includes(search)) &&
    (!dept || d.dept === dept) &&
    (!dateRange.length || (dayjs(d.date).isSameOrAfter(dateRange[0],'day') && dayjs(d.date).isSameOrBefore(dateRange[1],'day')))
  );

  return (
    <Card className="content-card">
      <Row gutter={[32, 24]} style={{marginBottom:24}}>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #e6f7ff',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#f8fafc'
          }}>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>总记录</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#222' }}>{total}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #e6fffb',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#f6fffb'
          }}>
            <div style={{ color: '#52c41a', fontSize: 14, marginBottom: 4 }}>正常</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#52c41a' }}>{normal}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #fffbe6',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#fffbe6'
          }}>
            <div style={{ color: '#faad14', fontSize: 14, marginBottom: 4 }}>迟到</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#faad14' }}>{late}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #e6f4ff',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#e6f4ff'
          }}>
            <div style={{ color: '#1890ff', fontSize: 14, marginBottom: 4 }}>早退</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#1890ff' }}>{early}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{
            minWidth:130,
            height:90,
            borderRadius:16,
            boxShadow:'0 4px 16px #fff1f0',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            background:'#fff1f0'
          }}>
            <div style={{ color: '#ff4d4f', fontSize: 14, marginBottom: 4 }}>缺勤</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#ff4d4f' }}>{absent}</div>
          </Card>
        </Col>
      </Row>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:200}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Select placeholder="部门" allowClear style={{width:120}} value={dept} onChange={setDept}>
          {mockDepts.map(d=>(<Option key={d} value={d}>{d}</Option>))}
        </Select>
        <RangePicker value={dateRange} onChange={setDateRange} style={{width:260}} />
        <Button icon={<ExportOutlined />} onClick={exportExcel}>导出</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{pageSize:8}}
      />
      <Modal
        open={modal.open}
        title="考勤详情"
        onCancel={()=>setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>姓名：</b>{modal.record.name}</p>
            <p><b>部门：</b>{modal.record.dept}</p>
            <p><b>日期：</b>{modal.record.date}</p>
            <p><b>签到时间：</b>{modal.record.signIn}</p>
            <p><b>签退时间：</b>{modal.record.signOut}</p>
            <p><b>状态：</b><Tag color={statusColors[modal.record.status]}>{modal.record.status}</Tag></p>
            <p><b>备注：</b>{modal.record.remark||'-'}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
} 