import { request } from './axios'
export { start, end, set, get, init, log }
async function start() {
    let { data: result } = await request({
        url: '/api/start',
        method: 'GET'
    })
    return result
}
async function end() {
    let { data: result } = await request({
        url: '/api/end',
        method: 'GET'
    })
    return result
}
async function set(type, vk) {
    let { data: result } = await request({
        url: '/api/set',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            type: type
        },
        data: JSON.stringify(
            vk
        )
    })
    return result
}
async function get(type) {
    let { data: result } = await request({
        url: '/api/get',
        method: 'GET',
        params: {
            type: type,
        }
    })
    return result
}
async function init() {
    let { data: result } = await request({
        url: '/api/init',
        method: 'GET',
    })
    return result
}
async function log() {
    let { data: result } = await request({
        url: '/api/log',
        method: 'GET',
    })
    return result
}