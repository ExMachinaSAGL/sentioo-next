module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },

    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/eslint-recommended"
    ],

    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },

    "parserOptions": {
        "ecmaVersion": 2018,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },

    "plugins": [
        "vue",
        "@typescript-eslint"
    ],

    "rules": {
        'no-unused-vars': ['warn', { 'varsIgnorePattern': '^_' }],
        '@typescript-eslint/no-unused-vars': ['warn', { 'varsIgnorePattern': '^_' }]
    }
};
