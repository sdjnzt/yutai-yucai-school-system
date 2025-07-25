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
  Popconfirm,
  Upload,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  BankOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const TeacherList = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [importModalVisible, setImportModalVisible] = useState(false);

  // 生成教师数据
  const generateTeachers = () => {
    const teachers = [];
    const subjects = [
      { name: '语文', type: '文科' },
      { name: '数学', type: '理科' },
      { name: '英语', type: '文科' },
      { name: '物理', type: '理科' },
      { name: '化学', type: '理科' },
      { name: '生物', type: '理科' },
      { name: '政治', type: '文科' },
      { name: '历史', type: '文科' },
      { name: '地理', type: '文科' }
    ];
    const titles = ['高级教师', '一级教师', '二级教师'];
    const degrees = ['学士', '硕士', '博士'];
    const positions = ['班主任', '教研组长', '年级组长', '普通教师'];

    // 生成90名教师数据
    for (let i = 1; i <= 90; i++) {
      const id = String(i).padStart(4, '0');
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const gender = Math.random() < 0.6 ? '女' : '男'; // 60%女性教师
      const age = 30 + Math.floor(Math.random() * 20); // 30-50岁
      const teachingAge = age - 22 - Math.floor(Math.random() * 5); // 工作年限
      const title = titles[Math.floor(Math.random() * titles.length)];
      const degree = degrees[Math.floor(Math.random() * degrees.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      teachers.push({
        id: `T${id}`,
        name: generateTeacherName(gender),
        gender,
        age,
        subject: subject.name,
        subjectType: subject.type,
        title,
        degree,
        position,
        teachingAge,
        phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        email: `teacher${id}@yutai.edu.cn`,
        idCard: `37000019${String(75 - Math.floor(Math.random() * 20)).padStart(2, '0')}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        entryDate: `${2025 - teachingAge}-09-01`,
        status: 'active'
      });
    }
    return teachers;
  };

  const generateTeacherName = (gender) => {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
    const maleNames = ['伟', '强', '磊', '军', '洋', '勇', '杰', '涛', '明', '超'];
    const femaleNames = ['芳', '娜', '秀英', '敏', '静', '丽', '艳', '秀兰', '霞', '娟'];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const name = gender === '男' ? 
      maleNames[Math.floor(Math.random() * maleNames.length)] :
      femaleNames[Math.floor(Math.random() * femaleNames.length)];
    return surname + name;
  };

  const [teachers] = useState(generateTeachers());

  // 统计数据
  const statistics = useMemo(() => {
    const total = teachers.length;
    const male = teachers.filter(t => t.gender === '男').length;
    const female = teachers.filter(t => t.gender === '女').length;
    const artTeachers = teachers.filter(t => t.subjectType === '文科').length;
    const scienceTeachers = teachers.filter(t => t.subjectType === '理科').length;
    const seniorTeachers = teachers.filter(t => t.title === '高级教师').length;
    const firstLevelTeachers = teachers.filter(t => t.title === '一级教师').length;
    const secondLevelTeachers = teachers.filter(t => t.title === '二级教师').length;
    const masterDegree = teachers.filter(t => t.degree === '硕士').length;
    const doctorDegree = teachers.filter(t => t.degree === '博士').length;
    const headTeachers = teachers.filter(t => t.position === '班主任').length;

    return {
      total,
      male,
      female,
      artTeachers,
      scienceTeachers,
      seniorTeachers,
      firstLevelTeachers,
      secondLevelTeachers,
      masterDegree,
      doctorDegree,
      headTeachers
    };
  }, [teachers]);

  // 表格列配置
  const columns = [
    {
      title: '工号',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 100,
      render: (_, record) => (
        <Space>
          <span style={{ fontWeight: 'bold' }}>{record.name}</span>
          <Tag color={record.gender === '男' ? 'blue' : 'pink'}>
            {record.gender}
          </Tag>
        </Space>
      ),
    },
    {
      title: '任教学科',
      dataIndex: 'subject',
      key: 'subject',
      render: (_, record) => (
        <Space>
          <span>{record.subject}</span>
          <Tag color={record.subjectType === '文科' ? 'blue' : 'green'}>
            {record.subjectType}
          </Tag>
        </Space>
      ),
    },
    {
      title: '职称',
      dataIndex: 'title',
      key: 'title',
      render: (title) => {
        const color = title === '高级教师' ? 'gold' : 
                     title === '一级教师' ? 'blue' : 'green';
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: '学历',
      dataIndex: 'degree',
      key: 'degree',
      render: (degree) => {
        const color = degree === '博士' ? 'purple' : 
                     degree === '硕士' ? 'blue' : 'green';
        return <Tag color={color}>{degree}</Tag>;
      },
    },
    {
      title: '职务',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '教龄',
      dataIndex: 'teachingAge',
      key: 'teachingAge',
      render: (age) => `${age}年`,
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <Space>
          <Tooltip title={record.phone}>
            <PhoneOutlined />
          </Tooltip>
          <Tooltip title={record.email}>
            <MailOutlined />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status="success" text="在职" />
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
            title="确定要删除这名教师吗？"
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
    setCurrentTeacher(record);
    setDetailVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingTeacher(record);
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
      setEditingTeacher(null);
      message.success(editingTeacher ? '修改成功' : '添加成功');
    });
  };

  // 处理批量导入
  const handleImport = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  // 处理导出
  const handleExport = () => {
    message.success('导出成功');
  };

  // 渲染详情内容
  const renderTeacherDetails = (teacherData) => (
    <Descriptions column={2}>
      <Descriptions.Item label="工号">{teacherData.id}</Descriptions.Item>
      <Descriptions.Item label="姓名">
        {teacherData.name}
        <Tag color={teacherData.gender === '男' ? 'blue' : 'pink'} style={{ marginLeft: 8 }}>
          {teacherData.gender}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="年龄">{teacherData.age}岁</Descriptions.Item>
      <Descriptions.Item label="教龄">{teacherData.teachingAge}年</Descriptions.Item>
      <Descriptions.Item label="任教学科">
        {teacherData.subject}
        <Tag color={teacherData.subjectType === '文科' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>
          {teacherData.subjectType}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="职称">
        <Tag color={teacherData.title === '高级教师' ? 'gold' : 
                   teacherData.title === '一级教师' ? 'blue' : 'green'}>
          {teacherData.title}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="学历">
        <Tag color={teacherData.degree === '博士' ? 'purple' : 
                   teacherData.degree === '硕士' ? 'blue' : 'green'}>
          {teacherData.degree}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="职务">{teacherData.position}</Descriptions.Item>
      <Descriptions.Item label="手机号码">{teacherData.phone}</Descriptions.Item>
      <Descriptions.Item label="电子邮箱">{teacherData.email}</Descriptions.Item>
      <Descriptions.Item label="身份证号" span={2}>{teacherData.idCard}</Descriptions.Item>
      <Descriptions.Item label="入职日期">{teacherData.entryDate}</Descriptions.Item>
      <Descriptions.Item label="状态">
        <Badge status="success" text="在职" />
      </Descriptions.Item>
    </Descriptions>
  );

  // 搜索表单项
  const searchFormItems = [
    {
      name: 'searchName',
      label: '姓名',
      component: <Input placeholder="请输入姓名" />,
    },
    {
      name: 'searchSubject',
      label: '任教学科',
      component: (
        <Select placeholder="请选择学科">
          <Select.Option value="语文">语文</Select.Option>
          <Select.Option value="数学">数学</Select.Option>
          <Select.Option value="英语">英语</Select.Option>
          <Select.Option value="物理">物理</Select.Option>
          <Select.Option value="化学">化学</Select.Option>
          <Select.Option value="生物">生物</Select.Option>
          <Select.Option value="政治">政治</Select.Option>
          <Select.Option value="历史">历史</Select.Option>
          <Select.Option value="地理">地理</Select.Option>
        </Select>
      ),
    },
    {
      name: 'searchTitle',
      label: '职称',
      component: (
        <Select placeholder="请选择职称">
          <Select.Option value="高级教师">高级教师</Select.Option>
          <Select.Option value="一级教师">一级教师</Select.Option>
          <Select.Option value="二级教师">二级教师</Select.Option>
        </Select>
      ),
    },
    {
      name: 'searchPosition',
      label: '职务',
      component: (
        <Select placeholder="请选择职务">
          <Select.Option value="班主任">班主任</Select.Option>
          <Select.Option value="教研组长">教研组长</Select.Option>
          <Select.Option value="年级组长">年级组长</Select.Option>
          <Select.Option value="普通教师">普通教师</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="教师总数"
              value={statistics.total}
              prefix={<TeamOutlined />}
              suffix="人"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>男教师：{statistics.male}人</span>
              <span>女教师：{statistics.female}人</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="学科分布"
              value={statistics.artTeachers + statistics.scienceTeachers}
              prefix={<BookOutlined />}
              suffix="人"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tag color="blue">文科：{statistics.artTeachers}人</Tag>
              <Tag color="green">理科：{statistics.scienceTeachers}人</Tag>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="职称结构"
              value={statistics.seniorTeachers}
              prefix={<IdcardOutlined />}
              suffix="名高级教师"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>一级：{statistics.firstLevelTeachers}人</span>
              <span>二级：{statistics.secondLevelTeachers}人</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 操作区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Tabs defaultActiveKey="search">
          <TabPane tab="搜索筛选" key="search">
            <Form layout="inline" style={{ marginBottom: 16 }}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                {searchFormItems.map((item) => (
                  <Col key={item.name} xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name={item.name} label={item.label}>
                      {item.component}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button>重置</Button>
                    <Button type="primary" icon={<SearchOutlined />}>
                      搜索
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="批量操作" key="batch">
            <Space size="middle">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingTeacher(null);
                  form.resetFields();
                  setVisible(true);
                }}
              >
                添加教师
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => setImportModalVisible(true)}
              >
                批量导入
              </Button>
              <Button
                icon={<DownloadOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={handleExport}
              >
                导出选中
              </Button>
              <span style={{ marginLeft: 8 }}>
                已选择{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
                {selectedRowKeys.length > 0 && (
                  <Button
                    type="link"
                    onClick={() => setSelectedRowKeys([])}
                  >
                    清空
                  </Button>
                )}
              </span>
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      {/* 教师表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={teachers}
          rowKey="id"
          scroll={{ x: 1500 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 名教师`,
          }}
        />
      </Card>

      {/* 添加/编辑教师弹窗 */}
      <Modal
        title={editingTeacher ? '编辑教师' : '添加教师'}
        open={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          setEditingTeacher(null);
          form.resetFields();
        }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别">
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="subject"
                label="任教学科"
                rules={[{ required: true, message: '请选择学科' }]}
              >
                <Select placeholder="请选择学科">
                  <Select.Option value="语文">语文</Select.Option>
                  <Select.Option value="数学">数学</Select.Option>
                  <Select.Option value="英语">英语</Select.Option>
                  <Select.Option value="物理">物理</Select.Option>
                  <Select.Option value="化学">化学</Select.Option>
                  <Select.Option value="生物">生物</Select.Option>
                  <Select.Option value="政治">政治</Select.Option>
                  <Select.Option value="历史">历史</Select.Option>
                  <Select.Option value="地理">地理</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="title"
                label="职称"
                rules={[{ required: true, message: '请选择职称' }]}
              >
                <Select placeholder="请选择职称">
                  <Select.Option value="高级教师">高级教师</Select.Option>
                  <Select.Option value="一级教师">一级教师</Select.Option>
                  <Select.Option value="二级教师">二级教师</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="degree"
                label="学历"
                rules={[{ required: true, message: '请选择学历' }]}
              >
                <Select placeholder="请选择学历">
                  <Select.Option value="博士">博士</Select.Option>
                  <Select.Option value="硕士">硕士</Select.Option>
                  <Select.Option value="学士">学士</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="position"
                label="职务"
                rules={[{ required: true, message: '请选择职务' }]}
              >
                <Select placeholder="请选择职务">
                  <Select.Option value="班主任">班主任</Select.Option>
                  <Select.Option value="教研组长">教研组长</Select.Option>
                  <Select.Option value="年级组长">年级组长</Select.Option>
                  <Select.Option value="普通教师">普通教师</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="phone"
                label="手机号码"
                rules={[{ required: true, message: '请输入手机号码' }]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[{ required: true, message: '请输入电子邮箱' }]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="idCard"
                label="身份证号"
                rules={[{ required: true, message: '请输入身份证号' }]}
              >
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="entryDate"
                label="入职日期"
                rules={[{ required: true, message: '请选择入职日期' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 教师详情弹窗 */}
      <Modal
        title="教师详细信息"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setCurrentTeacher(null);
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
              handleEdit(currentTeacher);
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentTeacher && renderTeacherDetails(currentTeacher)}
      </Modal>

      {/* 批量导入弹窗 */}
      <Modal
        title="批量导入教师"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Upload.Dragger
          name="file"
          action="/api/teacher/import"
          onChange={handleImport}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 .xlsx, .xls 格式的文件
          </p>
        </Upload.Dragger>
        <div style={{ marginTop: 16 }}>
          <Button type="link" icon={<DownloadOutlined />}>
            下载导入模板
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherList; 