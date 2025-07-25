import React, { useState } from 'react';
import { Card, Button, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import * as XLSX from 'xlsx';
import { statDataDay, statDataWeek, statDataMonth } from './visitorMock';

const { Option } = Select;

export default function Stat() {
  const [statType, setStatType] = useState('day');
  const statData = statType==='day'?statDataDay:statType==='week'?statDataWeek:statDataMonth;

  function exportExcel(data, sheetName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  }

  return (
    <Card className="content-card">
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
    </Card>
  );
} 