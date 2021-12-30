import axios from 'axios'
import { Message } from 'element-ui'
import domain from '@/config/domain'

class Request {
	baseConfig = {
		baseURL: domain,
		headers: {},
		timeout: 8000,
	}

	instance = null

	constructor() {
		const token = sessionStorage.getItem('token')
		if (token) {
			this.setHeader({
				Authorization: token,
			})
		} else {
			this.initInstance()
		}
	}

	// 设置请求头
	setHeader = headers => {
		this.baseConfig.headers = { ...this.baseConfig.headers, ...headers }
		this.initInstance()
	}

	initInstance() {
		this.instance = axios.create(this.baseConfig)
		this.setReqInterceptors()
		this.setResnterceptors()
	}

	// 请求拦截器
	setReqInterceptors = () => {
		this.instance.interceptors.request.use(
			config => {
				return config
			},
			err => {
				Message({
					type: 'error',
					message: '请求失败',
					showClose: true,
				})
				return Promise.reject(err)
			}
		)
	}

	// 响应拦截器
	setResnterceptors = () => {
		this.instance.interceptors.response.use(
			res => {
				const { code, data, msg } = res.data
				if (code === 200) {
					return data
				} else {
					Message({
						type: 'error',
						message: msg || '获取数据失败',
						showClose: true,
					})
					return Promise.reject(res)
				}
			},
			err => {
				Message({
					type: 'error',
					message: '服务器响应失败',
					showClose: true,
				})
				return Promise.reject(err)
			}
		)
	}

	// get请求
	get = (url, data = {}, config = {}) => this.instance({ ...{ url, method: 'get', params: data }, ...config })

	// post请求
	post = (url, data = {}, config = {}) => this.instance({ ...{ url, method: 'post', data }, ...config })

	// 不经过统一的axios实例的get请求
	postOnly = (url, data = {}, config = {}) =>
		axios({
			...this.baseConfig,
			...{ url, method: 'post', data },
			...config,
		})

	// 不经过统一的axios实例的post请求
	getOnly = (url, data = {}, config = {}) =>
		axios({
			...this.baseConfig,
			...{ url, method: 'get', params: data },
			...config,
		})

	// delete请求
	deleteBody = (url, data = {}, config = {}) => this.instance({ ...{ url, method: 'delete', data }, ...config })

	deleteParam = (url, data = {}, config = {}) =>
		this.instance({ ...{ url, method: 'delete', params: data }, ...config })
}

const request = new Request()

export default request
