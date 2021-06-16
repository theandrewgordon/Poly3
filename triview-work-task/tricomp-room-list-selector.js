/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/paper-input/paper-input.js";
import { TriplatQuery } from "../triplat-query/triplat-query.js";
import "../triplat-icon/ibm-icons.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-word-highlight/triplat-word-highlight.js";
import { TriValidationBehavior } from "./tribehav-validation.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-vertical;
					overflow: auto;
					padding: 10px 25px 5px 25px;
				}

				.search-input {
					--paper-input-container-input: {
						font-size: 14px;
					}
					--paper-input-container: {
						padding: 0px;
						padding-bottom: 2px;
					}
				}

				.search-input iron-icon {
					margin: 6px;
				}

				.icon-clear {
					cursor: pointer;
				}

				#roomDisplayList {
					@apply --layout-vertical;
					@apply --layout-flex;
					padding: 0;
				}

				.room-row {
					@apply --layout-vertical;
					padding: 15px 5px 15px 5px;
					cursor: pointer;
				}

				div.room-row:not([tri-current]):not([tri-selected]):hover {
					background-color: var(--ibm-neutral-4);
				}

				.room-row[index=even] {
					background-color: white;
				}

				.room-row[index=odd] {
					background-color: var(--ibm-neutral-2);
				}

				.room-row:focus {
					background-color: var(--tri-primary-content-accent-color);
				}

				.room-row[tri-selected] {
					background-color: var(--tri-primary-light-color);
				}

				.room-row[tri-current] {
					background-color: var(--tri-success-color);
					cursor: auto;
				}
			
		</style>

		<triplat-query id="spacesQuery" delay="350" filtered-data-out="{{_filteredSpaces}}">
			<triplat-query-filter name="id" operator="contains" value="[[_searchValue]]" ignore-if-blank="">
			</triplat-query-filter>
			<triplat-query-or></triplat-query-or>
			<triplat-query-filter name="space" operator="contains" value="[[_searchValue]]" ignore-if-blank="">
			</triplat-query-filter>
			<triplat-query-or></triplat-query-or>
			<triplat-query-filter name="spaceClass" operator="contains" value="[[_searchValue]]" ignore-if-blank="">
			</triplat-query-filter>
			<triplat-query-or></triplat-query-or>
			<triplat-query-filter name="people" operator="contains" value="[[_searchValue]]" ignore-if-blank="">
			</triplat-query-filter>
		</triplat-query>

		<paper-input class="search-input" placeholder="Search rooms" value="{{_searchValue}}" no-label-float="" aria-label="Search rooms" role="search">
			<iron-icon icon="ibm:search" prefix="" slot="prefix"></iron-icon>
			<iron-icon class="icon-clear" icon="ibm-glyphs:clear-input" suffix="" on-tap="_clearSearch" hidden="[[_hideClearSearchBtn]]" slot="suffix">
				
		</iron-icon></paper-input>

		<iron-list id="roomDisplayList" selection-enabled="" selected-item="{{selectedSpace}}">
			<template>
				<div class="room-row" room="[[item]]" tri-current\$="[[_isSameRoom(item, currentRoom)]]" index\$="[[_computeRowIndex(index)]]" aria-label\$="[[_computeRowAriaLabel(item)]]">
					<triplat-word-highlight class="name" value="[[item.space]]" search-value="[[_searchValue]]"></triplat-word-highlight>
					<template is="dom-repeat" items="[[item.peopleList]]" as="people">
						<triplat-word-highlight class="people" value="[[people]]" search-value="[[_searchValue]]"></triplat-word-highlight>
					</template>
					<triplat-word-highlight class="type" value="[[item.spaceClass]]" search-value="[[_searchValue]]"></triplat-word-highlight>
				</div>
			</template>
		</iron-list>
	`,

    is: "tricomp-room-list-selector",

    behaviors: [
		TriValidationBehavior
	],

    properties: {
		roomsList: {
			type: Array
		},

		selectedSpace: {
			type: Object,
			notify: true,
		},

		currentRoom: {
			type: Object
		},

		enabled: {
			type: Boolean,
			value: false
		},

		_filteredSpaces: {
			type: Array,
			observer: "_handleFilteredSpacesChanged"
		},

		_searchValue: {
			type: String,
			value: ""
		},

		_hideClearSearchBtn: {
			type: Boolean,
			computed: "_computeHideClearSearchBtn(_searchValue)"
		}
	},

    observers: [
		"_handleEnabledChanged(roomsList, enabled)"
	],

    refresh: function () {
		if (this._isValidString(this._searchValue)) {
			this._clearSearch();
		} else {
			this._refreshSelected(this.selectedSpace);
		}

	},

    _handleEnabledChanged: function (roomsList, enabled) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (enabled) {
			if (this.$.spacesQuery.data != roomsList) {
				this.$.spacesQuery.data = roomsList;
			} else if (roomsList && roomsList.length > 0) {
				this._refreshSelected(this.selectedSpace);
			}
		}
	},

    _handleFilteredSpacesChanged: function (newFilteredSpaces, oldFilteredSpaces) {
		var selected = this.selectedSpace;
		this.$.roomDisplayList.items = newFilteredSpaces;
		this._refreshSelected(selected);
	},

    _refreshSelected: function (selected) {
		var items = this.$.roomDisplayList.items;
		if (selected && items && items.indexOf(selected) >= 0) {
			this.$.roomDisplayList.selectItem(selected);
			this.$.roomDisplayList.scrollToItem(selected);
		} else {
			this.$.roomDisplayList.clearSelection();
		}
	},

    _clearSearch: function () {
		this._searchValue = "";
	},

    _computeHideClearSearchBtn: function (searchValue) {
		return searchValue == null || searchValue.length == 0;
	},

    _computeRowIndex: function (val) {
		return (val % 2 == 0) ? "even" : "odd";
	},

    _computeRowAriaLabel: function (item) {
		var __dictionary__taskRowAriaLabel1 = "This room is named";
		var __dictionary__taskRowAriaLabel2 = "with a space class of";
		return __dictionary__taskRowAriaLabel1 + " " + item.space + " " + __dictionary__taskRowAriaLabel2 + " " + item.spaceClass + ".";
	},

    _isSameRoom: function(roomA, roomB) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return roomA && roomB && roomA._id == roomB._id;
	}
});