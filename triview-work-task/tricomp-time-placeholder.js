/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.placeholder-container {
					padding: 10px;

					@apply --tricomp-time-placeholder-container;
				}
			
		</style>

		<template is="dom-if" if="[[_hasValue]]" restamp="">
			<slot></slot>
		</template>
		
		<template is="dom-if" if="[[!_hasValue]]" restamp="">
			<div class="placeholder-container">[[placeholder]]</div>
		</template>
	`,

    is: "tricomp-time-placeholder",

    properties: {
		/*
		 * Value to be verified.
		 * If no value is provided then a placeholder will be displayed.
		 */
		value: String,

		placeholder: {
			type: String,
			value: "―"
		},

		_hasValue: {
			type: Boolean,
			value: false,
			computed: "_computeHasValue(value)"
		}
	},

    _computeHasValue: function(value) {
		return value && value !== "";
	}
});