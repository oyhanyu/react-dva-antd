/**
 * Created by oyhanyu on 2017/7/21.
 */
module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    "extends": ["plugin:react/recommended" ],
    // required to lint *.js, *.jsx files
    plugins: [
        'react'
    ],
    rules: {
        "quotes": [2, "single"],
        "react/display-name": [ 1, {"ignoreTranspilerName": false }]
    }
}