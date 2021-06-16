/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { PaperItemBehaviorImpl, PaperItemBehavior } from "../@polymer/paper-item/paper-item-behavior.js";
import "../triplat-icon/triplat-icon.js";
import "../triblock-search-popup/triblock-image-info-card.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.details-container {
					@apply --layout-vertical;
				}
			
		</style>

		<triblock-image-info-card index="[[index]]" data="[[person]]" placeholder-icon="ibm:user" circular-image="" image-align-top="">
			<div class="details-container">
				<span class="tri-h3">[[person.name]]</span>
				<span>[[person.title]]</span>
				<span>[[person.organization]]</span>
				<span style="font-weight: bold">[[person.room]]</span>
			</div>
		</triblock-image-info-card>
	`,

    is: "tricomp-floor-directory-card",

    behaviors: [
		PaperItemBehavior
	],

    hostAttributes: {
		role: 'option',
		tabindex: '0'
	},

    properties: {
		person: {
			type: Object
		},

		index: {
			type: Number
		}
	}
});