import React, { useState } from 'react';
import { Form, Input, Button, Switch, message, Card } from 'antd';

export default function SystemSetting() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('设置已保存');
    }, 800);
  };

  return (
    <Card title="系统基础设置" bordered>
      <Form form={form} layout="vertical" initialValues={{ sysName: '山东时代智慧园区综合管理平台', loginCaptcha: true, maxLogin: 5 }}>
        <Form.Item label="系统名称" name="sysName">
          <Input placeholder="请输入系统名称" />
        </Form.Item>
        <Form.Item label="登录验证码" name="loginCaptcha" valuePropName="checked">
          <Switch checkedChildren="开" unCheckedChildren="关" />
        </Form.Item>
        <Form.Item label="最大登录尝试次数" name="maxLogin">
          <Input type="number" min={1} max={20} style={{ width: 120 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={loading} onClick={handleSave}>保存设置</Button>
        </Form.Item>
      </Form>
    </Card>
  );
} 