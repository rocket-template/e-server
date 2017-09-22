
export default function (msg, options = {}) {
    return {
        msg: msg,
        code: options.code || 200,
        data: options.data || {}
    }
}