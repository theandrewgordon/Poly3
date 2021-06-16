/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { templatize } from "../../../@polymer/polymer/lib/utils/templatize.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-query/triplat-query.js";

import { TriBlockViewResponsiveBehavior } from "../../../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../../../triblock-table/triblock-table.js";

import "../../styles/tristyles-stacking.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "../floor-flyout/tricomp-floor-flyout.js";
import "../floor-stack/tricomp-floor-stack.js";
import "../overflow-text/tricomp-overflow-text.js";

let floorFlyout = null;
let floorFlyoutTemplateInstance = null;

class BuildingStackComponent extends mixinBehaviors([TrimixinDropdownComponent, TriBlockViewResponsiveBehavior, TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-building-stack"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				.stack-container {
					@apply --layout-vertical;
					@apply --layout-flex;
					padding-top: 10px;
					overflow-x: auto;
					overflow-y: hidden;
				}

				.toolbar-buffer {
					height: 15px;
				}
				
				:host([medium-screen-width]) .toolbar-buffer {
					height: 22px;
				}

				triblock-table {
					overflow-x: hidden;
					--triblock-table-odd-row-background-color: white;
					--triblock-table-row-container: {
						border-bottom: 1px solid var(--ibm-gray-30);
					}
					--triblock-table-header-cell-label: {
						color: var(--tri-primary-content-color);
					}
					--triblock-table-column-divider: {
						top: 0px;
						height: 100%;
						border-left: 1px solid var(--ibm-gray-30);
					}
					--triblock-table-cell: {
						padding: 0px 5px !important;
					}
				}
				:host([_width-auto]) triblock-table {
					padding-right: 5px;
				}
				:host(:not([_width-auto])) triblock-table {
					padding-right: 25px;
				}

				.floor-name-column {
					--triblock-table-column-fixed-width: 110px;
					--triblock-table-column-body-flex-alignment: flex-start;
				}

				.floor-name {
					padding: 0px 5px;
					text-align: left;
					cursor: pointer;
					@apply --layout-flex;
					flex-wrap: wrap;
				}

				.floor-name-text:hover {
					text-decoration: underline;
				}
				
				.discrepancy-icon {
					min-height: 16px;
					min-width: 16px;
					--iron-icon-height: 16px;
					--iron-icon-width: 16px;
					--iron-icon-fill-color: var(--ibm-yellow-40);
				}
			</style>

			<triplat-query data="[[building.floors]]" filtered-data-out="{{_buildingFloorsSorted}}">
				<triplat-query-sort name="[[_sortProp]]" desc="[[_sortDesc]]"></triplat-query-sort>
			</triplat-query>

			<div class="stack-container" id="buildingFloorsContainer">
				<div class="toolbar-buffer"></div>
				<triblock-table id="buildingFloorTable" data="{{_buildingFloorsSorted}}" remove-row-focus-and-hover
					sort-property="[[_sortProp]]" sort-descending="{{_sortDesc}}" fixed-header>
					<triblock-table-column class="floor-name-column" title="Floor" property="name" sortable initial-sort>
						<template>
							<template is="dom-if" if="[[_computeShowDiscrepancy(item, assignableSpacesOnly)]]">
								<iron-icon class="discrepancy-icon" icon="ibm-glyphs:warning"></iron-icon>
							</template>
							<template is="dom-if" if="[[!_computeShowDiscrepancy(item, assignableSpacesOnly)]]">
								<div class="discrepancy-icon"></div>
							</template>
							<tricomp-overflow-text lines="2" class="floor-name" on-tap="_handleFloorTap">
								<span class="floor-name-text">[[value]]</span> 
							</tricomp-overflow-text>
						</template>
					</triblock-table-column>
					<triblock-table-column merge-with-previous-column>
						<template>
							<tricomp-floor-stack
								floor="[[item]]"
								max-floor-area="[[maxFloorArea]]"
								show-to-scale="[[showToScale]]"
								highlighted-org="[[highlightedOrg]]"
								fit-into="[[_thisElement]]"
								selected-stack="[[selectedStack]]" 
								assignable-spaces-only="[[assignableSpacesOnly]]"
								building-orgs="[[building.orgs]]">
							</tricomp-floor-stack>
						</template>
					</triblock-table-column>
				</triblock-table>
			</div>

			<template id="floorFlyoutTemplate">
				<tricomp-floor-flyout id="floorFlyout"></tricomp-floor-flyout>
			</template>
		`;
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/building-stack/tricomp-building-stack.js");
	}

	static get properties() {
		return {
			building: Object,

			maxFloorArea: {
				type: Number,
				notify: true
			},

			showToScale: {
				type: Boolean,
				notify: true
			},

			_buildingFloorsSorted: Array,

			assignableSpacesOnly: {
				type: Boolean,
				value: false,
				notify: true
			},

			highlightedOrg: {
				type: String
			},

			selectedStack: {
				type: Object,
				notify: true
			},

			_sortProp: {
				type: String,
				notify: true,
				value: "level"
			},

			_sortDesc: {
				type: Boolean,
				notify: true,
				value: false
			},
			
			fitInto: {
				type: Object,
				notify: true
			},

			selectedBuildingIndex: Number,
			stackInitBuildings: Array,
			
			scrollContainer: {
				type: Object, 
				notify: true
			},

			tableWidth: {
				type: Number,
				observer: "_handleTableWidthChanged"
			},

			buildingFloorTable: {
				type: Object,
				notify: true
			},

			_widthAuto: {
				type: Boolean,
				computed: "_computeWidthAuto(tableWidth)",
				reflectToAttribute: true
			}
		}
	}


	static get observers() {
		return [
			"_setFitIntoForBuildingTabChanged(selectedBuildingIndex, building)"
		]
	}

	_setFitIntoForBuildingTabChanged(selectedBuildingIndex, building) { 
		if(this.stackInitBuildings[selectedBuildingIndex].id == building.id) {
			this.set("scrollContainer", this.$.buildingFloorsContainer);
			this.set("buildingFloorTable", this.$.buildingFloorTable);
		}
		this.$.buildingFloorTable.scrollTop = 0;
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

	_handleFloorTap(e) {
		e.stopPropagation();
		const positionTarget = e.target;
		const floor = e.model.item;
		this._getFloorFlyout().toggle(this.fitInto, this.scrollContainer, positionTarget, floor, this.assignableSpacesOnly);
	}

	_getFloorFlyout() {
		if (!floorFlyout) {
			const floorFlyoutTemplate = this.$.floorFlyoutTemplate;
			const FloorFlyoutTemplateClass = templatize(floorFlyoutTemplate, this);

			floorFlyoutTemplateInstance = new FloorFlyoutTemplateClass(null);

			this.shadowRoot.appendChild(floorFlyoutTemplateInstance.root);
			floorFlyout = this.shadowRoot.querySelector("#floorFlyout");
		} else {
			this.shadowRoot.appendChild(floorFlyout);
		}
		return floorFlyout;
	}

	_computeShowDiscrepancy(item, assignableSpacesOnly) {
		return assignableSpacesOnly ? item.hasAssignableDiscrepancy : item.hasDiscrepancy;
	}

	getDropzoneActiveFloorElems() {
		return this.shadowRoot.querySelectorAll("tricomp-floor-stack[dropzone-active]");
	}

	_handleTableWidthChanged(tableWidth, oldValue) {
		if (tableWidth != oldValue) {
			let table = this.shadowRoot.querySelector("triblock-table");
			table.style.width = (tableWidth == "auto") ? tableWidth : tableWidth + "px";
		}
	}

	_computeWidthAuto(tableWidth) {
		return (tableWidth == "auto");
	}
}

window.customElements.define(BuildingStackComponent.is, BuildingStackComponent);