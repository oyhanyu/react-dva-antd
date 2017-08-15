/**
 * Created by oyhanyu on 2017/8/8.
 */
import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import Home from './routes/home';

/* eslint-disable */
export default function ({ history }) {
    return (
        <Router history={history}>
            <Route path="/" component={Home}>
                <IndexRedirect to="/home"/>
            </Route>
            <Route path="/home" component={Home}></Route>
        </Router>
    );
};