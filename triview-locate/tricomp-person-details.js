/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-icon/triplat-icon.js";
import "../@polymer/iron-icon/iron-icon.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../triblock-search-popup/triblock-image-info-card.js";
import { TriLocateAppUtilsBehavior } from "./tribehav-locate-app-utils.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				triblock-image-info-card {
					background-color: var(--ibm-neutral-2);
					border: 1px solid var(--ibm-gray-10);
					padding: 20px;
					@apply --layout-flex;
					@apply --layout-horizontal;
					--triblock-image-info-card-image-container: {
						height: 70px;
						width: 70px;
					};
					--triblock-image-info-card-placeholder-icon: {
						height: 54px;
						width: 54px;
					};
					--triblock-image-info-card-detail-container: {
						@apply --layout-horizontal;
						padding: 0 0 0 20px;
					}
				}

				triblock-image-info-card > ::slotted(#horizontal) {
					@apply --layout-flex;
				}

				:host([small-screen-width]) triblock-image-info-card {
					border-left: none;
					border-right: none;
					padding: 15px;
				}

				.container {
					@apply --layout-horizontal;
					flex: 1;
				}

				:host(:not([small-screen-width])) .details-container {
					@apply --layout-flex;
					@apply --layout-horizontal;
				}

				:host([small-screen-width]) .details-container {
					@apply --layout-vertical;
				}

				.details {
					@apply --layout-vertical;
				}

				:host(:not([small-screen-width])) .details {
					@apply --layout-flex;
				}

				:host(:not([small-screen-width])) .details-padding {
					padding-right: 20px;
				}

				:host([small-screen-width]) .details-padding {
					padding-bottom: 15px;
				}

				:host(:not([small-screen-width])) .floor-room {
					padding-top: 14px;
				}

				.contact-link {
					white-space: nowrap;
				}

				:host(:not([small-screen-width])) .contact-link:not(:last-of-type) {
					padding-bottom: 6px;
				}

				:host([small-screen-width]) .contact-link:not(:last-of-type) {
					padding-right: 14px;
					padding-bottom: 10px;
				}

				:host([small-screen-width]) .contact {
					@apply --layout-wrap;
					@apply --layout-horizontal;
				}

				.contact-icon {
					height: 18px;
				}

				.contact-link-text {
					padding-left: 7px;
				}
			
		</style>

		  <triblock-image-info-card data="[[personDetails]]" placeholder-icon="ibm:user" image-width="[[_imageLength]]" image-height="[[_imageLength]]" circular-image="" image-align-top="">  
				<div class="details-container">
					<div class="details details-padding name-title">
						<span class="tri-h3">[[personDetails.name]]</span>
						<span>[[personDetails.title]]</span>
						<span>[[personDetails.organization]]</span>
					</div>
					<div class\$="[[_computeBuildingDetailsClass(_hasContactInfo)]]">
						<span>[[personDetails.building.value]]</span>
						<span>
							[[personDetails.buildingCity]]<template is="dom-if" if="[[personDetails.buildingState]]">,&nbsp;[[personDetails.buildingState]]</template><template is="dom-if" if="[[personDetails.buildingCountry]]">,&nbsp;[[personDetails.buildingCountry]]</template>
						</span>
						<span class="floor-room">
							[[personDetails.floor.value]]<template is="dom-if" if="[[personDetails.room]]">&nbsp;|&nbsp;<span style="font-weight: bold">[[personDetails.room]]</span></template>
						</span>
					</div>
					<div class="details contact">
						<template is="dom-if" if="[[_isValidString(personDetails.workPhone)]]">
							<a href="tel:[[personDetails.workPhone]]" class="contact-link">
								<iron-icon icon="ibm-glyphs:phone-call" class="contact-icon"></iron-icon><span class="contact-link-text">[[personDetails.workPhone]]</span>
							</a>
						</template>
						<template is="dom-if" if="[[_isValidString(personDetails.mobilePhone)]]">
							<a href="tel:[[personDetails.mobilePhone]]" class="contact-link">
								<iron-icon icon="ibm:mobile" class="contact-icon"></iron-icon><span class="contact-link-text">[[personDetails.mobilePhone]]</span>
							</a>
						</template>
						<template is="dom-if" if="[[_isValidString(personDetails.email)]]">
							<a href="mailto:[[personDetails.email]]" class="contact-link">
								<iron-icon icon="ibm:email" class="contact-icon"></iron-icon><span class="contact-link-text">[[personDetails.email]]</span>
							</a>
						</template>
					</div>
				</div>
		  </triblock-image-info-card>  
	`,

    is: "tricomp-person-details",

    behaviors: [
		TriBlockViewResponsiveBehavior,
		TriLocateAppUtilsBehavior
	],

    properties: {
		personDetails: Object,
		_imageLength: {
			type: String,
			value: 70
		},
		_hasContactInfo: {
			type: Boolean,
			value: false,
			computed: '_computeHasContactInfo(personDetails.workPhone, personDetails.mobilePhone, personDetails.email)'
		}
	},

    _computeHasContactInfo(workPhone, mobilePhone, email) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return this._isValidString(workPhone) || this._isValidString(mobilePhone) || this._isValidString(email);
	},

    _computeBuildingDetailsClass: function(hasContactInfo) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return hasContactInfo ? "details details-padding" : "details";
	}
});