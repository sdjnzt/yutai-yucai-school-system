import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Select, Button, Slider, Space, message, Input } from 'antd';
import { DownloadOutlined, FastBackwardOutlined, FastForwardOutlined, PauseOutlined, PlayCircleOutlined, SearchOutlined } from '@ant-design/icons';

const cameras = [
  { key: '1', name: '1号楼大门', url: `${import.meta.env.BASE_URL}static/222.jpg` },
  { key: '2', name: '2号楼大门', url: `${import.meta.env.BASE_URL}static/333.jpg` },
  { key: '3', name: '3号楼大门', url: `${import.meta.env.BASE_URL}static/444.png` },
  { key: '4', name: '4号楼大门', url: `${import.meta.env.BASE_URL}static/888.png` },
];

export default function Playback() {
  const [selected, setSelected] = useState(['1']);
  const [range, setRange] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [search, setSearch] = useState('');

  const handleDownload = (cam) => {
    message.success(`${cam.name} 录像已下载`);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          mode="multiple"
          placeholder="选择摄像头"
          style={{ width: 300, marginRight: 8 }}
          options={cameras.map(c => ({ value: c.key, label: c.name }))}
          value={selected}
          onChange={setSelected}
        />
        <DatePicker.RangePicker style={{ marginRight: 8 }} value={range} onChange={setRange} />
        <Input
          placeholder="智能检索（如事件/人脸/车牌）"
          style={{ width: 220, marginRight: 8 }}
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button type="primary">查询录像</Button>
      </div>
      <Row gutter={16}>
        {selected.map(key => {
          const cam = cameras.find(c => c.key === key);
          return (
            <Col span={12} key={key} style={{ marginBottom: 16 }}>
              <Card title={cam.name + ' 回放'} extra={<Button icon={<DownloadOutlined />} onClick={() => handleDownload(cam)}>下载</Button>}>
                <img src={cam.url} alt="回放" style={{ width: '100%', marginBottom: 8 }} />
                <Space style={{ marginBottom: 8 }}>
                  <Button icon={<FastBackwardOutlined />} onClick={() => setSpeed(s => Math.max(0.5, s - 0.5))}>慢放</Button>
                  <Button icon={playing ? <PauseOutlined /> : <PlayCircleOutlined />} onClick={() => setPlaying(p => !p)}>{playing ? '暂停' : '播放'}</Button>
                  <Button icon={<FastForwardOutlined />} onClick={() => setSpeed(s => Math.min(4, s + 0.5))}>快进</Button>
                  <span>速度：{speed}x</span>
                </Space>
                <Slider min={0} max={100} defaultValue={0} tooltip={{ open: false }} style={{ width: '90%' }} />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
} 