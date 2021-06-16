/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "./tricomp-task-list-filter-item.js";
import "./tricomp-dropdown-item.js";
import "./tricomp-filter.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<tricomp-filter selected="{{selected}}" small-layout="[[smallLayout]]">
			<tricomp-task-list-filter-item bar="" name="all" label="All" small-layout ="[[smallLayout]]" selected-value="[[selected]]" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item bar="" name="cm" label="CMs" small-layout ="[[smallLayout]]" selected-value="[[selected]]" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item bar="" name="pm" label="PMs" small-layout ="[[smallLayout]]" selected-value="[[selected]]" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item bar="" name="created" label="My created tasks" small-layout ="[[smallLayout]]" selected-value="[[selected]]" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-dropdown-item dropdown="" name="all" label="All" small-layout ="[[smallLayout]]" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item dropdown="" name="cm" label="CMs" small-layout ="[[smallLayout]]" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item dropdown="" name="pm" label="PMs" small-layout ="[[smallLayout]]" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item dropdown="" name="created" small-layout ="[[smallLayout]]" label="My created tasks" slot="dropdown"></tricomp-dropdown-item>
		</tricomp-filter>
	`,

    is: "tricomp-task-list-filter",

    properties: {
		selected: {
			type: String,
			value: "all",
			notify: true
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		},
	},
});