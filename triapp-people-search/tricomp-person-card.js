/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-image/triplat-image.js";
import "../triplat-icon/triplat-icon.js";
import "../triblock-responsive-layout/triblock-responsive-layout.js";
import "../triplat-word-highlight/triplat-word-highlight.js";
import "../triblock-search-popup/triblock-image-info-card.js";

Polymer({
    _template: html`
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

				.person-data {
					@apply --layout-vertical;
				}
				:host(:not([small-width])) .person-data {
					@apply --layout-horizontal;
				}
				:host(:not([small-width])) .person-data > div {
					flex: 1;
				}
			
		</style>

		<triblock-image-info-card id="infoCard" class="detail" data="[[data]]" placeholder-icon="ibm:user" image-width="[[imageWidth]]" image-height="[[imageHeight]]" circular-image="" image-align-top="">
			<div class="person-data">
				<div>
					<h3><triplat-word-highlight value="[[data.name]]" search-value="[[searchValue]]"></triplat-word-highlight></h3>
					<template is="dom-if" if="[[data.title]]"><div>[[data.title]]</div></template>
					<template is="dom-if" if="[[data.organization]]"><div>[[data.organization]]</div></template>
				</div>

				<template is="dom-if" if="[[_showLocation(showPersonLocation, data.building.value, data.buildingCity, data.floor)]]">
					<div>
						<template is="dom-if" if="[[data.building.value]]"><div>[[data.building.value]]</div></template>
						<template is="dom-if" if="[[data.buildingCity]]">
							<div>
								[[data.buildingCity]]<template is="dom-if" if="[[data.buildingState]]">, [[data.buildingState]]</template><template is="dom-if" if="[[data.buildingCountry]]">, [[data.buildingCountry]]</template>
							</div>
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
	`,

    is: "tricomp-person-card",

    properties: {
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

		showPersonLocation: {
			type: Boolean,
			value: false
		},

		smallWidth: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		}
	},

    _showLocation: function(showLocation, building, city, floor) {
		return showLocation && (building || city || floor);
	}
});