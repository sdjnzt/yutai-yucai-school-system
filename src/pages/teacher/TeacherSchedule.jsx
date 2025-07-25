import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Select,
  Button,
  Modal,
  Form,
  Space,
  Tag,
  message,
  Row,
  Col,
  Tooltip,
  Badge,
  Descriptions,
  Alert,
  Typography,
  Divider,
  Statistic
} from 'antd';
import {
  EditOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  EnvironmentOutlined,
  PrinterOutlined,
  DownloadOutlined,
  SwapOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const TeacherSchedule = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState('1');

  // 生成教师数据
  const teachers = [
    // 语文教师
    { id: 'T0001', name: '张明', subject: '语文', title: '高级教师' },
    { id: 'T0002', name: '李芳', subject: '语文', title: '一级教师' },
    { id: 'T0003', name: '王静', subject: '语文', title: '高级教师' },
    { id: 'T0004', name: '刘洋', subject: '语文', title: '二级教师' },
    // 数学教师
    { id: 'T0005', name: '陈强', subject: '数学', title: '高级教师' },
    { id: 'T0006', name: '杨丽', subject: '数学', title: '一级教师' },
    { id: 'T0007', name: '赵伟', subject: '数学', title: '高级教师' },
    { id: 'T0008', name: '孙敏', subject: '数学', title: '二级教师' },
    // 英语教师
    { id: 'T0009', name: '周婷', subject: '英语', title: '高级教师' },
    { id: 'T0010', name: '吴超', subject: '英语', title: '一级教师' },
    { id: 'T0011', name: '郑阳', subject: '英语', title: '高级教师' },
    { id: 'T0012', name: '黄莉', subject: '英语', title: '二级教师' },
    // 物理教师
    { id: 'T0013', name: '徐磊', subject: '物理', title: '高级教师' },
    { id: 'T0014', name: '马涛', subject: '物理', title: '一级教师' },
    { id: 'T0015', name: '胡军', subject: '物理', title: '二级教师' },
    // 化学教师
    { id: 'T0016', name: '朱琳', subject: '化学', title: '高级教师' },
    { id: 'T0017', name: '郭静', subject: '化学', title: '一级教师' },
    { id: 'T0018', name: '何勇', subject: '化学', title: '二级教师' },
    // 生物教师
    { id: 'T0019', name: '高峰', subject: '生物', title: '高级教师' },
    { id: 'T0020', name: '林娜', subject: '生物', title: '一级教师' },
    { id: 'T0021', name: '谢明', subject: '生物', title: '二级教师' },
    // 政治教师
    { id: 'T0022', name: '韩雪', subject: '政治', title: '高级教师' },
    { id: 'T0023', name: '曾艳', subject: '政治', title: '一级教师' },
    { id: 'T0024', name: '汪洋', subject: '政治', title: '二级教师' },
    // 历史教师
    { id: 'T0025', name: '唐华', subject: '历史', title: '高级教师' },
    { id: 'T0026', name: '邓超', subject: '历史', title: '一级教师' },
    { id: 'T0027', name: '冯敏', subject: '历史', title: '二级教师' },
    // 地理教师
    { id: 'T0028', name: '彭勇', subject: '地理', title: '高级教师' },
    { id: 'T0029', name: '梁静', subject: '地理', title: '一级教师' },
    { id: 'T0030', name: '程阳', subject: '地理', title: '二级教师' },
  ];

  // 按学科对教师进行分组
  const teacherGroups = teachers.reduce((groups, teacher) => {
    if (!groups[teacher.subject]) {
      groups[teacher.subject] = [];
    }
    groups[teacher.subject].push(teacher);
    return groups;
  }, {});

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
  const generateScheduleData = (teacherId) => {
    const classes = ['高一(1)班', '高一(2)班', '高二(1)班', '高二(2)班', '高三(1)班', '高三(2)班'];
    const rooms = ['A101', 'A102', 'A103', 'A201', 'A202', 'A203'];
    const schedule = [];

    periods.forEach(period => {
      const row = {
        key: period.id,
        period: period.name,
        time: period.time
      };

      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        // 70%概率有课
        if (Math.random() < 0.7) {
          const classIndex = Math.floor(Math.random() * classes.length);
          row[day] = {
            class: classes[classIndex],
            room: rooms[Math.floor(Math.random() * rooms.length)],
            subject: teachers.find(t => t.id === teacherId)?.subject || '语文'
          };
        }
      });

      schedule.push(row);
    });

    return schedule;
  };

  // 处理教师选择
  const handleTeacherChange = (value) => {
    setSelectedTeacher(value);
    setCurrentSchedule(generateScheduleData(value));
  };

  // 处理周次选择
  const handleWeekChange = (value) => {
    setSelectedWeek(value);
    setCurrentSchedule(generateScheduleData(selectedTeacher));
  };

  // 处理编辑课程
  const handleEdit = (record, day) => {
    const course = record[day];
    form.setFieldsValue({
      period: record.period,
      day,
      class: course?.class,
      room: course?.room,
      subject: course?.subject
    });
    setVisible(true);
  };

  // 处理打印
  const handlePrint = () => {
    message.success('正在打印课程表');
  };

  // 处理导出
  const handleExport = () => {
    message.success('课程表已导出');
  };

  // 表格列配置
  const columns = [
    {
      title: '节次',
      dataIndex: 'period',
      key: 'period',
      fixed: 'left',
      width: 100,
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
      render: (course, record) => renderCourse(course, record, 'monday'),
    },
    {
      title: '星期二',
      dataIndex: 'tuesday',
      key: 'tuesday',
      render: (course, record) => renderCourse(course, record, 'tuesday'),
    },
    {
      title: '星期三',
      dataIndex: 'wednesday',
      key: 'wednesday',
      render: (course, record) => renderCourse(course, record, 'wednesday'),
    },
    {
      title: '星期四',
      dataIndex: 'thursday',
      key: 'thursday',
      render: (course, record) => renderCourse(course, record, 'thursday'),
    },
    {
      title: '星期五',
      dataIndex: 'friday',
      key: 'friday',
      render: (course, record) => renderCourse(course, record, 'friday'),
    }
  ];

  // 渲染课程单元格
  const renderCourse = (course, record, day) => {
    if (!course) {
      return (
        <Button
          type="dashed"
          size="small"
          onClick={() => handleEdit(record, day)}
          style={{ width: '100%', height: '100%' }}
        >
          空闲
        </Button>
      );
    }

    return (
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => handleEdit(record, day)}
      >
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <div>
            <Tag color="blue">{course.class}</Tag>
          </div>
          <div>
            <Space size={4}>
              <EnvironmentOutlined style={{ color: '#999' }} />
              <span>{course.room}</span>
            </Space>
          </div>
          <div>
            <Tag color="green">{course.subject}</Tag>
          </div>
        </Space>
      </div>
    );
  };

  // 计算课程统计信息
  const calculateStatistics = () => {
    if (!currentSchedule) return null;

    let totalClasses = 0;
    let classesByDay = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0
    };

    currentSchedule.forEach(row => {
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        if (row[day]) {
          totalClasses++;
          classesByDay[day]++;
        }
      });
    });

    return {
      totalClasses,
      classesByDay,
      averagePerDay: (totalClasses / 5).toFixed(1)
    };
  };

  const stats = calculateStatistics();

  return (
    <div>
      {/* 顶部控制栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Select
              placeholder="请选择教师"
              style={{ width: '100%' }}
              onChange={handleTeacherChange}
              value={selectedTeacher}
              showSearch
              optionFilterProp="children"
            >
              {Object.entries(teacherGroups).map(([subject, subjectTeachers]) => (
                <Select.OptGroup key={subject} label={`${subject}教师`}>
                  {subjectTeachers.map(teacher => (
                    <Select.Option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.title})
                    </Select.Option>
                  ))}
                </Select.OptGroup>
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

      {!selectedTeacher && (
        <Alert
          message="请选择教师"
          description="请先选择要查看课表的教师"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {selectedTeacher && currentSchedule && (
        <>
          {/* 课程统计 */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总课时数"
                  value={stats.totalClasses}
                  suffix="节"
                  prefix={<ClockCircleOutlined />}
                />
                <Divider style={{ margin: '12px 0' }} />
                <div>平均每天 {stats.averagePerDay} 节课</div>
              </Col>
              <Col span={16}>
                <Title level={5}>每日课时分布</Title>
                <Space wrap>
                  {Object.entries(stats.classesByDay).map(([day, count]) => (
                    <Tag key={day} color="blue">
                      {day === 'monday' ? '周一' :
                       day === 'tuesday' ? '周二' :
                       day === 'wednesday' ? '周三' :
                       day === 'thursday' ? '周四' : '周五'}: {count}节
                    </Tag>
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 课程表 */}
          <Card>
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

      {/* 编辑课程弹窗 */}
      <Modal
        title="编辑课程"
        open={visible}
        onOk={() => {
          form.validateFields().then(values => {
            console.log('Form values:', values);
            setVisible(false);
            message.success('保存成功');
          });
        }}
        onCancel={() => setVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="period"
                label="节次"
                rules={[{ required: true }]}
              >
                <Select disabled>
                  {periods.map(p => (
                    <Select.Option key={p.id} value={p.name}>
                      {p.name} ({p.time})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="day"
                label="星期"
                rules={[{ required: true }]}
              >
                <Select disabled>
                  <Select.Option value="monday">星期一</Select.Option>
                  <Select.Option value="tuesday">星期二</Select.Option>
                  <Select.Option value="wednesday">星期三</Select.Option>
                  <Select.Option value="thursday">星期四</Select.Option>
                  <Select.Option value="friday">星期五</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="class"
                label="班级"
                rules={[{ required: true, message: '请选择班级' }]}
              >
                <Select placeholder="请选择班级">
                  <Select.Option value="高一(1)班">高一(1)班</Select.Option>
                  <Select.Option value="高一(2)班">高一(2)班</Select.Option>
                  <Select.Option value="高二(1)班">高二(1)班</Select.Option>
                  <Select.Option value="高二(2)班">高二(2)班</Select.Option>
                  <Select.Option value="高三(1)班">高三(1)班</Select.Option>
                  <Select.Option value="高三(2)班">高三(2)班</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="room"
                label="教室"
                rules={[{ required: true, message: '请选择教室' }]}
              >
                <Select placeholder="请选择教室">
                  <Select.Option value="A101">A101</Select.Option>
                  <Select.Option value="A102">A102</Select.Option>
                  <Select.Option value="A103">A103</Select.Option>
                  <Select.Option value="A201">A201</Select.Option>
                  <Select.Option value="A202">A202</Select.Option>
                  <Select.Option value="A203">A203</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="subject"
            label="课程"
            rules={[{ required: true, message: '请选择课程' }]}
          >
            <Select disabled>
              {teachers.map(t => (
                <Select.Option key={t.id} value={t.subject}>
                  {t.subject}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherSchedule; 