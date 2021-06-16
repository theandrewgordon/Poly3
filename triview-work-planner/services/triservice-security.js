/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../@polymer/polymer/lib/utils/render-status.js";
import "../../triplat-auth-check/triplat-auth-check.js";
import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceSecurity() {
	return getService(TriserviceSecurity.is);
};
class TriserviceSecurity extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-security"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-auth-check id="authCheck"></triplat-auth-check>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			canAssign: {
				type: Boolean,
				value: false,
				notify: true
			},

			canUnassign: {
				type: Boolean,
				value: false,
				notify: true
			},

			canUpdateAllocatedDate: {
				type: Boolean,
				value: false,
				notify: true
			},

			canUpdateAllocatedHours: {
				type: Boolean,
				value: false,
				notify: true
			},

			canUpdateTaskPriority: {
				type: Boolean,
				value: false,
				notify: true
			},

			canUpdateTaskPlannedDate: {
				type: Boolean,
				value: false,
				notify: true
			},

			_auth: {
				type: Object,
				value: () => {return {};}
			}
		};
	}

	ready() {
		super.ready();
		if (this._isRootInstance) {
			afterNextRender(this, this._refreshSecurity.bind(this));
		}
	}

	get authCheck() {
		return this.shadowRoot.querySelector("#authCheck");
	}

	get modelName() {
		return "triWorkPlanner";
	}

	async _refreshSecurity() {
		this.loading = true;
		try {
			this._auth = await this.authCheck.getModelPermission(this.modelName);
		} catch (error) {
			console.error(error);
		}
		this.loading = false;
		await this._computeUserPermissions();
	}

	async _computeUserPermissions() {
		this.canAssign = await this._computeCanAssign();
		this.canUnassign = await this._computeCanUnassign();
		this.canUpdateAllocatedDate = await this._computeCanUpdateAllocatedDate();
		this.canUpdateAllocatedHours = await this._computeCanUpdateAllocatedHours();
		this.canUpdateTaskPriority = await this._computeCanUpdateTaskPriority();
		this.canUpdateTaskPlannedDate = await this._computeCanUpdateTaskPlannedDate();
	}

	async _computeCanAssign() {
		return this._auth.canCreate && 
			await this.authCheck.getActionPermission(this.modelName, "assignTask", "actions", "taskResourceAllocation");
	}

	async _computeCanUnassign() {
		return await this.authCheck.getActionPermission(this.modelName, "removeAllocation", "actions", "resource");
	}

	async _computeCanUpdateAllocatedDate() {
		return this._auth.canUpdate && 
			await this.authCheck.getActionPermission(this.modelName, "updateAllocatedDate", "actions", "taskResourceAllocation");
	}

	async _computeCanUpdateAllocatedHours() {
		return this._auth.canUpdate && 
			await this.authCheck.getActionPermission(this.modelName, "updateAllocatedHours", "actions", "taskResourceAllocation");
	}

	async _computeCanUpdateTaskPriority() {
		return await this.authCheck.getActionPermission(this.modelName, "changePriority", "actions", "workTask");
	}

	async _computeCanUpdateTaskPlannedDate() {
		return this._auth.canUpdate && 
			await this.authCheck.getActionPermission(this.modelName, "updatePlannedDateAndTime", "actions", "workTask");
	}
};

window.customElements.define(TriserviceSecurity.is, TriserviceSecurity);