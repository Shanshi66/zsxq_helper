<template>
    <div class="filter-container">
        <el-collapse v-model="filterActiveNames">
            <el-collapse-item :title="dateSelectTitle" name="date-range-select">
                <div class="date-range-select">
                    <div class="date-select">
                        <el-date-picker v-model="startDate" type="date" placeholder="开始日期" @change="startDateConfirm" />
                    </div>
                    <div class="date-select">
                        <el-date-picker v-model="endDate" type="date" placeholder="结束日期" @change="endDateConfirm" />
                    </div>
                    <div class="confirm-btn">
                        <el-button type="success" plain @click="filterConfirm">确认</el-button>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item :title="tagSelectTitle" name="tag-select" v-if="Object.keys(tagState).length > 0">
                <div class="tag-select">
                    <!--tagState, 显示每个标签和对应的topic的count，如果tag被check，tag type 是success 否则是info -->
                    <div v-for="(state, tag) in   tagState  " :key="tag" class="tag-item">
                        <el-tag :type="tagType(state.checked, tag)" @click="tagClick(tag)">
                            {{ tag }}({{ state.count }})
                        </el-tag>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div v-if="message" class="message">
            <el-alert :title="message" type="error"></el-alert>
        </div>

        <!-- <div class="link-container">
            <el-collapse v-if="appLinkResult.length > 0">
                <el-collapse-item name="result-pannel" title="链接提取">
                    <el-scrollbar height="400px" min-size="10" class="scrollbar">
                        <div v-for="item in appLinkResult">
                            <LinkItem :linkResult="item" />
                        </div>
                    </el-scrollbar>
                </el-collapse-item>
            </el-collapse>
        </div> -->

        <div class="result-container">
            <div v-if="totalSelectLongTopic > 0" class="confirm-btn display-flex-center">
                <el-button type="success" plain @click="AISummary">选中{{ totalSelectLongTopic }}个长文，进行摘要</el-button>
            </div>
            <div class="progress-bar display-flex-center" v-if="inAIprocess">
                <el-progress :percentage="aiProcessPercentage" :format="processDisplay" color="rgb(22, 185, 152)"
                    :stroke-width="24" :text-inside="true" />
            </div>
            <el-collapse v-model="resultActiveNames" v-if="appTopicAIResult.length > 0">
                <el-collapse-item name="result-pannel" title="摘要结果">
                    <el-scrollbar height="400px" class="scrollbar">
                        <div v-for="  item   in   appTopicAIResult  ">
                            <SummaryItem :summaryResult="item" @jumpToView="jumpToView" />
                        </div>
                    </el-scrollbar>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script>

import { summaryRequest } from '../../common/api'
import { computeMd5 } from '../../common/utils'
import SummaryItem from './SummaryItem.vue';
import { READ_GROUP_CONFIG } from '../../common/const'

