// 消防管理模块 mock 数据和工具函数

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
  name: randomName('消防巡检'),
  type: ['日常巡检','专项检查','应急演练'][Math.floor(Math.random()*3)],
  status: randomStatus(),
  lastUpdate: randomDate()
}));
export const initAlarmList = Array.from({length: 40}, (_,i) => ({
  id: i+1,
  type: ['烟雾报警','温度报警','水压报警','设备故障'][Math.floor(Math.random()*4)],
  location: randomName('点位'),
  level: ['高','中','低'][Math.floor(Math.random()*3)],
  status: ['未处理','处理中','已处理'][Math.floor(Math.random()*3)],
  time: randomDate()
}));
export const initDeviceList = Array.from({length: 35}, (_,i) => ({
  id: i+1,
  name: randomName('消防设备'),
  type: ['烟感','温感','喷淋','消火栓','报警主机'][Math.floor(Math.random()*5)],
  status: randomStatus(),
  lastCheck: randomDate()
}));
export const initStatData = []; 