import React, { useState, useMemo } from 'react';
import {
  Card,
  Select,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Space,
  Alert,
  Typography,
  Table,
  Tooltip,
  Badge
} from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  LineChartOutlined,
  BarChartOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const ScoreAnalysis = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

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
    { id: '202506F', name: '2025年期末考试', type: '期末' },
    { id: '202504M', name: '2025年4月月考', type: '月考' },
    { id: '202503M', name: '2025年3月月考', type: '月考' },
    { id: '202501F', name: '2025年期中考试', type: '期中' },
  ];

  // 生成成绩趋势数据
  const generateTrendData = () => {
    if (!selectedClass || !selectedSubject) return [];

    return exams.map(exam => {
      const baseScore = 70 + Math.floor(Math.random() * 10); // 基础分70-80
      const classAvg = baseScore + Math.floor(Math.random() * 5); // 班级平均分
      const gradeAvg = baseScore + Math.floor(Math.random() * 5); // 年级平均分
      const maxScore = Math.min(classAvg + 15 + Math.floor(Math.random() * 5), 100); // 最高分
      const minScore = Math.max(classAvg - 20 - Math.floor(Math.random() * 5), 0); // 最低分

      return {
        examName: exam.name,
        classAvg,
        gradeAvg,
        maxScore,
        minScore,
        type: exam.type
      };
    }).reverse(); // 反转数组使最新的考试显示在右侧
  };

  // 生成分数段分布数据
  const generateDistributionData = () => {
    if (!selectedClass || !selectedSubject) return [];

    const total = 50; // 班级总人数
    const distribution = [
      { range: '90-100分', count: Math.floor(Math.random() * 8) + 2 }, // 2-10人
      { range: '80-89分', count: Math.floor(Math.random() * 10) + 10 }, // 10-20人
      { range: '70-79分', count: Math.floor(Math.random() * 10) + 10 }, // 10-20人
      { range: '60-69分', count: Math.floor(Math.random() * 8) + 5 }, // 5-13人
    ];

    // 计算不及格人数（确保总人数为50）
    const passedCount = distribution.reduce((sum, item) => sum + item.count, 0);
    distribution.push({ range: '0-59分', count: total - passedCount });

    return distribution;
  };

  // 生成学生排名数据
  const generateRankingData = () => {
    if (!selectedClass || !selectedSubject) return [];

    const rankings = [];
    for (let i = 1; i <= 50; i++) {
      const baseScore = 100 - Math.floor(i / 50 * 40); // 分数范围60-100
      const currentScore = baseScore + Math.floor(Math.random() * 5); // 当前分数
      const lastScore = currentScore + Math.floor(Math.random() * 10) - 5; // 上次分数
      const gradeRank = i + Math.floor(Math.random() * 20) - 10; // 年级排名
      
      rankings.push({
        key: i,
        rank: i,
        name: generateStudentName(),
        currentScore,
        lastScore,
        gradeRank,
        trend: currentScore - lastScore
      });
    }

    return rankings;
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

  // 处理学科选择
  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };

  // 计算统计数据
  const statistics = useMemo(() => {
    if (!selectedClass || !selectedSubject) return null;

    const trendData = generateTrendData();
    const latestExam = trendData[trendData.length - 1];
    const previousExam = trendData[trendData.length - 2];
    
    const classAvgTrend = latestExam.classAvg - previousExam.classAvg;
    const gradeAvgTrend = latestExam.gradeAvg - previousExam.gradeAvg;

    return {
      classAvg: latestExam.classAvg,
      gradeAvg: latestExam.gradeAvg,
      maxScore: latestExam.maxScore,
      minScore: latestExam.minScore,
      classAvgTrend,
      gradeAvgTrend
    };
  }, [selectedClass, selectedSubject]);

  // 排名表格列配置
  const rankColumns = [
    {
      title: '班级排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      fixed: 'left',
      render: (rank) => <Tag color="blue">第 {rank} 名</Tag>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: '当前分数',
      dataIndex: 'currentScore',
      key: 'currentScore',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '上次分数',
      dataIndex: 'lastScore',
      key: 'lastScore',
      width: 100,
    },
    {
      title: '分数趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 100,
      render: (trend) => (
        <Space>
          {trend > 0 ? (
            <Tag color="success" icon={<RiseOutlined />}>+{trend}</Tag>
          ) : trend < 0 ? (
            <Tag color="error" icon={<FallOutlined />}>{trend}</Tag>
          ) : (
            <Tag>0</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '年级排名',
      dataIndex: 'gradeRank',
      key: 'gradeRank',
      width: 100,
      render: (rank) => <Tag>第 {rank} 名</Tag>,
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
        </Row>
      </Card>

      {!selectedClass || !selectedSubject ? (
        <Alert
          message="请选择班级和学科"
          description="请先选择要分析的班级和学科"
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
                    value={statistics.classAvg}
                    suffix="分"
                    prefix={<LineChartOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <Space>
                    {statistics.classAvgTrend > 0 ? (
                      <Tag color="success" icon={<RiseOutlined />}>
                        较上次提升 {statistics.classAvgTrend.toFixed(1)} 分
                      </Tag>
                    ) : (
                      <Tag color="error" icon={<FallOutlined />}>
                        较上次下降 {Math.abs(statistics.classAvgTrend).toFixed(1)} 分
                      </Tag>
                    )}
                  </Space>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="年级平均分"
                    value={statistics.gradeAvg}
                    suffix="分"
                    prefix={<BarChartOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <Space>
                    {statistics.gradeAvgTrend > 0 ? (
                      <Tag color="success" icon={<RiseOutlined />}>
                        较上次提升 {statistics.gradeAvgTrend.toFixed(1)} 分
                      </Tag>
                    ) : (
                      <Tag color="error" icon={<FallOutlined />}>
                        较上次下降 {Math.abs(statistics.gradeAvgTrend).toFixed(1)} 分
                      </Tag>
                    )}
                  </Space>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="最高分"
                    value={statistics.maxScore}
                    suffix="分"
                    prefix={<TrophyOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div>最低分：{statistics.minScore}分</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="分差"
                    value={statistics.maxScore - statistics.minScore}
                    suffix="分"
                    prefix={<TeamOutlined />}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div>优良率：{((statistics.maxScore - 80) / 20 * 100).toFixed(1)}%</div>
                </Card>
              </Col>
            </Row>
          )}

          {/* 成绩趋势图 */}
          <Card title="成绩趋势分析" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateTrendData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="examName" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="classAvg"
                  name="班级平均分"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="gradeAvg"
                  name="年级平均分"
                  stroke="#52c41a"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="maxScore"
                  name="最高分"
                  stroke="#faad14"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="minScore"
                  name="最低分"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* 分数段分布图 */}
          <Card title="分数段分布" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generateDistributionData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip />
                <Bar
                  dataKey="count"
                  name="人数"
                  fill="#1890ff"
                  label={{ position: 'top' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 学生排名表 */}
          <Card title="学生成绩排名">
            <Table
              columns={rankColumns}
              dataSource={generateRankingData()}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 名学生`,
              }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default ScoreAnalysis; 