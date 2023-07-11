import { getToken } from "./auth";

function create_summary_request(contents, group_id, group_name) {
  const request = {
    group_id: group_id,
    group_name: group_name,
    llm_request: {
      contents: contents
    }
  }
  return request;
}

export async function summaryRequest(contents, group_id, group_name) {
  const token = await getToken();

  if (token == null) {
    return {
      statu: false,
      message: '请登录'
    }
  }
  const request = create_summary_request(contents, group_id, group_name);
  try {
    const response = await fetch('https://example.com/v1/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(request)
    })
    if (!response.ok) {
      return {
        statu: false,
        message: '请确保已登录并且Token余额充足'
      }
    }
    const resp = await response.json()
    if (resp.statu_code != 200) {
      return {
        statu: false,
        message: resp.message
      }
    }
    return {
      statu: true,
      data: resp.data
    }
  } catch (err) {
    console.log(err)
    return {
      statu: false,
      message: '请检查网络连接'
    }
  }
}

export async function getCostRequest() {
  const token = await getToken();

  if (token == null) {
    return {
      statu: false,
      message: '请登录'
    }
  }
  try {
    const response = await fetch('https://example.com/v1/cost', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    })
    if (!response.ok) {
      return {
        statu: false,
        message: '请确保已登录并且Token余额充足'
      }
    }
    const resp = await response.json()
    if (resp.statu_code != 200) {
      return {
        statu: false,
        message: resp.message
      }
    }
    return {
      statu: true,
      data: resp.data
    }
  } catch (err) {
    console.log(err)
    return {
      statu: false,
      message: '请检查网络连接'
    }
  }
}

