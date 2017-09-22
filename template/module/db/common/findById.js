import _        from 'lodash';
import mongoose from 'mongoose';
import errors   from '../../error';

let ObjectId = mongoose.Types.ObjectId;

export default async function(id, status, model, populate){

    let path=`${model.modelName}-findById`;
    if(!ObjectId.isValid(id)){
        return errors.error({
            code  : '104',
            path ,
            value : id
        });
    }

    try{
        let res = model.findById(id, '-password');

        if(_.isArray(status)){
            res = res.where('_status').in(status);
        }

        if(populate) {
            res = res.populate(populate);
        }

        res = await res;

        if(!res){
            return errors.error({
                code  : '108',
                path ,
                value : id
            });
        }

        return errors.success({
            result  : res
        });
    }catch(err){
        return Promise.reject(err);
    }
}
