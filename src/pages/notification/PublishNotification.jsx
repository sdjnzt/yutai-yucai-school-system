import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Space,
  message,
  Typography,
  Alert,
  Tag,
  Divider
} from 'antd';
import {
  UploadOutlined,
  NotificationOutlined,
  UserOutlined,
  ApartmentOutlined,
  TeamOutlined,
  SaveOutlined,
  SendOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PublishNotification = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // 处理表单提交
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      console.log('Form values:', {
        ...values,
        attachments: fileList,
        publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      message.success('公告发布成功');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('发布失败，请重试');
    }
    setSubmitting(false);
  };

  // 处理文件上传
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 上传文件前的校验
  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超过10MB');
    }
    return isLt10M;
  };

  return (
    <div>
      <Card>
        <Title level={4}>发布公告</Title>

        <Alert
          message="发布提示"
          description={
            <ul>
              <li>请认真填写公告标题和内容，确保信息准确无误</li>
              <li>支持上传PDF、Word、Excel等格式的附件，单个文件大小不超过10MB</li>
              <li>发布后将立即通知相关接收对象</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: '通知',
            department: '教务处',
            recipients: '全体师生',
          }}
        >
          <Form.Item
            label="公告类型"
            name="type"
            rules={[{ required: true, message: '请选择公告类型' }]}
          >
            <Select>
              <Option value="通知">通知</Option>
              <Option value="公告">公告</Option>
              <Option value="文件">文件</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="发布部门"
            name="department"
            rules={[{ required: true, message: '请选择发布部门' }]}
          >
            <Select>
              <Option value="教务处">教务处</Option>
              <Option value="学生处">学生处</Option>
              <Option value="总务处">总务处</Option>
              <Option value="实验室">实验室</Option>
              <Option value="体育组">体育组</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="接收对象"
            name="recipients"
            rules={[{ required: true, message: '请选择接收对象' }]}
          >
            <Select>
              <Option value="全体师生">全体师生</Option>
              <Option value="全体教师">全体教师</Option>
              <Option value="全体学生">全体学生</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="公告标题"
            name="title"
            rules={[
              { required: true, message: '请输入公告标题' },
              { max: 50, message: '标题不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>

          <Form.Item
            label="公告内容"
            name="content"
            rules={[
              { required: true, message: '请输入公告内容' },
              { min: 10, message: '内容不能少于10个字符' }
            ]}
          >
            <TextArea
              rows={10}
              placeholder="请输入公告内容"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            label="附件"
            name="attachments"
            extra="支持上传PDF、Word、Excel等格式文件，单个文件不超过10MB"
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={beforeUpload}
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="置顶公告"
            name="isTop"
            valuePropName="checked"
          >
            <Select>
              <Option value={false}>不置顶</Option>
              <Option value={true}>置顶</Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={submitting}
              >
                发布公告
              </Button>
              <Button
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
              >
                保存草稿
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Alert
          message="预览效果"
          type="info"
          showIcon
          style={{ marginTop: 24, marginBottom: 16 }}
        />

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space>
              <Tag color="blue">
                {form.getFieldValue('type') || '通知'}
              </Tag>
              <Text strong>
                {form.getFieldValue('title') || '公告标题'}
              </Text>
            </Space>

            <Space>
              <Tag icon={<UserOutlined />} color="blue">
                张志远（教务主任）
              </Tag>
              <Tag icon={<ApartmentOutlined />} color="purple">
                {form.getFieldValue('department') || '教务处'}
              </Tag>
              <Tag icon={<TeamOutlined />} color="cyan">
                {form.getFieldValue('recipients') || '全体师生'}
              </Tag>
            </Space>

            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              <Text type="secondary">
                {form.getFieldValue('content') || '公告内容预览区域'}
              </Text>
            </div>

            {fileList.length > 0 && (
              <>
                <Divider>附件</Divider>
                <Space direction="vertical">
                  {fileList.map(file => (
                    <Text key={file.uid}>
                      <UploadOutlined /> {file.name}
                    </Text>
                  ))}
                </Space>
              </>
            )}
          </Space>
        </Card>
      </Card>
    </div>
  );
};

export default PublishNotification; 