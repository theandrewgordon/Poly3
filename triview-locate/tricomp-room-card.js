/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-icon/triplat-icon.js";
import "../triplat-word-highlight/triplat-word-highlight.js";
import "../triblock-search-popup/triblock-image-info-card.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					flex: 1;
				}

				triblock-image-info-card {
					--triblock-image-info-card-image-container: {
						border-radius: 0;
					};

					--triblock-image-info-card-placeholder-icon: {
						height: 29px;
						width: 29px;
					};
				}

				.detail * {
					margin: 0;
					font-size: 14px;
				}
				.detail h3 {
					font-weight: 400;
				}

				.room-data {
					@apply --layout-vertical;
				}
			
		</style>

		<triblock-image-info-card class="detail" data="[[data]]" placeholder-icon="ibm-glyphs:room-function" image-align-top="">
			<div class="room-data">
				<div>
					<h3><triplat-word-highlight value="[[data.roomName]]" search-value="[[searchValue]]"></triplat-word-highlight></h3>
					<template is="dom-if" if="[[data.floorName]]"><div>[[data.floorName]]</div></template>
				</div>
			</div>
		</triblock-image-info-card>
	`,

    is: "tricomp-room-card",

    properties: {
		data: Object,

		searchValue: String
	}
});