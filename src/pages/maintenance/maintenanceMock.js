// 维护管理模块 mock 数据和工具函数

function randomName(prefix) {
  const names = ['A区','B区','C区','D区','E区','F区','G区','H区','I区','J区','K区','L区','M区','N区','O区','P区','Q区','R区','S区','T区'];
  return prefix + names[Math.floor(Math.random()*names.length)] + (Math.floor(Math.random()*10)+1);
}
function randomStatus() { return Math.random() > 0.15 ? '正常' : '异常'; }
function randomDate() {
  // 生成 2025-05-10 到 2025-05-28 之间的随机日期字符串
  const start = new Date('2025-05-10').getTime();
  const end = new Date('2025-05-28').getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.getFullYear() + '-' + 
    String(date.getMonth() + 1).padStart(2, '0') + '-' + 
    String(date.getDate()).padStart(2, '0') + ' ' +
    String(date.getHours()).padStart(2, '0') + ':' +
    String(date.getMinutes()).padStart(2, '0') + ':' +
    String(date.getSeconds()).padStart(2, '0');
}

export const initOverviewData = Array.from({length: 30}, (_,i) => ({
  id: i+1,
  name: randomName('巡检'),
  type: ['日常巡检','专项检查','应急演练'][Math.floor(Math.random()*3)],
  status: randomStatus(),
  lastUpdate: randomDate()
}));
export const initTaskList = Array.from({length: 40}, (_,i) => ({
  id: i+1,
  title: randomName('任务'),
  type: ['维修','保养','巡检'][Math.floor(Math.random()*3)],
  status: ['待处理','处理中','已完成'][Math.floor(Math.random()*3)],
  responsible: randomName('员工'),
  time: randomDate()
}));
export const initDeviceList = Array.from({length: 35}, (_,i) => ({
  id: i+1,
  name: randomName('设备'),
  type: ['电气','给排水','消防','安防'][Math.floor(Math.random()*4)],
  status: randomStatus(),
  lastCheck: randomDate()
}));
export const initStatData = []; 