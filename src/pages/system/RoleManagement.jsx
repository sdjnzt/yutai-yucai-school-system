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
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Statistic,
  Tree,
  message,
  Tooltip,
  Popconfirm,
  Badge
} from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FileTextOutlined,
  BarsOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const RoleManagement = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState('create'); // 'create' or 'edit'
  const [checkedKeys, setCheckedKeys] = useState([]);

  // 生成角色数据
  const generateRoles = () => {
    const roles = [
      {
        name: '超级管理员',
        code: 'SUPER_ADMIN',
        description: '系统最高权限，可以管理所有功能',
        userCount: 1,
      },
      {
        name: '教务主任',
        code: 'ACADEMIC_DIRECTOR',
        description: '负责教学管理、课程安排等教务工作',
        userCount: 1,
      },
      {
        name: '学生主任',
        code: 'STUDENT_DIRECTOR',
        description: '负责学生管理、学生事务等工作',
        userCount: 1,
      },
      {
        name: '总务主任',
        code: 'GENERAL_DIRECTOR',
        description: '负责学校总务、后勤等工作',
        userCount: 1,
      },
      {
        name: '教师',
        code: 'TEACHER',
        description: '普通教师角色，可以查看教学相关信息',
        userCount: 8,
      },
      {
        name: '班主任',
        code: 'CLASS_TEACHER',
        description: '班主任角色，可以管理班级相关事务',
        userCount: 24,
      }
    ];

    return roles.map((role, index) => ({
      key: index + 1,
      id: `R${String(index + 1).padStart(4, '0')}`,
      ...role,
      status: Math.random() > 0.1 ? '正常' : '禁用',
      createTime: dayjs('2025-07-25').subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs('2025-07-25').subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm:ss'),
    }));
  };

  // 权限树数据
  const permissionTreeData = [
    {
      title: '系统管理',
      key: 'system',
      icon: <SettingOutlined />,
      children: [
        {
          title: '用户管理',
          key: 'system:user',
          icon: <UserOutlined />,
          children: [
            { title: '查看用户', key: 'system:user:view' },
            { title: '创建用户', key: 'system:user:create' },
            { title: '编辑用户', key: 'system:user:edit' },
            { title: '删除用户', key: 'system:user:delete' },
          ],
        },
        {
          title: '角色管理',
          key: 'system:role',
          icon: <TeamOutlined />,
          children: [
            { title: '查看角色', key: 'system:role:view' },
            { title: '创建角色', key: 'system:role:create' },
            { title: '编辑角色', key: 'system:role:edit' },
            { title: '删除角色', key: 'system:role:delete' },
          ],
        },
      ],
    },
    {
      title: '教务管理',
      key: 'academic',
      icon: <AppstoreOutlined />,
      children: [
        {
          title: '课程管理',
          key: 'academic:course',
          icon: <BarsOutlined />,
          children: [
            { title: '查看课程', key: 'academic:course:view' },
            { title: '创建课程', key: 'academic:course:create' },
            { title: '编辑课程', key: 'academic:course:edit' },
            { title: '删除课程', key: 'academic:course:delete' },
          ],
        },
        {
          title: '成绩管理',
          key: 'academic:score',
          icon: <FileTextOutlined />,
          children: [
            { title: '查看成绩', key: 'academic:score:view' },
            { title: '录入成绩', key: 'academic:score:input' },
            { title: '编辑成绩', key: 'academic:score:edit' },
            { title: '删除成绩', key: 'academic:score:delete' },
          ],
        },
      ],
    },
  ];

  // 统计数据
  const statistics = useMemo(() => {
    const data = generateRoles();
    return {
      total: data.length,
      active: data.filter(r => r.status === '正常').length,
      disabled: data.filter(r => r.status === '禁用').length,
      totalUsers: data.reduce((sum, role) => sum + role.userCount, 0),
    };
  }, []);

  // 处理表单提交
  const handleSubmit = (values) => {
    console.log('Form values:', values);
    message.success(`${mode === 'create' ? '创建' : '更新'}角色成功`);
    setVisible(false);
    form.resetFields();
  };

  // 处理权限设置
  const handlePermissionSubmit = () => {
    console.log('Checked keys:', checkedKeys);
    message.success('权限设置成功');
    setPermissionVisible(false);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setMode('edit');
    setSelectedRole(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    message.success('删除成功');
  };

  // 表格列配置
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (text, record) => (
        <Space>
          <TeamOutlined />
          <Text strong>{text}</Text>
          <Tag color="blue">{record.code}</Tag>
        </Space>
      ),
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 120,
      render: (text) => (
        <Badge count={text} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '正常' ? 'success' : 'error'} icon={status === '正常' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
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
              setSelectedRole(record);
              setCheckedKeys(['system:user:view', 'academic:course:view']);
              setPermissionVisible(true);
            }}
          >
            权限设置
          </Button>
          <Popconfirm
            title="确定要删除该角色吗？"
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
        <Title level={4}>角色管理</Title>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="角色总数"
                value={statistics.total}
                prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="正常角色"
                value={statistics.active}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="禁用角色"
                value={statistics.disabled}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="用户总数"
                value={statistics.totalUsers}
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                suffix="人"
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
                    placeholder="搜索角色名称/编码"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setMode('create');
                  setSelectedRole(null);
                  form.resetFields();
                  setVisible(true);
                }}
              >
                新建角色
              </Button>
            </Col>
          </Row>
        </Card>

        <Table
          columns={columns}
          dataSource={generateRoles()}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 新建/编辑角色弹窗 */}
      <Modal
        title={`${mode === 'create' ? '新建' : '编辑'}角色`}
        open={visible}
        onOk={() => form.submit()}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Alert
          message="温馨提示"
          description="请谨慎设置角色信息，角色创建后需要配置相应的权限。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[A-Z_]{2,30}$/, message: '角色编码只能包含大写字母和下划线' }
            ]}
          >
            <Input placeholder="请输入角色编码，如：ADMIN、USER" />
          </Form.Item>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue="正常"
          >
            <Input.Group>
              <Row>
                <Col span={12}>
                  <Button
                    type={form.getFieldValue('status') === '正常' ? 'primary' : 'default'}
                    icon={<CheckCircleOutlined />}
                    onClick={() => form.setFieldsValue({ status: '正常' })}
                    style={{ width: '100%' }}
                  >
                    正常
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type={form.getFieldValue('status') === '禁用' ? 'primary' : 'default'}
                    icon={<ClockCircleOutlined />}
                    onClick={() => form.setFieldsValue({ status: '禁用' })}
                    style={{ width: '100%' }}
                  >
                    禁用
                  </Button>
                </Col>
              </Row>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限设置弹窗 */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined />
            <span>权限设置 - {selectedRole?.name}</span>
          </Space>
        }
        open={permissionVisible}
        onOk={handlePermissionSubmit}
        onCancel={() => setPermissionVisible(false)}
        width={600}
      >
        <Alert
          message="温馨提示"
          description="请谨慎设置角色权限，权限的变更将直接影响到该角色下所有用户的操作权限。"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Tree
          checkable
          checkedKeys={checkedKeys}
          onCheck={setCheckedKeys}
          treeData={permissionTreeData}
          defaultExpandAll
          showIcon
        />
      </Modal>
    </div>
  );
};

export default RoleManagement; 