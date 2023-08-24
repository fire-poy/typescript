module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        'google',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    plugins: ['react-refresh', 'prettier'],
    rules: {
        'react-refresh/only-export-components': 'warn',
        'no-undef': 'off',
        'object-curly-spacing': 0,
    },
}
