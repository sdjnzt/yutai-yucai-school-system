// 停车管理 mock 数据
export const gateList = [
  { id: 1, name: '北门', status: '开启', location: '北侧主路', type: '车行', manager: '王建国', lng: 117.120, lat: 36.650 },
  { id: 2, name: '南门', status: '关闭', location: '南侧主路', type: '车行', manager: '李明', lng: 117.122, lat: 36.645 },
  { id: 3, name: '东门', status: '开启', location: '东侧辅路', type: '人行', manager: '赵云', lng: 117.125, lat: 36.648 },
  { id: 4, name: '西门', status: '开启', location: '西侧主路', type: '车行', manager: '孙倩', lng: 117.118, lat: 36.647 },
  { id: 5, name: 'A区入口', status: '关闭', location: 'A区北侧', type: '车行', manager: '陈梓涵', lng: 117.121, lat: 36.651 },
  { id: 6, name: 'B区入口', status: '开启', location: 'B区东侧', type: '车行', manager: '李思远', lng: 117.123, lat: 36.649 },
  { id: 7, name: 'C区入口', status: '开启', location: 'C区南侧', type: '人行', manager: '孙嘉禾', lng: 117.127, lat: 36.652 },
  { id: 8, name: '地下车库入口', status: '关闭', location: '地下车库', type: '车行', manager: '王子睿', lng: 117.119, lat: 36.646 },
  { id: 9, name: 'D区入口', status: '开启', location: 'D区西侧', type: '车行', manager: '高子墨', lng: 117.128, lat: 36.653 },
  { id: 10, name: 'E区入口', status: '关闭', location: 'E区南侧', type: '人行', manager: '许思辰', lng: 117.130, lat: 36.654 },
  { id: 11, name: '访客通道', status: '开启', location: '主楼东侧', type: '人行', manager: '罗一帆', lng: 117.126, lat: 36.650 },
  { id: 12, name: '货运通道', status: '关闭', location: '后勤区', type: '车行', manager: '贾嘉懿', lng: 117.117, lat: 36.645 },
  { id: 13, name: 'VIP专用门', status: '开启', location: '主楼北侧', type: '车行', manager: '邹梓涵', lng: 117.124, lat: 36.652 },
  { id: 14, name: '员工通道', status: '开启', location: '办公楼西侧', type: '人行', manager: '林梓萱', lng: 117.115, lat: 36.648 },
  { id: 15, name: '西南门', status: '关闭', location: '西南角', type: '车行', manager: '高梓轩', lng: 117.116, lat: 36.644 },
  { id: 16, name: '东南门', status: '开启', location: '东南角', type: '人行', manager: '宋子墨', lng: 117.131, lat: 36.643 },
];
export const areaList = [
  { id: 1, name: 'A区', total: 120, used: 80, lng: 117.121, lat: 36.651 },
  { id: 2, name: 'B区', total: 90, used: 60, lng: 117.123, lat: 36.649 },
  { id: 3, name: 'C区', total: 60, used: 45, lng: 117.127, lat: 36.652 },
  { id: 4, name: '地下车库', total: 200, used: 150, lng: 117.119, lat: 36.646 },
];
export const parkingList = [
  { id: 1, code: 'A-001', area: 'A区', status: '空闲', type: '普通', lng: 117.1215, lat: 36.6515 },
  { id: 2, code: 'A-002', area: 'A区', status: '占用', type: '充电', lng: 117.1216, lat: 36.6516 },
  { id: 3, code: 'A-003', area: 'A区', status: '预约', type: 'VIP', lng: 117.1217, lat: 36.6517 },
  { id: 4, code: 'B-001', area: 'B区', status: '空闲', type: '普通', lng: 117.1235, lat: 36.6495 },
  { id: 5, code: 'B-002', area: 'B区', status: '占用', type: '充电', lng: 117.1236, lat: 36.6496 },
  { id: 6, code: 'B-003', area: 'B区', status: '故障', type: '普通', lng: 117.1237, lat: 36.6497 },
  { id: 7, code: 'C-001', area: 'C区', status: '空闲', type: '普通', lng: 117.1275, lat: 36.6525 },
  { id: 8, code: 'C-002', area: 'C区', status: '占用', type: 'VIP', lng: 117.1276, lat: 36.6526 },
  { id: 9, code: 'D-001', area: '地下车库', status: '空闲', type: '充电', lng: 117.1195, lat: 36.6465 },
  { id: 10, code: 'D-002', area: '地下车库', status: '占用', type: '普通', lng: 117.1196, lat: 36.6466 },
  { id: 11, code: 'D-003', area: '地下车库', status: '预约', type: 'VIP', lng: 117.1197, lat: 36.6467 },
  { id: 12, code: 'D-004', area: '地下车库', status: '故障', type: '普通', lng: 117.1198, lat: 36.6468 },
];
export const feeList = [
  { id: 1, name: '临时停车', rule: '2元/小时，首小时3元', max: '20元/天' },
  { id: 2, name: '月租车', rule: '200元/月', max: '-' },
  { id: 3, name: 'VIP专用', rule: '免费', max: '-' },
  { id: 4, name: '充电车位', rule: '3元/小时+电费', max: '30元/天' },
  { id: 5, name: '包年车', rule: '2000元/年', max: '-' },
];
export const controlList = [
  { id: 1, user: '林梓萱', car: '鲁A7F123', type: '黑名单', reason: '多次违规停车', time: '2025-05-10 09:00:00' },
  { id: 2, user: '高子墨', car: '鲁B9K888', type: '白名单', reason: 'VIP客户', time: '2025-05-11 10:00:00' },
  { id: 3, user: '许思辰', car: '鲁C2M456', type: '黑名单', reason: '冒用他人车牌', time: '2025-05-12 11:20:00' },
  { id: 4, user: '罗一帆', car: '鲁D5Q321', type: '白名单', reason: '内部员工', time: '2025-05-13 12:30:00' },
  { id: 5, user: '贾嘉懿', car: '鲁A8V999', type: '黑名单', reason: '恶意闯入', time: '2025-05-14 13:40:00' },
  { id: 6, user: '邹梓涵', car: '鲁B3X111', type: '白名单', reason: '合作单位', time: '2025-05-15 14:50:00' },
];
export const speedList = [
  { id: 1, car: '鲁A7F123', area: 'A区', speed: 45, limit: 30, time: '2025-05-10 08:30:00' },
  { id: 2, car: '鲁B9K888', area: 'B区', speed: 38, limit: 30, time: '2025-05-11 09:20:00' },
  { id: 3, car: '鲁C2M456', area: 'C区', speed: 52, limit: 30, time: '2025-05-12 10:10:00' },
  { id: 4, car: '鲁D5Q321', area: '地下车库', speed: 28, limit: 20, time: '2025-05-13 11:00:00' },
  { id: 5, car: '鲁A8V999', area: 'A区', speed: 41, limit: 30, time: '2025-05-14 12:30:00' },
  { id: 6, car: '鲁B3X111', area: 'B区', speed: 35, limit: 30, time: '2025-05-15 13:40:00' },
]; 