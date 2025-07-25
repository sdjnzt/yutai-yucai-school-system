import React, { useState, useMemo } from 'react';
import {
  Card,
  Select,
  Button,
  Space,
  Row,
  Col,
  Table,
  Tag,
  Alert,
  Typography,
  Tabs,
  Modal,
  Form,
  Input,
  message,
  Tooltip,
  Badge,
  Divider,
  Statistic
} from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  MailOutlined,
  FileTextOutlined,
  TeamOutlined,
  TrophyOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ScoreReport = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 生成班级数据
  const classes = [
    { id: 'G1C1', name: '高一(1)班', type: '文科' },
    { id: 'G1C2', name: '高一(2)班', type: '文科' },
    { id: 'G1C3', name: '高一(3)班', type: '文科' },
    { id: 'G1C4', name: '高一(4)班', type: '文科' },
    { id: 'G1C5', name: '高一(5)班', type: '理科' },
    { id: 'G1C6', name: '高一(6)班', type: '理科' },
    { id: 'G1C7', name: '高一(7)班', type: '理科' },
    { id: 'G1C8', name: '高一(8)班', type: '理科' },
  ];

  // 生成考试数据
  const exams = [
    { id: '202507M', name: '2025年7月月考', type: '月考' },
    { id: '202507F', name: '2025年暑期补考', type: '补考' },
    { id: '202506F', name: '2025年期末考试', type: '期末' },
    { id: '202504M', name: '2025年4月月考', type: '月考' },
    { id: '202503M', name: '2025年3月月考', type: '月考' },
    { id: '202501F', name: '2025年期中考试', type: '期中' },
  ];

  // 生成学生成绩数据
  const generateStudentScores = () => {
    if (!selectedClass || !selectedExam) return [];

    const selectedClassData = classes.find(c => c.id === selectedClass);
    const isArtClass = selectedClassData.type === '文科';
    const subjects = isArtClass ? 
      ['语文', '数学', '英语', '政治', '历史', '地理'] :
      ['语文', '数学', '英语', '物理', '化学', '生物'];

    const scores = [];
    for (let i = 1; i <= 50; i++) {
      const studentId = `${selectedClass}${String(i).padStart(2, '0')}`;
      const studentScores = {};
      let totalScore = 0;

      subjects.forEach(subject => {
        const baseScore = 70 + Math.floor(Math.random() * 20); // 基础分70-90
        const score = Math.min(Math.max(baseScore + Math.floor(Math.random() * 20) - 10, 0), 100);
        studentScores[subject] = score;
        totalScore += score;
      });

      scores.push({
        key: studentId,
        studentId,
        name: generateStudentName(),
        ...studentScores,
        totalScore,
        averageScore: Math.round(totalScore / subjects.length),
        classRank: i,
        gradeRank: i + Math.floor(Math.random() * 20) - 10,
      });
    }

    return scores;
  };

  // 生成学科统计数据
  const generateSubjectStats = () => {
    if (!selectedClass || !selectedExam) return [];

    const selectedClassData = classes.find(c => c.id === selectedClass);
    const isArtClass = selectedClassData.type === '文科';
    const subjects = isArtClass ? 
      ['语文', '数学', '英语', '政治', '历史', '地理'] :
      ['语文', '数学', '英语', '物理', '化学', '生物'];

    return subjects.map(subject => {
      const avgScore = 70 + Math.floor(Math.random() * 10);
      const passCount = 40 + Math.floor(Math.random() * 8);
      const excellentCount = 10 + Math.floor(Math.random() * 10);

      return {
        key: subject,
        subject,
        avgScore,
        maxScore: Math.min(avgScore + 20, 100),
        minScore: Math.max(avgScore - 30, 0),
        passCount,
        excellentCount,
        passRate: Math.round((passCount / 50) * 100),
        excellentRate: Math.round((excellentCount / 50) * 100),
      };
    });
  };

  // 生成学生姓名
  const generateStudentName = () => {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军'];
    return surnames[Math.floor(Math.random() * surnames.length)] + 
           names[Math.floor(Math.random() * names.length)];
  };

  // 处理班级选择
  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  // 处理考试选择
  const handleExamChange = (value) => {
    setSelectedExam(value);
  };

  // 处理打印
  const handlePrint = () => {
    message.success('正在打印成绩报告');
  };

  // 处理导出
  const handleExport = () => {
    message.success('成绩报告已导出');
  };

  // 处理发送邮件
  const handleEmail = () => {
    form.validateFields().then(values => {
      console.log('Email values:', values);
      setEmailModalVisible(false);
      form.resetFields();
      message.success('成绩报告已发送');
    });
  };

  // 计算统计数据
  const statistics = useMemo(() => {
    if (!selectedClass || !selectedExam) return null;

    const scores = generateStudentScores();
    const total = scores.length;
    const avgScore = Math.round(scores.reduce((sum, s) => sum + s.averageScore, 0) / total);
    const passed = scores.filter(s => s.averageScore >= 60).length;
    const excellent = scores.filter(s => s.averageScore >= 90).length;
    const maxScore = Math.max(...scores.map(s => s.averageScore));
    const minScore = Math.min(...scores.map(s => s.averageScore));

    return {
      total,
      avgScore,
      maxScore,
      minScore,
      passed,
      excellent,
      passRate: Math.round((passed / total) * 100),
      excellentRate: Math.round((excellent / total) * 100),
    };
  }, [selectedClass, selectedExam]);

  // 学生成绩表格列
  const studentColumns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: '语文',
      dataIndex: '语文',
      key: '语文',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '数学',
      dataIndex: '数学',
      key: '数学',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '英语',
      dataIndex: '英语',
      key: '英语',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '物理',
      dataIndex: '物理',
      key: '物理',
      width: 100,
      render: (score) => score && (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '化学',
      dataIndex: '化学',
      key: '化学',
      width: 100,
      render: (score) => score && (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '生物',
      dataIndex: '生物',
      key: '生物',
      width: 100,
      render: (score) => score && (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '政治',
      dataIndex: '政治',
      key: '政治',
      width: 100,
      render: (score) => score && (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '历史',
      dataIndex: '历史',
      key: '历史',
      width: 100,
      render: (score) => score && (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '地理',
      dataIndex: '地理',
      key: '地理',
      width: 100,
      render: (score) => score && (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      fixed: 'right',
    },
    {
      title: '平均分',
      dataIndex: 'averageScore',
      key: 'averageScore',
      width: 100,
      fixed: 'right',
      render: (score) => (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '班级排名',
      dataIndex: 'classRank',
      key: 'classRank',
      width: 100,
      fixed: 'right',
      render: (rank) => <Tag color="blue">第 {rank} 名</Tag>,
    },
    {
      title: '年级排名',
      dataIndex: 'gradeRank',
      key: 'gradeRank',
      width: 100,
      fixed: 'right',
      render: (rank) => <Tag>第 {rank} 名</Tag>,
    },
  ];

  // 学科统计表格列
  const subjectColumns = [
    {
      title: '学科',
      dataIndex: 'subject',
      key: 'subject',
      width: 100,
      fixed: 'left',
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 100,
    },
    {
      title: '最高分',
      dataIndex: 'maxScore',
      key: 'maxScore',
      width: 100,
    },
    {
      title: '最低分',
      dataIndex: 'minScore',
      key: 'minScore',
      width: 100,
    },
    {
      title: '及格人数',
      dataIndex: 'passCount',
      key: 'passCount',
      width: 100,
    },
    {
      title: '优秀人数',
      dataIndex: 'excellentCount',
      key: 'excellentCount',
      width: 100,
    },
    {
      title: '及格率',
      dataIndex: 'passRate',
      key: 'passRate',
      width: 100,
      render: (rate) => (
        <Tag color={rate >= 85 ? 'success' : rate >= 60 ? 'warning' : 'error'}>
          {rate}%
        </Tag>
      ),
    },
    {
      title: '优秀率',
      dataIndex: 'excellentRate',
      key: 'excellentRate',
      width: 100,
      render: (rate) => (
        <Tag color={rate >= 30 ? 'success' : rate >= 20 ? 'warning' : 'error'}>
          {rate}%
        </Tag>
      ),
    },
  ];

  return (
    <div>
      {/* 顶部控制栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Select
              placeholder="请选择班级"
              style={{ width: '100%' }}
              onChange={handleClassChange}
              value={selectedClass}
            >
              {classes.map(cls => (
                <Select.Option key={cls.id} value={cls.id}>
                  {cls.name}
                  <Tag color={cls.type === '文科' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>
                    {cls.type}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="请选择考试"
              style={{ width: '100%' }}
              onChange={handleExamChange}
              value={selectedExam}
            >
              {exams.map(exam => (
                <Select.Option key={exam.id} value={exam.id}>
                  {exam.name}
                  <Tag color={
                    exam.type === '期末' ? 'red' :
                    exam.type === '期中' ? 'orange' :
                    exam.type === '月考' ? 'blue' : 'purple'
                  } style={{ marginLeft: 8 }}>
                    {exam.type}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                打印报告
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出报告
              </Button>
              <Button
                type="primary"
                icon={<MailOutlined />}
                onClick={() => setEmailModalVisible(true)}
              >
                发送报告
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {!selectedClass || !selectedExam ? (
        <Alert
          message="请选择班级和考试"
          description="请先选择要生成报告的班级和考试"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <>
          {/* 统计卡片 */}
          {statistics && (
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="班级平均分"
                    value={statistics.avgScore}
                    suffix="分"
                    prefix={<LineChartOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <Space>
                    <span>最高分：{statistics.maxScore}</span>
                    <span>最低分：{statistics.minScore}</span>
                  </Space>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="及格率"
                    value={statistics.passRate}
                    suffix="%"
                    prefix={<TeamOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div>及格人数：{statistics.passed}/{statistics.total}</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="优秀率"
                    value={statistics.excellentRate}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div>优秀人数：{statistics.excellent}/{statistics.total}</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="参考人数"
                    value={statistics.total}
                    suffix="人"
                    prefix={<TeamOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div>分差：{statistics.maxScore - statistics.minScore}分</div>
                </Card>
              </Col>
            </Row>
          )}

          {/* 报告内容 */}
          <Tabs defaultActiveKey="student">
            <TabPane tab="学生成绩单" key="student">
              <Table
                columns={studentColumns}
                dataSource={generateStudentScores()}
                scroll={{ x: 1800 }}
                pagination={{
                  pageSize: 10,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 名学生`,
                }}
              />
            </TabPane>
            <TabPane tab="学科统计" key="subject">
              <Table
                columns={subjectColumns}
                dataSource={generateSubjectStats()}
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </>
      )}

      {/* 发送邮件弹窗 */}
      <Modal
        title="发送成绩报告"
        open={emailModalVisible}
        onOk={handleEmail}
        onCancel={() => {
          setEmailModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="emails"
            label="收件人邮箱"
            rules={[{ required: true, message: '请输入收件人邮箱' }]}
          >
            <Input.TextArea
              placeholder="请输入收件人邮箱，多个邮箱请用逗号分隔"
              rows={4}
            />
          </Form.Item>
          <Form.Item
            name="subject"
            label="邮件主题"
            initialValue={`${selectedClass ? classes.find(c => c.id === selectedClass)?.name : ''} ${selectedExam ? exams.find(e => e.id === selectedExam)?.name : ''} 成绩报告`}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="邮件内容"
            initialValue="附件为成绩报告，请查收。"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScoreReport; 