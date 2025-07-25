import React, { useState } from 'react';
import { Card, Row, Col, Tag, Table, Button, Input, Modal, Space, Tooltip, Select, DatePicker, Statistic, message } from 'antd';
import { SearchOutlined, DownloadOutlined, InfoCircleOutlined, UserOutlined, LineChartOutlined, TrophyOutlined, PlusOutlined } from '@ant-design/icons';
import { Line, Bar } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

// mock计划与任务数据
const plans = Array.from({length: 8}, (_,i) => ({
  id: i+1,
  name: `巡检计划${i+1}`,
  cycle: ['每日','每周','每月'][i%3],
  manager: ['王建国','李明','赵云','孙倩','陈梓涵'][i%5],
  status: ['进行中','已完成','异常'][Math.floor(Math.random()*3)],
  next: dayjs().add(i,'day').format('YYYY-MM-DD'),
}));
const tasks = Array.from({length: 30}, (_,i) => ({
  id: i+1,
  plan: `巡检计划${i%8+1}`,
  device: `设备${i%10+1}`,
  executor: ['王建国','李明','赵云','孙倩','陈梓涵'][i%5],
  time: dayjs().subtract(Math.floor(Math.random()*7),'day').format('YYYY-MM-DD HH:mm'),
  result: ['正常','异常'][Math.floor(Math.random()*2)],
  remark: Math.random()>0.7?'发现小问题':''
}));

