/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triapp-task-list/tricomp-filter.js";
import "../triapp-task-list/tricomp-task-list-filter-item.js";
import "../triapp-task-list/tricomp-dropdown-item.js";

Polymer ({
    _template: html`
		<style include="tristyles-theme">

			tricomp-dropdown-item {
				--tricomp-dropdown-item-container: {
					padding: 10px 15px;
				}
			}
		
		</style>

		<tricomp-filter selected="{{selected}}" small-layout="[[smallLayout]]">
			<tricomp-task-list-filter-item bar="" small-layout="[[smallLayout]]" name="" label="All" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item bar="" small-layout="[[smallLayout]]" name="Active" label="Incomplete" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item bar="" small-layout="[[smallLayout]]" name="Completed" label="Complete" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-dropdown-item dropdown="" small-layout="[[smallLayout]]" name="" label="All" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item dropdown="" small-layout="[[smallLayout]]" name="Active" label="Incomplete" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item dropdown="" small-layout="[[smallLayout]]" name="Completed" label="Complete" slot="dropdown"></tricomp-dropdown-item>
		</tricomp-filter>
	`,

    is: "tricomp-procedure-step-list-filter",

    properties: {
		selected: {
			type: String,
			value: "",
			notify: true
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	}
});