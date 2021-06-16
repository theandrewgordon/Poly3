/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { assertParametersAreDefined } from "../../tricore-util/tricore-util.js";

import { TriPlatDs } from "../../triplat-ds/triplat-ds.js";
import "../../triplat-query/triplat-query.js";

import { isEquivalent, compareOrgs, calcDiscrepancy, round, groupBy, computePercentageValue, findBuildingFloorIndexes, calcAreaAndPercentage, sumSpacesArea } from "../utils/triutils-stacking.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import "./triservice-ad-hoc-demand.js";
import "./triservice-loading.js";

export function getTriServiceStackPlan() {
	return getService(TriServiceStackPlan.is);
};

class TriServiceStackPlan extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-stack-plan"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triservice-loading></triservice-loading>

					<triservice-ad-hoc-demand id="adHocDemandService"></triservice-ad-hoc-demand>

					<triplat-ds id="stackPlanDs" name="stackPlanBO" data="{{stackPlan}}" loading="{{_loadingStackPlan}}"
						transition-info="{{_stackPlanTransitionInfo}}" manual>
						<triplat-ds-instance id="stackPlanDsInstance"></triplat-ds-instance>
					</triplat-ds>

					<triplat-ds id="stackPlansDsForActions" name="stackPlans" loading="{{_loadingStackPlansActions}}" manual></triplat-ds>

					<triplat-ds id="buildingStackSupplyDs" name="buildingStackSupply" data="{{buildingStackSupply}}" loading="{{_loadingBuildingStackSupply}}" manual>
						<triplat-ds-context id="buildingStackSupplyDsContext" name="stackPlans"></triplat-ds-context>
					</triplat-ds>

					<triplat-ds id="floorStackSupplyDs" name="floorStackSupply" data="{{floorStackSupply}}" loading="{{_loadingFloorStackSupply}}" manual>
						<triplat-ds-context id="floorStackSupplyDsContext" name="stackPlans"></triplat-ds-context>
					</triplat-ds>

					<triplat-ds id="spaceStackSupplyDs" name="spaceStackSupply" data="{{spaceStackSupply}}" loading="{{_loadingSpaceStackSupply}}" manual>
						<triplat-ds-context id="spaceStackSupplyDsContext" name="stackPlans"></triplat-ds-context>
					</triplat-ds>

					<triplat-ds id="planningMoveItemsDs" name="planningMoveItems" data="{{planningMoveItems}}" loading="{{_loadingPlanningMoveItems}}" manual>
						<triplat-ds-context id="planningMoveItemsDsContext" name="stackPlans"></triplat-ds-context>
					</triplat-ds>

					<triplat-ds id="stackPlanBODs" name="stackPlanBO" data="{{stackPlanBlobs}}" loading="{{_loadingStackPlanBlobs}}" manual>
						<triplat-ds-instance id="stackPlanBODsInstance"></triplat-ds-instance>
					</triplat-ds>

					<triplat-ds id="organizationListDs" name="organizationList" manual></triplat-ds>

					<triplat-ds id="spaceClassListDs" name="spaceClassList" manual></triplat-ds>

					<triplat-ds id="allSpaceStackSupplyDs" name="allSpaceStackSupply" data="{{allSpaceStackSupply}}" 
						loading="{{_loadingAllSpaceStackSupply}}" force-server-filtering manual>
						<triplat-query delay="0">
							<triplat-query-filter name="floorId" operator="in" value="[[_floorIdsList]]"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	_setFloorIdsListToFilterSpaces(floors) {
		return new Promise((resolve) => {
			this.set("_floorIdsList", floors);
			setTimeout(resolve, 100);
		});
	}

	async getSpaceStackSupplyForNewFloors(stackPlanId, newFloors) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#floorStackSupplyDsContext").contextId = stackPlanId;
			return this.shadowRoot.querySelector("#floorStackSupplyDs").refresh().then(async function(response) {
				var floors = [];
				floors = response.data.map(floor => floor._id);
				this.set("_isBuildingTabModified", (newFloors && newFloors.length > 0));
				await this._setFloorIdsListToFilterSpaces(floors);
				return this.shadowRoot.querySelector("#allSpaceStackSupplyDs").refresh();
			}.bind(this));
		} else {
			return this._rootInstance.getSpaceStackSupplyForNewFloors(stackPlanId, newFloors);
		}
	}

	static get properties() {
		return {
			_floorIdsList: {
				type: Array,
				value: function() {
					return [];
				}
			},

			_isBuildingTabModified: {
				type: Boolean,
				value: false
			},

			loadingStackPlans: {
				type: Boolean,
				value: false,
				notify: true
			},

			stackPlansSortProp: {
				type: String,
				notify: true,
				value: "name"
			},

			stackPlansSortDesc: {
				type: Boolean,
				notify: true,
				value: false
			},

			stackPlansSortType: {
				type: String,
				notify: true,
				value: "STRING"
			},

			stackPlan: {
				type: Object,
				notify: true
			},

			buildingStackSupply: {
				type: Array,
				notify: true
			},

			floorStackSupply: {
				type: Array,
				notify: true
			},

			spaceStackSupply: {
				type: Array,
				notify: true
			},

			allSpaceStackSupply: {
				type: Array,
				notify: true
			},

			planningMoveItems: {
				type: Array,
				notify: true
			},

			stacks: {
				type: Object,
				notify: true
			},

			organizationList: {
				type: Array,
				notify: true
			},

			spaceClassList: {
				type: Array,
				notify: true
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingStackPlan: {
				type: Boolean,
				value: false
			},

			_loadingStackPlansActions: {
				type: Boolean,
				value: false
			},

			_loadingBuildingStackSupply: {
				type: Boolean,
				value: false
			},

			_loadingFloorStackSupply: {
				type: Boolean,
				value: false
			},

			_loadingSpaceStackSupply: {
				type: Boolean,
				value: false
			},

			_loadingAllSpaceStackSupply: {
				type: Boolean,
				value: false
			},

			_loadingPlanningMoveItems: {
				type: Boolean,
				value: false
			},

			_loadingStackPlanBlobs: {
				type: Boolean,
				value: false
			},

			_loadingOrganizationList: {
				type: Boolean,
				value: false
			},

			_loadingSpaceClassList: {
				type: Boolean,
				value: false
			},

			unsavedChanges: {
				type: Boolean,
				value: false,
				notify: true
			},

			stackPlanBlobs: {
				type: Object,
				notify: true
			},

			_stackPlanTransitionInfo: {
				type: Object,
				notify: true
			},

			canSubmitStackPlan: {
				type: Boolean,
				value: false,
				notify: true
			},

			canSaveStackPlan: {
				type: Boolean,
				value: false,
				notify: true
			},

			canReviseStackPlan: {
				type: Boolean,
				value: false,
				notify: true
			},

			contactRolesPartiallyComplete: {
				type: Array,
				notify: true
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingStackPlan, _loadingStackPlansActions, _loadingBuildingStackSupply, _loadingFloorStackSupply, _loadingSpaceStackSupply, _loadingStackPlanBlobs, _loadingOrganizationList, _loadingSpaceClassList, _loadingPlanningMoveItems, _loadingAllSpaceStackSupply)"
		]
	}
	
	refreshBuildingStackSupply(stackPlanId) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				this.shadowRoot.querySelector("#buildingStackSupplyDsContext").contextId = stackPlanId;
				return 	this.shadowRoot.querySelector("#buildingStackSupplyDs").refresh()
			}
		} else {
			return this._rootInstance.refreshBuildingStackSupply(stackPlanId);
		}
	}

	refreshStackPlan(stackPlanId, dirtyToastNotNeeded) {
		if (this._isRootInstance) {
			const stackPlanDsInstance = this.shadowRoot.querySelector("#stackPlanDsInstance");
			if (stackPlanId) {
				stackPlanDsInstance.instanceId = stackPlanId;
				return this.shadowRoot.querySelector("#stackPlanDs").refresh()
					.then(function(success) {
						this._computeCanSubmitCanSaveCanRevise(this._stackPlanTransitionInfo);
						let stackPlan = success.data;
						const stackPlanDataLocal = this._getStackPlanDataLocal(stackPlanId);
						if (stackPlanDataLocal && stackPlanDataLocal.dirty) {
							this.set('stacks', stackPlanDataLocal.allocationBlocks);
							this.unsavedChanges = true;
							if(!dirtyToastNotNeeded) this._showDirtyToast();
							return Promise.resolve(stackPlanDataLocal);
						} else {
							this.shadowRoot.querySelector("#stackPlanBODsInstance").instanceId = stackPlanId;
							return this.shadowRoot.querySelector("#stackPlanBODs").refresh().then(function(success) {
								const stackPlanBlobs = success.data;
								this.shadowRoot.querySelector("#buildingStackSupplyDsContext").contextId = stackPlanId;
								this.shadowRoot.querySelector("#floorStackSupplyDsContext").contextId = stackPlanId;
								this.shadowRoot.querySelector("#spaceStackSupplyDsContext").contextId = stackPlanId;
								return Promise.resolve(this.shadowRoot.querySelector("#buildingStackSupplyDs").refresh().then(function(success) {
									var buildings = success.data;
									return this.shadowRoot.querySelector("#floorStackSupplyDs").refresh()
										.then(function(success) {
											var floors = success.data;
											var spaceDsId = (this._isBuildingTabModified) ? "#allSpaceStackSupplyDs" : "#spaceStackSupplyDs";
											return this.shadowRoot.querySelector(spaceDsId).refresh()
												.then(function (success) {
													var spaces = success.data;
													let generatedStacksData = this._generateStacks(stackPlan, buildings, floors, spaces);
													let contactRolesPartiallyComplete = stackPlanBlobs.contactsJSON ? JSON.parse(stackPlanBlobs.contactsJSON) : [];
													this.set("contactRolesPartiallyComplete", contactRolesPartiallyComplete);
													if (stackPlanBlobs.allocationBlocksJSON) {
														let buildingBlobs = JSON.parse(stackPlanBlobs.allocationBlocksJSON).buildings;
														let newBuildings = [];
														generatedStacksData.buildings.map(building => {
															let buildingBlobIndex = buildingBlobs.findIndex(blob => blob._id == building._id);
															let buildingToProcess = (buildingBlobIndex >= 0) ? buildingBlobs[buildingBlobIndex] : building;
															if(buildingBlobIndex >= 0) {
																if(building.floors.length > buildingBlobs[buildingBlobIndex].floors.length) {
																	building.floors.forEach((floor) => {
																		let blobFloorIndex = buildingBlobs[buildingBlobIndex].floors.findIndex(blobFloor => blobFloor._id == floor._id);
																		if(blobFloorIndex === -1) {
																			if(floor.stacks) {
																				floor.stacks.forEach(stack => {
																					let buildingOrgsIndex = building.orgs.findIndex(org => org.name == stack.org);
																					let buildingToProcessOrgsIndex = buildingToProcess.orgs.findIndex(org => org.name == building.orgs[buildingOrgsIndex].name);
																					if(buildingOrgsIndex >= 0 && buildingToProcessOrgsIndex == -1) buildingToProcess.orgs.push(building.orgs[buildingOrgsIndex]);
																				})
																			}
																			buildingToProcess.floors.push(floor);
																		}
																	});
																}
															}
															newBuildings.push(buildingToProcess);
														});
														this.set('stacks', {buildings: newBuildings});
														if (this._isBuildingTabModified) {
															this.saveStackPlan(this.stackPlan._id, true);
															this.set('_isBuildingTabModified', false);
														}
														return {...stackPlanBlobs, allocationBlocksJSON: JSON.stringify({buildings: newBuildings})};
													} else {
														return {
															...this.stackPlan,
															allocationBlocks: generatedStacksData,
														};
													}
												}.bind(this));
										}.bind(this));
								}.bind(this)));
							}.bind(this));
						}
					}.bind(this));
			}
		} else {
			return this._rootInstance.refreshStackPlan(stackPlanId, dirtyToastNotNeeded);
		}
	}

	_computeCanSubmitCanSaveCanRevise(transitionInfo) {
		if (this._isRootInstance) {
			this.canSubmitStackPlan = (transitionInfo && transitionInfo.availableTrans && transitionInfo.availableTrans.triActivate);
			this.canSaveStackPlan = (transitionInfo && transitionInfo.availableTrans && transitionInfo.availableTrans.triSave);
			this.canReviseStackPlan = (transitionInfo && transitionInfo.availableTrans && transitionInfo.availableTrans.triRevise);
		}
	}

	createStackPlan(name, orgType, buildings, floors) {
		if (this._isRootInstance) {
			var newStackPlan = {
				name: name,
				orgType: orgType
			};
			return this.shadowRoot.querySelector("#stackPlansDsForActions")
				.createRecord(newStackPlan, TriPlatDs.RefreshType.NONE, "actions", "create")
					.then(function(createdRecordId) {
						this.shadowRoot.querySelector("#buildingStackSupplyDsContext").contextId = createdRecordId;
						this.shadowRoot.querySelector("#floorStackSupplyDsContext").contextId = createdRecordId;
						this.shadowRoot.querySelector("#buildingStackSupplyDs").addRecord(buildings, TriPlatDs.RefreshType.NONE);
						this.shadowRoot.querySelector("#floorStackSupplyDs").addRecord(floors, TriPlatDs.RefreshType.NONE);
						return createdRecordId;
					}.bind(this)
				);
		} else {
			return this._rootInstance.createStackPlan(name, orgType, buildings, floors);
		}
	}

	addBuildingFloors(stackPlanId, newbuildings, newfloors) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#buildingStackSupplyDsContext").contextId = stackPlanId;
			this.shadowRoot.querySelector("#floorStackSupplyDsContext").contextId = stackPlanId;
			this.shadowRoot.querySelector("#buildingStackSupplyDs").addRecord(newbuildings, TriPlatDs.RefreshType.NONE);
			return this.shadowRoot.querySelector("#floorStackSupplyDs").addRecord(newfloors, TriPlatDs.RefreshType.NONE);
		} else {
			return this._rootInstance.addBuildingFloors(stackPlanId, newbuildings, newfloors);
		}
	}

	deleteStackPlan(stackPlanId) {
		if (this._isRootInstance) {
			this.deleteStackPlanDataLocal(stackPlanId);
			return this.shadowRoot.querySelector("#stackPlansDsForActions")
				.deleteRecord(stackPlanId, TriPlatDs.RefreshType.SERVER, "actions", "delete");
		} else {
			return this._rootInstance.deleteStackPlan(stackPlanId);
		}
	}

	async submitStackPlan(stackPlanId) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				await this.clearContactsJSON(stackPlanId);
				this.generatePlanningMoveItems(stackPlanId, true);
				return this.shadowRoot.querySelector("#stackPlanDs").
					performAction(stackPlanId, TriPlatDs.RefreshType.SERVER, "actions", "activate");
			}
		} else {
			return this._rootInstance.submitStackPlan(stackPlanId);
		}
	}

	clearContactsJSON(stackPlanId) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlanBODsInstance").instanceId = stackPlanId;
			this.shadowRoot.querySelector("#stackPlanBODs").data = {
					...this.shadowRoot.querySelector("#stackPlanBODs").data,
					contactsJSON: null
				};
			return this.shadowRoot.querySelector("#stackPlanBODs").updateRecord(stackPlanId, TriPlatDs.RefreshType.SERVER, "actions", "save");
		} else {
			return this._rootInstance.clearContactsJSON(stackPlanId);
		}
	}

	submitStackPlanToast() {
		if (this._isRootInstance) {
			var __dictionary__submitStackPlanText = "Stack plan submitted.";
			this.dispatchEvent(new CustomEvent('toast-alert', { detail: {
				type: "success",
				text: __dictionary__submitStackPlanText
			}, bubbles: true, composed: true}));
		} else {
			return this._rootInstance.submitStackPlanToast();
		}
	}

	reviseStackPlan(stackPlanId) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				return this.shadowRoot.querySelector("#stackPlanDs").performAction(stackPlanId, TriPlatDs.RefreshType.SERVER, "actions", "revise");
			}
		} else {
			return this._rootInstance.reviseStackPlan(stackPlanId);
		}
	}

	reviseStackPlanToast() {
		if (this._isRootInstance) {
			var __dictionary__reviseStackPlanText = "Stack plan status is Revision in Progress.";
			this.dispatchEvent(new CustomEvent('toast-alert', { detail: {
				type: "success",
				text: __dictionary__reviseStackPlanText
			}, bubbles: true, composed: true}));
		} else {
			return this._rootInstance.reviseStackPlanToast();
		}
	}

	_generateStacks(stackPlan, buildings, floors, spaces) {
		let stacks = new Object();

		stacks.buildings = buildings;

		let floorsGroupedByBuilding = groupBy(floors, "building", "id");
		let spacesGroupedByFloor = groupBy(spaces.slice(), "floor", "id");

		stacks.buildings.forEach(function(building, buildingIndex, buildings) {
			if (floorsGroupedByBuilding && Object.keys(floorsGroupedByBuilding).length > 0) {
				building.orgs = [];
				building.floors = floorsGroupedByBuilding[building._id];
				if (building.floors) {
					building.floors = building.floors.map(floor => { 
						floor.hasDiscrepancy = false;
						return floor;
					});
					building.floors.forEach(function(floor) { 
						if (floor && floor.rentableArea) {
							let spacesForFloor = spacesGroupedByFloor[floor._id];
							floor.spaceSupply = this._aggregateBySpaceClassForSupply(spacesForFloor, stackPlan.orgType);
							floor.assignableSpaceSupply = this._filterAssignableSupply(floor.spaceSupply);
							floor.stacks = [];
							if (spacesForFloor && spacesForFloor.length > 0) {
								floor.area = sumSpacesArea(floor.spaceSupply);
								floor.assignableArea = sumSpacesArea(floor.assignableSpaceSupply);

								let spacesGroupedByIntermediateFormName = groupBy(spacesForFloor, "formName");
								let intermediateAllocFormName = this._getIntermediateAllocFormName(stackPlan.orgType);
								let spacesForOrgType = spacesGroupedByIntermediateFormName[intermediateAllocFormName];
								if (spacesForOrgType && spacesForOrgType.length > 0) {
									let spacesGroupedByOrg = groupBy(spacesForOrgType, "orgPath", "value");
									const spacesGroupedByOrgKeys = Object.keys(spacesGroupedByOrg);
									buildings[buildingIndex].orgs = buildings[buildingIndex].orgs.concat(spacesGroupedByOrgKeys);
									spacesGroupedByOrgKeys.forEach(function(orgPath) {
										const spacesByOrg = spacesGroupedByOrg[orgPath];
										if (spacesByOrg && spacesByOrg.length) {
											let orgName = this._truncateOrgPath(orgPath);
	
											const spaces = this._aggregateBySpaceClassForDemand(spacesByOrg, stackPlan.orgType);

											if (Object.keys(spaces).length > 0) {
												const [stackArea, percentage] = calcAreaAndPercentage(spaces, floor.area);
	
												// Compute percentage only for the assignable spaces
												const assignableSpaces = this._filterAssignableSupply(spaces);
												let assignableSpacesStackArea = 0;
												let assignableSpacesPercentage = 0;
												if (assignableSpaces && Object.keys(assignableSpaces).length) {
													[assignableSpacesStackArea, assignableSpacesPercentage] = calcAreaAndPercentage(assignableSpaces, floor.area);
												}
							
												let stack = {
													org: orgName,
													orgPath: spacesByOrg[0].orgPath,
													orgId: spacesByOrg[0].orgId,
													areaAllocated: stackArea,
													assignableSpacesAreaAllocated: assignableSpacesStackArea,
													percentage: percentage,
													assignableSpacesPercentage: assignableSpacesPercentage,
													spaces: spaces,
													assignableSpaces: assignableSpaces,
													originFloor: { value: floor.name, id: floor._id },
													floor: { name: floor.name, id: floor._id, area: floor.area},
													originBldg: { value: floor.building.value, id: floor.building.id.toString() },
													building: { name: floor.building.value, id: floor.building.id.toString() },
													uom: spacesByOrg[0].area.uom
												};
												floor.stacks.push(stack);
											}
										}
									}.bind(this));
								}
							} else {
								floor.area = floor.rentableArea;
								floor.assignableArea = 0;
							}
							floor.hasDiscrepancy = calcDiscrepancy(floor, false);
							floor.hasAssignableDiscrepancy = calcDiscrepancy(floor, true);
						}
					}.bind(this));
				}
			}
			building.orgs = [...new Set(building.orgs)];
			let spaceStackSupply = (this._isBuildingTabModified) ? this.allSpaceStackSupply : this.spaceStackSupply;
			building.orgs = this._setupOrgData(building.orgs, spaceStackSupply);
			building.orgs = building.orgs.sort(compareOrgs);
		}.bind(this));
		this.set('stacks', stacks);
		return stacks;
	}

	_getIntermediateAllocFormName(orgType) {
		return orgType == "Chargeback" ? "triSpaceLevelAllocation" : "triSpaceLevelOccupancyAllocation";
	}

	_setupOrgData(orgs, source) {
		let newOrgs = orgs.map(orgPath => {
			let color = "#e71d32";
			const spaceFound = source.find(item => {
				return orgPath == item.orgPath.value;
			});

			if (spaceFound && spaceFound.orgColor) {
				color = spaceFound.orgColor;
			}

			return {
				name: this._truncateOrgPath(orgPath),
				path: orgPath,
				fill: color
			}
		});
		return newOrgs;
	}

	_truncateOrgPath(path) {
		let splitPath = path.split('\\');
		return splitPath[splitPath.length - 1];
	}

	removeStackFromFloor(sourceStack, buildingIndex, floorIndex) {
		let floor, stackIndex;
		if (floorIndex != -1) {
			floor = this.stacks.buildings[buildingIndex].floors[floorIndex];
		}
		if (floor) {
			stackIndex = floor.stacks.findIndex(stack => {
				return isEquivalent(stack, sourceStack);
			})
			if (stackIndex != -1) {
				floor.stacks.splice(stackIndex, 1);
			}
		}
	}

	addStackToFloor(sourceModel, buildingIndex, floorIndex, toBlockModel) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		let floor;
		let stackIndex = -1;
		if (floorIndex != -1) {
			floor = this.stacks.buildings[buildingIndex].floors[floorIndex];
		}
		if (floor) {
			if (toBlockModel) {
				stackIndex = floor.stacks.findIndex(stack => {
					return isEquivalent(stack, toBlockModel);
				})
			} else {
				for (let i = 0; i < floor.stacks.length; i++) {
					if (floor.stacks[i].orgPath.value === sourceModel.orgPath.value) {
						stackIndex = i;
					}
				}
			}
			
			if (stackIndex != -1) {
				floor.stacks.splice(stackIndex + 1, 0, sourceModel);
			} else {
				floor.stacks.push(sourceModel);
			}

			sourceModel.building = { name: floor.building.value, id: floor.building.id.toString()}
			sourceModel.floor = { name: floor.name, id: floor._id, area: floor.area };
		}
	}

	addDemandStackToFloor(floor, demandStack, organization) {
		if (this._isRootInstance) {
			return new Promise((resolve, reject) => {
				if (!demandStack || !floor) setTimeout(reject, 1);

				const stackToAdd = demandStack;

				const targetFloorData = {
					building: { id: floor.building.id },
					floor: { id: floor._id }
				};
				const [targetBuildingIndex, targetFloorIndex] = findBuildingFloorIndexes(targetFloorData, this.stacks);

				const toFloor = this.get(`stacks.buildings.${targetBuildingIndex}.floors.${targetFloorIndex}`);

				this.addStackToFloor(stackToAdd, targetBuildingIndex, targetFloorIndex);

				toFloor.hasDiscrepancy = calcDiscrepancy(toFloor, false);
				toFloor.hasAssignableDiscrepancy = calcDiscrepancy(toFloor, true);

				this.set(`stacks.buildings.${targetBuildingIndex}.floors.${targetFloorIndex}`, toFloor);
				this.set(`stacks.buildings.${targetBuildingIndex}.floors.${targetFloorIndex}`,
				Object.assign({}, this.stacks.buildings[targetBuildingIndex].floors[targetFloorIndex]));

				let orgIndex = this.stacks.buildings[targetBuildingIndex].orgs.findIndex((org) => { return (org.name == organization.name && org.path == organization.orgPath && org.fill == organization.color) });
				if (orgIndex < 0) {
					let newOrg = {
						fill: organization.color,
						name: organization.name,
						path: organization.orgPath
					};
					this.push(`stacks.buildings.${targetBuildingIndex}.orgs`, newOrg);
					this.stacks.buildings[targetBuildingIndex].orgs = this.stacks.buildings[targetBuildingIndex].orgs.sort(compareOrgs);
				}

				setTimeout(resolve, 1);
			}, this);
		} else {
			return this._rootInstance.addDemandStackToFloor(floor, demandStack);
		}
	}

	saveCurrentStackPlanDataLocal() {
		if (this._isRootInstance) {
			if (this.stackPlan._id) {
				this.saveStackPlanDataLocal(this.stackPlan._id, this.stacks, true);
			}
		} else {
			return this._rootInstance.saveCurrentStackPlanDataLocal();
		}
	}

	async saveContactsJSONToStackPlan(stackPlanId, contactsJSON) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlanBODsInstance").instanceId = stackPlanId;
			this.shadowRoot.querySelector("#stackPlanBODs").data = {
					...this.shadowRoot.querySelector("#stackPlanBODs").data,
					contactsJSON: contactsJSON
				};
			this.set("contactRolesPartiallyComplete", JSON.parse(contactsJSON));
			await this.shadowRoot.querySelector("#stackPlanBODs").updateRecord(stackPlanId, TriPlatDs.RefreshType.NONE);
		} else {
			return this._rootInstance.saveContactsJSONToStackPlan(stackPlanId, contactsJSON);
		}
	}

	async saveStackPlan(stackPlanId, hideSaveToast) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				this.shadowRoot.querySelector("#stackPlanBODsInstance").instanceId = stackPlanId;
				this.shadowRoot.querySelector("#stackPlanBODs").data = {
						_id: stackPlanId, 
						allocationBlocksJSON: JSON.stringify(this.stacks),
						contactsJSON: JSON.stringify(this.contactRolesPartiallyComplete)
					};
				await this.shadowRoot.querySelector("#stackPlanBODs").updateRecord(stackPlanId, TriPlatDs.RefreshType.SERVER, "actions", "save");
				await this.shadowRoot.querySelector("#adHocDemandService").setPermanentHistoryRestorableDemands()
					.then(() => {
						this.deleteStackPlanDataLocal(stackPlanId);
						if (!hideSaveToast) {
							var __dictionary__updateStackPlanText = "Stack plan saved.";
							this.dispatchEvent(new CustomEvent('toast-alert', { detail: {
								type: "success",
								text: __dictionary__updateStackPlanText
							}, bubbles: true, composed: true}));
						}
					});
			}
		} else {
			return this._rootInstance.saveStackPlan(stackPlanId, hideSaveToast);
		}
	}

	saveStackPlanDataLocal(stackPlanId, allocationBlocks, dirty) {
		if (this._isRootInstance) {
			if (stackPlanId && this.canSaveStackPlan) {
				try {
					localStorage.setItem(`${stackPlanId}.allocationBlocksJSON`, JSON.stringify(allocationBlocks));
					localStorage.setItem(`${stackPlanId}.dirty`, dirty === undefined ? false : dirty);
					this.unsavedChanges = (dirty === undefined ? false : dirty);
				} catch(error) {
					this.dispatchEvent(new CustomEvent('local-storage-open-popup', {
						bubbles: true,
						composed: true
					}));
				}
			}
		} else {
			return this._rootInstance.saveStackPlanDataLocal(stackPlanId, allocationBlocks, dirty);
		}
	}

	_getStackPlanDataLocal(stackPlanId) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				const allocationBlocks = JSON.parse(localStorage.getItem(`${stackPlanId}.allocationBlocksJSON`));
				const dirty = JSON.parse(localStorage.getItem(`${stackPlanId}.dirty`));
				if (allocationBlocks) {
					return {
						allocationBlocks: allocationBlocks,
						dirty: dirty
					};
				} else {
					return null;
				}
			}
		} else {
			return this._rootInstance._getStackPlanDataLocal(stackPlanId);
		}
	}

	deleteStackPlanDataLocal(stackPlanId, restoring) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				this._isBuildingTabModified = false;
				localStorage.removeItem(`${stackPlanId}.allocationBlocksJSON`);
				localStorage.removeItem(`${stackPlanId}.dirty`);
				if (restoring) {
					this.shadowRoot.querySelector("#adHocDemandService").deleteHistoryRestorableDemands();
				}
			}
		} else {
			return this._rootInstance.deleteStackPlanDataLocal(stackPlanId, restoring);
		}
	}

	_showDirtyToast() {
		var __dictionary__dirtyText = "You have unsaved changes.";
		this.dispatchEvent(new CustomEvent('toast-alert', { detail: {
			type: "info",
			text: __dictionary__dirtyText
		}, bubbles: true, composed: true}));
	}

	_aggregateBySpaceClassForDemand(spaces, type) {
		const demand = {};
		const spacesBySpaceClass = groupBy(spaces, "spaceClass");

		Object.keys(spacesBySpaceClass).forEach(spaceClass => {
			const spaceClassSpaces = spacesBySpaceClass[spaceClass];
			let totalCount = 0;
			let totalArea = 0;

			spaceClassSpaces.forEach(space => {
				if (type == "Chargeback") {
					totalCount += space.percentAllocated;
				} else {
					totalCount += space.seatsAllocated;
				}
				totalArea += space.areaAllocated.value;
			});

			if (type == "Chargeback") {
				totalCount = totalCount / 100;
			}

			if (totalCount > 0 || totalArea > 0) {
				const item = {
					count: totalCount,
					area: totalArea,
					uom: spacesBySpaceClass[spaceClass][0].areaAllocated.uom,
					assignable: spacesBySpaceClass[spaceClass][0].assignable,
					spaceClassId: spacesBySpaceClass[spaceClass][0].spaceClassId,
					spaceClass: spaceClass,
					spaceClassIdField: spacesBySpaceClass[spaceClass][0].spaceClassIdField,
					building: spacesBySpaceClass[spaceClass][0].building,
					floor: spacesBySpaceClass[spaceClass][0].floor
				}
				demand[spaceClass] = item;
			}
		});	

		return demand;
	}

	_aggregateBySpaceClassForSupply(spaces, type) {
		const supply = {}; 
		const spacesBySpaceClass = groupBy(spaces, "spaceClass");

		Object.keys(spacesBySpaceClass).forEach(spaceClass => {
			const spacesById = groupBy(spacesBySpaceClass[spaceClass], "_id");
			let totalCapacity = 0;
			let totalArea = 0;

			Object.keys(spacesById).forEach(spaceId => {
				if (type == "Chargeback") {
					totalCapacity += 1;
				} else {
					totalCapacity += spacesById[spaceId][0].capacity;
				}
				totalArea += spacesById[spaceId][0].area.value;
			});

			if (totalCapacity > 0 || totalArea > 0) {
				const item = {
					count: totalCapacity,
					area: totalArea,
					uom: spacesBySpaceClass[spaceClass][0].area.uom,
					assignable: spacesBySpaceClass[spaceClass][0].assignable,
					spaceClassId: spacesBySpaceClass[spaceClass][0].spaceClassId,
					spaceClass: spaceClass,
					spaceClassIdField: spacesBySpaceClass[spaceClass][0].spaceClassIdField,
					building: spacesBySpaceClass[spaceClass][0].building,
					floor: spacesBySpaceClass[spaceClass][0].floor
				}
				supply[spaceClass] = item;
			}
		});	

		return supply;
	}

	removeSpacesFromStack(spaceStack, buildingIndex, floorIndex) {
		if (this._isRootInstance) {
			const floorStacks = this.stacks.buildings[buildingIndex].floors[floorIndex].stacks;
			const stackIndex = floorStacks.findIndex(stack => {
				return isEquivalent(spaceStack.parentStack, stack);
			})
			let spaces = spaceStack.parentStack.spaces;
			Object.keys(spaceStack.spaces).forEach(spaceClass => {
				spaces[spaceClass].count -= spaceStack.spaces[spaceClass].count;
				spaces[spaceClass].area -= spaceStack.spaces[spaceClass].area;
				if (spaces[spaceClass].count == 0 && round(spaces[spaceClass].area) == 0) {
					delete spaces[spaceClass];
				}
			});

			const [parentAreaAllocated, parentPercentage] = calcAreaAndPercentage(spaces, spaceStack.parentStack.floor.area);
			spaceStack.parentStack.areaAllocated = parentAreaAllocated;
			spaceStack.parentStack.percentage = parentPercentage;
			spaceStack.parentStack.spaces = spaces;

			let assignableSpaces = spaceStack.parentStack.assignableSpaces;
			let assignableSpacesStackArea = spaceStack.parentStack.assignableSpacesAreaAllocated;
			let assignableSpacesPercentage = spaceStack.parentStack.assignableSpacesPercentage;
			if (spaceStack.assignableSpaces && Object.keys(spaceStack.assignableSpaces).length) {
				Object.keys(spaceStack.assignableSpaces).forEach(spaceClass => {
					assignableSpaces[spaceClass].count -= spaceStack.assignableSpaces[spaceClass].count;
					assignableSpaces[spaceClass].area -= spaceStack.assignableSpaces[spaceClass].area;
					if (assignableSpaces[spaceClass].count == 0 && round(assignableSpaces[spaceClass].area) == 0) {
						delete assignableSpaces[spaceClass];
					}
				});
				[assignableSpacesStackArea, assignableSpacesPercentage] = calcAreaAndPercentage(assignableSpaces, spaceStack.parentStack.floor.area);
			}

			spaceStack.parentStack.assignableSpacesAreaAllocated = assignableSpacesStackArea;
			spaceStack.parentStack.assignableSpacesPercentage = assignableSpacesPercentage;
		} else {
			return this._rootInstance.removeSpacesFromStack(spaceStack, buildingIndex, floorIndex);
		}
	}

	splitBySpaceClass(spaceStack) {
		if (this._isRootInstance) {
			const splitStacks = [];
			const spacesGroupedBySpaceClass = spaceStack.spaces;
			for (let spaceClass in spacesGroupedBySpaceClass) {
				const filteredSpaces = {};
				filteredSpaces[spaceClass] = Object.assign({}, spaceStack.spaces[spaceClass]);
				const stackArea = filteredSpaces[spaceClass].area;
				const percentage = computePercentageValue(stackArea, spaceStack.floor.area);
				
				let assignableSpacesStackArea = 0;
				let assignableSpacesPercentage = 0;
				let assignableSpaces = {};
				if (filteredSpaces[spaceClass].assignable) {
					assignableSpacesStackArea = stackArea;
					assignableSpacesPercentage = percentage;
					assignableSpaces[spaceClass] = Object.assign({}, spaceStack.spaces[spaceClass]);
				}

				const stack = {
					areaAllocated: stackArea,
					building: spaceStack.building,
					floor: spaceStack.floor,
					originBldg: spaceStack.originBldg,
					originFloor: spaceStack.originFloor,
					org: spaceStack.org,
					orgPath: spaceStack.orgPath,
					orgId: spaceStack.orgId,
					percentage: percentage,
					spaces: filteredSpaces,
					spaceClass: spaceClass,
					parentStack: spaceStack,
					assignable: filteredSpaces[spaceClass].assignable,
					assignableSpacesAreaAllocated: assignableSpacesStackArea,
					assignableSpacesPercentage: assignableSpacesPercentage,
					assignableSpaces: assignableSpaces,
					uom: spaceStack.uom
				};

				splitStacks.push(stack);
			}
			return splitStacks;
		} else {
			return this._rootInstance.splitBySpaceClass(spaceStack);
		}
	}

	saveNote(stackPlanId, note) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				this.shadowRoot.querySelector("#stackPlanBODs").data = {
						_id: stackPlanId,
						notes: note
					};
				return this.shadowRoot.querySelector("#stackPlanBODs").updateRecord(data, TriPlatDs.RefreshType.SERVER, "actions", "save")
					.then(() => {
						var __dictionary__updateStackPlanText = "Note saved.";
						this.dispatchEvent(new CustomEvent('toast-alert', { detail: {
							type: "success",
							text: __dictionary__updateStackPlanText
						}, bubbles: true, composed: true}));
					})
			}
		} else {
			return this._rootInstance.saveNote(stackPlanId, note);
		}
	}

	refreshPlanningMoveItems(stackPlanId) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#planningMoveItemsDsContext").contextId = stackPlanId;
			return this.shadowRoot.querySelector("#planningMoveItemsDs").refresh();
		} else {
			return this._rootInstance.refreshPlanningMoveItems(stackPlanId);
		}
	}

	getPlanningMoveItemsQueryMetadata(stackPlanId) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#planningMoveItemsDsContext").contextId = stackPlanId;
			return this.shadowRoot.querySelector("#planningMoveItemsDs").getQueryMetadata();
		} else {
			return this._rootInstance.getPlanningMoveItemsQueryMetadata(stackPlanId);
		}
	}

	generatePlanningMoveItems(stackPlanId, changedOnly) {
		if (this._isRootInstance) {
			if (stackPlanId) {
				return this.refreshBuildingStackSupply(stackPlanId).then(success => {
					let generatedPlanningMoveItems = this.createPlanningMoveItemsFromAllocationBlocks(stackPlanId, changedOnly, this.stacks);
					return this._createPlanningMoveItems(stackPlanId, generatedPlanningMoveItems);
				}, this);
			}
		} else {
			return this._rootInstance.generatePlanningMoveItems(stackPlanId);
		}
	}

	createPlanningMoveItemsFromAllocationBlocks(stackPlanId, changedOnly, stacks) {
		if (this._isRootInstance) {
			this.set('_loadingPlanningMoveItems', true);
			let planningMoveItemsFromAllocationBlocks = [];
			stacks.buildings.forEach(function(building) {
				building.floors.forEach(function(floor) {
					floor.stacks.forEach(function(parentAllocationBlock) {
						this.splitBySpaceClass(parentAllocationBlock).forEach(function(allocationBlock) {
							let spaceClass = Object.keys(allocationBlock.spaces)[0];
							let firstSpace = allocationBlock.spaces[spaceClass];
							let toFloor = { id: allocationBlock.floor.id, value: allocationBlock.floor.name };
							let isChanged = !allocationBlock.originFloor || !!(allocationBlock.originFloor && toFloor && allocationBlock.originFloor.id != toFloor.id);
							if (!changedOnly || (changedOnly && isChanged)) {
								let spaceClassKV = { id: firstSpace.spaceClassId, value: firstSpace.spaceClass };
								let fromBldgRecord = allocationBlock.originBldg 
									? this.buildingStackSupply.find(building => building._id == allocationBlock.originBldg.id)
									: this.buildingStackSupply.find(building => building._id == firstSpace.building.id);
								let area = { value: allocationBlock.areaAllocated, uom: fromBldgRecord.areaUnits ? fromBldgRecord.areaUnits : "square-feet" };
								let toGeo = this.buildingStackSupply.find(building => building._id == allocationBlock.building.id).geo;
								let toBldg = { id: allocationBlock.building.id, value: allocationBlock.building.name };
								const orgName = this._truncateOrgPath(allocationBlock.orgPath.value);
								let planningMoveItem = {
									org: { id: allocationBlock.orgPath.id, value: orgName },
									orgId: allocationBlock.orgId,
									fromSpaceClass: spaceClassKV,
									fromSpaceClassId: firstSpace.spaceClassIdField,
									toSpaceClass: spaceClassKV,
									toSpaceClassId: firstSpace.spaceClassIdField,
									qty: allocationBlock.spaces[spaceClass].count,
									area: area,
									toGeo: toGeo,
									toBldg: toBldg,
									toFloor: toFloor,
									isChanged: isChanged
								};
								if (allocationBlock.originFloor) {
									planningMoveItem.fromGeo = fromBldgRecord.geo;
									planningMoveItem.fromBldg = allocationBlock.originBldg;
									planningMoveItem.fromFloor = allocationBlock.originFloor;
								}
								planningMoveItemsFromAllocationBlocks.push(planningMoveItem);
							}
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
			this.set('_loadingPlanningMoveItems', false);
			return planningMoveItemsFromAllocationBlocks;
		} else {
			return this._rootInstance.createPlanningMoveItemsFromAllocationBlocks(stackPlanId, changedOnly, stacks);
		}
	}

	_createPlanningMoveItems(stackPlanId, generatedPlanningMoveItems) {
		this.shadowRoot.querySelector("#planningMoveItemsDsContext").contextId = stackPlanId;
		return this.shadowRoot.querySelector("#planningMoveItemsDs").createRecord(generatedPlanningMoveItems, TriPlatDs.RefreshType.SERVER, "actions", "create");
	}

	_filterAssignableSupply(supply) {
		const assignableSupply = {};
		Object.keys(supply).forEach(spaceClass => {
			if (supply[spaceClass].assignable) {
				assignableSupply[spaceClass] = Object.assign({}, supply[spaceClass]);
			}
		})
		return assignableSupply;
	}

	refreshStackPlanBo(stackPlanId, force) {
		if (this._isRootInstance) {
			var stackPlanBODsInstance = this.shadowRoot.querySelector("#stackPlanBODsInstance");

			if (force || this.stackPlanBlobs == null || stackPlanBODsInstance.instanceId != stackPlanId) {
				stackPlanBODsInstance.instanceId = stackPlanId;
				return this.shadowRoot.querySelector("#stackPlanBODs").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.stackPlanBlobs);
			}
		} else {
			return this._rootInstance.refreshStackPlanBo(stackPlanId, force);
		}
	}

	refreshStackPlanObject(stackPlanId, force) {
		if (this._isRootInstance) {
			return this.shadowRoot.querySelector("#stackPlanBODs").refresh()
					.then(this._returnDataFromResponse.bind(this));
		} else {
			return this._rootInstance.refreshStackPlanBo(stackPlanId, force);
		}
	}

	updateStackPlanBoAdHocDemands(stackPlanId, demands, noToast) {
		if (this._isRootInstance) {
			if (stackPlanId && this.canSaveStackPlan) {
				this.shadowRoot.querySelector("#stackPlanBODsInstance").instanceId = stackPlanId;
				this.shadowRoot.querySelector("#stackPlanBODs").data = {
						_id: stackPlanId, 
						stackAdHocDemandJSON: JSON.stringify(demands),
					};
				return this.shadowRoot.querySelector("#stackPlanBODs").updateRecord(stackPlanId, TriPlatDs.RefreshType.SERVER, "actions", "save")
					.then(() => {
						if (!noToast) {
							var __dictionary__updateAdHocDemands = "Demand saved.";
							this.dispatchEvent(new CustomEvent('toast-alert', { detail: {
								type: "success",
								text: __dictionary__updateAdHocDemands
							}, bubbles: true, composed: true}));
						}
					});
			} else {
				return Promise.reject();
			}
		} else {
			return this._rootInstance.updateStackPlanBoAdHocDemands(stackPlanId, demands, noToast);
		}
	}

	refreshOrganizationList(force) {
		if (this._isRootInstance) {
			if (force || this.organizationList == null || this.organizationList.length == 0) {
				this._loadingOrganizationList = true;
				return this.shadowRoot.querySelector("#organizationListDs").refresh()
					.then(this._returnDataFromResponse.bind(this))
					.then((response) => {
						this.organizationList = [];
						let organizations = response;
						if (organizations && organizations.length > 0) {
							organizations.forEach((organization) => {
								organization.idName = (organization.id && organization.id != "") ? organization.id + " - " + organization.name : organization.name;
							});
							this.organizationList = organizations;
						}
						this._loadingOrganizationList = false;
					})
					.catch((error) => {
						this._loadingOrganizationList = false;
						return Promise.reject(error);
					});
			} else {
				return Promise.resolve(this.organizationList);
			}
		} else {
			return this._rootInstance.refreshOrganizationList(force);
		}
	}

	refreshSpaceClassList(force) {
		if (this._isRootInstance) {
			if (force || this.spaceClassList == null || this.spaceClassList.length == 0) {
				this._loadingSpaceClassList = true;
				return this.shadowRoot.querySelector("#spaceClassListDs").refresh()
					.then(this._returnDataFromResponse.bind(this))
					.then((response) => {
						this.spaceClassList = [];
						let spaceClasses = response;
						if (spaceClasses && spaceClasses.length > 0) {
							spaceClasses.forEach((spaceClass) => {
								spaceClass.idName = (spaceClass.id && spaceClass.id != "") ? spaceClass.id + " - " + spaceClass.name : spaceClass.name;
							});
							this.spaceClassList = spaceClasses;
						}
						this._loadingSpaceClassList = false;
					})
					.catch((error) => {
						this._loadingSpaceClassList = false;
						return Promise.reject(error);
					});
			} else {
				return Promise.resolve(this.spaceClassList);
			}
		} else {
			return this._rootInstance.refreshSpaceClassList(force);
		}
	}
};

window.customElements.define(TriServiceStackPlan.is, TriServiceStackPlan);
