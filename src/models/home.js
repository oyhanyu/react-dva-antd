/**
 * Created by oyhanyu on 2017/6/26.
 */
import { routerRedux } from 'dva/router';
import homeService from '../services/home';
import Util from '../utils/util';

export default {
    namespace: 'home',
    state: {
        weatherData: [],
        showDays: 3,
        btnText: 'More'
    },
    // 异步数据获取
    effects: {
        *fetch ({payload}, { put, call }) {
            let respond = yield call(homeService.getWeather);
            if(respond && respond.data.status === 'OK'){
                yield put({
                    type: 'setWeatherData',
                    weatherData: respond.data.weather
                })
            }
        },
        *more ({showDays}, { put }) {
            yield put({
                type: 'showMore',
                showDays,
                btnText: showDays === 3 ? 'More': 'HideMore'
            })
        }
    },
    // Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。
    // 数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。
    // 可以作为初始化数据的地方
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/home') {
                    dispatch({type: 'fetch', payload: query});
                }
            });
        }
    },
    // state更新
    reducers: {
        setWeatherData (state, {weatherData}) {
            return { ...state, weatherData};
        },
        showMore (state, {showDays, btnText}) {
            return { ...state, showDays, btnText};
        }
    }
}