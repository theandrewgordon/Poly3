/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { Debouncer } from "../@polymer/polymer/lib/utils/debounce.js";
import { timeOut } from "../@polymer/polymer/lib/utils/async.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triblock-search-popup/triblock-search-popup.js";
import "../triblock-search-popup/triblock-search.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "./tricomp-person-card.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				tricomp-person-card {
					flex: 1;
				}

				/* Mixins to style to search input field from \`triblock-search\` */
				triblock-search {
					--triblock-search-margin-bottom-when-opened: var(--triapp-people-search-margin-bottom-when-opened, 200px);
					--triblock-search-paper-input: {
						@apply --triapp-people-search-paper-input;
					};
					--triblock-search-paper-input-container: {
						@apply --triapp-people-search-paper-input-container;
					};
				}
			
		</style>

		<triplat-ds id="peopleLookup"
			name="peopleLookup"
			loading="{{_peopleLookupLoading}}"
			on-ds-get-complete="_handleLookupDsGetComplete"
			manual>
			<triplat-query delay="0">
				<triplat-query-scroll-page id="peopleLookupScrollPage" scroller="{{_scroller}}" size="50" disable-auto-fetch=""></triplat-query-scroll-page>
				<triplat-query-filter id="nameQueryFilter" name="name" operator="contains"></triplat-query-filter>
				<triplat-query-sort name="name"></triplat-query-sort>
			</triplat-query>
		</triplat-ds>

		<template is="dom-if" if="[[!dropdown]]">
			<triblock-search-popup id="searchPopup" title="[[title]]" placeholder="[[placeholder]]" scroller="{{_scroller}}" search-value="{{_searchValue}}" search-result="[[_peopleLookup]]" loading="[[_peopleLookupLoading]]" on-search-item-selected="_personSelected" row-aria-label-callback="[[_computeRowAriaLabelCallback]]">
				<template>
					<tricomp-person-card data="[[item]]" search-value="[[_searchValue]]"></tricomp-person-card>
				</template>
			</triblock-search-popup>
		</template>

		<template is="dom-if" if="[[dropdown]]">
			<triblock-search id="searchField" placeholder="[[placeholder]]" scroller="{{_scroller}}" search-value="{{_searchValue}}" search-result="[[_peopleLookup]]" loading="[[_peopleLookupLoading]]" dropdown="[[dropdown]]" scroll-element-into-view="[[scrollElementIntoView]]" on-item-selected="_personSelected" row-aria-label-callback="[[_computeRowAriaLabelCallback]]">
				<template>
					<tricomp-person-card data="[[item]]" search-value="[[_searchValue]]" show-person-location="[[showPersonLocation]]" small-width="[[_smallWidth]]"></tricomp-person-card>
				</template>
			</triblock-search>
		</template>
	`,

    is: "triapp-people-search",

    behaviors: [
		TriPlatViewBehavior,
		TriBlockViewResponsiveBehavior,
		IronResizableBehavior
	],

    properties: {
		// Title message of the popup.
		title: String,
		
		// Placeholder message for the search input field.
		placeholder: String,

		// Value of the search field.
		_searchValue: {
			type: String,
			value: ""
		},

		// If true the search results will be displayed inside a dropdown
		dropdown: {
			type: Boolean,
			value: false
		},

		//  If true the search results will display the person location data
		showPersonLocation: {
			type: Boolean,
			value: false
		},

		// Indicate when the person card from the results list have a small width. 
		// This width is associated with the list width, not the screen width.
		_smallWidth: {
			type: Boolean,
			value: true
		},

		// Used to set `scroll-element-into-view` attribute for `triblock-search`
		scrollElementIntoView: {
			type: Boolean,
			value: false
		},

		_computeRowAriaLabelCallback: {
			type: Function,
			value: function() {
				return this._computeRowAriaLabel.bind(this);
			}
		},

		_lastRequestUsedNumber: {
			type: Number,
			value: -1
		},

		_requestCounter: {
			type: Number,
			value: 0
		}
	},

    observers: [
		'_observeSearchValue(_searchValue)'
	],

    listeners: {
		"iron-resize": "_setPersonCardWidth"
	},

    created: function() {
		if (!Boolean(this.modelAndView)) {
			this.set("modelAndView", "triAppPeopleSearch");
			this.set("instanceId", -1);
		}
	},

    attached: function() {
		if (this.dropdown) {
			this._setPersonCardWidth();
		}
	},

    open: function() {
		this.$$("#searchPopup").open();
	},

    close: function() {
		this.$$("#searchPopup").close();
	},

    // Calculate the if the person card has a small width
	_setPersonCardWidth: function() {
		var cardEl = this.$$("#searchField");

		if (cardEl) {
			var cardWidth = cardEl.getBoundingClientRect().width;
			var widthString = this.smallScreenMaxWidth;
			var smallScreenWidth = (widthString && widthString !== "") ? Number(widthString.replace("px", "")) : 0;

			this.set("_smallWidth", (cardWidth <= smallScreenWidth));
		}
	},

    // Observer for _searchValue
	_observeSearchValue: function(searchValue) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		// Set loading to true initially
		this._peopleLookupLoading = true;
		this.observeSearchValue = Debouncer.debounce(
			this.observeSearchValue,
			timeOut.after(300),
			() => {
				this.set('_peopleLookup', null);
				this.shadowRoot.querySelector("#peopleLookup").manual = true;
				if (!searchValue || searchValue === "") {
					// Set loading to false
					this._peopleLookupLoading = false;
				} else {
					this.refreshPeopleLookup();
				}
			}
		)
	},

    // Person selected from the search
	_personSelected: function(e) {
		e.stopPropagation();

		// Selected Person
		var selectedPerson = e.detail;

		// Fire the selected item
		this.fire("person-selected", selectedPerson);
	},

    _computeRowAriaLabel: function(item) {
		var __dictionary__taskRowAriaLabel1 = "This person is named";
		return __dictionary__taskRowAriaLabel1 + " " + item.name;
	},

	setQueryFilters() {
		return new Promise(resolve => {
			this.shadowRoot.querySelector("#nameQueryFilter").value = this._searchValue;
			setTimeout(resolve, 100);
		})
	},

	async refreshPeopleLookup() {
		const myRequestNumber = ++this._requestCounter;
		const peopleLookupDs = this.shadowRoot.querySelector("#peopleLookup");
		await this.setQueryFilters();
		const response = await peopleLookupDs.refresh();
		if (myRequestNumber > this._lastRequestUsedNumber) {
			this.set('_peopleLookup', [...response.data]);
			this._lastRequestUsedNumber = myRequestNumber;
			peopleLookupDs.manual = false;
		}
	},
	
	_handleLookupDsGetComplete(e) {
		if (!this.shadowRoot.querySelector("#peopleLookup").manual && e.detail.from !== 0) {
			this.push('_peopleLookup', ...e.detail.data);
		}
	}
});