/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triapp-people-search/triapp-people-search.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				triapp-people-search {
					--triapp-people-search-paper-input: {
						border: 1px solid var(--ibm-gray-30);
					}
				}
			
		</style>

		<triapp-people-search id="peopleSearch" placeholder="[[_searchPlaceholder]]" dropdown="" show-person-location="">
		</triapp-people-search>
	`,

    is: "tricomp-search-person",

    attached: function() {
		var __dictionary__placeholder = "Search by a person’s name";
		this.set("_searchPlaceholder", __dictionary__placeholder);
	}
});