/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../@polymer/polymer/lib/legacy/class.js";
import { TriPlatViewBehavior } from "../../triplat-view-behavior/triplat-view-behavior.js";
import { TriPlatDs } from "../../triplat-ds/triplat-ds.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import { shiftRequiredRolesInFront, computeRoleRequired, getUniqueId } from "../utils/triutils-contact-roles-app.js";

export function getTriserviceContactRoles() {
	return getService(TriserviceContactRoles.is);
};
class TriserviceContactRoles extends mixinBehaviors([TriPlatViewBehavior], TrimixinService(PolymerElement)) {
	static get is() { return "triservice-contact-roles"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="rolesListDS" name="rolesList" loading="{{_loadingRolesList}}" manual>
					</triplat-ds>

					<triplat-ds id="linkedBusinessObjectDS" name="linkedBusinessObject" data="{{linkedBusinessObjectList}}" loading="{{_loadingLinkedBusinessObjectList}}" manual>
					</triplat-ds>

					<triplat-ds id="contactRoleSetupDS" name="contactRoleSetup" manual loading="{{_loadingContactRoleSetup}}">
					</triplat-ds>

					<triplat-ds id="peopleListDS" name="peopleList" loading="{{_loadingPeopleList}}" force-server-filtering on-ds-get-complete="handlePeopleListDsGetComplete">
						<triplat-query delay="300">
							<triplat-query-scroll-page scroller="[[peopleListScroller]]" size="20" disable-auto-fetch>
							</triplat-query-scroll-page>
							<triplat-query-filter name="name" operator="contains" value="[[peopleListSearchValue]]" ignore-if-blank></triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="organization" operator="contains" value="[[peopleListSearchValue]]" ignore-if-blank></triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="email" operator="contains" value="[[peopleListSearchValue]]" ignore-if-blank></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-ds id="contactRolesDS" data="{{_contactRoles}}" loading="{{_loadingContactRoles}}" manual>
					</triplat-ds>

					<triplat-ds id="contactRoleDS" name="contactRoles" manual>
						<triplat-ds-instance id="contactRoleDSInstance"></triplat-ds-instance>
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			parentRecord: {
				type: Object,
				notify: true
			},

			contactRoles: {
				type: Array,
				notify: true
			},

			_contactRoles: {
				type: Array
			},

			peopleList: {
				type: Array,
				notify: true
			},

			peopleListSearchValue: {
				type: String,
				notify: true
			},

			peopleListScroller: {
				type: Object,
				notify: true
			},

			rolesList: {
				type: Array,
				notify: true
			},

			linkedBusinessObjectList: {
				type: Array,
				notify: true
			},

			_requiredContactRoleSetups: {
				type: Array
			},

			readonly: {
				type: Boolean,
				value: false,
				notify: true
			},

			contactRolesPartiallyComplete: {
				type: Array,
				notify: true
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingRolesList: {
				type: Boolean,
				value: false
			},

			_loadingLinkedBusinessObjectList: {
				type: Boolean,
				value: false
			},

			_loadingContactRoleSetup: {
				type: Boolean,
				value: false
			},

			_loadingPeopleList: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingRolesList, _loadingLinkedBusinessObjectList, _loadingContactRoleSetup, _loadingPeopleList, _loadingContactRoles)"
		]
	}

	constructor() {
		super();
		this.set("modelAndView", "triAppContactRoles");
		this.set("instanceId", "-1");
	}

	initializeContactRoles() {
		let contactRolesInitial = [];
		const requiredContactRoleSetups = this._requiredContactRoleSetups;

		if (this._contactRoles && this._contactRoles.length > 0) {
			this._contactRoles.forEach(contactRole => {
				let index = requiredContactRoleSetups.map(requiredContactRole => requiredContactRole.role).indexOf(contactRole.role);
				contactRolesInitial.push({
					...contactRole,
					required: index >= 0,
					roleRequirementENUS: index >= 0 ? requiredContactRoleSetups[index].roleRequirementENUS : ''
				});
			});
		}

		// insert partially completed contact roles
		if (this.contactRolesPartiallyComplete && this.contactRolesPartiallyComplete.length > 0) {
			this.contactRolesPartiallyComplete.forEach(crpi => {
				if (crpi.roleRequirementENUS === "Requires Exactly One" && contactRolesInitial.findIndex(cri => cri.role === crpi.role) >= 0) {
					this.removeContactRoleFromContactRolesPartiallyCompleted(crpi);
				} else {
					contactRolesInitial.splice(crpi.pos, 0, crpi);
				}
			})
		}

		// shift required roles to the front of the array
		contactRolesInitial = shiftRequiredRolesInFront(contactRolesInitial);

		// add missing required contact roles to contactRolesInitial
		if (!this.readonly) {
			const reversedRequiredContactRoleSetups = [...requiredContactRoleSetups];
			reversedRequiredContactRoleSetups.reverse();
			reversedRequiredContactRoleSetups.forEach(contactRoleSetup => {
				const hasRequiredContactRole = contactRolesInitial.some(contactRole => contactRole.role === contactRoleSetup.role);
				if (!hasRequiredContactRole) {
					const contactRoleToInsert = { 
						...contactRoleSetup,
						name: '',
						computedContact: '',
						organization: null,
						fax: null,
						email: null,
						workPhone: null ,
						_partialId: getUniqueId()
					};
					contactRolesInitial.unshift(contactRoleToInsert);
				}
			})
		}

		this.set("contactRoles", contactRolesInitial);
		return { data: contactRolesInitial };
	}

	removeRequiredRoleFromList(linkedBusinessObject, linkedForm) {
		if (this._isRootInstance) {
			if(linkedBusinessObject) {
				let final = [];
				if(this.rolesList && this.rolesList.length) {
					this.rolesList.map(role => {
						if (linkedForm) {
							if(!((role.linkedBusinessObject == linkedBusinessObject && role.linkedForm === linkedForm) && (role.roleRequirement == "Requires Exactly One"))) {
								final.push(role);
							}
						} else {
							if(!((role.linkedBusinessObject == linkedBusinessObject) && (role.roleRequirement == "Requires Exactly One"))) {
								final.push(role);
							}
						}
					});
					this.set('rolesList', final);
				}
			}
		} else {
			return this._rootInstance.removeRequiredRoleFromList(linkedBusinessObject);
		}
	}

	refreshRolesListDS() {
		if (this._isRootInstance) {
			if (!this.rolesList) {
				return this.shadowRoot.querySelector("#rolesListDS").refresh()
					.then(response => {
						const rolesList = this._processRoles(response.data, "name");
						this.set('rolesList', rolesList);
						return { data: rolesList };
					})
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.rolesList);
			}
		} else {
			return this._rootInstance.refreshRolesListDS();
		}
	}

	clearContactRoles() {
		if(this._isRootInstance) {
			this.set("_contactRoles", []);
			this.set("contactRoles", []);
			this.set("contactRolesPartiallyComplete", []);
		} else {
			return this._rootInstance.clearContactRoles();
		}
	}

	async refreshAllDataSources(parentRecord) {
		if(this._isRootInstance) {
			await this.refreshRequiredContactRoleSetupDS(parentRecord);
			await this.refreshRolesListDS();
			await this.refreshLinkedBusinessObjectDS();
		} else {
			return this._rootInstance.refreshAllDataSources(parentRecord);
		}
	}

	refreshLinkedBusinessObjectDS() {
		if (this._isRootInstance) {
			if ( !this.linkedBusinessObjectList ) {
				return this.shadowRoot.querySelector("#linkedBusinessObjectDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.linkedBusinessObjectList);
			}
		} else {
			return this._rootInstance.refreshLinkedBusinessObjectDS();
		}
	}

	refreshRequiredContactRoleSetupDS(parentRecord) {
		if (this._isRootInstance) {
			if (!this._requiredContactRoleSetups) {
				return this.shadowRoot.querySelector("#contactRoleSetupDS").refresh()
					.then(response => {
						const contactRoleSetup = response.data;
						let requiredContactRoleSetups = [];

						if (contactRoleSetup && contactRoleSetup.length > 0) {
							requiredContactRoleSetups = contactRoleSetup.filter(
								roleSetup => {
									roleSetup.roleObject = {
										linkedBusinessObjectENUS: roleSetup.linkedBusinessObjectENUS,
										linkedForm: roleSetup.linkedForm,
										name: roleSetup.role,
										roleRequirementENUS: roleSetup.roleRequirementENUS,
										_id: roleSetup.roleRecordId
									};
									roleSetup.required = true;
									delete roleSetup._id;
									return computeRoleRequired(roleSetup.roleRequirementENUS, roleSetup.linkedBusinessObjectENUS, roleSetup.linkedForm, parentRecord.recordBusinessObject, parentRecord.recordForm);
								}
							);
						}
						this.set('_requiredContactRoleSetups', requiredContactRoleSetups);
						return { data: requiredContactRoleSetups };
					})
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this._requiredContactRoleSetups);
			}
		} else {
			return this._rootInstance.refreshRequiredContactRoleSetupDS(parentRecord);
		}
	}

	_processRoles(roles, prop) {
		const rolesMap = new Map();

		if(roles.length > 0 && prop != "") {
			for (let item of roles) {
				let key = item[prop];
				let isMatch = item.linkedForm
					? this.parentRecord.recordBusinessObject === item.linkedBusinessObject && this.parentRecord.recordForm === item.linkedForm
					: this.parentRecord.recordBusinessObject === item.linkedBusinessObject;
				if (rolesMap.has(key)) {
					if (isMatch) {
						let roleObj = rolesMap.get(key);
						if (!roleObj.linkedForm) {
							roleObj.linkedBusinessObject = item.linkedBusinessObject;
							roleObj.linkedForm = item.linkedForm;
							roleObj.roleRequirement = item.roleRequirement;
						}
					}
				} else {
					let newRoleObj = { 
						name: item.name,
						linkedBusinessObject: isMatch ? item.linkedBusinessObject : "",
						linkedForm: isMatch ? item.linkedForm : "",
						roleRequirement: isMatch ? item.roleRequirement : "",
						_id: item._id
					};
					rolesMap.set(key, newRoleObj);
				}
			}
		}
		return [...rolesMap.values()];
	}

	doCreateContactRole(recordId, recordBusinessObject, recordForm, contactRole, skipRefresh) {
		if (this._isRootInstance) {
			let personId = contactRole.personObject ? contactRole.personObject._id : null;
			let roleId = contactRole.roleObject ? contactRole.roleObject._id : "";
			let contactRoleLinkedBO = this.linkedBusinessObjectList.filter(bo => bo.value == recordBusinessObject);
			let contactRoleObj = {
				linkedRecord: { id: recordId },
				linkedForm: recordForm,
				linkedBusinessObject: {id: contactRoleLinkedBO[0]._id, value: recordBusinessObject}
			};
			this.removeContactRoleFromContactRolesPartiallyCompleted(contactRole);
			return this.createContactRole(recordId, contactRoleObj, personId, roleId, skipRefresh);
		} else {
			return this._rootInstance.doCreateContactRole(recordId, recordBusinessObject, recordForm, contactRole, skipRefresh);
		}
	}

	doUpdateContactRole(recordId, contactRole) {
		if (this._isRootInstance) {
			let personId = contactRole.personObject ? contactRole.personObject._id : null;
			let roleId = contactRole.roleObject ? contactRole.roleObject._id : "";
			const contactRoles = this._contactRoles;
			if(contactRoles) {
				let newIndex = contactRoles.map(c => c._id).indexOf(contactRole._id);
				if (newIndex != -1) {
					let oldContactRole = contactRoles[newIndex];
					if(contactRole.role && contactRole.name && 
						(contactRole.role != oldContactRole.role || contactRole.name != oldContactRole.name)) {
						roleId = this._getRoleId(contactRole);
						this.updateContactRole(recordId, contactRole._id, personId, roleId);
					}
				}
			}
		} else {
			return this._rootInstance.doUpdateContactRole(recordId, contactRole);
		}
	}
	
	refreshContactRoles(recordId) {
		if (this._isRootInstance) {
			if (recordId) {
				this._setInstanceId(recordId);
				return this.shadowRoot.querySelector("#contactRolesDS").refresh()
					.then(this.initializeContactRoles.bind(this))
					.then(this._returnDataFromResponse.bind(this));
			}
		} else {
			return this._rootInstance.refreshContactRoles(recordId);
		}
	}

	async createContactRole(recordId, contactRole, personId, roleId, skipRefresh) {
		if (this._isRootInstance) {
			this._setInstanceId(recordId);
			const createdRecordId = await this.shadowRoot.querySelector('#contactRolesDS').createRecord(contactRole, TriPlatDs.RefreshType.NONE, "actions", "create");
			const wfParams = {
				person: personId,
				role: roleId
			}
			this.shadowRoot.querySelector("#contactRoleDSInstance").instanceId = createdRecordId;
			this.shadowRoot.querySelector('#contactRoleDS').data = {_id: createdRecordId};
			await this.shadowRoot.querySelector('#contactRoleDS').performAction(createdRecordId, TriPlatDs.RefreshType.NONE, "actions", "setPersonRole", wfParams);
			if (!skipRefresh) {
				await this.refreshContactRoles(recordId);
			}
		} else {
			return this._rootInstance.createContactRole(recordId, contactRole, personId, roleId, skipRefresh);
		}
	}

	async updateContactRole(recordId, contactRoleRecordId, personId, roleId) {
		this._setInstanceId(recordId);
		await this.shadowRoot.querySelector('#contactRolesDS').updateRecord(contactRoleRecordId, TriPlatDs.RefreshType.NONE, "actions", "save");
		const wfParams = {
			person: personId,
			role: roleId
		}
		this.shadowRoot.querySelector("#contactRoleDSInstance").instanceId = contactRoleRecordId;
		this.shadowRoot.querySelector('#contactRoleDS').data = {_id: contactRoleRecordId};
		await this.shadowRoot.querySelector('#contactRoleDS').performAction(contactRoleRecordId, TriPlatDs.RefreshType.NONE, "actions", "setPersonRole", wfParams);
		this.refreshContactRoles(recordId);
	}

	deleteContactRole(recordId, contactRoleRecordId) {
		if (this._isRootInstance) {
			this._setInstanceId(recordId);
			return this.shadowRoot.querySelector('#contactRolesDS').deleteRecord(contactRoleRecordId, TriPlatDs.RefreshType.NONE)
				.then(this.refreshContactRoles.bind(this, recordId));
		} else {
			return this._rootInstance.deleteContactRole(recordId, contactRoleRecordId);
		}
	}

	_setInstanceId(recordId) {
		if (this._isRootInstance) {
			if (recordId) {
				this.set("modelAndView", "triAppContactRoles");
				this.set("instanceId", recordId);
				this.shadowRoot.querySelector('#contactRolesDS').name = null;
				this.shadowRoot.querySelector('#contactRolesDS').name = "contactRoles";
			}
		} else {
			return this._rootInstance._setInstanceId(recordId);
		}
	}

	addContactRole() {
		if (this._isRootInstance) {
			if (!this.contactRoles) this.contactRoles = [];
			let contactRole = {
				role: "",
				name: "",
				required: false,
				_partialId: getUniqueId()
			};
			this.push("contactRoles", contactRole);
		} else {
			return this._rootInstance.addContactRole();
		}
	}

	removeContactRole(index) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector('#contactRolesDS').data = [...this.contactRoles];
			this.splice("contactRoles", index, 1);
		} else {
			return this._rootInstance.removeContactRole(index);
		}
	}

	_getRoleId(contactRole) {
		let roleId;
		if (contactRole.required) {
			roleId = this._requiredContactRoleSetups.filter(r => r.role == contactRole.role)[0].roleRecordId;
		} else {
			roleId = this.rolesList.filter(r => r.name == contactRole.role)[0]._id;
		}
		return roleId;
	}

	setReadonly(readonly) {
		if (this._isRootInstance) {
			this.set("readonly", readonly);
		} else {
			return this._rootInstance.setReadonly(readonly);
		}
	}

	removeContactRoleFromContactRolesPartiallyCompleted(contactRole) {
		if(this.contactRolesPartiallyComplete && this.contactRolesPartiallyComplete.length > 0) {
			const indexFound = this.contactRolesPartiallyComplete.findIndex(externalContactRole => externalContactRole._partialId === contactRole._partialId);
			if (indexFound !== -1) {
				this.splice('contactRolesPartiallyComplete', indexFound, 1);
			}
		}
	}

	addContactRoleFromContactRolesPartiallyCompleted(contactRole) {
		if (this.contactRoles && this.contactRoles.length > 0) {
			const posInContactRoles = this.contactRoles.findIndex(cr => cr === contactRole);
			contactRole.pos = posInContactRoles;
		}
		
		if (!this.contactRolesPartiallyComplete) {
			this.set('contactRolesPartiallyComplete', []);
		}

		const indexFound = this.contactRolesPartiallyComplete.findIndex(externalContactRole => externalContactRole._partialId === contactRole._partialId);
		if (indexFound === -1) {
			this.push('contactRolesPartiallyComplete', contactRole);
		}
	}

	handlePeopleListDsGetComplete(e) {
		if (this._isRootInstance) {
			const newData = e.detail.data;
			const peopleListDS = this.shadowRoot.querySelector("#peopleListDS");
			if (peopleListDS && newData) {
				if (e.detail.from === 0) {
					this.set('peopleList', [...newData]);
				} else {
					this.set('peopleList', [...this.peopleList, ...newData]);
				}
			}
		} else {
			return this._rootInstance.handlePeopleListDsGetComplete(e);
		}
	}

	_endContext(event) {}
};

window.customElements.define(TriserviceContactRoles.is, TriserviceContactRoles);