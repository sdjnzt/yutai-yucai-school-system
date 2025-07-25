import React, { useState } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, App, Space, Button, Badge, Divider } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  ScheduleOutlined,
  LineChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloudOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  AuditOutlined,
  NotificationOutlined,
  HomeOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { modal } = App.useApp();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/student',
      icon: <TeamOutlined />,
      label: '学生管理',
      children: [
        { key: '/student/list', label: '学生列表' },
        { key: '/student/class', label: '班级管理' },
      ],
    },
    {
      key: '/teacher',
      icon: <UserOutlined />,
      label: '教师管理',
      children: [
        { key: '/teacher/list', label: '教师列表' },
        { key: '/teacher/schedule', label: '教师排课' },
      ],
    },
    {
      key: '/course',
      icon: <BookOutlined />,
      label: '课程管理',
      children: [
        { key: '/course/list', label: '课程列表' },
        { key: '/course/schedule', label: '课程表' },
        { key: '/course/plan', label: '教学计划' },
      ],
    },
    {
      key: '/score',
      icon: <LineChartOutlined />,
      label: '成绩管理',
      children: [
        { key: '/score/input', label: '成绩录入' },
        { key: '/score/analysis', label: '成绩分析' },
        { key: '/score/report', label: '成绩报表' },
      ],
    },
    {
      key: '/workflow',
      icon: <AuditOutlined />,
      label: '流程审批',
      children: [
        { key: '/workflow/pending', label: '待办审批' },
        { key: '/workflow/done', label: '已办审批' },
      ],
    },
    {
      key: '/announcement',
      icon: <NotificationOutlined />,
      label: '通知公告',
      children: [
        { key: '/announcement/list', label: '公告列表' },
        { key: '/announcement/create', label: '发布公告' },
        { key: '/announcement/my', label: '我的公告' },
      ],
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        { key: '/system/users', label: '用户管理' },
        { key: '/system/roles', label: '角色权限' },
        { key: '/system/settings', label: '系统设置' },
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('system/profile');
        break;
      case 'settings':
        navigate('system/settings');
        break;
      case 'logout':
        modal.confirm({
          title: '确认退出',
          content: '您确定要退出登录吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            localStorage.removeItem('token');
            navigate('login', { replace: true });
            modal.success({
              title: '退出成功',
              content: '已安全退出系统',
              duration: 2,
            });
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001
      }}>
        <div style={{
          height: 48,
          background: '#002140',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0 8px'
        }}>
          {!collapsed && (
            <h1 style={{
              color: '#fff',
              fontSize: '14px',
              margin: 0,
              fontWeight: 'normal',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              width: '100%'
            }}>
              鱼台县育才学校教务系统
            </h1>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ padding: '4px 0' }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            width: `calc(100% - ${collapsed ? 80 : 200}px)`,
            top: 0,
            zIndex: 1000,
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            height: 48,
            right: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '16px', padding: '0 12px' },
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={<CloudOutlined />}
              style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
            />
            <Badge count={5}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
              />
            </Badge>
            <Button
              type="text"
              icon={<QuestionCircleOutlined />}
              style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
            />
            <Divider type="vertical" style={{ margin: '0 8px', height: 20 }} />
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: '个人信息',
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: '个人设置',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    danger: true,
                  },
                ],
                onClick: handleUserMenuClick,
                style: {
                  width: '120px',
                }
              }}
              placement="bottom"
              arrow={{ pointAtCenter: true }}
              trigger={['click']}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                padding: '0 4px',
                borderRadius: 4,
                transition: 'all 0.3s',
              }}>
                <Avatar 
                  size={28}
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: '#1890ff',
                    marginRight: 8 
                  }} 
                />
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ 
                    color: 'rgba(0, 0, 0, 0.88)',
                    fontWeight: 500,
                    fontSize: '14px'
                  }}>
                    系统管理员
                  </div>
                  <div style={{ 
                    color: 'rgba(0, 0, 0, 0.45)',
                    fontSize: '12px'
                  }}>
                    超级管理员
                  </div>
                </div>
                <CaretDownOutlined style={{ 
                  marginLeft: 4,
                  fontSize: 12,
                  color: 'rgba(0, 0, 0, 0.45)',
                  transition: 'transform 0.3s',
                }} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '64px 16px 24px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 