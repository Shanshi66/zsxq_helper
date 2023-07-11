<template>
    <el-card class="summary-card" shadow="never">
        <div class="card-options">
            <!-- <el-button class="button" text size="small">复制</el-button> -->
            <el-button class="button" text size="small" @click="jumpToView" type="success">跳转 至 {{
                this.summaryResult.author
            }}</el-button>
        </div>
        <div class="summary-content">
            {{ summaryResult.summary }}
        </div>
        <div clas="link-content">
            <div v-for="link in summaryResult.links">
                <el-link :key="link.href" :href="link.href" type="success" target="_blank" class="ellipsis-link">{{
                    link.text
                }}</el-link>
            </div>
        </div>
    </el-card>
</template>
<script>

export default {
    props: {
        summaryResult: Object
    },
    methods: {
        jumpToView() {
            this.$emit("jumpToView", this.summaryResult.idx);
        }
    }
}
</script>

<style scoped lang="less">
// .summary-card {
//     margin: 5px 5px;

//     .card-options {
//         display: flex;
//         align-items: right;
//         justify-content: flex-end;
//         margin-bottom: 5px;
//     }

//     .summary-content {
//         margin-bottom: 5px;
//     }

//     .break-link {
//         word-wrap: break-word;
//     }

//     .ellipsis-link {
//         white-space: nowrap;
//         overflow: hidden;
//         text-overflow: ellipsis;
//     }
// }

.summary-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-options {
    display: flex;
    justify-content: flex-end; // 让按钮显示在最右边
    margin-bottom: 15px; // 与下一个区域的间距
}

.summary-content {
    margin-bottom: 15px; // 与下一个区域的间距
}

.link-content {
    overflow: hidden;
}

.ellipsis-link {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis; // 文本溢出时显示省略号
    white-space: nowrap; // 确保所有的文本都在一行内
}
</style>