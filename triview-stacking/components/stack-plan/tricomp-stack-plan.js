/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";
import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { templatize } from "../../../@polymer/polymer/lib/utils/templatize.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { IronResizableBehavior } from "../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

import "../../../@polymer/paper-tabs/paper-tab.js";
import "../../../@polymer/paper-tabs/paper-tabs.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { assertParametersAreDefined } from "../../../tricore-util/tricore-util.js";

import { TriBlockViewResponsiveBehavior } from "../../../triblock-responsive-layout/triblock-view-responsive-behavior.js";

import "../../services/triservice-ad-hoc-demand.js";
import "../../services/triservice-loading.js";
import "../../services/triservice-stack-plan.js";
import "../../styles/tristyles-stacking.js";
import { isEquivalent, compareOrgs, computeAllocationWidth, getFloorElem, calcDiscrepancy, computePercentageValue, findBuildingFloorIndexes, sumSpaces, sumSpacesArea } from "../../utils/triutils-stacking.js";
import "../allocation-block-flyout/tricomp-allocation-block-flyout.js";
import "../building-stack/tricomp-building-stack.js";
import "../tabs/tricomp-building-tab.js";
import "../stack-plan-legend/tricomp-stack-plan-legend.js";
import "../stack-plan-toolbar/tricomp-stack-plan-toolbar.js";

const MIN_BLOCK_PX_WIDTH = 15;
const SCALE_SLIDER_MIN_MAX = 2;

let stackFlyout = null;
let stackFlyoutTemplateInstance = null;

