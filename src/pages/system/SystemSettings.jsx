import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Switch,
  Upload,
  message,
  Tabs,
  Select,
  TimePicker,
  InputNumber
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  SettingOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  DatabaseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const SystemSettings = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');

  // 重置表单
  const resetForm = () => {
    form.resetFields();
  };

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
    resetForm();
  };

  // 处理表单提交
  const handleSubmit = (values) => {
    // 转换时间值为字符串格式
    const formattedValues = {
      ...values,
      backupTime: values.backupTime?.format('HH:mm:ss'),
      morningStudy: values.morningStudy?.map(time => time?.format('HH:mm')),
      breakfast: values.breakfast?.map(time => time?.format('HH:mm')),
      periods: values.periods?.map(period => ({
        ...period,
        time: period.time?.map(time => time?.format('HH:mm'))
      }))
    };
    console.log('Form values:', formattedValues);
    message.success('设置保存成功');
  };

  // 处理文件上传
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 上传文件前的校验
  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB');
    }
    return isLt2M;
  };

  // 获取当前标签页的初始值
  const getInitialValues = () => {
    const commonValues = {
      systemName: '鱼台县育才学校教务系统',
      systemLogo: '',
      systemDesc: '鱼台县育才学校教务管理系统是一个现代化的教育管理平台，致力于提供高效、便捷的教务管理服务。',
      copyright: '© 2025 鱼台县育才学校 版权所有',
      recordNumber: '',
    };

    const scheduleValues = {
      morningStudy: [dayjs('06:30', 'HH:mm'), dayjs('07:20', 'HH:mm')],
      breakfast: [dayjs('07:20', 'HH:mm'), dayjs('07:50', 'HH:mm')],
      periods: [
        { name: '第一节', time: [dayjs('08:00', 'HH:mm'), dayjs('08:45', 'HH:mm')] },
        { name: '第二节', time: [dayjs('08:55', 'HH:mm'), dayjs('09:40', 'HH:mm')] },
        { name: '第三节', time: [dayjs('10:00', 'HH:mm'), dayjs('10:45', 'HH:mm')] },
        { name: '第四节', time: [dayjs('10:55', 'HH:mm'), dayjs('11:40', 'HH:mm')] },
        { name: '午休', time: [dayjs('12:00', 'HH:mm'), dayjs('14:00', 'HH:mm')] },
        { name: '第五节', time: [dayjs('14:00', 'HH:mm'), dayjs('14:45', 'HH:mm')] },
        { name: '第六节', time: [dayjs('14:55', 'HH:mm'), dayjs('15:40', 'HH:mm')] },
        { name: '第七节', time: [dayjs('16:00', 'HH:mm'), dayjs('16:45', 'HH:mm')] },
        { name: '第八节', time: [dayjs('16:55', 'HH:mm'), dayjs('17:40', 'HH:mm')] },
        { name: '晚自习', time: [dayjs('19:00', 'HH:mm'), dayjs('21:00', 'HH:mm')] },
      ]
    };

    const dataValues = {
      autoBackup: true,
      backupTime: dayjs('00:00:00', 'HH:mm:ss'),
      backupRetention: 30,
      backupStorage: 'local',
      dataRetention: {
        log: 90,
        notification: 30,
        attachment: 365,
      }
    };

    switch (activeTab) {
      case 'schedule':
        return scheduleValues;
      case 'data':
        return dataValues;
      default:
        return commonValues;
    }
  };

  return (
    <div>
      <Card>
        <Title level={4}>系统设置</Title>

        <Tabs defaultActiveKey="basic" onChange={handleTabChange}>
          {/* 基本设置 */}
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                基本设置
              </span>
            }
            key="basic"
          >
            <Alert
              message="温馨提示"
              description="基本设置包含系统的基础配置信息，修改后需要重新登录才能生效。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={getInitialValues()}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="systemName"
                    label="系统名称"
                    rules={[{ required: true, message: '请输入系统名称' }]}
                  >
                    <Input placeholder="请输入系统名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="systemLogo"
                    label="系统Logo"
                    extra="建议尺寸：200x50px，支持jpg、png格式"
                  >
                    <Upload
                      fileList={fileList}
                      onChange={handleFileChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="systemDesc"
                label="系统描述"
                rules={[{ required: true, message: '请输入系统描述' }]}
              >
                <TextArea rows={4} placeholder="请输入系统描述" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="copyright"
                    label="版权信息"
                    rules={[{ required: true, message: '请输入版权信息' }]}
                  >
                    <Input placeholder="请输入版权信息" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="recordNumber"
                    label="备案号"
                    rules={[{ required: true, message: '请输入备案号' }]}
                  >
                    <Input placeholder="请输入备案号" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* 通知设置 */}
          <TabPane
            tab={
              <span>
                <BellOutlined />
                通知设置
              </span>
            }
            key="notification"
          >
            <Alert
              message="温馨提示"
              description="通知设置用于配置系统的消息通知方式和提醒规则。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                emailNotification: true,
                smsNotification: false,
                browserNotification: true,
                notificationSound: true,
                notificationFrequency: 'immediately',
              }}
            >
              <Form.Item
                name="emailNotification"
                label="邮件通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Form.Item
                name="smsNotification"
                label="短信通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Form.Item
                name="browserNotification"
                label="浏览器通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Form.Item
                name="notificationSound"
                label="通知声音"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Form.Item
                name="notificationFrequency"
                label="通知频率"
                rules={[{ required: true, message: '请选择通知频率' }]}
              >
                <Select placeholder="请选择通知频率">
                  <Option value="immediately">立即通知</Option>
                  <Option value="hourly">每小时汇总</Option>
                  <Option value="daily">每日汇总</Option>
                </Select>
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* 安全设置 */}
          <TabPane
            tab={
              <span>
                <SafetyCertificateOutlined />
                安全设置
              </span>
            }
            key="security"
          >
            <Alert
              message="温馨提示"
              description="安全设置用于配置系统的安全策略，包括密码策略、登录策略等。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                passwordExpiration: 90,
                passwordMinLength: 8,
                passwordComplexity: 'medium',
                loginAttempts: 5,
                lockDuration: 30,
                sessionTimeout: 120,
                twoFactorAuth: false,
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="passwordExpiration"
                    label="密码有效期（天）"
                    rules={[{ required: true, message: '请输入密码有效期' }]}
                  >
                    <InputNumber min={0} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="passwordMinLength"
                    label="密码最小长度"
                    rules={[{ required: true, message: '请输入密码最小长度' }]}
                  >
                    <InputNumber min={6} max={20} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="passwordComplexity"
                label="密码复杂度"
                rules={[{ required: true, message: '请选择密码复杂度' }]}
              >
                <Select placeholder="请选择密码复杂度">
                  <Option value="low">低（仅字母和数字）</Option>
                  <Option value="medium">中（字母、数字和特殊字符）</Option>
                  <Option value="high">高（大小写字母、数字和特殊字符）</Option>
                </Select>
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="loginAttempts"
                    label="登录失败次数限制"
                    rules={[{ required: true, message: '请输入登录失败次数限制' }]}
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lockDuration"
                    label="账号锁定时长（分钟）"
                    rules={[{ required: true, message: '请输入账号锁定时长' }]}
                  >
                    <InputNumber min={1} max={1440} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="sessionTimeout"
                label="会话超时时间（分钟）"
                rules={[{ required: true, message: '请输入会话超时时间' }]}
              >
                <InputNumber min={1} max={1440} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="twoFactorAuth"
                label="双因素认证"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* 数据设置 */}
          <TabPane
            tab={
              <span>
                <DatabaseOutlined />
                数据设置
              </span>
            }
            key="data"
          >
            <Alert
              message="温馨提示"
              description="数据设置用于配置系统的数据存储和备份策略。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={getInitialValues()}
            >
              <Form.Item
                name="autoBackup"
                label="自动备份"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="backupTime"
                    label="备份时间"
                    rules={[{ required: true, message: '请选择备份时间' }]}
                  >
                    <TimePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="backupRetention"
                    label="备份保留天数"
                    rules={[{ required: true, message: '请输入备份保留天数' }]}
                  >
                    <InputNumber min={1} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="backupStorage"
                label="备份存储位置"
                rules={[{ required: true, message: '请选择备份存储位置' }]}
              >
                <Select placeholder="请选择备份存储位置">
                  <Option value="local">本地存储</Option>
                  <Option value="cloud">云存储</Option>
                  <Option value="both">本地+云存储</Option>
                </Select>
              </Form.Item>

              <Divider>数据保留策略</Divider>

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name={['dataRetention', 'log']}
                    label="日志保留天数"
                    rules={[{ required: true, message: '请输入日志保留天数' }]}
                  >
                    <InputNumber min={1} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={['dataRetention', 'notification']}
                    label="通知保留天数"
                    rules={[{ required: true, message: '请输入通知保留天数' }]}
                  >
                    <InputNumber min={1} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={['dataRetention', 'attachment']}
                    label="附件保留天数"
                    rules={[{ required: true, message: '请输入附件保留天数' }]}
                  >
                    <InputNumber min={1} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    保存设置
                  </Button>
                  <Button type="default" icon={<DatabaseOutlined />}>
                    立即备份
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          {/* 作息设置 */}
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                作息设置
              </span>
            }
            key="schedule"
          >
            <Alert
              message="温馨提示"
              description="作息设置用于配置学校的作息时间，包括上课时间、课间休息时间等。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={getInitialValues()}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="morningStudy"
                    label="早自习时间"
                    rules={[{ required: true, message: '请选择早自习时间' }]}
                  >
                    <TimePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="breakfast"
                    label="早餐时间"
                    rules={[{ required: true, message: '请选择早餐时间' }]}
                  >
                    <TimePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>课程时间</Divider>

              <Form.List name="periods">
                {(fields) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={24}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            rules={[{ required: true, message: '请输入时段名称' }]}
                          >
                            <Input placeholder="时段名称" />
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item
                            {...restField}
                            name={[name, 'time']}
                            rules={[{ required: true, message: '请选择时间范围' }]}
                          >
                            <TimePicker.RangePicker style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>

              <Divider />

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemSettings; 