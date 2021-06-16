/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import "../triplat-document/triplat-document.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host(:not([small-screen-width])) {
					@apply --layout-horizontal;
					@apply --layout-wrap;
				}
				:host([small-screen-width]) {
					@apply --layout-vertical;
				}

				:host(:not([small-screen-width])) triplat-document-download {
					flex-basis: 50%;
				}
			
		</style>

		<template is="dom-repeat" items="[[documents]]" as="document">
			<triplat-document-download document-id="[[document._id]]" document-name="[[document.name]]" document-file-name="[[document.fileName]]" disabled="[[!online]]">
			</triplat-document-download>
		</template>
	`,

    is: "triapp-document-list",

    behaviors: [ 
		TriBlockViewResponsiveBehavior
	],

    properties: {
		documents: {
			type: Array
		},

		online: {
			type: Boolean,
			value: true
		}
	}
});