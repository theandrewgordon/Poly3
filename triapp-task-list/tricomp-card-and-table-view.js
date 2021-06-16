/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { dom } from "../@polymer/polymer/lib/legacy/polymer.dom.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<slot></slot>
	`,

    is: "tricomp-card-and-table-view",

    /**
	 * Fired after the layout is changed.
	 *
	 * @event layout-change
	 */

	properties : {

		/**
		 * Sets or gets current layout. Either "table" or "card".
		 */
		currentLayout: {
			type: String,
			value: "table",
			notify: true
		},

		data: {
			type: Array
		},

		smallLayout: {
			type: Boolean,
			notify: true
		},

		mediumLayout: {
			type: Boolean,
			notify: true
		},
		
	},

    observers: [
		"_handleLayoutChange(currentLayout, data.*)",
		"_handleScreenWidthChange(smallLayout, mediumLayout)"
	],

    ready: function() {
		// initialize layout based on Local Web Storage of user
		this.refreshLayout();
	},

    /**
	 * Set the layout to the value in Local Web Storage (if supported)
	 */
	refreshLayout: function() {
		if(typeof(Storage) !== "undefined") {
			// Web Storage supported
			if (localStorage.layoutPreference) this.set("currentLayout", localStorage.layoutPreference);
			else localStorage.layoutPreference = this.currentLayout;
		}
		this._handleScreenWidthChange(this.smallLayout, this.mediumLayout);
	},

    /**
	 * Toggle the current layout
	 */
	toggleLayout: function() {
		if (this.currentLayout == "card") {
			this.set("currentLayout", "table");
			localStorage.layoutPreference = "table";
		}
		else if (this.currentLayout == "table") {
			this.set("currentLayout", "card");
			localStorage.layoutPreference = "card";
		}
	},

    _handleLayoutChange: function(currentLayout, data) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (currentLayout == "card") {
			// hide all distributed elements with 'table-container' attribute
			var tableLayoutElements = Array.from(dom(this).querySelectorAll("[table-container]"));
			tableLayoutElements.forEach(function(tableLayoutElement) {
				tableLayoutElement.setAttribute("hidden", "true");
			});

			// show all distributed elements with 'card-container' attribute
			var cardLayoutElements = Array.from(dom(this).querySelectorAll("[card-container]"));
			cardLayoutElements.forEach(function(cardLayoutElement) {
				cardLayoutElement.removeAttribute("hidden");
			});

			var cardDataElements = Array.from(dom(this).querySelectorAll("[card-data]"));
			cardDataElements.forEach(function(cardData) {
				if (data.path && data.path == "data") {
					cardData.items = data.value;
				} else if (data.path && data.path.indexOf(".splices") >= 0) {
					cardData.notifySplices('items', data.value.indexSplices);
				}
			});

			this.fire("layout-change", {"layout": "card"});
		} else if (currentLayout == "table") {
			// hide all distributed elements with 'card-container' attribute
			var cardLayoutElements = Array.from(dom(this).querySelectorAll("[card-container]"));
			cardLayoutElements.forEach(function(cardLayoutElement) {
				cardLayoutElement.setAttribute("hidden", "true");
			});

			// show all distributed elements with 'table-container' attribute
			var tableLayoutElements = Array.from(dom(this).querySelectorAll("[table-container]"));
			tableLayoutElements.forEach(function(tableLayoutElement) {
				tableLayoutElement.removeAttribute("hidden");
			});

			var tableDataElements = Array.from(dom(this).querySelectorAll("[table-data]"));
			tableDataElements.forEach(function(tableData) {
				if (data.path && data.path == "data") {
					tableData.data = data.value;
				} else if (data.path && data.path.indexOf(".splices") >= 0) {
					tableData.notifySplices('data', data.value.indexSplices);
				}
			});

			this.fire("layout-change", {"layout": "table"});
		}
	},

    _handleScreenWidthChange: function(smallLayout, mediumLayout) {
		if (!smallLayout && !mediumLayout) {
			var layoutPreference = localStorage.layoutPreference;
			if (layoutPreference == "table") {
				this.set("currentLayout", "table");
			} else if (layoutPreference == "card") {
				this.set("currentLayout", "card");
			} else {
				this.set("currentLayout", "table");
			}
		} else {
			this.set("currentLayout", "card");
		}
	}
});