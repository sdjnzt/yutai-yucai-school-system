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
  Timeline,
  Tabs,
  Badge,
  Alert,
  Statistic,
  Form,
  Input,
  Select,
  DatePicker,
  Progress,
  Tooltip
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  CarOutlined,
  InboxOutlined,
  TeamOutlined,
  SearchOutlined,
  FilterOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const DoneApproval = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchForm] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useState({});

  // 获取当前日期
  const currentDate = dayjs();

  // 生成已办审批数据
  const generateDoneApprovals = (type) => {
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

    const statuses = ['已通过', '已拒绝'];
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

    const approvers = [
      { name: '张志远', title: '教务主任' },
      { name: '李国庆', title: '学生主任' },
      { name: '王建华', title: '总务主任' },
      { name: '刘明亮', title: '实验室主任' },
      { name: '陈学文', title: '体育组长' }
    ];

    const processingTimes = ['1小时内', '2小时内', '4小时内', '8小时内', '24小时内'];

    for (let i = 1; i <= 8; i++) {
      // 使用当前日期减去随机天数，生成最近一个月的申请
      const date = currentDate.clone().subtract(Math.floor(Math.random() * 30), 'day');
      
      // 随机生成时分秒
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      const randomTime = date.clone().hour(hour).minute(minute).second(second);
      
      // 随机生成审批时间（1小时到24小时之后）
      const approvalHours = Math.floor(Math.random() * 24) + 1;
      const approvalTime = randomTime.clone().add(approvalHours, 'hour');
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const approver = approvers.find(a => a.title.includes(department.slice(0, 2))) || approvers[0];
      const typeConfig = types[type];
      const content = typeConfig.contents[Math.floor(Math.random() * typeConfig.contents.length)];
      const processingTime = processingTimes[Math.floor(Math.random() * processingTimes.length)];
      const urgency = Math.random() > 0.7 ? '紧急' : '普通';

      let record = {
        key: i,
        id: `${typeConfig.prefix}${String(i).padStart(4, '0')}`,
        type: typeConfig.title,
        icon: typeConfig.icon,
        content,
        applicant: teacher.name,
        applicantTitle: teacher.title,
        approver: approver.name,
        approverTitle: approver.title,
        department,
        status,
        urgency,
        processingTime,
        createTime: randomTime.format('YYYY-MM-DD HH:mm:ss'),
        approveTime: approvalTime.format('YYYY-MM-DD HH:mm:ss'),
        comment: status === '已通过' ? '同意申请' : '不符合申请条件',
      };

      if (type === 'leave') {
        const days = Math.floor(Math.random() * 5) + 1;
        record = {
          ...record,
          startDate: randomTime.format('YYYY-MM-DD'),
          endDate: randomTime.clone().add(days, 'day').format('YYYY-MM-DD'),
          days,
          reason: `因${content === '病假' ? '身体不适' : '个人事务'}申请请假${days}天`,
        };
      } else if (type === 'car') {
        // 用车时间从当前时间开始，持续几个小时
        const startHour = 8 + Math.floor(Math.random() * 10); // 8:00 - 18:00
        const startMinute = Math.floor(Math.random() * 60);
        const carStartTime = randomTime.clone().hour(startHour).minute(startMinute).second(0);
        const carDuration = Math.floor(Math.random() * 8) + 2; // 2-10小时
        
        record = {
          ...record,
          destination: ['市教育局', '县实验基地', '市体育馆', '市图书馆'][Math.floor(Math.random() * 4)],
          startTime: carStartTime.format('YYYY-MM-DD HH:mm'),
          endTime: carStartTime.clone().add(carDuration, 'hour').format('YYYY-MM-DD HH:mm'),
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
    const leaveData = generateDoneApprovals('leave');
    const carData = generateDoneApprovals('car');
    const materialData = generateDoneApprovals('material');

    const allData = [...leaveData, ...carData, ...materialData];
    const totalCount = allData.length;
    const approvedCount = allData.filter(r => r.status === '已通过').length;
    const rejectedCount = allData.filter(r => r.status === '已拒绝').length;
    const fastProcessCount = allData.filter(r => ['1小时内', '2小时内'].includes(r.processingTime)).length;

    return {
      total: totalCount,
      approved: approvedCount,
      rejected: rejectedCount,
      approvalRate: Math.round((approvedCount / totalCount) * 100),
      fastProcess: fastProcessCount,
      fastProcessRate: Math.round((fastProcessCount / totalCount) * 100),
      leave: leaveData.length,
      car: carData.length,
      material: materialData.length,
    };
  }, []);

  // 处理查看详情
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('Search values:', values);
    setSearchParams(values); // 这里使用了 searchParams
    
    // 实际应用中，这里会根据 searchParams 过滤数据
    // 由于我们使用的是模拟数据，这里只是演示
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
        <Tag color={urgency === '紧急' ? 'red' : 'default'}>
          {urgency}
        </Tag>
      ),
    },
    {
      title: '处理时长',
      dataIndex: 'processingTime',
      key: 'processingTime',
      width: 100,
      render: (time) => (
        <Tag color={time.includes('1小时') ? 'green' : time.includes('2小时') ? 'cyan' : 'blue'}>
          {time}
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
      title: '审批时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      width: 180,
    },
    {
      title: '审批结果',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = {
          '已通过': { color: 'success', icon: <CheckCircleOutlined /> },
          '已拒绝': { color: 'error', icon: <CloseCircleOutlined /> },
        };
        return (
          <Tag icon={config[status].icon} color={config[status].color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 150,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
          <Tag color="orange">{record.approverTitle}</Tag>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" icon={<FileTextOutlined />} onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={4}>已办审批</Title>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="已办总数"
                value={statistics.total}
                prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="通过率"
                value={statistics.approvalRate}
                suffix="%"
                prefix={<PieChartOutlined style={{ color: '#52c41a' }} />}
              />
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={statistics.approvalRate}
                  size="small"
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="快速处理"
                value={statistics.fastProcessRate}
                suffix="%"
                prefix={<FieldTimeOutlined style={{ color: '#722ed1' }} />}
              />
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={statistics.fastProcessRate}
                  size="small"
                  showInfo={false}
                  strokeColor="#722ed1"
                />
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="部门分布"
                value={5}
                prefix={<ApartmentOutlined style={{ color: '#13c2c2' }} />}
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
            <Form.Item name="status">
              <Select
                placeholder="审批结果"
                style={{ width: 120 }}
                allowClear
              >
                <Select.Option value="已通过">已通过</Select.Option>
                <Select.Option value="已拒绝">已拒绝</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="processingTime">
              <Select
                placeholder="处理时长"
                style={{ width: 140 }}
                allowClear
              >
                <Select.Option value="1小时内">1小时内</Select.Option>
                <Select.Option value="2小时内">2小时内</Select.Option>
                <Select.Option value="4小时内">4小时内</Select.Option>
                <Select.Option value="8小时内">8小时内</Select.Option>
                <Select.Option value="24小时内">24小时内</Select.Option>
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
              dataSource={generateDoneApprovals('leave')}
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
              dataSource={generateDoneApprovals('car')}
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
              dataSource={generateDoneApprovals('material')}
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

      {/* 详情弹窗 */}
      <Modal
        title="申请详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
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
                  <Tag color={selectedRecord.status === '已通过' ? 'success' : 'error'}>
                    {selectedRecord.status}
                  </Tag>
                  <Tag color={selectedRecord.processingTime.includes('1小时') ? 'green' : 'blue'}>
                    {selectedRecord.processingTime}处理
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
                  <Tag color="blue">{selectedRecord.applicantTitle}</Tag>
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
              <Col span={12}>
                <Text type="secondary">审批时间：</Text>
                <Text>{selectedRecord.approveTime}</Text>
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
                      </div>
                    </>
                  ),
                },
                {
                  color: selectedRecord.status === '已通过' ? 'green' : 'red',
                  children: (
                    <>
                      <Space>
                        <Tag icon={<UserOutlined />} color="orange">审批人</Tag>
                        <Text>{selectedRecord.approver}</Text>
                        <Tag color="orange">{selectedRecord.approverTitle}</Tag>
                      </Space>
                      <div style={{ marginTop: 8 }}>
                        <Tag icon={<CalendarOutlined />} color={
                          selectedRecord.status === '已通过' ? 'success' : 'error'
                        }>
                          {selectedRecord.approveTime}
                        </Tag>
                        <Tag color={selectedRecord.processingTime.includes('1小时') ? 'green' : 'blue'}>
                          {selectedRecord.processingTime}处理
                        </Tag>
                      </div>
                      <Alert
                        message={selectedRecord.status}
                        description={selectedRecord.comment}
                        type={selectedRecord.status === '已通过' ? 'success' : 'error'}
                        showIcon
                        style={{ marginTop: 8 }}
                      />
                    </>
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

export default DoneApproval; 