/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-icon/iron-icon.js";

import "../../../@polymer/paper-input/paper-input-container.js";

import { TriBlockViewResponsiveBehavior } from "../../../triblock-responsive-layout/triblock-view-responsive-behavior.js";

class TricompBuildingSearchField extends mixinBehaviors([TriBlockViewResponsiveBehavior], PolymerElement) {
	static get is() { return "tricomp-building-search-field"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">

				paper-input-container {
					@apply --tricomp-building-search-field-paper-input-container;
					border: 1px solid var(--tri-primary-content-accent-color);
					padding-bottom: 0px;
					padding-top: 1px;
					background-color: white;
					border-bottom: 0px;
				}
				paper-input-container iron-icon {
					--iron-icon-fill-color: var(--tri-secondary-color);
					margin: 7px;
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

		<paper-input-container no-label-float>
			<iron-icon icon="ibm-glyphs:search" slot="prefix"></iron-icon>
			<iron-input bind-value="{{buildingSearchValue}}" slot="input">
				<input placeholder="Search">
			</iron-input>
			<iron-icon class="icon-clear" icon="ibm-glyphs:clear-input" on-tap="_clearSearch" hidden="[[_hideSearchClearBtn(buildingSearchValue)]]" slot="suffix"></iron-icon>
		</paper-input-container>
	`;
	
	}
	
	static get properties() {
		return {
			buildingSearchValue: {
				type: String,
				notify: true,
				value: ""
			},
		}
	}

	_hideSearchClearBtn(value) {
		return (value == "") ? true : false;
	}

	_clearSearch() {
		this.set("buildingSearchValue", "");
	}
}
window.customElements.define('tricomp-building-search-field', TricompBuildingSearchField);