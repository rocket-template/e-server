
import mongoose from 'mongoose';
import errors   from '../../error';
import findById from './findById';



let updateRecord = async function(data, model) {

    let result;

    try{
        result = await model.findOneAndUpdate({
            _id : data.id
        }, data.data).select('-password');
    } catch (err) {
       // console.log(JSON.stringify(err, null, 4));
        return errors.format(err);
    }
     if(!result) {
            return errors.error({
                code  : '108',
                path  : 'id',
                vaule : data.id
            });
        }
    Object.assign(result,data.data.$set);
    return errors.success(result);
};

export default async function(id, data, model){
    data = {
        id,
        data: {
            $set: data
        }
    };

    try {
        let res = await updateRecord(data, model);

        return res;
    } catch (err) {
        console.log(JSON.stringify(err, null, 4));
        return err;
    }
};
