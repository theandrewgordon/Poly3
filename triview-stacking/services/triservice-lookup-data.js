/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import "../../triplat-ds/triplat-ds.js";
import "../../triplat-query/triplat-query.js";

import { TrimixinService } from "./trimixin-service.js";

class TriServiceLookupData extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-lookup-data"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="buildingSearch" name="buildingList" loading="{{_loadingBuildingList}}" filtered-data="{{filteredBuildingList}}">
						<triplat-query>
							<triplat-query-scroll-page id="buildingListQueryScroll" scroller="[[buildingListScroller]]" size="10" disable-auto-fetch threshold="20">
							</triplat-query-scroll-page>
							<triplat-query-filter name="building" operator="contains" value="{{buildingListSearchValue}}" ignore-if-blank>
							</triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="address" operator="contains" value="{{buildingListSearchValue}}" ignore-if-blank>
							</triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="city" operator="contains" value="{{buildingListSearchValue}}" ignore-if-blank>
							</triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="state" operator="contains" value="{{buildingListSearchValue}}" ignore-if-blank>
							</triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="country" operator="contains" value="{{buildingListSearchValue}}" ignore-if-blank>
							</triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="property" operator="contains" value="{{buildingListSearchValue}}" ignore-if-blank>
							</triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter name="status" operator="contains" value="{{buildingListSearchValue}}" ignore-if-blank>
							</triplat-query-filter>
							<triplat-query-sort name="building"></triplat-query-sort>
						</triplat-query>
					</triplat-ds>

					<triplat-ds id="floorListChildDS" name="floorList" data="{{floorsForBuilding}}" loading="{{_loadingFloorsForBuilding}}" manual>
						<triplat-ds-context id="floorListChildDSContext" name="buildingList"></triplat-ds-context>
					</triplat-ds>

					<triplat-ds id="orgAllocTypesDs" name="orgAllocTypes" data="{{orgAllocTypes}}" loading="{{_loadingOrgAllocTypes}}"></triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			filteredBuildingList: {
				type: Array,
				notify: true
			},

			buildingListSearchValue: {
				type: String,
				notify: true,
				value: ""
			},

			buildingListScroller: {
				type: Object,
				notify: true
			},

			floorsForBuilding: {
				type: Array,
				notify: true
			},

			orgAllocTypes: {
				type: Array,
				notify: true
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingBuildingList: {
				type: Boolean,
				value: false
			},

			_loadingFloorsForBuilding: {
				type: Boolean,
				value: false
			},

			_loadingOrgAllocTypes: {
				type: Array,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingBuildingList, _loadingFloorsForBuilding, _loadingOrgAllocTypes)"
		]
	}

	_resetBuildingListScroller() {
		this.shadowRoot.querySelector("#buildingListQueryScroll").scroller = null;
		this.shadowRoot.querySelector("#buildingListQueryScroll").scroller = this.buildingListScroller;
	}

	disableBuildingDs(disable) {
		if (this._isRootInstance) {
			let buildingSearchDS = this.shadowRoot.querySelector("#buildingSearch");
			if (buildingSearchDS) {
				this._resetBuildingListScroller();
				buildingSearchDS.disable = disable;
				if (disable) {
					this.shadowRoot.querySelector("#buildingListQueryScroll").scroller = null;
					buildingSearchDS.data = [];
				}
			}
		} else {
			return this._rootInstance.disableBuildingDs(disable);
		}
	}

	refreshFloors(buildingContextId) {
		if (this._isRootInstance) {
			var floorListChildDSContext = this.shadowRoot.querySelector("#floorListChildDSContext");
			if (buildingContextId) {
				floorListChildDSContext.contextId = buildingContextId;
				return this.shadowRoot.querySelector("#floorListChildDS").refresh()
					.then(function(f) {
						return f.data;
					}.bind(this))
					.catch(function(error) {
						return Promise.reject(error);
					}.bind(this));
			} else {
				return Promise.resolve(this.floorsForBuilding);
			}
		} else {
			return this._rootInstance.refreshFloors(buildingContextId);
		}
	}

	setBuildingListScroller(scroller) {
		if (this._isRootInstance) {
			this.set("buildingListScroller", scroller);
		} else {
			return this._rootInstance.setBuildingListScroller(scroller);
		}
	}
};

window.customElements.define(TriServiceLookupData.is, TriServiceLookupData);
