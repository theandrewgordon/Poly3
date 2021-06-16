/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-list/iron-list.js"

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-word-highlight/triplat-word-highlight.js";

import "../../services/triservice-location-search.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompSearchResults extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-search-results"; }

	static get template() {
		return html`
			<style include="carbon-style">
				#resultsContent {
					@apply --layout-vertical;
				}

				.header {
					@apply --layout-horizontal;
					background-color: var(--carbon-ui-03);
					padding: 10px 15px
				}

				.header-text {
					@apply --layout-flex;
				}

				:host([dir="ltr"]) .header-text {
					margin-right: 5px;
				}

				:host([dir="rtl"]) .header-text {
					margin-left: 5px;
				}

				.results-list {
					padding: 5px 0;
				}

				.item {
					cursor: pointer;
					padding: 5px 15px;
					background-color: var(--carbon-field-01);
				}

				.item:hover,
				.item:focus {
					color: var(--carbon-link-01);
					outline: none;
				}
			</style>

			<triservice-location-search search-value="{{_searchValue}}"></triservice-location-search>

			<div id="resultsContent">
				<div class="header">
					<div class="header-text productive-heading-01" role="heading" aria-label\$="[[header]]" tabindex="0">[[header]] ([[totalCount]])</div>
					<dom-if if="[[_displayShowMore(partialCount, totalCount, showMore)]]" restamp>
						<template>
							<div class="link-01" on-tap="_toggleShowMore" role="button" aria-label="Show more results" tabindex="0">show more</div>
						</template>
					</dom-if>
					<dom-if if="[[showMore]]" restamp>
						<template>
							<div class="link-01" on-tap="_toggleShowMore" role="button" aria-label="Show less results" tabindex="0">back</div>
						</template>
					</dom-if>
				</div>

				<iron-list class="results-list" items="[[_results]]" role="listbox">
					<template>
						<div class="item body-short-01" on-tap="_onSelectItem" role="option" aria-label\$="[[computeTextFunction(item)]]" tabindex="0">
							<triplat-word-highlight value="[[computeTextFunction(item)]]" search-value="[[_searchValue]]"></triplat-word-highlight>
						</div>
					</template>
				</iron-list>
			</div>
		`;
	}

	static get properties() {
		return {
			header: {
				type: String
			},

			partialCount: {
				type: Number
			},

			totalCount: {
				type: Number
			},

			results: {
				type: Array
			},

			showMore: {
				type: Boolean,
				value: false,
				notify: true
			},

			computeTextFunction: {
				type: Function,
				value: function() {
					return item => item ? item.name : "";
				}
			},

			_results: {
				type: Array,
				computed: "_computeResults(partialCount, totalCount, results, showMore)"
			},

			_searchValue: {
				type: String
			}
		};
	}

	_computeResults(partialCount, totalCount, results, showMore) {
		return (totalCount <= partialCount || showMore) ? results : this._computePartialResults(results, partialCount);
	}

	_computePartialResults(items, partialCount) {
		if (items && items.length > 0 && partialCount) {
			return items.slice(0, partialCount);
		}
	}

	_displayShowMore(partialCount, totalCount, showMore) {
		return totalCount > partialCount && !showMore;
	}

	_toggleShowMore(e) {
		e.stopPropagation();
		this.showMore = !this.showMore;
	}

	_onSelectItem(e) {
		e.stopPropagation();
		if (e && e.model && e.model.item) {
			this.dispatchEvent(
				new CustomEvent(
					"item-selected", 
					{
						detail: { item: e.model.item },
						bubbles: true, composed: true
					}
				)
			);
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/location-search/tricomp-search-results.js");
	}
}

window.customElements.define(TricompSearchResults.is, TricompSearchResults);