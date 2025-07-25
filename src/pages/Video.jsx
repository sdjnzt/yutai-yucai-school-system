import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Input, Row, Col, Modal, Select, DatePicker, message } from 'antd';
import { DownloadOutlined, SearchOutlined, VideoCameraOutlined, PlayCircleOutlined, AppstoreOutlined, FireOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;

// 模拟摄像头数据（2025年5月）
const cameraList = [
  { id: 1, location: '大门', status: '在线', lastUpdate: '2025-05-10 08:00:00', stream: 'preview1.jpg' },
  { id: 2, location: '停车场', status: '在线', lastUpdate: '2025-05-10 08:05:00', stream: 'preview2.jpg' },
  { id: 3, location: '办公楼', status: '离线', lastUpdate: '2025-05-10 07:50:00', stream: 'preview3.jpg' },
  { id: 4, location: '仓库', status: '在线', lastUpdate: '2025-05-10 08:10:00', stream: 'preview4.jpg' },
  { id: 5, location: '园区西门', status: '在线', lastUpdate: '2025-05-10 08:12:00', stream: 'preview5.jpg' },
];

// 模拟录像数据（2025年5月）
const recordList = [
  { id: 101, camera: '大门', date: '2025-05-10', start: '08:00', end: '08:30', size: '200MB' },
  { id: 102, camera: '停车场', date: '2025-05-10', start: '09:00', end: '09:30', size: '180MB' },
  { id: 103, camera: '办公楼', date: '2025-05-11', start: '10:00', end: '10:30', size: '210MB' },
  { id: 104, camera: '仓库', date: '2025-05-12', start: '11:00', end: '11:30', size: '190MB' },
];

// 模拟热成像数据（2025年5月）
const thermalList = [
  { id: 201, location: '仓库', date: '2025-05-10', maxTemp: 68, minTemp: 32, status: '正常' },
  { id: 202, location: '办公楼', date: '2025-05-11', maxTemp: 85, minTemp: 35, status: '异常' },
  { id: 203, location: '停车场', date: '2025-05-12', maxTemp: 70, minTemp: 30, status: '正常' },
];

export default function Video() {
  const [tab, setTab] = useState('realtime');
  const [previewModal, setPreviewModal] = useState(false);
  const [previewCamera, setPreviewCamera] = useState(null);
  const [search, setSearch] = useState('');
  const [recordDate, setRecordDate] = useState(null);
  const [thermalDate, setThermalDate] = useState(null);

  // 实时监控Tab
  const renderRealtime = () => (
    <Row gutter={[16, 16]}>
      {cameraList.filter(c => c.location.includes(search)).map(cam => (
        <Col xs={24} sm={12} md={8} lg={6} key={cam.id}>
          <Card
            hoverable
            cover={<div style={{height:180,background:'#222',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}><VideoCameraOutlined style={{fontSize:48}} /></div>}
            actions={[
              <Button type="link" icon={<PlayCircleOutlined />} onClick={() => {setPreviewCamera(cam);setPreviewModal(true);}}>预览</Button>
            ]}
          >
            <Card.Meta
              title={cam.location}
              description={<>
                <div>状态：{cam.status}</div>
                <div>最后更新时间：{cam.lastUpdate}</div>
              </>}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );

  // 录像回放Tab
  const recordColumns = [
    { title: '摄像头', dataIndex: 'camera', key: 'camera' },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '开始时间', dataIndex: 'start', key: 'start' },
    { title: '结束时间', dataIndex: 'end', key: 'end' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => <Button icon={<DownloadOutlined />} onClick={() => message.success('模拟下载成功')}>下载</Button>
    }
  ];
  const renderRecord = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Select
          placeholder="选择摄像头"
          allowClear
          style={{width:180}}
          onChange={v => setSearch(v||'')}
        >
          {cameraList.map(cam => <Option key={cam.location} value={cam.location}>{cam.location}</Option>)}
        </Select>
        <DatePicker
          picker="date"
          placeholder="选择日期"
          style={{width:160}}
          value={recordDate}
          onChange={setRecordDate}
          allowClear
        />
        <Button icon={<SearchOutlined />} onClick={()=>{}}>搜索</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={recordColumns}
        dataSource={recordList.filter(r => (!search || r.camera===search) && (!recordDate || r.date===recordDate.format('YYYY-MM-DD')))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  // 电视墙Tab（分屏模拟）
  const renderWall = () => (
    <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
      {[1,2,3,4].map(i => (
        <Card key={i} style={{width:260,height:180,display:'flex',alignItems:'center',justifyContent:'center',background:'#222',color:'#fff'}}>
          <AppstoreOutlined style={{fontSize:40}} />
          <div style={{marginLeft:12}}>分屏{i}</div>
        </Card>
      ))}
    </div>
  );

  // 热成像Tab
  const thermalColumns = [
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '最高温度', dataIndex: 'maxTemp', key: 'maxTemp', render: t => t+'℃' },
    { title: '最低温度', dataIndex: 'minTemp', key: 'minTemp', render: t => t+'℃' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='异常'?<span style={{color:'red'}}>{s}</span>:s },
  ];
  const renderThermal = () => (
    <>
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <DatePicker
          picker="date"
          placeholder="选择日期"
          style={{width:160}}
          value={thermalDate}
          onChange={setThermalDate}
          allowClear
        />
        <Button icon={<SearchOutlined />} onClick={()=>{}}>搜索</Button>
        <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
      </div>
      <Table
        columns={thermalColumns}
        dataSource={thermalList.filter(r => (!thermalDate || r.date===thermalDate.format('YYYY-MM-DD')))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
    </>
  );

  return (
    <div>
      <div className="header">
        <h2 className="page-title"><VideoCameraOutlined /> 视频管理</h2>
      </div>
      <Card className="content-card">
        <Tabs activeKey={tab} onChange={setTab}>
          <TabPane tab={<span><VideoCameraOutlined /> 实时监控</span>} key="realtime">
            <div style={{marginBottom:16,display:'flex',gap:16}}>
              <Input.Search
                placeholder="搜索摄像头位置"
                allowClear
                enterButton={<SearchOutlined />}
                style={{width:300}}
                value={search}
                onChange={e=>setSearch(e.target.value)}
              />
              <Button icon={<DownloadOutlined />} onClick={()=>message.success('模拟导出Excel成功')}>导出Excel</Button>
            </div>
            {renderRealtime()}
          </TabPane>
          <TabPane tab={<span><PlayCircleOutlined /> 录像回放</span>} key="record">
            {renderRecord()}
          </TabPane>
          <TabPane tab={<span><AppstoreOutlined /> 电视墙</span>} key="wall">
            {renderWall()}
          </TabPane>
          <TabPane tab={<span><FireOutlined /> 热成像</span>} key="thermal">
            {renderThermal()}
          </TabPane>
        </Tabs>
      </Card>
      <Modal
        open={previewModal}
        title={previewCamera ? previewCamera.location + ' - 实时预览' : ''}
        onCancel={()=>setPreviewModal(false)}
        footer={null}
        width={600}
      >
        <div style={{height:320,background:'#222',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
          <VideoCameraOutlined style={{fontSize:80}} />
          <span style={{marginLeft:24,fontSize:20}}>实时视频流（模拟）</span>
        </div>
      </Modal>
    </div>
  );
} 