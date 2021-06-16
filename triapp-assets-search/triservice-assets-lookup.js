/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";
import { TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import "../triplat-ds/triplat-ds.js";
import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriServiceAssetsLookup() {
	return getService(TriServiceAssetsLookup.is);
}

class TriServiceAssetsLookup extends mixinBehaviors([TriPlatViewBehavior], TrimixinService(PolymerElement)) {
	static get is() {
		return "triservice-assets-lookup";
	}

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds
						id="assetLookup"
						name="assetLookup"
						loading="{{assetLookupLoading}}"
						on-ds-get-complete="handleLookupDsGetComplete"
						manual>
						<triplat-query delay="0">
							<triplat-query-scroll-page
								id="assetLookupScrollPage"
								scroller="{{scroller}}"
								size="50"
								disable-auto-fetch
							></triplat-query-scroll-page>
							<triplat-query-filter
								id="nameQueryFilter"
								name="name"
								operator="contains"
								ignore-if-blank
							></triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter
								id="idQueryFilter"
								name="id"
								operator="contains"
								ignore-if-blank
							></triplat-query-filter>
							<triplat-query-or></triplat-query-or>
							<triplat-query-filter
								id="barcodeQueryFilter"
								name="barcode"
								operator="contains"
								ignore-if-blank
							></triplat-query-filter>
							<triplat-query-sort
								name="name"
							></triplat-query-sort>
						</triplat-query>
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	constructor() {
		super();
		if (!Boolean(this.modelAndView)) {
			this.set("modelAndView", "triAppAssetsSearch");
			this.set("instanceId", -1);
		}
	}

	static get properties() {
		return {
			assetLookup: {
				type: Array,
				notify: true
			},
			
			assetLookupLoading: {
				type: Boolean,
				notify: true
			},

			assetsListToMatch: {
				type: Array,
				notify: true,
				// observer: 'handleAssetsListToMatchSet'
			},
			
			online: {
				type: Boolean
			},

			scroller: {
				type: Object,
				notify: true
			},

			searchValue: {
				type: String,
				notify: true
			},

			_lastRequestUsedNumber: {
				type: Number,
				value: -1
			},

			_requestCounter: {
				type: Number,
				value: 0
			}
		};
	}

	setAssetLookupManual(enable) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#assetLookup").manual = enable;
		} else {
			return this._rootInstance.setAssetLookupManual(enable);
		}
	}

	handleLookupDsGetComplete(e) {
		if (this._isRootInstance) {
			const assetLookup = this.shadowRoot.querySelector("#assetLookup");
			if (assetLookup && !assetLookup.manual && e.detail.data && e.detail.from !== 0) {
				const start = e.detail.from;
				this.push('assetLookup', ...e.detail.data);
				this._matchAssets(this.assetsListToMatch, start);
			}
		} else {
			return this._rootInstance.handleLookupDsGetComplete(e);
		}
	}

	_matchAssets(assetsListToMatch, start) {
		if (assetsListToMatch && assetsListToMatch.length > 0 && this.assetLookup && this.assetLookup.length > 0) {
			const assetLookupLength = this.assetLookup.length;
			for (let i = start; i < assetLookupLength; i++) {
				const asset = this.assetLookup[i];
				asset.match = assetsListToMatch.some((assetToMatch => assetToMatch._id === asset._id));
			}
		}
	}

	handleAssetsListToMatchSet(assetsListToMatch) {
		if (this._isRootInstance) {
			if (assetsListToMatch && assetsListToMatch.length > 0) {
				this._matchAssets(assetsListToMatch, 0);
			}
		} else {
			return this._rootInstance.handleAssetsListToMatchSet(assetsListToMatch);
		}
	}

	setQueryFilters() {
		return new Promise(resolve => {
			this.shadowRoot.querySelector("#nameQueryFilter").value = this.searchValue;
			this.shadowRoot.querySelector("#idQueryFilter").value = this.searchValue;
			this.shadowRoot.querySelector("#barcodeQueryFilter").value = this.searchValue;
			setTimeout(resolve, 100);
		})
	}

	async refreshAssetLookup() {
		const myRequestNumber = ++this._requestCounter;
		const assetLookupDs = this.shadowRoot.querySelector("#assetLookup");
		await this.setQueryFilters();
		const response = await assetLookupDs.refresh();
		if (myRequestNumber > this._lastRequestUsedNumber) {
			this.set('assetLookup', [...response.data]);
			this._matchAssets(this.assetsListToMatch, 0);
			this._lastRequestUsedNumber = myRequestNumber;
			assetLookupDs.manual = false;
		}
	}
}

window.customElements.define(TriServiceAssetsLookup.is, TriServiceAssetsLookup);
