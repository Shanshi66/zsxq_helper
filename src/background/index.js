import { DEFAULT_GLOBAL_CONFIG, GET_USER_COST, READ_GLOBAL_CONFIG, READ_GROUP_CONFIG, SAVE_GLOBAL_CONFIG, SAVE_USER_COST } from "../common/const";

// background.js
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "zsxqAiSidebar",
        title: "知识星球AI助手",
        documentUrlPatterns: ["https://wx.zsxq.com/dweb2/index/group/*"],
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "zsxqAiSidebar") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const sidebar = document.createElement('div');
                sidebar.id = 'zsxqAiSidebar';
                document.body.appendChild(sidebar);
            }
        });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content/index.js']
        });
        chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['content/index.css']
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openOptionsPage") {
        chrome.runtime.openOptionsPage();
    }
    if (message.action === "closeHelperSidebar") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: () => {
                const sidebar = document.getElementById('zsxqAiSidebar');
                sidebar && sidebar.remove();
            }
        });
    }
    if (message.action === "saveUser") {
        chrome.storage.sync.set({ user: message.user });
    }
    if (message.action === "saveToken") {
        chrome.storage.sync.set({ token: message.token });
    }
    if (message.action === "getToken") {
        chrome.storage.sync.get(['token'], function (result) {
            sendResponse(result.token);
        });
        // important: return true to indicate that you want to send a response asynchronously
        return true;
    }
    if (message.action === "getUser") {
        chrome.storage.sync.get(['user'], function (result) {
            sendResponse(result.user);
        });
        // important: return true to indicate that you want to send a response asynchronously
        return true;
    }
    if (message.action === "removeUser") {
        chrome.storage.sync.remove(['user']);
    }
    if (message.action === "removeToken") {
        chrome.storage.sync.remove(['token']);
    }
    if (message.action === READ_GLOBAL_CONFIG) {
        chrome.storage.sync.get(["global_config"], function (result) {
            sendResponse(result.global_config);
        });
        // important: return true to indicate that you want to send a response asynchronously
        return true;
    }
    if (message.action === SAVE_GLOBAL_CONFIG) {
        chrome.storage.sync.set({ global_config: message.data }, function () {
            sendResponse(true);
        });
        return true;
    }
    if (message.action === READ_GROUP_CONFIG) {
        chrome.storage.sync.get(["global_config"], function (result) {
            if (result.global_config == null) {
                sendResponse(DEFAULT_GLOBAL_CONFIG);
            } else {
                sendResponse(result.global_config);
            }
        });
        // important: return true to indicate that you want to send a response asynchronously
        return true;
    }
    if (message.action === GET_USER_COST) {
        chrome.storage.sync.get(["user_cost"], function (result) {
            sendResponse(result.user_cost);
        });
        // important: return true to indicate that you want to send a response asynchronously
        return true;
    }
    if (message.action === SAVE_USER_COST) {
        chrome.storage.sync.set({ user_cost: message.userCost }, function () {
            sendResponse(true);
        });
        return true;
    }
});