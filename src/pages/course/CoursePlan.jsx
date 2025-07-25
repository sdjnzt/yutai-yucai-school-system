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
  Tag,
  message,
  Descriptions,
  Popconfirm,
  Typography,
  Tabs,
  Timeline,
  Progress,
  Badge,
  Tooltip,
  Upload,
  Divider,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  UploadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileSearchOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CoursePlan = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // 生成教学计划数据
  const generatePlans = () => {
    const plans = [];
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

    const grades = ['高一', '高二', '高三'];
    const terms = ['上学期', '下学期'];
    const teachers = {
      '语文': ['张明', '李芳'],
      '数学': ['陈强', '杨丽'],
      '英语': ['王静', '赵伟'],
      '物理': ['周婷', '吴超'],
      '化学': ['郑阳', '徐磊'],
      '生物': ['马涛', '胡军'],
      '政治': ['朱琳', '郭静'],
      '历史': ['何勇', '高峰'],
      '地理': ['林娜', '谢明']
    };

    subjects.forEach(subject => {
      grades.forEach(grade => {
        terms.forEach(term => {
          const planTeachers = teachers[subject.name];
          const id = `${grade.slice(1)}${subject.name}${term === '上学期' ? '01' : '02'}`;
          
          plans.push({
            id,
            subject: subject.name,
            subjectType: subject.type,
            grade,
            term,
            teacher: planTeachers[Math.floor(Math.random() * planTeachers.length)],
            status: Math.random() < 0.7 ? 'approved' : 'pending',
            progress: Math.floor(Math.random() * 100),
            createTime: '2025-07-20',
            updateTime: '2025-07-25',
            objectives: `培养学生${subject.name}学科核心素养，掌握基础知识和技能...`,
            content: [
              { week: '第1-2周', topic: '第一单元：基础概念', hours: 8 },
              { week: '第3-4周', topic: '第二单元：重点难点', hours: 8 },
              { week: '第5-6周', topic: '第三单元：实践应用', hours: 8 },
              { week: '第7-8周', topic: '第四单元：综合提升', hours: 8 }
            ],
            materials: ['教材', '教学课件', '练习题'],
            assessment: ['课堂表现', '作业完成', '单元测试', '期末考试']
          });
        });
      });
    });

    return plans;
  };

  const [plans] = useState(generatePlans());

  // 统计数据
  const statistics = useMemo(() => {
    const total = plans.length;
    const approved = plans.filter(p => p.status === 'approved').length;
    const pending = plans.filter(p => p.status === 'pending').length;
    const artPlans = plans.filter(p => p.subjectType === '文科').length;
    const sciencePlans = plans.filter(p => p.subjectType === '理科').length;
    const averageProgress = Math.round(plans.reduce((sum, p) => sum + p.progress, 0) / total);

    return {
      total,
      approved,
      pending,
      artPlans,
      sciencePlans,
      averageProgress
    };
  }, [plans]);

  // 表格列配置
  const columns = [
    {
      title: '计划编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '学科',
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
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
    },
    {
      title: '学期',
      dataIndex: 'term',
      key: 'term',
      width: 100,
    },
    {
      title: '任课教师',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 100,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'approved' ? 'success' : 'processing'}
          text={status === 'approved' ? '已审核' : '待审核'}
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FileSearchOutlined />}
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
            title="确定要删除这个教学计划吗？"
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
    setCurrentPlan(record);
    setDetailVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingPlan(record);
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
      setEditingPlan(null);
      message.success(editingPlan ? '修改成功' : '添加成功');
    });
  };

  // 搜索表单项
  const searchFormItems = [
    {
      name: 'searchSubject',
      label: '学科',
      component: (
        <Select placeholder="请选择学科" onChange={setSelectedSubject} allowClear>
          <Select.Option value="">全部学科</Select.Option>
          <Select.OptGroup label="文科">
            <Select.Option value="语文">语文</Select.Option>
            <Select.Option value="英语">英语</Select.Option>
            <Select.Option value="政治">政治</Select.Option>
            <Select.Option value="历史">历史</Select.Option>
            <Select.Option value="地理">地理</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="理科">
            <Select.Option value="数学">数学</Select.Option>
            <Select.Option value="物理">物理</Select.Option>
            <Select.Option value="化学">化学</Select.Option>
            <Select.Option value="生物">生物</Select.Option>
          </Select.OptGroup>
        </Select>
      ),
    },
    {
      name: 'searchGrade',
      label: '年级',
      component: (
        <Select placeholder="请选择年级" onChange={setSelectedGrade} allowClear>
          <Select.Option value="">全部年级</Select.Option>
          <Select.Option value="高一">高一</Select.Option>
          <Select.Option value="高二">高二</Select.Option>
          <Select.Option value="高三">高三</Select.Option>
        </Select>
      ),
    },
    {
      name: 'searchTerm',
      label: '学期',
      component: (
        <Select placeholder="请选择学期" allowClear>
          <Select.Option value="">全部学期</Select.Option>
          <Select.Option value="上学期">上学期</Select.Option>
          <Select.Option value="下学期">下学期</Select.Option>
        </Select>
      ),
    },
    {
      name: 'searchStatus',
      label: '状态',
      component: (
        <Select placeholder="请选择状态" allowClear>
          <Select.Option value="">全部状态</Select.Option>
          <Select.Option value="approved">已审核</Select.Option>
          <Select.Option value="pending">待审核</Select.Option>
        </Select>
      ),
    },
  ];

  // 渲染详情内容
  const renderPlanDetails = (planData) => (
    <div>
      <Descriptions title="基本信息" column={3} bordered>
        <Descriptions.Item label="计划编号">{planData.id}</Descriptions.Item>
        <Descriptions.Item label="学科">
          {planData.subject}
          <Tag color={planData.subjectType === '文科' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>
            {planData.subjectType}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="年级">{planData.grade}</Descriptions.Item>
        <Descriptions.Item label="学期">{planData.term}</Descriptions.Item>
        <Descriptions.Item label="任课教师">{planData.teacher}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Badge
            status={planData.status === 'approved' ? 'success' : 'processing'}
            text={planData.status === 'approved' ? '已审核' : '待审核'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{planData.createTime}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{planData.updateTime}</Descriptions.Item>
        <Descriptions.Item label="完成进度">
          <Progress percent={planData.progress} size="small" />
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={5}>教学目标</Title>
      <Paragraph>{planData.objectives}</Paragraph>

      <Divider />

      <Title level={5}>教学内容</Title>
      <Timeline>
        {planData.content.map((item, index) => (
          <Timeline.Item key={index}>
            <div style={{ marginBottom: 8 }}>
              <Tag color="blue">{item.week}</Tag>
              <Tag color="orange">{item.hours}课时</Tag>
            </div>
            <div>{item.topic}</div>
          </Timeline.Item>
        ))}
      </Timeline>

      <Divider />

      <Title level={5}>教学资源</Title>
      <Space wrap>
        {planData.materials.map((material, index) => (
          <Tag key={index} icon={<FileTextOutlined />}>{material}</Tag>
        ))}
      </Space>

      <Divider />

      <Title level={5}>考核方式</Title>
      <Space wrap>
        {planData.assessment.map((item, index) => (
          <Tag key={index} icon={<CheckCircleOutlined />}>{item}</Tag>
        ))}
      </Space>
    </div>
  );

  // 过滤数据
  const filteredPlans = plans.filter(plan => {
    if (selectedSubject && plan.subject !== selectedSubject) return false;
    if (selectedGrade && plan.grade !== selectedGrade) return false;
    return true;
  });

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="教学计划总数"
              value={statistics.total}
              suffix="个"
              prefix={<BookOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Badge status="success" text={`已审核: ${statistics.approved}`} />
              <Badge status="processing" text={`待审核: ${statistics.pending}`} />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="学科分布"
              value={statistics.artPlans + statistics.sciencePlans}
              suffix="个"
              prefix={<TeamOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tag color="blue">文科：{statistics.artPlans}个</Tag>
              <Tag color="green">理科：{statistics.sciencePlans}个</Tag>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均进度"
              value={statistics.averageProgress}
              suffix="%"
              prefix={<ClockCircleOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Progress percent={statistics.averageProgress} size="small" />
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
            </Form>
          </TabPane>
          <TabPane tab="快捷操作" key="operation">
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingPlan(null);
                  form.resetFields();
                  setVisible(true);
                }}
              >
                新建计划
              </Button>
              <Upload>
                <Button icon={<UploadOutlined />}>导入计划</Button>
              </Upload>
              <Button icon={<DownloadOutlined />}>导出计划</Button>
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      {/* 计划列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPlans}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个教学计划`,
          }}
        />
      </Card>

      {/* 添加/编辑计划弹窗 */}
      <Modal
        title={editingPlan ? '编辑教学计划' : '新建教学计划'}
        open={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          setEditingPlan(null);
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
                name="subject"
                label="学科"
                rules={[{ required: true, message: '请选择学科' }]}
              >
                <Select placeholder="请选择学科">
                  <Select.OptGroup label="文科">
                    <Select.Option value="语文">语文</Select.Option>
                    <Select.Option value="英语">英语</Select.Option>
                    <Select.Option value="政治">政治</Select.Option>
                    <Select.Option value="历史">历史</Select.Option>
                    <Select.Option value="地理">地理</Select.Option>
                  </Select.OptGroup>
                  <Select.OptGroup label="理科">
                    <Select.Option value="数学">数学</Select.Option>
                    <Select.Option value="物理">物理</Select.Option>
                    <Select.Option value="化学">化学</Select.Option>
                    <Select.Option value="生物">生物</Select.Option>
                  </Select.OptGroup>
                </Select>
              </Form.Item>
            </Col>
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
                name="term"
                label="学期"
                rules={[{ required: true, message: '请选择学期' }]}
              >
                <Select placeholder="请选择学期">
                  <Select.Option value="上学期">上学期</Select.Option>
                  <Select.Option value="下学期">下学期</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacher"
                label="任课教师"
                rules={[{ required: true, message: '请选择任课教师' }]}
              >
                <Select placeholder="请选择任课教师">
                  <Select.OptGroup label="文科教师">
                    <Select.Option value="张明">张明（语文）</Select.Option>
                    <Select.Option value="李芳">李芳（语文）</Select.Option>
                    <Select.Option value="王静">王静（英语）</Select.Option>
                    <Select.Option value="周婷">周婷（政治）</Select.Option>
                    <Select.Option value="吴超">吴超（历史）</Select.Option>
                    <Select.Option value="郑阳">郑阳（地理）</Select.Option>
                  </Select.OptGroup>
                  <Select.OptGroup label="理科教师">
                    <Select.Option value="陈强">陈强（数学）</Select.Option>
                    <Select.Option value="杨丽">杨丽（数学）</Select.Option>
                    <Select.Option value="赵伟">赵伟（物理）</Select.Option>
                    <Select.Option value="徐磊">徐磊（化学）</Select.Option>
                    <Select.Option value="马涛">马涛（生物）</Select.Option>
                  </Select.OptGroup>
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
                  <Select.Option value="pending">待审核</Select.Option>
                  <Select.Option value="approved">已审核</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="objectives"
            label="教学目标"
            rules={[{ required: true, message: '请输入教学目标' }]}
          >
            <TextArea rows={4} placeholder="请输入本学期的教学目标，包括知识目标、能力目标和素养目标等" />
          </Form.Item>
          <Form.Item
            name="content"
            label="教学内容"
            rules={[{ required: true, message: '请输入教学内容' }]}
          >
            <TextArea rows={6} placeholder="请按周次输入教学内容，例如：&#13;第1-2周：第一单元 基础概念（8课时）&#13;第3-4周：第二单元 重点难点（8课时）&#13;..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="materials"
                label="教学资源"
                rules={[{ required: true, message: '请选择教学资源' }]}
              >
                <Select mode="multiple" placeholder="请选择教学资源">
                  <Select.Option value="教材">教材</Select.Option>
                  <Select.Option value="教学课件">教学课件</Select.Option>
                  <Select.Option value="练习题">练习题</Select.Option>
                  <Select.Option value="实验材料">实验材料</Select.Option>
                  <Select.Option value="教学视频">教学视频</Select.Option>
                  <Select.Option value="参考资料">参考资料</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assessment"
                label="考核方式"
                rules={[{ required: true, message: '请选择考核方式' }]}
              >
                <Select mode="multiple" placeholder="请选择考核方式">
                  <Select.Option value="课堂表现">课堂表现</Select.Option>
                  <Select.Option value="作业完成">作业完成</Select.Option>
                  <Select.Option value="实验操作">实验操作</Select.Option>
                  <Select.Option value="小组展示">小组展示</Select.Option>
                  <Select.Option value="单元测试">单元测试</Select.Option>
                  <Select.Option value="期中考试">期中考试</Select.Option>
                  <Select.Option value="期末考试">期末考试</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 计划详情弹窗 */}
      <Modal
        title="教学计划详情"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setCurrentPlan(null);
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
              handleEdit(currentPlan);
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentPlan && renderPlanDetails(currentPlan)}
      </Modal>
    </div>
  );
};

export default CoursePlan; 