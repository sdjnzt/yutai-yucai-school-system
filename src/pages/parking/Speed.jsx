import React, { useState } from 'react';
import { Card, Table, Input, Tag, Row, Col } from 'antd';
import { SearchOutlined, LineChartOutlined } from '@ant-design/icons';
import { speedList as mockSpeedList } from './parkingMock';
import { Line } from '@ant-design/charts';

export default function Speed() {
  const [search, setSearch] = useState('');
  const [data] = useState(mockSpeedList);

  const columns = [
    { title: '报警ID', dataIndex: 'id', key: 'id' },
    { title: '车牌', dataIndex: 'car', key: 'car' },
    { title: '场区', dataIndex: 'area', key: 'area' },
    { title: '速度', dataIndex: 'speed', key: 'speed', render: s => <Tag color={s>40?'red':'orange'}>{s} km/h</Tag> },
    { title: '限速', dataIndex: 'limit', key: 'limit', render: l => <Tag color="blue">{l} km/h</Tag> },
    { title: '报警时间', dataIndex: 'time', key: 'time' },
  ];

  // 趋势图数据
  const chartData = data.map(d => ({
    time: d.time.slice(5, 16),
    speed: d.speed,
    car: d.car
  }));

  return (
    <Card className="content-card">
      <Row gutter={24}>
        <Col span={16}>
          <div style={{marginBottom:16,display:'flex',gap:16}}>
            <Input.Search
              placeholder="搜索车牌/场区"
              allowClear
              enterButton={<SearchOutlined />}
              style={{width:300}}
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <Table
            columns={columns}
            dataSource={data.filter(s => s.car.includes(search) || s.area.includes(search))}
            rowKey="id"
            pagination={{pageSize:5}}
          />
        </Col>
        <Col span={8}>
          <Card title={<><LineChartOutlined /> 超速报警趋势</>} variant="borderless">
            <Line
              data={chartData}
              xField="time"
              yField="speed"
              seriesField="car"
              point={{ size: 4, shape: 'circle' }}
              color={[ '#ff4d4f', '#faad14', '#1890ff', '#52c41a' ]}
              height={240}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
} 