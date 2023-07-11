<template>
    <div class="container">
        <h2>更新日志</h2>
        <el-card class="filter-setting" shadow="never">
            <el-collapse>
                <el-collapse-item title="v1.0.0-20230709" name="1">
                    <p>1、MVP功能上线</p>
                </el-collapse-item>
                <el-collapse-item title="v1.1.1-20230711" name="2">
                    <p>1、修正开始结束时间，不包括小时</p>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>

<script></script>

<style scoped lang="less">
p {
    margin: 8px 0;

    span {
        color: #f56c6c;
    }
}
</style>