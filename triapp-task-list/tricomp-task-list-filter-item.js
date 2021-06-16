/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { PaperItemBehaviorImpl, PaperItemBehavior } from "../@polymer/paper-item/paper-item-behavior.js";
import { TriPlatAccessibilityBehavior } from "../triplat-accessibility-behavior/triplat-accessibility-behavior.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-horizontal;
					@apply --layout-center-center;
					background-color: transparent;
					margin: 0;
					min-width: 110px;
				}

				:host(:hover) {
					cursor: pointer;
				}

				:host(:not([small-layout])) {
					text-align: center;
					color: var(--ibm-blue-70);
					padding: 5px 15px;
					border: 1px solid var(--ibm-blue-70);
				}

				:host([dir="ltr"]:not([small-layout]):not(:last-of-type)) {
					border-right: none;
				}

				:host([dir="ltr"]:not([small-layout]):first-of-type) {
					border-radius: 10px 0 0 10px;
				}

				:host([dir="ltr"]:not([small-layout]):last-of-type) {
					border-radius: 0 10px 10px 0;
				}

				:host([dir="rtl"]:not([small-layout]):not(:last-of-type)) {
					border-left: none;
				}

				:host([dir="rtl"]:not([small-layout]):first-of-type) {
					border-radius: 0 10px 10px 0;
				}

				:host([dir="rtl"]:not([small-layout]):last-of-type) {
					border-radius: 10px 0 0 10px;
				}

				:host(:not([small-layout])):hover {
					background-color: var(--tri-primary-color);
					color: white;
					cursor: pointer;
				}

				:host(:not([small-layout]).iron-selected) {
					background-color: var(--ibm-blue-70);
					color: white;
				}
			
		</style>

		[[label]]
	`,

    is: "tricomp-task-list-filter-item",

    behaviors: [
	    PaperItemBehavior,
	    TriPlatAccessibilityBehavior,
	    TriDirBehavior
	],

    properties: {
		label: {
			type: String,
			value: ""
		},

		name: {
			type: String,
			value: ""
		},

		selectedValue: {
			type: String,
			value: ""
		},

		_selected: {
			type: Boolean,
			value: false,
			computed: "_computeSelected(name, selectedValue)",
			observer: "_observeSelected"
		},

		smallLayout: {
			type: Boolean,
			notify: true
		}
	},

	hostAttributes: {
		role: 'option'
		},

    _computeSelected: function(name, value) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (name == value);
	},

    _observeSelected: function(selected) {
		this.setAriaProperty(this, selected, "selected");
	}
});