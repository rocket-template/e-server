
import constants from '../../config/constants';
import axios from 'axios';

export let axiosInstance = axios.create({
    baseURL: constants.GITLABAPI,
    timeout: 30000,
    validateStatus: function (status) {
        return status >= 200 && status < 500; // default
    },
    withCredentials: true
});

export function requestParam(req, args) {
    let actoken = '';
    if (req.session) {
        if (req.session.userInfo && req.session.userInfo.access_token) {
            actoken = req.session.userInfo.access_token;
        }else {
            actoken = '48ee412e9d3da8b419b4f71c6c0c95f0e227cc7dcdd647c7e73c3d8f81e23058';
        }
    } else {
        actoken = '48ee412e9d3da8b419b4f71c6c0c95f0e227cc7dcdd647c7e73c3d8f81e23058';
    }
    let data = Object.assign({access_token: actoken}, args);

    return {
        params: data
    }
};