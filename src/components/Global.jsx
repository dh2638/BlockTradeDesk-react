var Config = {
    domain: process.env.APIURL,
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
        currency_preference:'/configuration/currency-preference/',
        notification_all:'/notification/',
        notification_unread:'/notification/unread/',
        notification_set_read:'/notification/mark-as-read/',
        contact_submit:'/contact/submit/',
        stream_websocket: 'wss://ws.coinapi.io/v1/'

    },
    coin_key: process.env.COINAPI,
    coin_hostname: 'https://rest.coinapi.io'
};
module.exports = Config;