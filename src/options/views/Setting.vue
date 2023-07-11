<template>
    <div class="container">
        <div class="setting-part">
            <h2>账号</h2>
            <Account />
        </div>
        <div class="setting-part">
            <h2>默认设置</h2>
            <PlanetConfig :config="globalPlanetConfig" />
        </div>
        <div class="setting-part">
            <h2>星球个性化设置</h2>
            <el-empty description="Coming Soon"></el-empty>
        </div>
    </div>
</template>


<script>
import Account from './Account.vue'
import PlanetConfig from './PlanetConfig.vue'
import { DEFAULT_GLOBAL_CONFIG, READ_GLOBAL_CONFIG } from '../../common/const'

export default {
    components: {
        Account,
        PlanetConfig
    },
    data() {
        return {
            globalPlanetConfig: DEFAULT_GLOBAL_CONFIG
        }
    },

    async beforeMount() {
        // read global planet setting from chrome storage
        const config = await chrome.runtime.sendMessage({ action: READ_GLOBAL_CONFIG });
        if (config != null) {
            this.globalPlanetConfig = config
        }
    },
}
</script>

<style lang="less" scoped>
.setting-part {
    margin: 30px 0;
}
</style>
