import { makeAutoObservable } from 'mobx'

export default class UserStore {
	constructor() {
		this._data = {}
		this._isAuth = false
		this._user = {}
		this._userData = {}
		
		makeAutoObservable(this)
	}
	setData(data) {
		this._data = data
	}
	setIsAuth(bool) {
		this._isAuth = bool
	}
	setUser(user) {
		this._user = user
	}
	setUserData(data) {
		this._userData = data
	}


	get data() {
		return this._data
	}
	get isAuth() {
		return this._isAuth
	}
	get user() {
		return this._user
	}
	get userData() {
		return this._userData
	}
}