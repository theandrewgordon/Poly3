/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";
import "../triplat-image/triplat-image.js";
import "../triplat-icon/triplat-icon.js";
import "../triplat-icon/ibm-icons.js";
import "../triplat-word-highlight/triplat-word-highlight.js";
import "../triblock-search-popup/triblock-image-info-card.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

class TriCompAssetCard extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() {
		return "tricomp-asset-card";
	}

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					flex: 1;
				}

				.detail * {
					margin: 0;
					font-size: 14px;
				}
				.detail h3 {
					font-weight: 400;
				}

				.data {
					@apply --layout-vertical;
				}
				:host(:not([small-width])) .data {
					@apply --layout-horizontal;
				}
				:host(:not([small-width])) .data > div {
					flex: 1;
				}
				:host(:not([small-width])[dir=ltr]) .data > div:first-child {
					margin-right: 20px;
				}

				:host(:not([small-width])[dir=rtl]) .data > div:first-child {
					margin-left: 20px;
				}
				.match-icon {
					--triplat-icon-fill-color: var(--ibm-green-50);
					position: absolute;
					height: 24px;
					width: 24px;
					z-index: 2;
				}

				:host([dir=ltr]) .match-icon {
					top: 10px;
					left: 45px;
				}

				:host([dir=rtl]) .match-icon {
					top: 10px;
					right: 45px;
					transform: scaleX(-1);
				}
				
			</style>

			<template is="dom-if" if="[[match]]">
				<triplat-icon class="match-icon" icon="ibm:ready"></triplat-icon>
			</template>
			<triblock-image-info-card
				id="infoCard"
				class="detail"
				data="[[data]]"
				placeholder-icon="ibm:assets"
				image-width="[[imageWidth]]"
				image-height="[[imageHeight]]"
				circular-image
				image-align-top>
				<div class="data">
					<div>
						<h3>
							<triplat-word-highlight
								value="[[data.id]]"
								search-value="[[searchValue]]">
							</triplat-word-highlight>
							<span> - </span>
							<triplat-word-highlight
								value="[[data.name]]"
								search-value="[[searchValue]]">
							</triplat-word-highlight>
						</h3>
						<template is="dom-if" if="[[data.type]]">
							<div>[[data.type]]</div>
						</template>
						<template is="dom-if" if="[[data.organization]]">
							<div>[[data.organization]]</div>
						</template>
					</div>

					<template is="dom-if" if="[[_showLocation(showLocation, data.building.value, data.floor)]]">
						<div>
							<template is="dom-if" if="[[data.building.value]]">
								<div>[[data.building.value]]</div>
							</template>
							<template is="dom-if" if="[[data.floor.value]]">
								<div>
									[[data.floor.value]]<template is="dom-if" if="[[data.space]]"> - [[data.space]]</template>
								</div>
							</template>
						</div>
					</template>
				</div>
			</triblock-image-info-card>
		`;
	}

	static get properties() {
		return {
			data: Object,

			imageHeight: {
				type: Number,
				value: 50
			},

			imageWidth: {
				type: Number,
				value: 50
			},

			searchValue: String,

			showLocation: {
				type: Boolean,
				value: false
			},

			smallWidth: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			match: Boolean
		};
	}

	_showLocation(showLocation, building, floor) {
		return showLocation && (building || floor);
	}
}

window.customElements.define(TriCompAssetCard.is, TriCompAssetCard);