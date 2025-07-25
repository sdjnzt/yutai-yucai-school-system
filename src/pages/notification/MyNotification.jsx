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

  // 生成我的公告数据
  const generateMyNotifications = () => {
    const types = ['通知', '公告', '文件'];
    const titles = [
      '关于2025学年第一学期期末考试安排的通知',
      '关于举办校园艺术节的公告',
      '关于加强实验室安全管理的通知',
      '2025年暑假放假安排',
      '关于组织教师教学能力提升培训的通知',
      '关于开展学生体质健康测试的通知',
      '关于评选优秀班主任的公告',
      '关于更新教学设备的通知'
    ];

    const records = [];
    for (let i = 1; i <= 8; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const title = titles[i - 1];
      const isTop = Math.random() > 0.7;
      const readCount = Math.floor(Math.random() * 500) + 100;
      const date = dayjs('2025-07-25').subtract(Math.floor(Math.random() * 30), 'day');
      const status = Math.random() > 0.2 ? '已发布' : '草稿';

      records.push({
        key: i,
        id: `GG${String(i).padStart(4, '0')}`,
        type,
        title,
        content: `这是一条教务处发布的${type}，主要内容是关于${title.slice(2, -2)}的相关事项...`,
        publisher: '张志远',
        publisherTitle: '教务主任',
        department: '教务处',
        publishTime: date.format('YYYY-MM-DD HH:mm:ss'),
        isTop,
        readCount,
        status,
        attachments: Math.random() > 0.5 ? ['通知文件.pdf', '附件材料.docx'] : [],
        recipients: ['全体师生', '全体教师', '全体学生'][Math.floor(Math.random() * 3)]
      });
    }

    return records.sort((a, b) => {
      if (a.status !== b.status) return a.status === '草稿' ? -1 : 1;
      if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
      return dayjs(b.publishTime).valueOf() - dayjs(a.publishTime).valueOf();
    });
  };

  // 统计数据
  const statistics = useMemo(() => {
    const data = generateMyNotifications();
    return {
      total: data.length,
      published: data.filter(r => r.status === '已发布').length,
      draft: data.filter(r => r.status === '草稿').length,
      totalRead: data.reduce((sum, item) => sum + item.readCount, 0)
    };
  }, []);

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
    console.log('Search values:', values);
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
              <RangePicker style={{ width: 240 }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
                  筛选
                </Button>
                <Button onClick={() => searchForm.resetFields()}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Table
          columns={columns}
          dataSource={generateMyNotifications()}
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