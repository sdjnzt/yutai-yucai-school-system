import React, { useState } from 'react';
import { Card, Table, Button, Input, Modal, Form, Select, DatePicker, Tag, Radio, Calendar, Badge, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { meetingList as mockMeetingList } from './officeMock';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Meeting() {
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState(mockMeetingList);
  const [editing, setEditing] = useState(null);

  // 表格列
  const columns = [
    { title: '预约ID', dataIndex: 'id', key: 'id' },
    { title: '会议室', dataIndex: 'room', key: 'room' },
    { title: '会议主题', dataIndex: 'title', key: 'title' },
    { title: '组织者', dataIndex: 'organizer', key: 'organizer' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: s => {
        const color = s === '已确认' ? 'green' : s === '待确认' ? 'orange' : 'red';
        return <Tag color={color}>{s}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={()=>onEdit(record)}>编辑</Button>
      )
    }
  ];

  // 编辑/新建
  function onEdit(record) {
    setEditing(record);
    form.setFieldsValue(record ? {
      ...record,
      time: [record.startTime ? dayjs(record.startTime) : null, record.endTime ? dayjs(record.endTime) : null]
    } : {});
    setModalOpen(true);
  }
  function onCreate(date) {
    setEditing(null);
    form.resetFields();
    if (date) {
      form.setFieldsValue({ time: [date.startOf('day'), date.endOf('day')] });
    }
    setModalOpen(true);
  }
  function handleOk() {
    form.validateFields().then(values => {
      const { room, title, organizer, time, status } = values;
      if (editing) {
        setData(list => list.map(m => m.id === editing.id ? {
          ...m, room, title, organizer, startTime: time[0].format('YYYY-MM-DD HH:mm:ss'), endTime: time[1].format('YYYY-MM-DD HH:mm:ss'), status
        } : m));
        message.success('编辑成功');
      } else {
        setData(list => [
          ...list,
          {
            id: Date.now(),
            room, title, organizer,
            startTime: time[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: time[1].format('YYYY-MM-DD HH:mm:ss'),
            status
          }
        ]);
        message.success('新增成功');
      }
      setModalOpen(false);
    });
  }

  // 日历渲染（用 cellRender 替换 dateCellRender）
  function cellRender(value) {
    // value 是 dayjs 对象
    const list = data.filter(m => {
      const start = dayjs(m.startTime);
      const end = dayjs(m.endTime);
      return value.isSameOrAfter(start, 'day') && value.isSameOrBefore(end, 'day');
    });
    return (
      <ul className="events">
        {list.map(item => (
          <li key={item.id}>
            <Badge status={item.status==='已确认'?'success':item.status==='待确认'?'warning':'error'} text={item.title} />
          </li>
        ))}
      </ul>
    );
  }

  // 日历点击
  function onSelect(date) {
    onCreate(date);
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16,alignItems:'center'}}>
        <Radio.Group value={view} onChange={e=>setView(e.target.value)}>
          <Radio.Button value="table"><UnorderedListOutlined /> 列表视图</Radio.Button>
          <Radio.Button value="calendar"><CalendarOutlined /> 日历视图</Radio.Button>
        </Radio.Group>
        {view==='table' && <>
          <Input.Search
            placeholder="搜索会议室/主题"
            allowClear
            enterButton={<SearchOutlined />}
            style={{width:300}}
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
          <Button icon={<PlusOutlined />} type="primary" onClick={()=>onEdit(null)}>新增预约</Button>
        </>}
      </div>
      {view==='table' ? (
        <Table
          columns={columns}
          dataSource={data.filter(m => m.room.includes(search) || m.title.includes(search))}
          rowKey="id"
          pagination={{pageSize:5}}
        />
      ) : (
        <Calendar cellRender={cellRender} onSelect={onSelect} />
      )}
      <Modal
        open={modalOpen}
        title={editing?'编辑预约':'新增预约'}
        onCancel={()=>setModalOpen(false)}
        onOk={handleOk}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="room" label="会议室" rules={[{required:true,message:'请选择会议室'}]}>
            <Select>
              <Option value="A101">A101</Option>
              <Option value="B203">B203</Option>
              <Option value="C305">C305</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label="会议主题" rules={[{required:true,message:'请输入会议主题'}]}><Input /></Form.Item>
          <Form.Item name="organizer" label="组织者" rules={[{required:true,message:'请输入组织者'}]}><Input /></Form.Item>
          <Form.Item name="time" label="会议时间" rules={[{required:true,message:'请选择会议时间'}]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{required:true,message:'请选择状态'}]}>
            <Select>
              <Option value="待确认">待确认</Option>
              <Option value="已确认">已确认</Option>
              <Option value="已取消">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
} 