/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					display: block;
					background-color: inherit;
				}

				#outerBox {
					background-color: inherit;
					line-height: 1.2em;
					max-height: 2.4em;
					position: relative;
					overflow: hidden;
				}

				.overflow-indicator {
					background-color: var(--tricomp-overflow-text-ellipsis-background-color, inherit);
					bottom: 0;
					position: absolute;
					text-align: right;
				}
				:host([dir="ltr"]) .overflow-indicator {
					padding-left: 7px;
					right: 0;
				}
				:host([dir="rtl"]) .overflow-indicator {
					left: 0;
					padding-right: 7px;
				}

				.ellipsis {
					background-size: 100% 100%;
					line-height: var(--tricomp-overflow-text-ellipsis-line-height, normal);
				}
				:host([gradient]) .ellipsis {
					background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), to(white), color-stop(50%, white));
					background: -moz-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);			
					background: -o-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
					background: -ms-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
					background: linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
					width: 3em;
				}

				.collapse-link {
					font-size: var(--tricomp-overflow-text-collapse-link-font-size, "inherit");
				}
			
		</style>

		<div id="outerBox">
			<div id="innerBox">
				<template is="dom-if" if="[[!_hasTextProperty(text)]]" restamp="">
					<slot></slot>
				</template>

				<template is="dom-if" if="[[_hasTextProperty(text)]]" restamp="">
					<div>[[text]]</div>
				</template>
			</div>

			<template is="dom-if" if="[[!collapse]]">
				<div class="ellipsis overflow-indicator" hidden\$="[[_hideEllipsis]]">…</div>
			</template>

			<template is="dom-if" if="[[collapse]]">
				<div class="tri-link collapse-link overflow-indicator" hidden\$="[[_hideEllipsis]]" on-tap="_handleCollapseContent">
					<span hidden\$="[[!_collapsed]]">... More</span>
					<span hidden\$="[[_collapsed]]">... Less</span>
				</div>
			</template>
		</div>
	`,

    is: "tricomp-overflow-text",
    behaviors: [IronResizableBehavior, TriDirBehavior],

    properties: {
		/*
		 * If true, the overflowing content can be expanded.
		 */
		collapse: {
			type: Boolean,
			value: false
		},

		/*
		 * The number of lines to be displayed.
		 */
		lines: {
			type: Number,
			value: 2,
			observer: "_observeLines"
		},

		/*
		 * Boolean value that indicate if a gradient background should not 
		 * be displayed in the ellipsis container.
		 */
		gradient: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		/*
		 * The text content. If this property is used, the component
		 * will ignore the `<content>`.
		 */
		text: {
			type: String,
			value: "",
			observer: "_checkOverflowText"
		},

		/*
		 * Indicate when the content should be collapsed.
		 */
		_collapsed: {
			type: Boolean,
			value: true,
			observer: "_collapseContent"
		},

		/*
		 * Indicate when to show and hide the ellipsis.
		 */
		_hideEllipsis: {
			type: Boolean,
			value: true
		}
	},

    listeners: {
		"iron-resize": "_handleResize"
	},

    attached: function() {
		afterNextRender(this, function(){
			this.async(function() {
				this.notifyResize();
			}, 300);
		});
	},

    /*
	 * Set the maximum number of lines to be displayed.
	 */
	_observeLines: function(lines) {
		this._setMaxHeight();
	},

    /*
	 * Check if there are overflowing content.
	 */
	_checkOverflowText: function() {
		this.debounce(
			"_checkOverflowText",
			function() {
				var outerBox = this.$.outerBox;
				var innerBox = this.$.innerBox;

				if (outerBox && innerBox) {
					var outerBoxHeight = outerBox.offsetHeight;
					var innerBoxHeight = innerBox.offsetHeight;

					this._hideEllipsis = (innerBoxHeight > outerBoxHeight) ? false : true;
				}
			},
			200
		);
	},

    /*
	 * Check if there are overflowing content when resizing the screen.
	 */
	_handleResize: function() {
		this._checkOverflowText();
	},

    /*
	 * Set `max-height` for the `outerBox` container.
	 */
	_setMaxHeight: function() {
		this.$.outerBox.style.maxHeight = (1.2 * this.lines) + "em";
	},

    /*
	 * Remove `max-height` from the `outerBox` container.
	 */
	_removeMaxHeight: function() {
		this.$.outerBox.style.maxHeight = "none";
	},

    /*
	 * Determine when to set or remove the `max-height` from the `outerBox` container..
	 */
	_collapseContent: function(collapsed) {
		if (collapsed) {
			this._setMaxHeight();
		} else {
			this._removeMaxHeight();
		}
	},

    /*
	 * Toggle value of `_collapsed`.
	 */
	_handleCollapseContent: function() {
		this.set("_collapsed", !this._collapsed);
	},

    _hasTextProperty: function(text) {
		return text && text != "";
	}
});