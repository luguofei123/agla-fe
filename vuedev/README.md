# ufgov-vue

## 项目依赖部署
```
npm install
```

### 启动测试环境本地服务
```
npm run serve
```

### 生产环境打包
```
npm run build
```

### 测试
```
npm run test
```

### 代码验证
```
npm run lint
```
### 指令设置详见package.json

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 跨域请求设置 本地代理模式
在 /src/const.js 中设置远程服务器的 JSESSIONID, tokenid, username等
在 vue.config.js 中103行设置代理的地址/域名和路径
设置成功后可访问dev1等远程服务接口

### 第三方库
moment 日期时间处理
vue-lodash 对象数组操作
vue-clipboard2 复制