import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Tooltip,
  Badge,
  message,
  Descriptions,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  SwapOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const ClassManagement = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  // 生成班级数据
  const generateClasses = () => {
    const classes = [];
    const grades = ['高一', '高二', '高三'];
    const subjects = ['文科', '理科'];
    
    grades.forEach((grade) => {
      for (let i = 1; i <= 8; i++) {
        const subject = i <= 4 ? subjects[0] : subjects[1];
        const studentCount = 45 + Math.floor(Math.random() * 6); // 45-50人
        const maleCount = Math.floor(studentCount * (0.45 + Math.random() * 0.1)); // 45%-55%男生
        const femaleCount = studentCount - maleCount;
        
        classes.push({
          id: `${grade}-${i}`,
          grade,
          name: `${i}班`,
          subject,
          studentCount,
          maleCount,
          femaleCount,
          headTeacher: generateTeacherName(),
          classroom: `${grade.slice(1)}${String(i).padStart(2, '0')}教室`,
          createdAt: '2024-09-01',
          status: 'active'
        });
      }
    });
    return classes;
  };

  const generateTeacherName = () => {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军'];
    return surnames[Math.floor(Math.random() * surnames.length)] + 
           names[Math.floor(Math.random() * names.length)];
  };

  const [classes] = useState(generateClasses());

  // 统计数据
  const statistics = useMemo(() => {
    const total = classes.length;
    const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
    const totalMale = classes.reduce((sum, c) => sum + c.maleCount, 0);
    const totalFemale = classes.reduce((sum, c) => sum + c.femaleCount, 0);
    const gradeOneClasses = classes.filter(c => c.grade === '高一').length;
    const gradeTwoClasses = classes.filter(c => c.grade === '高二').length;
    const gradeThreeClasses = classes.filter(c => c.grade === '高三').length;
    const artClasses = classes.filter(c => c.subject === '文科').length;
    const scienceClasses = classes.filter(c => c.subject === '理科').length;

    return {
      total,
      totalStudents,
      totalMale,
      totalFemale,
      gradeOneClasses,
      gradeTwoClasses,
      gradeThreeClasses,
      artClasses,
      scienceClasses,
      averageSize: Math.round(totalStudents / total)
    };
  }, [classes]);

  // 表格列配置
  const columns = [
    {
      title: '班级',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <span style={{ fontWeight: 'bold' }}>{record.grade}{record.name}</span>
          <Tag color={record.subject === '文科' ? 'blue' : 'green'}>
            {record.subject}
          </Tag>
        </Space>
      ),
    },
    {
      title: '班主任',
      dataIndex: 'headTeacher',
      key: 'headTeacher',
    },
    {
      title: '学生人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (_, record) => (
        <Tooltip title={`男生: ${record.maleCount} | 女生: ${record.femaleCount}`}>
          <Space>
            <span>{record.studentCount}人</span>
            <SwapOutlined style={{ color: '#1890ff' }} />
          </Space>
        </Tooltip>
      ),
    },
    {
      title: '教室',
      dataIndex: 'classroom',
      key: 'classroom',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status="success" text="正常" />
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个班级吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetails = (record) => {
    setCurrentClass(record);
    setDetailVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingClass(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    message.success('删除成功');
  };

  // 处理表单提交
  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      form.resetFields();
      setVisible(false);
      setEditingClass(null);
      message.success(editingClass ? '修改成功' : '添加成功');
    });
  };

  // 渲染详情内容
  const renderClassDetails = (classData) => (
    <Descriptions column={2}>
      <Descriptions.Item label="班级编号">{classData.id}</Descriptions.Item>
      <Descriptions.Item label="年级">{classData.grade}</Descriptions.Item>
      <Descriptions.Item label="班级名称">{classData.name}</Descriptions.Item>
      <Descriptions.Item label="科类">
        <Tag color={classData.subject === '文科' ? 'blue' : 'green'}>
          {classData.subject}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="班主任">{classData.headTeacher}</Descriptions.Item>
      <Descriptions.Item label="教室">{classData.classroom}</Descriptions.Item>
      <Descriptions.Item label="学生总数">{classData.studentCount}人</Descriptions.Item>
      <Descriptions.Item label="性别比例">
        男生：{classData.maleCount}人 | 女生：{classData.femaleCount}人
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{classData.createdAt}</Descriptions.Item>
      <Descriptions.Item label="状态">
        <Badge status="success" text="正常" />
      </Descriptions.Item>
    </Descriptions>
  );

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="班级总数"
              value={statistics.total}
              prefix={<TeamOutlined />}
              suffix="个班"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>高一：{statistics.gradeOneClasses}班</span>
              <span>高二：{statistics.gradeTwoClasses}班</span>
              <span>高三：{statistics.gradeThreeClasses}班</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="学生总数"
              value={statistics.totalStudents}
              prefix={<UserOutlined />}
              suffix="人"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>男生：{statistics.totalMale}人</span>
              <span>女生：{statistics.totalFemale}人</span>
              <span>平均：{statistics.averageSize}人/班</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="文理分科"
              value={statistics.artClasses + statistics.scienceClasses}
              prefix={<BookOutlined />}
              suffix="个班"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <Tag color="blue">文科：{statistics.artClasses}班</Tag>
              </span>
              <span>
                <Tag color="green">理科：{statistics.scienceClasses}班</Tag>
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 操作按钮 */}
      <Card style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClass(null);
            form.resetFields();
            setVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          添加班级
        </Button>

        {/* 班级表格 */}
        <Table
          columns={columns}
          dataSource={classes}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个班级`,
          }}
        />
      </Card>

      {/* 添加/编辑班级弹窗 */}
      <Modal
        title={editingClass ? '编辑班级' : '添加班级'}
        open={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          setEditingClass(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="grade"
                label="年级"
                rules={[{ required: true, message: '请选择年级' }]}
              >
                <Select>
                  <Select.Option value="高一">高一</Select.Option>
                  <Select.Option value="高二">高二</Select.Option>
                  <Select.Option value="高三">高三</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="班级名称"
                rules={[{ required: true, message: '请输入班级名称' }]}
              >
                <Input placeholder="请输入班级名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subject"
                label="科类"
                rules={[{ required: true, message: '请选择科类' }]}
              >
                <Select>
                  <Select.Option value="文科">文科</Select.Option>
                  <Select.Option value="理科">理科</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="headTeacher"
                label="班主任"
                rules={[{ required: true, message: '请输入班主任姓名' }]}
              >
                <Input placeholder="请输入班主任姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="classroom"
                label="教室"
                rules={[{ required: true, message: '请输入教室' }]}
              >
                <Input placeholder="请输入教室" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentCount"
                label="学生人数"
                rules={[{ required: true, message: '请输入学生人数' }]}
              >
                <Input type="number" placeholder="请输入学生人数" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 班级详情弹窗 */}
      <Modal
        title="班级详细信息"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setCurrentClass(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setDetailVisible(false);
              handleEdit(currentClass);
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentClass && renderClassDetails(currentClass)}
      </Modal>
    </div>
  );
};

export default ClassManagement; 