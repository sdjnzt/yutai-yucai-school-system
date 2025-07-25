import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, message, Tag, Select, Modal, Form, Switch, Tree } from 'antd';
import { SettingOutlined, UserOutlined, TeamOutlined, SafetyOutlined, DownloadOutlined, SearchOutlined, PlusOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

// 用户管理数据（2025年5月）
const userList = [
  { id: 1, username: 'admin', name: '王建国', department: '信息部', role: '超级管理员', status: '启用', lastLogin: '2025-05-10 08:00:00' },
  { id: 2, username: 'zhangsan', name: '李明', department: '安保部', role: '安保主管', status: '启用', lastLogin: '2025-05-10 09:00:00' },
  { id: 3, username: 'lisi', name: '赵倩', department: '行政部', role: '普通用户', status: '禁用', lastLogin: '2025-05-17 16:00:00' },
  { id: 4, username: 'wangwu', name: '陈伟', department: '财务部', role: '普通用户', status: '启用', lastLogin: '2025-05-16 14:30:00' },
  { id: 5, username: 'zhaoliu', name: '刘洋', department: '技术部', role: '普通用户', status: '启用', lastLogin: '2025-05-15 11:20:00' },
  { id: 6, username: 'sunqi', name: '孙婷', department: '管理层', role: '安保主管', status: '禁用', lastLogin: '2025-05-15 10:10:00' },
  { id: 7, username: 'liuba', name: '周磊', department: '行政部', role: '普通用户', status: '启用', lastLogin: '2025-05-14 09:50:00' },
  { id: 8, username: 'chenjiu', name: '马丽', department: '信息部', role: '普通用户', status: '启用', lastLogin: '2025-05-13 08:40:00' },
  { id: 9, username: 'yangshi', name: '杨帆', department: '财务部', role: '普通用户', status: '禁用', lastLogin: '2025-05-12 07:30:00' },
  { id: 10, username: 'huangyi', name: '黄俊', department: '安保部', role: '安保主管', status: '启用', lastLogin: '2025-05-11 06:20:00' },
  { id: 11, username: 'zhouxin', name: '周欣', department: '技术部', role: '普通用户', status: '启用', lastLogin: '2025-05-10 12:00:00' },
  { id: 12, username: 'wutian', name: '吴天宇', department: '管理层', role: '超级管理员', status: '启用', lastLogin: '2025-05-10 09:00:00' },
];

// 角色权限数据
const roleList = [
  { id: 1, name: '超级管理员', description: '系统最高权限', userCount: 2, createTime: '2025-05-10 00:00:00' },
  { id: 2, name: '安保主管', description: '安保系统管理权限', userCount: 3, createTime: '2025-05-10 00:00:00' },
  { id: 3, name: '普通用户', description: '基础操作权限', userCount: 20, createTime: '2025-05-10 00:00:00' },
  { id: 4, name: '财务专员', description: '财务数据管理权限', userCount: 2, createTime: '2025-05-11 00:00:00' },
  { id: 5, name: '技术支持', description: '技术部相关权限', userCount: 2, createTime: '2025-05-12 00:00:00' },
  { id: 6, name: '访客管理', description: '访客预约与审核权限', userCount: 1, createTime: '2025-05-13 00:00:00' },
];

// 系统配置数据
const configList = [
  { id: 1, name: '系统名称', key: 'systemName', value: '智慧园区综合管理平台', type: 'text' },
  { id: 2, name: '系统Logo', key: 'systemLogo', value: 'logo.png', type: 'image' },
  { id: 3, name: '登录验证码', key: 'loginCaptcha', value: true, type: 'switch' },
  { id: 4, name: '密码有效期', key: 'passwordExpireDays', value: 90, type: 'number' },
  { id: 5, name: '数据备份周期', key: 'backupCycle', value: '每周', type: 'text' },
  { id: 6, name: '最大登录失败次数', key: 'maxLoginFail', value: 5, type: 'number' },
  { id: 7, name: '支持多语言', key: 'multiLang', value: false, type: 'switch' },
  { id: 8, name: '默认主题色', key: 'themeColor', value: '#1890ff', type: 'text' },
  { id: 9, name: '启用消息推送', key: 'msgPush', value: true, type: 'switch' },
  { id: 10, name: '允许外部访问', key: 'externalAccess', value: false, type: 'switch' },
];

// 权限树数据
const permissionTree = [
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:user' },
      { title: '角色管理', key: 'system:role' },
      { title: '系统配置', key: 'system:config' },
    ],
  },
  {
    title: '视频监控',
    key: 'video',
    children: [
      { title: '实时监控', key: 'video:realtime' },
      { title: '录像回放', key: 'video:playback' },
      { title: '电视墙', key: 'video:wall' },
    ],
  },
  {
    title: '门禁管理',
    key: 'access',
    children: [
      { title: '设备管理', key: 'access:device' },
      { title: '权限管理', key: 'access:permission' },
      { title: '记录查询', key: 'access:record' },
    ],
  },
];

