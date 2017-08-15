/**
 * Created by oyhanyu on 2017/6/26.
 * 工具类函数
 */

import _isEmpty from 'lodash/isEmpty';
import _extend from 'lodash/extend';
import _clone from 'lodash/clone';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';

import {notification} from 'antd';

const notyDefaultConfig = {
    message: '消息',
    description: '提示信息',
    type: 'info'
},
    theme = {
        error: {
            backgroundColor: '#F7BA2A'
        }
    };
export default {

    jsonToQueryString (json) {
        if (this.isEmpty(json)) {
            return '';
        }
        return Object.keys(json).map(function(key) {
            return key + '=' + json[key];
        }).join('&');
    },

    getUrlParam (name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;

    },

    pathToJson () {
        let obj={},
            url = window.location.search,
            keyValue=[],
            key='',
            value='',
            paraString=url.substring(url.indexOf('?')+1, url.length).split('&');
        for(var i in paraString) {
            keyValue=paraString[i].split('=');
            key=keyValue[0];
            value=keyValue[1];
            obj[key]=value;
        }
        return obj;
    },

    noty (config) {
        config = _extend(notyDefaultConfig, {style:theme[config.type||'warn']}, config);
        notification[config.type](config);
    },

    isEmpty (obj) {
        return _isEmpty(obj);
    },

    clone (obj,isDeep) {
        return _clone(obj,isDeep)
    },

    isArray (obj) {
        return _isArray(obj);
    },

    findArray (arr, predicate, thisArg) {
        return _find(arr, predicate,thisArg);
    },

    setSessionStorage (key, value) {
        if(window.sessionStorage){
            window.sessionStorage.setItem(key, value.toString());
        }
    },
    getSessionStorage (key) {
        if(window.sessionStorage){
            return window.sessionStorage.getItem(key);
        }
        return null;
    },
    removeSessionStorage (key ) {
        if(window.sessionStorage){
            return window.sessionStorage.removeItem(key);
        }
    },
    setLocalStorage (key, value, expTime) {
        if(window.localStorage){
            // 默认为24小时
            expTime = expTime || 24*60*60*1000;
            window.localStorage.setItem('uaa-expires', (new Date()).getTime() + expTime);
            window.localStorage.setItem(key, value.toString());
        }
    },
    getLocalStorage (key) {
        if(window.localStorage){
            let now = (new Date()).getTime(),
                expires = localStorage.getItem('uaa-expires');
            if(expires && now > +expires){
                this.removeLocalStorage(key);
                return null;
            }
            return window.localStorage.getItem(key);
        }
        return null;
    },
    removeLocalStorage (key ) {
        if(window.localStorage){
            return window.localStorage.removeItem(key);
        }
    }
}
