import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Select,
  Button,
  Space,
  Row,
  Col,
  Tag,
  message,
  Alert,
  Typography,
  Tooltip,
  Badge,
  Divider,
  Statistic
} from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  BookOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const CourseSchedule = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState('1');

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
    { id: 'G2C1', name: '高二(1)班', type: '文科' },
    { id: 'G2C2', name: '高二(2)班', type: '文科' },
    { id: 'G2C3', name: '高二(3)班', type: '文科' },
    { id: 'G2C4', name: '高二(4)班', type: '文科' },
    { id: 'G2C5', name: '高二(5)班', type: '理科' },
    { id: 'G2C6', name: '高二(6)班', type: '理科' },
    { id: 'G2C7', name: '高二(7)班', type: '理科' },
    { id: 'G2C8', name: '高二(8)班', type: '理科' },
    { id: 'G3C1', name: '高三(1)班', type: '文科' },
    { id: 'G3C2', name: '高三(2)班', type: '文科' },
    { id: 'G3C3', name: '高三(3)班', type: '文科' },
    { id: 'G3C4', name: '高三(4)班', type: '文科' },
    { id: 'G3C5', name: '高三(5)班', type: '理科' },
    { id: 'G3C6', name: '高三(6)班', type: '理科' },
    { id: 'G3C7', name: '高三(7)班', type: '理科' },
    { id: 'G3C8', name: '高三(8)班', type: '理科' },
  ];

  // 生成课程时间段
  const periods = [
    { id: 1, name: '第一节', time: '08:00-08:45' },
    { id: 2, name: '第二节', time: '08:55-09:40' },
    { id: 3, name: '第三节', time: '10:00-10:45' },
    { id: 4, name: '第四节', time: '10:55-11:40' },
    { id: 5, name: '第五节', time: '14:00-14:45' },
    { id: 6, name: '第六节', time: '14:55-15:40' },
    { id: 7, name: '第七节', time: '16:00-16:45' },
    { id: 8, name: '第八节', time: '16:55-17:40' }
  ];

  // 生成课程数据
  const generateScheduleData = (classId) => {
    if (!classId) return [];

    const selectedClassData = classes.find(c => c.id === classId);
    const isArtClass = selectedClassData.type === '文科';
    
    const subjects = isArtClass ? 
      ['语文', '数学', '英语', '政治', '历史', '地理'] :
      ['语文', '数学', '英语', '物理', '化学', '生物'];
    
    const rooms = ['A101', 'A102', 'A103', 'A201', 'A202', 'A203'];
    const teachers = {
      '语文': '张明',
      '数学': '李芳',
      '英语': '王静',
      '物理': '陈强',
      '化学': '杨丽',
      '生物': '赵伟',
      '政治': '周婷',
      '历史': '吴超',
      '地理': '郑阳'
    };

    const schedule = [];

    periods.forEach(period => {
      const row = {
        key: period.id,
        period: period.name,
        time: period.time
      };

      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        // 80%概率有课
        if (Math.random() < 0.8) {
          const subject = subjects[Math.floor(Math.random() * subjects.length)];
          row[day] = {
            subject,
            teacher: teachers[subject],
            room: rooms[Math.floor(Math.random() * rooms.length)]
          };
        }
      });

      schedule.push(row);
    });

    return schedule;
  };

  // 处理班级选择
  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  // 处理周次选择
  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  // 处理打印
  const handlePrint = () => {
    message.success('正在打印课程表');
  };

  // 处理导出
  const handleExport = () => {
    message.success('课程表已导出');
  };

  // 生成当前课表数据
  const currentSchedule = useMemo(() => {
    return selectedClass ? generateScheduleData(selectedClass) : [];
  }, [selectedClass, selectedWeek]);

  // 计算课程统计信息
  const calculateStatistics = () => {
    if (!currentSchedule.length) return null;

    let totalClasses = 0;
    let subjectCount = {};
    let teacherCount = new Set();
    let roomCount = new Set();

    currentSchedule.forEach(row => {
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        if (row[day]) {
          totalClasses++;
          subjectCount[row[day].subject] = (subjectCount[row[day].subject] || 0) + 1;
          teacherCount.add(row[day].teacher);
          roomCount.add(row[day].room);
        }
      });
    });

    return {
      totalClasses,
      subjectCount,
      teacherCount: teacherCount.size,
      roomCount: roomCount.size,
      averagePerDay: (totalClasses / 5).toFixed(1)
    };
  };

  // 表格列配置
  const columns = [
    {
      title: '节次',
      dataIndex: 'period',
      key: 'period',
      fixed: 'left',
      width: 120,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.time}</div>
        </div>
      ),
    },
    {
      title: '星期一',
      dataIndex: 'monday',
      key: 'monday',
      render: (course) => renderCourse(course),
    },
    {
      title: '星期二',
      dataIndex: 'tuesday',
      key: 'tuesday',
      render: (course) => renderCourse(course),
    },
    {
      title: '星期三',
      dataIndex: 'wednesday',
      key: 'wednesday',
      render: (course) => renderCourse(course),
    },
    {
      title: '星期四',
      dataIndex: 'thursday',
      key: 'thursday',
      render: (course) => renderCourse(course),
    },
    {
      title: '星期五',
      dataIndex: 'friday',
      key: 'friday',
      render: (course) => renderCourse(course),
    }
  ];

  // 渲染课程单元格
  const renderCourse = (course) => {
    if (!course) {
      return <div style={{ height: '60px', textAlign: 'center', color: '#999' }}>空闲</div>;
    }

    return (
      <div style={{ padding: '4px 0' }}>
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <div>
            <Tag color="blue">{course.subject}</Tag>
          </div>
          <div>
            <Space size={4}>
              <UserOutlined style={{ color: '#999' }} />
              <span>{course.teacher}</span>
            </Space>
          </div>
          <div>
            <Space size={4}>
              <EnvironmentOutlined style={{ color: '#999' }} />
              <span>{course.room}</span>
            </Space>
          </div>
        </Space>
      </div>
    );
  };

  const stats = calculateStatistics();
  const selectedClassData = selectedClass ? classes.find(c => c.id === selectedClass) : null;

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
          <Col span={4}>
            <Select
              placeholder="请选择周次"
              style={{ width: '100%' }}
              onChange={handleWeekChange}
              value={selectedWeek}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(week => (
                <Select.Option key={week} value={String(week)}>
                  第{week}周
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                打印课表
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出课表
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {!selectedClass && (
        <Alert
          message="请选择班级"
          description="请先选择要查看课表的班级"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {selectedClass && stats && (
        <>
          {/* 课程统计 */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总课时数"
                  value={stats.totalClasses}
                  suffix="节"
                  prefix={<ClockCircleOutlined />}
                />
                <Divider style={{ margin: '12px 0' }} />
                <div>平均每天 {stats.averagePerDay} 节课</div>
              </Col>
              <Col span={6}>
                <Statistic
                  title="任课教师"
                  value={stats.teacherCount}
                  suffix="名"
                  prefix={<TeamOutlined />}
                />
                <Divider style={{ margin: '12px 0' }} />
                <div>使用教室 {stats.roomCount} 间</div>
              </Col>
              <Col span={12}>
                <Title level={5}>课程分布</Title>
                <Space wrap>
                  {Object.entries(stats.subjectCount).map(([subject, count]) => (
                    <Tag key={subject} color="blue">
                      {subject}: {count}节
                    </Tag>
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 课程表 */}
          <Card
            title={
              <Space>
                <span>{selectedClassData.name}课程表</span>
                <Tag color={selectedClassData.type === '文科' ? 'blue' : 'green'}>
                  {selectedClassData.type}
                </Tag>
                <Tag color="orange">第{selectedWeek}周</Tag>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={currentSchedule}
              pagination={false}
              scroll={{ x: 1200 }}
              bordered
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default CourseSchedule; 