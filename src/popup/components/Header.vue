<template>
    <div class="header">
        <div class="title">知识星球AI助手v1.1.1</div>
        <div>
            <el-icon color="#f6f6f6" @click="toOption">
                <Setting />
            </el-icon>
        </div>
    </div>
</template>
  
<script>

import { Setting } from '@element-plus/icons-vue';

export default {
    components: { Setting },
    methods: {
        toOption() {
            chrome.runtime.openOptionsPage();
        }

    }
}
</script>
  
<style lang = "less" scoped>
.header {
    padding: 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    width: 100%;
    font-size: 18px;
    box-sizing: border-box;
    background-color: rgb(22, 185, 152);

    .title {
        color: #f6f6f6;
    }

    cl-icon {
        color: #f6f6f6;
    }
}
</style>
  