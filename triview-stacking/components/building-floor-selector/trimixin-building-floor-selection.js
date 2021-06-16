/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

export const TrimixinBuildingFloorSelection = (superClass) => class extends superClass {
	static get properties() {
		return {
			_filteredBuildingList: {
				type: Array
			},

			_buildingListSearchValue: {
				type: String
			},

			buildingListSearchValueForDS: {
				type: String
			},

			buildingListSearchValue:{
				type: String
			},

			_showSelectedBuildings: {
				type: Boolean
			},

			_selectedBuildingsList: {
				type: Array,
				value: function () { return []; }
			},

			_buildingListScroller: {
				type: Object
			},

			initialBuildingListSelected: {
				type: Array
			},

			buildingListSelected: {
				type: Array,
				notify: true,
				value: function () { return []; }
			},

			_buildingWithNoFloors: {
				type: Array,
				value: function () { return []; }
			},

			_floorsForBuilding: {
				type: Array,
				notify: true
			},

			initialFloorListSelected: {
				type: Array
			},

			floorListSelected: {
				type: Array,
				notify: true,
				value: function () { return []; }
			},

			previousSelectedBuilding: {
				type: Object
			},

			previousBuilding: {
				type: Object
			},

			currentBuildingSelected: {
				type: Object
			},

			showFloorPanel: {
				type: Boolean,
				notify: true
			},
			
			_selectedBuildingUniqueId: {
				type: Number,
				value: 0
			},
			
			_selectedBuildingId: {
				type: Number,
				value: 0
			},
			
			_floorsCountOfSelectedBuilding: {
				type: Array,
				value: function () {
					return [];
				}
			},

			_defaultOrgAllocType: String,
			_orgAllocTypes: Array,

			selectedOrgAllocType: {
				type: String,
				notify: true
			},

			hideSelectedOrgAllocType: {
				type: Boolean,
				value: false
			},

			readonly: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_setDefaultOrgAllocType(_orgAllocTypes)",
			"_reselectSelectedBuildings(_filteredBuildingList)",
			"_handleFloorsCount(floorListSelected.length)",
			"_observeFilteredBuildingList(_filteredBuildingList.*)",
			"_observeBuildingsSelectedCheckbox(_showSelectedBuildings)",
			"_observeBuildingSearch(_buildingListSearchValue)"
		]
	}

	constructor() {
		super();
		this._handleBuildingSelected = this._handleBuildingSelected.bind(this);
		this._removeBuildingSelection = this._removeBuildingSelection.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("building-selected", this._handleBuildingSelected);
		this.addEventListener("building-unselected", this._removeBuildingSelection);
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("building-selected", this._handleBuildingSelected);
		this.removeEventListener("building-unselected", this._removeBuildingSelection);
	}

	resetPreviousNewSelection() {
		this._resetBuildingSearchValue("");
		this.set('currentBuildingSelected', {});
		this.set('buildingListSelected', []);
		this.set('_floorsForBuilding', []);
		this.set("buildingListSearchValueForDS", "");
		this.set('_buildingListSearchValue', "");
		this.set('selectedOrgAllocType', this._defaultOrgAllocType);
		this._setShowSelectedbuildings(false);
		this.set('_buildingWithNoFloors', []);
		this.set('showFloorPanel', false);
		this.set('floorListSelected', []);
		this.set('previousBuilding', {});
		this.set('previousSelectedBuilding', {});
		if(this._filteredBuildingList) {
			for(var i=0; i<this._filteredBuildingList.length; i++) {
				let obj = this._filteredBuildingList[i];
				this.set("_filteredBuildingList." + i, {
					address: obj.address,
					building: obj.building,
					buildingId:  obj.buildingId,
					buildingSelected: false,
					disable: false,
					city: obj.city,
					country: obj.country,
					selected: false,
					picture: obj.picture,
					state: obj.state,
					_id: obj._id,
					status: obj.status,
					property: obj.property});
			}
		}
	}

	resetPreviousEditSelection() {
		this._setShowSelectedbuildings(true);
		if(this._showSelectedBuildings)
			this.set("_selectedBuildingsList", this.buildingListSelected);
		this.set('_floorsForBuilding', []);
		this.set('_buildingListSearchValue', "");
		this.set('showFloorPanel', false);
		this.set('previousBuilding', {});
		this.set('previousSelectedBuilding', {});
		this.set('currentBuildingSelected', {});
		if(this._filteredBuildingList) {
			for(var i=0; i<this._filteredBuildingList.length; i++){
				let index = this.buildingListSelected.map(building => building._id).indexOf(this._filteredBuildingList[i]._id);
				this._setFilteredBuilding(i, this._filteredBuildingList[i], false, (index != -1));
			}
		}
	}

	_setShowSelectedbuildings(show) {
		this.set("_showSelectedBuildings", show);
	}

	_setDefaultOrgAllocType(orgAllocTyoes) {
		let defaultOrgAllocType = this._getDefaultOrgAllocType(orgAllocTyoes);
		this.set('_defaultOrgAllocType', defaultOrgAllocType);
		this.set('selectedOrgAllocType', this._defaultOrgAllocType);
	}

	_getDefaultOrgAllocType(orgAllocTypes) {
		if (orgAllocTypes) {
			return orgAllocTypes[0].internalValue;
		}
	}

	_computeOrgAllocTypeLabel(orgAllocType) {
		if (orgAllocType) {
			return orgAllocType.toLowerCase();
		}
	}

	_observeBuildingSearch(searchValue) {
		this._setBuildingSearch(searchValue);
	}

	_setBuildingSearch(searchValue) {
		if(this._showSelectedBuildings) {
			this.set("buildingListSearchValue", searchValue);
		} else  {
			if(searchValue != null)
				this.set("buildingListSearchValueForDS", searchValue);
		}
	}

	_observeBuildingsSelectedCheckbox(showSelectedBuildings) {
		this.$.lookupDataService.disableBuildingDs(showSelectedBuildings);
		if(showSelectedBuildings)
			this.set("_selectedBuildingsList", this.buildingListSelected);
		this._resetBuildingSearchValue(this._buildingListSearchValue);
	}

	_setFilteredBuilding(index, obj, selected, buildingSelected) {
		if(index != -1) {
			this.set("_filteredBuildingList." + index, {...obj, buildingSelected: buildingSelected, selected: selected});
		}
	}

	_handleBuildingSelected(e) {
		var item = e.detail.item;
		this.set('_selectedBuildingId', item._id);
		this.set('_selectedBuildingUniqueId', item.buildingId);
		if (!item.buildingSelected || !item.selected) {
			this.$.lookupDataService.refreshFloors(item._id).then(function (floors) {
				if (floors && floors.length > 0) {
					var count = 0;
					this._setFloorsForCurrentBuildingSelected(floors);
					if(!item.buildingSelected){
						this.$.floorSelectorComponent.selectAllChecked = true;
						this.$.floorSelectorComponent.selectAllFloors();
					}
					else if(item.buildingSelected) {
						this.$.floorSelectorComponent.highlightFloorSelection(floors);
					}
				}
				count = this.floorListSelected.filter(floor => floor.buildingId == item.buildingId).length;
				item.floorsCount = floors.length;
				item.selectedFloorCount = count;
				if (this.previousBuilding != undefined) {
					if(this.previousBuilding._id != item._id) {
						let prevIndex = this._filteredBuildingList.map(e => e._id).indexOf(this.previousBuilding._id);
						this._setFilteredBuilding(prevIndex, this.previousBuilding, false, this.previousBuilding.buildingSelected);
					}
					if(this.previousSelectedBuilding != undefined) {
						if(this.previousSelectedBuilding != undefined) {
							let prevSelIndex = this._filteredBuildingList.map(e => e._id).indexOf(this.previousSelectedBuilding._id);
							this._setFilteredBuilding(prevSelIndex, this.previousSelectedBuilding, false, this.previousSelectedBuilding.buildingSelected);
						}
					}
					this.set("previousSelectedBuilding", {...item, buildingSelected: true, selected: false})
				}
				if (!item.selected) {
					let currentIndex = this._filteredBuildingList.map(e => e._id).indexOf(item._id);
					this._setFilteredBuilding(currentIndex, item, true, true);
					item.selected = true;
					this.set("currentBuildingSelected", item);
				}
				if (!item.buildingSelected) {
					let buildingSelectedIndex = this.buildingListSelected.map(b=>b._id).indexOf(item._id);
					if(item.floorsCount != 0)
						if(buildingSelectedIndex == -1)
							this.push("buildingListSelected", item);
					else 
						this.push("_buildingWithNoFloors", item);
				}
				this._setSelectedFloorsCount();
				item.buildingSelected = true;
				this.previousBuilding = item;
			}.bind(this));
		} else {
			this.set("currentBuildingSelected", item);
			let index = this._filteredBuildingList.map(e => e._id).indexOf(item._id);
			this._setFilteredBuilding(index, item, true, true);
			this._setSelectedFloorsCount();
			item.selected = false;
			item.buildingSelected = true;
			this.previousBuilding = item;
		}
	}

	_setSelectedFloorsCount(){
		this._floorsCountOfSelectedBuilding.map(item => {
			this._filteredBuildingList.map((e, ind) => {
				if (e._id == item.id) {
					this.set("_filteredBuildingList." + ind, {...e, selectedFloorCount: item['floorsCount']});
				}
			});
		})
	}

	_handleFloorsCount(selectedFloorsCount) {
		if (this._filteredBuildingList != undefined) {
			let count = 0;
			this.floorListSelected.map(e => {
				if (this._selectedBuildingUniqueId == e.buildingId) {
					count = count + 1;
				}
			});
			let index = this._filteredBuildingList.map(e => e._id).indexOf(this._selectedBuildingId);
			this._filteredBuildingList.map(e => {
				if (this._selectedBuildingId == e._id) {
					this.set("_filteredBuildingList." + index, {...e, selectedFloorCount: count});
				}
			})
			this._selectedFloors(this._selectedBuildingId, count);
		}
	}
	
	_selectedFloors(buildingId, count) {
		var obj = { id: 0, floorsCount: 0 };
		obj['id'] = buildingId;
		obj['floorsCount'] = count;
		let index = this._floorsCountOfSelectedBuilding.map(e => e.id).indexOf(buildingId);
		if (index == -1) {
			this._floorsCountOfSelectedBuilding.push(obj);
		} else {
			this._floorsCountOfSelectedBuilding[index]['floorsCount'] = count;
		}
	}

	_removeBuildingSelection(e) {
		e.stopPropagation();
		var item = e.detail.model.item;
		if(!item.disable) {
			let buildingIndex = this._filteredBuildingList.map(e => e._id).indexOf(item._id);
			this._setFilteredBuilding(buildingIndex, item, false, false);
			if(this.previousBuilding._id == item._id || this.previousSelectedBuilding._id == item._id){
				this.$.lookupDataService.refreshFloors("").then(function (floors) {
					this._floorsForBuilding = floors;
				}.bind(this));
				this.showFloorPanel = false;
				this.previousBuilding.buildingSelected = false;
			}
			if (this.previousSelectedBuilding) {
				if (this.previousSelectedBuilding._id == item._id)
					this.previousSelectedBuilding.buildingSelected = false;
			}
			let selectedBuildingIndex = this.buildingListSelected.map(e => e._id).indexOf(item._id);
			this.splice("buildingListSelected", selectedBuildingIndex, 1);
			let length = this.floorListSelected.length;
			for (var i = 0; i < length; i++) {
				let selectedFloorIndex = this.floorListSelected.map(e => e.buildingId).indexOf(item.buildingId);
				if (selectedFloorIndex != -1) {
					this.splice("floorListSelected", selectedFloorIndex, 1);
				}
			}
			item.selected = false;
			item.buildingSelected = false;
			this.previousBuilding = item;
			this._resetBuildingSearchValue(this._buildingListSearchValue);
		}
	}

	_resetBuildingSearchValue(search) {
		this._buildingListSearchValue = null;
		this._buildingListSearchValue = search ? search : "";
	}

	_reselectSelectedBuildings(filteredBuildingList) {
		if(filteredBuildingList) {
			filteredBuildingList.forEach(function (item, index) {
				var selectedBuildingIndex, index, selIndex;
				selectedBuildingIndex = this.buildingListSelected.map(selectedBuilding => selectedBuilding._id).indexOf(item._id);
				if (selectedBuildingIndex >= 0) {
					if (this.previousSelectedBuilding) {
						selIndex = this._filteredBuildingList.map(e => e._id).indexOf(this.previousSelectedBuilding._id);
						if (!this.currentBuildingSelected.selected) selIndex = -1;
					} else {
						if (this.currentBuildingSelected) {
							if (this.currentBuildingSelected.selected)
								selIndex = this._filteredBuildingList.map(e => e._id).indexOf(this.currentBuildingSelected._id);
							else selIndex = -1;
						}
					}
					this._setFilteredBuilding(index, this.buildingListSelected[selectedBuildingIndex], (selIndex == index), true);
				} else {
					selectedBuildingIndex = this._buildingWithNoFloors.map(selectedBuilding => selectedBuilding._id).indexOf(item._id);
					if(selectedBuildingIndex != -1) 
						this._setFilteredBuilding(index, this._buildingWithNoFloors[selectedBuildingIndex], (selIndex == index), true);
				}
			}.bind(this));
			this._setSelectedFloorsCount();
		}
	}

	_observeFilteredBuildingList(filteredBuildingListChange) {
		const buildings = filteredBuildingListChange.base;
		if (buildings && buildings.length > 1) setTimeout(() => { this.$.buildingSelector.notifyResize() }, 300);
	}
	
	setInitialSelectedBuildingsFloors(initialBuildingListSelected, initialFloorListSelected) {
		this.set("initialBuildingListSelected", initialBuildingListSelected);
		this.set("initialFloorListSelected", initialFloorListSelected);
		this._setInitialSelectedBuildings(initialBuildingListSelected);
		this._setInitialSelectedFloors(initialFloorListSelected, initialBuildingListSelected);
	}

	_setInitialSelectedFloors(initialFloorListSelected, initialBuildingListSelected) {
		let floorListSelected = [];
		if(initialFloorListSelected) {
			floorListSelected = initialFloorListSelected.map(floorSelected => {
				let building = initialBuildingListSelected.filter(building => building._id == floorSelected.building.id);
				if(building.length > 0) floorSelected.buildingId = building[0].id;
				floorSelected.disable = true;
				return floorSelected;
			});
			this.set("floorListSelected", floorListSelected);
		}
	}

	_setInitialSelectedBuildings(initialBuildingListSelected) {
		let buildingListSelected = [];
		if(initialBuildingListSelected) {
			buildingListSelected = initialBuildingListSelected.map(buildingSelected => {
				buildingSelected.building = buildingSelected.name;
				buildingSelected.buildingId = buildingSelected.id;
				buildingSelected.disable = true;
				buildingSelected.selectedFloorCount = (buildingSelected.floors) ? buildingSelected.floors.length : 0;
				this._setFloorsCountForDisabledBuildings(buildingSelected);
				return buildingSelected;
			});
			this.set("buildingListSelected", buildingListSelected);
		}
	}

	_setFloorsCountForDisabledBuildings(buildingSelected) {
		this.$.lookupDataService.refreshFloors(buildingSelected._id).then(function (floors) {
			let index = this._filteredBuildingList.map(b => b._id).indexOf(buildingSelected._id);
			buildingSelected.floorsCount = floors.length;
			this._setFilteredBuilding(index, buildingSelected, false, true);
		}.bind(this));
	}

	_setFloorsForCurrentBuildingSelected(floors) {
		floors.forEach((floor,i) => {
			let selectedFloorIndex = this.floorListSelected.map(selectedFloor => selectedFloor._id).indexOf(floor._id);
			let disableFloor = (selectedFloorIndex >= 0) ? this.floorListSelected[selectedFloorIndex].disable : false;
			this.set("_floorsForBuilding."+i, {...floor, selected: (selectedFloorIndex >= 0), disable: disableFloor});
			return floor;
		})
	}

	setBuildingListScroller() {
		this.shadowRoot.querySelector("#lookupDataService").setBuildingListScroller(this._buildingListScroller);
	}

	disableBuildingLookup(disable) {
		this.shadowRoot.querySelector("#lookupDataService").disableBuildingDs(disable);
	}
}