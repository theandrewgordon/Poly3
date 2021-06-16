/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

let registry = {
	rootInstances: [],
	subscribers: []
};

let loadingMap = new Map();
let loadingListeners = [];

export function computeGeneralLoading() {
	let generalLoading = false;
	for (let loadingValue of loadingMap.values()) {
		if (loadingValue) generalLoading = true;
	}
	return generalLoading;
}

export function setLoadingValue(loadingKey, loadingValue) {
	loadingMap.set(loadingKey, loadingValue);
	notifyLoadingListeners();
}

function notifyLoadingListeners() {
	let generalLoading = computeGeneralLoading();
	loadingListeners.forEach(listener => listener(generalLoading));
}

export function addLoadingListener(listener) {
	loadingListeners.push(listener);
}

export function getService(serviceName) {
	return registry.rootInstances[serviceName];
}

export const TrimixinService = (superClass) => class extends superClass {
	static get properties() {
		return {
			_isRootInstance: {
				type: Boolean,
				value: false,
				readOnly: true
			},

			_rootInstance: {
				type: Object,
				readOnly: true
			},

			_propertiesToPropagate: {
				type: Array,
				readOnly: true,
				value: function() {
					return [];
				}
			},

			_serviceReady: {
				type: Boolean,
				value: false,
				readOnly: true
			}
		};
	}

	constructor() {
		super();
		this._computePropertiesToPropagate();
		if (registry.rootInstances[this.serviceName] == null) {
			registry.rootInstances[this.serviceName] = this;
			registry.subscribers[this.serviceName] = [];
			this._set_isRootInstance(true);
		} else {
			this._registerSubscriber();
		}
		this._addObservers();
		this._set_serviceReady(true);
	}

	_registerSubscriber() {
		this._set_rootInstance(registry.rootInstances[this.serviceName]);
		registry.subscribers[this.serviceName].push(this);
		this._syncFromRootInstance();
	}

	_syncFromRootInstance() {
		this._propertiesToPropagate.forEach((property) => {
			this[property.name] = this._rootInstance[property.name];
		}, this);
	}

	get serviceName() {
		return Object.getPrototypeOf(this).constructor.is;
	}

	_returnDataFromResponse(response) {
		return response != null ? response.data : null;
	}

	_returnCountFromResponse(response) {
		return response != null ? response.totalSize : null;
	}

	_computePropertiesToPropagate() {
		const superProperties = Object.getPrototypeOf(this).constructor.properties;
		for (let propName in superProperties) {
			if (superProperties[propName].notify) {
				this._propertiesToPropagate.push({name: propName, def: superProperties[propName]});
			}
		}
	}

	_addObservers() {
		this._propertiesToPropagate.forEach((property) => {
			this[`_propagatePath${property.name}`] = this._propagatePath.bind(this, property.name);
			this._createMethodObserver(`_propagatePath${property.name}(${property.name}.*)`);
		}, this);
	}

	_propagatePath(propName, changeRecord) {
		if (this._isRootInstance) {
			registry.subscribers[this.serviceName].forEach(function (subscriber) {
				subscriber.notifyPath(changeRecord.path, changeRecord.value);
			}, this);
		} else {
			this._rootInstance.notifyPath(changeRecord.path, changeRecord.value);
		}
	}

	_dispatchServiceEvent(event) {
		this.dispatchEvent(event);
		registry.subscribers[this.serviceName].forEach(subscriber => subscriber.dispatchEvent(event));
	}

	_isAnyArgumentTruthy() {
		for (var i = 0; i < arguments.length; ++i) {
			if (arguments[i]) return true;
		}
		return false;
	}

	_handleLoadingChanged() {
		if (this._isRootInstance) {
			this.loading = this._isAnyArgumentTruthy.apply(this, arguments);
			setLoadingValue(this.serviceName, this.loading);
		}
	}
};