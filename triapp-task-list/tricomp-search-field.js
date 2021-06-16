/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/paper-input/paper-input-container.js";

Polymer({
		_template: html`
			<style include="tristyles-theme">

					paper-input-container {
						border: 1px solid rgb(174, 174, 174);
						color: black;
						padding-bottom: 0px;
						padding-top: 1px;
						background-color: white;
						@apply --tricomp-search-field-paper-input-container;
					}

					paper-input-container iron-icon {
						--iron-icon-fill-color: var(--tri-secondary-color);
						margin: 10px;
					}

					paper-input-container iron-icon.icon-clear {
						--iron-icon-height: 20px;
						--iron-icon-width: 20px;
						cursor: pointer;
						margin: 0;
						margin-right: 5px;
					}

					paper-input-container input {
						font-family: var(--tri-font-family);
						font-size: 14px;
					}

					paper-input-container input::-webkit-contacts-auto-fill-button {
						display: none !important;
						pointer-events: none;
						position: absolute;
						right: 0;
						visibility: hidden;
					}

					paper-input-container input::-ms-clear {
						display: none;
					}

					input {
						@apply --paper-input-container-shared-input-style;
					}

			</style>

			<paper-input-container no-label-float="">
				<iron-icon icon="ibm:search" prefix="" slot="prefix"></iron-icon>
				<iron-input bind-value="{{value}}" slot="input">
					<input placeholder="[[placeholder]]">
				</iron-input>
				<iron-icon class="icon-clear" icon="ibm-glyphs:clear-input" suffix="" on-tap="clearSearch" hidden="[[_hideSearchClearBtn(value)]]" slot="suffix"></iron-icon>
			</paper-input-container>
		`,

		is: "tricomp-search-field",

		properties: {

			value: {
				type: String,
				notify: true
			},

			placeholder: {
				type: String
			}

		},

		_hideSearchClearBtn: function(value) {
			return (value == "") ? true : false;
		},

		clearSearch: function() {
			this.set("value", "");
		}
});