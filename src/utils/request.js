import fetch from 'dva/fetch';
import { Modal } from 'antd';
import pathToRegexp from 'path-to-regexp';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  let status = response.status;
  if (status >= 200 && status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/* 统一错误处理，如果不希望弹出错误信息，请在调用ajax请求时，options配置传入{noErrorWarning: true} 即可 */
function commonError (err) {
    const status = err && err.response ? err.response.status : '';
    if (status === 401) {
        Modal.warning({
            title: '警告',
            content: '您可能还没有登录，请先登录再进行相关操作！',
            okText: '去登录',
            onOk () {
                window.location.hash = '/login/standard';
            }
        });
    } else if (status === 403) {
      const match = pathToRegexp('/login/standard').exec(window.location.hash.substr(1));
      // 特殊处理用户登录请求时的403错误
      if (!match) {
        Modal.warning({
          title: '警告',
          content: '您没有权限访问该资源！',
          okText: '我知道了',
          onOk () {
            window.location.hash = '/';
          }
        });
      }
    } else {
        err.response.json().then(function(json){
            let message = '系统发生未知错误!';
            if(json && json.message){
                message = json.message;
            }
            Modal.warning({
                title: '警告',
                content: message,
                okText: '确定'
            });
        })
    }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // options = Object.assign({credentials:'include'}, options);
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch( (err) => {
        if(!options.noErrorWarning){
            commonError(err);
        }
    } );
}
