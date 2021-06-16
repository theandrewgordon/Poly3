/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement,html } from "../../../@polymer/polymer/polymer-element.js";

import { assertParametersAreDefined } from "../../../tricore-util/tricore-util.js";

import "../../styles/tristyles-stacking.js";

class StackLegendOrg extends PolymerElement {
	static get is() { return "tricomp-stack-plan-legend-item"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-bottom: 7px;
					cursor: pointer;
					--tricomp-stack-plan-legend-item-border-color: #FFFFFF;
				}

				.color-box {
					@apply --layout-flex-1;
					height: 22px;
					width: 22px;
					box-sizing: border-box;
					border: 3px solid var(--tricomp-stack-plan-legend-item-border-color);
				}

				.org-text {
					@apply --layout-flex;
					padding: 0px 7px;

					@apply --tricomp-stack-plan-legend-item-name;
				}

				:host([_selected]) .org-text, :host([stack-hover]) .org-text {
					font-weight: bold;
				}
			</style>

			<div id="colorBoxId" class="color-box"></div>
			<span class="org-text noselect" title="[[path]]">[[name]]</span>
		`
	}

	static get properties() {
		return {
			name: String,
			fill: {
				type: String,
				observer: "_setBackgroundColor"
			},
			path: String,
			selectedStack: {
				type: Object
			},
			buildingId: {
				type: String
			},
			_selected: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			stackHover: {
				type: Boolean,
				reflectToAttribute: true,
				observer: "_handleHoverStack"
			}
		}
	}

	static get observers() {
		return [
			"_handleSelectedStack(selectedStack, buildingId, path)"
		]
	}

	connectedCallback() {
		super.connectedCallback();
		this._setBackgroundColor(this.fill);
	}

	_setBackgroundColor(color) {
		this.$.colorBoxId.style.backgroundColor = color;
	}

	_setBorderColor(color) {
		this.updateStyles(
			{'--tricomp-stack-plan-legend-item-border-color': color}
		);
	}

	_handleSelectedStack(stack, buildingId, path) {
		if (!assertParametersAreDefined(arguments) || !stack) {
			this.set('_selected', false);
			this._setBorderColor( this.stackHover || this._selected ? this.fill : '#FFFFFF');
			return;
		}
		
		const selected = stack.orgPath.value === path && stack.building.id === buildingId;
		this.set('_selected', selected);
		this._setBorderColor( this.stackHover || selected ? this.fill : '#FFFFFF');
	}

	_handleHoverStack(hover) {
		this._setBorderColor( hover || this._selected ? this.fill : '#FFFFFF');
	}
}

window.customElements.define(StackLegendOrg.is, StackLegendOrg);