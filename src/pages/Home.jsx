import React, { useState, useEffect } from 'react';
import { Card, Row, Col, List, Tag, Button, Space, Avatar, Badge, Steps, Timeline, Statistic } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  ScheduleOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BarsOutlined,
  PieChartOutlined,
  SettingOutlined,
  EditOutlined,
  AuditOutlined,
  NotificationOutlined,
  SoundOutlined,
  FileDoneOutlined,
  CarryOutOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Step } = Steps;

const Home = () => {
  const navigate = useNavigate();
  
  // 添加状态来存储当前日期和时间
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  // 使用 useEffect 设置定时器，每分钟更新一次时间
  useEffect(() => {
    // 初始化时设置当前时间
    setCurrentDate(dayjs());
    
    // 创建定时器，每分钟更新一次
    const timer = setInterval(() => {
      setCurrentDate(dayjs());
    }, 60000); // 60000毫秒 = 1分钟
    
    // 组件卸载时清除定时器
    return () => clearInterval(timer);
  }, []);
  
  // 获取当前时间
  const getGreeting = () => {
    const hour = currentDate.hour();
    if (hour < 6) return '夜深了';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 17) return '下午好';
    if (hour < 19) return '傍晚好';
    return '晚上好';
  };

  // 工作统计数据
  const workStats = [
    {
      title: '待审批',
      value: 2,
      icon: <AuditOutlined style={{ fontSize: '28px', color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: '未读公告',
      value: 3,
      icon: <NotificationOutlined style={{ fontSize: '28px', color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: '在线用户',
      value: 28,
      icon: <TeamOutlined style={{ fontSize: '28px', color: '#faad14' }} />,
      color: '#faad14',
    },
    {
      title: '系统告警',
      value: 1,
      icon: <SafetyCertificateOutlined style={{ fontSize: '28px', color: '#ff4d4f' }} />,
      color: '#ff4d4f',
    },
  ];

  // 快捷入口配置
  const quickAccess = [
    {
      title: '用户管理',
      icon: <TeamOutlined />,
      path: '/system/users',
      color: '#1890ff',
      description: '管理系统用户',
    },
    {
      title: '角色权限',
      icon: <SafetyCertificateOutlined />,
      path: '/system/roles',
      color: '#52c41a',
      description: '配置角色和权限',
    },
    {
      title: '发布公告',
      icon: <SoundOutlined />,
      path: '/announcement/create',
      color: '#faad14',
      description: '发布新的通知公告',
    },
    {
      title: '系统设置',
      icon: <SettingOutlined />,
      path: '/system/settings',
      color: '#722ed1',
      description: '配置系统参数',
    },
  ];

  // 系统状态
  const systemStatus = [
    {
      title: 'CPU使用率',
      value: 32,
      suffix: '%',
      color: '#1890ff',
    },
    {
      title: '内存使用率',
      value: 45,
      suffix: '%',
      color: '#52c41a',
    },
    {
      title: '磁盘使用率',
      value: 68,
      suffix: '%',
      color: '#faad14',
    },
    {
      title: '系统运行时间',
      value: 168,
      suffix: '小时',
      color: '#722ed1',
    },
  ];

  // 系统公告
  const announcements = [
    {
      title: '关于系统升级维护的通知',
      type: 'system',
      date: currentDate.format('YYYY-MM-DD'),
      department: '信息中心',
      priority: 'high',
      content: `定于${currentDate.clone().add(2, 'day').format('YYYY年MM月DD日')}（${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][currentDate.clone().add(2, 'day').day()]}）凌晨2:00-4:00进行系统升级维护，届时系统将暂停服务。主要更新内容：1. 优化系统性能 2. 提升安全等级 3. 新增教学管理功能。请各位用户提前做好相关工作安排。`,
    },
    {
      title: '关于加强账号安全管理的通知',
      type: 'security',
      date: currentDate.clone().subtract(1, 'day').format('YYYY-MM-DD'),
      department: '信息中心',
      priority: 'high',
      content: '为保障系统安全，请各位用户：1. 定期修改密码 2. 不要将账号借给他人使用 3. 及时退出登录 4. 开启双因素认证。如发现账号异常，请立即联系系统管理员。',
    },
    {
      title: '新版教务系统功能介绍',
      type: 'notice',
      date: currentDate.clone().subtract(2, 'day').format('YYYY-MM-DD'),
      department: '教务处',
      priority: 'medium',
      content: `新版教务系统已完成升级，新增功能：1. 智能排课系统 2. 成绩分析报告 3. 在线办公审批 4. 移动端适配。请各位老师积极参与系统使用培训，培训时间：${currentDate.format('MM月DD日')}下午14:30，地点：学术报告厅。`,
    },
  ];

  // 待办事项
  const todos = [
    {
      title: '用户密码过期提醒',
      deadline: '今天 17:00',
      type: 'security',
      priority: 'high',
      description: '3个用户的密码将在7天内过期',
    },
    {
      title: '系统数据备份',
      deadline: '今天 23:00',
      type: 'backup',
      priority: 'medium',
      description: '自动备份所有系统数据',
    },
    {
      title: '新用户权限审核',
      deadline: currentDate.clone().add(1, 'day').format('MM月DD日'),
      type: 'user',
      priority: 'medium',
      description: '审核2个新用户的权限申请',
    },
  ];

  // 系统动态
  const systemTimeline = [
    {
      content: '系统管理员重置了张明老师的登录密码',
      time: '10分钟前',
      type: 'security',
    },
    {
      content: '新增角色：高级教师，包含15个权限点',
      time: '30分钟前',
      type: 'role',
    },
    {
      content: '系统自动备份完成，备份大小：2.3GB',
      time: '1小时前',
      type: 'backup',
    },
    {
      content: '更新了系统安全策略配置',
      time: '2小时前',
      type: 'setting',
    },
  ];

  const getTimelineIcon = (type) => {
    const icons = {
      security: <SafetyCertificateOutlined style={{ fontSize: '16px' }} />,
      role: <TeamOutlined style={{ fontSize: '16px' }} />,
      backup: <DatabaseOutlined style={{ fontSize: '16px' }} />,
      setting: <SettingOutlined style={{ fontSize: '16px' }} />,
    };
    return icons[type] || <CarryOutOutlined style={{ fontSize: '16px' }} />;
  };

  const getAnnouncementTypeTag = (type, priority) => {
    const typeConfig = {
      system: { color: '#1890ff', text: '系统' },
      security: { color: '#ff4d4f', text: '安全' },
      notice: { color: '#52c41a', text: '通知' },
    };
    return (
      <Space>
        <Tag color={typeConfig[type].color}>{typeConfig[type].text}</Tag>
        {priority === 'high' && <Tag color="red">重要</Tag>}
      </Space>
    );
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* 欢迎区域 */}
      <Card 
        bordered={false}
        style={{ 
          marginBottom: 24,
          background: 'linear-gradient(120deg, #1890ff 0%, #722ed1 100%)',
          color: '#fff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ 
              color: '#fff', 
              fontSize: '28px', 
              marginBottom: '16px',
              fontWeight: 'normal'
            }}>
              {getGreeting()}，系统管理员
            </h1>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              fontSize: '16px',
              marginBottom: 0
            }}>
              欢迎使用鱼台县育才学校教务系统 | 当前版本：V1.0.0
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px' }}>
              {currentDate.format('YYYY年MM月DD日')} {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][currentDate.day()]}
            </p>
            <Tag color="green">系统运行正常</Tag>
          </div>
        </div>
      </Card>

      {/* 工作统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {workStats.map(stat => (
          <Col xs={12} sm={12} md={6} key={stat.title}>
            <Card bordered={false} hoverable bodyStyle={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px', marginBottom: '8px' }}>
                    {stat.title}
                  </div>
                  <div style={{ color: stat.color, fontSize: '24px', fontWeight: 'bold' }}>
                    {stat.value}
                  </div>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要内容区 */}
      <Row gutter={[16, 16]}>
        {/* 左侧区域 */}
        <Col xs={24} md={16}>
          {/* 快捷入口 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ProfileOutlined />
                <span>快捷入口</span>
              </div>
            }
            bordered={false}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 16]}>
              {quickAccess.map(item => (
                <Col xs={12} sm={12} md={6} key={item.title}>
                  <div
                    style={{
                      background: `${item.color}10`,
                      padding: '24px 16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: `${item.color}20`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      {React.cloneElement(item.icon, { style: { fontSize: '24px', color: item.color } })}
                    </div>
                    <div style={{ fontSize: '16px', marginBottom: '8px', color: 'rgba(0, 0, 0, 0.85)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
                      {item.description}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>

          {/* 系统状态 */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DatabaseOutlined />
                <span>系统状态</span>
              </div>
            }
            bordered={false}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 16]}>
              {systemStatus.map(item => (
                <Col span={6} key={item.title}>
                  <Statistic
                    title={item.title}
                    value={item.value}
                    suffix={item.suffix}
                    valueStyle={{ color: item.color }}
                  />
                </Col>
              ))}
            </Row>
          </Card>

          {/* 系统公告 */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NotificationOutlined />
                <span>系统公告</span>
              </div>
            }
            extra={<Button type="link" onClick={() => navigate('/announcement/list')}>更多公告</Button>}
            bordered={false}
          >
            <List
              itemLayout="vertical"
              dataSource={announcements}
              renderItem={item => (
                <List.Item
                  extra={
                    <Space direction="vertical" align="end" style={{ minWidth: 100 }}>
                      <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{item.date}</span>
                      <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{item.department}</span>
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="announcement-title" style={{ cursor: 'pointer' }}>
                          {item.title}
                        </span>
                        {getAnnouncementTypeTag(item.type, item.priority)}
                      </div>
                    }
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 右侧区域 */}
        <Col xs={24} md={8}>
          {/* 待办事项 */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClockCircleOutlined />
                <span>待办事项</span>
              </div>
            }
            bordered={false}
            style={{ marginBottom: 16 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={todos}
              renderItem={item => (
                <List.Item
                  extra={
                    <Tag color={item.priority === 'high' ? 'red' : 'orange'}>
                      {item.deadline}
                    </Tag>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: 40,
                        height: 40,
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {item.type === 'security' && <SafetyCertificateOutlined style={{ color: '#ff4d4f' }} />}
                        {item.type === 'backup' && <DatabaseOutlined style={{ color: '#52c41a' }} />}
                        {item.type === 'user' && <TeamOutlined style={{ color: '#1890ff' }} />}
                      </div>
                    }
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 系统动态 */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarsOutlined />
                <span>系统动态</span>
              </div>
            }
            bordered={false}
          >
            <Timeline>
              {systemTimeline.map((item, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    <div style={{
                      background: '#fff',
                      border: '2px solid #1890ff',
                      borderRadius: '50%',
                      padding: 2,
                    }}>
                      {getTimelineIcon(item.type)}
                    </div>
                  }
                >
                  <div style={{ marginBottom: 4 }}>{item.content}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>{item.time}</div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 