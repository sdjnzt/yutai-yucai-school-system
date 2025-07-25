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
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('1234');

  useEffect(() => {
    // 确保清除 token
    localStorage.clear();
    // 添加登录页面样式
    document.body.classList.add('login-page');
    
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const refreshCaptcha = () => {
    const newCaptcha = Math.random().toString(36).slice(-4).toUpperCase();
    setCaptcha(newCaptcha);
  };

  const handleLogin = async (values) => {
    if (values.captcha.toUpperCase() !== captcha) {
      message.error('验证码错误');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (values.username === 'admin' && values.password === '123456') {
        localStorage.setItem('token', 'dummy-token-' + Date.now());
        message.success('登录成功');
        // 使用 window.location.replace 进行重定向
        window.location.replace('#/home');
      } else {
        message.error('用户名或密码错误');
        refreshCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <Title level={2} className="login-title">
          鱼台县育才学校教务系统
        </Title>
        <Text className="login-subtitle">
          YUTAI YUCAI SCHOOL ACADEMIC AFFAIRS SYSTEM
        </Text>
      </div>

      <Card className="login-card">
        <div className="login-welcome">
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
                  className="captcha-button"
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

        <div className="login-footer">
          <Space direction="vertical" size={4}>
            <Space split={<Divider type="vertical" />}>
              <Text type="secondary">推荐浏览器</Text>
              <Text type="secondary">分辨率 1920×1080</Text>
            </Space>
            <Text type="secondary">Copyright © 2025 鱼台县育才学校 版权所有</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login; 