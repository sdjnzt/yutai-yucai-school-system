import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Statistic,
  Form,
  Input,
  Select,
  DatePicker,
  Badge,
  Tooltip,
  List,
  Avatar
} from 'antd';
import {
  NotificationOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  PushpinOutlined,
  FileTextOutlined,
  BellOutlined,
  TeamOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const NotificationList = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState(null);

  // 生成公告数据
  const generateNotifications = () => {
    const notifications = [
      {
        type: '通知',
        title: '关于2025学年第一学期期末考试安排的通知',
        content: `各位老师、同学：
根据学校教学安排，2025学年第一学期期末考试定于2025年7月1日至7月5日进行。现将有关事项通知如下：

一、考试时间安排：
1. 高三年级：
   - 7月1日：语文（上午）、英语（下午）
   - 7月2日：数学（上午）、文科综合/理科综合（下午）
2. 高一、高二年级：
   - 7月3日：语文（上午）、英语（下午）
   - 7月4日：数学（上午）、选考科目（下午）
   - 7月5日：其他科目

二、考试要求：
1. 各班主任要做好考前动员，强调考试纪律。
2. 任课教师要认真组织复习，不得划范围、暗示考题。
3. 学生要端正考试态度，严格遵守考场规则。

三、其他事项：
1. 考试期间保持教室通风，做好防疫工作。
2. 考试结束后一周内完成阅卷及成绩录入。
3. 考试成绩将在7月15日前通过教务系统公布。

请各位师生认真准备，确保考试工作顺利进行。`,
        department: '教务处',
        publisher: '张志远',
        publisherTitle: '教务主任',
        publishTime: '2025-06-20 10:00:00',
        isTop: true,
        readCount: 1258,
        attachments: ['期末考试安排表.xlsx', '考场规则说明.pdf'],
        recipients: '全体师生'
      },
      {
        type: '公告',
        title: '关于表彰2025届高考优秀教师的决定',
        content: `各位教师：
在刚刚结束的2025届高考中，我校取得了优异成绩。为表彰在教学工作中表现突出的教师，经学校研究决定，对以下教师予以表彰：

一、特等功：
1. 张明华（语文组）：高考平均分超过省重点线15分
2. 李国强（数学组）：重点班100%达到一本线
3. 王晓燕（英语组）：四个班级平均分列市第一

二、一等功：
1. 陈学文（物理组）：实验班全部达到重点线
2. 刘志远（化学组）：及格率100%，优秀率85%
（以下略）

以上教师将获得：
1. 记功嘉奖
2. 优秀教师证书
3. 教学津贴奖励

希望全体教师以先进为榜样，在新学期再创佳绩！`,
        department: '校长办公室',
        publisher: '王建国',
        publisherTitle: '校长',
        publishTime: '2025-07-20 14:30:00',
        isTop: true,
        readCount: 865,
        attachments: ['表彰决定.pdf', '优秀教师名单.docx'],
        recipients: '全体教师'
      },
      {
        type: '通知',
        title: '关于开展2025年暑期校园维修工作的通知',
        content: `各位师生：
为改善教学环境，学校定于2025年7月28日至8月25日进行暑期校园维修改造工作，现将相关事项通知如下：

一、维修项目：
1. 教学楼：
   - 更换教室照明系统
   - 粉刷教室内墙
   - 维修课桌椅
2. 实验楼：
   - 升级物理、化学实验室设备
   - 改造通风系统
3. 运动场：
   - 翻新塑胶跑道
   - 维修篮球场地
4. 食堂：
   - 更新厨房设备
   - 扩建就餐区

二、施工安排：
1. 7月28日-8月5日：教学楼施工
2. 8月6日-8月15日：实验楼施工
3. 8月16日-8月25日：运动场施工
4. 全程进行食堂改造

三、注意事项：
1. 施工期间校园局部封闭，请勿入内
2. 如需到校办事，请提前与相关部门预约
3. 施工噪音可能影响周边居民，敬请谅解

开学前将对所有设施进行安全检查，确保正常使用。`,
        department: '总务处',
        publisher: '李国庆',
        publisherTitle: '总务主任',
        publishTime: '2025-07-15 09:00:00',
        isTop: false,
        readCount: 756,
        attachments: ['维修工程清单.pdf', '施工区域示意图.jpg'],
        recipients: '全体师生'
      },
      {
        type: '公告',
        title: '2025学年第一学期教师培训计划',
        content: `各位教师：
为提升教师队伍专业素养，特制定2025学年第一学期教师培训计划如下：

一、新教师岗前培训
时间：8月20日-8月25日
内容：
1. 教育教学理论
2. 班级管理实务
3. 教学技能训练
4. 师德师风建设

二、学科教师专项培训
时间：每周三下午
内容：
1. 新课标解读
2. 教学设计研讨
3. 课例分析
4. 考试命题技巧

三、信息技术应用培训
时间：每月第一个周六
内容：
1. 智慧课堂应用
2. 教学软件使用
3. 在线教学技能

四、心理健康培训
时间：每月第三个周五
内容：
1. 学生心理辅导
2. 压力管理
3. 沟通技巧

请各位教师合理安排时间，按时参加培训。`,
        department: '教务处',
        publisher: '张志远',
        publisherTitle: '教务主任',
        publishTime: '2025-07-10 11:30:00',
        isTop: false,
        readCount: 432,
        attachments: ['教师培训手册.pdf'],
        recipients: '全体教师'
      },
      {
        type: '通知',
        title: '关于组织学生参加2025年科技创新大赛的通知',
        content: `各位师生：
为培养学生创新能力，我校将组织参加2025年全市中学生科技创新大赛，现将相关事项通知如下：

一、比赛项目：
1. 科技发明制作
2. 软件编程应用
3. 科学调查研究
4. 创新实验设计

二、参赛要求：
1. 参赛对象：高一、高二年级学生
2. 组队方式：1-3人/组
3. 指导教师：1-2名

三、时间安排：
1. 报名截止：7月30日
2. 校内选拔：8月15日
3. 作品提交：8月30日
4. 比赛时间：9月15日

四、奖励措施：
1. 获奖作品计入学科竞赛成绩
2. 优秀指导教师予以嘉奖
3. 获奖证书可作为高考加分依据

请有意参赛的师生到教务处报名。`,
        department: '教务处',
        publisher: '刘明亮',
        publisherTitle: '实验室主任',
        publishTime: '2025-07-05 15:45:00',
        isTop: false,
        readCount: 645,
        attachments: ['大赛通知.pdf', '报名表.docx'],
        recipients: '全体师生'
      },
      {
        type: '公告',
        title: '关于开展2025年暑期学生社会实践活动的公告',
        content: `各位同学：
为丰富假期生活，培养社会实践能力，现将2025年暑期社会实践活动安排公告如下：

一、活动主题：
"知行合一，服务社会"

二、活动形式：
1. 志愿服务：
   - 社区服务
   - 环保行动
   - 关爱老人
2. 社会调查：
   - 民俗文化
   - 环境保护
   - 科技发展
3. 参观学习：
   - 博物馆
   - 科技馆
   - 历史遗迹

三、时间安排：
1. 报名时间：7月25日-7月30日
2. 活动时间：8月1日-8月20日
3. 总结提交：8月25日前

四、要求说明：
1. 至少参加一项活动
2. 完成活动日志
3. 提交总结报告
4. 准备成果展示

请同学们积极参与，丰富暑期生活！`,
        department: '学生处',
        publisher: '李国庆',
        publisherTitle: '学生主任',
        publishTime: '2025-07-01 16:20:00',
        isTop: false,
        readCount: 892,
        attachments: ['活动方案.pdf', '报名表.docx'],
        recipients: '全体学生'
      },
      {
        type: '通知',
        title: '关于做好防暑降温工作的通知',
        content: `各位师生：
鉴于近期持续高温天气，现就做好防暑降温工作通知如下：

一、教室管理：
1. 每天定时开窗通风
2. 及时维修空调设备
3. 保持饮水机正常供应

二、作息调整：
1. 体育课调整到上午前两节
2. 午休时间延长至14:30
3. 停止室外课程活动

三、防暑要求：
1. 注意防晒，戴好帽子
2. 多饮水，补充盐分
3. 出现不适及时就医

四、值班安排：
1. 医务室24小时值班
2. 各楼层配备降温药品
3. 建立应急处理机制

请各位注意防暑降温，确保健康安全。`,
        department: '学生处',
        publisher: '王建华',
        publisherTitle: '总务主任',
        publishTime: '2025-06-28 10:15:00',
        isTop: false,
        readCount: 567,
        attachments: ['防暑知识手册.pdf'],
        recipients: '全体师生'
      },
      {
        type: '公告',
        title: '关于评选2025学年优秀班主任的公告',
        content: `各位教师：
为表彰先进，树立典型，现开展2025学年优秀班主任评选工作，具体如下：

一、评选条件：
1. 班级管理：
   - 班风学风优良
   - 纪律表现突出
   - 卫生评比前列
2. 育人成效：
   - 学习成绩进步
   - 品德发展良好
   - 特长培养显著
3. 工作表现：
   - 责任心强
   - 工作创新
   - 家校沟通好

二、评选办法：
1. 班级考评（40%）
2. 教师互评（30%）
3. 学生评议（20%）
4. 领导评价（10%）

三、奖励措施：
1. 授予"优秀班主任"称号
2. 颁发荣誉证书
3. 享受专项津贴

请各班主任认真准备，展示工作成果。`,
        department: '教务处',
        publisher: '张志远',
        publisherTitle: '教务主任',
        publishTime: '2025-06-25 14:00:00',
        isTop: false,
        readCount: 345,
        attachments: ['评选方案.pdf', '申报表.docx'],
        recipients: '全体教师'
      },
      {
        type: '通知',
        title: '关于开展实验室安全大检查的通知',
        content: `各位师生：
为确保实验教学安全，定于近期开展实验室安全大检查，现将有关事项通知如下：

一、检查范围：
1. 物理实验室
2. 化学实验室
3. 生物实验室
4. 通用技术实验室

二、检查内容：
1. 安全设施：
   - 消防器材
   - 应急设备
   - 通风系统
2. 危险品管理：
   - 存储条件
   - 使用记录
   - 废弃物处理
3. 操作规范：
   - 实验指导
   - 安全制度
   - 应急预案

三、时间安排：
1. 自查：7月26日-27日
2. 复查：7月28日-29日
3. 整改：7月30日前

请各实验室做好准备工作。`,
        department: '实验室',
        publisher: '刘明亮',
        publisherTitle: '实验室主任',
        publishTime: '2025-06-22 09:30:00',
        isTop: false,
        readCount: 234,
        attachments: ['安全检查表.pdf'],
        recipients: '全体师生'
      },
      {
        type: '公告',
        title: '2025年暑假图书馆开放安排',
        content: `各位师生：
图书馆将在暑假期间安排开放，具体安排如下：

一、开放时间：
1. 7月8日-8月25日
2. 周一至周五：8:30-16:30
3. 周六：9:00-15:00
4. 周日闭馆

二、开放区域：
1. 一楼阅览室
2. 二楼自习室
3. 电子阅览室
4. 期刊阅览区

三、借阅规则：
1. 暑假期间可借10本
2. 借期延长至开学后
3. 离校前需清还图书

四、空调开放：
1. 上午：9:30-11:30
2. 下午：14:00-16:00

请遵守图书馆规章制度，安静阅读。`,
        department: '图书馆',
        publisher: '陈学文',
        publisherTitle: '图书馆主任',
        publishTime: '2025-06-20 11:00:00',
        isTop: false,
        readCount: 423,
        attachments: ['开放安排表.pdf'],
        recipients: '全体师生'
      }
    ];

    return notifications.sort((a, b) => {
      if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
      return dayjs(b.publishTime).valueOf() - dayjs(a.publishTime).valueOf();
    });
  };

  // 筛选数据
  const filteredNotifications = useMemo(() => {
    const allNotifications = generateNotifications();
    if (!searchParams) return allNotifications;

    return allNotifications.filter(notification => {
      const matchKeyword = !searchParams.keyword || 
        notification.title.includes(searchParams.keyword) ||
        notification.content.includes(searchParams.keyword);

      const matchType = !searchParams.type || 
        notification.type === searchParams.type;

      const matchDepartment = !searchParams.department || 
        notification.department === searchParams.department;

      const matchDateRange = !searchParams.dateRange || 
        (!searchParams.dateRange[0] || dayjs(notification.publishTime).isAfter(searchParams.dateRange[0], 'day')) &&
        (!searchParams.dateRange[1] || dayjs(notification.publishTime).isBefore(searchParams.dateRange[1], 'day'));

      return matchKeyword && matchType && matchDepartment && matchDateRange;
    });
  }, [searchParams]);

  // 统计数据
  const statistics = useMemo(() => {
    const data = filteredNotifications;
    return {
      total: data.length,
      topCount: data.filter(r => r.isTop).length,
      todayCount: data.filter(r => dayjs(r.publishTime).isSame(dayjs('2025-07-25'), 'day')).length,
      departmentCount: new Set(data.map(r => r.department)).size
    };
  }, [filteredNotifications]);

  // 处理查看详情
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 处理搜索
  const handleSearch = (values) => {
    setSearchParams(values);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams(null);
  };

  // 表格列配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 400,
      fixed: 'left',
      render: (text, record) => (
        <Space>
          {record.isTop && <PushpinOutlined style={{ color: '#f5222d' }} />}
          <Tag color={
            record.type === '通知' ? 'blue' :
            record.type === '公告' ? 'green' : 'orange'
          }>{record.type}</Tag>
          <Button type="link" onClick={() => handleViewDetail(record)} style={{ padding: 0, height: 'auto', whiteSpace: 'normal', textAlign: 'left' }}>
            {text}
          </Button>
          {record.attachments.length > 0 && (
            <Tooltip title={record.attachments.join(', ')}>
              <FileTextOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '发布人',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 150,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
          <Tag color="blue">{record.publisherTitle}</Tag>
        </Space>
      ),
    },
    {
      title: '发布部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (text) => (
        <Space>
          <ApartmentOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '接收对象',
      dataIndex: 'recipients',
      key: 'recipients',
      width: 120,
      render: (text) => (
        <Tag icon={<TeamOutlined />} color="purple">
          {text}
        </Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      key: 'readCount',
      width: 100,
      render: (text) => (
        <Space>
          <EyeOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={4}>通知公告</Title>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="公告总数"
                value={statistics.total}
                prefix={<NotificationOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="置顶公告"
                value={statistics.topCount}
                prefix={<PushpinOutlined style={{ color: '#f5222d' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日发布"
                value={statistics.todayCount}
                prefix={<BellOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="发布部门"
                value={statistics.departmentCount}
                prefix={<ApartmentOutlined style={{ color: '#722ed1' }} />}
                suffix="个"
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索表单 */}
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
          >
            <Form.Item name="keyword">
              <Input
                placeholder="搜索标题/内容"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                allowClear
              />
            </Form.Item>
            <Form.Item name="type">
              <Select
                placeholder="公告类型"
                style={{ width: 120 }}
                allowClear
              >
                <Select.Option value="通知">通知</Select.Option>
                <Select.Option value="公告">公告</Select.Option>
                <Select.Option value="文件">文件</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="department">
              <Select
                placeholder="发布部门"
                style={{ width: 160 }}
                allowClear
              >
                <Select.Option value="教务处">教务处</Select.Option>
                <Select.Option value="学生处">学生处</Select.Option>
                <Select.Option value="总务处">总务处</Select.Option>
                <Select.Option value="实验室">实验室</Select.Option>
                <Select.Option value="体育组">体育组</Select.Option>
                <Select.Option value="校长办公室">校长办公室</Select.Option>
                <Select.Option value="图书馆">图书馆</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange">
              <RangePicker 
                style={{ width: 240 }}
                allowClear
                placeholder={['开始日期', '结束日期']}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
                  筛选
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Table
          columns={columns}
          dataSource={filteredNotifications}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            {selectedRecord?.isTop && <PushpinOutlined style={{ color: '#f5222d' }} />}
            <Tag color={
              selectedRecord?.type === '通知' ? 'blue' :
              selectedRecord?.type === '公告' ? 'green' : 'orange'
            }>{selectedRecord?.type}</Tag>
            <span>{selectedRecord?.title}</span>
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <>
            <Alert
              message={
                <Space>
                  <Tag icon={<UserOutlined />} color="blue">
                    {selectedRecord.publisher}
                    <span style={{ marginLeft: 8 }}>{selectedRecord.publisherTitle}</span>
                  </Tag>
                  <Tag icon={<ApartmentOutlined />} color="purple">
                    {selectedRecord.department}
                  </Tag>
                  <Tag icon={<TeamOutlined />} color="cyan">
                    {selectedRecord.recipients}
                  </Tag>
                </Space>
              }
              description={
                <Space style={{ marginTop: 8 }}>
                  <CalendarOutlined /> {selectedRecord.publishTime}
                  <Divider type="vertical" />
                  <EyeOutlined /> {selectedRecord.readCount} 次阅读
                </Space>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Card>
              <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                {selectedRecord.content}
              </Paragraph>

              {selectedRecord.attachments.length > 0 && (
                <>
                  <Divider>附件</Divider>
                  <List
                    size="small"
                    dataSource={selectedRecord.attachments}
                    renderItem={item => (
                      <List.Item>
                        <Space>
                          <FileTextOutlined />
                          <a href="#">{item}</a>
                        </Space>
                      </List.Item>
                    )}
                  />
                </>
              )}
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default NotificationList; 