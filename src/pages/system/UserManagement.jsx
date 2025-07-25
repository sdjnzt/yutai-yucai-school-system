import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Statistic,
  Switch,
  message,
  Tooltip,
  Popconfirm,
  Avatar
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  StopOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('create'); // 'create' or 'edit'

  // 生成用户数据
  const generateUsers = () => {
    const roles = ['管理员', '教务主任', '学生主任', '总务主任', '教师', '班主任'];
    const departments = ['教务处', '学生处', '总务处', '实验室', '体育组'];
    const names = [
      { name: '王明华', title: '高级教师' },
      { name: '李秀英', title: '特级教师' },
      { name: '张建国', title: '高级教师' },
      { name: '刘淑华', title: '一级教师' },
      { name: '陈志强', title: '高级教师' },
      { name: '赵丽娟', title: '特级教师' },
      { name: '杨光明', title: '一级教师' },
      { name: '周晓梅', title: '高级教师' },
      { name: '吴国强', title: '一级教师' },
      { name: '孙玉兰', title: '高级教师' },
      { name: '郑伟东', title: '特级教师' },
      { name: '马丽华', title: '一级教师' }
    ];

    return names.map((item, index) => {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const username = `${item.name.slice(0, 1)}${item.name.slice(-1)}${String(index + 1).padStart(4, '0')}`;
      const lastLoginTime = dayjs('2025-07-25').subtract(Math.floor(Math.random() * 7), 'day').format('YYYY-MM-DD HH:mm:ss');
      const createTime = dayjs('2025-07-25').subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD HH:mm:ss');

      return {
        key: index + 1,
        id: `U${String(index + 1).padStart(4, '0')}`,
        username,
        name: item.name,
        title: item.title,
        role,
        department,
        email: `${username}@yutai.edu.cn`,
        phone: `1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        status: Math.random() > 0.1 ? '正常' : '禁用',
        lastLoginTime,
        createTime,
      };
    });
  };

  // 统计数据
  const statistics = useMemo(() => {
    const data = generateUsers();
    return {
      total: data.length,
      active: data.filter(u => u.status === '正常').length,
      disabled: data.filter(u => u.status === '禁用').length,
      departments: new Set(data.map(u => u.department)).size
    };
  }, []);

  // 处理表单提交
  const handleSubmit = (values) => {
    console.log('Form values:', values);
    message.success(`${mode === 'create' ? '创建' : '更新'}用户成功`);
    setVisible(false);
    form.resetFields();
  };

  // 处理重置密码
  const handleResetPassword = (values) => {
    console.log('Reset password:', values);
    message.success('密码重置成功');
    setResetPasswordVisible(false);
    form.resetFields();
  };

  // 处理编辑
  const handleEdit = (record) => {
    setMode('edit');
    setSelectedUser(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    message.success('删除成功');
  };

  // 处理状态切换
  const handleStatusChange = (checked, record) => {
    message.success(`用户${checked ? '启用' : '禁用'}成功`);
  };

  // 表格列配置
  const columns = [
    {
      title: '用户信息',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.username}
            </Text>
          </Space>
          <Tag color="blue">{record.title}</Tag>
        </Space>
      ),
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (text) => (
        <Tag icon={<ApartmentOutlined />} color="purple">
          {text}
        </Tag>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (text) => (
        <Tag icon={<TeamOutlined />} color="cyan">
          {text}
        </Tag>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 300,
      render: (_, record) => (
        <Space>
          <Tooltip title="邮箱">
            <Tag icon={<MailOutlined />}>{record.email}</Tag>
          </Tooltip>
          <Tooltip title="电话">
            <Tag icon={<PhoneOutlined />}>{record.phone}</Tag>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text, record) => (
        <Switch
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<StopOutlined />}
          checked={text === '正常'}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      width: 180,
      render: (text) => (
        <Space>
          <CalendarOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<KeyOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setResetPasswordVisible(true);
            }}
          >
            重置密码
          </Button>
          <Popconfirm
            title="确定要删除该用户吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={4}>用户管理</Title>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="用户总数"
                value={statistics.total}
                prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="正常用户"
                value={statistics.active}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="禁用用户"
                value={statistics.disabled}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<StopOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="部门数量"
                value={statistics.departments}
                prefix={<ApartmentOutlined style={{ color: '#722ed1' }} />}
                suffix="个"
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索和操作栏 */}
        <Card style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Form
                form={searchForm}
                layout="inline"
              >
                <Form.Item name="keyword">
                  <Input
                    placeholder="搜索用户名/姓名"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <Form.Item name="department">
                  <Select
                    placeholder="所属部门"
                    style={{ width: 160 }}
                    allowClear
                  >
                    <Option value="教务处">教务处</Option>
                    <Option value="学生处">学生处</Option>
                    <Option value="总务处">总务处</Option>
                    <Option value="实验室">实验室</Option>
                    <Option value="体育组">体育组</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="role">
                  <Select
                    placeholder="角色"
                    style={{ width: 160 }}
                    allowClear
                  >
                    <Option value="管理员">管理员</Option>
                    <Option value="教务主任">教务主任</Option>
                    <Option value="学生主任">学生主任</Option>
                    <Option value="总务主任">总务主任</Option>
                    <Option value="教师">教师</Option>
                    <Option value="班主任">班主任</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="status">
                  <Select
                    placeholder="状态"
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="正常">正常</Option>
                    <Option value="禁用">禁用</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" icon={<FilterOutlined />}>
                      筛选
                    </Button>
                    <Button onClick={() => searchForm.resetFields()}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setMode('create');
                  setSelectedUser(null);
                  form.resetFields();
                  setVisible(true);
                }}
              >
                新建用户
              </Button>
            </Col>
          </Row>
        </Card>

        <Table
          columns={columns}
          dataSource={generateUsers()}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 新建/编辑用户弹窗 */}
      <Modal
        title={`${mode === 'create' ? '新建' : '编辑'}用户`}
        open={visible}
        onOk={() => form.submit()}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        width={700}
      >
        <Alert
          message="温馨提示"
          description={
            mode === 'create'
              ? '新建用户的初始密码为123456，请提醒用户及时修改密码。'
              : '编辑用户信息不会修改用户的密码。'
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { pattern: /^[a-zA-Z0-9_]{4,20}$/, message: '用户名只能包含字母、数字和下划线，长度4-20位' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门">
                  <Option value="教务处">教务处</Option>
                  <Option value="学生处">学生处</Option>
                  <Option value="总务处">总务处</Option>
                  <Option value="实验室">实验室</Option>
                  <Option value="体育组">体育组</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Option value="管理员">管理员</Option>
                  <Option value="教务主任">教务主任</Option>
                  <Option value="学生主任">学生主任</Option>
                  <Option value="总务主任">总务主任</Option>
                  <Option value="教师">教师</Option>
                  <Option value="班主任">班主任</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="职称"
                rules={[{ required: true, message: '请选择职称' }]}
              >
                <Select placeholder="请选择职称">
                  <Option value="特级教师">特级教师</Option>
                  <Option value="高级教师">高级教师</Option>
                  <Option value="一级教师">一级教师</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="正常">正常</Option>
                  <Option value="禁用">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1\d{10}$/, message: '请输入有效的手机号' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={resetPasswordVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setResetPasswordVisible(false);
          form.resetFields();
        }}
      >
        <Alert
          message="重置密码将清除用户的原密码，请谨慎操作！"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password
              placeholder="请输入新密码"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="请确认新密码"
              prefix={<LockOutlined />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 