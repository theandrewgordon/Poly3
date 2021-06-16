/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../triplat-ds/triplat-ds.js";
import { getTriserviceWorkPlanner } from "./triservice-work-planner.js";
import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceWorkgroup() {
	return getService(TriserviceWorkgroup.is);
};

class TriserviceWorkgroup extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-workgroup"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="mySupervisedWorkgroups" name="mySupervisedWorkgroups" 
						data="{{mySupervisedWorkgroups}}" loading="{{_loadingMySupervisedWorkgroups}}">
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			mySupervisedWorkgroups: {
				type: Array,
				notify: true
			},

			selectedWorkgroup: {
				type: Object,
				notify: true
			},

			isSingleWorkgroup: {
				type: Boolean,
				value: false,
				notify: true
			},

			noWorkgroup: {
				type: Boolean,
				value: false,
				notify: true
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingMySupervisedWorkgroups: {
				type: Boolean,
				value: false
			},
		};
	}

	static get observers() {
		return [
			"_handleMySupervisedWorkgroupsChanged(mySupervisedWorkgroups)",
			"_handleSelectedWorkgroupChanged(selectedWorkgroup)",
			"_handleLoadingChanged(_loadingMySupervisedWorkgroups)"
		]
	}

	_handleMySupervisedWorkgroupsChanged(mySupervisedWorkgroups) {
		if (this._isRootInstance) {
			this.noWorkgroup = !mySupervisedWorkgroups || mySupervisedWorkgroups.length == 0;
			this.isSingleWorkgroup = !mySupervisedWorkgroups || mySupervisedWorkgroups.length == 1;
			if (!mySupervisedWorkgroups) {
				this.selectedWorkgroup = null;
				return;
			}
			let selectedWorkgroup = null;
			if (!this.isSingleWorkgroup && typeof(Storage) !== "undefined" && localStorage.selectedWorkgroupId) {
				const workgroupId = localStorage.selectedWorkgroupId;
				selectedWorkgroup = mySupervisedWorkgroups.find(workgroup => workgroup._id == workgroupId);
			}
			if (!selectedWorkgroup) {
				selectedWorkgroup = mySupervisedWorkgroups[0];
			}
			this.selectedWorkgroup = selectedWorkgroup;
		}
	}

	_handleSelectedWorkgroupChanged(selectedWorkgroup) {
		if (this._isRootInstance) {
			localStorage.selectedWorkgroupId = selectedWorkgroup && selectedWorkgroup._id ? selectedWorkgroup._id : null;
			getTriserviceWorkPlanner().clearUndoList();
		}
	}
};

window.customElements.define(TriserviceWorkgroup.is, TriserviceWorkgroup);