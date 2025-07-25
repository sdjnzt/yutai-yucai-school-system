// 能源管理模块 mock 数据和工具函数

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

export const initOverviewData = Array.from({length: 40}, (_,i) => ({
  id: i+1,
  name: randomName('设备'),
  consumption: Math.floor(Math.random()*200+20),
  lastUpdate: randomDate(),
  status: randomStatus()
}));
export const initStatData = [];
export const initAlarmList = [];
export const initWaterList = Array.from({length: 30}, (_,i) => ({
  id: i+1,
  name: randomName('水表'),
  consumption: Math.floor(Math.random()*100+10),
  lastUpdate: randomDate(),
  status: randomStatus()
}));
export const initGasList = Array.from({length: 25}, (_,i) => ({
  id: i+1,
  name: randomName('气表'),
  consumption: Math.floor(Math.random()*80+5),
  lastUpdate: randomDate(),
  status: randomStatus()
}));

export const statData = [
  { date: '2025-05', electric: 210, water: 60, gas: 40 },
  { date: '2025-05', electric: 220, water: 65, gas: 45 },
  { date: '2025-05', electric: 230, water: 70, gas: 50 },
  { date: '2025-05', electric: 250, water: 75, gas: 55 },
  { date: '2025-05', electric: 260, water: 80, gas: 60 },
];

// 可根据实际页面内容补充 