/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement } from "../../@polymer/polymer/polymer-element.js";
import { TrimixinService, addLoadingListener, computeGeneralLoading } from "./trimixin-service.js";

class TriserviceLoading extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-loading"; }

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			}
		};
	}

	constructor() {
		super();
		if (this._isRootInstance) {
			addLoadingListener(this._handleGeneralLoadingChanges.bind(this));
		}
	}

	ready() {
		super.ready();
		if (this._isRootInstance) {
			this.loading = computeGeneralLoading();
		}
	}

	_handleGeneralLoadingChanges(generalLoading) {
		this.loading = generalLoading;
	}
};

window.customElements.define(TriserviceLoading.is, TriserviceLoading);