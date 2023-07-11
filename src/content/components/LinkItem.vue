<template>
    <el-card class="link-card" shadow="never">
        <div class="card-options">
            <!-- <el-button class="button" text size="small">复制</el-button> -->
            <el-button class="button" text size="small">跳转</el-button>
        </div>
        <div clas="link-content">
            <div v-for="link in linkResult.links">
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
        linkResult: Object
    }
}
</script>

<style scoped lang="less">
.link-card {
    margin: 5px 5px;

    .card-options {
        display: flex;
        align-items: right;
        justify-content: flex-end;
        margin-bottom: 5px;
    }

    .ellipsis-link {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>