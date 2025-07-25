// 办公管理 mock 数据
export const meetingList = [
  { id: 1, room: 'A101', title: '项目周会', organizer: '李明', startTime: '2025-05-10 09:00:00', endTime: '2025-05-10 10:00:00', status: '已确认' },
  { id: 2, room: 'B203', title: '产品评审', organizer: '赵秀玲', startTime: '2025-05-14 14:00:00', endTime: '2025-05-14 15:30:00', status: '待确认' },
  { id: 3, room: 'C305', title: '技术分享', organizer: '李利英', startTime: '2025-05-22 15:00:00', endTime: '2025-05-22 16:00:00', status: '已取消' },
  // 可扩展更多 mock 数据
];

export const supplyList = [
  { id: 1, name: 'A4纸', category: '纸张', stock: 100, unit: '包', status: '充足' },
  { id: 2, name: '签字笔', category: '文具', stock: 50, unit: '支', status: '充足' },
  { id: 3, name: '文件夹', category: '文具', stock: 10, unit: '个', status: '不足' },
  // 可扩展更多 mock 数据
];

export const announcementList = [
  { id: 1, title: '关于端午放假通知', publisher: '行政部', publishTime: '2025-05-28 09:00:00', status: '已发布' },
  { id: 2, title: '园区安全培训通知', publisher: '安全部', publishTime: '2025-05-14 10:00:00', status: '已发布' },
  { id: 3, title: '新员工入职培训', publisher: '人事部', publishTime: '2025-05-16 14:00:00', status: '草稿' },
  // 可扩展更多 mock 数据
]; 