class StackPlanComp extends mixinBehaviors([TriBlockViewResponsiveBehavior, IronResizableBehavior, TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-stack-plan"; }

	static get template() {
		return html`
			<style include="stacking-layout-styles stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
					padding: 0 20px 10px 20px;
				}

				.building-tabs-container {
					@apply --layout-center;
					padding-top: 10px;
				}
				:host([dir=ltr]) .building-tabs-container {
					@apply --layout-horizontal;
				}
				:host([dir=rtl]) .building-tabs-container {
					@apply --layout-horizontal-reverse;
				}

				.building-tabs {
					@apply --layout-flex;
					height: 65px;
					padding: 0 20px;

					--paper-tabs-selection-bar: {
						border-bottom: 4px solid var(--ibm-blue-60);
						z-index: 1;
					};
				}
				.building-tabs:not(.hide-scroll-buttons) {
					padding: 0;
				}

				.building-tab {
					font-family: var(--tri-font-family);
					color: var(--tri-primary-content-color);
					--paper-tab: {
						padding: 0;
					};
					--paper-tab-content-unselected: {
						opacity: 1;
					};
				}
				:host([dir=ltr]) .building-tab {
					margin-right: 20px;
				}
				:host([dir=rtl]) .building-tab {
					margin-left: 20px;
				}
				.building-tab:hover::after {
					@apply --layout-fit;
					background-color: var(--ibm-blue-30);
					content: "";
					height: 4px;
					top: auto;
				}

				.stacks-legend-container {
					@apply --layout-flex;
					@apply --layout-horizontal;
				}

				.stacks-message-container {
					@apply --layout-vertical;
					@apply --layout-flex-9;
					overflow: hidden;
				}
				:host([dir=ltr]) .stacks-message-container  {
					padding-right: 15px;
				}

				:host([dir=rtl]) .stacks-message-container  {
					padding-left: 15px;
				}

				.stacks-toolbar-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					@apply --layout-relative;
					overflow: hidden;
				}

				tricomp-stack-plan-toolbar {
					position: absolute;
					top: 20px;
					z-index: 2;
				}

				:host([dir=ltr]) tricomp-stack-plan-toolbar  {
					left: 120px;
					right: 0;
				}

				:host([dir=rtl]) tricomp-stack-plan-toolbar  {
					right: 120px;
					left: 0;
				}

				:host([medium-screen-width]) tricomp-stack-plan-toolbar {
					top: 7px;
				}

				.stacks {
					@apply --layout-flex;
					@apply --layout-vertical;
					overflow: hidden;
				}

				.legend {
					@apply --layout-flex-1;
					height: 100%;
					padding: 0px 8px;
					overflow-y: auto;
				}

				:host([dir=ltr]) .legend {
					border-left: 1px solid var(--ibm-gray-30);
				}

				:host([dir=rtl]) .legend {
					border-right: 1px solid var(--ibm-gray-30);
				}

				.too-small-warning {
					@apply --layout-horizontal;
					flex-shrink: 0;
					background-color: var(--tri-warning-color);
					margin-top: 5px;
				}

				.status-icon-container {
					@apply --layout-vertical;
					@apply --layout-start;
					padding: 5px;
				}

				.status-icon {
					--iron-icon-height: 24px;
					--iron-icon-width: 24px;
					color: white;
				}

				.message-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					@apply --layout-center-justified;
					background-color: rgba(255, 255, 255, 0.8);
					padding: 5px 5px 5px 10px;
				}

				.stacks-legend-container {
					overflow-y: auto;
				}
			</style>

			<triservice-stack-plan id="stackPlanService"></triservice-stack-plan>

			<triservice-ad-hoc-demand building="[[_buildingForAdHoc]]"
				floors-for-search="[[_buildingForAdHoc.floors]]"></triservice-ad-hoc-demand>

			<triservice-loading loading="{{!_loading}}"></triservice-loading>

			<div class="building-tabs-container">
				<paper-icon-button icon="ibm-glyphs:back" on-up="_onScrollButtonUp" on-down="_onLeftScrollButtonDown" tabindex="-1" hidden\$="[[_hideScrollButtons]]" disabled="[[_disableLeftButton]]" primary noink></paper-icon-button>
				<paper-tabs id="buildingTabs" class="building-tabs" selected="{{_selectedBuildingIndex}}" scrollable hide-scroll-buttons noink>
					<template is="dom-repeat" items="[[stacksInit.buildings]]">
						<paper-tab class="building-tab">
							<tricomp-building-tab building="[[item]]"
								on-dragging-over="_handleDraggingOverBuildingTab">
							</tricomp-building-tab>
						</paper-tab>
					</template>
				</paper-tabs>
				<paper-icon-button icon="ibm-glyphs:expand-open" on-up="_onScrollButtonUp" on-down="_onRightScrollButtonDown" tabindex="-1" hidden\$="[[_hideScrollButtons]]" disabled="[[_disableRightButton]]" primary noink></paper-icon-button>
			</div>

			<div class="stacks-legend-container">
				<div class="stacks-message-container">
					<template is="dom-if" if="[[_yesThereIsAtLeastOneBlockThatIsSmallerThan15px(_smallestBlockWidthPxToScale)]]">
						<div class="too-small-warning">
							<div class="status-icon-container">
								<iron-icon class="status-icon" icon="ibm:status-warning"></iron-icon>
							</div>
							<div class="message-container">
								<div class="message">
									<span>Some demand bars are not visible at this zoom level.</span>
									<span class="tri-link" on-tap="_setMaxZoom">Increase zoom to show all.</span>
								</div>
							</div>
						</div>
					</template>
					<div class="stacks-toolbar-container">
						<template is="dom-if" if="[[_loading]]">
							<tricomp-stack-plan-toolbar
								assignable-spaces-only="{{_assignableSpacesOnly}}"
								show-to-scale="{{_showToScale}}"
								scale-slider-value="{{_scaleSliderValue}}"
								scale-slider-max="{{_scaleSliderMax}}"
								selected="{{_selected}}">
							</tricomp-stack-plan-toolbar>
						</template>
						<iron-pages id="stacks" class="stacks" selected="[[_selectedBuildingIndex]]">
							<dom-repeat items="[[stacksInit.buildings]]">
								<template>
									<tricomp-building-stack id="buildingStack"
										fit-into="{{_fitInto}}" 
										scroll-container="{{scrollContainer}}"
										building-floor-table="{{_buildingFloorTable}}"
										stack-init-buildings="[[stacksInit.buildings]]"
										selected-building-index="[[_selectedBuildingIndex]]" 
										building="[[item]]" 
										max-floor-area="[[_maxFloorArea]]"
										highlighted-org="[[_highlightedOrg]]" 
										selected-stack="[[_selectedStack]]"
										on-dragging="_handleDraggingBlock" 
										on-dragging-over-block="_handleDraggingOverBlock"
										on-dragging-over-floor="_handleDraggingOverFloor" 
										on-block-drop="_handleBlockDrop"
										on-floor-drop="_handleFloorDrop"
										assignable-spaces-only="[[_assignableSpacesOnly]]"
										show-to-scale="[[_showToScale]]"
										scale-slider-value="[[_scaleSliderValue]]"
										scale-slider-max="[[_scaleSliderMax]]"
										table-width="[[_tableWidth]]">
									</tricomp-building-stack>
								</template>
							</dom-repeat>
						</iron-pages>
					</div>
				</div>
				<tricomp-stack-plan-legend
					class="legend"
					id="orgLegend"
					orgs="[[_buildingOrgs]]"
					highlighted="{{_highlightedOrg}}"
					selected-stack="[[_selectedStack]]"
					building-id="[[_getBuildingId(_selectedBuildingIndex, stacksInit.buildings)]]"
					stack-hover-org="[[_singleStackHoverOrg]]">
				</tricomp-stack-plan-legend>
			</div>

			<template id="stackFlyoutTemplate">
				<tricomp-allocation-block-flyout id="stackFlyout"></tricomp-allocation-block-flyout>
			</template>

		`;
	}

	static get properties() {
		return {
			stacksInit: Object,

			opened: {
				type: Boolean,
				observer: "_handleOpenChanged"
			},

			stackPlan: Object,
			
			_selectedBuildingIndex: {
				type: Number,
				value: 0,
				observer: "_observeSelectedBuildingIndex"
			},
			
			_buildingOrgs: {
				type: Array
			},

			_highlightedOrg: {
				type: String
			},

			_selectedStack: {
				type: Object
			},

			_selectedStackElem: Object,
			_selectedSpaceClassStack: Object,

			_draggingBlockElement: Object,
			_draggingBlockModel: Object,

			_draggingSpaceClassBlockElement: Object,
			_draggingSpaceClassBlockModel: Object,

			_disableLeftButton: {
				type: Boolean
			},

			_disableRightButton: {
				type: Boolean
			},

			_hideScrollButtons: {
				type: Boolean
			},
			
			_fitInto: {
				type: Object
			},

			_buildingForAdHoc: {
				type: Object,
				computed: "_computeBuildingForAdHoc(stacksInit.buildings, _selectedBuildingIndex)"
			},
			
			_maxFloorArea: {
				type: Number
			},

			_assignableSpacesOnly: {
				type: Boolean
			},

			_showToScale: {
				type: Boolean,
				value: true
			},

			_tableContainerWidth: Number,
			_tableWidth: Number,
			
			_smallestBlockPercentage: Number,
			_pathToMinPercentage: String,
			_smallestBlockWidthPx: {
				type: Number,
				observer: "_handleSmallestBlockWidthPxChanged"
			},
			_smallestBlockWidthPxToScale: Number,
 
			_isViewSpaceClass: {
				type: Boolean,
				value: false
			},

			_scaleSliderValue: Number,
			_scaleSliderMax: Number,

			_loading: Boolean,

			_selected: Number,

			_singleStackHoverOrg: String,
			_buildingFloorTable: Object
		};
	}

	static get observers() {
		return [
			"_computeMaxFloorArea(stacksInit.buildings)",
			"_setBuildingOrgs(_selectedBuildingIndex, stacksInit.buildings)",
			"_setSmallestBlockPercentageAndPath(stacksInit.*, _assignableSpacesOnly, _showToScale, _maxFloorArea)",
			"_computeScaleSliderProperties(_isViewSpaceClass, _tableContainerWidth, _smallestBlockPercentage, _scaleSliderValue)",
			"_setSmallestBlockWidthPxToScale(_smallestBlockWidthPx, _scaleSliderValue)"
		]
	}

	ready() {
		super.ready();
		let buildingTabs = this.shadowRoot.querySelectorAll(".building-info");
		buildingTabs.forEach(el => this._setupDropZone(el));	
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('iron-resize', this._handleIronResize.bind(this));
		this.addEventListener('stack-tapped', this._handleStackTapped.bind(this));
		this.addEventListener('stack-view-space-class', this._handleStackViewSpaceClass.bind(this));
		this.addEventListener('split-space-class', this._handleSplitSpaceClass.bind(this));
		this.addEventListener('open-single-space-class-flyout', this._handleOpenSingleSpaceClassFlyout);
		this.addEventListener("compute-smallest-block", this._handleComputeSmallestBlock.bind(this));
		this.addEventListener("toolbar-drag-over", this._onDragOverToolbar.bind(this));
		this.addEventListener("stack-hover", this._onStackHover.bind(this));
		this.addEventListener("shift-stacks-without-drag", this._handleFloorDrop.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('iron-resize', this._handleIronResize.bind(this));
		this.removeEventListener('stack-tapped', this._handleStackTapped.bind(this));
		this.removeEventListener('stack-view-space-class', this._handleStackViewSpaceClass.bind(this));
		this.removeEventListener('split-space-class', this._handleSplitSpaceClass.bind(this));
		this.removeEventListener('open-single-space-class-flyout', this._handleOpenSingleSpaceClassFlyout);
		this.removeEventListener("compute-smallest-block", this._handleComputeSmallestBlock.bind(this));
		this.removeEventListener("toolbar-drag-over", this._onDragOverToolbar.bind(this));
		this.removeEventListener("stack-hover", this._onStackHover.bind(this));
		this.removeEventListener("shift-stacks-without-drag", this._handleFloorDrop.bind(this));
	}

	_handleIronResize() {
		this._resetScrollButtonsStatus();
		this._setTableContainerWidth();
	}

	resetSelectedDropdown() {
		this._selected = 0;
	}

	resetSelectedCheckbox() {
		this._showToScale = true;
	}

	resetAssignableSpacesOnly() {
		this._assignableSpacesOnly = false;
	}

	_computeBuildingForAdHoc(buildings, buildingIndex) {
		return (buildings && buildings.length > 0) ? buildings[buildingIndex] : {};
	}

	_floorsForAdHocSearch(buildings, buildingIndex) {
		return (buildings && buildings.length > 0) ? buildings[buildingIndex].floors : [];
	}

	_computeMaxFloorArea(buildings) {
		if (!buildings) return;
		let floors = [];
		buildings.forEach(function(building) {
			if (building.floors) {
				floors = floors.concat(building.floors);
			}
		}.bind(this));
		const maxFloorArea = Math.max.apply(null, floors.map(floor => {
			let demandAreaTotal = 0;
			if(floor.stacks) {
				const demandStacksTotal = sumSpaces(floor.stacks.map(stack => stack.spaces));
				demandAreaTotal = sumSpacesArea(demandStacksTotal);
			}
			return demandAreaTotal > floor.area ? demandAreaTotal : floor.area;
		}));
		this.set('_maxFloorArea', maxFloorArea);
	}

	_handleStackTapped(e) {
		e.stopPropagation();
		const positionTarget = e.detail.spaceStackElem;
		const spaceStack = e.detail.spaceStackElem.spaceStack;
		const spaceClassMode = e.detail.spaceClassMode;
		if (spaceClassMode) {
			this.set('_selectedSpaceClassStack', spaceStack);
		} else {
			if (this._selectedStackElem) {
				this._selectedStackElem.viewSpaceClass = false;
				this._selectedStackElem.draggable = "true";
			}
			this.set('_selectedSpaceClassStack', null);

			if (isEquivalent(this._selectedStack, spaceStack) && this._getStackFlyout() && this._getStackFlyout().opened) {
				this.set('_selectedStack', null);
				this.set('_selectedStackElem', null);
			} else {
				this.set('_selectedStack', spaceStack);
				this.set('_selectedStackElem', positionTarget);
			}
		}

		if (spaceStack) {
			this._getStackFlyout().toggle(this._fitInto, this.scrollContainer, positionTarget, spaceStack, spaceClassMode, this._assignableSpacesOnly, this.stacksInit.buildings, this._selectedBuildingIndex);
		} else {
			this._getStackFlyout().close();
		}
	}

	_resetSelection() {
		this.set('_selectedStack', null);
		if (this._selectedStackElem) {
			this._selectedStackElem.viewSpaceClass = false;
			this._selectedStackElem.draggable = "true";
		}
		this.set('_selectedStackElem', null);
		this.set('_selectedSpaceClassStack', null);
	}

	_handleDraggingOverBuildingTab(event) {
		if (event.detail.draggingOver) {
			let draggingHoveredBuildingIndex = event.model.index;
			this.set('_selectedBuildingIndex', draggingHoveredBuildingIndex);
		}
	}

	_handleDraggingBlock(event) {
		if (event.detail.dragging) {
			this._getStackFlyout().close();
			this.set('_draggingBlockElement', event.composedPath()[0]);
			this.set('_draggingBlockModel', event.detail.allocationBlock);
		}
	}

	_handleDraggingOverFloor(event) {
		const floorStackEl = event.composedPath()[0];
		const buildingStackElems = Array.from(this.shadowRoot.querySelectorAll("#buildingStack"));
		const buildingStackEl = buildingStackElems.find(el => floorStackEl.floor.building.id == el.building._id);
		const floorStackElems = buildingStackEl.getDropzoneActiveFloorElems();
		floorStackElems.forEach(el => {
			el.toggleDropZoneActive(false);
		});
		if (event.detail.draggingOver) {
			if (this._draggingBlockModel.floor.id != event.detail.floor._id) {
				floorStackEl.toggleDropZoneActive(true);
			}
		}
	}

	_handleDraggingOverBlock(event) {
		let block = event.composedPath()[0];
		if (block != this._draggingBlockElement) { 
			const floorElem = getFloorElem(event);
			let model = event.detail.allocationBlock;
			if (model.orgPath.value === this._draggingBlockModel.orgPath.value && model.floor.id != this._draggingBlockModel.floor.id) {
				if (event.detail.draggingOver) {
					if ((this._draggingBlockModel.spaceClass && this._draggingBlockModel.parentStack !== model
							|| !this._draggingBlockModel.spaceClass && this._draggingBlockModel !== model)) {
						block.toggleDropZoneActive(true);
						if (floorElem) {
							floorElem.toggleDropZoneActive(false);
						}
					} 
				} else {
					if (floorElem && floorElem.floor._id != this._draggingBlockModel.floor.id) {
						floorElem.toggleDropZoneActive(true);
					}
				}
			} 
		}
	}

	_handleBlockDrop(event) {
		event.stopPropagation();
		const toBlockModel = event.detail.allocationBlock;
		const toBlockElem = event.composedPath()[0];
		const sourceModel = this._draggingBlockModel;

		if (!sourceModel || !toBlockModel || !toBlockElem) {
			return;
		}

		if (toBlockModel.orgPath.value === sourceModel.orgPath.value && toBlockModel.floor.id != sourceModel.floor.id) {
			if ((sourceModel.spaceClass && sourceModel.parentStack !== toBlockModel
					|| !sourceModel.spaceClass && sourceModel !== toBlockModel)) {
				this._handleStackMerge(sourceModel, toBlockModel, this.stacksInit, toBlockElem);
			}
		} else if (toBlockModel.floor.id != sourceModel.floor.id) {
			const floorElem = getFloorElem(event);
			if (floorElem) {
				const floorEvent = new CustomEvent('floor-drop', {
					detail: {
						floor: floorElem.floor,
					},
					bubbles: true,
					composed: true
				});
				this._handleFloorDrop(floorEvent);
			}
		}
	}

	_handleStackMerge(sourceModel, toBlockModel, stacks, toBlockElem) {

		let targetFloor, fromFloor;
		const [sourceBuildingIndex, sourceFloorIndex] = findBuildingFloorIndexes(sourceModel, stacks);
		const [targetBuildingIndex, targetFloorIndex] = findBuildingFloorIndexes(toBlockModel, stacks);
		
		if (targetFloorIndex != -1) {
			targetFloor = this.stacksInit.buildings[targetBuildingIndex].floors[targetFloorIndex];
		}

		if (sourceFloorIndex != -1) {
			fromFloor = this.stacksInit.buildings[sourceBuildingIndex].floors[sourceFloorIndex];
		}

		this.$.stackPlanService.addStackToFloor(sourceModel, targetBuildingIndex, targetFloorIndex, toBlockModel);
		if (sourceModel.spaceClass && sourceModel.parentStack) {
			this.$.stackPlanService.removeSpacesFromStack(sourceModel, sourceBuildingIndex, sourceFloorIndex);
			if (Object.keys(sourceModel.parentStack.spaces).length == 0) {
				this.$.stackPlanService.removeStackFromFloor(sourceModel.parentStack, sourceBuildingIndex, sourceFloorIndex);
			}
			this._selectedStackElem.removeSpaceClassStackFromViewData(sourceModel);
		} else {
			this.$.stackPlanService.removeStackFromFloor(sourceModel, sourceBuildingIndex, sourceFloorIndex);
		}

		fromFloor.hasDiscrepancy = calcDiscrepancy(fromFloor, false);
		fromFloor.hasAssignableDiscrepancy = calcDiscrepancy(fromFloor, true);
		targetFloor.hasDiscrepancy = calcDiscrepancy(targetFloor, false);
		targetFloor.hasAssignableDiscrepancy = calcDiscrepancy(targetFloor, true);

		this.set(`stacksInit.buildings.${sourceBuildingIndex}.floors.${sourceFloorIndex}`,
			Object.assign({}, this.stacksInit.buildings[sourceBuildingIndex].floors[sourceFloorIndex]));
		this.set(`stacksInit.buildings.${targetBuildingIndex}.floors.${targetFloorIndex}`,
			Object.assign({}, targetFloor));

		this._updateBuildingOrgs(sourceBuildingIndex, targetBuildingIndex, sourceModel);

		this._resetSelection();
		this._computeMaxFloorArea(this.stacksInit.buildings);
		this.$.stackPlanService.saveStackPlanDataLocal(this.stackPlan._id, this.stacksInit, true);
	}

	_handleFloorDrop(event) {
		event.stopPropagation();
		let fromFloor;
		const toFloorModel = (event.detail.toFloor) ? event.detail.toFloor : event.detail.floor;
		const sourceModel = (event.detail.spaceStack) ? event.detail.spaceStack : this._draggingBlockModel;
		if (!sourceModel || toFloorModel._id == sourceModel.floor.id) return;

		const targetFloorData = { building: {id: toFloorModel.building.id}, floor: {id: toFloorModel._id}};
		const [sourceBuildingIndex, sourceFloorIndex] = findBuildingFloorIndexes(sourceModel, this.stacksInit);
		const [targetBuildingIndex, targetFloorIndex] = findBuildingFloorIndexes(targetFloorData, this.stacksInit);

		this.$.stackPlanService.addStackToFloor(sourceModel, targetBuildingIndex, targetFloorIndex);

		if (sourceModel.spaceClass && sourceModel.parentStack) {
			this.$.stackPlanService.removeSpacesFromStack(sourceModel, sourceBuildingIndex, sourceFloorIndex);
			if (Object.keys(sourceModel.parentStack.spaces).length == 0) {
				this.$.stackPlanService.removeStackFromFloor(sourceModel.parentStack, sourceBuildingIndex, sourceFloorIndex);
			}
			sourceModel.spaceClass = null;
			sourceModel.parentStack = null;
			this._selectedStackElem.removeSpaceClassStackFromViewData(sourceModel);
		} else {
			this.$.stackPlanService.removeStackFromFloor(sourceModel, sourceBuildingIndex, sourceFloorIndex);
		}
		sourceModel.percentage = computePercentageValue(sourceModel.areaAllocated, toFloorModel.area);
		sourceModel.assignableSpacesPercentage = computePercentageValue(sourceModel.assignableSpacesAreaAllocated, toFloorModel.area);

		if (sourceFloorIndex != -1) {
			fromFloor = this.stacksInit.buildings[sourceBuildingIndex].floors[sourceFloorIndex];
		}

		fromFloor = this.stacksInit.buildings[sourceBuildingIndex].floors[sourceFloorIndex];
		fromFloor.hasDiscrepancy = calcDiscrepancy(fromFloor, false);
		fromFloor.hasAssignableDiscrepancy = calcDiscrepancy(fromFloor, true);
		toFloorModel.hasDiscrepancy = calcDiscrepancy(toFloorModel, false);
		toFloorModel.hasAssignableDiscrepancy = calcDiscrepancy(toFloorModel, true);
		
		this.set(`stacksInit.buildings.${sourceBuildingIndex}.floors.${sourceFloorIndex}`,
		Object.assign({}, this.stacksInit.buildings[sourceBuildingIndex].floors[sourceFloorIndex]));
		this.set(`stacksInit.buildings.${targetBuildingIndex}.floors.${targetFloorIndex}`,
		Object.assign({}, this.stacksInit.buildings[targetBuildingIndex].floors[targetFloorIndex]));
		
		this._updateBuildingOrgs(sourceBuildingIndex, targetBuildingIndex, sourceModel);

		this._resetSelection();
		this._computeMaxFloorArea(this.stacksInit.buildings);
		this.$.stackPlanService.saveStackPlanDataLocal(this.stackPlan._id, this.stacksInit, true);
	}

	_handleOpenChanged(opened) {
		if (opened) {
			this.set("_selectedBuildingIndex", 0);
		}
		this._fitInto = this;
		this.$.orgLegend.scrollLegendToTop();
	}

	handleViewSpaceClassOnDetailPage() {		
		if(this._selectedStackElem) this._selectedStackElem.viewSpaceClass = false;
	}

	_getStackFlyout() {
		if (!stackFlyout) {
			if (!stackFlyoutTemplateInstance) {
				const stackFlyoutTemplate = this.$.stackFlyoutTemplate;
				const StackFlyoutTemplateClass = templatize(stackFlyoutTemplate, this);
				stackFlyoutTemplateInstance = new StackFlyoutTemplateClass(null);
			}
			this.shadowRoot.appendChild(stackFlyoutTemplateInstance.root);
			stackFlyout = this.shadowRoot.querySelector("#stackFlyout");
		} else {
			this.shadowRoot.appendChild(stackFlyout);
		}
		return stackFlyout;
	}

	_handleStackViewSpaceClass(e) {
		e.stopPropagation();
		if(this._selectedStackElem) {
			this._selectedStackElem.viewSpaceClass = true;
			this._selectedStackElem.draggable = "false";
		}
	}

	_handleOpenSingleSpaceClassFlyout(e) {
		const spaceClassStackElem = this._selectedStackElem.shadowRoot.querySelector('tricomp-space-allocation-stack');
		this._handleStackTapped(new CustomEvent('stack-tapped', {
			detail: {
				spaceStackElem: spaceClassStackElem,
				spaceClassMode: true
			},
			bubbles: true,
			composed: true
		}));
	}

	_resetScrollButtonsStatus() {
		this._debounceSetHideScrollButtons = Debouncer.debounce(
			this._debounceSetHideScrollButtons, 
			microTask,
			async () => {
				this._disableLeftButton = this.$.buildingTabs._leftHidden;
				this._disableRightButton = this.$.buildingTabs._rightHidden;
				this._hideScrollButtons = this._disableLeftButton && this._disableRightButton;
			}
		);
	}

	_onScrollButtonUp() {
		this.$.buildingTabs._onScrollButtonUp();
		this._resetScrollButtonsStatus();
	}

	_onLeftScrollButtonDown() {
		this.$.buildingTabs._onLeftScrollButtonDown();
	}

	_onRightScrollButtonDown() {
		this.$.buildingTabs._onRightScrollButtonDown();
	}

	_handleSplitSpaceClass(e) {
		e.stopPropagation();
		const spaceStack = e.detail.spaceStack;
		const countToSplit = e.detail.countToSplit;
		this._selectedStackElem.splitSpaceClassStackFromViewData(spaceStack, countToSplit);
		this._getStackFlyout().close();
	}

	_setSmallestBlockPercentageAndPath(stacks, assignableSpacesOnly, showToScale, maxFloorArea) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		let floors = this._getFloors(stacks.base);
		let floorStacks = this._getFloorStacks(stacks.base);
		if (floorStacks && floorStacks.length > 0) {
			let blockWithSmallestPercentage = this._getBlockWithSmallestNonZeroPercentage(floorStacks, assignableSpacesOnly);
			let floorWithSmallestPercentage = floors.find(floor => floor._id == blockWithSmallestPercentage.floor.id);
			let objPath = stacks.path.includes("floor") ? stacks.path : this._getStackObjectPath(blockWithSmallestPercentage, stacks.base);
			let percentage = computeAllocationWidth(blockWithSmallestPercentage, assignableSpacesOnly, showToScale, floorWithSmallestPercentage.area, maxFloorArea);
			let matchIndex = -1;
			if (this._pathToMinPercentage && stacks.path == this._pathToMinPercentage) { // if the floor that has the minPercentage has changed
				matchIndex = stacks.value.stacks.findIndex(x => assignableSpacesOnly ? x.assignableSpacesPercentage == percentage : x.percentage == percentage); // check if it still exists
				if (!this._smallestBlockPercentage || percentage < this._smallestBlockPercentage || matchIndex == -1) { // if it doesn't exist, set the value
					this.set('_smallestBlockPercentage', percentage);
					setTimeout(() => {
						this.set('_smallestBlockPercentage', percentage);
					}, 0);
					this.set('_pathToMinPercentage', objPath);
				}
			} else if (!this._smallestBlockPercentage || percentage < this._smallestBlockPercentage) {  // if it doesn't exist, set the value
				setTimeout(() => {
					this.set('_smallestBlockPercentage', percentage);
				}, 0);
				this.set('_pathToMinPercentage', objPath);
			}
		}
	}

	_getFloorStacks(stacks) {
		let floorStacks = [];
		stacks.buildings.forEach(function(building) {
			building.floors.forEach(function(floor) {
				floorStacks.push(floor.stacks);
			}.bind(this));
		}.bind(this));
		return [].concat(...floorStacks);
	}

	_getFloors(stacks) {
		let floors = [];
		stacks.buildings.forEach(function(building) {
			floors.push(building.floors);
		}.bind(this));
		return [].concat(...floors);
	}

	_getBlockWithSmallestNonZeroPercentage(floorStacks, assignableSpacesOnly) {
		let sortedEvalArr = null;
		let nonZeroFloorStacks = floorStacks.filter(item => item && item.areaAllocated > 0);
		if (assignableSpacesOnly) {
			sortedEvalArr = nonZeroFloorStacks.sort((x, y) => x.assignableSpacesPercentage - y.assignableSpacesPercentage);
		} else {
			sortedEvalArr = nonZeroFloorStacks.sort((x, y) => x.percentage - y.percentage);
		}
		return sortedEvalArr[0];
	}

	_getStackObjectPath(stack, stacks) {
		let building = stack.building;
		let floor = stack.floor;
		let buildingIndex = stacks.buildings.findIndex(x => x._id == building.id);
		let floorIndex = stacks.buildings[buildingIndex].floors.findIndex(x => x._id == floor.id);
		return "stacksInit.buildings." + buildingIndex + ".floors." + floorIndex;
	}

	resetScaleSlider() {
		this.set('_scaleSliderValue', 1);
		this.set('_smallestBlockPercentage', null);
		this.set('_pathToMinPercentage', null);
	}

	handleAdHocDemandAdded() {
		this._computeMaxFloorArea(this.stacksInit.buildings);
		this._setBuildingOrgs(this._selectedBuildingIndex, this.stacksInit.buildings);
	}

	_setBuildingOrgs(index, buildings) {
		if (!assertParametersAreDefined(arguments)) {
			return [];
		}
		const building = buildings[index];
		this.set('_buildingOrgs', building ? Object.assign([], buildings[index].orgs): []);
	}

	_updateBuildingOrgs(sourceBuildingIndex, targetBuildingIndex, sourceModel) {
		if (sourceBuildingIndex != targetBuildingIndex) {
			const sourceBuilding = this.stacksInit.buildings[sourceBuildingIndex];
			const targetBuildingOrgFoundIndex = this.stacksInit.buildings[targetBuildingIndex].orgs.findIndex(org => {
				return org.path == sourceModel.orgPath.value;
			})
			if (targetBuildingOrgFoundIndex < 0) {
				const sourceBuildingOrgFoundIndex = sourceBuilding.orgs.findIndex(org => org.path == sourceModel.orgPath.value);
				this.push(`stacksInit.buildings.${targetBuildingIndex}.orgs`, sourceBuilding.orgs[sourceBuildingOrgFoundIndex]);
				this.stacksInit.buildings[targetBuildingIndex].orgs = this.stacksInit.buildings[targetBuildingIndex].orgs.sort(compareOrgs);
				this._setBuildingOrgs(this._selectedBuildingIndex, this.stacksInit.buildings);
			}
			
			let stacks = [];
			sourceBuilding.floors.forEach(floor => {
				stacks.push(floor.stacks);
			});
			stacks = [].concat(...stacks);
			const sourceBuildingHasOrg = stacks.some(stack => {
				return stack.orgPath.value == sourceModel.orgPath.value;
			})
			if (!sourceBuildingHasOrg) {
				const sourceOrgIndex = sourceBuilding.orgs.findIndex(org => org.path == sourceModel.orgPath.value);
				this.splice(`stacksInit.buildings.${sourceBuildingIndex}.orgs`, sourceOrgIndex, 1);
			}
		}
	}

	_getBuildingId(index, buildings) {
		if (!assertParametersAreDefined(arguments)) {
			return null;
		}
		return buildings[index]._id;
	}

	_setTableContainerWidth() {
		let container = this.shadowRoot.querySelector("#stacks");
		if (container) {
			let containerWidth = container.getBoundingClientRect().width;
			if (containerWidth > 0 && (!this._tableContainerWidth || (this._tableContainerWidth && this._tableContainerWidth != containerWidth))) {
				this.set('_tableContainerWidth', containerWidth);
			}
		}
	}
	
	_handleComputeSmallestBlock(e) {
		let isViewSpaceClass = e.detail.viewSpaceClass;
		this.set('_isViewSpaceClass', isViewSpaceClass);

		let supposedSmallestBlockWidthPx = e.detail.smallestBlockWidthPx;
		if (isViewSpaceClass && supposedSmallestBlockWidthPx) {
			if (this._scaleSliderValue > 1) {
				supposedSmallestBlockWidthPx = supposedSmallestBlockWidthPx / this._scaleSliderValue;
			}
			if (supposedSmallestBlockWidthPx < this._smallestBlockWidthPx) {
				this.set('_smallestBlockWidthPx', supposedSmallestBlockWidthPx);
			}
		}
	}

	_computeScaleSliderProperties(isViewSpaceClass, tableContainerWidth, smallestBlockPercentage, scaleSliderValue) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		this._setTableWidth(tableContainerWidth, scaleSliderValue); 
		if (!isViewSpaceClass) {
			this._setSmallestBlockWidthPx(tableContainerWidth, smallestBlockPercentage);
		}
	}

	_setTableWidth(containerWidth, scaleSliderValue) {
		let tableWidth = containerWidth * scaleSliderValue;
		if (tableWidth != this._tableWidth) {
			this.set('_tableWidth', (scaleSliderValue == 1) ? "auto" : tableWidth);
		}
	}

	_handleSmallestBlockWidthPxChanged(smallestBlockWidthPx, oldValue) {
		if (smallestBlockWidthPx != oldValue) {
			this._setScaleSliderMax(smallestBlockWidthPx);
		}
	}

	_setSmallestBlockWidthPx(containerWidth, smallestBlockPercentage) {
		if (smallestBlockPercentage > 0) {
			let smallestBlockWidthPx = containerWidth * (smallestBlockPercentage / 100);
			if (smallestBlockWidthPx != this._smallestBlockWidthPx) {
				this.set('_smallestBlockWidthPx', smallestBlockWidthPx);
			}
		}
	}

	_setSmallestBlockWidthPxToScale(smallestBlockWidthPx, scaleSliderValue) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		let smallestBlockWidthPxToScale = smallestBlockWidthPx * scaleSliderValue;
		if (smallestBlockWidthPxToScale != this._smallestBlockWidthPxToScale) {
			this.set('_smallestBlockWidthPxToScale', smallestBlockWidthPxToScale);
		}
	}

	_setScaleSliderMax(smallestBlockWidthPx) {
		let max = smallestBlockWidthPx > 0 ? MIN_BLOCK_PX_WIDTH / smallestBlockWidthPx : 0;
		let roundedMax = Math.round(max * 10) / 10;
		if (roundedMax != this._scaleSliderMax) {
			if (roundedMax > SCALE_SLIDER_MIN_MAX) {
				this.set('_scaleSliderMax', roundedMax);
			} else {
				this.set('_scaleSliderMax', SCALE_SLIDER_MIN_MAX);
			}
		}
	}

	_yesThereIsAtLeastOneBlockThatIsSmallerThan15px(smallestBlockWidthPxToScale) {
		let display = (Math.round(smallestBlockWidthPxToScale) < MIN_BLOCK_PX_WIDTH);
		if (display) this._getStackFlyout().flyoutNotifyResize();
		return display;
	}

	_setMaxZoom() {
		this.set('_scaleSliderValue', this._scaleSliderMax);
	}

	_onDragOverToolbar(event) {
		event.preventDefault();
		if (this._buildingFloorTable.scrollTop > 0) {
			this._buildingFloorTable.scrollTop -= 3;
		}
	}

	_onStackHover(event) {
		event.stopPropagation();
		if (event.detail.hover) {
			this.set("_singleStackHoverOrg", event.detail.orgPath);
		} else {
			this.set("_singleStackHoverOrg", null);
		}
	}

	_observeSelectedBuildingIndex() {
		afterNextRender(this, () => {
			const buildingStackComp = this.$.stacks.querySelector(".iron-selected");
			const buildingStacks = (this.stacksInit && this.stacksInit.buildings) ? this.stacksInit.buildings : [];
			if (buildingStackComp && buildingStacks && buildingStacks.length > 0) {
				this.notifyResize();
			}
		});
	}
}

window.customElements.define(StackPlanComp.is, StackPlanComp);