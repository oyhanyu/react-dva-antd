/**
 * Created by oyhanyu on 2017/8/11.
 *
 */
import request from '../utils/request';

// 获取天气预报信息
async function getWeather (noErrorWarning) {
    return request(
        'http://weixin.jirengu.com/weather?cityid=WX4FBXXFKE4F',
        {
            method: 'get',
            headers: {

            },
            noErrorWarning
        }
    )
}

export default {
    getWeather
}