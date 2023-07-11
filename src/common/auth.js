import { AuthenticationClient } from 'authing-js-sdk'
import { getCostRequest } from './api';
import { GET_USER_COST, SAVE_USER_COST } from './const';

function getAuthenticationClient() {
    const authenticationClient = new AuthenticationClient({
        appId: 'your_app_id',
        appHost: 'https://your_app.authing.cn',
    })
    return authenticationClient
}

export async function getToken() {
    const token = await chrome.runtime.sendMessage({ action: 'getToken' });
    return token;
}

export async function sendSmsCode(phone) {
    try {
        await getAuthenticationClient().sendSmsCode(phone)
    } catch (err) {
        console.log(err);
        return {
            statu: false,
            message: err.message,
        }
    }
    return {
        statu: true,
    }
}

export async function loginByPhoneCode(phone, code) {
    try {
        const user = await getAuthenticationClient().loginByPhoneCode(phone, code)
        if (user != null) {
            chrome.runtime.sendMessage({ action: 'saveUser', user: user });
            chrome.runtime.sendMessage({ action: 'saveToken', token: user.token });
            return {
                user: user,
                statu: true
            }
        }
    } catch (err) {
        return {
            user: null,
            statu: false,
            message: '验证码错误或失效',
        }
    }
}


export async function getUser() {
    const authenticationClient = getAuthenticationClient();
    const isLogin = await authenticationClient.checkLoginStatus();
    if (!isLogin) {
        return null;
    }
    const user = await authenticationClient.getCurrentUser();
    return user;
}

export async function logout() {
    await getAuthenticationClient().logout()
    chrome.runtime.sendMessage({ action: 'removeUser', });
    chrome.runtime.sendMessage({ action: 'removeToken', });
}

export async function getTokenLeft() {
    const userCost = await getCostRequest();
    if (userCost.statu) {
        chrome.runtime.sendMessage({ action: SAVE_USER_COST, userCost: userCost.data });
        return {
            statu: true,
            token_left: userCost.data.token_left,
        }
    } else {
        const userCostStorage = await chrome.runtime.sendMessage({ action: GET_USER_COST, });
        if (userCostStorage) {
            return {
                statu: true,
                token_left: userCostStorage.token_left
            }
        }
    }
    return {
        statu: false,
        message: '获取Token余额失败',
    }
}