import { makeAutoObservable } from 'mobx'

export default class DataStore {
	constructor() {
		this._dataKorzina = []
		this._isUpdateKorzina = false

		makeAutoObservable(this)
	}


	setDataKorzina (data) {
		this._dataKorzina  = data
	}
	setIsUpdateKorzina (data) {
		this._isUpdateKorzina  = data
	}
	get dataKorzina () {
		return this._dataKorzina 
	}
	get isUpdateKorzina () {
		return this._isUpdateKorzina 
	}


}
