import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Tag,
  Row,
  Col,
  Tooltip,
  message,
  Dropdown,
  Badge,
  Upload,
  Tabs,
  Statistic,
  Descriptions,
  Divider,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  UserOutlined,
  FileTextOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  TeamOutlined,
  ManOutlined,
  WomanOutlined,
  SwapOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { confirm } = Modal;
const { Dragger } = Upload;
const { TabPane } = Tabs;

const StudentList = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 生成模拟数据
  const generateStudents = () => {
    const students = [];
    const grades = ['高一', '高二', '高三'];
    const addresses = [
      '山东省济宁市鱼台县鱼城街道',
      '山东省济宁市鱼台县老城街道',
      '山东省济宁市鱼台县王鲁镇',
      '山东省济宁市鱼台县张黄镇',
      '山东省济宁市鱼台县罗屯镇',
      '山东省济宁市鱼台县清河镇'
    ];
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
    const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平'];
    const status = ['active', 'active', 'active', 'active', 'active', 'inactive', 'transferred']; // 大多数是在读状态

    // 当前年份是2025年
    const currentYear = 2025;

    grades.forEach((grade, gradeIndex) => {
      // 每个年级8个班
      for (let classNum = 1; classNum <= 8; classNum++) {
        // 每个班50个学生
        for (let studentNum = 1; studentNum <= 50; studentNum++) {
          // 根据年级计算入学年份：高一2024年入学，高二2023年入学，高三2022年入学
          const enrollmentYear = currentYear - gradeIndex;
          const id = `${enrollmentYear}07${String(classNum).padStart(2, '0')}${String(studentNum).padStart(2, '0')}`;
          
          // 随机生成姓名
          const surname = surnames[Math.floor(Math.random() * surnames.length)];
          const name = names[Math.floor(Math.random() * names.length)];
          const fullName = surname + name;
          
          // 随机生成性别
          const gender = Math.random() < 0.5 ? '男' : '女';
          
          // 根据年级计算年龄
          const baseAge = grade === '高一' ? 16 : grade === '高二' ? 17 : 18;
          const age = baseAge + Math.floor(Math.random() * 2); // 可能有同学晚入学或留级
          
          // 随机生成联系方式
          const phone = `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
          const guardianPhone = `139${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
          
          // 随机选择地址
          const address = addresses[Math.floor(Math.random() * addresses.length)];
          
          // 随机生成身份证号（简化版）
          const birthYear = String(2025 - age).slice(-2);
          const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
          const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
          const idCard = `37000020${birthYear}${birthMonth}${birthDay}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
          
          // 生成入学日期 - 修复为正确的格式和逻辑
          // 高中入学时间一般是9月1日
          // 确保格式为 YYYY-MM-DD
          const enrollmentMonth = '09';
          const enrollmentDay = '01';
          
          // 高一的学生还未入学，入学日期应该是未来日期（2025-09-01）
          // 高二是去年入学（2024-09-01）
          // 高三是前年入学（2023-09-01）
          let enrollmentDate;
          if (grade === '高一') {
            // 新高一还未入学，入学日期是未来的9月1日
            enrollmentDate = `${currentYear}-${enrollmentMonth}-${enrollmentDay}`;
          } else {
            // 高二和高三已经入学
            enrollmentDate = `${currentYear - gradeIndex}-${enrollmentMonth}-${enrollmentDay}`;
          }
          
          // 随机选择状态（大多数是在读状态）
          // 高一学生还未入学，状态应为"待入学"(pending)
          let studentStatus;
          if (grade === '高一') {
            studentStatus = 'pending'; // 待入学状态
          } else {
            studentStatus = status[Math.floor(Math.random() * status.length)];
          }

          students.push({
            id,
            name: fullName,
            gender,
            age,
            grade,
            class: String(classNum),
            phone,
            address,
            guardian: gender === '男' ? surname + '父' : surname + '母',
            guardianPhone,
            status: studentStatus,
            enrollmentDate,
            idCard,
          });
        }
      }
    });
    
    return students;
  };

  // 使用生成的数据
  const [students] = useState(generateStudents());

  // 表格列配置
  const columns = [
    {
      title: '学号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <a onClick={() => handleViewDetails(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: '年级班级',
      key: 'gradeClass',
      width: 120,
      render: (_, record) => `${record.grade}(${record.class})班`,
      filters: [
        { text: '高一', value: '高一' },
        { text: '高二', value: '高二' },
        { text: '高三', value: '高三' },
      ],
      onFilter: (value, record) => record.grade === value,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '监护人',
      key: 'guardianInfo',
      width: 200,
      render: (_, record) => (
        <span>
          {record.guardian} ({record.guardianPhone})
        </span>
      ),
    },
    {
      title: '家庭住址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
    },
    {
      title: '入学日期',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      width: 120,
      render: (date) => date, // 直接显示日期字符串
      sorter: (a, b) => new Date(a.enrollmentDate) - new Date(b.enrollmentDate),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          active: { color: 'success', text: '在读' },
          inactive: { color: 'default', text: '休学' },
          graduated: { color: 'processing', text: '毕业' },
          transferred: { color: 'warning', text: '转学' },
          pending: { color: 'processing', text: '待入学' }, // 新增待入学状态
        };
        return (
          <Badge
            status={statusConfig[status].color}
            text={statusConfig[status].text}
          />
        );
      },
      filters: [
        { text: '在读', value: 'active' },
        { text: '休学', value: 'inactive' },
        { text: '毕业', value: 'graduated' },
        { text: '转学', value: 'transferred' },
        { text: '待入学', value: 'pending' }, // 新增待入学状态
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="更多操作">
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'details',
                    label: '查看详情',
                    icon: <FileTextOutlined />,
                    onClick: () => handleViewDetails(record),
                  },
                  {
                    key: 'delete',
                    label: '删除',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDelete(record),
                  },
                ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 搜索表单配置
  const searchFormItems = [
    {
      name: 'keyword',
      label: '关键字',
      component: <Input placeholder="学号/姓名/电话" />,
    },
    {
      name: 'grade',
      label: '年级',
      component: (
        <Select placeholder="请选择年级" allowClear>
          <Option value="高一">高一</Option>
          <Option value="高二">高二</Option>
          <Option value="高三">高三</Option>
        </Select>
      ),
    },
    {
      name: 'class',
      label: '班级',
      component: (
        <Select placeholder="请选择班级" allowClear>
          {[...Array(10)].map((_, i) => (
            <Option key={i + 1} value={String(i + 1)}>
              {i + 1}班
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'status',
      label: '状态',
      component: (
        <Select placeholder="请选择状态" allowClear>
          <Option value="active">在读</Option>
          <Option value="inactive">休学</Option>
          <Option value="graduated">毕业</Option>
          <Option value="transferred">转学</Option>
          <Option value="pending">待入学</Option>
        </Select>
      ),
    },
  ];

  // 编辑表单配置
  const formItems = [
    {
      name: 'id',
      label: '学号',
      rules: [{ required: true, message: '请输入学号' }],
      component: <Input disabled={!!editingStudent} />,
    },
    {
      name: 'name',
      label: '姓名',
      rules: [{ required: true, message: '请输入姓名' }],
      component: <Input />,
    },
    {
      name: 'gender',
      label: '性别',
      rules: [{ required: true, message: '请选择性别' }],
      component: (
        <Select>
          <Option value="男">男</Option>
          <Option value="女">女</Option>
        </Select>
      ),
    },
    {
      name: 'grade',
      label: '年级',
      rules: [{ required: true, message: '请选择年级' }],
      component: (
        <Select>
          <Option value="高一">高一</Option>
          <Option value="高二">高二</Option>
          <Option value="高三">高三</Option>
        </Select>
      ),
    },
    {
      name: 'class',
      label: '班级',
      rules: [{ required: true, message: '请选择班级' }],
      component: (
        <Select>
          {[...Array(10)].map((_, i) => (
            <Option key={i + 1} value={String(i + 1)}>
              {i + 1}班
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'phone',
      label: '联系电话',
      rules: [
        { required: true, message: '请输入联系电话' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
      ],
      component: <Input />,
    },
    {
      name: 'guardian',
      label: '监护人',
      rules: [{ required: true, message: '请输入监护人姓名' }],
      component: <Input />,
    },
    {
      name: 'guardianPhone',
      label: '监护人电话',
      rules: [
        { required: true, message: '请输入监护人电话' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
      ],
      component: <Input />,
    },
    {
      name: 'address',
      label: '家庭住址',
      rules: [{ required: true, message: '请输入家庭住址' }],
      component: <Input />,
    },
    {
      name: 'enrollmentDate',
      label: '入学日期',
      rules: [{ required: true, message: '请选择入学日期' }],
      component: (
        <DatePicker
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
          placeholder="选择入学日期"
          allowClear={false}
        />
      ),
    },
    {
      name: 'idCard',
      label: '身份证号',
      rules: [
        { required: true, message: '请输入身份证号' },
        {
          pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          message: '请输入正确的身份证号',
        },
      ],
      component: <Input />,
    },
    {
      name: 'status',
      label: '状态',
      rules: [{ required: true, message: '请选择状态' }],
      component: (
        <Select>
          <Option value="active">在读</Option>
          <Option value="inactive">休学</Option>
          <Option value="graduated">毕业</Option>
          <Option value="transferred">转学</Option>
          <Option value="pending">待入学</Option>
        </Select>
      ),
    },
  ];

  // 处理文件导入
  const handleImport = async (file) => {
    setLoading(true);
    try {
      // 这里模拟文件上传和处理
      console.log('导入文件：', file);
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('导入成功');
      setImportModalVisible(false);
    } catch (err) {
      console.error('导入失败：', err);
      message.error('导入失败');
    } finally {
      setLoading(false);
    }
    return false; // 阻止自动上传
  };

  // 文件上传配置
  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    beforeUpload: handleImport,
    showUploadList: false,
  };

  // 处理搜索
  const handleSearch = (values) => {
    setLoading(true);
    try {
      console.log('搜索条件：', values);
      // 实现搜索逻辑
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('搜索失败：', err);
      message.error('搜索失败');
      setLoading(false);
    }
  };

  // 处理重置搜索
  const handleReset = () => {
    searchForm.resetFields();
  };

  // 处理添加/编辑
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 处理日期格式
      const formattedValues = { ...values };
      if (formattedValues.enrollmentDate) {
        // 确保日期格式为 YYYY-MM-DD 字符串
        formattedValues.enrollmentDate = dayjs(formattedValues.enrollmentDate).format('YYYY-MM-DD');
      }
      
      console.log('提交数据：', formattedValues);
      // 实现添加/编辑逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`${editingStudent ? '编辑' : '添加'}成功`);
      setVisible(false);
      form.resetFields();
      setEditingStudent(null);
    } catch (err) {
      console.error(`${editingStudent ? '编辑' : '添加'}失败：`, err);
      message.error(`${editingStudent ? '编辑' : '添加'}失败`);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingStudent(record);
    // 将日期字符串转换为dayjs对象，确保DatePicker能正确显示
    const formValues = { ...record };
    if (formValues.enrollmentDate) {
      try {
        formValues.enrollmentDate = dayjs(formValues.enrollmentDate);
      } catch (error) {
        console.error('日期转换错误:', error);
        // 如果转换失败，使用当前日期
        formValues.enrollmentDate = dayjs();
      }
    }
    form.setFieldsValue(formValues);
    setVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除学生"${record.name}"吗？`,
      onOk() {
        console.log('删除学生：', record);
        message.success('删除成功');
      },
    });
  };

  // 计算统计数据
  const statistics = useMemo(() => {
    const total = students.length;
    const male = students.filter(s => s.gender === '男').length;
    const female = students.filter(s => s.gender === '女').length;
    const active = students.filter(s => s.status === 'active').length;
    const inactive = students.filter(s => s.status === 'inactive').length;
    const transferred = students.filter(s => s.status === 'transferred').length;
    const pending = students.filter(s => s.status === 'pending').length;
    
    // 计算各年级班级数
    const classCount = new Set(students.map(s => `${s.grade}-${s.class}`)).size;
    
    // 计算各年级人数
    const gradeOne = students.filter(s => s.grade === '高一').length;
    const gradeTwo = students.filter(s => s.grade === '高二').length;
    const gradeThree = students.filter(s => s.grade === '高三').length;

    return {
      total,
      male,
      female,
      active,
      inactive,
      transferred,
      pending,
      classCount,
      gradeOne,
      gradeTwo,
      gradeThree
    };
  }, [students]);

  // 查看详情弹窗内容
  const renderStudentDetails = (student) => (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="学号" span={1}>{student.id}</Descriptions.Item>
      <Descriptions.Item label="姓名" span={1}>{student.name}</Descriptions.Item>
      <Descriptions.Item label="性别" span={1}>
        {student.gender === '男' ? <ManOutlined style={{ color: '#1890ff' }} /> : <WomanOutlined style={{ color: '#eb2f96' }} />}
        {' '}{student.gender}
      </Descriptions.Item>
      <Descriptions.Item label="年龄" span={1}>{student.age}岁</Descriptions.Item>
      <Descriptions.Item label="年级班级" span={2}>
        {student.grade}（{student.class}）班
      </Descriptions.Item>
      <Descriptions.Item label="联系电话" span={2}>{student.phone}</Descriptions.Item>
      <Descriptions.Item label="家庭住址" span={2}>{student.address}</Descriptions.Item>
      <Descriptions.Item label="监护人" span={1}>{student.guardian}</Descriptions.Item>
      <Descriptions.Item label="监护人电话" span={1}>{student.guardianPhone}</Descriptions.Item>
      <Descriptions.Item label="入学日期" span={1}>{student.enrollmentDate}</Descriptions.Item>
      <Descriptions.Item label="学籍状态" span={1}>
        <Badge
          status={
            student.status === 'active' ? 'success' :
            student.status === 'inactive' ? 'default' :
            student.status === 'transferred' ? 'warning' :
            student.status === 'pending' ? 'processing' : 'default' // 新增待入学状态
          }
          text={
            student.status === 'active' ? '在读' :
            student.status === 'inactive' ? '休学' :
            student.status === 'transferred' ? '转学' :
            student.status === 'pending' ? '待入学' : '未知' // 新增待入学状态
          }
        />
      </Descriptions.Item>
      <Descriptions.Item label="身份证号" span={2}>{student.idCard}</Descriptions.Item>
    </Descriptions>
  );

  // 添加详情弹窗状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // 处理查看详情
  const handleViewDetails = (record) => {
    setCurrentStudent(record);
    setDetailVisible(true);
  };

  // 处理导出
  const handleExport = async () => {
    setLoading(true);
    try {
      // 实现导出逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('导出成功');
    } catch (err) {
      console.error('导出失败：', err);
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="学生总数"
              value={statistics.total}
              prefix={<TeamOutlined />}
              suffix="人"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <ManOutlined style={{ color: '#1890ff' }} /> 男生：{statistics.male}人
              </span>
              <span>
                <WomanOutlined style={{ color: '#eb2f96' }} /> 女生：{statistics.female}人
              </span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="班级分布"
              value={statistics.classCount}
              prefix={<TeamOutlined />}
              suffix="个班"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>高一：{statistics.gradeOne}人</span>
              <span>高二：{statistics.gradeTwo}人</span>
              <span>高三：{statistics.gradeThree}人</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="学籍状态"
              value={statistics.active}
              prefix={<ClockCircleOutlined />}
              suffix="人在读"
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <Badge status="default" /> 休学：{statistics.inactive}人
              </span>
              <span>
                <Badge status="warning" /> 转学：{statistics.transferred}人
              </span>
            </div>
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <Badge status="processing" /> 待入学：{statistics.pending}人
            </div>
          </Card>
        </Col>
      </Row>

      {/* 搜索和操作区域使用Tabs组织 */}
      <Card style={{ marginBottom: 16 }}>
        <Tabs defaultActiveKey="search">
          <TabPane tab="搜索筛选" key="search">
            <Form
              form={searchForm}
              onFinish={handleSearch}
              layout="inline"
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16} style={{ marginBottom: 16 }}>
                {searchFormItems.map((item) => (
                  <Col key={item.name} xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name={item.name} label={item.label}>
                      {item.component}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button onClick={handleReset}>重置</Button>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      搜索
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="批量操作" key="batch">
            <Space size="middle">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingStudent(null);
                  form.resetFields();
                  setVisible(true);
                }}
              >
                添加学生
              </Button>
              <Button 
                icon={<UploadOutlined />}
                onClick={() => setImportModalVisible(true)}
              >
                批量导入
              </Button>
              <Button
                icon={<DownloadOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={handleExport}
              >
                导出选中
              </Button>
              <span style={{ marginLeft: 8 }}>
                已选择{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
                {selectedRowKeys.length > 0 && (
                  <Button
                    type="link"
                    onClick={() => setSelectedRowKeys([])}
                  >
                    清空
                  </Button>
                )}
              </span>
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      {/* 表格区域 */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={students}
          rowKey="id"
          scroll={{ x: 1500 }}
          loading={loading}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

      {/* 添加/编辑弹窗 */}
      <Modal
        title={`${editingStudent ? '编辑' : '添加'}学生`}
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setEditingStudent(null);
        }}
        onOk={form.submit}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Row gutter={16}>
            {formItems.map((item) => (
              <Col key={item.name} span={12}>
                <Form.Item
                  name={item.name}
                  label={item.label}
                  rules={item.rules}
                >
                  {item.component}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>

      {/* 导入弹窗 */}
      <Modal
        title="批量导入学生"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 .xlsx, .xls 格式的Excel文件
          </p>
        </Dragger>
        <div style={{ marginTop: 16 }}>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => message.success('模板下载成功')}
          >
            下载导入模板
          </Button>
        </div>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="学生详细信息"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setCurrentStudent(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setDetailVisible(false);
              handleEdit(currentStudent);
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentStudent && renderStudentDetails(currentStudent)}
      </Modal>
    </div>
  );
};

export default StudentList; 