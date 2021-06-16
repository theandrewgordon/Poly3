/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../@polymer/polymer/lib/utils/async.js";
import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { computePercentageValue } from "../utils/triutils-stacking.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import { getTriServiceStackPlan } from "./triservice-stack-plan.js";

export function getTriserviceAdHocDemand() {
	return getService(TriserviceAdHocDemand.is);
};

class TriserviceAdHocDemand extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-ad-hoc-demand"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			building: {
				type: Object,
				notify: true
			},

			floorsForSearch: {
				type: Array,
				notify: true
			},

			newDemands: {
				type: Array,
				notify: true
			},

			historyDemands: {
				type: Array,
				notify: true
			},

			_allDemands: {
				type: Object
			}
		};
	}

	static get observers() {
		return [
			"_observeNewDemands(newDemands.*)"
		];
	}

	getDemands() {
		if (this._isRootInstance) {
			let stackPlanBlobs = getTriServiceStackPlan().stackPlanBlobs;
			let stackPlan = getTriServiceStackPlan().stackPlan;
			let stackPlanId = (!stackPlanBlobs || !stackPlanBlobs._id || stackPlanBlobs._id == "" || stackPlanBlobs._id != stackPlan._id) ? stackPlan._id : stackPlanBlobs._id;

			return getTriServiceStackPlan().refreshStackPlanBo(stackPlanId).then((stackPlan) => {
				this._allDemands = null;
				this.newDemands = null;
				this.historyDemands = null;

				if (stackPlan && stackPlan._id && stackPlan.stackAdHocDemandJSON && stackPlan.stackAdHocDemandJSON != "") {
					this._allDemands = JSON.parse(stackPlan.stackAdHocDemandJSON);

					let newDemands = this.get(`_allDemands.${this.building._id}.newDemands`);
					this.newDemands = (newDemands) ? newDemands : [];
					let historyDemands = this.get(`_allDemands.${this.building._id}.historyDemands`);
					this.historyDemands = (historyDemands) ? historyDemands : [];
				} else {
					this._allDemands = {};
					this.newDemands = [];
					this.historyDemands = [];
				}
			});
		} else {
			return this._rootInstance.getDemands();
		}
	}

	_observeNewDemands(demandsBase) {
		if (this._isRootInstance) {
			this._debounceAddDemand = Debouncer.debounce(
				this._debounceAddDemand,
				microTask,
				async () => {
					let demands = demandsBase.base;
					if (!demands || demands.length == 0) this.addDemand();
				}
			);
		}
	}

	addDemand() {
		if (this._isRootInstance) {
			if (!this.newDemands || this.newDemands === null || this.newDemands === undefined) this.newDemands = [];
			let demand = {
				organization: "",
				initialFloor: "",
				spaceClass: "",
				quantity: 1,
				totalArea: 1,
				notes: "",
				organizationObj: {},
				floorObj: {},
				spaceClassObj: {},
				restorable: true
			};
			this.push("newDemands", demand);
		} else {
			return this._rootInstance.addDemand();
		}
	}

	deleteDemand(index) {
		if (this._isRootInstance) {
			this.splice("newDemands", index, 1);
		} else {
			return this._rootInstance.deleteDemand(index);
		}
	}

	saveDemands(noToast) {
		if (this._isRootInstance) {
			let stackPlanBlobs = getTriServiceStackPlan().stackPlanBlobs;
			this._allDemands[this.building._id] = {
				newDemands: this.newDemands,
				historyDemands: this.historyDemands
			};
			return getTriServiceStackPlan().updateStackPlanBoAdHocDemands(stackPlanBlobs._id, this._allDemands, noToast);
		} else {
			return this._rootInstance.saveDemands(noToast);
		}
	}

	clearAllDemands() {
		if (this._isRootInstance) {
			this._allDemands = null;
			this.newDemands = null;
		} else {
			return this._rootInstance.clearAllDemands();
		}
	}

	addDemandToStack() {
		if (this._isRootInstance) {
			var addDemandPromises = [];
			this.newDemands.forEach((demand) => {
				let assignable = demand.spaceClassObj.assignable;
				let areaPercentage = computePercentageValue(demand.totalArea, demand.floorObj.area);
				let stack = {
					org: demand.organizationObj.name,
					orgPath: { id: +demand.organizationObj._id, value: demand.organizationObj.orgPath},
					orgId: demand.organizationObj.id,
					areaAllocated: demand.totalArea,
					assignableSpacesAreaAllocated: (assignable) ? demand.totalArea : 0,
					percentage: areaPercentage,
					assignableSpacesPercentage: (assignable) ? areaPercentage : "0%",
					spaces: {},
					assignableSpaces: {},
					floor: { name: demand.floorObj.name, id: demand.floorObj._id, area: demand.floorObj.area },
					building: { name: demand.floorObj.building.value, id: demand.floorObj.building.id.toString() },
					uom: this.building.areaUnits
				};

				let space = {
					count: demand.quantity,
					area: demand.totalArea,
					uom: this.building.areaUnits,
					assignable: assignable,
					spaceClassId: demand.spaceClassObj._id,
					spaceClass: demand.spaceClassObj.name,
					spaceClassIdField: demand.spaceClassObj.id,
					building: { id: demand.floorObj.building.id, value: demand.floorObj.building.value }
				}
				stack.spaces[demand.spaceClassObj.name] = space;

				if (demand.spaceClassObj.assignable) {
					let assignableSpace = Object.assign({}, space);
					stack.assignableSpaces[demand.spaceClassObj.name] = assignableSpace;
				}

				addDemandPromises.push(getTriServiceStackPlan().addDemandStackToFloor(demand.floorObj, stack, demand.organizationObj));
			}, this);

			return Promise.all(addDemandPromises).then((results) => {
				getTriServiceStackPlan().saveCurrentStackPlanDataLocal();
				this._addNewDemandsToHistory();
			}, this);
		} else {
			return this._rootInstance.addDemandToStack();
		}
	}

	_addNewDemandsToHistory() {
		if (this._isRootInstance) {
			this.newDemands.forEach((demand) => {
				this.push("historyDemands", demand);
			}, this);
			this.splice("newDemands", 0, this.newDemands.length);

			this.saveDemands(true)
				.then(() => {
					var __dictionary__addDemandsToStack = "Demand added to stack.";
					this.dispatchEvent(new CustomEvent('toast-alert', { detail: {
						type: "success",
						text: __dictionary__addDemandsToStack
					}, bubbles: true, composed: true}));
				})
				.catch(() => {
				});
		}
	}

	_saveAllDemands(noToast) {
		if (this._isRootInstance) {
			let stackPlanBlobs = getTriServiceStackPlan().stackPlanBlobs;
			return getTriServiceStackPlan().updateStackPlanBoAdHocDemands(stackPlanBlobs._id, this._allDemands, noToast);
		}
	}

	deleteHistoryRestorableDemands() {
		if (this._isRootInstance) {
			this.getDemands().then(() => {
				let allDemands = this._allDemands;

				for (let buildinId in allDemands) {
					if (allDemands.hasOwnProperty(buildinId)) {
						let historyDemands = allDemands[buildinId].historyDemands;
						if (historyDemands && historyDemands.length > 0) {
							for (let i = historyDemands.length - 1; i >= 0; i--) {
								if (historyDemands[i].restorable) {
									historyDemands.splice(i, 1);
								}
							}
							this.set(`_allDemands.${buildinId}.historyDemands`, historyDemands);
						}
					}
				}

				this._saveAllDemands(true);
			}), this;
		} else {
			return this._rootInstance.deleteHistoryRestorableDemands();
		}
	}

	async setPermanentHistoryRestorableDemands() {
		if (this._isRootInstance) {
			await this.getDemands();

			let hasDemands = Object.keys(this._allDemands).length;
			if (hasDemands <= 0) return Promise.resolve();

			let allDemands = this._allDemands;
			for (let buildinId in allDemands) {
				if (allDemands.hasOwnProperty(buildinId)) {
					let historyDemands = allDemands[buildinId].historyDemands;
					if (historyDemands && historyDemands.length > 0) {
						let hasRestorable = historyDemands.findIndex((item) => { return (item.restorable) });
						if (hasRestorable > 0) {
							for (let i = 0; i < historyDemands.length; i++) {
								if (historyDemands[i].restorable) {
									historyDemands[i].restorable = false
								}
							}
						}

						this.set(`_allDemands.${buildinId}.historyDemands`, historyDemands);
					} else {
						return Promise.resolve();
					}
				} else {
					return Promise.resolve();
				}
			}

			return this._saveAllDemands(true);
		} else {
			return this._rootInstance.setPermanentHistoryRestorableDemands();
		}
	}
};

window.customElements.define(TriserviceAdHocDemand.is, TriserviceAdHocDemand);