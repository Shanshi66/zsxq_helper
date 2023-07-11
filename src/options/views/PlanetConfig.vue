<template>
    <el-card shadow="never">
        <div class="data-part">
            <el-form :model="config" label-width="80px">
                <el-form-item label="长文本最低字数" label-width="auto">
                    <el-input v-model="config.longTextNum" type="number" />
                </el-form-item>
            </el-form>
        </div>
        <div class="operate-part">
            <el-button type="success" plain @click="saveSetting">保存</el-button>
        </div>
    </el-card>
</template>

<script>
import { SAVE_GLOBAL_CONFIG } from '../../common/const';
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

export default {
    props: {
        config: Object
    },
    methods: {
        async saveSetting() {
            const result = this.checkForm();
            if (!result.statu) {
                ElMessage.error({
                    message: result.message
                })
                return;
            }
            const isSuccess = await chrome.runtime.sendMessage({
                action: SAVE_GLOBAL_CONFIG,
                data: this.config
            });
            if (isSuccess) ElMessage.success({
                message: '保存成功'
            })
        },
        checkForm() {
            if (this.config.longTextNum < 0 ||
                this.config.longTextNum == null ||
                this.config.longTextNum != parseInt(this.config.longTextNum)) {
                return {
                    statu: false,
                    message: '长文本最低字数必须为正整数'
                }
            }
            this.config.longTextNum = parseInt(this.config.longTextNum);
            return {
                statu: true
            }
        }



    }
}

</script>

<style scoped></style>
