import React, { useState } from 'react';
import { Card, Table, Input, Row, Col } from 'antd';
import { SearchOutlined, PieChartOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { areaList as mockAreaList } from './parkingMock';
import { Pie } from '@ant-design/charts';

export default function Area() {
  const [search, setSearch] = useState('');
  const [data] = useState(mockAreaList);

  const columns = [
    { title: '场区ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '总车位', dataIndex: 'total', key: 'total' },
    { title: '已用车位', dataIndex: 'used', key: 'used' },
    { title: '空闲车位', key: 'free', render: (_, r) => r.total - r.used },
  ];

  // 统计图数据
  const pieData = data.map(a => ({ type: a.name, value: a.used }));

  return (
    <Card className="content-card">
      <Row gutter={24}>
        <Col span={16}>
          <div style={{marginBottom:16,display:'flex',gap:16}}>
            <Input.Search
              placeholder="搜索场区名称"
              allowClear
              enterButton={<SearchOutlined />}
              style={{width:300}}
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <Table
            columns={columns}
            dataSource={data.filter(a => a.name.includes(search))}
            rowKey="id"
            pagination={{pageSize:5}}
          />
        </Col>
        <Col span={8}>
          <Card title={<><EnvironmentOutlined /> 场区地图分布</>} variant="borderless" style={{marginBottom:16}}>
            <div style={{height:160,position:'relative',background:'#f5f5f5',borderRadius:8,overflow:'hidden'}}>
              <svg width="100%" height="100%" viewBox="0 0 400 160">
                <rect x="40" y="20" width="320" height="120" rx="24" fill="#f6ffed" stroke="#b7eb8f" strokeWidth="3" />
                {data.map(area => {
                  const x = 40 + ((area.lng-117.118)/0.009)*320;
                  const y = 140 - ((area.lat-36.646)/0.006)*120;
                  return (
                    <g key={area.id}>
                      <circle cx={x} cy={y} r="12" fill="#1890ff" stroke="#fff" strokeWidth="2" />
                      <text x={x+16} y={y+6} fontSize="14" fill="#333">{area.name}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>
          <Card title={<><PieChartOutlined /> 车位使用率</>} variant="borderless">
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              radius={0.9}
              label={{ type: 'outer', content: (data) => `${data.type} ${(data.percent*100).toFixed(1)}%` }}
              legend={{ position: 'bottom' }}
              height={160}
              color={['#1890ff', '#faad14', '#52c41a', '#eb2f96']}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
} 