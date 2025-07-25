import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, Space, Tag, Modal, Form, DatePicker, Select, message, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SafetyCertificateOutlined, FileSearchOutlined, BarChartOutlined, DownloadOutlined, QrcodeOutlined, StopOutlined } from '@ant-design/icons';
import QRCode from 'react-qr-code';
import { Line } from '@ant-design/charts';
import * as XLSX from 'xlsx';

const { TabPane } = Tabs;
const { Option } = Select;

// 更真实的中文姓名生成
const commonSurnames = ['王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','胡','朱','高','林','何','郭','马','罗','梁','宋','郑','谢','韩','唐','冯','于','董','萧','程','曹','袁','邓','许','傅','沈','曾','彭','吕','苏','卢','蒋','蔡','贾','丁','魏','薛','叶','阎','余','潘','杜','戴','夏','钟','汪','田','任','姜','范','方','石','姚','谭','廖','邹','熊','金','陆','郝','孔','白','崔','康','毛','邱','秦','江','史','顾','侯','邵','孟','龙','万','段','雷','钱','汤','尹','黎','易','常','武','乔','贺','赖','龚','文'];
const commonNames = ['伟','芳','娜','敏','静','丽','强','磊','军','洋','勇','艳','杰','娟','涛','明','超','秀英','霞','平','刚','桂英','丹','萍','鑫','鹏','华','红','玉兰','飞','玲','桂兰','玉梅','莉','斌','宇','浩','凯','秀兰','俊','旭','健','俊杰','娅','倩','雪','晶','晨','倩','博','欣','佳','瑞','鑫','龙','琳','婷','雪','璐','佳','悦','璇','倩','颖','涵','悦','嘉','瑞','妍','宁','莹','媛','璐','欣','怡','婧','雯','璇','婕','晨','璐','颖','琳','雪','婷','悦','嘉','瑞','妍','宁','莹','媛','璐','欣','怡','婧','雯','璇','婕','晨'];
function genChineseName() {
  const surname = commonSurnames[Math.floor(Math.random()*commonSurnames.length)];
  const given = commonNames[Math.floor(Math.random()*commonNames.length)] + (Math.random()>0.5 ? commonNames[Math.floor(Math.random()*commonNames.length)] : '');
  return surname + given;
}

const purposes = ['商务洽谈', '面试', '设备维修', '参观', '合作', '技术交流', '考察', '培训', '会议', '签约'];
// const hosts = ['李经理', '王总监', '张主管', '刘主任', '陈助理'];
function randomItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function randomDate(start, end) { const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); return d.toISOString().slice(0,19).replace('T',' '); }

const initAppointmentList = Array.from({length: 40}, (_,i) => ({
  id: i+1,
  name: genChineseName(),
  visitTime: randomDate(new Date('2025-05-10'), new Date('2025-05-31')),
  purpose: randomItem(purposes),
  host: genChineseName(),
  status: ['待审核','已通过','已拒绝'][Math.floor(Math.random()*3)]
}));
const initAuditList = Array.from({length: 20}, (_,i) => ({
  id: 100+i+1,
  name: genChineseName(),
  visitTime: randomDate(new Date('2025-05-10'), new Date('2025-05-31')),
  purpose: randomItem(purposes),
  host: genChineseName(),
  status: '待审核'
}));
const initAuthList = Array.from({length: 20}, (_,i) => ({
  id: 200+i+1,
  name: genChineseName(),
  visitTime: randomDate(new Date('2025-05-10'), new Date('2025-05-31')),
  access: randomItem(['大门','办公楼','会议室']),
  car: Math.random()>0.5 ? `鲁A${Math.floor(Math.random()*90000+10000)}` : '',
  status: ['已下发','未下发'][Math.floor(Math.random()*2)],
  host: genChineseName(),
}));
const initRecordList = Array.from({length: 30}, (_,i) => ({
  id: 300+i+1,
  name: genChineseName(),
  visitTime: randomDate(new Date('2025-05-10'), new Date('2025-05-31')),
  purpose: randomItem(purposes),
  host: genChineseName(),
  status: ['已离开','在访'][Math.floor(Math.random()*2)]
}));
const initBlacklist = Array.from({length: 15}, (_,i) => ({
  id: 400+i+1,
  name: genChineseName(),
  reason: randomItem(['多次违规','恶意闯入','未带证件','扰乱秩序','冒用身份']),
  time: randomDate(new Date('2025-05-10'), new Date('2025-05-31')).slice(0,10)
}));
const statDataDay = Array.from({length: 7}, (_,i)=>({ date: `2025-05-0${i+1}`, count: Math.floor(Math.random()*10+3) }));
const statDataWeek = Array.from({length: 4}, (_,i)=>({ date: `第${i+1}周`, count: Math.floor(Math.random()*30+10) }));
const statDataMonth = Array.from({length: 6}, (_,i)=>({ date: `2025-0${i+1}`, count: Math.floor(Math.random()*50+20) }));

