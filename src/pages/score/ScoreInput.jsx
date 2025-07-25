import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Button,
  Select,
  Input,
  Space,
  Row,
  Col,
  message,
  Upload,
  InputNumber,
  Form,
  Tag,
  Tooltip,
  Badge,
  Alert,
  Typography,
  Modal,
  Divider,
  Statistic
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  SaveOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  QuestionCircleOutlined,
  LineChartOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const ScoreInput = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [form] = Form.useForm();
  const [importModalVisible, setImportModalVisible] = useState(false);

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
  const generateScores = (classId) => {
    if (!classId) return [];

    const selectedClassData = classes.find(c => c.id === classId);
    const scores = [];
    const isArtClass = selectedClassData.type === '文科';
    
    // 生成50个学生的数据
    for (let i = 1; i <= 50; i++) {
      const studentId = `${classId}${String(i).padStart(2, '0')}`;
      const baseScore = 60 + Math.floor(Math.random() * 30); // 基础分60-90
      const randomVariation = Math.floor(Math.random() * 20) - 10; // 随机波动±10分
      const score = Math.min(Math.max(baseScore + randomVariation, 0), 100); // 确保分数在0-100之间

      scores.push({
        key: studentId,
        studentId,
        name: generateStudentName(),
        score: score,
        status: score >= 60 ? 'pass' : 'fail',
        comment: generateComment(score)
      });
    }

    return scores;
  };

  // 生成学生姓名
  const generateStudentName = () => {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军'];
    return surnames[Math.floor(Math.random() * surnames.length)] + 
           names[Math.floor(Math.random() * names.length)];
  };

  // 生成评语
  const generateComment = (score) => {
    if (score >= 90) return '优秀，继续保持';
    if (score >= 80) return '良好，仍有提升空间';
    if (score >= 70) return '中等，需要加强练习';
    if (score >= 60) return '及格，但需要更多努力';
    return '需要补习，建议参加辅导';
  };

  // 当前成绩数据
  const [scores, setScores] = useState([]);

  // 统计数据
  const statistics = useMemo(() => {
    if (!scores.length) return null;

    const total = scores.length;
    const passed = scores.filter(s => s.score >= 60).length;
    const excellent = scores.filter(s => s.score >= 90).length;
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const averageScore = Math.round(totalScore / total);
    const maxScore = Math.max(...scores.map(s => s.score));
    const minScore = Math.min(...scores.map(s => s.score));

    // 分数段分布
    const distribution = {
      '90-100': scores.filter(s => s.score >= 90).length,
      '80-89': scores.filter(s => s.score >= 80 && s.score < 90).length,
      '70-79': scores.filter(s => s.score >= 70 && s.score < 80).length,
      '60-69': scores.filter(s => s.score >= 60 && s.score < 70).length,
      '0-59': scores.filter(s => s.score < 60).length,
    };

    return {
      total,
      passed,
      excellent,
      averageScore,
      maxScore,
      minScore,
      passRate: Math.round((passed / total) * 100),
      excellentRate: Math.round((excellent / total) * 100),
      distribution
    };
  }, [scores]);

  // 处理班级选择
  const handleClassChange = (value) => {
    setSelectedClass(value);
    if (value && selectedSubject && selectedExam) {
      setScores(generateScores(value));
    }
  };

  // 处理学科选择
  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    if (selectedClass && value && selectedExam) {
      setScores(generateScores(selectedClass));
    }
  };

  // 处理考试选择
  const handleExamChange = (value) => {
    setSelectedExam(value);
    if (selectedClass && selectedSubject && value) {
      setScores(generateScores(selectedClass));
    }
  };

  // 处理分数修改
  const handleScoreChange = (value, record) => {
    const newScores = scores.map(s => {
      if (s.key === record.key) {
        return {
          ...s,
          score: value,
          status: value >= 60 ? 'pass' : 'fail',
          comment: generateComment(value)
        };
      }
      return s;
    });
    setScores(newScores);
  };

  // 处理保存
  const handleSave = () => {
    message.success('成绩保存成功');
  };

  // 处理导入
  const handleImport = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      setImportModalVisible(false);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  // 处理导出
  const handleExport = () => {
    message.success('成绩导出成功');
  };

  // 表格列配置
  const columns = [
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
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      width: 150,
      render: (score, record) => (
        <InputNumber
          min={0}
          max={100}
          value={score}
          onChange={(value) => handleScoreChange(value, record)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'pass' ? 'success' : 'error'}
          text={status === 'pass' ? '及格' : '不及格'}
        />
      ),
    },
    {
      title: '评语',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: {
        showTitle: false,
      },
      render: (comment) => (
        <Tooltip placement="topLeft" title={comment}>
          {comment}
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      {/* 顶部控制栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
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
          <Col span={6}>
            <Select
              placeholder="请选择学科"
              style={{ width: '100%' }}
              onChange={handleSubjectChange}
              value={selectedSubject}
            >
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
          </Col>
          <Col span={6}>
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
          <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!scores.length}
              >
                保存
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => setImportModalVisible(true)}
              >
                导入
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={!scores.length}
              >
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {!selectedClass || !selectedSubject || !selectedExam ? (
        <Alert
          message="请选择班级、学科和考试"
          description="请先完整选择以上信息来录入或查看成绩"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <>
          {/* 成绩统计 */}
          {statistics && (
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="平均分"
                    value={statistics.averageScore}
                    suffix="分"
                    prefix={<LineChartOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <Space>
                    <span>最高分：{statistics.maxScore}</span>
                    <span>最低分：{statistics.minScore}</span>
                  </Space>
                </Col>
                <Col span={6}>
                  <Statistic
                    title="及格率"
                    value={statistics.passRate}
                    suffix="%"
                    prefix={<TeamOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div>及格人数：{statistics.passed}/{statistics.total}</div>
                </Col>
                <Col span={6}>
                  <Statistic
                    title="优秀率"
                    value={statistics.excellentRate}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div>优秀人数：{statistics.excellent}/{statistics.total}</div>
                </Col>
                <Col span={6}>
                  <Title level={5}>分数段分布</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {Object.entries(statistics.distribution).map(([range, count]) => (
                      <div key={range} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tag color={
                          range === '90-100' ? 'red' :
                          range === '80-89' ? 'orange' :
                          range === '70-79' ? 'green' :
                          range === '60-69' ? 'blue' :
                          'gray'
                        }>
                          {range}分
                        </Tag>
                        <span>{count}人</span>
                      </div>
                    ))}
                  </Space>
                </Col>
              </Row>
            </Card>
          )}

          {/* 成绩表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={scores}
              pagination={false}
              scroll={{ x: 800, y: 500 }}
              bordered
            />
          </Card>
        </>
      )}

      {/* 导入成绩弹窗 */}
      <Modal
        title="导入成绩"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Alert
          message="导入说明"
          description={
            <ul>
              <li>请使用标准模板导入成绩</li>
              <li>支持 .xlsx, .xls 格式的文件</li>
              <li>请确保表格中学号与系统中的学号一致</li>
              <li>成绩请填写0-100的整数</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Upload.Dragger
          name="file"
          action="/api/score/import"
          onChange={handleImport}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            单次只能上传一个文件
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

export default ScoreInput; 