/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { Debouncer } from "../@polymer/polymer/lib/utils/debounce.js";
import { timeOut } from "../@polymer/polymer/lib/utils/async.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../triblock-search-popup/triblock-search-popup.js";
import "../triblock-search-popup/triblock-search.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { getTriServiceAssetsLookup } from "./triservice-assets-lookup.js";
import "./tricomp-asset-card.js";

class TriappAssetsSearch extends mixinBehaviors([TriBlockViewResponsiveBehavior, IronResizableBehavior], PolymerElement) {
	static get is() {
		return "triapp-assets-search";
	}

	static get template() {
		return html`
			<style include="tristyles-theme">
				tricomp-asset-card {
					flex: 1;
				}

				triblock-search {
					--triblock-search-margin-bottom-when-opened: var(
						--triapp-asset-search-margin-bottom-when-opened,
						200px
					);
					--triblock-search-paper-input: {
						@apply --triapp-asset-search-paper-input;
					}
					--triblock-search-paper-input-container: {
						@apply --triapp-asset-search-paper-input-container;
					}
					--triblock-search-results-dropdown: {
						@apply --triapp-asset-search-results-dropdown;
					}
				}
			</style>

			<triservice-assets-lookup
				asset-lookup="{{_assetLookup}}"
				asset-lookup-loading="{{_assetLookupLoading}}"
				assets-list-to-match="[[assetsListToMatch]]"
				scroller="{{_scroller}}"
				search-value="{{_searchValue}}">
			</triservice-assets-lookup>

			<triblock-search
				id="searchField"
				placeholder="[[placeholder]]"
				scroller="{{_scroller}}"
				search-value="{{_searchValue}}"
				search-result="[[_assetLookup]]"
				loading="[[_assetLookupLoading]]"
				dropdown
				scroll-element-into-view="[[scrollElementIntoView]]"
				on-item-selected="_assetSelected"
				row-aria-label-callback="[[_computeRowAriaLabelCallback]]">
				<template>
					<tricomp-asset-card
						data="[[item]]"
						search-value="[[_searchValue]]"
						show-location="[[showLocation]]"
						small-width="[[smallScreenWidth]]"
						match="[[item.match]]">
					</tricomp-asset-card>
				</template>
			</triblock-search>
		`;
	}

	static get properties() {
		return {
			title: String,
			placeholder: String,
			showLocation: {
				type: Boolean,
				value: false
			},
			scrollElementIntoView: {
				type: Boolean,
				value: false
			},
			assetsListToMatch: {
				type: Array,
			},
			_assetLookup: Array,
			_assetLookupLoading: Boolean,
			_scroller: Object,
			_searchValue: {
				type: String,
				value: ""
			},
			_computeRowAriaLabelCallback: {
				type: Function,
				value: function() {
					return this._computeRowAriaLabel.bind(this);
				}
			}
		};
	}

	static get observers() {
		return ["_observeSearchValue(_searchValue)"];
	}

	constructor() {
		super();
		this._setCardWithListener = this._setCardWidth.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("iron-resize", this._setCardWidthListener);
		if (this.dropdown) {
			this._setCardWidth();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("iron-resize", this._setCardWidthListener);
	}

	_setCardWidth() {
		var cardEl = this.$$("#searchField");

		if (cardEl) {
			var cardWidth = cardEl.getBoundingClientRect().width;
			var widthString = this.smallScreenMaxWidth;
			var smallScreenWidth =
				widthString && widthString !== ""
					? Number(widthString.replace("px", ""))
					: 0;

			this.set("_smallWidth", cardWidth <= smallScreenWidth);
		}
	}

	_observeSearchValue(searchValue) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		// set loading to true initially
		this._assetLookupLoading = true;
		this.observeSearchValue = Debouncer.debounce(
			this.observeSearchValue,
			timeOut.after(300),
			() => {
				this.set('_assetLookup', null);
				getTriServiceAssetsLookup().setAssetLookupManual(true);
				if (!searchValue || searchValue === "") {
					// Set loading to false
					this._assetLookupLoading = false;
				} else {
					getTriServiceAssetsLookup().refreshAssetLookup();
				}
			}
		)
	}

	_assetSelected(e) {
		e.stopPropagation();
		var selectedAsset = e.detail;
		this.dispatchEvent(
			new CustomEvent("asset-selected", {
				detail: { asset: selectedAsset},
				bubbles: true,
				composed: true
			})
		);
	}

	_computeRowAriaLabel(item) {
		var __dictionary__rowAriaLabel1 = "This asset is named";
		return __dictionary__rowAriaLabel1 + " " + item.name;
	}

	clearSearch() {
		this.shadowRoot.querySelector("#searchField").clearSearch();
	}
}

window.customElements.define(TriappAssetsSearch.is, TriappAssetsSearch);
