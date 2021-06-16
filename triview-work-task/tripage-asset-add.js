/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import {
	PolymerElement,
	html
} from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";

import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triblock-popup/triblock-popup.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "../triapp-assets-search/triapp-assets-search.js";
import "./triservice-asset.js";
import "./triservice-procedure.js";
import { TriroutesTask } from "./triroutes-task.js";

class TriPageAssetAdd extends mixinBehaviors(
	[TriComputeLoadingBehavior, TriDirBehavior],
	PolymerElement
) {
	static get is() {
		return "tripage-asset-add";
	}

	static get template() {
		return html`
			<style include="work-task-shared-page-styles work-task-popup tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				:host([small-layout]) {
					padding: 0px;
				}

				.content {
					@apply --layout-vertical;
				}

				:host([small-layout]) .content {
					padding: 10px 20px;
				}

				triblock-popup {
					width: 600px;
					height: 600px;
				}

				@media (max-height: 400px) {
					triblock-popup {
						top: 0px;
						bottom: 0px;
					}

					.popup-content {
						max-height: 100%;
						overflow-y: auto;
					}
				}

				triapp-assets-search {
					--triapp-assets-search-paper-input: {
						border: 1px solid var(--ibm-gray-30);
					}

				}

				:host(:not([small-layout])) triapp-assets-search {
					--triapp-asset-search-results-dropdown: {
						max-height: 460px;
					}
				}

				.search-header {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.search-asset-help {
					@apply --layout-flex;
				}

				:host([small-layout]) .search-asset-help {
					padding: 5px 10px 0px;
				}

			</style>

			<triservice-asset id="assetService" asset-lookup-search="{{_assetLookupSearch}}"></triservice-asset>
			<triservice-procedure id="procedureService"></triservice-procedure>

			<triplat-route
				name="taskAssetAdd"
				on-route-active="_onRouteActive"
				active="{{opened}}"
			></triplat-route>

			<triblock-popup
				id="assetAddPopup"
				with-backdrop
				modal
				on-iron-overlay-canceled="_historyBack"
				aria-label="Add Asset"
				small-screen-width="[[smallLayout]]"
				disable-screen-size-detection
			>
				<div class="popup-content">
					<template is="dom-if" if="[[readonly]]">
						<div class="message-placeholder">
							<div>This search is not available.</div>
						</div>
					</template>
					<template is="dom-if" if="[[!readonly]]">
						<triplat-loading-indicator
							class="loading-indicator"
							show="[[_loading]]"
						></triplat-loading-indicator>
						<div class="search-header">
							<span class="search-asset-help secondary-text">A green check mark indicates that the asset is associated to the work task.</span>
							<tricomp-code-scanner-buttons
								on-start-bar-code-scan="_startBarCodeScan"
								on-start-qr-code-scan="_startQrCodeScan">
							</tricomp-code-scanner-buttons>
						</div>
						<triapp-assets-search
							id="assetsSearch"
							placeholder="[[_searchPlaceholder]]"
							show-location
							on-asset-selected="_handleAssetSelected"
							assets-list-to-match="[[assets]]">
							</triapp-assets-search>
					</template>
				</div>
			</triblock-popup>
		`;
	}

	static get properties() {
		return {
			smallLayout: {
				type: Boolean,
				notify: true,
				reflectToAttribute: true
			},

			_searchPlaceholder: {
				type: String
			},

			taskId: String,

			assets: Array,

			_assetLookupSearch: {
				type: String
			},

			readonly: Boolean

		};
	}

	constructor() {
		super();
		const __dictionary__searchPlaceholder = "Search by name, ID, or barcode number";
		this.set('_searchPlaceholder', __dictionary__searchPlaceholder);
	}

	_onRouteActive(e) {
		const assetAddPopup = this.shadowRoot.querySelector("#assetAddPopup");
		if (e.detail.active) {
			if (this._assetLookupSearch) {
				this._doRefreshAssetLookup(this._assetLookupSearch);
			} else {
				afterNextRender(this, function() {
					assetAddPopup.openPopup();
				})
			}
		} else {
			const assetsSearch = this.shadowRoot.querySelector("#assetsSearch");
			if (assetsSearch) {
				assetsSearch.clearSearch();
			}
			assetAddPopup.closePopup();
		}
	}

	_historyBack() {
		window.history.back();
	}

	_handleAssetSelected(e) {
		e.stopPropagation();
		const selectedAsset = e.detail.asset;
		if (selectedAsset) {
			const assetExistingFound = this.assets.some(asset => asset._id === selectedAsset._id);
			if (assetExistingFound) {
				const __dictionary__assetAlreadyAdded = "Asset already added."
				this.dispatchEvent(new CustomEvent("work-task-alert", { detail: { type: "warning", text: __dictionary__assetAlreadyAdded }, bubbles: true, composed: true}));
			} else {
				const assetService = this.$.assetService;
				assetService.addAssetToTask(this.taskId, selectedAsset).then(async () => {
					const __dictionary__assetSuccessfullyAdded = "Asset added.";
					this.dispatchEvent(new CustomEvent("work-task-alert", { detail: { type: "success", text: __dictionary__assetSuccessfullyAdded }, bubbles: true, composed: true}));
					this.$.procedureService.refreshTaskProcedures(this.taskId, true);
				});
			}
			if (!e.detail.fromScan) {
				this._historyBack();
			}
		}
	}

	_startBarCodeScan(e) {
		e.stopPropagation();
		TriroutesTask.getInstance().openTaskDetailBarCodeScan();
	}

	_startQrCodeScan(e) {
		e.stopPropagation();
		TriroutesTask.getInstance().openTaskDetailQrCodeScan();
	}

	_doRefreshAssetLookup(assetLookupSearch) {
		const assetService = this.$.assetService;
		assetService.refreshAssetLookup(assetLookupSearch).then(results => {
			if (results && results.data.length > 0) {
				this._handleAssetSelected(new CustomEvent('', { detail: { asset: results.data[0], fromScan: true }}));
			} else {
				const __dictionary__assetNotFound = "Asset not found."
				this.dispatchEvent(new CustomEvent("work-task-alert", { detail: { type: "error", text: __dictionary__assetNotFound }, bubbles: true, composed: true}));
			}
			
			this._assetLookupSearch = "";
			this._historyBack();
		})
	}
}

window.customElements.define(TriPageAssetAdd.is, TriPageAssetAdd);
