/**
 * Created by zhangmike on 16/8/25.
 */
import request from './request';
import {logger} from './log';

export default function (port) {
    logger.info("我是来测试的");
    logger.info({id:1, name: 'zeromike', msg: '我是操作的'});
}