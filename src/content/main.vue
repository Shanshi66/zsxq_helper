<template>
    <!-- <div id="helper-sidebar" :style="position"> -->
    <!-- <div class="moveHead helper-header" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup" -->
    <div id="helper-sidebar" :style="position">
        <div class="helper-header" @mousedown="startDrag">
            <div class="helper-title">知识星球AI助手</div>
            <div class="helper-close">
                <el-icon color="#f6f6f6" @click="closeHelperSidebar">
                    <Close />
                </el-icon>
            </div>
        </div>
        <div class="helper-content">
            <Content />
        </div>
    </div>
</template>
  
<script>

import Content from './components/Content.vue'
import { Close } from '@element-plus/icons-vue';

export default {
    data() {
        return {
            isDragging: false,
            startX: 0,
            startY: 0,
            left: 100,
            top: 100
        }
    },
    components: {
        Close,
        Content
    },
    computed: {
        position() {
            return `top:${this.top}px;left:${this.left}px;`;
        },
    },
    methods: {
        closeHelperSidebar() {
            chrome.runtime.sendMessage({ action: "closeHelperSidebar" });
        },
        startDrag(event) {
            event.preventDefault();
            this.isDragging = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
            document.addEventListener("mousemove", this.drag);
            document.addEventListener("mouseup", this.stopDrag);
        },
        drag(event) {
            if (!this.isDragging) return;
            const offsetX = event.clientX - this.startX;
            const offsetY = event.clientY - this.startY;
            this.left += offsetX;
            this.top += offsetY;
            this.startX = event.clientX;
            this.startY = event.clientY;
        },
        stopDrag() {
            this.isDragging = false;
            document.removeEventListener("mousemove", this.drag);
            document.removeEventListener("mouseup", this.stopDrag);
        }
    }
}
</script>
  
<style scoped lang="less">
#helper-sidebar {
    width: 400px;
    position: fixed;
    height: auto;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 0 3px 1px #95a5a6;
}


.helper-header {
    padding: 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    width: 100%;
    font-size: 18px;
    box-sizing: border-box;
    background-color: rgb(22, 185, 152);
    cursor: move;

    .helper-title {
        color: #f6f6f6;
    }

    .helper-close {
        color: #f6f6f6;
        cursor: pointer;
    }
}

.helper-content {
    padding: 10px;
}
</style>