export default function Visitor() {
  const [tab, setTab] = useState('appointment');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [qrModal, setQrModal] = useState({ open: false, id: null });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appointmentList, setAppointmentList] = useState(initAppointmentList);
  const [auditList, setAuditList] = useState(initAuditList);
  const [authList, setAuthList] = useState(initAuthList);
  const [recordList] = useState(initRecordList);
  const [blacklist, setBlacklist] = useState(initBlacklist);
  const [statType, setStatType] = useState('day');

  // 访客预约Tab
  const appointmentColumns = [
    { title: '访客ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '访问目的', dataIndex: 'purpose', key: 'purpose' },
    { title: '被访人', dataIndex: 'host', key: 'host' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='待审核'?<Tag color="orange">待审核</Tag>:s==='已通过'?<Tag color="green">已通过</Tag>:<Tag color="red">已拒绝</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="二维码"><Button icon={<QrcodeOutlined />} onClick={()=>setQrModal({ open: true, id: record.id })} /></Tooltip>
          <Button icon={<EditOutlined />} onClick={()=>{form.setFieldsValue(record);setModalOpen(true);}}>编辑</Button>
          <Button icon={<DeleteOutlined />} danger onClick={()=>{
            setAppointmentList(list=>list.filter(a=>a.id!==record.id));
            message.success('删除成功');
          }}>删除</Button>
        </Space>
      )
    }
  ];
  const renderAppointment = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{form.resetFields();setModalOpen(true);}}>新增预约</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(appointmentList, '访客预约')}>导出Excel</Button>
      </div>
      <Table
        rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
        columns={appointmentColumns}
        dataSource={appointmentList.filter(a => a.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Space style={{marginBottom:16}}>
        <Button type="primary" icon={<CheckCircleOutlined />} disabled={!selectedRowKeys.length} onClick={()=>{
          setAppointmentList(list=>list.map(a=>selectedRowKeys.includes(a.id)?{...a,status:'已通过'}:a));
          setSelectedRowKeys([]);
          message.success('批量通过成功');
        }}>批量通过</Button>
        <Button danger icon={<StopOutlined />} disabled={!selectedRowKeys.length} onClick={()=>{
          setAppointmentList(list=>list.map(a=>selectedRowKeys.includes(a.id)?{...a,status:'已拒绝'}:a));
          setSelectedRowKeys([]);
          message.success('批量拒绝成功');
        }}>批量拒绝</Button>
      </Space>
      <Modal
        open={modalOpen}
        title="访客预约"
        onCancel={()=>setModalOpen(false)}
        onOk={()=>{form.validateFields().then(values=>{
          if (form.getFieldValue('id')) {
            setAppointmentList(list=>list.map(a=>a.id===form.getFieldValue('id')?{...a,...values}:a));
            message.success('编辑成功');
          } else {
            setAppointmentList(list=>[...list,{...values,id:Date.now(),status:'待审核'}]);
            message.success('新增成功');
          }
          setModalOpen(false);
        })}}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" style={{display:'none'}}><Input /></Form.Item>
          <Form.Item name="name" label="姓名" rules={[{required:true,message:'请输入姓名'}]}><Input /></Form.Item>
          <Form.Item name="visitTime" label="访问时间" rules={[{required:true,message:'请选择访问时间'}]}><DatePicker showTime style={{width:'100%'}} /></Form.Item>
          <Form.Item name="purpose" label="访问目的" rules={[{required:true,message:'请输入访问目的'}]}><Input /></Form.Item>
          <Form.Item name="host" label="被访人" rules={[{required:true,message:'请输入被访人'}]}><Input /></Form.Item>
        </Form>
      </Modal>
      <Modal
        open={qrModal.open}
        title="访客预约二维码"
        onCancel={()=>setQrModal({ open: false, id: null })}
        footer={null}
      >
        <div style={{textAlign:'center',padding:24}}>
          <QRCode value={String(qrModal.id)} style={{ width: 200, height: 200 }} />
          <div style={{marginTop:16}}>请凭此二维码扫码入园</div>
        </div>
      </Modal>
    </>
  );

  // 审核管理Tab
  const auditColumns = [
    { title: '访客ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '访问目的', dataIndex: 'purpose', key: 'purpose' },
    { title: '被访人', dataIndex: 'host', key: 'host' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color="orange">{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<CheckCircleOutlined />} type="primary" onClick={()=>{
            setAuditList(list=>list.map(a=>a.id===record.id?{...a,status:'已通过'}:a));
            message.success('审核通过');
          }}>通过</Button>
          <Button icon={<DeleteOutlined />} danger onClick={()=>{
            setAuditList(list=>list.filter(a=>a.id!==record.id));
            message.success('已拒绝');
          }}>拒绝</Button>
        </Space>
      )
    }
  ];
  const renderAudit = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(auditList, '审核管理')}>导出Excel</Button>
      </div>
      <Table
        columns={auditColumns}
        dataSource={auditList.filter(a => a.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 权限下发Tab
  const authColumns = [
    { title: '访客ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '门禁权限', dataIndex: 'access', key: 'access' },
    { title: '车牌号', dataIndex: 'car', key: 'car' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='已下发'?<Tag color="green">已下发</Tag>:<Tag color="orange">未下发</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<SafetyCertificateOutlined />} type="primary" onClick={()=>{
          setAuthList(list=>list.map(a=>a.id===record.id?{...a,status:'已下发'}:a));
          message.success('权限下发成功');
        }}>下发</Button>
      )
    }
  ];
  const renderAuth = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(authList, '权限下发')}>导出Excel</Button>
      </div>
      <Table
        columns={authColumns}
        dataSource={authList.filter(a => a.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 访客记录Tab
  const recordColumns = [
    { title: '访客ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '访问时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '访问目的', dataIndex: 'purpose', key: 'purpose' },
    { title: '被访人', dataIndex: 'host', key: 'host' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='在访'?<Tag color="green">在访</Tag>:<Tag>{s}</Tag> },
  ];
  const renderRecord = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(recordList, '访客记录')}>导出Excel</Button>
      </div>
      <Table
        columns={recordColumns}
        dataSource={recordList.filter(a => a.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 黑名单Tab
  const blacklistColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '原因', dataIndex: 'reason', key: 'reason' },
    { title: '拉黑时间', dataIndex: 'time', key: 'time' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<DeleteOutlined />} danger onClick={()=>{
          setBlacklist(list=>list.filter(b=>b.id!==record.id));
          message.success('移除黑名单成功');
        }}>移除</Button>
      )
    }
  ];
  const renderBlacklist = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索姓名"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={()=>{
          const name = prompt('请输入姓名');
          if (name) {
            setBlacklist(list=>[...list,{id:Date.now(),name,reason:'手动添加',time:new Date().toISOString().slice(0,10)}]);
            message.success('添加成功');
          }
        }}>添加黑名单</Button>
      </div>
      <Table
        columns={blacklistColumns}
        dataSource={blacklist.filter(b => b.name.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 统计分析Tab
  const statData = statType==='day'?statDataDay:statType==='week'?statDataWeek:statDataMonth;
  const renderStat = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16,alignItems:'center'}}>
        <Select value={statType} onChange={setStatType} style={{width:120}}>
          <Option value="day">按日</Option>
          <Option value="week">按周</Option>
          <Option value="month">按月</Option>
        </Select>
        <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(statData, '访客统计')}>导出Excel</Button>
      </div>
      <Card title="访客量趋势" style={{marginBottom:24}}>
        <Line
          data={statData}
          xField="date"
          yField="count"
          point={{ size: 4, shape: 'circle' }}
          color="#1890ff"
          height={320}
          animation
        />
      </Card>
    </>
  );

  // 导出Excel工具
  function exportExcel(data, sheetName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  }

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><FileSearchOutlined /> 访客管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><PlusOutlined /> 访客预约</span>} key="appointment">
            {renderAppointment()}
          </TabPane>
          <TabPane tab={<span><CheckCircleOutlined /> 审核管理</span>} key="audit">
            {renderAudit()}
          </TabPane>
          <TabPane tab={<span><SafetyCertificateOutlined /> 权限下发</span>} key="auth">
            {renderAuth()}
          </TabPane>
          <TabPane tab={<span><FileSearchOutlined /> 访客记录</span>} key="record">
            {renderRecord()}
          </TabPane>
          <TabPane tab={<span><BarChartOutlined /> 统计分析</span>} key="stat">
            {renderStat()}
          </TabPane>
          <TabPane tab={<span><StopOutlined /> 黑名单</span>} key="blacklist">
            {renderBlacklist()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
} 