export default function System() {
  const [tab, setTab] = useState('user');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState(['system:user', 'system:role']);

  // 用户管理Tab
  const userColumns = [
    { title: '用户ID', dataIndex: 'id', key: 'id' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: s => s==='启用'?<Tag color="green">启用</Tag>:<Tag color="red">禁用</Tag>
    },
    { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}} style={{marginRight:8}}>编辑</Button>
          <Button icon={<LockOutlined />} onClick={()=>message.success('模拟重置密码成功')}>重置密码</Button>
        </>
      )
    }
  ];
  const renderUser = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索用户名/姓名/部门"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增用户</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={userColumns}
        dataSource={userList.filter(u => u.username.includes(search) || u.name.includes(search) || u.department.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title="用户信息"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(()=>{setModalOpen(false);message.success('模拟保存成功')})}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{required:true,message:'请输入用户名'}]}><Input /></Form.Item>
          <Form.Item name="name" label="姓名" rules={[{required:true,message:'请输入姓名'}]}><Input /></Form.Item>
          <Form.Item name="department" label="部门" rules={[{required:true,message:'请选择部门'}]}>
            <Select>
              <Option value="信息部">信息部</Option>
              <Option value="安保部">安保部</Option>
              <Option value="行政部">行政部</Option>
            </Select>
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{required:true,message:'请选择角色'}]}>
            <Select>
              <Option value="超级管理员">超级管理员</Option>
              <Option value="安保主管">安保主管</Option>
              <Option value="普通用户">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请选择状态'}]}>
            <Select>
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // 角色权限Tab
  const roleColumns = [
    { title: '角色ID', dataIndex: 'id', key: 'id' },
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
      )
    }
  ];
  const renderRole = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索角色名称"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增角色</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={roleColumns}
        dataSource={roleList.filter(r => r.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title="角色信息"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(()=>{setModalOpen(false);message.success('模拟保存成功')})}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{required:true,message:'请输入角色名称'}]}><Input /></Form.Item>
          <Form.Item name="description" label="描述" rules={[{required:true,message:'请输入描述'}]}><Input.TextArea rows={4} /></Form.Item>
          <Form.Item label="权限设置">
            <Tree
              checkable
              checkedKeys={checkedKeys}
              onCheck={setCheckedKeys}
              treeData={permissionTree}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // 系统配置Tab
  const configColumns = [
    { title: '配置ID', dataIndex: 'id', key: 'id' },
    { title: '配置名称', dataIndex: 'name', key: 'name' },
    { title: '配置键', dataIndex: 'key', key: 'key' },
    { 
      title: '配置值', 
      dataIndex: 'value', 
      key: 'value',
      render: (v, record) => {
        switch(record.type) {
          case 'switch':
            return <Switch checked={v} disabled />;
          case 'image':
            return <img src={v} alt="logo" style={{height:32}} />;
          default:
            return v;
        }
      }
    },
    { title: '类型', dataIndex: 'type', key: 'type' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
      )
    }
  ];
  const renderConfig = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索配置名称/键"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={configColumns}
        dataSource={configList.filter(c => c.name.includes(search) || c.key.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Modal
        open={modalOpen}
        title="系统配置"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(()=>{setModalOpen(false);message.success('模拟保存成功')})}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="配置名称" rules={[{required:true,message:'请输入配置名称'}]}><Input /></Form.Item>
          <Form.Item name="key" label="配置键" rules={[{required:true,message:'请输入配置键'}]}><Input /></Form.Item>
          <Form.Item name="value" label="配置值" rules={[{required:true,message:'请输入配置值'}]}>
            {form.getFieldValue('type') === 'switch' ? (
              <Switch />
            ) : form.getFieldValue('type') === 'image' ? (
              <Input type="file" accept="image/*" />
            ) : (
              <Input />
            )}
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{required:true,message:'请选择类型'}]}>
            <Select>
              <Option value="text">文本</Option>
              <Option value="number">数字</Option>
              <Option value="switch">开关</Option>
              <Option value="image">图片</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><SettingOutlined /> 系统管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><UserOutlined /> 用户管理</span>} key="user">
            {renderUser()}
          </TabPane>
          <TabPane tab={<span><TeamOutlined /> 角色权限</span>} key="role">
            {renderRole()}
          </TabPane>
          <TabPane tab={<span><SafetyOutlined /> 系统配置</span>} key="config">
            {renderConfig()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 