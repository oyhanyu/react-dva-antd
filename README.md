## install dependencies

npm install

## serve with hot reload at localhost:8000
npm run dev or PORT=8080 npm run dev set port to 8080

## build for production with minification
npm run build



## 几点说明

1、为什么要选择dva.js

选择dva是因为我在搭建一套新的react项目的时候，公司没有自己的组件积累，想要快速的完成项目，只能使用第三方的组件库，尤其是UI组件库。之前跟蚂蚁的前端有过工作接触，对其antd design有所了解，又对比了一些其他的第三方UI组件，最后选择了antd。再看antd的文档时，发现了dva这个东西，一下就喜欢上了。

dva是什么？官方如是说：

```
dva 是基于现有应用架构 (redux + react-router + redux-saga 等)的一层轻量封装，没有引入任何新概念，全部代码不到 100 行。( Inspired by elm and choo. )
```

由于之前使用redux时的不爽，再看完这个以后，使用起来果然是清爽许多，再也不用来回切换文件，一目了然，代码量也不多，但是再跟antd一起使用的时候，还是遇到了很多坑，以及文档中没有太详细提及的地方，总结出来也许别人在用的时候会少走许多弯路。

2、核心

1）代码结构

![屏幕快照 2017-08-22 下午3.44.50](/Users/edz/Desktop/屏幕快照 2017-08-22 下午3.44.50.png)

dist: 项目打包文件目录；

mock：可以做数据的mock；

public：单页面应用html模版文件；

src：源文件

​	源文件中包含以下：

​	assets: 放置一些静态资源文件；

​	components: 公共的react组件；

​	modeles：dva的核心，用于把reducer, initialState, action, saga 封装到一起，解决redux开发蛋疼的问题；

​	routes：对应每个模块的视图；

​	services: 针对每个model提供独立的http请求；

​	theme: 主题，可以配置多种antd主题；

​	utils：工具类；

​	constants.js: 公共的静态变量配置；

​	index.js：系统的入口文件；

​	router.js: react-router 配置；路由配置指向routes中的文件

.bablerc: babel 配置；

.eslintrc.js: eslint配置;

.roadhogrc:roadhog配置，roadhog 是一个 cli 工具，提供 `server`、 `build` 和 `test`，dva中集成了它，详细配置：https://github.com/sorrycc/roadhog

webpack.config.js：webpack配置文件，dva中默认提供了一套webpack的基础配置，通常情况下我们不需要再单独配置该文件，但是对于一些有特殊需求的我们可以在此文件中对原有的配置进行修改，增加自己的配置

3、关键点和主要流程

1）入口文件index.js

```
import './index.css';
import dva from 'dva';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
    history: useRouterHistory(createHashHistory)({ queryKey: false })
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/login'));
app.model(require('./models/home'));
app.model(require('./models/config'));
app.model(require('./models/user'));
app.model(require('./models/audit'))

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#app');
```

该文件主要用于dva实例的创建、插件plugin、model、router的应用和配置，一句app.start('#app')开启了美好的人生。

2、用户的操作在感官上看到的是不同的页面，而背后对应的是每一个不同的router，也就是routes中每一个view文件。

redux中统一的状态管理，在dva中体现在

routes/config.js

```
const Config = (props) => {
    const { config, loading, dispatch, roles, openKeys } = props；
    return (
    	<div>Config</div>
    );
}
function mapStateToProps(state) {
	// 此处的state是所有的state，我们只要取我们当前页面需要的即可
    return {
        config: state.config,
        loading: state.loading.models.config,
        roles: state.config.roles,
        openKeys: state.home.openKeys
    };
}

// export default config;与model相关联
export default connect(mapStateToProps)(Config);
```

model代码：

models/config.js

```
import { routerRedux } from 'dva/router';
import userService from '../services/user';
import Util from '../utils/util';

export default {
    namespace: 'home',
    // 定义对应route中需要的state
    state: {
        userInfo: {},
        openKeys: []
    },
    // 异步数据获取
    effects: {
        *fetch ({payload}, { put, call }) {
            let user = yield call(userService.getUser);
            if(user && user.data){
                yield put({
                    type: 'showUser',
                    userInfo: user.data
                });
            }
        },
        *menuSelect ({path}, {put, call}) {
            yield put(routerRedux.push(path));
        },
        *openChanges ({openKeys}, {put, call}) {
            yield put({
                type: 'changeOpenKeys',
                openKeys
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
        showUser (state, {userInfo}) {
            return { ...state, userInfo}
        },
        changeOpenKeys (state, {openKeys}) {
            return { ...state, openKeys:openKeys}
        }
    }
}
```

那么用户的操作怎么与state的更新联系到一起呢？在事件中使用以下代码：

```
props.dispatch({
    type: 'config/fetch',
    payload: {
        page: page.current
    }
})
```

Type:对应的是models/config.js 中的namespace, fetch对应effects中的函数名称,effects负责接收dispatch事件，进行异步数据获取，然后通知reducers进行状态的变更。

3、那些年遇到的坑（也可能是自己没看清）

1）dva集成antd样式导入问题：

需要在roadhogrc中配置如下：

```
{
  "entry": "src/index.js",
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": true }]
      ],
      "proxy": {
        "/ua": {
          "target": "https://x-id.i-counting.cn",
          "changeOrigin": true
        }
      }
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": "css" }]
      ]
    }
  },
  "theme": "./src/theme/theme.js"
}
```

该文件还可以为配置proxy和antd应用的theme等等。

2）webpack的配置

因为dva本身提供的内置webpack配置比较基础，功能比较简单，也有很多不太实用，所有通常情况下我们要修改此文件。参照项目中webpack.config.js配置

3、该项目clone后就可以使用，如有问题欢迎留言交流

## Dependencies

React  https://github.com/facebook/react

dva.js https://github.com/dvajs/dva

antd.js https://ant.design/index-cn



