/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import "./triview-locate-dev.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triview-locate model-and-view="triLocate" instance-id="-1" current-user="[[currentUser]]" disable-header="" home-app="[[homeApp]]" override-building-id="[[overrideBuildingId]]">
		</triview-locate>
	`,

    is: "triapp-locate",

    properties: {
		currentUser: Object,
		homeApp: String,
		overrideBuildingId: String
	}
});