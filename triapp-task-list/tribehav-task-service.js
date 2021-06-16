/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
var registry = {
	rootInstances: [],
	subscribers: []
};

export const TriTaskServiceBehavior = {
	properties: {
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
	},

	listeners: {
		"ds-add-error": "_firePopupAlert",
		"ds-create-error": "_firePopupAlert",
		"ds-delete-error": "_firePopupAlert",
		"ds-get-error": "_firePopupAlert",
		"ds-perform-action-error": "_firePopupAlert",
		"ds-remove-error": "_firePopupAlert",
		"ds-update-error": "_firePopupAlert"
	},

	ready: function () {
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
	},

	_registerSubscriber: function () {
		this._set_rootInstance(registry.rootInstances[this.serviceName]);
		registry.subscribers[this.serviceName].push(this);
		this._syncFromRootInstance();
	},

	_syncFromRootInstance: function () {
		this._propertiesToPropagate.forEach(function (property) {
			this[property.name] = this._rootInstance[property.name];
		}, this);
	},

	get serviceName() {
		return this.is;
	},

	_returnDataFromResponse: function(response) {
		return response != null ? response.data : null;
	},

	_returnCountFromResponse: function(response) {
		return response != null ? response.totalSize : null;
	},

	_computePropertiesToPropagate: function() {
		for (var propName in this.properties) {
			if (this.properties[propName].notify) {
				this._propertiesToPropagate.push({name: propName, def: this.properties[propName]});
			}
		}
	},

	_addObservers: function () {
		this._propertiesToPropagate.forEach(function (property) {
			this[`_propagate${property.name}`] = this._propagate.bind(this, property.name);
			this._createMethodObserver(`_propagate${property.name}(${property.name})`);
			if (property.def.type == Array) {
				this[`_propagateArrayMutation${property.name}`] = this._propagateArrayMutation.bind(this, property.name);
				this._createMethodObserver(`_propagateArrayMutation${property.name}(${property.name}.splices)`);
			}
		}, this);
	},

	_propagate: function (propName) {
		if (this._isRootInstance) {
			registry.subscribers[this.serviceName].forEach(function (subscriber) {
				subscriber[propName] = this[propName];
			}, this);
		} else {
			this._rootInstance.set(propName, this[propName]);
		}
	},

	_propagateArrayMutation: function (propName, indexSplices) {
		if (this._isRootInstance && indexSplices) {
			registry.subscribers[this.serviceName].forEach(function (subscriber) {
				subscriber.notifySplices(propName, indexSplices);
			}, this);
		}
	},

	_toArray: function() {
		var args = new Array(arguments.length);
		for (var i = 0; i < args.length; ++i) {
			args[i] = arguments[i];
		}
		return args;
	},

	_buildOfflineContextMessage: function() {
		var result = this._offlineContext[arguments[0]];
		for (var i = 1; result && i < arguments.length; i++) {
			result = result.replace("{" + i + "}", arguments[i]);
		}
		return result;
	},

	_fireToastAlert: function(type, title, text) {
		this.fire("work-task-alert", { type: type, title: title, text: text });
	},

	_firePopupAlert: function(error) {
		if (error.detail && error.detail.errorType == "SecurityException") {
			return;
		}
		if (error.detail && error.detail.status == 401) {
			var __dictionary__unauthorized = "Session timeout or unauthorized access.";
			var __dictionary__title = "Unauthorized";
			this.fire(
				"work-task-alert", 
				{ type: "error", title: __dictionary__title, text: __dictionary__unauthorized }
			);
			this.async(
				function() {
					location.reload();
				},
				5000
			);
			return;
		}

		if (error.detail && error.detail.status == 470) {
			var __dictionary__unauthorized = "Insufficient storage available.";
			var __dictionary__title = "Action failed";
			this.fire(
				"work-task-alert", 
				{ type: "error", title: __dictionary__title, text: __dictionary__unauthorized }
			);
			return;
		}
		console.error(error.detail);
		this.fire("work-task-popup-alert");
	},

	_endContext: function (e) {}
};