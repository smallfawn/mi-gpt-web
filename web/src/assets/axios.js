import axios from 'axios'
export function request(config) {
    return new Promise((resolve, reject) => {
        axios.request(config).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}