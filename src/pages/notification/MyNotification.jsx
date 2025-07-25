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
  List,
  Tooltip,
  Popconfirm,
  message
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
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const MyNotification = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState(null);

  // 生成我的公告数据
  const generateMyNotifications = () => {
    const notifications = [
      {
        type: '通知',
        title: '关于组织2025级新生入学教育的通知',
        content: `各位老师：
为做好2025级新生入学教育工作，现将有关事项通知如下：

一、时间安排：
1. 报到时间：2025年8月25日
2. 入学教育：8月26日-8月30日
3. 开学典礼：8月31日上午

二、教育内容：
1. 学校概况介绍
2. 规章制度学习
3. 安全教育培训
4. 心理健康讲座
5. 学科学习指导
6. 生涯规划辅导

三、工作要求：
1. 各班主任要提前做好班级准备工作
2. 各任课教师准备学科导学材料
3. 做好防疫和安全保障工作

四、注意事项：
1. 严格遵守作息时间
2. 认真填写相关表格
3. 及时收集学生反馈

请各位老师高度重视，认真准备，确保新生入学教育工作顺利进行。`,
        publisher: '张志远',
        publisherTitle: '教务主任',
        department: '教务处',
        publishTime: '2025-07-20 09:30:00',
        isTop: true,
        readCount: 156,
        status: '已发布',
        attachments: ['新生入学教育方案.pdf', '入学教育日程表.xlsx'],
        recipients: '全体教师'
      },
      {
        type: '通知',
        title: '关于开展期末教学工作总结的通知',
        content: `各位教师：
2025学年第一学期即将结束，为做好期末教学工作总结，现将有关要求通知如下：

一、总结内容：
1. 教学工作完成情况
2. 学生学习情况分析
3. 教学特色与创新
4. 存在问题与建议
5. 下学期工作计划

二、提交要求：
1. 字数：不少于3000字
2. 格式：详见附件模板
3. 截止时间：7月30日

三、重点说明：
1. 客观分析教学成效
2. 总结教学经验教训
3. 提出改进建议

请各位教师按时提交总结材料。`,
        publisher: '张志远',
        publisherTitle: '教务主任',
        department: '教务处',
        publishTime: '2025-07-15 14:20:00',
        isTop: false,
        readCount: 89,
        status: '已发布',
        attachments: ['教学工作总结模板.docx'],
        recipients: '全体教师'
      },
      {
        type: '公告',
        title: '关于评选2025学年优秀教研组的公告（草稿）',
        content: `各教研组：
为表彰先进，促进教研工作深入开展，拟开展2025学年优秀教研组评选工作。

一、评选范围：
全校各学科教研组

二、评选标准：
1. 教研活动开展情况
2. 教学改革创新成果
3. 学生学业水平提升
4. 教师专业发展情况
5. 教研成果推广应用

三、评选程序：
1. 教研组自荐
2. 学科组推荐
3. 教务处审核
4. 学校评审

四、奖励措施：
1. 授予"优秀教研组"称号
2. 颁发奖牌和证书
3. 给予教研经费奖励

请各教研组认真准备，积极参与。`,
        publisher: '张志远',
        publisherTitle: '教务主任',
        department: '教务处',
        publishTime: '2025-07-10 11:00:00',
        isTop: false,
        readCount: 0,
        status: '草稿',
        attachments: ['评选方案（草稿）.docx'],
        recipients: '全体教师'
      },
      {
        type: '通知',
        title: '关于征集教学改革建议的通知',
        content: `各位教师：
为进一步提升教育教学质量，现面向全体教师征集教学改革建议。

一、征集内容：
1. 课堂教学改革
2. 作业布置优化
3. 考试评价方式
4. 教学管理机制
5. 教师培训需求

二、提交方式：
1. 填写《教学改革建议表》
2. 发送至教务处邮箱
3. 或直接在教务系统提交

三、时间安排：
征集时间：7月25日-8月10日

四、注意事项：
1. 建议要具体可行
2. 注重实效性
3. 可提供案例支撑

欢迎各位教师积极建言献策。`,
        publisher: '张志远',
        publisherTitle: '教务主任',
        department: '教务处',
        publishTime: '2025-07-05 16:45:00',
        isTop: false,
        readCount: 167,
        status: '已发布',
        attachments: ['教学改革建议表.docx'],
        recipients: '全体教师'
      },
      {
        type: '公告',
        title: '关于组织暑期教师培训的公告',
        content: `各位教师：
为提升教师专业素养，学校将组织2025年暑期教师培训。

一、培训内容：
1. 新课程标准解读
2. 教学设计创新
3. 信息技术应用
4. 课题研究方法
5. 班级管理技巧

二、培训安排：
1. 时间：8月1日-8月10日
2. 地点：学校报告厅
3. 方式：专家讲座+研讨交流

三、报名方式：
1. 登录教师培训平台
2. 选择培训课程
3. 提交报名表

四、其他说明：
1. 培训计入继续教育学时
2. 提供培训证书
3. 报销培训费用

请各位教师合理安排时间，积极参加培训。`,
        publisher: '张志远',
        publisherTitle: '教务主任',
        department: '教务处',
        publishTime: '2025-07-01 10:30:00',
        isTop: false,
        readCount: 245,
        status: '已发布',
        attachments: ['培训方案.pdf', '报名表.docx'],
        recipients: '全体教师'
      },
      {
        type: '通知',
        title: '关于开展教师课堂教学评比活动的通知（草稿）',
        content: `各位教师：
为促进教师专业成长，提高课堂教学质量，拟开展教师课堂教学评比活动。

一、参与对象：
全校专任教师

二、评比内容：
1. 教学设计
2. 课堂实施
3. 教学效果
4. 创新亮点

三、评比流程：
1. 初赛：各教研组推荐
2. 复赛：学科组评选
3. 决赛：全校观摩

四、奖励措施：
1. 评选一、二、三等奖
2. 颁发获奖证书
3. 给予教学奖励

具体实施方案待定。`,
        publisher: '张志远',
        publisherTitle: '教务主任',
        department: '教务处',
        publishTime: '2025-06-28 15:20:00',
        isTop: false,
        readCount: 0,
        status: '草稿',
        attachments: ['评比方案（草稿）.docx'],
        recipients: '全体教师'
      }
    ];

    return notifications.sort((a, b) => {
      if (a.status !== b.status) return a.status === '草稿' ? -1 : 1;
      if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
      return dayjs(b.publishTime).valueOf() - dayjs(a.publishTime).valueOf();
    });
  };

  // 筛选数据
  const filteredNotifications = useMemo(() => {
    const allNotifications = generateMyNotifications();
    if (!searchParams) return allNotifications;

    return allNotifications.filter(notification => {
      const matchKeyword = !searchParams.keyword || 
        notification.title.includes(searchParams.keyword) ||
        notification.content.includes(searchParams.keyword);

      const matchType = !searchParams.type || 
        notification.type === searchParams.type;

      const matchStatus = !searchParams.status || 
        notification.status === searchParams.status;

      const matchDateRange = !searchParams.dateRange || 
        (!searchParams.dateRange[0] || dayjs(notification.publishTime).isAfter(searchParams.dateRange[0], 'day')) &&
        (!searchParams.dateRange[1] || dayjs(notification.publishTime).isBefore(searchParams.dateRange[1], 'day'));

      return matchKeyword && matchType && matchStatus && matchDateRange;
    });
  }, [searchParams]);

  // 统计数据
  const statistics = useMemo(() => {
    const data = filteredNotifications;
    return {
      total: data.length,
      published: data.filter(r => r.status === '已发布').length,
      draft: data.filter(r => r.status === '草稿').length,
      totalRead: data.reduce((sum, item) => sum + item.readCount, 0)
    };
  }, [filteredNotifications]);

  // 处理查看详情
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    message.success('删除成功');
  };

  // 处理编辑
  const handleEdit = (record) => {
    console.log('Edit record:', record);
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '已发布' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<FileTextOutlined />} onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条公告吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={4}>我的公告</Title>

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
                title="已发布"
                value={statistics.published}
                valueStyle={{ color: '#52c41a' }}
                prefix={<NotificationOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="草稿箱"
                value={statistics.draft}
                valueStyle={{ color: '#faad14' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总阅读量"
                value={statistics.totalRead}
                prefix={<EyeOutlined style={{ color: '#722ed1' }} />}
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
            <Form.Item name="status">
              <Select
                placeholder="发布状态"
                style={{ width: 120 }}
                allowClear
              >
                <Select.Option value="已发布">已发布</Select.Option>
                <Select.Option value="草稿">草稿</Select.Option>
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
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailVisible(false);
              handleEdit(selectedRecord);
            }}
          >
            编辑
          </Button>
        ]}
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
                  <Divider type="vertical" />
                  <Tag color={selectedRecord.status === '已发布' ? 'success' : 'default'}>
                    {selectedRecord.status}
                  </Tag>
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

export default MyNotification; 