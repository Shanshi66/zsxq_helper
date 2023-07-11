<template>
    <div class="content-container">
        <div class="header">
            <h1>知识星球AI助手</h1>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" tabPosition="left">
                <el-tab-pane label="设置" name="setting">
                    <Setting />
                </el-tab-pane>
                <el-tab-pane label="帮助文档" name="doc">
                    <Help />
                </el-tab-pane>
                <el-tab-pane label="更新日志" name="log">
                    <Log />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import Setting from './views/Setting.vue'
import Help from './views/Help.vue'
import Log from './views/Log.vue'

export default {
    components: {
        Setting,
        Help,
        Log
    },
    data() {
        return {
            activeName: 'setting'
        }
    },
    methods: {

    }
}

</script>

<style lang="less" scoped>
.content-container {
    width: 1000px;
    margin: 0px auto;

    .header {
        h1 {
            text-align: center;
            color: #303133;
        }
    }
}
</style>
