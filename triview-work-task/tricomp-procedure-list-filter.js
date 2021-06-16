/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triapp-task-list/tricomp-filter.js";
import "../triapp-task-list/tricomp-task-list-filter-item.js";
import "../triapp-task-list/tricomp-dropdown-item.js";

Polymer ({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<tricomp-filter selected="{{selected}}" small-layout="{{smallLayout}}">
			<tricomp-task-list-filter-item small-layout="[[smallLayout]]" bar="" name="" label="All" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item small-layout="[[smallLayout]]" bar="" name="per Asset" label="Asset" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item small-layout="[[smallLayout]]" bar="" name="per Location" label="Location" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-task-list-filter-item small-layout="[[smallLayout]]" bar="" name="per Task" label="Tasks" slot="bar"></tricomp-task-list-filter-item>
			<tricomp-dropdown-item small-layout="[[smallLayout]]" dropdown="" name="" label="All" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item small-layout="[[smallLayout]]" dropdown="" name="per Asset" label="Asset" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item small-layout="[[smallLayout]]" dropdown="" name="per Location" label="Location" slot="dropdown"></tricomp-dropdown-item>
			<tricomp-dropdown-item small-layout="[[smallLayout]]" dropdown="" name="per Task" label="Tasks" slot="dropdown"></tricomp-dropdown-item>
		</tricomp-filter>
	`,

    is: "tricomp-procedure-list-filter",

    properties: {
		selected: {
			type: String,
			notify: true
		},

		smallLayout: {
			type: Boolean,
			notify: true
		}
	}
});