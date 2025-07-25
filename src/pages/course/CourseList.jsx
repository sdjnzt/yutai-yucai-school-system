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
  Tabs
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const CourseList = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  // 生成课程数据
  const generateCourses = () => {
    const courses = [];
    
    // 必修课程配置
    const requiredCourses = [
      { name: '语文', type: '文科', credit: 4, grades: ['高一', '高二', '高三'] },
      { name: '数学', type: '理科', credit: 4, grades: ['高一', '高二', '高三'] },
      { name: '英语', type: '文科', credit: 4, grades: ['高一', '高二', '高三'] },
      { name: '物理', type: '理科', credit: 3, grades: ['高一', '高二'] },
      { name: '化学', type: '理科', credit: 3, grades: ['高一', '高二'] },
      { name: '生物', type: '理科', credit: 3, grades: ['高一', '高二'] },
      { name: '政治', type: '文科', credit: 2, grades: ['高一', '高二'] },
      { name: '历史', type: '文科', credit: 2, grades: ['高一', '高二'] },
      { name: '地理', type: '文科', credit: 2, grades: ['高一', '高二'] },
      { name: '信息技术', type: '理科', credit: 2, grades: ['高一'] },
      { name: '通用技术', type: '理科', credit: 2, grades: ['高一'] },
      { name: '音乐', type: '文科', credit: 2, grades: ['高一'] },
      { name: '美术', type: '文科', credit: 2, grades: ['高一'] },
      { name: '体育与健康', type: '文科', credit: 2, grades: ['高一', '高二', '高三'] }
    ];

    // 选修课程配置
    const electiveCourses = [
      { name: '物理', type: '理科', credit: 4, grades: ['高三'] },
      { name: '化学', type: '理科', credit: 4, grades: ['高三'] },
      { name: '生物', type: '理科', credit: 4, grades: ['高三'] },
      { name: '政治', type: '文科', credit: 4, grades: ['高三'] },
      { name: '历史', type: '文科', credit: 4, grades: ['高三'] },
      { name: '地理', type: '文科', credit: 4, grades: ['高三'] },
      { name: '数学竞赛', type: '理科', credit: 2, grades: ['高二'] },
      { name: '物理竞赛', type: '理科', credit: 2, grades: ['高二'] },
      { name: '化学竞赛', type: '理科', credit: 2, grades: ['高二'] },
      { name: '生物竞赛', type: '理科', credit: 2, grades: ['高二'] },
      { name: '信息学竞赛', type: '理科', credit: 2, grades: ['高二'] }
    ];

    const examTypes = {
      required: ['期中考试', '期末考试', '月考', '单元测试'],
      elective: ['期中考试', '期末考试']
    };

    const classrooms = {
      '语文': '普通教室',
      '数学': '普通教室',
      '英语': '多媒体教室',
      '物理': '实验室',
      '化学': '实验室',
      '生物': '实验室',
      '政治': '多媒体教室',
      '历史': '多媒体教室',
      '地理': '多媒体教室',
      '信息技术': '计算机教室',
      '通用技术': '实验室',
      '音乐': '音乐教室',
      '美术': '美术教室',
      '体育与健康': '体育馆',
      '数学竞赛': '普通教室',
      '物理竞赛': '实验室',
      '化学竞赛': '实验室',
      '生物竞赛': '实验室',
      '信息学竞赛': '计算机教室'
    };

    // 生成必修课程
    requiredCourses.forEach((course, index) => {
      course.grades.forEach((grade) => {
        const courseId = `C${String(index + 1).padStart(2, '0')}${grade.slice(1)}B`;
        courses.push({
          id: courseId,
          name: course.name,
          subject: course.name,
          subjectType: course.type,
          grade,
          type: '必修',
          credit: course.credit,
          weeklyHours: course.credit * 2,
          examTypes: examTypes.required,
          classroom: classrooms[course.name] || '普通教室',
          description: `${grade}${course.name}必修课程，培养学生${course.name}学科核心素养，掌握基础知识和基本技能。`,
          status: 'active'
        });
      });
    });

    // 生成选修课程
    electiveCourses.forEach((course, index) => {
      course.grades.forEach((grade) => {
        const courseId = `X${String(index + 1).padStart(2, '0')}${grade.slice(1)}X`;
        courses.push({
          id: courseId,
          name: `${course.name}${course.grades.includes('高三') ? '' : '（选修）'}`,
          subject: course.name,
          subjectType: course.type,
          grade,
          type: '选修',
          credit: course.credit,
          weeklyHours: course.credit * 2,
          examTypes: examTypes.elective,
          classroom: classrooms[course.name] || '普通教室',
          description: `${grade}${course.name}选修课程，${course.grades.includes('高三') ? '深入学习本学科知识，为高考做准备。' : '提供学科拓展和竞赛培训。'}`,
          status: 'active'
        });
      });
    });

    return courses;
  };

  const [courses] = useState(generateCourses());

  // 统计数据
  const statistics = useMemo(() => {
    const total = courses.length;
    const requiredCourses = courses.filter(c => c.type === '必修').length;
    const electiveCourses = courses.filter(c => c.type === '选修').length;
    const artCourses = courses.filter(c => c.subjectType === '文科').length;
    const scienceCourses = courses.filter(c => c.subjectType === '理科').length;
    const gradeOneCourses = courses.filter(c => c.grade === '高一').length;
    const gradeTwoCourses = courses.filter(c => c.grade === '高二').length;
    const gradeThreeCourses = courses.filter(c => c.grade === '高三').length;

    return {
      total,
      requiredCourses,
      electiveCourses,
      artCourses,
      scienceCourses,
      gradeOneCourses,
      gradeTwoCourses,
      gradeThreeCourses
    };
  }, [courses]);

  // 表格列配置
  const columns = [
    {
      title: '课程编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <span style={{ fontWeight: 'bold' }}>{record.name}</span>
          <Tag color={record.subjectType === '文科' ? 'blue' : 'green'}>
            {record.subjectType}
          </Tag>
        </Space>
      ),
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === '必修' ? 'orange' : 'purple'}>{type}</Tag>
      ),
    },
    {
      title: '学分',
      dataIndex: 'credit',
      key: 'credit',
      width: 80,
    },
    {
      title: '周课时',
      dataIndex: 'weeklyHours',
      key: 'weeklyHours',
      width: 80,
    },
    {
      title: '考核方式',
      dataIndex: 'examTypes',
      key: 'examTypes',
      render: (examTypes) => (
        <Space wrap>
          {examTypes.map(type => (
            <Tag key={type} color="blue">{type}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '教室要求',
      dataIndex: 'classroom',
      key: 'classroom',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: () => <Badge status="success" text="已启用" />,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<BookOutlined />}
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
            title="确定要删除这门课程吗？"
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
    setCurrentCourse(record);
    setDetailVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingCourse(record);
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
      setEditingCourse(null);
      message.success(editingCourse ? '修改成功' : '添加成功');
    });
  };

  // 搜索表单项
  const searchFormItems = [
    {
      name: 'searchName',
      label: '课程名称',
      component: <Input placeholder="请输入课程名称" />,
    },
    {
      name: 'searchGrade',
      label: '年级',
      component: (
        <Select placeholder="请选择年级">
          <Select.Option value="高一">高一</Select.Option>
          <Select.Option value="高二">高二</Select.Option>
          <Select.Option value="高三">高三</Select.Option>
        </Select>
      ),
    },
    {
      name: 'searchType',
      label: '类型',
      component: (
        <Select placeholder="请选择类型">
          <Select.Option value="必修">必修</Select.Option>
          <Select.Option value="选修">选修</Select.Option>
        </Select>
      ),
    },
    {
      name: 'searchSubject',
      label: '学科',
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
  ];

  // 渲染详情内容
  const renderCourseDetails = (courseData) => (
    <Descriptions column={2}>
      <Descriptions.Item label="课程编号">{courseData.id}</Descriptions.Item>
      <Descriptions.Item label="课程名称">
        {courseData.name}
        <Tag color={courseData.subjectType === '文科' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>
          {courseData.subjectType}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="所属学科">{courseData.subject}</Descriptions.Item>
      <Descriptions.Item label="年级">{courseData.grade}</Descriptions.Item>
      <Descriptions.Item label="课程类型">
        <Tag color={courseData.type === '必修' ? 'orange' : 'purple'}>
          {courseData.type}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="学分">{courseData.credit}学分</Descriptions.Item>
      <Descriptions.Item label="周课时">{courseData.weeklyHours}课时/周</Descriptions.Item>
      <Descriptions.Item label="教室要求">{courseData.classroom}</Descriptions.Item>
      <Descriptions.Item label="考核方式">
        <Space wrap>
          {courseData.examTypes.map(type => (
            <Tag key={type} color="blue">{type}</Tag>
          ))}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="状态" span={2}>
        <Badge status="success" text="已启用" />
      </Descriptions.Item>
      <Descriptions.Item label="课程描述" span={2}>
        {courseData.description}
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
              title="课程总数"
              value={statistics.total}
              prefix={<BookOutlined />}
              suffix="门"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tag color="orange">必修：{statistics.requiredCourses}门</Tag>
              <Tag color="purple">选修：{statistics.electiveCourses}门</Tag>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="学科分布"
              value={statistics.artCourses + statistics.scienceCourses}
              prefix={<TeamOutlined />}
              suffix="门"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tag color="blue">文科：{statistics.artCourses}门</Tag>
              <Tag color="green">理科：{statistics.scienceCourses}门</Tag>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="年级分布"
              value={statistics.total}
              prefix={<ClockCircleOutlined />}
              suffix="门"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>高一：{statistics.gradeOneCourses}门</span>
              <span>高二：{statistics.gradeTwoCourses}门</span>
              <span>高三：{statistics.gradeThreeCourses}门</span>
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
          <TabPane tab="快捷操作" key="operation">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingCourse(null);
                form.resetFields();
                setVisible(true);
              }}
              style={{ marginRight: 8 }}
            >
              添加课程
            </Button>
          </TabPane>
        </Tabs>
      </Card>

      {/* 课程表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 门课程`,
          }}
        />
      </Card>

      {/* 添加/编辑课程弹窗 */}
      <Modal
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          setEditingCourse(null);
          form.resetFields();
        }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="课程名称"
                rules={[{ required: true, message: '请输入课程名称' }]}
              >
                <Input placeholder="请输入课程名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subject"
                label="所属学科"
                rules={[{ required: true, message: '请选择所属学科' }]}
              >
                <Select placeholder="请选择所属学科">
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
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="grade"
                label="年级"
                rules={[{ required: true, message: '请选择年级' }]}
              >
                <Select placeholder="请选择年级">
                  <Select.Option value="高一">高一</Select.Option>
                  <Select.Option value="高二">高二</Select.Option>
                  <Select.Option value="高三">高三</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="课程类型"
                rules={[{ required: true, message: '请选择课程类型' }]}
              >
                <Select placeholder="请选择课程类型">
                  <Select.Option value="必修">必修</Select.Option>
                  <Select.Option value="选修">选修</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="credit"
                label="学分"
                rules={[{ required: true, message: '请输入学分' }]}
              >
                <Input type="number" placeholder="请输入学分" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="weeklyHours"
                label="周课时"
                rules={[{ required: true, message: '请输入周课时' }]}
              >
                <Input type="number" placeholder="请输入周课时" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="classroom"
                label="教室要求"
                rules={[{ required: true, message: '请选择教室要求' }]}
              >
                <Select placeholder="请选择教室要求">
                  <Select.Option value="多媒体教室">多媒体教室</Select.Option>
                  <Select.Option value="实验室">实验室</Select.Option>
                  <Select.Option value="普通教室">普通教室</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="examTypes"
                label="考核方式"
                rules={[{ required: true, message: '请选择考核方式' }]}
              >
                <Select mode="multiple" placeholder="请选择考核方式">
                  <Select.Option value="期中考试">期中考试</Select.Option>
                  <Select.Option value="期末考试">期末考试</Select.Option>
                  <Select.Option value="月考">月考</Select.Option>
                  <Select.Option value="单元测试">单元测试</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="课程描述"
            rules={[{ required: true, message: '请输入课程描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入课程描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 课程详情弹窗 */}
      <Modal
        title="课程详细信息"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setCurrentCourse(null);
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
              handleEdit(currentCourse);
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentCourse && renderCourseDetails(currentCourse)}
      </Modal>
    </div>
  );
};

export default CourseList; 