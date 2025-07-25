import Mock from 'mockjs';

// 登录接口
Mock.mock('/api/login', 'post', {
  code: 200,
  message: '登录成功',
  data: {
    token: 'mock-token',
    user: {
      id: '1',
      username: 'admin',
      name: '管理员',
      role: 'admin',
    },
  },
});

// 用户信息接口
Mock.mock('/api/user/info', 'get', {
  code: 200,
  message: '获取成功',
  data: {
    id: '1',
    username: 'admin',
    name: '管理员',
    role: 'admin',
    avatar: null,
    permissions: ['*'],
  },
});

// 其他接口可以根据需要添加 