/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icons/iron-icons.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "./tricomp-vertical-tabs-scroll-container.js"

class TricompVerticalTabs extends PolymerElement {
	static get is() { return "tricomp-vertical-tabs"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-center;
					@apply --layout-vertical;
					overflow: hidden;
				}

				paper-icon-button {
					width: 45px;
					height: 45px;
					padding: 10px;
					margin: 0 4px;
					--paper-icon-button-disabled: {
						color: var(--tri-primary-color) !important;
						opacity: 0.3;
					}
				}
			</style>

			<paper-icon-button icon="icons:expand-less" disabled="[[_upDisabled]]" hidden\$="[[_buttonsHidden]]" on-up="_onScrollButtonUp" on-down="_onUpScrollButtonDown" tabindex="-1" primary noink></paper-icon-button>

			<tricomp-vertical-tabs-scroll-container id="scrollContainer" selected="{{selected}}" buttons-always-visible="[[buttonsAlwaysVisible]]" buttons-hidden="{{_buttonsHidden}}" up-disabled="{{_upDisabled}}" down-disabled="{{_downDisabled}}">
				<slot></slot>
			</tricomp-vertical-tabs-scroll-container>

			<paper-icon-button icon="icons:expand-more" disabled="[[_downDisabled]]" hidden\$="[[_buttonsHidden]]" on-up="_onScrollButtonUp" on-down="_onDownScrollButtonDown" tabindex="-1" primary noink></paper-icon-button>
		`;
	}

	static get properties() {
		return {
			selected: {
				type: Number,
				value: 0,
				notify: true
			},

			buttonsAlwaysVisible: {
				type: Boolean,
				value: false
			},

			_buttonsHidden: {
				type: Boolean,
			},

			_upDisabled: {
				type: Boolean
			},

			_downDisabled: {
				type: Boolean
			}
		};
	}

	_onScrollButtonUp() {
		this.$.scrollContainer.onScrollButtonUp();
	}

	_onUpScrollButtonDown() {
		this.$.scrollContainer.onUpScrollButtonDown();
	}

	_onDownScrollButtonDown() {
		this.$.scrollContainer.onDownScrollButtonDown();
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/vertical-tabs/tricomp-vertical-tabs.js");
	}
}

window.customElements.define(TricompVerticalTabs.is, TricompVerticalTabs);