import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Select, Button, Space, Tooltip } from 'antd';
import { ThunderboltOutlined, CloudOutlined, FireOutlined, BarChartOutlined, DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { statData } from './energyMock';

const { Option } = Select;
const months = ['01', '02', '03', '04', '05'];
const quarters = ['Q1', 'Q2'];
const year = '2025';

function getSum(arr, key) {
  return arr.reduce((sum, item) => sum + (item[key] || 0), 0);
}

export default function Stat() {
  const [statType, setStatType] = useState('month');
  const [statMonth, setStatMonth] = useState('05');
  const [statQuarter, setStatQuarter] = useState('Q2');

  // 计算顶部卡片数据
  const { total, electric, water, gas, trend } = useMemo(() => {
    let data = [];
    if (statType === 'month') {
      data = statData.filter(d => d.date === `${year}-${statMonth}`);
    } else if (statType === 'quarter') {
      const monthsInQuarter = statQuarter === 'Q1' ? ['01','02','03'] : ['04','05'];
      data = statData.filter(d => monthsInQuarter.includes(d.date.slice(-2)));
    } else {
      data = statData;
    }
    const prevIdx = statType === 'month' ? months.indexOf(statMonth)-1 : statType==='quarter'?quarters.indexOf(statQuarter)-1 : -1;
    const prevData = statType==='month' && prevIdx>=0 ? statData.filter(d=>d.date===`${year}-${months[prevIdx]}`) :
      statType==='quarter' && prevIdx>=0 ? statData.filter(d=>quarters[prevIdx]==='Q1'?['01','02','03']:['04','05']).flat() : [];
    const sum = key => getSum(data, key);
    const prevSum = key => getSum(prevData, key);
    const percent = (now, prev) => prev ? ((now-prev)/prev*100).toFixed(1) : '--';
    return {
      total: sum('electric')+sum('water')+sum('gas'),
      electric: sum('electric'),
      water: sum('water'),
      gas: sum('gas'),
      trend: {
        electric: percent(sum('electric'), prevSum('electric')),
        water: percent(sum('water'), prevSum('water')),
        gas: percent(sum('gas'), prevSum('gas')),
        total: percent(sum('electric')+sum('water')+sum('gas'), prevSum('electric')+prevSum('water')+prevSum('gas')),
      }
    };
  }, [statType, statMonth, statQuarter]);

  // 图表数据
  let chartData = [];
  let title = '';
  if (statType === 'month') {
    const item = statData.find(d => d.date === `${year}-${statMonth}`);
    if (item) {
      chartData = [
        { type: '用电', value: item.electric },
        { type: '用水', value: item.water },
        { type: '用气', value: item.gas },
      ];
    }
    title = `${year}年${statMonth}月能耗分布`;
  } else if (statType === 'quarter') {
    let monthsInQuarter = statQuarter === 'Q1' ? ['01','02','03'] : ['04','05'];
    chartData = statData
      .filter(d => monthsInQuarter.includes(d.date.slice(-2)))
      .flatMap(item => [
        { date: item.date.slice(-2)+'月', type: '用电', value: item.electric },
        { date: item.date.slice(-2)+'月', type: '用水', value: item.water },
        { date: item.date.slice(-2)+'月', type: '用气', value: item.gas },
      ]);
    title = `${year}年${statQuarter}能耗趋势`;
  } else {
    chartData = statData.flatMap(item => [
      { date: item.date.slice(-2)+'月', type: '用电', value: item.electric },
      { date: item.date.slice(-2)+'月', type: '用水', value: item.water },
      { date: item.date.slice(-2)+'月', type: '用气', value: item.gas },
    ]);
    title = `${year}年能耗趋势`;
  }

  function exportExcel() {
    // 可用xlsx导出chartData
    // message.success('模拟导出Excel成功');
    window.alert('模拟导出Excel成功');
  }

  // 卡片色彩
  const cardColors = {
    total: '#1890ff',
    electric: '#faad14',
    water: '#13c2c2',
    gas: '#f5222d',
  };

  return (
    <div>
      <Row gutter={24} style={{marginBottom:24}}>
        <Col span={6}>
          <Card variant="outlined" style={{borderRadius:12,boxShadow:'0 2px 8px #e6f7ff'}}>
            <Statistic
              title={<span style={{color:cardColors.total}}>总能耗</span>}
              value={total}
              prefix={<BarChartOutlined style={{color:cardColors.total,fontSize:22}} />}
              valueStyle={{fontSize:28}}
              suffix={<Tooltip title={trend.total>0?`较上期增长${trend.total}%`:`较上期下降${Math.abs(trend.total)}%`}>
                {trend.total>0 ? <ArrowUpOutlined style={{color:'#52c41a'}} /> : <ArrowDownOutlined style={{color:'#f5222d'}} />}
                <span style={{color:trend.total>0?'#52c41a':'#f5222d',marginLeft:4}}>{trend.total}%</span>
              </Tooltip>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="outlined" style={{borderRadius:12,boxShadow:'0 2px 8px #fffbe6'}}>
            <Statistic
              title={<span style={{color:cardColors.electric}}>用电</span>}
              value={electric}
              prefix={<ThunderboltOutlined style={{color:cardColors.electric,fontSize:22}} />}
              valueStyle={{fontSize:28}}
              suffix={<Tooltip title={trend.electric>0?`较上期增长${trend.electric}%`:`较上期下降${Math.abs(trend.electric)}%`}>
                {trend.electric>0 ? <ArrowUpOutlined style={{color:'#52c41a'}} /> : <ArrowDownOutlined style={{color:'#f5222d'}} />}
                <span style={{color:trend.electric>0?'#52c41a':'#f5222d',marginLeft:4}}>{trend.electric}%</span>
              </Tooltip>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="outlined" style={{borderRadius:12,boxShadow:'0 2px 8px #e6fffb'}}>
            <Statistic
              title={<span style={{color:cardColors.water}}>用水</span>}
              value={water}
              prefix={<CloudOutlined style={{color:cardColors.water,fontSize:22}} />}
              valueStyle={{fontSize:28}}
              suffix={<Tooltip title={trend.water>0?`较上期增长${trend.water}%`:`较上期下降${Math.abs(trend.water)}%`}>
                {trend.water>0 ? <ArrowUpOutlined style={{color:'#52c41a'}} /> : <ArrowDownOutlined style={{color:'#f5222d'}} />}
                <span style={{color:trend.water>0?'#52c41a':'#f5222d',marginLeft:4}}>{trend.water}%</span>
              </Tooltip>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="outlined" style={{borderRadius:12,boxShadow:'0 2px 8px #fff1f0'}}>
            <Statistic
              title={<span style={{color:cardColors.gas}}>用气</span>}
              value={gas}
              prefix={<FireOutlined style={{color:cardColors.gas,fontSize:22}} />}
              valueStyle={{fontSize:28}}
              suffix={<Tooltip title={trend.gas>0?`较上期增长${trend.gas}%`:`较上期下降${Math.abs(trend.gas)}%`}>
                {trend.gas>0 ? <ArrowUpOutlined style={{color:'#52c41a'}} /> : <ArrowDownOutlined style={{color:'#f5222d'}} />}
                <span style={{color:trend.gas>0?'#52c41a':'#f5222d',marginLeft:4}}>{trend.gas}%</span>
              </Tooltip>}
            />
          </Card>
        </Col>
      </Row>
      <Card className="content-card" style={{borderRadius:14,boxShadow:'0 2px 12px #f0f5ff'}}>
        <div style={{marginBottom:24,display:'flex',gap:16,alignItems:'center'}}>
          <span>统计类型：</span>
          <Select value={statType} onChange={setStatType} style={{width:120}}>
            <Option value="month">月份</Option>
            <Option value="quarter">季度</Option>
            <Option value="year">年份</Option>
          </Select>
          {statType === 'month' && (
            <Select value={statMonth} onChange={setStatMonth} style={{width:140}}>
              {months.map(m => <Option key={m} value={m}>{year}年{m}月</Option>)}
            </Select>
          )}
          {statType === 'quarter' && (
            <Select value={statQuarter} onChange={setStatQuarter} style={{width:140}}>
              {quarters.map(q => <Option key={q} value={q}>{year}年{q}</Option>)}
            </Select>
          )}
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>导出Excel</Button>
        </div>
        <Column
          data={chartData}
          xField={statType==='month'?'type':'date'}
          yField="value"
          seriesField={statType==='month'?undefined:'type'}
          height={360}
          color={["#1890ff", "#13c2c2", "#f5222d"]}
          columnStyle={{borderRadius:8}}
          meta={{value:{alias:'能耗'}}}
          tooltip={{showMarkers:true}}
          animation
        />
      </Card>
    </div>
  );
} 