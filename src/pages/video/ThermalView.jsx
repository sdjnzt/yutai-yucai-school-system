import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, Modal, List, Badge, message } from 'antd';
import * as echarts from 'echarts';

const mockThermals = [
  { key: '1', name: '1号楼北门热成像', temp: 36.5, status: '正常', url: '/static/888.png', history: [36.2, 36.4, 36.5, 36.5, 36.6], alarms: [], maintain: '2025-07-01' },
  { key: '2', name: '2号楼南门热成像', temp: 38.2, status: '高温预警', url: '/static/777.png', history: [36.8, 37.2, 37.8, 38.0, 38.2], alarms: ['2025-05-10 09:10 高温38.2℃'], maintain: '2025-05-10' },
  { key: '3', name: '3号楼西门热成像', temp: 35.9, status: '正常', url: '/static/555.png', history: [35.7, 35.8, 35.9, 35.9, 35.9], alarms: [], maintain: '2025-05-10' },
];

export default function ThermalView() {
  const [modal, setModal] = useState({ open: false, record: null });

  const showHistory = (cam) => {
    setModal({ open: true, record: cam });
    setTimeout(() => {
      if (!modal.open) return;
      const chart = echarts.init(document.getElementById('temp-history'));
      chart.setOption({
        title: { text: cam.name + ' 温度历史' },
        xAxis: { type: 'category', data: ['09:00', '09:05', '09:10', '09:15', '09:20'] },
        yAxis: { type: 'value', min: 34, max: 40 },
        series: [{ data: cam.history, type: 'line', smooth: true }],
        tooltip: {},
      });
    }, 200);
  };

  const handleMaintain = (cam) => {
    message.info(`${cam.name} 维护提醒：${cam.maintain}`);
  };

  return (
    <div>
      <Row gutter={16}>
        {mockThermals.map(cam => (
          <Col span={8} key={cam.key} style={{ marginBottom: 16 }}>
            <Card
              title={cam.name}
              bordered
              extra={<Tag color={cam.status === '正常' ? 'green' : 'red'}>{cam.status}</Tag>}
              actions={[
                <Button type="link" onClick={() => showHistory(cam)}>历史温度</Button>,
                <Button type="link" onClick={() => handleMaintain(cam)}>维护提醒</Button>,
              ]}
            >
              <img src={cam.url} alt={cam.name} style={{ width: '100%', marginBottom: 8 }} />
              <div><b>实时温度：</b><span style={{ color: cam.temp > 37.5 ? 'red' : 'inherit' }}>{cam.temp}℃</span></div>
              {cam.alarms.length > 0 && (
                <List
                  size="small"
                  header={<b>告警推送</b>}
                  bordered
                  dataSource={cam.alarms}
                  renderItem={item => <List.Item><Badge status="error" />{item}</List.Item>}
                  style={{ marginTop: 8 }}
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        open={modal.open}
        title={modal.record?.name + ' 历史温度曲线'}
        onCancel={() => setModal({ open: false, record: null })}
        footer={null}
        width={600}
      >
        <div id="temp-history" style={{ width: '100%', height: 320 }} />
      </Modal>
    </div>
  );
} 