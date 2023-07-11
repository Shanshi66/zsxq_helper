<template>
    <div class="container">
        <h2>开始</h2>
        <el-card class="filter-setting" shadow="never">
            <p>1、进入星球信息流页面(右侧是星球名称和星球简介)</p>
            <p>2、点击『右键』，可以看到『知识星球AI助手』，点击可以看到一个弹出框</p>
            <p>3、选择『开始时间』和『结束时间』、点击『确定』，页面会自动下滑加载到开始时间发表的帖子处</p>
            <p>4、下方会自动显示标签列表，一般标签呈现『灰色』，<span>特殊标签呈现『橘黄色』，标签选中后呈现『绿色』</span></p>
            <p>5、标签选中后，页面只显示包含选中标签的帖子（<span>如果滑动到最底部，新加载的帖子也会显示</span>）</p>
            <p>6、将鼠标移动到标题栏，<span>可以拖动组件</span></p>
            <el-image src="../../public/ai_helper.png" :preview-src-list="['../../public/ai_helper.png']" fit="contain" />
        </el-card>
        <h2>AI摘要</h2>
        <el-card class="filter-setting" shadow="never">
            <p>1、可以在设置页面设定长文包含的字数阈值，默认是『500』，高于阈值系统会自动判定为长文，否则为短文</p>
            <p>2、插件会自动生成『长文』和『短文』的标签</p>
            <p>3、生成摘要后，会在下方显示摘要条目，每个条目中除了摘要内容外，还会包含帖子中的链接</p>
            <p>4、<span>点击『跳转』链接页面会滚动到对应的帖子</span></p>
        </el-card>
        <h2>计费</h2>
        <el-card class="filter-setting" shadow="never">
            <p>1、除了摘要功能外，其他功能都免费</p>
            <p>2、摘要是按照Token计费的，可以理解为『字数』，价格为每元40000个Token</p>
            <p>3、为新用户提供<span>免费的40000个Token</span>的额度</p>
            <p>4、如果后续有付费需求，请添加作者微信</p>
        </el-card>
        <h2>联系作者</h2>
        <el-card class="filter-setting" shadow="never">
            <p>1、如果你有好的建议或定制需求，欢迎联系作者</p>
            <p>2、如果你想交流应用开发经验，欢迎联系作者</p>
            <p>3、目前没有集成付费系统，如果你有付费需求，欢迎联系作者</p>
            <p>4、作者微信:『luosen-work』</p>
            <el-image style="width: 300px;" src="../../public/wechat.jpeg" :preview-src-list="['../../public/wechat.jpeg']"
                fit="contain" />
        </el-card>
    </div>
</template>

<script></script>

<style scoped lang="less">
p {
    margin: 8px 0;
    font-size: 15px;

    span {
        color: #f56c6c;
    }
}
</style>