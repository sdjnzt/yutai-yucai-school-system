import React, { useState } from 'react';
import { Card, Table, Input, Tag, Row, Col, Modal } from 'antd';
import { SearchOutlined, PieChartOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { parkingList as mockParkingList } from './parkingMock';
import { Pie } from '@ant-design/charts';

export default function Parking() {
  const [search, setSearch] = useState('');
  const [data] = useState(mockParkingList);
  const [modal, setModal] = useState({ open: false, record: null });

  const columns = [
    { title: '车位ID', dataIndex: 'id', key: 'id' },
    { title: '编号', dataIndex: 'code', key: 'code' },
    { title: '所属场区', dataIndex: 'area', key: 'area' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s==='空闲'?<Tag color="green">空闲</Tag>:<Tag color="red">占用</Tag> },
  ];

  // 统计图数据
  const statusCount = data.reduce((acc, cur) => { acc[cur.status] = (acc[cur.status]||0)+1; return acc; }, {});
  const pieData = Object.entries(statusCount).map(([type, value]) => ({ type, value }));

  return (
    <Card className="content-card">
      <Row gutter={24}>
        <Col span={16}>
          <div style={{marginBottom:16,display:'flex',gap:16}}>
            <Input.Search
              placeholder="搜索车位编号/场区"
              allowClear
              enterButton={<SearchOutlined />}
              style={{width:300}}
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <Table
            columns={columns}
            dataSource={data.filter(p => p.code.includes(search) || p.area.includes(search))}
            rowKey="id"
            pagination={{pageSize:5}}
          />
        </Col>
        <Col span={8}>
          <Card title={<><EnvironmentOutlined /> 车位地图分布</>} variant="borderless" style={{marginBottom:16}}>
            <div style={{height:160,position:'relative',background:'#f5f5f5',borderRadius:8,overflow:'hidden'}}>
              <svg width="100%" height="100%" viewBox="0 0 400 160">
                <rect x="40" y="20" width="320" height="120" rx="24" fill="#fffbe6" stroke="#ffe58f" strokeWidth="3" />
                {data.map(p => {
                  const x = 40 + ((p.lng-117.118)/0.009)*320;
                  const y = 140 - ((p.lat-36.646)/0.006)*120;
                  let color = '#52c41a';
                  if (p.status==='占用') color = '#ff4d4f';
                  else if (p.status==='预约') color = '#faad14';
                  else if (p.status==='故障') color = '#bfbfbf';
                  return (
                    <g key={p.id} style={{cursor:'pointer'}} onClick={()=>setModal({ open: true, record: p })}>
                      <circle cx={x} cy={y} r="7" fill={color} stroke="#fff" strokeWidth="2" />
                      <text x={x+10} y={y+4} fontSize="10" fill="#333">{p.code}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <Modal
              open={modal.open}
              title="车位详情"
              onCancel={()=>setModal({ open: false, record: null })}
              footer={null}
            >
              {modal.record && (
                <div>
                  <p><b>编号：</b>{modal.record.code}</p>
                  <p><b>所属场区：</b>{modal.record.area}</p>
                  <p><b>状态：</b>{modal.record.status}</p>
                  <p><b>类型：</b>{modal.record.type}</p>
                  <p><b>经度：</b>{modal.record.lng}</p>
                  <p><b>纬度：</b>{modal.record.lat}</p>
                </div>
              )}
            </Modal>
          </Card>
          <Card title={<><PieChartOutlined /> 车位状态分布</>} variant="borderless">
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              radius={0.9}
              label={{ type: 'outer', content: (data) => `${data.type} ${(data.percent*100).toFixed(1)}%` }}
              legend={{ position: 'bottom' }}
              height={160}
              color={['#52c41a', '#ff4d4f', '#faad14', '#1890ff']}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
} 