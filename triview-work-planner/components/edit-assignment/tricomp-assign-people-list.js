/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-search-input/triplat-search-input.js";
import "../../../triplat-query/triplat-query.js";
import "../../styles/tristyles-work-planner.js";
import "../../services/triservice-people.js";
import { TrimixinPeopleList } from "../people-list/trimixin-people-list.js";
import "../people-list/tricomp-people-card.js";
import "../people-list/tricomp-people-sort-header.js";

class TricompAssignPeopleList extends TrimixinPeopleList(PolymerElement) {
	static get is() { return "tricomp-assign-people-list"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				tricomp-people-card[first] {
					margin-top: 0px;
				}

				.message-placeholder {
					height: 80px;
				}

				.list-container {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.list {
					@apply --layout-vertical;
					@apply --layout-flex;
					overflow-y: auto;
				}
			</style>
		
			<triservice-people id="peopleService" people-to-assign="{{_nonFilteredMembers}}" loading="{{_loadingPeople}}" 
				denormalized-people-to-assign="{{_denormalizedMembers}}" member-search-fields="{{_memberSearchFields}}">
			</triservice-people>

			<triplat-query append-filters="[[_memberFilters]]" data="[[_nonFilteredMembers]]" filtered-data-out="{{_filteredMembers}}">
				<triplat-query-sort name="[[_sortField]]" desc="[[_sortDesc]]"></triplat-query-sort>
			</triplat-query>

			<triplat-search-input id="searchInput"
				class="search-input"
				placeholder="Search"
				data="[[_denormalizedMembers]]"
				aliases="[[_memberSearchFields]]"
				on-append-filters-changed="_handleAppendFiltersChanged"
				search-icon-precede
				scroll-element-into-view>
			</triplat-search-input>

			<dom-if if="[[_isEmpty(_nonFilteredMembers)]]">
				<template>
					<div class="message-placeholder" hidden\$="[[_loadingPeople]]">
						<div aria-label\$="[[_noPeopleToAssignMessage]]" tabindex="0" aria-live="polite">[[_noPeopleToAssignMessage]]</div>
					</div>
				</template>
			</dom-if>

			<dom-if if="[[_isNoSearchResults(_nonFilteredMembers, _filteredMembers)]]">
				<template>
					<div class="message-placeholder" hidden\$="[[_loadingPeople]]">
						<div aria-label\$="[[_noPeopleFoundMessage]]" tabindex="0" aria-live="polite">[[_noPeopleFoundMessage]]</div>
					</div>
				</template>
			</dom-if>
			
			<div class="list-container" hidden$="[[_isEmpty(_filteredMembers)]]">
				<tricomp-people-sort-header id="peopleSortHeader" class="people-sort-header"
					sort-field="{{_sortField}}" sort-desc="{{_sortDesc}}" select-all="[[_selectAll]]"
					on-select-all-changed-by-user="_handleSelectAllChanged">
				</tricomp-people-sort-header>

				<div class="list">
					<dom-repeat items="[[_filteredMembers]]">
						<template>
							<tricomp-people-card people="[[item]]" hide-expand-button no-drop enable-selection first\$="[[_isFirst(index)]]"
								selected="[[item.selected]]" on-people-selected-changed="_handlePeopleSelectedChangedEvent">
							</tricomp-people-card>
						</template>
					</dom-repeat>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			startDate: {
				type:String
			},

			endDate: {
				type:String
			},

			opened: {
				type: Boolean,
				value: false
			},

			_noPeopleToAssignMessage: {
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
			"_refreshPeopleToAssignAvailability(startDate, endDate, opened)"
		]
	}

	refresh() {
		this.selectedPeople = [];
		this.$.searchInput.clearSearch();
		this.$.peopleSortHeader.reset();
		this.$.peopleService.refreshPeopleToAssign();
	}

	_refreshPeopleToAssignAvailability(startDate, endDate, opened) {
		if (opened) this.$.peopleService.refreshPeopleToAssignAvailability(startDate, endDate);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/edit-assignment/tricomp-assign-people-list.js");
	}
}

window.customElements.define(TricompAssignPeopleList.is, TricompAssignPeopleList);