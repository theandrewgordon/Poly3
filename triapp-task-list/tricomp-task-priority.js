/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-icon/ibm-icons.js";
import "../@polymer/iron-icon/iron-icon.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					text-align: center;
					font-size: 12px;
				}
				
				iron-icon {
					--iron-icon-height: 20px;
					--iron-icon-width: 20px;
				}

				div {
					margin-top: 2px;
				}

				.textpriority{
					max-width:60px;
					word-wrap:break-word;
				}
			
		</style>

		<template is="dom-if" if="[[priorityEnUs]]">
			<iron-icon icon="[[_computePriorityIconName(priorityEnUs)]]" style\$="[[_computePriorityIconColor(priorityColor)]]" aria-label\$="[[priority]]" role="img"></iron-icon>
			<div hidden\$="[[iconOnly]]" class="textpriority">[[priority]]</div>
		</template>
	`,

    is: "tricomp-task-priority",

    properties: {
		/*
		 * Work task priority.
		 */
		priority: {
			type: String,
			value: "low"
		},

		/*
		 * Work task priority ENUS.
		 */
		priorityEnUs: {
			type: String,
			value: "low"
		},

		priorityColor: String,

		/*
		 * If true, the priority will be indicated with icons.
		 */
		iconOnly: {
			type: Boolean,
			value: false
		}
	},

    _computePriorityIconName: function(priority) {
		var className = "priority-";
		if (priority && priority !== "") {
			className += priority.toLowerCase();
		} else {
			className = "";
		}
		return "ibm:" + className;
	},

    _computePriorityIconColor: function(color) {
		if (color) {
			return "color: " + color;
		}
	}
});