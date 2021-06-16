/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";

export const TrimixinPeopleList = (superClass) => class extends superClass {
	static get properties() {
		return {
			selectedPeople: {
				type: Array,
				notify: true
			},

			_loadingPeople: {
				type: Boolean
			},

			_denormalizedMembers: {
				type:Array
			},

			_nonFilteredMembers: {
				type:Array
			},

			_filteredMembers: {
				type:Array,
				value: []
			},

			_memberFilters: {
				type: Array
			},

			_memberSearchFields: {
				type: Object,
				value: {}
			},

			_sortField: {
				type: String,
				value: ""
			},
	
			_sortDesc: {
				type: Boolean
			},

			_selectAll: {
				type: Boolean,
				value:false
			},

			_noPeopleFoundMessage: {
				type: String,
				value: () => {
					let __dictionary__message =  "No people are available.";
					return __dictionary__message;
				}
			}
		};
	}

	static get observers() {
		return [
			"_handleSelectedPeopleChanged(selectedPeople.*)",
			"_propagateMembersAvailabilityChanges(_nonFilteredMembers.*)",
			"_computeIsAllSelectedWhenFilteredMembersChanges(_filteredMembers.*)"
		]
	}

	_isEmpty(members) {
		return !members || members.length == 0;
	}

	_isFirst(index) {
		return index == 0;
	}

	_isNoSearchResults(nonFilteredMembers, filteredMembers) {
		return !this._isEmpty(nonFilteredMembers) && this._isEmpty(filteredMembers);
	}

	_propagateMembersAvailabilityChanges(nonFilteredMembersChanges) {
		let availabilityMatch = nonFilteredMembersChanges.path.match(/_nonFilteredMembers\.(\d+)\.availability/);
		if (availabilityMatch && availabilityMatch.length == 2) {
			let memberChanged = this._nonFilteredMembers[availabilityMatch[1]];
			let filteredMemberIndex = this._filteredMembers.findIndex(item => item._id == memberChanged._id);
			if (filteredMemberIndex >= 0) this.notifyPath(`_filteredMembers.${filteredMemberIndex}.availability`);
		}
	}

	_handleSelectedPeopleChanged(selectedPeopleChanges) {
		this._debounceHandleSelectedPeopleChanged = Debouncer.debounce(
			this._debounceHandleSelectedPeopleChanged,
			microTask,
			() => {
				this._selectAll = this._isAllSelected(this._filteredMembers, selectedPeopleChanges.base);
				this._markPeopleRecordsAsSelected(this._filteredMembers, this._nonFilteredMembers, selectedPeopleChanges.base);
			}
		);
	}

	_isAllSelected(filteredMembers, selectedPeople) {
		if (!filteredMembers || !selectedPeople) {
			return false;
		} else {
			let nonSelected = filteredMembers.filter(member => !selectedPeople.includes(member));
			return nonSelected.length == 0;
		}
	}

	_computeIsAllSelectedWhenFilteredMembersChanges(filteredMembersChanges) {
		if (filteredMembersChanges && filteredMembersChanges.path == "_filteredMembers" || filteredMembersChanges.path == "_filteredMembers.splices") {
			this._debounceHandleComputeIsAllSelectedWhenFilteredMembersChanges = Debouncer.debounce(
				this._debounceHandleComputeIsAllSelectedWhenFilteredMembersChanges,
				microTask,
				() => {
					this._selectAll = this._isAllSelected(filteredMembersChanges.base, this.selectedPeople);
				}
			);
		}
	}

	_markPeopleRecordsAsSelected(filteredMembers, nonFilteredMembers, selectedPeople) {
		if (!nonFilteredMembers) {
			return false;
		}
		selectedPeople = selectedPeople != null ? selectedPeople : [];
		nonFilteredMembers.forEach((member) => {
			member.selected = selectedPeople.includes(member);
			member._selectedTxt = member.selected ? "Y" : "N";
		});
		filteredMembers.forEach((member, index) => this.notifyPath(`_filteredMembers.${index}.selected`));
	}

	_handlePeopleSelectedChangedEvent(e) {
		if (e.detail.selected) {
			this.push("selectedPeople", e.detail.people);
		} else {
			let index = this.selectedPeople.findIndex((people) => people._id == e.detail.people._id);
			if (index >= 0) this.splice("selectedPeople", index, 1);
		}
	}

	_handleSelectAllChanged(e) {
		if (e.detail.selectAll) {
			let selectedPeopleSet = new Set(this.selectedPeople);
			this._filteredMembers.forEach(member => selectedPeopleSet.add(member));
			this.selectedPeople = Array.from(selectedPeopleSet);
		} else {
			this.selectedPeople = this.selectedPeople.filter(selected => selected._allocation || !this._filteredMembers.includes(selected));
		}
	}

	_handleAppendFiltersChanged(e) {
		let appendFilterChange = e.detail;
		if (!appendFilterChange.path) {
			this._memberFilters = appendFilterChange.value.slice();
		} else if (appendFilterChange.path == "appendFilters.splices") {
			var indexSplice = appendFilterChange.value.indexSplices[0];
			if (indexSplice.removed.length > 0) {
				this.splice("_memberFilters", indexSplice.index, indexSplice.removed.length)
			}

			for (let i = 0; indexSplice.addedCount > 0 && i < indexSplice.addedCount; i++) {
				const filter = indexSplice.object[indexSplice.index + i];
				let newFilter = Object.assign({}, filter);
				if (newFilter.name == "laborClass") {
					newFilter.name = "_laborClassesTxt";
					newFilter.operator = "contains";
				}
				this.push("_memberFilters", newFilter);
			}
		}
	}
}