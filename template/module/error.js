import _ from 'lodash';
import errsConf from '../config/errors';

const formatErrors = {};

(function(){
    for(let err in errsConf){
        let sub = errsConf[err].sub;

        for(let code in sub){
            formatErrors[code] = {
                parent : {
                    code    : err,
                    message : errsConf[err].message,
                },
                message : sub[code]
            };
        }
    }
})();

let errorFn = function(param, _type){
    if(_.isPlainObject(param))
        param = [param];
    else if(!_.isArray(param)){
        param = [{
            errCode : 500
        }];
    }

    let
    topCode    = [],
    topMessage = [],
    errors     = [];

    param.forEach(function(err){
        let
        difine = formatErrors[err.code] || formatErrors['1'];

        topCode.push(difine.parent.code);
        topMessage.push(difine.parent.message);

        errors.push({
            code    : parseInt(err.code),
            message : difine.message,
            path    : err.path,
            value   : err.value
        });
    });

    let
    data = {
        code    : topCode.length > 1 ? topCode.join(',') : parseInt(topCode[0]),
        message : topMessage.join(','),
        errors  : errors
    };

    return _type === 'lite' ? errors : data;
};

let
formatFn = function(err){
    let
    parent = null;
    if(err.name === 'MongoError'){
        if(_.isFunction(err.toJSON))
            err = err.toJSON();
        return Promise.reject({
            code    : 1,
            message : 'Unknown error',
            errors : [
                {
                    code    : err.code || 31,
                    // message : err.errmsg
                }
            ]
        });
    }

    if(err.name === 'ValidationError'){
        let
        errors = [];

        for(let key in err.errors){
            errors.push({
                code    : err.errors[key].kind === 'required' ? 103 : 104,
                message : formatErrors[err.errors[key].message] ? formatErrors[err.errors[key].message].message : err.errors[key].message,
                name    : key
            });
        }

        return {
            code    : 400,
            message : 'Bad request',
            errors
        };
    }

    let
    errors  = [];

    for(let key in err.errors){
        let
        property = err.errors[key].properties,
        code = property.message,
        error = formatErrors[code] || null;

        if(error){
            parent = error.parent;
        }

        errors.push(error ? {
            code    : parseInt(code),
            message : error.message,
            path    : property.path,
            value   : property.value
        } : {
            code    : 1,
            message : 'Unknown error',
            path    : property.path,
            value   : property.value
        });
    }

    return {
        code    : parent ? parseInt(parent.code) : 1,
        message : parent ? parent.message : 'Unknown error',
        errors  : errors.length > 0 ? errors : err
    };
};

let
successFn = function(data){
    return {
        code : 200,
        data : data
    };
};

export default {
    code    : formatErrors,
    message : function(code){
        return formatErrors[code].message;
    },
    error   : errorFn,
    format  : formatFn,
    success : successFn
};
