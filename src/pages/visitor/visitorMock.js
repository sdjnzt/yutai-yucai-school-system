// 真实中文姓名生成
const commonSurnames = ['王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','胡','朱','高','林','何','郭','马','罗','梁','宋','郑','谢','韩','唐','冯','于','董','萧','程','曹','袁','邓','许','傅','沈','曾','彭','吕','苏','卢','蒋','蔡','贾','丁','魏','薛','叶','阎','余','潘','杜','戴','夏','钟','汪','田','任','姜','范','方','石','姚','谭','廖','邹','熊','金','陆','郝','孔','白','崔','康','毛','邱','秦','江','史','顾','侯','邵','孟','龙','万','段','雷','钱','汤','尹','黎','易','常','武','乔','贺','赖','龚','文'];
const commonNames = ['伟','芳','娜','敏','静','丽','强','磊','军','洋','勇','艳','杰','娟','涛','明','超','秀英','霞','平','刚','桂英','丹','萍','鑫','鹏','华','红','玉兰','飞','玲','桂兰','玉梅','莉','斌','宇','浩','凯','秀兰','俊','旭','健','俊杰','娅','倩','雪','晶','晨','倩','博','欣','佳','瑞','鑫','龙','琳','婷','雪','璐','佳','悦','璇','倩','颖','涵','悦','嘉','瑞','妍','宁','莹','媛','璐','欣','怡','婧','雯','璇','婕','晨','璐','颖','琳','雪','婷','悦','嘉','瑞','妍','宁','莹','媛','璐','欣','怡','婧','雯','璇','婕','晨'];
export function genChineseName() {
  const surname = commonSurnames[Math.floor(Math.random()*commonSurnames.length)];
  const given = commonNames[Math.floor(Math.random()*commonNames.length)] + (Math.random()>0.5 ? commonNames[Math.floor(Math.random()*commonNames.length)] : '');
  return surname + given;
}
export function randomItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
export function randomDate(start = new Date('2025-05-10'), end = new Date('2025-05-28')) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0') + ' ' +
    String(date.getHours()).padStart(2, '0') + ':' +
    String(date.getMinutes()).padStart(2, '0') + ':' +
    String(date.getSeconds()).padStart(2, '0');
}

export const purposes = ['商务洽谈', '面试', '设备维修', '参观', '合作', '技术交流', '考察', '培训', '会议', '签约'];

export const initAppointmentList = Array.from({length: 40}, (_,i) => ({
  id: i+1,
  name: genChineseName(),
  visitTime: randomDate(),
  purpose: randomItem(purposes),
  host: genChineseName(),
  status: ['待审核','已通过','已拒绝'][Math.floor(Math.random()*3)]
}));
export const initAuditList = Array.from({length: 20}, (_,i) => ({
  id: i+1,
  name: genChineseName(),
  visitTime: randomDate(),
  purpose: randomItem(purposes),
  host: genChineseName(),
  status: '待审核'
}));
export const initAuthList = Array.from({length: 20}, (_,i) => ({
  id: i+1,
  name: genChineseName(),
  visitTime: randomDate(),
  access: randomItem(['大门','办公楼','会议室']),
  car: Math.random()>0.5 ? `鲁A${Math.floor(Math.random()*90000+10000)}` : '',
  status: ['已下发','未下发'][Math.floor(Math.random()*2)],
  host: genChineseName(),
}));
export const initRecordList = Array.from({length: 30}, (_,i) => ({
  id: i+1,
  name: genChineseName(),
  visitTime: randomDate(),
  purpose: randomItem(purposes),
  host: genChineseName(),
  status: ['已离开','在访'][Math.floor(Math.random()*2)]
}));
export const initBlacklist = Array.from({length: 15}, (_,i) => ({
  id: i+1,
  name: genChineseName(),
  reason: randomItem(['多次违规','恶意闯入','未带证件','扰乱秩序','冒用身份']),
  time: randomDate().slice(0,10)
}));
export const statDataDay = Array.from({length: 7}, (_,i)=>({ date: `2025-05-0${i+1}`, count: Math.floor(Math.random()*10+3) }));
export const statDataWeek = Array.from({length: 4}, (_,i)=>({ date: `第${i+1}周`, count: Math.floor(Math.random()*30+10) }));
export const statDataMonth = Array.from({length: 6}, (_,i)=>({ date: `2025-0${i+1}`, count: Math.floor(Math.random()*50+20) })); 