import test from 'ava';
import res from '../../module/lib/coach-index';

test('coach-index', async (x) => {
    x.is(Array.isArray(res.data.result), true);
});
