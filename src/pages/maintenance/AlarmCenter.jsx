import React, { useState } from 'react';
import { Card, Row, Col, Tag, Table, Button, Input, Modal, Space, Tooltip, Select, DatePicker, Alert } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, InfoCircleOutlined, DownloadOutlined, BellOutlined, PieChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { Pie, Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

// mock告警数据
const levels = ['一般','重要','严重'];
const types = ['电梯','空调','消防','照明','门禁'];
const statusMap = { '未处理': 'orange', '处理中': 'blue', '已处理': 'green' };
const mockAlarms = Array.from({length: 30}, (_,i) => ({
  id: i+1,
  device: `${types[i%types.length]}${i%5+1}`,
  type: types[i%types.length],
  level: levels[Math.floor(Math.random()*3)],
  status: ['未处理','处理中','已处理'][Math.floor(Math.random()*3)],
  time: dayjs().subtract(Math.floor(Math.random()*7),'day').format('YYYY-MM-DD HH:mm'),
  desc: '设备异常自动告警',
  handler: ['王建国','李明','赵云','孙倩','陈梓涵'][i%5],
  record: [
    { time: dayjs().subtract(Math.floor(Math.random()*7),'day').format('YYYY-MM-DD HH:mm'), action: '告警产生', user: '系统' },
    { time: dayjs().subtract(Math.floor(Math.random()*6),'day').format('YYYY-MM-DD HH:mm'), action: '已分派', user: '管理员' },
  ]
}));

export default function AlarmCenter() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [data] = useState(mockAlarms);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modal, setModal] = useState({ open: false, record: null });

  // 统计
  const today = dayjs().format('YYYY-MM-DD');
  const todayAlarms = data.filter(a=>a.time.startsWith(today)).length;
  const unhandled = data.filter(a=>a.status==='未处理').length;
  const handled = data.filter(a=>a.status==='已处理').length;
  const serious = data.filter(a=>a.level==='严重').length;

  // 图表数据
  const pieData = types.map(t=>({ type: t, value: data.filter(a=>a.type===t).length }));
  const lineData = Array.from({length:7}, (_,i)=>{
    const date = dayjs().subtract(6-i,'day').format('YYYY-MM-DD');
    return { date, value: data.filter(a=>a.time.startsWith(date)).length };
  });

  // 筛选
  const filtered = data.filter(a =>
    (!search || a.device.includes(search)) &&
    (!type || a.type === type) &&
    (!level || a.level === level) &&
    (!status || a.status === status) &&
    (!dateRange.length || (dayjs(a.time).isSameOrAfter(dateRange[0],'day') && dayjs(a.time).isSameOrBefore(dateRange[1],'day')))
  );

  const columns = [
    { title: '设备', dataIndex: 'device', key: 'device' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '级别', dataIndex: 'level', key: 'level', render: l => <Tag color={l==='严重'?'red':l==='重要'?'orange':'default'}>{l}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusMap[s]}>{s}</Tag> },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '处理人', dataIndex: 'handler', key: 'handler' },
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

  function exportExcel() {
    // 简单导出示例
    const rows = filtered.map(r => ({ ...r }));
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '告警列表.csv';
    a.click();
  }

  return (
    <Card className="content-card">
      <Row gutter={[32, 24]} style={{marginBottom:24}}>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #e6f7ff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f8fafc'}}><div style={{ color: '#1890ff', fontSize: 14, marginBottom: 4 }}>今日告警</div><div style={{ fontSize: 36, fontWeight: 700, color: '#1890ff' }}>{todayAlarms}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fffbe6',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fffbe6'}}><div style={{ color: '#faad14', fontSize: 14, marginBottom: 4 }}>未处理</div><div style={{ fontSize: 36, fontWeight: 700, color: '#faad14' }}>{unhandled}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #f6ffed',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f6fffb'}}><div style={{ color: '#52c41a', fontSize: 14, marginBottom: 4 }}>已处理</div><div style={{ fontSize: 36, fontWeight: 700, color: '#52c41a' }}>{handled}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fff1f0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fff1f0'}}><div style={{ color: '#ff4d4f', fontSize: 14, marginBottom: 4 }}>严重告警</div><div style={{ fontSize: 36, fontWeight: 700, color: '#ff4d4f' }}>{serious}</div></Card></Col>
      </Row>
      {unhandled > 0 && <Alert type="error" showIcon style={{marginBottom:24}} message={<span><BellOutlined style={{color:'#ff4d4f'}} /> 当前有 <b style={{color:'#ff4d4f'}}>{unhandled}</b> 条未处理告警，请及时处理！</span>} />}
      <Row gutter={24} style={{marginBottom:24}}>
        <Col span={12}><Card variant="outlined" style={{borderRadius:16,boxShadow:'0 2px 12px #f0f5ff'}} title={<><LineChartOutlined /> 近7天告警趋势</>}><Line height={200} data={lineData} xField="date" yField="value" point={{size:4}} color="#1890ff" /></Card></Col>
        <Col span={12}><Card variant="outlined" style={{borderRadius:16,boxShadow:'0 2px 12px #f0f5ff'}} title={<><PieChartOutlined /> 告警类型分布</>}><Pie height={200} data={pieData} angleField="value" colorField="type" radius={0.9} label={{type:'outer',content:(data)=>`${data.type} ${(data.percent*100).toFixed(1)}%`}} legend={{position:'bottom'}} /></Card></Col>
      </Row>
      <Card variant="outlined" style={{marginBottom:16}}>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:16}}>
          <Input.Search placeholder="搜索设备" allowClear enterButton={<SearchOutlined />} style={{width:200}} value={search} onChange={e=>setSearch(e.target.value)} />
          <Select placeholder="类型" allowClear style={{width:120}} value={type} onChange={setType}>{types.map(t=>(<Option key={t} value={t}>{t}</Option>))}</Select>
          <Select placeholder="级别" allowClear style={{width:120}} value={level} onChange={setLevel}>{levels.map(l=>(<Option key={l} value={l}>{l}</Option>))}</Select>
          <Select placeholder="状态" allowClear style={{width:120}} value={status} onChange={setStatus}>{Object.keys(statusMap).map(s=>(<Option key={s} value={s}>{s}</Option>))}</Select>
          <RangePicker value={dateRange} onChange={setDateRange} style={{width:260}} />
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>导出</Button>
          <Button disabled={!selectedRowKeys.length} onClick={()=>{setSelectedRowKeys([])}}>批量处理</Button>
        </div>
        <Table
          rowSelection={{selectedRowKeys,onChange:setSelectedRowKeys}}
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{pageSize:8}}
        />
      </Card>
      <Modal
        open={modal.open}
        title="告警详情"
        onCancel={()=>setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>设备：</b>{modal.record.device}</p>
            <p><b>类型：</b>{modal.record.type}</p>
            <p><b>级别：</b><Tag color={modal.record.level==='严重'?'red':modal.record.level==='重要'?'orange':'default'}>{modal.record.level}</Tag></p>
            <p><b>状态：</b><Tag color={statusMap[modal.record.status]}>{modal.record.status}</Tag></p>
            <p><b>时间：</b>{modal.record.time}</p>
            <p><b>处理人：</b>{modal.record.handler}</p>
            <p><b>描述：</b>{modal.record.desc}</p>
            <b>处理记录：</b>
            <ul>
              {modal.record.record.map((r,i)=>(<li key={i}>{r.time} - {r.action}（{r.user}）</li>))}
            </ul>
          </div>
        )}
      </Modal>
    </Card>
  );
} 