/**
 * Created by oyhanyu on 2017/8/8.
 */
import './index.css';
import dva from 'dva';
import { useRouterHistory, browserHistory } from 'dva/router';
import { createHashHistory } from 'history';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
    // history: useRouterHistory(createHashHistory)({ queryKey: false })
    history: browserHistory
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/home'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#app');