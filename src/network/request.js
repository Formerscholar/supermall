//主接口 http://123.207.32.32:8000/api/hy 备用接口 http://106.54.54.237:8000/api/hy
const api = "http://123.207.32.32:8000/api/hy"
import axios from 'axios'
export function request(config) {
    const instance = axios.create({
        baseURL: api,
        timeout: 5000
    })
    instance.interceptors.request.use(config => {
        return config
    }, err => {})
    instance.interceptors.response.use(res => {
        return res.data
    }, err => {})
    return instance(config)
}