import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Tag, List, Avatar, Modal, Select, message, Tooltip, Checkbox } from 'antd';
import { VideoCameraOutlined, LockOutlined, CarOutlined, UserOutlined, TeamOutlined, ThunderboltOutlined, ToolOutlined, FireOutlined, BankOutlined, CalendarOutlined, BellOutlined, ArrowRightOutlined, SettingOutlined, FullscreenOutlined, FullscreenExitOutlined, DragOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

// 初始统计数据
const initStats = [
  { key: 'people', title: '园区总人数', value: 1200, icon: <UserOutlined />, color: '#1890ff' },
  { key: 'visitor', title: '今日访客', value: 38, icon: <TeamOutlined />, color: '#52c41a' },
  { key: 'alarm', title: '今日告警', value: 2, icon: <BellOutlined />, color: '#faad14' },
  { key: 'energy', title: '能耗总览', value: 3200, icon: <ThunderboltOutlined />, color: '#722ed1', suffix: 'kWh' },
  { key: 'device', title: '设备总数', value: 256, icon: <ToolOutlined />, color: '#13c2c2' },
  { key: 'meeting', title: '会议预约', value: 12, icon: <CalendarOutlined />, color: '#eb2f96' },
];

// 快捷入口（含权限）
const allQuickLinks = [
  { key: 'video', title: '视频监控', icon: <VideoCameraOutlined />, path: '/video', color: '#1890ff', roles: ['admin', 'security', 'user'] },
  { key: 'access', title: '门禁管理', icon: <LockOutlined />, path: '/access', color: '#52c41a', roles: ['admin', 'security'] },
  { key: 'parking', title: '停车管理', icon: <CarOutlined />, path: '/parking', color: '#faad14', roles: ['admin', 'parking'] },
  { key: 'visitor', title: '访客管理', icon: <UserOutlined />, path: '/visitor', color: '#eb2f96', roles: ['admin', 'reception'] },
  { key: 'energy', title: '能耗管理', icon: <ThunderboltOutlined />, path: '/energy', color: '#722ed1', roles: ['admin', 'energy'] },
  { key: 'maintenance', title: '设备运维', icon: <ToolOutlined />, path: '/maintenance', color: '#13c2c2', roles: ['admin', 'maintenance'] },
  { key: 'fire', title: '消防管理', icon: <FireOutlined />, path: '/fire', color: '#f5222d', roles: ['admin', 'fire'] },
  { key: 'office', title: '智慧办公', icon: <BankOutlined />, path: '/office', color: '#2f54eb', roles: ['admin', 'office'] },
  { key: 'system', title: '系统管理', icon: <SettingOutlined />, path: '/system', color: '#b37feb', roles: ['admin'] },
];

const months = ['1月','2月','3月','4月','5月'];
const quarters = ['Q1', 'Q2'];
const years = ['2024', '2025'];

// 趋势图表Mock数据生成
const getTrendData = (dimension) => {
  if (dimension === 'month') {
    return [
      ...months.map((m, i) => ({ month: m, type: '能耗', value: 2800 + i * 150 })),
      ...months.map((m, i) => ({ month: m, type: '访客', value: 100 + i * 20 })),
      ...months.map((m, i) => ({ month: m, type: '告警', value: 5 - i % 3 })),
      ...months.map((m, i) => ({ month: m, type: '预测', value: 3000 + i * 100 })),
      ...months.map(m => ({ month: m, type: '目标', value: 3200 })),
    ];
  } else if (dimension === 'quarter') {
    return [
      ...quarters.map((q, i) => ({ month: q, type: '能耗', value: 2800 + i * 300 })),
      ...quarters.map((q, i) => ({ month: q, type: '访客', value: 150 + i * 30 })),
      ...quarters.map((q, i) => ({ month: q, type: '告警', value: 4 - i })),
      ...quarters.map((q, i) => ({ month: q, type: '预测', value: 3100 + i * 100 })),
      ...quarters.map(q => ({ month: q, type: '目标', value: 3200 })),
    ];
  } else {
    return [
      ...years.map((y, i) => ({ month: y, type: '能耗', value: 15000 + i * 2000 })),
      ...years.map((y, i) => ({ month: y, type: '访客', value: 1200 + i * 200 })),
      ...years.map((y, i) => ({ month: y, type: '告警', value: 18 - i * 6 })),
      ...years.map((y, i) => ({ month: y, type: '预测', value: 16500 + i * 1000 })),
      ...years.map((y, i) => ({ month: y, type: '目标', value: 16000 + i * 1000 })),
    ];
  }
};

// 最新动态
const news = [
  { title: '关于端午放假通知', type: '公告', time: '2025-05-28 09:00', tag: '已发布' },
  { title: '今日有2条告警待处理', type: '告警', time: '2025-05-10 10:20', tag: '待处理' },
  { title: '新员工入职培训', type: '公告', time: '2025-05-16 14:00', tag: '草稿' },
  { title: '会议室A101已被预约', type: '会议', time: '2025-05-10 09:00', tag: '已确认' },
];

// 最新动态详情Mock
const newsDetailMap = {
  '关于端午放假通知': '五一劳动节放假安排如下：5月31至6月2日放假，共3天。请各部门提前做好工作安排。',
  '今日有2条告警待处理': '今日园区发生2条安全告警，请相关人员及时处理。',
  '新员工入职培训': '新员工入职培训将于5月8日14:00在A101会议室举行，请相关人员准时参加。',
  '会议室A101已被预约': 'A101会议室已被预约用于项目周会，时间为5月10日9:00-10:00。',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [cardOrder, setCardOrder] = useState(initStats.map(s => s.key));
  const [cardVisible, setCardVisible] = useState(initStats.reduce((acc, s) => ({...acc, [s.key]: true}), {}));
  const [stats, setStats] = useState(initStats);
  const [fullscreen, setFullscreen] = useState(false);
  const [role, setRole] = useState('admin');
  const [settingOpen, setSettingOpen] = useState(false);
  const [dimension, setDimension] = useState('month');
  const [newsModal, setNewsModal] = useState({ open: false, title: '', content: '' });

  // 拖拽排序
  const moveCard = (from, to) => {
    const newOrder = [...cardOrder];
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, moved);
    setCardOrder(newOrder);
  };

  // 实时数据推送模拟
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(stats => stats.map(s => {
        let delta = 0;
        switch (s.key) {
          case 'people':
            delta = Math.floor(Math.random() * 3 - 1); // -1~+1
            return { ...s, value: Math.max(1000, s.value + delta) };
          case 'visitor':
            delta = Math.floor(Math.random() * 5 - 2); // -2~+2
            return { ...s, value: Math.max(0, s.value + delta) };
          case 'alarm':
            delta = Math.floor(Math.random() * 3 - 1); // -1~+1
            return { ...s, value: Math.max(0, Math.min(20, s.value + delta)) };
          case 'energy':
            delta = Math.floor(Math.random() * 20 - 5); // -5~+15
            return { ...s, value: Math.max(2000, s.value + delta) };
          case 'device':
            delta = Math.floor(Math.random() * 2 - 1); // -1~+1
            return { ...s, value: Math.max(200, s.value + delta) };
          case 'meeting':
            delta = Math.floor(Math.random() * 2 - 1); // -1~+1
            return { ...s, value: Math.max(0, s.value + delta) };
          default:
            return s;
        }
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const cardStyle = {
    borderRadius:12, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'transform 0.2s', cursor:'pointer'
  };

  const quickLinks = allQuickLinks.filter(link => link.roles.includes(role));

  const handleFullscreen = () => {
    setFullscreen(f => !f);
    setTimeout(() => {
      if (!fullscreen) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    }, 100);
  };

  const renderSettingModal = () => (
    <Modal
      open={settingOpen}
      title="卡片设置"
      onCancel={()=>setSettingOpen(false)}
      onOk={()=>setSettingOpen(false)}
      okText="完成"
      width={480}
    >
      <div style={{marginBottom:16, fontWeight:600}}>拖拽排序：</div>
      {cardOrder.map((key, idx) => (
        <div key={key} style={{display:'flex',alignItems:'center',marginBottom:8,gap:8}}>
          <DragOutlined style={{cursor:'grab'}} />
          <span style={{flex:1}}>{stats.find(s=>s.key===key)?.title}</span>
          {idx > 0 && <Button size="small" onClick={()=>moveCard(idx, idx-1)}>&uarr;</Button>}
          {idx < cardOrder.length-1 && <Button size="small" onClick={()=>moveCard(idx, idx+1)}>&darr;</Button>}
        </div>
      ))}
      <div style={{margin:'16px 0 8px 0', fontWeight:600}}>显示/隐藏：</div>
      {stats.map(s => (
        <Checkbox
          key={s.key}
          checked={cardVisible[s.key]}
          onChange={()=>setCardVisible(v => ({...v, [s.key]:!v[s.key]}))}
          style={{marginRight:16}}
        >{s.title}</Checkbox>
      ))}
    </Modal>
  );

  return (
    <div style={fullscreen ? {background:'#111', minHeight:'100vh', padding:24} : {}}>
      <div className="header" style={{marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <h2 className="page-title"><BankOutlined /> 智慧园区仪表盘</h2>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <Select value={role} onChange={setRole} style={{width:120}}>
            <Option value="admin">管理员</Option>
            <Option value="security">安保</Option>
            <Option value="parking">停车</Option>
            <Option value="reception">前台</Option>
            <Option value="energy">能耗</Option>
            <Option value="maintenance">运维</Option>
            <Option value="fire">消防</Option>
            <Option value="office">办公</Option>
            <Option value="user">普通用户</Option>
          </Select>
          <Tooltip title="卡片设置"><Button icon={<SettingOutlined />} onClick={()=>setSettingOpen(true)} /></Tooltip>
          <Button icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={handleFullscreen}>
            {fullscreen ? '退出大屏' : '大屏模式'}
          </Button>
        </div>
      </div>
      {/* 统计卡片自定义布局与显示 */}
      <Card className="content-card" style={{marginBottom:24, position:'relative'}}>
        {renderSettingModal()}
      <Row gutter={16} style={{marginBottom:24}}>
          {cardOrder.filter(key => cardVisible[key]).map(key => {
            const item = stats.find(s => s.key === key);
            return (
              <Col span={4} key={item.key}>
                <Card
                  bordered={false}
                  style={cardStyle}
                  onClick={()=>message.info(item.title+'详情（可跳转）')}
                  hoverable
                >
              <Statistic
                title={item.title}
                value={item.value}
                prefix={<span style={{color:item.color,fontSize:22}}>{item.icon}</span>}
                suffix={item.suffix}
              />
            </Card>
          </Col>
            );
          })}
      </Row>
      </Card>
      {/* 业务快捷入口 */}
      <Card className="content-card" style={{marginBottom:24}}>
        <Row gutter={[24,24]}>
          {quickLinks.map(link => (
            <Col span={3} key={link.key}>
              <Card
                hoverable
                style={{textAlign:'center',borderRadius:10,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',cursor:'pointer',border:`1px solid ${link.color}`} }
                onClick={()=>navigate(link.path)}
                bodyStyle={{padding:18}}
              >
                <div style={{fontSize:32,marginBottom:8,color:link.color}}>{link.icon}</div>
                <div style={{fontWeight:600,fontSize:16}}>{link.title}</div>
                <ArrowRightOutlined style={{color:link.color,marginTop:6}} />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      {/* 趋势图表和最新动态 */}
      <Row gutter={24}>
        <Col span={16}>
          <Card className="content-card" title="业务趋势分析" style={{marginBottom:24}}>
            <div style={{marginBottom:16, display:'flex', alignItems:'center', gap:16}}>
              <Select value={dimension} onChange={setDimension} style={{width:120}}>
                <Option value="month">按月</Option>
                <Option value="quarter">按季度</Option>
                <Option value="year">按年</Option>
              </Select>
            </div>
            <Line
              data={getTrendData(dimension)}
              xField="month"
              yField="value"
              seriesField="type"
              color={['#1890ff', '#52c41a', '#faad14', '#888', 'red']}
              legend={{ position: 'top' }}
              height={260}
              lineStyle={(d) => {
                if (d.type === '预测') return { strokeDasharray: '6 4', stroke: '#888', lineWidth: 2 };
                if (d.type === '目标') return { stroke: 'red', lineWidth: 2 };
                return { lineWidth: 2 };
              }}
              point={{ size: 4, shape: 'circle' }}
              tooltip={{
                customContent: (title, items) => (
                  `<div style='padding:8px 0'><b>${title}</b><br/>` +
                  items.map(i => `<span style='color:${i.color}'>●</span> ${i.name}: ${i.value}<br/>`).join('') +
                  `</div>`
                )
              }}
              animation
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="content-card" title="最新动态" style={{marginBottom:24}}>
            <List
              itemLayout="horizontal"
              dataSource={news}
              renderItem={item => (
                <List.Item style={{cursor:'pointer'}} onClick={()=>setNewsModal({ open: true, title: item.title, content: newsDetailMap[item.title]||'暂无详情' })}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<BellOutlined />} style={{background:'#1890ff'}} />}
                    title={<span>{item.title} <Tag color={item.type==='告警'?'red':item.type==='公告'?'blue':item.type==='会议'?'green':'orange'}>{item.type}</Tag></span>}
                    description={<span style={{color:'#888'}}>{item.time} <Tag color={item.tag==='已发布'?'green':item.tag==='待处理'?'red':item.tag==='已确认'?'green':'orange'}>{item.tag}</Tag></span>}
                  />
                </List.Item>
              )}
            />
            <Modal
              open={newsModal.open}
              title={newsModal.title}
              onCancel={()=>setNewsModal({ open: false, title: '', content: '' })}
              footer={null}
            >
              <div style={{fontSize:16, lineHeight:1.8}}>{newsModal.content}</div>
            </Modal>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 