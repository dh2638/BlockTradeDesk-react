var Config = require('./Global');
import toastr from 'toastr';

export const apiMethods = {
    post,
    get,
    put,
    coinapi
};


function post(URL, requestData, Auth) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: requestData
    };
    if (Auth) {
        requestOptions['headers']['Authorization'] = 'Token ' + localStorage.getItem('user_token')
    }
    return fetch(Config['domain'] + URL, requestOptions)
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                        return Promise.reject(data['non_field_errors']);
                    }
                )
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                toastr.success(data.message);
            }
            return data;
        }).catch(function (ex) {
            toastr.error(ex);
        });
}

function get(URL, requestData, Auth) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        body: requestData
    };
    if (Auth) {
        requestOptions['headers']['Authorization'] = 'Token ' + localStorage.getItem('user_token')
    }
    return fetch(Config['domain'] + URL, requestOptions)
        .then(response => {
            return response.json();
        })
        .catch(function (ex) {
            toastr.error(ex);
        });
}

function put(URL, requestData, Auth) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: requestData
    };
    if (Auth) {
        requestOptions['headers']['Authorization'] = 'Token ' + localStorage.getItem('user_token')
    }
    return fetch(Config['domain'] + URL, requestOptions)
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                        return Promise.reject(data['non_field_errors']);
                    }
                )
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                toastr.success(data.message);
            }
            return data;
        }).catch(function (ex) {
            toastr.error(ex);
        });
}


function coinapi(URL) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    requestOptions['headers']['X-CoinAPI-Key'] = Config['coin_key'];
    return fetch(Config['coin_hostname'] + URL, requestOptions)
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                        return Promise.reject(data['error']);
                    }
                )
            }
            return response.json();
        })
        .catch(function (ex) {
            console.log(ex);
        });
}