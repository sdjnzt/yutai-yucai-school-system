import React, { useState } from 'react';
import { Card, Row, Col, Tag, Table, Button, Input, Modal, Space, Tooltip, Select, message } from 'antd';
import { SearchOutlined, DownloadOutlined, InfoCircleOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { Pie, Bar } from '@ant-design/plots';

const { Option } = Select;

// mock设备数据
const types = ['电梯','空调','消防','照明','门禁'];
const statusList = ['在线','离线','异常','待巡检'];
const managers = ['王建国','李明','赵云','孙倩','陈梓涵'];
const mockDevices = Array.from({length: 30}, (_,i) => ({
  id: i+1,
  name: `${types[i%types.length]}${i+1}`,
  type: types[i%types.length],
  status: statusList[Math.floor(Math.random()*4)],
  location: `${Math.floor(i/5)+1}号楼${String.fromCharCode(65+i%3)}区`,
  manager: managers[i%5],
  lastCheck: `2025-05-${(10 + (i%19)).toString().padStart(2,'0')}`,
}));
const statusColors = { '在线': 'green', '离线': 'default', '异常': 'red', '待巡检': 'orange' };

export default function Device() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [manager, setManager] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modal, setModal] = useState({ open: false, record: null });
  const [data] = useState(mockDevices);

  // 统计
  const total = data.length;
  const online = data.filter(d=>d.status==='在线').length;
  const offline = data.filter(d=>d.status==='离线').length;
  const abnormal = data.filter(d=>d.status==='异常').length;
  const toCheck = data.filter(d=>d.status==='待巡检').length;

  // 图表数据
  const pieData = types.map(t=>({ type: t, value: data.filter(d=>d.type===t).length }));
  const barData = statusList.map(s=>({ status: s, value: data.filter(d=>d.status===s).length }));

  // 筛选
  const filtered = data.filter(d =>
    (!search || d.name.includes(search) || d.location.includes(search)) &&
    (!type || d.type === type) &&
    (!status || d.status === status) &&
    (!manager || d.manager === manager)
  );

  const columns = [
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '上次巡检', dataIndex: 'lastCheck', key: 'lastCheck' },
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
    message.success('模拟导出Excel成功');
  }

  return (
    <Card className="content-card">
      <Row gutter={[32, 24]} style={{marginBottom:24}}>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #e6f7ff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f8fafc'}}><div style={{ color: '#1890ff', fontSize: 14, marginBottom: 4 }}>设备总数</div><div style={{ fontSize: 36, fontWeight: 700, color: '#1890ff' }}>{total}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #f6ffed',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f6fffb'}}><div style={{ color: '#52c41a', fontSize: 14, marginBottom: 4 }}>在线</div><div style={{ fontSize: 36, fontWeight: 700, color: '#52c41a' }}>{online}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fffbe6',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fffbe6'}}><div style={{ color: '#faad14', fontSize: 14, marginBottom: 4 }}>待巡检</div><div style={{ fontSize: 36, fontWeight: 700, color: '#faad14' }}>{toCheck}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fff1f0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fff1f0'}}><div style={{ color: '#ff4d4f', fontSize: 14, marginBottom: 4 }}>异常</div><div style={{ fontSize: 36, fontWeight: 700, color: '#ff4d4f' }}>{abnormal}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #f0f1f2',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f0f1f2'}}><div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>离线</div><div style={{ fontSize: 36, fontWeight: 700, color: '#888' }}>{offline}</div></Card></Col>
      </Row>
      <Row gutter={24} style={{marginBottom:24}}>
        <Col span={12}><Card variant="outlined" style={{borderRadius:16,boxShadow:'0 2px 12px #f0f5ff'}} title={<><PieChartOutlined /> 设备类型分布</>}><Pie height={200} data={pieData} angleField="value" colorField="type" radius={0.9} label={{type:'outer',content:(data)=>`${data.type} ${(data.percent*100).toFixed(1)}%`}} legend={{position:'bottom'}} /></Card></Col>
        <Col span={12}><Card variant="outlined" style={{borderRadius:16,boxShadow:'0 2px 12px #f0f5ff'}} title={<><BarChartOutlined /> 设备状态分布</>}><Bar height={200} data={barData} xField="status" yField="value" colorField="status" barWidthRatio={0.5} /></Card></Col>
      </Row>
      <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:16}}>
        <Input.Search placeholder="搜索设备名称/位置" allowClear enterButton={<SearchOutlined />} style={{width:220}} value={search} onChange={e=>setSearch(e.target.value)} />
        <Select placeholder="类型" allowClear style={{width:120}} value={type} onChange={setType}>{types.map(t=>(<Option key={t} value={t}>{t}</Option>))}</Select>
        <Select placeholder="状态" allowClear style={{width:120}} value={status} onChange={setStatus}>{statusList.map(s=>(<Option key={s} value={s}>{s}</Option>))}</Select>
        <Select placeholder="负责人" allowClear style={{width:120}} value={manager} onChange={setManager}>{managers.map(m=>(<Option key={m} value={m}>{m}</Option>))}</Select>
        <Button icon={<DownloadOutlined />} onClick={exportExcel}>导出</Button>
        <Button disabled={!selectedRowKeys.length} onClick={()=>{setSelectedRowKeys([]);message.success('模拟批量操作')}}>批量操作</Button>
      </div>
      <Table
        rowSelection={{selectedRowKeys,onChange:setSelectedRowKeys}}
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{pageSize:8}}
      />
      <Modal
        open={modal.open}
        title="设备详情"
        onCancel={()=>setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>设备名称：</b>{modal.record.name}</p>
            <p><b>类型：</b>{modal.record.type}</p>
            <p><b>状态：</b><Tag color={statusColors[modal.record.status]}>{modal.record.status}</Tag></p>
            <p><b>位置：</b>{modal.record.location}</p>
            <p><b>负责人：</b>{modal.record.manager}</p>
            <p><b>上次巡检：</b>{modal.record.lastCheck}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
}
