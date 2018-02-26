import toastr from 'toastr';
let Config = require('./Global');

export const apiMethods = {
    post,
    get,
    put,
    coinapi
};

function setAuthentication(options) {
     options['headers']['Authorization'] = 'Token ' + localStorage.getItem('user_token');
    return options
}
function post(URL, requestData, Auth) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: requestData
    };
    if (Auth) {
        setAuthentication(requestOptions);
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
    };
    if (Auth) {
        setAuthentication(requestOptions);
    }
    return fetch(Config['domain'] + URL, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.json();
        });
}

function put(URL, requestData, Auth) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: requestData
    };
    if (Auth) {
        setAuthentication(requestOptions);
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