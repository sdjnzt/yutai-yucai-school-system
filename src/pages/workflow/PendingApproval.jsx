import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Timeline,
  Badge,
  Tabs,
  Statistic,
  Select,
  DatePicker,
  Tooltip,
  Radio
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CarOutlined,
  InboxOutlined,
  TeamOutlined,
  SearchOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PendingApproval = () => {
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({});

  // 生成待办审批数据
  const generatePendingApprovals = (type) => {
    const records = [];
    const types = {
      leave: {
        title: '请假申请',
        icon: <TeamOutlined />,
        contents: ['事假', '病假', '婚假', '丧假', '产假'],
        prefix: 'QJ',
      },
      car: {
        title: '用车申请',
        icon: <CarOutlined />,
        contents: ['教学实践', '学生活动', '公务出差', '物资采购'],
        prefix: 'YC',
      },
      material: {
        title: '物资申请',
        icon: <InboxOutlined />,
        contents: ['办公用品', '教学用品', '实验器材', '体育器材', '电子设备'],
        prefix: 'WZ',
      },
    };

    const departments = ['教务处', '学生处', '总务处', '实验室', '体育组'];
    const teachers = [
      { name: '王明华', title: '高级教师' },
      { name: '李秀英', title: '特级教师' },
      { name: '张建国', title: '高级教师' },
      { name: '刘淑华', title: '一级教师' },
      { name: '陈志强', title: '高级教师' },
      { name: '赵丽娟', title: '特级教师' },
      { name: '杨光明', title: '一级教师' },
      { name: '周晓梅', title: '高级教师' },
      { name: '吴国强', title: '一级教师' },
      { name: '孙玉兰', title: '高级教师' },
      { name: '郑伟东', title: '特级教师' },
      { name: '马丽华', title: '一级教师' }
    ];

    for (let i = 1; i <= 8; i++) {
      const date = dayjs('2025-07-25').subtract(Math.floor(Math.random() * 3), 'day');
      const department = departments[Math.floor(Math.random() * departments.length)];
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const typeConfig = types[type];
      const content = typeConfig.contents[Math.floor(Math.random() * typeConfig.contents.length)];
      const urgency = Math.random() > 0.7 ? '紧急' : '普通';
      const submitTime = Math.random() > 0.5 ? '工作时间' : '非工作时间';

      let record = {
        key: i,
        id: `${typeConfig.prefix}${String(i).padStart(4, '0')}`,
        type: typeConfig.title,
        icon: typeConfig.icon,
        applicant: teacher.name,
        applicantTitle: teacher.title,
        department,
        createTime: date.format('YYYY-MM-DD HH:mm:ss'),
        urgency,
        submitTime,
        content,
      };

      if (type === 'leave') {
        const days = Math.floor(Math.random() * 5) + 1;
        record = {
          ...record,
          startDate: date.format('YYYY-MM-DD'),
          endDate: date.add(days, 'day').format('YYYY-MM-DD'),
          days,
          reason: `因${content === '病假' ? '身体不适' : '个人事务'}申请请假${days}天`,
        };
      } else if (type === 'car') {
        record = {
          ...record,
          destination: ['市教育局', '县实验基地', '市体育馆', '市图书馆'][Math.floor(Math.random() * 4)],
          startTime: date.format('YYYY-MM-DD HH:mm'),
          endTime: date.add(Math.floor(Math.random() * 8) + 2, 'hour').format('YYYY-MM-DD HH:mm'),
          carType: ['小型轿车', '中型客车', '大型客车'][Math.floor(Math.random() * 3)],
        };
      } else if (type === 'material') {
        record = {
          ...record,
          quantity: Math.floor(Math.random() * 50) + 1,
          amount: Math.floor(Math.random() * 5000) + 500,
          material: ['打印纸', '文具', '墨盒', '投影仪'][Math.floor(Math.random() * 4)],
        };
      }

      records.push(record);
    }

    return records;
  };

  // 统计数据
  const statistics = useMemo(() => {
    const leaveData = generatePendingApprovals('leave');
    const carData = generatePendingApprovals('car');
    const materialData = generatePendingApprovals('material');

    return {
      total: leaveData.length + carData.length + materialData.length,
      urgent: leaveData.filter(r => r.urgency === '紧急').length +
              carData.filter(r => r.urgency === '紧急').length +
              materialData.filter(r => r.urgency === '紧急').length,
      leave: leaveData.length,
      car: carData.length,
      material: materialData.length,
      nonWorkingTime: leaveData.filter(r => r.submitTime === '非工作时间').length +
                     carData.filter(r => r.submitTime === '非工作时间').length +
                     materialData.filter(r => r.submitTime === '非工作时间').length,
    };
  }, []);

  // 处理查看详情
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 处理审批
  const handleApproval = (record, isApprove) => {
    Modal.confirm({
      title: `确认${isApprove ? '通过' : '拒绝'}该申请？`,
      icon: <ExclamationCircleOutlined />,
      content: '请认真审核申请信息，审批后将无法撤销',
      onOk() {
        setSelectedRecord(record);
        form.setFieldsValue({
          result: isApprove ? '通过' : '拒绝',
          comment: '',
        });
        setApprovalVisible(true);
      },
    });
  };

  // 提交审批
  const handleApprovalSubmit = (values) => {
    console.log('Approval values:', values);
    message.success(`审批${values.result === '通过' ? '通过' : '拒绝'}成功`);
    setApprovalVisible(false);
    form.resetFields();
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('Search values:', values);
    setSearchParams(values);
    message.success('搜索条件已更新');
  };

  // 表格列配置
  const columns = [
    {
      title: '申请编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: '申请类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type, record) => (
        <Space>
          {record.icon}
          <span>{type}</span>
        </Space>
      ),
    },
    {
      title: '申请内容',
      dataIndex: 'content',
      key: 'content',
      width: 120,
      render: (content) => <Tag color="blue">{content}</Tag>,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 150,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
          <Tag color="blue">{record.applicantTitle}</Tag>
        </Space>
      ),
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (text) => (
        <Space>
          <ApartmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: (urgency) => (
        <Tag color={urgency === '紧急' ? 'red' : 'default'} icon={urgency === '紧急' ? <ExclamationCircleOutlined /> : null}>
          {urgency}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 120,
      render: (submitTime) => (
        <Tag color={submitTime === '非工作时间' ? 'orange' : 'green'} icon={<FieldTimeOutlined />}>
          {submitTime}
        </Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<FileTextOutlined />} onClick={() => handleViewDetail(record)}>
            查看详情
          </Button>
          <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleApproval(record, true)}>
            通过
          </Button>
          <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleApproval(record, false)}>
            拒绝
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={4}>待办审批</Title>
        
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="待办总数"
                value={statistics.total}
                prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="紧急申请"
                value={statistics.urgent}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="非工作时间"
                value={statistics.nonWorkingTime}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<FieldTimeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="部门分布"
                value={5}
                prefix={<ApartmentOutlined style={{ color: '#52c41a' }} />}
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
                placeholder="搜索申请编号/申请人"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="department">
              <Select
                placeholder="选择部门"
                style={{ width: 160 }}
                allowClear
              >
                <Select.Option value="教务处">教务处</Select.Option>
                <Select.Option value="学生处">学生处</Select.Option>
                <Select.Option value="总务处">总务处</Select.Option>
                <Select.Option value="实验室">实验室</Select.Option>
                <Select.Option value="体育组">体育组</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="urgency">
              <Select
                placeholder="紧急程度"
                style={{ width: 120 }}
                allowClear
              >
                <Select.Option value="紧急">紧急</Select.Option>
                <Select.Option value="普通">普通</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="submitTime">
              <Select
                placeholder="提交时间"
                style={{ width: 140 }}
                allowClear
              >
                <Select.Option value="工作时间">工作时间</Select.Option>
                <Select.Option value="非工作时间">非工作时间</Select.Option>
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
                <Button onClick={() => {
                  searchForm.resetFields();
                  setSearchParams({});
                }}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Tabs defaultActiveKey="leave">
          <TabPane
            tab={
              <span>
                <TeamOutlined />
                请假申请
                <Badge count={statistics.leave} offset={[10, -5]} />
              </span>
            }
            key="leave"
          >
            <Table
              columns={columns}
              dataSource={generatePendingApprovals('leave')}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              scroll={{ x: 1300 }}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <CarOutlined />
                用车申请
                <Badge count={statistics.car} offset={[10, -5]} />
              </span>
            }
            key="car"
          >
            <Table
              columns={columns}
              dataSource={generatePendingApprovals('car')}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              scroll={{ x: 1300 }}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <InboxOutlined />
                物资申请
                <Badge count={statistics.material} offset={[10, -5]} />
              </span>
            }
            key="material"
          >
            <Table
              columns={columns}
              dataSource={generatePendingApprovals('material')}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              scroll={{ x: 1300 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 审批弹窗 */}
      <Modal
        title="审批处理"
        open={approvalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setApprovalVisible(false);
          form.resetFields();
        }}
      >
        <Alert
          message="审批提示"
          description="请认真审核申请信息，填写审批意见。审批完成后将自动通知申请人。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApprovalSubmit}
        >
          <Form.Item
            name="result"
            label="审批结果"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="comment"
            label="审批意见"
            rules={[{ required: true, message: '请输入审批意见' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入详细的审批意见，说明通过或拒绝的原因"
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="申请详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => {
              setDetailVisible(false);
              handleApproval(selectedRecord, true);
            }}
          >
            通过
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => {
              setDetailVisible(false);
              handleApproval(selectedRecord, false);
            }}
          >
            拒绝
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord && (
          <>
            <Alert
              message={
                <Space>
                  <Tag color={selectedRecord.urgency === '紧急' ? 'red' : 'default'}>
                    {selectedRecord.urgency}
                  </Tag>
                  <Tag color={selectedRecord.submitTime === '非工作时间' ? 'orange' : 'green'}>
                    {selectedRecord.submitTime}
                  </Tag>
                </Space>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Divider orientation="left">基本信息</Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">申请编号：</Text>
                <Text>{selectedRecord.id}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">申请类型：</Text>
                <Space>
                  {selectedRecord.icon}
                  <Text>{selectedRecord.type}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Text type="secondary">申请人：</Text>
                <Space>
                  <UserOutlined />
                  <Text>{selectedRecord.applicant}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Text type="secondary">所属部门：</Text>
                <Space>
                  <ApartmentOutlined />
                  <Text>{selectedRecord.department}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Text type="secondary">申请时间：</Text>
                <Text>{selectedRecord.createTime}</Text>
              </Col>
              {selectedRecord.startDate && (
                <>
                  <Col span={24}>
                    <Text type="secondary">请假类型：</Text>
                    <Tag color="blue">{selectedRecord.content}</Tag>
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">请假时间：</Text>
                    <Text>{selectedRecord.startDate} 至 {selectedRecord.endDate}（共{selectedRecord.days}天）</Text>
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">请假原因：</Text>
                    <Paragraph>{selectedRecord.reason}</Paragraph>
                  </Col>
                </>
              )}
              {selectedRecord.destination && (
                <>
                  <Col span={12}>
                    <Text type="secondary">用车用途：</Text>
                    <Tag color="blue">{selectedRecord.content}</Tag>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">目的地：</Text>
                    <Text>{selectedRecord.destination}</Text>
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">用车时间：</Text>
                    <Text>{selectedRecord.startTime} 至 {selectedRecord.endTime}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">车辆类型：</Text>
                    <Text>{selectedRecord.carType}</Text>
                  </Col>
                </>
              )}
              {selectedRecord.material && (
                <>
                  <Col span={12}>
                    <Text type="secondary">物资类型：</Text>
                    <Tag color="blue">{selectedRecord.content}</Tag>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">物资名称：</Text>
                    <Text>{selectedRecord.material}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">申请数量：</Text>
                    <Text>{selectedRecord.quantity}个</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">预算金额：</Text>
                    <Text>¥{selectedRecord.amount.toFixed(2)}</Text>
                  </Col>
                </>
              )}
            </Row>

            <Divider orientation="left">审批流程</Divider>
            <Timeline
              items={[
                {
                  color: 'blue',
                  children: (
                    <>
                      <Space>
                        <Tag icon={<UserOutlined />} color="blue">申请人</Tag>
                        <Text>{selectedRecord.applicant}</Text>
                        <Tag color="blue">{selectedRecord.applicantTitle}</Tag>
                        <Tag icon={<ApartmentOutlined />} color="blue">{selectedRecord.department}</Tag>
                      </Space>
                      <div style={{ marginTop: 8 }}>
                        <Tag icon={<CalendarOutlined />} color="blue">
                          {selectedRecord.createTime}
                        </Tag>
                        <Tag color={selectedRecord.urgency === '紧急' ? 'red' : 'default'}>
                          {selectedRecord.urgency}
                        </Tag>
                        <Tag color={selectedRecord.submitTime === '非工作时间' ? 'orange' : 'green'}>
                          {selectedRecord.submitTime}
                        </Tag>
                      </div>
                    </>
                  ),
                },
                {
                  color: 'gray',
                  children: (
                    <Tag icon={<ClockCircleOutlined />} color="processing">
                      等待审批
                    </Tag>
                  ),
                },
              ]}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default PendingApproval; 