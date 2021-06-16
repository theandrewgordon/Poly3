/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { Debouncer } from "../@polymer/polymer/lib/utils/debounce.js";
import { microTask, timeOut } from "../@polymer/polymer/lib/utils/async.js";
import { getModuleUrl } from "../tricore-util/tricore-util.js";
import "./components/contact-roles-table/tricomp-contact-roles-table.js";
import { getTriserviceContactRoles } from "./services/triservice-contact-roles.js";

class TriappContactRoles extends PolymerElement {
	static get is() {
		return "triapp-contact-roles";
	}

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

			</style>

			<triservice-contact-roles
				contact-roles="{{contactRoles}}"
				people-list="{{_peopleList}}"
				parent-record="[[parentRecord]]"
				loading="{{loading}}"
				readonly="[[readonly]]"
				contact-roles-partially-complete="{{contactRolesPartiallyComplete}}"
				linked-business-object-list="{{linkedBusinessObjectList}}"
				>
			</triservice-contact-roles>

			<tricomp-contact-roles-table
				contact-roles="[[contactRoles]]"
				people-list="[[_peopleList]]"
				parent-record="[[parentRecord]]"
				readonly="[[readonly]]"
				contact-roles-count="{{contactRolesCount}}"
				has-invalid="[[hasInvalid]]"
				>
			</tricomp-contact-roles-table>

			<div on-tap="_doRefreshContactRoles" style="cursor: pointer; height: 5px"> </div>
		`
	}

	static get properties() {
		return {

			/*
			 * Set to indicate whether the component is ready to be active
			 */
			active: {
				type: Boolean,
				value: false
			},

			/*
			 * Parent record of the contact roles, this needs to be set to start the component.
			 * To use this in a new page within an UX app, create an object with no _id, but specify the recordForm property and recordBusinessObject in the object, i.e. { recordForm: "Stack Plan", recordBusinessObject: "Stack Plan" }
			 */
			parentRecord: {
				type: Object
			},

			/*
			 * Specify whether the component is read only
			 */
			readonly: {
				type: Boolean
			},

			/*
			 * Loading property to indicate whether the component is loading data
			 */
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			/*
			 * The contact roles 
			 */
			contactRoles: {
				type: Array,
				notify: true
			},

			/*
			 * The contact roles count
			 */
			contactRolesCount: {
				type: Number,
				notify: true
			},

			/*
			 * This property can be specified to set partially complete contact roles data. The component will update this property 
			 */
			contactRolesPartiallyComplete: {
				type: Array,
				notify: true
			},

			/*
			 * The linkedBusinessObjectList data
			 */
			linkedBusinessObjectList: {
				type: Array,
				notify: true
			},

			/*
			 * Set to indicate if there are any partially complete contact roles
			 */
			hasInvalid: {
				type: Boolean
			},
			
			_peopleList: Array
		}
	}

	static get observers() {
		return [
			'_handleActive(parentRecord, active)'
		]
	}

	_handleActive(parentRecord, active) {
		if (parentRecord && active) {
			afterNextRender(this, 
				async () => {
					await getTriserviceContactRoles().refreshAllDataSources(parentRecord);
					if (parentRecord._id) {
						await getTriserviceContactRoles().refreshContactRoles(parentRecord._id);
					} else {
						getTriserviceContactRoles().setReadonly(false);
						getTriserviceContactRoles().initializeContactRoles();
					}
				}
			);
		} else {
			afterNextRender(this, () => {
				getTriserviceContactRoles().clearContactRoles();
			})
		}
	}

	/*
	 * doCreateContactRole: use to manually create contact roles, typically used in a new form context
	 * @param recordId: the record id of the parent
	 * @param recordBusinessObject: the record business object of the parent 
	 * @param recordForm: the record form of the parent 
	 * @param contactRole: contact role to be created
	 * @param skipRefresh: to indicate whether the contact roles should be refreshed after creating, typically skip refreshing when creating contact roles in a batch
	 */
	doCreateContactRole(recordId, recordBusinessObject, recordForm, contactRole, skipRefresh) {
		return getTriserviceContactRoles().doCreateContactRole(recordId, recordBusinessObject, recordForm, contactRole, skipRefresh);
	}

	/*
	 * Secret method to refresh contact roles data without refreshing the application.
	 */
	_doRefreshContactRoles(e) {
		e.stopPropagation();
		getTriserviceContactRoles().refreshContactRoles(this.parentRecord._id);
	}

	static get importMeta() {
		return getModuleUrl("triapp-contact-roles/triapp-contact-roles.js");
	}

}

window.customElements.define(TriappContactRoles.is, TriappContactRoles);
