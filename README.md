# 微信小程序/ 积分兑换奖励
### 参考大佬的设计  LCM9902/Duck-Princess-Cultivation-Plan
### 大佬的数据库设计
https://bytedance.feishu.cn/docx/doxcnvk58QcRZxmOmHgogANvnQu

## 注意点
1. 确认project.config.json中的projectname和本地是否一致
2. miniprogram/envList.js中的环境配置改为自己的环境
3. 需要手动创建数据库表：云开发 -> 数据库

## 新手教程
1. 登陆微信小程序平台注册小程序，牢记AppID，下载开发工具
2. 下载源码
3. 打开微信开发者工具，导入项目
4. 在app.json的navigationBarTitleText中修改页面标题
5. 全局搜索user_name，将后面名字换成你想换成的名字
6. 点击左上云开发，完成注册，记住环境ID
7. 在envList.js中将envId后面字符串替换掉
8. 在云发开中点击数据库，新添加集合
9. 分别添加goods、integral、mission、sales、user、user_operator集合
10. 在user集合中右侧添加字段：user_name string 在第5步更改的姓名、user_integral number 0
11. 在开发工具中，右击quickstartFunctions文件包，点击上传并部署：全部文件
12. 在右上角点击上传，填写版本、备注，选择体验版本，避免代码审核
13. 即可

## 参考文档
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

