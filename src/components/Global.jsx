var Config = {
    domain: 'http://127.0.0.1:8000/en',
    project_name: 'Blocktradedesk',
    api: {
        login: '/user/login/',
        signup: '/user/register/',
        signup_active: '/user/register/verify/',
        forget_password: '/user/forget-password/',
        forget_password_verify: '/user/forget-password/verify/',
        forget_password_set_password: '/user/forget-password/set-password/',
        change_pasword: '/user/change-password/',
        me: '/user/me/',
        user_transations: '/user/transations/',
        user_currencies: '/user/currencies/',
        all_currencies: '/currency/all/',
        currencies_hour_data: '/currency/hour/data/',
        currency_type: '/currency/all/',
        stream_websocket: 'wss://ws.coinapi.io/v1/'

    },
    coin_key:'03F038FE-7098-420C-905F-6ACFFF85EF11',
    coin_hostname: 'https://rest.coinapi.io'
};
module.exports = Config;