export default function InspectionManage() {
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('');
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [modal, setModal] = useState({ open: false, record: null });
  const [tab, setTab] = useState('plan');

  // 统计
  const total = plans.length;
  const finished = plans.filter(p=>p.status==='已完成').length;
  const doing = plans.filter(p=>p.status==='进行中').length;
  const abnormal = plans.filter(p=>p.status==='异常').length;

  // 趋势图
  const lineData = Array.from({length:7}, (_,i)=>{
    const date = dayjs().subtract(6-i,'day').format('YYYY-MM-DD');
    return { date, value: tasks.filter(t=>t.time.startsWith(date)).length };
  });
  // 责任人排名
  const userRank = ['王建国','李明','赵云','孙倩','陈梓涵'].map(u=>(
    { user: u, value: tasks.filter(t=>t.executor===u && t.result==='正常').length }
  ));

  // 筛选
  const filteredPlans = plans.filter(p =>
    (!search || p.name.includes(search)) &&
    (!manager || p.manager === manager) &&
    (!status || p.status === status)
  );
  const filteredTasks = tasks.filter(t =>
    (!search || t.device.includes(search) || t.executor.includes(search)) &&
    (!plan || t.plan === plan) &&
    (!manager || t.executor === manager) &&
    (!dateRange.length || (dayjs(t.time).isSameOrAfter(dateRange[0],'day') && dayjs(t.time).isSameOrBefore(dateRange[1],'day')))
  );

  // 计划表格
  const planColumns = [
    { title: '计划名称', dataIndex: 'name', key: 'name' },
    { title: '周期', dataIndex: 'cycle', key: 'cycle' },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={s==='已完成'?'green':s==='进行中'?'blue':'red'}>{s}</Tag> },
    { title: '下次执行', dataIndex: 'next', key: 'next' },
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
  // 任务表格
  const taskColumns = [
    { title: '计划', dataIndex: 'plan', key: 'plan' },
    { title: '设备', dataIndex: 'device', key: 'device' },
    { title: '执行人', dataIndex: 'executor', key: 'executor' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '结果', dataIndex: 'result', key: 'result', render: r => <Tag color={r==='正常'?'green':'red'}>{r}</Tag> },
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

  return (
    <Card className="content-card">
      <Row gutter={[32, 24]} style={{marginBottom:24}}>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #e6f7ff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f8fafc'}}><div style={{ color: '#1890ff', fontSize: 14, marginBottom: 4 }}>计划总数</div><div style={{ fontSize: 36, fontWeight: 700, color: '#1890ff' }}>{total}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #f6ffed',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f6fffb'}}><div style={{ color: '#52c41a', fontSize: 14, marginBottom: 4 }}>已完成</div><div style={{ fontSize: 36, fontWeight: 700, color: '#52c41a' }}>{finished}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fffbe6',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fffbe6'}}><div style={{ color: '#faad14', fontSize: 14, marginBottom: 4 }}>进行中</div><div style={{ fontSize: 36, fontWeight: 700, color: '#faad14' }}>{doing}</div></Card></Col>
        <Col><Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fff1f0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fff1f0'}}><div style={{ color: '#ff4d4f', fontSize: 14, marginBottom: 4 }}>异常</div><div style={{ fontSize: 36, fontWeight: 700, color: '#ff4d4f' }}>{abnormal}</div></Card></Col>
      </Row>
      <Row gutter={24} style={{marginBottom:24}}>
        <Col span={12}><Card variant="outlined" style={{borderRadius:16,boxShadow:'0 2px 12px #f0f5ff'}} title={<><LineChartOutlined /> 近7天巡检任务趋势</>}><Line height={200} data={lineData} xField="date" yField="value" point={{size:4}} color="#1890ff" /></Card></Col>
        <Col span={12}><Card variant="outlined" style={{borderRadius:16,boxShadow:'0 2px 12px #f0f5ff'}} title={<><TrophyOutlined /> 责任人排名</>}><Bar height={200} data={userRank} xField="user" yField="value" color="#52c41a" barWidthRatio={0.5} /></Card></Col>
      </Row>
      <div style={{display:'flex',gap:16,marginBottom:16}}>
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>message.info('模拟新建计划')}>新建计划</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出成功')}>导出</Button>
      </div>
      <div style={{display:'flex',gap:16,marginBottom:16}}>
        <Input.Search placeholder="搜索计划/设备/执行人" allowClear enterButton={<SearchOutlined />} style={{width:220}} value={search} onChange={e=>setSearch(e.target.value)} />
        <Select placeholder="计划" allowClear style={{width:120}} value={plan} onChange={setPlan}>{plans.map(p=>(<Option key={p.name} value={p.name}>{p.name}</Option>))}</Select>
        <Select placeholder="负责人/执行人" allowClear style={{width:120}} value={manager} onChange={setManager}>{['王建国','李明','赵云','孙倩','陈梓涵'].map(u=>(<Option key={u} value={u}>{u}</Option>))}</Select>
        <Select placeholder="状态" allowClear style={{width:120}} value={status} onChange={setStatus}>{['进行中','已完成','异常'].map(s=>(<Option key={s} value={s}>{s}</Option>))}</Select>
        <RangePicker value={dateRange} onChange={setDateRange} style={{width:260}} />
      </div>
      <div style={{display:'flex',gap:16,marginBottom:16}}>
        <Button onClick={()=>setTab('plan')} type={tab==='plan'?'primary':'default'}>计划管理</Button>
        <Button onClick={()=>setTab('task')} type={tab==='task'?'primary':'default'}>任务执行</Button>
      </div>
      {tab==='plan' ? (
        <Table
          columns={planColumns}
          dataSource={filteredPlans}
          rowKey="id"
          pagination={{pageSize:6}}
        />
      ) : (
        <Table
          columns={taskColumns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{pageSize:8}}
        />
      )}
      <Modal
        open={modal.open}
        title={tab==='plan'?'计划详情':'任务详情'}
        onCancel={()=>setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && tab==='plan' && (
          <div>
            <p><b>计划名称：</b>{modal.record.name}</p>
            <p><b>周期：</b>{modal.record.cycle}</p>
            <p><b>负责人：</b>{modal.record.manager}</p>
            <p><b>状态：</b><Tag color={modal.record.status==='已完成'?'green':modal.record.status==='进行中'?'blue':'red'}>{modal.record.status}</Tag></p>
            <p><b>下次执行：</b>{modal.record.next}</p>
          </div>
        )}
        {modal.record && tab==='task' && (
          <div>
            <p><b>计划：</b>{modal.record.plan}</p>
            <p><b>设备：</b>{modal.record.device}</p>
            <p><b>执行人：</b>{modal.record.executor}</p>
            <p><b>时间：</b>{modal.record.time}</p>
            <p><b>结果：</b><Tag color={modal.record.result==='正常'?'green':'red'}>{modal.record.result}</Tag></p>
            <p><b>备注：</b>{modal.record.remark||'-'}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
} 