export default {
    components: {
        SummaryItem,
    },
    data() {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return {
            startDate: yesterday,
            endDate: today,
            inAIprocess: false,
            aiProcessPercentage: 0,
            tagState: {},
            selectedTagCount: 0,
            filterActiveNames: ['date-range-select'],
            resultActiveNames: ['result-pannel'],
            appTopicObjects: [],
            appTopicAIResult: [],
            appLinkResult: [],
            appTopicNodes: null,
            message: null,
            groupId: null,
            groupName: null,
            groupConfig: {}
        };
    },
    computed: {
        dateSelectTitle() {
            return `日期(${this.startDate.getMonth() + 1}/${this.startDate.getDate()}-${this.endDate.getMonth() + 1}/${this.endDate.getDate()})`;
        },
        tagSelectTitle() {
            if (this.selectedTagCount == 0)
                return `标签(未选择标签，不进行过滤)`;
            else
                return `标签(已选择${this.selectedTagCount}个标签)`;
        },
        totalSelectLongTopic() {
            var count = 0;
            // 遍历appTopicObjects，display为true的topic的数量
            for (var i = 0; i < this.appTopicObjects.length; i++) {
                if (this.appTopicObjects[i].display && this.appTopicObjects[i].is_long) {
                    count++;
                }
            }
            return count;
        },

    },
    methods: {
        async filterConfirm() {
            // if start date is later than end date, send alert
            if (this.startDate > this.endDate) {
                this.message = '开始日期不能晚于结束日期';
                return;
            }
            // scroll page until the last app-topic's date is earlier than startDate
            await this.checkDateAndScroll();
            // get all app-topic elements
            this.appTopicNodes = this.getAllAppTopics();
            this.getGroupIdAndName();
            await this.getGroupConfig();

            // turn app-topic elements to app-topic objects, add tag、date、and so on
            this.appTopicObjects = this.getAppTopicObjects(this.appTopicNodes);
            // get tag count
            this.tagState = this.getTagState(this.appTopicObjects);
            // get link result 
            this.getLinkResult(this.appTopicObjects);
            this.message = null;
        },

        startDateConfirm() {
            // set start date to 00:00:00
            this.startDate.setHours(0, 0, 0, 0);
        },

        endDateConfirm() {
            // set end date to 23:59:59
            this.endDate.setHours(23, 59, 59, 999);
        },

        tagType(checked, tag) {
            if (checked) {
                return 'success';
            } else if (tag === "星主" || tag === "合伙人" || tag === "精华") {
                return 'warning';
            } else {
                return 'info';
            }
        },

        async getGroupConfig() {
            this.groupConfig = await chrome.runtime.sendMessage({
                action: READ_GROUP_CONFIG,
                groupName: this.groupName
            });
        },

        getLinkResult(topicObjects) {
            for (var i = 0; i < topicObjects.length; i++) {
                if (topicObjects[i].links.length > 0) {
                    this.appLinkResult.push(topicObjects[i]);
                }
            }
        },

        processDisplay(percentage) {
            if (percentage == 100) {
                this.inAIprocess = false;
                return '完成';
            }
            else {
                const currentComplete = Math.floor(percentage / 100.0 * this.totalSelectLongTopic);
                return `${currentComplete}/${this.totalSelectLongTopic}`;
            }
        },

        processCheck() {
            this.aiProcessPercentage = this.appTopicAIResult.length / this.totalSelectLongTopic * 100;
        },

        jumpToView(idx) {
            const topicNode = this.appTopicNodes[idx];
            topicNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        getAppTopicObjects(appTopicNodes) {
            var appTopicObjects = [];
            for (var i = 0; i < appTopicNodes.length; i++) {
                var topicNode = appTopicNodes[i];
                var date = this.getTopicDate(topicNode);
                if (date < this.startDate || date > this.endDate) {
                    topicNode.style.display = 'none';
                    continue;
                }

                const is_long = this.checkIfContentIsLong(topicNode);
                const tagList = this.getTopicTagList(topicNode);
                if (is_long) {
                    tagList.push('长文');
                } else {
                    tagList.push('短文');
                }
                const role = this.getRole(topicNode);
                if (role != null) {
                    tagList.push(role);
                }

                const isJinhua = this.checkIfJinhua(topicNode);
                if (isJinhua) {
                    tagList.push('精华');
                }

                var appTopicObject = {
                    idx: i,
                    date: this.getTopicDate(topicNode),
                    tags: tagList,
                    tagSelected: 0,
                    display: true,
                    summary: null,
                    md5: null,
                    is_long: is_long,
                    links: this.getTopicLinks(topicNode),
                    summary: null,
                    author: this.getAuthor(topicNode),
                }
                appTopicObjects.push(appTopicObject);
            }
            return appTopicObjects;
        },

        getTopicTagList(appTopic) {
            // 在app-topic元素中找到app-tag-container元素
            var appTagContainer = appTopic.querySelector('app-tag-container');
            // 在app-tag-container元素中找到所有包含tag类的div
            var tagDivs = appTagContainer.querySelectorAll('div.tag');
            // 遍历tagDivs，获取每个div中的tag名称
            var tagList = [];
            for (var i = 0; i < tagDivs.length; i++) {
                var tagDiv = tagDivs[i];
                var tag = tagDiv.textContent;
                tagList.push(tag);
            }
            if (tagList.length == 0) {
                tagList.push(' 无标签 ');
            }
            return tagList;
        },

        getAuthor(topicNode) {
            var author = topicNode.querySelector(".author");
            var authorName = author.querySelector(".role").textContent;
            return authorName;
        },

        checkIfJinhua(topicNode) {
            // if .digest exists, return true
            var digest = topicNode.querySelector(".digest");
            if (digest != null) {
                return true;
            }
            return false;
        },

        getRole(topicNode) {
            // 通过.author找到作者信息
            var author = topicNode.querySelector(".author");
            // 通过.role找到作者角色
            var role = author.querySelector(".role");
            // 获取当前节点的class
            var classList = role.classList;
            // 遍历classList，返回第一个不是“role”的class name
            for (var i = 0; i < classList.length; i++) {
                var className = classList[i];
                if (className != "role") {
                    if (className == 'owner') {
                        return "星主"
                    }
                    if (className == 'partner') {
                        return "合伙人"
                    }
                }
            }
            return null;
        },

        getTopicLinks(topicNode) {
            var content = topicNode.querySelector(".content");
            var links = content.querySelectorAll("a");
            var linkList = [];
            // if href is not http or https, remove it
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                var href = link.href;
                if (href.startsWith('http://') || href.startsWith('https://')) {
                    linkList.push(link);
                }
            }
            return linkList
        },

        checkIfContentIsLong(topicNode) {
            var content = topicNode.querySelector(".content");
            var contentText = content.textContent;
            if (contentText.length > this.groupConfig.longTextNum) {
                return true;
            }
            else {
                return false;
            }
        },


        getGroupIdAndName() {
            // get current href
            var href = window.location.href;
            // split href by '/' and get the last element
            this.groupId = href.split('/').pop();
            // get group name by '.group-text.name'
            this.groupName = document.querySelector('.group-text').querySelector('.name').textContent;
        },

        async AISummary() {
            this.inAIprocess = true;
            this.appTopicAIResult = [];
            var batch_size = 3;
            // 每次从appTopicObjects中取batch_size个topic，进行AI摘要
            var batch_contents = []
            var batch_content_idxs = []
            for (var i = 0; i < this.appTopicObjects.length; i++) {
                var topicObject = this.appTopicObjects[i];
                if (batch_contents.length < batch_size &&
                    topicObject.display &&
                    topicObject.is_long) {
                    if (topicObject.summary == null || topicObject.summary == '') {
                        var content = this.getContent(this.appTopicNodes[topicObject.idx]);
                        var md5 = computeMd5(content);
                        topicObject.md5 = md5;
                        batch_contents.push({
                            key: md5,
                            content: content
                        });
                        batch_content_idxs.push(i);
                    } else {
                        this.appTopicAIResult.push(topicObject);
                    }
                }
                if (batch_contents.length == batch_size || i == this.appTopicObjects.length - 1) {
                    if (batch_contents.length == 0) {
                        continue;
                    }
                    // sleep 1s
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // send request to AI server
                    var result = await summaryRequest(batch_contents, this.groupId, this.groupName);
                    if (!result.statu) {
                        this.message = result.message;
                        return;
                    }
                    // create summary result from result
                    const summaryResult = this.createSummaryResult(result.data);
                    // update appTopicObjects
                    for (var j = 0; j < batch_contents.length; j++) {
                        const idx = batch_content_idxs[j];
                        this.appTopicObjects[idx].summary = summaryResult[this.appTopicObjects[idx].md5];
                        if (this.appTopicObjects[idx].summary == '') {
                            this.appTopicObjects[idx].summary = '摘要生成失败';
                        }
                        this.appTopicAIResult.push(this.appTopicObjects[idx]);
                    }
                    // clear batch_contents
                    batch_contents = [];
                    batch_content_idxs = [];
                    this.processCheck();
                }
            }
        },

        createSummaryResult(result) {
            var summaryResult = {}
            for (var i = 0; i < result.length; i++) {
                const md5 = result[i].topic_key;
                if (result[i].llm_result != null) {
                    summaryResult[md5] = result[i].llm_result.result;
                } else {
                    summaryResult[md5] = '';
                }
            }
            return summaryResult;
        },

        getContent(topicNode) {
            // get content from ".content"
            var content = topicNode.querySelector(".content").textContent;
            return content;
        },

        tagClick(tag) {
            // 改变checked状态
            this.tagState[tag].checked = !this.tagState[tag].checked;
            if (this.tagState[tag].checked) {
                this.selectedTagCount += 1;
                this.tagSelectAction(tag);
            } else {
                this.selectedTagCount -= 1;
                this.tagUnSelectAction(tag);
            }
        },

        tagSelectAction(tag) {
            // 遍历所有app-topic，如果app-topic的tag list中包含tag，那么app-topic的tagSelected+1
            for (var i = 0; i < this.appTopicObjects.length; i++) {
                var appTopicObject = this.appTopicObjects[i];
                if (appTopicObject.tags.includes(tag)) {
                    appTopicObject.tagSelected += 1;
                }
                this.checkTopicDisplay(appTopicObject, this.appTopicNodes[i]);
            }
        },

        tagUnSelectAction(tag) {
            // 遍历所有app-topic，如果app-topic的tag list中包含tag，那么app-topic的tagSelected-1
            for (var i = 0; i < this.appTopicObjects.length; i++) {
                var appTopicObject = this.appTopicObjects[i];
                if (appTopicObject.tags.includes(tag)) {
                    appTopicObject.tagSelected -= 1;
                }
                this.checkTopicDisplay(appTopicObject, this.appTopicNodes[i]);
            }
        },

        checkTopicDisplay(appTopicObject, topicNode) {
            // 如果app-topic的tagSelected为0，那么app-topic的display为true，否则为false
            if (this.selectedTagCount == 0) {
                appTopicObject.display = true;
            } else {
                if (appTopicObject.tagSelected > 0) {
                    appTopicObject.display = true;
                } else {
                    appTopicObject.display = false;
                }
            }
            // if app-topic's display is true, show it, otherwise hide it
            if (appTopicObject.display) {
                topicNode.style.display = "inline";
            } else {
                topicNode.style.display = "none";
            }
        },

        getTagState(topicObjects) {
            // 遍历 tag-topic 字典
            // tagCountAndState 用于存储 tag 和对应的数量和标签的选中状态，默认为未选中
            var tagState = {};
            for (let i = 0; i < topicObjects.length; i++) {
                var appTopicList = topicObjects[i].tags;
                // 遍历每个tag， 如果 tag-topic 字典中没有该 tag，添加一个Object，包含count和checked，count设为1，checked默认为false
                // 否则count加1
                for (var j = 0; j < appTopicList.length; j++) {
                    var tag = appTopicList[j];
                    if (!(tag in tagState)) {
                        tagState[tag] = {
                            count: 1,
                            checked: false
                        };
                    } else {
                        tagState[tag].count += 1;
                    }
                }
            }
            return tagState;
        },

        getAllAppTopics() {
            // 找到所有的 app-topic 元素
            var appTopics = document.querySelectorAll('app-topic');
            return appTopics;
        },


        getTopicDate(appTopic) {
            // 在 app-topic 元素中找到 classname 为 date 的 div 标签
            var dateDiv = appTopic.querySelector('app-topic-header div.date');
            // 获取 dateDiv 中的日期字符串，并将其转换为 Date 对象
            var date = new Date(dateDiv.textContent);
            return date;
        },

        async checkDateAndScroll() {
            // 找到所有的 app-topic 元素
            var appTopics = this.getAllAppTopics()

            // 找到最后一个 app-topic 元素
            var lastAppTopic = appTopics[appTopics.length - 1];

            // 获取最后一个 app-topic 元素中的日期
            var date = this.getTopicDate(lastAppTopic);

            // 如果 dateDiv 中的日期比 startDate 要晚，滚动页面到最底部
            if (date >= this.startDate) {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
                // 等待2.5秒后再次执行这个函数
                await new Promise(resolve => setTimeout(resolve, 2500));
                await this.checkDateAndScroll();
            }
        }
    }
}
</script>

<style scoped lang="less">
.filter-container {

    .el-progress--line {
        margin: 15px 0px;
        width: 350px;
    }

    .scrollbar {
        padding: 10px;
    }

    // make element in date-range-select align center
    .date-range-select {
        margin: 10px 0px;
        display: flex;
        align-items: center;
        /* 垂直居中 */
        justify-content: center;
        /* 水平居中 */
        flex-direction: column;

        .date-select {
            margin: 10px 0px;
        }
    }

    .tag-select {
        margin: 10px 0px;
        display: flex;
        align-items: center;
        /* 垂直居中 */
        justify-content: center;
        /* 水平居中 */
        flex-wrap: wrap;

        /* 换行 */
        .tag-item {
            margin: 5px 5px;
            cursor: pointer;
        }
    }

    .confirm-btn {
        margin: 10px 0px;
    }

    .progress-bar {
        margin: 10px 0px;
    }

    .display-flex-center {
        display: flex;
        align-items: center;
        /* 垂直居中 */
        justify-content: center;
        /* 水平居中 */
        flex-direction: column;
    }

}
</style>
