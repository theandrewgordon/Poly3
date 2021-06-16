/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../@polymer/polymer/lib/utils/render-status.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../tricore-util/tricore-util.js";
import "../../triplat-auth-check/triplat-auth-check.js";
import "../../triplat-loading-indicator/triplat-loading-indicator.js";
import "../../triapp-contact-roles/triapp-contact-roles.js";
import "../services/triservice-loading.js";
import "../services/triservice-parent.js";
import { computeStatusReadonly } from "../triutils-contact-roles.js";

class TrimainContactRoles extends PolymerElement {
	static get is() { return "trimain-contact-roles"; }
	
	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
				}
				
				.loading-indicator {
					--triplat-loading-indicator-clear-background: transparent;
					z-index: 200;
				}
			</style>

			<triplat-auth-check app-name="contactRoles" auth="{{_contactRolesAuth}}"></triplat-auth-check>

			<triservice-loading loading="{{_loading}}" loading-contact-roles-app="[[_loadingContactRolesApp]]"></triservice-loading>

			<triservice-parent
				id="parentService"
				parent-record={{_parentRecord}}
				record-id="[[recordId]]"
				>
			</triservice-parent>

			<triapp-contact-roles 
				id="triappContactRoles"
				parent-record="[[_parentRecord]]"
				readonly="[[_readonly]]"
				loading="{{_loadingContactRolesApp}}"
				active
				>
			</triapp-contact-roles>

			<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>
		`;
	}

	static get properties() {
		return {
			_authReadonly: {
				type: Boolean,
				value: false,
				computed: "_isAuthReadonly(_contactRolesAuth)"
			},

			_contacts: {
				type: Array,
			},

			_parentRecord: {
				type: Object
			},

			recordId: {
				type: String
			},

			_contactRoles: {
				type: Array
			},

			linkedBusinessObjectList: Array,
			_peopleList: Array,

			_readonly: {
				type: Boolean,
				computed: '_computeReadonly(_authReadonly, _parentRecord.statusENUS)'
			},

			_loading: {
				type: Boolean
			},

			_loadingContactRolesApp: {
				type: Boolean
			}
		};
	}

	constructor() {
		super();
		this._onDSErrorListener = this._handeDSErrors.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("ds-add-error", this._onDSErrorListener);
		this.addEventListener("ds-create-error", this._onDSErrorListener);
		this.addEventListener("ds-delete-error", this._onDSErrorListener);
		this.addEventListener("ds-get-error", this._onDSErrorListener);
		this.addEventListener("ds-perform-action-error", this._onDSErrorListener);
		this.addEventListener("ds-remove-error", this._onDSErrorListener);
		this.addEventListener("ds-update-error", this._onDSErrorListener);
		afterNextRender(this, async () => {
			await this.shadowRoot.querySelector("#parentService").refreshParent(this.recordId);
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("ds-add-error", this._onDSErrorListener);
		this.removeEventListener("ds-create-error", this._onDSErrorListener);
		this.removeEventListener("ds-delete-error", this._onDSErrorListener);
		this.removeEventListener("ds-get-error", this._onDSErrorListener);
		this.removeEventListener("ds-perform-action-error", this._onDSErrorListener);
		this.removeEventListener("ds-remove-error", this._onDSErrorListener);
		this.removeEventListener("ds-update-error", this._onDSErrorListener);
	}

	_handeDSErrors(error) {
		if (error.detail && error.detail.errorType == "SecurityException") {
			return;
		}
		if (error.detail && error.detail.status == 401) {
			var __dictionary__unauthorized = "Session timeout or unauthorized access.";
			var __dictionary__title = "Unauthorized";
			this._openToastAlert({
				detail: {
					type: "error", title: __dictionary__title, text: __dictionary__unauthorized
				}
			});
			this.async(
				function() {
					location.reload();
				},
				5000
			);
			return;
		}
		console.error(error.detail);
		this.$.popupAlert.openPopup();
	}

	_isAuthReadonly(auth) {
		return auth.canRead && !auth.canCreate && !auth.canDelete && !auth.canUpdate;
	}

	_computeReadonly(authReadonly, statusENUS) {
		const readonly = computeStatusReadonly(authReadonly, statusENUS);
		if (this.shadowRoot) {
			const contactRoleService = this.shadowRoot.querySelector("#contactRoleService");
			if (contactRoleService) {
				contactRoleService.setReadonly(readonly);
			}
		}
		return readonly;
	}

	static get importMeta() {
		return getModuleUrl("triview-contact-roles/app/trimain-contact-roles.js");
	}
}

window.customElements.define(TrimainContactRoles.is, TrimainContactRoles);