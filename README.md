# 知识星球AI助手

Chrome同名插件开源代码，AI服务器相关代码参见：[ai_service](https://github.com/RosenX/ai-service)

这个插件可以帮助大家提取帖子中所有标签，也能生成一些标签，对长文可以进行摘要。可以下载体验: [下载链接](https://chrome.google.com/webstore/detail/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83ai%E5%8A%A9%E6%89%8B/bjpnjhfpcjopegobocpjlmbhbepoohna/related?hl=zh-CN)

## 使用说明

这个代码版本为开源版本，我把敏感的信息去掉了，你可以：

1. 搜索"example.com"，替换为你的服务器地址
2. 搜索"your_app"，替换成你的Authing(第三方认证系统)应用名

## 开发说明

1. 原始插件中，包含三个模块：前端插件、后端服务(记录用户使用Token数，AI请求转发)、AI服务，由于本人不是专门做后端的，怕大佬攻击我，后端服务就没开源了，但也很简单。后端服务加了一个prompt在请求中，大家可以自己实现，接口参见[ai_service](https://github.com/RosenX/)。
2. 前端插件采用Vue3和Webpack开发，我第一次写前端，代码写得不是很好，有任何建议，大家可以提ISSUE。



