import errors   from '../../error';


let
queryRecords = async function(data, model){
    try{
        let status = data.status
        let
        count = data.filter
            ? model.count(data.filter)
            : model.count();

        count = await count.where('_status').in(status).exec();

        return errors.success({
            count
        });
    }catch(err){
        return errors.format(err);
    }
};

export default async function(data,model){

    try {
        let res = await queryRecords(data, model);
        return res;
    } catch(err) {
        return err;
    }
};

