import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Space,
  Divider,
  Row,
  Col,
  Typography,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('1234'); // 模拟验证码

  // 组件加载时清除 token
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  // 刷新验证码
  const refreshCaptcha = () => {
    // 模拟生成4位随机验证码
    const newCaptcha = Math.random().toString(36).slice(-4).toUpperCase();
    setCaptcha(newCaptcha);
  };

  // 处理登录
  const handleLogin = async (values) => {
    if (values.captcha.toUpperCase() !== captcha) {
      message.error('验证码错误');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (values.username === 'admin' && values.password === '123456') {
        // 登录成功后设置 token
        localStorage.setItem('token', 'dummy-token-' + Date.now());
        message.success('登录成功');
        
        // 如果有之前保存的路径，就导航到那里，否则去首页
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      } else {
        message.error('用户名或密码错误');
        refreshCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(120deg, #1890ff 0%, #722ed1 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '40px 0',
          color: '#fff',
        }}
      >
        <Title level={2} style={{ color: '#fff', marginBottom: 0 }}>
          鱼台县育才学校教务系统
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16 }}>
          YUTAI YUCAI SCHOOL ACADEMIC AFFAIRS SYSTEM
        </Text>
      </div>

      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            用户登录
          </Title>
          <Text type="secondary">
            请输入您的账号和密码
          </Text>
        </div>

        <Form
          form={form}
          onFinish={handleLogin}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item>
            <Row gutter={8}>
              <Col span={16}>
                <Form.Item
                  name="captcha"
                  noStyle
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Input
                    prefix={<SafetyCertificateOutlined />}
                    placeholder="验证码"
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button
                  block
                  style={{
                    background: '#fafafa',
                    height: '40px',
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    letterSpacing: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={refreshCaptcha}
                >
                  {captcha}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<LoginOutlined />}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space split={<Divider type="vertical" />}>
              <Button type="link" size="small">忘记密码</Button>
              <Button type="link" size="small">帮助文档</Button>
            </Space>
          </div>
        </Form>

        <Divider style={{ margin: '24px 0 16px' }} />

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size={4}>
            <div>
              <Space split={<Divider type="vertical" />}>
                <Text type="secondary">推荐浏览器</Text>
                <Text type="secondary">分辨率 1920×1080</Text>
              </Space>
            </div>
            <Text type="secondary">Copyright © 2025 鱼台县育才学校 版权所有</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login; 