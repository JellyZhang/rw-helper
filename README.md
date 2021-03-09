# rw-helper-back

[![Wechaty Developer Program](https://img.shields.io/badge/Wechaty-Developer%20Program-green.svg)](https://wechaty.js.org/docs/developer-program/)
[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://wechaty.js.org)

### 简介

基于 wechaty 的微信机器人及对应后端服务

### 截图预览



![pic1](https://tva1.sinaimg.cn/large/008eGmZEly1goe86hdyaaj30aa0mit91.jpg)



![pic2](https://tva1.sinaimg.cn/large/008eGmZEly1goe86mygomj30ae0mpmyg.jpg)



![pic3](https://tva1.sinaimg.cn/large/008eGmZEly1goe86r7zpsj30ai0mvwfb.jpg)

![pic4](https://tva1.sinaimg.cn/large/008eGmZEly1goe86wucrcj30ab0mpgmg.jpg)

![pic5](https://tva1.sinaimg.cn/large/008eGmZEly1goe877ac9zj30nu1fk0ub.jpg)





### 使用说明

#### 数据库

```
cd db
docker-compose up -d
```

#### 后端 api server

```
cd api-server
# 配置文件位于api-server/internal/config.toml，默认连接本机postgreSQL与bot服务
make run
```

#### Bot服务

```
cd wechat-bot
# 修改.env文件中的token与协议，并加载到环境变量中
sh .env
make run
```

#### 前端小程序

```
cd mini-program
npm run dev:mp-weixin
# 然后打开微信开发者工具，导入mini-program/dist/dev/mp-weixin
```





### 后续TODO

- [ ] 修复群聊名称过长时无法修改的问题。
- [ ] 在群公告展示拼车详情信息。
- [ ] 根据不同的拼车信息，展现不同的缩略图。
- [ ] 后端加入mapper与DTO层。