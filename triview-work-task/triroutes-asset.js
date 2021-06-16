/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import {
	PolymerElement,
	html
} from "../@polymer/polymer/polymer-element.js";
import "../triplat-routing/triplat-route.js";
import { getService, TrimixinService } from "./trimixin-service.js";

export function getTriRoutesAsset() {
	return getService(TriRoutesAsset.is);
};

class TriRoutesAsset extends TrimixinService(PolymerElement) {
	static get is() {
		return "triroutes-asset";
	}

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-route id="taskAssetHomeRoute" name="taskAssetHome" path="/" on-route-active="_onAssetHomeRouteActive"></triplat-route>
					<triplat-route id="taskAssetAddRoute" name="taskAssetAdd" path="/add" on-route-active="_onAssetAddRouteActive" active="{{addRouteActive}}"></triplat-route>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			addRouteActive: {
				type: Boolean,
				notify: true
			}
		}
	}

	openTaskAssetAdd() {
		this.shadowRoot.querySelector("#taskAssetHomeRoute").navigate();
		this.shadowRoot.querySelector("#taskAssetAddRoute").navigate();
	}

	_onAssetHomeRouteActive(e) {
		e.stopPropagation();
		if (e.detail.active) {
			var __dictionary__AssetPageLabel = "Assets";
			this.dispatchEvent(new CustomEvent("route-changed", {
				detail: { active: e.detail.active, pageLabel: __dictionary__AssetPageLabel, hasBackButton: true },
				bubbles: true,
				composed: true
			}))
		}
	}

	_onAssetAddRouteActive(e) {
		e.stopPropagation();
		if (e.detail.active) {
			var __dictionary__AddAssetPageLabel = "Add Asset";
			this.dispatchEvent(new CustomEvent("route-changed", {
				detail: { active: e.detail.active, pageLabel: __dictionary__AddAssetPageLabel, hasBackButton: true },
				bubbles: true,
				composed: true
			}))
		}
	}
}

window.customElements.define(TriRoutesAsset.is, TriRoutesAsset);