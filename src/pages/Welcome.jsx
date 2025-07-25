import React from 'react';
import { Card, Typography, Row, Col, Button } from 'antd';
import { BankOutlined, SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const bgStyle = {
  minHeight: '100vh',
  background: 'radial-gradient(circle at 70% 30%, #e6f7ff 0%, #fffbe6 60%, #fff 100%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const spotStyle = (top, left, size, color, blur) => ({
  position: 'absolute',
  top, left,
  width: size, height: size,
  background: color,
  borderRadius: '50%',
  filter: `blur(${blur}px)`,
  opacity: 0.5,
  pointerEvents: 'none',
  zIndex: 1,
});

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div style={bgStyle}>
      {/* 动态光斑背景 */}
      <div style={spotStyle('10%', '15%', 180, '#bae7ff', 60)} />
      <div style={spotStyle('60%', '70%', 220, '#ffd666', 80)} />
      <div style={spotStyle('40%', '50%', 120, '#ffadd2', 50)} />
      <Row justify="center" align="middle" style={{ width: '100%', zIndex: 2 }}>
        <Col span={14}>
          <Card
            style={{
              borderRadius: 24,
              boxShadow: '0 12px 48px #e6f7ff',
              padding: '48px 32px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.98)',
              position: 'relative',
              overflow: 'hidden',
            }}
            bordered={false}
          >
            <div style={{ marginBottom: 24 }}>
              {/* 可替换为品牌LOGO图片 */}
              <BankOutlined style={{ fontSize: 72, color: '#1890ff', filter: 'drop-shadow(0 4px 16px #bae7ff)' }} />
            </div>
            <Title level={1} style={{ marginBottom: 8, fontWeight: 800, color: '#222', letterSpacing: 2, textShadow: '0 2px 12px #e6f7ff' }}>
                济宁市兖州区文化路小学综合管理平台
            </Title>
            <Text style={{ fontSize: 20, color: '#1890ff', fontWeight: 600, letterSpacing: 1, marginBottom: 16, display: 'block' }}>
              智慧 · 高端 · 专业 · 现代化
            </Text>
            <Paragraph style={{ fontSize: 18, color: '#666', marginBottom: 32, lineHeight: 1.8 }}>
              欢迎使用现代化、高端、专业的管理系统。<br />
              提供门禁、视频、访客、办公、停车、维护、能耗、消防、系统等全方位数字化管理，助力高效运营与智能决策。
            </Paragraph>
            <Button
              type="primary"
              size="large"
              icon={<SmileOutlined />}
              onClick={()=>navigate('/dashboard')}
              style={{
                fontSize: 20,
                padding: '10px 48px',
                borderRadius: 32,
                fontWeight: 700,
                boxShadow: '0 4px 24px #bae7ff',
                background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)',
                border: 'none',
                transition: 'transform 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              进入平台首页
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 