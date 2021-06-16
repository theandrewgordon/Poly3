/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { triPlatDuration, TriPlatDurationBehavior } from "../triplat-duration/triplat-duration-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-block;
				}
			
		</style>

		[[_computeDuration(duration, tokens)]]
	`,

    is: "tricomp-time-duration",

    behaviors: [
		TriPlatDurationBehavior
	],

    properties: {
		duration: {
			type: Number,
			value: 0
		},
		tokens: {
			type: String,
			value: "d:h:m:s"
		}
	},

    _computeDuration: function (durationValue, tokens) {
		if (durationValue == null) {
			return "";
		}

		var displayedDuration = this.getDisplayedDuration(durationValue, tokens);
		var formatDisplayedDuration = this.formatDisplayedDuration(displayedDuration);

		return formatDisplayedDuration;
	}
});