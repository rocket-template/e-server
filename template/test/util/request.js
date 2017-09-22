import _     from 'lodash';
import axios from 'axios';

const commonHTTPHeaders = {
    'Content-Type' : 'application/json'
};

export default
    function({ method = 'get', headers = commonHTTPHeaders, url='', params = {}, data = {} } = {}){
        if(!_.isFunction(axios[method]))
            return Promise.reject({
                code    : 500,
                message : `Error: HTTP method "${method}" is undefined.`
            });

        method = method.toLowerCase();

        return axios({
                url,
                method,
                params, // the URL parameters to be sent with the request
                data,   // the data to be sent as the request body, only applicable for request methods 'PUT', 'POST', and 'PATCH'
                headers 
            });
    };
