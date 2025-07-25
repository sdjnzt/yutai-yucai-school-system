import React, { useState } from 'react';
import { Card, Row, Col, Select, Button, Space, Modal, message } from 'antd';
import { FullscreenOutlined, CameraOutlined, UpOutlined, DownOutlined, LeftOutlined, RightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

const allCameras = [
  { key: '1', name: '1号楼大门', url: `${import.meta.env.BASE_URL}static/222.jpg`, resolution: '1920x1080', stream: '主码流' },
  { key: '2', name: '2号楼大门', url: `${import.meta.env.BASE_URL}static/333.jpg`, resolution: '1280x720', stream: '子码流' },
  { key: '3', name: '3号楼大门', url: `${import.meta.env.BASE_URL}static/444.png`, resolution: '1920x1080', stream: '主码流' },
  { key: '4', name: '4号楼大门', url: `${import.meta.env.BASE_URL}static/888.png`, resolution: '1280x720', stream: '子码流' },
];

const splitModes = [
  { value: 1, label: '单画面' },
  { value: 4, label: '4分屏' },
  { value: 9, label: '9分屏' },
];

function getNow() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') + ' ' +
    String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + ':' + String(d.getSeconds()).padStart(2,'0');
}

export default function LiveView() {
  const [split, setSplit] = useState(4);
  const [selected, setSelected] = useState(allCameras.slice(0, 4).map(c => c.key));
  const [fullscreen, setFullscreen] = useState(null);
  const [now, setNow] = useState(getNow());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(getNow()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (idx, value) => {
    const newSel = [...selected];
    newSel[idx] = value;
    setSelected(newSel);
  };

  const handleSnap = (cam) => {
    message.success(`${cam.name} 已抓拍`);
  };

  const handlePTZ = (cam, action) => {
    message.info(`${cam.name} 云台操作：${action}`);
  };

  const grid = Math.sqrt(split);
  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select value={split} options={splitModes} onChange={v => {
          setSplit(v);
          setSelected(allCameras.slice(0, v).map(c => c.key));
        }} />
      </Space>
      <Row gutter={16}>
        {Array.from({ length: split }).map((_, idx) => {
          const cam = allCameras.find(c => c.key === selected[idx]);
          return (
            <Col span={24 / grid} key={idx} style={{ marginBottom: 16 }}>
              <Card
                title={
                  <Select
                    value={selected[idx]}
                    style={{ width: 180 }}
                    options={allCameras.map(c => ({ value: c.key, label: c.name }))}
                    onChange={v => handleChange(idx, v)}
                  />
                }
                extra={<Button icon={<FullscreenOutlined />} onClick={() => setFullscreen(cam)} />}
                bordered
              >
                <div style={{ position: 'relative' }}>
                  <img src={cam?.url} alt={cam?.name} style={{ width: '100%', marginBottom: 8 }} />
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 14, padding: '2px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: 1 }}>
                    <span>
                      {cam?.name} | {cam?.resolution} | {cam?.stream}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{now}</span>
                  </div>
                </div>
                <Space>
                  <Button icon={<CameraOutlined />} onClick={() => handleSnap(cam)}>抓拍</Button>
                  <Button icon={<UpOutlined />} onClick={() => handlePTZ(cam, '上')}>上</Button>
                  <Button icon={<DownOutlined />} onClick={() => handlePTZ(cam, '下')}>下</Button>
                  <Button icon={<LeftOutlined />} onClick={() => handlePTZ(cam, '左')}>左</Button>
                  <Button icon={<RightOutlined />} onClick={() => handlePTZ(cam, '右')}>右</Button>
                  <Button icon={<ZoomInOutlined />} onClick={() => handlePTZ(cam, '变焦+')}>变焦+</Button>
                  <Button icon={<ZoomOutOutlined />} onClick={() => handlePTZ(cam, '变焦-')}>变焦-</Button>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Modal
        open={!!fullscreen}
        title={fullscreen?.name + ' 全屏预览'}
        onCancel={() => setFullscreen(null)}
        footer={null}
        width={900}
      >
        {fullscreen && (
          <div style={{ position: 'relative' }}>
            <img src={fullscreen.url} alt={fullscreen.name} style={{ width: '100%' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 16, padding: '4px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: 1 }}>
              <span>{fullscreen.name} | {fullscreen.resolution} | {fullscreen.stream}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 15 }}>{now}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 