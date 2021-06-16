/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from '../../../@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '../../../@polymer/polymer/lib/legacy/class.js';
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import '../../../@polymer/paper-checkbox/paper-checkbox.js';
import "../../../@polymer/paper-slider/paper-slider.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../../@polymer/paper-tooltip/paper-tooltip.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import '../../../triplat-icon/ibm-icons-glyphs.js';
import { TriBlockViewResponsiveBehavior } from "../../../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "../../../@polymer/paper-listbox/paper-listbox.js";
import "../../styles/tristyles-stacking.js";

class StackPlanToolbarComponent extends mixinBehaviors([TriBlockViewResponsiveBehavior, TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-stack-plan-toolbar"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}
				:host([dir=ltr]) {
					padding-right: 20px;
				}
				:host([dir=rtl]) {
					padding-left: 20px;
				}

				.toolbar {
					@apply --layout-horizontal;
					@apply --layout-center;
					overflow: hidden;
				}

				.add-demand-container,
				.space-dropdown-container,
				.scale-checkbox-slider-container,
				.scale-checkbox-container, 
				.scale-slider-container {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.scale-checkbox-slider-container {
					@apply --layout-flex;
				}

				:host([medium-screen-width]) .space-dropdown-container,
				:host([medium-screen-width]) .scale-checkbox-slider-container {
					@apply --layout-start;
					@apply --layout-vertical;
				}

				:host(:not([medium-screen-width])) .scale-slider-container {
					@apply --layout-flex;
				}
				:host([medium-screen-width]) .scale-slider-container {
					@apply(--layout-self-stretch);
				}

				:host([medium-screen-width]) .divider {
					height: 45px;
				}

				.add-demand-button {
					height: 22px;
					min-height: 22px;
					width: 22px;
					min-width: 22px;
					padding: 0;
				}
				:host([dir=ltr]) .add-demand-button {
					margin-right: 5px;
				}
				:host([dir=rtl]) .add-demand-button {
					margin-left: 5px;
				}

				.add-demand-tooltip {
					--paper-tooltip: {
						width: 130px;
					};
				}

				paper-dropdown-menu {
					--paper-input-container-input: {
						width: 105px;
						font-size: 14px;
						font-family: var(--tri-font-family);
					}
					--paper-dropdown-menu-input: {
						border-bottom: 1px solid var(--ibm-gray-30);
					}
					--paper-dropdown-menu-icon: {
						color: var(--tri-primary-color);
					}
					--paper-input-container: {
						padding-top: 4px ;
					}
				}

				paper-listbox {
					border: 1px solid var(--ibm-gray-30);
					width: 127px;
					padding: 0px;
				}

				:host([dir=ltr]) .text-spacing {
					padding: 0px 8px 0px 0px;
				}
				:host([dir=rtl]) .text-spacing {
					padding: 0px 0px 0px 8px;
				}

				.item-container {
					padding-left: 10px;
					cursor: pointer;
					font-size: 14px;
				}

				.item-container:hover {
					background-color: var(--tri-primary-light-color);
				}
				
				.zoom-slider {
					@apply --layout-flex;
					margin-top: 2px;
					max-width: 200px;
					min-width: 100px;
					width: auto;
				}

				.add-demand-label,
				.toggle-option,
				.toggle,
				.scale-label {
					cursor: pointer;
				}
				:host(:not([medium-screen-width])) .add-demand-label,
				:host(:not([medium-screen-width])) .toggle-option,
				:host(:not([medium-screen-width])) .toggle,
				:host(:not([medium-screen-width])) .scale-label {
					white-space: nowrap;
				}
			</style>

			<div id="toolbar" class="toolbar">
				<div id="addDemand" class="add-demand-container" on-tap="addDemand">
					<paper-icon-button class="add-demand-button" icon="ibm-glyphs:add-new" primary noink></paper-icon-button>
					<span class="add-demand-label">Add Demand</span>
				</div>
				<paper-tooltip for="addDemand" class="add-demand-tooltip">Create new demand and view demand history</paper-tooltip>
				<div class="divider"></div>
				<div class="space-dropdown-container">
					<span class="secondary-text text-spacing">Show</span>
					<paper-dropdown-menu no-label-float vertical-offset="37">
						<paper-listbox class="dropdown-content" slot="dropdown-content" selected="{{selected}}">
							<paper-item class="item-container" on-tap="_onAllSpacesTapped">All Spaces</paper-item>
							<paper-item class="item-container" on-tap="_onAssignableOnlyTapped">Assignable Only</paper-item>
						</paper-listbox>
					</paper-dropdown-menu>
				</div>
				<div class="divider"></div>
				<div class="scale-checkbox-slider-container">
					<div class="scale-checkbox-container">
						<paper-checkbox checked="{{showToScale}}"></paper-checkbox>
						<span class="scale-label" on-tap="_toggleScaleCheckbox">Show to Scale</span>
					</div>
					<div class="divider" hidden\$="[[mediumScreenWidth]]"></div>
					<div class="scale-slider-container">
						<span>100%</span>
						<paper-slider
							id="zoomSlider"
							class="zoom-slider"
							min="1"
							max="[[scaleSliderMax]]"
							step="0.1"
							value="{{scaleSliderValue}}">
						</paper-slider>
						<span>Max</span>
					</div>
				</div>
			</div>
		`;
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/tricomp-stack-plan-toolbar.js");
	}
	
	static get properties() {
		return {
			showToScale: {
				type: Boolean,
				notify: true
			},

			assignableSpacesOnly: {
				type: Boolean,
				value: false,
				notify: true
			},

			scaleSliderValue: {
				type: Number,
				notify: true
			},

			scaleSliderMax: {
				type: Number,
				notify: true
			},

			selected: {
				type: Number,
				notify: true
			},
		}
	}

	ready() {
		super.ready();
		const toolbar = this.$.toolbar;
		if (!toolbar.ondragover) toolbar.ondragover = this._onDragOverToolbar.bind(this);
	}

	addDemand() {
		this.dispatchEvent(new CustomEvent('open-ad-hoc-demand', {
			bubbles: true,
			composed: true
		}));
	}

	_onAllSpacesTapped() {
		this.assignableSpacesOnly = false;
	}

	_onAssignableOnlyTapped() {
		this.assignableSpacesOnly = true;
	}

	_toggleScaleCheckbox() {
		this.showToScale = !this.showToScale;
	}

	_onDragOverToolbar(event) {
		event.preventDefault();
		this.dispatchEvent(new CustomEvent("toolbar-drag-over", { bubbles: true, composed: true }));
	}
}

window.customElements.define(StackPlanToolbarComponent.is, StackPlanToolbarComponent);