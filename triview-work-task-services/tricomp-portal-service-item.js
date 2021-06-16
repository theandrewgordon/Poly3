/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../triplat-icon/triplat-icon.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../@polymer/iron-a11y-keys/iron-a11y-keys.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					text-align: center;
					font-weight: lighter;
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.service-item-container {
					@apply --layout-self-stretch;
					@apply --layout-center;
				}

				:host(:not([small-screen-width])) .service-item-container {
					@apply --layout-horizontal;
					padding: 20px;
				}

				:host([small-screen-width]) .service-item-container {
					@apply --layout-vertical;
					padding: 5px 20px;
				}

				.service-item-container:hover {
					background-color: #325c80; /*not sure if there's an IBM color for this, none listed in style guide*/
					cursor: pointer;
				}

				iron-icon {
					width: 32px;
					height: 32px;
					flex-shrink: 0;
				}

				:host(:not([small-screen-width])) .service-title {
					font-size: 18px;
					padding-left: 10px;
				}

				:host([small-screen-width]) .service-title {
					font-size: 14px;
				}
			
		</style>

		<div class="service-item-container" id="serviceItemContainer" on-tap="_fireOnTap" tabindex="0" role="button" aria-label\$="[[label]]">
			<iron-icon icon="[[icon]]"></iron-icon>
			<div class="service-title">[[label]]</div>
		</div>
		<iron-a11y-keys id="serviceItemContainerdKeys" target="[[target]]" keys="enter" on-keys-pressed="_fireOnTap"></iron-a11y-keys>
	`,

    is: "tricomp-portal-service-item",

    behaviors: [
		TriBlockViewResponsiveBehavior
	],

    properties: {
		type: String,
		label: String,
		icon: String,

		target: {
			type: Object,
			value: function() {
				return this;
			}
		}
	},

    _fireOnTap: function() {
		this.fire('service-item-tapped', { 'serviceType': this.type })
	}
});