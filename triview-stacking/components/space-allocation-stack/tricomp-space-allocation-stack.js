/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";

import { assertParametersAreDefined } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";

import "../../services/triservice-stack-plan.js";
import "../../styles/tristyles-stacking.js";
import { isEquivalent, getFloorElem, hexToRgb, computePercentageValue, calcAreaAndPercentage} from "../../utils/triutils-stacking.js";

class SpaceAllocationStackComponent extends PolymerElement {
	static get is() { return "tricomp-space-allocation-stack"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host {
					height: 24px;
					@apply --layout-relative;
					@apply --layout-horizontal;
					@apply --layout-center;
					cursor: pointer;
					box-sizing: border-box;
				}
				:host([_high-luminance]) {
					--tricomp-space-allocation-stack-label-color: var(--tri-primary-content-color);
				}
				:host(:not([_high-luminance])) {
					--tricomp-space-allocation-stack-label-color: #FFFFFF;
				}

				#stack[draggable="true"] {
					cursor: grab;
					overflow-y: hidden;
				}

				:host([space-class-mode]) {
					height: 30px;
					border-right: 1px solid var(--tricomp-space-allocation-stack-label-color);
				}

				.drag-handle {
					color: white !important;
					--iron-icon-height: 16px;
					--iron-icon-width: 16px;
					visibility: hidden;
					padding-left: 2px;
					padding-right: 1px;
				}

				:host([_hover]) .drag-handle {
					visibility: visible;
				}

				:host([highlight]), :host([_hover]) {
					height: 30px;
				}

				:host([selected]) {
					height: 30px;
				}

				#stack {
					height: inherit;
					width: inherit;
					@apply --layout-flex;
					@apply --layout-horizontal;
					@apply --layout-center;
					overflow-x: hidden;
				}

				.dragging-active {
					background: repeating-linear-gradient(45deg, var(--ibm-gray-50), var(--ibm-gray-50) 1px, var(--ibm-gray-20) 1px, var(--ibm-gray-20) 5px);
				}

				.dropzone-active {
					outline: 2px solid rgb(118, 38, 121);
					border: 1px solid #FFFFFF;
					height: 30px;
				}

				.spaceclass-label {
					color: var(--tricomp-space-allocation-stack-label-color);
					font-size: 12px;
					white-space: nowrap;
				}
			</style>

			<triservice-stack-plan id="stackPlanService"></triservice-stack-plan>

			<div id="stack" title="[[title]]" on-mouseover="_handleHover" on-mouseleave="_handleHoverLeave" draggable=[[draggable]]>
				<template is="dom-if" if="[[!viewSpaceClass]]">
					<iron-icon icon="ibm-glyphs:drag-handle-small" class="drag-handle"></iron-icon>
					<template is="dom-if" if="[[spaceClassMode]]">
						<span class="spaceclass-label">[[spaceStack.spaceClass]]</span>
					</template>
				</template>
				<template id="spaceClassesTemplate" is="dom-if" if="[[viewSpaceClass]]">
					<template is="dom-repeat" items="[[_spaceClassStacksForDisplay]]" on-dom-change="_handleSpaceClassStacksDomChanged">
						<tricomp-space-allocation-stack 
							title="[[item.spaceClass]]"
							space-stack="[[item]]"
							on-tap="_onTapSelected"
							style\$="[[_computeSpaceClassStackWidth(item, spaceStack.areaAllocated, spaceStack.assignableSpacesAreaAllocated, assignableSpacesOnly)]]"
							draggable="true"
							color="[[color]]"
							space-class-mode>
						</tricomp-space-allocation-stack>
					</template>
				</template>
			</div>
		`;
	}
	
	static get properties() {
		return {
			spaceStack: {
				type: Object,
				observer: "_handleSpaceStackChange"
			},

			highlight: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			selected: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			showToScale: {
				type: Boolean
			},

			title: String,

			color: String,

			_hover: {
				type: Boolean,
				reflectToAttribute: true
			},
			_thisElement: Object,

			draggable: {
				type: String,
				value: function() { return "true"; }
			},
			
			viewSpaceClass: {
				type: Boolean,
				value: false,
				observer: "_handleViewSpaceClassChanged"
			},
			
			_spaceClassStacksForDisplay: Array,
			_stacksBySpaceClass: Array,
			_stacksBySpaceClassAssignable: Array,

			spaceClassMode: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			assignableSpacesOnly: Boolean,

			_highLuminance: {
				type: Boolean,
				reflectToAttribute: true,
				computed: "_computeHighLuminance(color)"
			}
		};
	}
	
	static get observers() {
		return [
			"_handleViewChange(assignableSpacesOnly, showToScale)"
		]
	}

	ready() {
		super.ready();
		let el = this.shadowRoot.querySelector("#stack");
		this._setupDraggable(this);
		if (!this.spaceClassMode) {
			this._setupDropZone(this);
		}
		this.set('_thisElement', this);
	}
	
	connectedCallback() {
		super.connectedCallback();
		if (!this.spaceClassMode) {
			this.show();
		}
	}	

	show() {
		const animation = this._thisElement.animate([
			{transform:'translateX(-75%)', opacity: 0, easing: 'ease-out'},
			{transform:'translateX(0%)', opacity: 1, easing: 'ease-in'}
		],
		{
			duration: 500,
		});
	}

	_handleHover(e) {
		e.stopPropagation();
		this.set('_hover', true);
		this.dispatchEvent(new CustomEvent("stack-hover", { detail: { hover: true, orgPath: this.spaceStack.orgPath.value }, bubbles: true, composed: true }));
	}

	_handleHoverLeave(e) {
		e.stopPropagation();
		this.set('_hover', false);
		this.dispatchEvent(new CustomEvent("stack-hover", { detail: { hover: false, orgPath: this.spaceStack.orgPath.value }, bubbles: true, composed: true }));

	}

	_setupDraggable(el) {
		el.ondragstart = this._onDragStart.bind(this);
		el.ondragend = this._onDragEnd.bind(this);
	}

	_onDragStart(event) {
		if (this.draggable == "true") {
			this.dispatchEvent(new CustomEvent("dragging", { detail: { dragging: true, allocationBlock: this.spaceStack }, bubbles: true, composed: true }));
			event.dataTransfer.setData("stack-org-path", this.spaceStack.orgPath.value); /* need .setData to work on FF ESR */
			let dragImageEl = this._createDragImageElement(event.currentTarget);
			event.dataTransfer.setDragImage(dragImageEl, 0, 0);
			event.dataTransfer.effectAllowed = "move";
			this._toggleDraggingClass(true);
		}
	}

	_createDragImageElement(ogElement) {
		let dragEl = document.createElement('div');
		dragEl.setAttribute('id', "tempDragImage");
		dragEl.style.backgroundColor = this.color;
		dragEl.style.width = ogElement.clientWidth + "px";
		dragEl.style.position = "absolute"; 
		dragEl.style.top = "0px"; 
		dragEl.style.left = "-" + (ogElement.clientWidth * 2) + "px";
		dragEl.style.height = "24px";
		dragEl.style.border = "1px solid #FFFFFF"
		document.body.appendChild(dragEl);
		return dragEl;
	}

	_removeDragImageElement() {
		let tempDragImageEl = document.getElementById("tempDragImage");
		if (tempDragImageEl) {
			tempDragImageEl.parentNode.removeChild(tempDragImageEl);
		}
	}

	_onDragEnd(event) {
		if (this.draggable == "true") {
			this.dispatchEvent(new CustomEvent("dragging", { detail: { dragging: false }, bubbles: true, composed: true }));
			this._toggleDraggingClass(false);
		}
		this._removeDragImageElement();
	}

	_setupDropZone(el) {
		if (!el.ondragenter) el.ondragenter = this._onDragEnter.bind(this);
		if (!el.ondragover) el.ondragover = this._onDragOver.bind(this);
		if (!el.ondragleave) el.ondragleave = this._onDragLeave.bind(this);
		if (!el.ondrop) el.ondrop = this._onDrop.bind(this);
	}

	_onDragEnter(event) {
		event.stopPropagation();
		event.dataTransfer.dropEffect = "move";
		this.dispatchEvent(new CustomEvent("dragging-over-block", { detail: { draggingOver: true, allocationBlock: this.spaceStack }, bubbles: true, composed: true }));
	}

	_onDragLeave(event) {
		event.stopPropagation();
		this.toggleDropZoneActive(false); 
		this.dispatchEvent(new CustomEvent("dragging-over-block", { detail: { draggingOver: false, allocationBlock: this.spaceStack }, bubbles: true, composed: true }));
	}

	_onDragOver(event) {
		event.preventDefault();
	}

	_onDrop(event) {
		event.stopPropagation();
		this.toggleDropZoneActive(false);
		this.dispatchEvent(new CustomEvent("block-drop", { detail: { allocationBlock: this.spaceStack }, bubbles: true, composed: true }));
		
		const floorElem = getFloorElem(event);
		if (floorElem) {
			floorElem.toggleDropZoneActive(false);
		}
	}

	_toggleDraggingClass(isDragging) {
		if (isDragging) {
			this.shadowRoot.querySelector("#stack").classList.add("dragging-active");
			this.set('_hover', false);
		} else {
			this.shadowRoot.querySelector("#stack").classList.remove("dragging-active");
		}
	}

	toggleDropZoneActive(active) {
		if (active) {
			this.shadowRoot.querySelector("#stack").classList.add("dropzone-active");
		} else {
			this.shadowRoot.querySelector("#stack").classList.remove("dropzone-active");
		}
	}

	mergeAnimate() {
		const animation = this._thisElement.animate([
			{transform:'scaleX(.01)', transformOrigin: 'left center', easing: 'ease-out'},
			{transform:'scaleX(1)', transformOrigin: 'left center', easing: 'ease-in'}
		],
		{
			duration: 500,
		});
		this._resetViewSpaceClassData();
	}

	_handleViewSpaceClassChanged(viewSpaceClass, oldValue) {
		if (viewSpaceClass != oldValue) {
			if (viewSpaceClass && this.spaceStack) {
				if (!this._stacksBySpaceClass) {
					const splitStacks = this.$.stackPlanService.splitBySpaceClass(this.spaceStack);
					const splitStacksAssignable = splitStacks.filter(stack => { return stack.assignable });
					this.set('_stacksBySpaceClass', splitStacks);
					this.set('_stacksBySpaceClassAssignable', splitStacksAssignable);
				}
				this.set('_spaceClassStacksForDisplay', this._computedSpaceStacksToView(this._stacksBySpaceClass, this._stacksBySpaceClassAssignable, this.assignableSpacesOnly));
				if (Object.keys(this.spaceStack.spaces).length == 1 && !this.spaceStack.parentStack) {
					afterNextRender(this, function() {
						this.dispatchEvent(new CustomEvent('open-single-space-class-flyout', {
							bubbles: true,
							composed: true
						}));
					});
				}
			}
			if (viewSpaceClass) {
				this._handleSpaceClassStacksDomChanged();
			} else {
				this.dispatchEvent(new CustomEvent("compute-smallest-block", { detail: { viewSpaceClass: this.viewSpaceClass, smallestBlockWidthPx: null }, bubbles: true, composed: true }));
			}
		}
	}

	_handleSpaceClassStacksDomChanged(e) {
		if (this.viewSpaceClass) {
			let blockEls = Array.prototype.slice.call(this.shadowRoot.querySelectorAll("tricomp-space-allocation-stack"));
			if (blockEls && blockEls.length > 0) {
				setTimeout(() => {
					let blockElsWidths = blockEls.map(block => block.getBoundingClientRect().width);
					let sortedBlockElsWidths = blockElsWidths.sort((x, y) => x - y);
					let smallestBlockWidth = sortedBlockElsWidths[0];
					this.dispatchEvent(new CustomEvent("compute-smallest-block", { detail: { viewSpaceClass: this.viewSpaceClass, smallestBlockWidthPx: smallestBlockWidth }, bubbles: true, composed: true }));
				}, 100);
			}
		}
	}

	_computeSpaceClassStackWidth(spaceClassStack, spaceStackAreaAllocated, spaceStackAssignableAreaAllocated, assignable) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		const area = assignable ? spaceClassStack.assignableSpacesAreaAllocated : spaceClassStack.areaAllocated;
		const total = assignable ? spaceStackAssignableAreaAllocated : spaceStackAreaAllocated;
		const width = computePercentageValue(area, total);
		return `width: ${width}%`;
	}

	_onTapSelected(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('stack-tapped', {detail:{ spaceStackElem: e.target, spaceClassMode: true }, bubbles: true, composed: true}));
	}

	_computedSpaceStacksToView(stacksBySpaceClass, stacksBySpaceClassAssignable, assignable) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		return assignable ? stacksBySpaceClassAssignable : stacksBySpaceClass;
	}

	_resetViewSpaceClassData() {
		this.set('_spaceClassStacksForDisplay', null);
		this.set('_stacksBySpaceClass', null);
		this.set('_stacksBySpaceClassAssignable', null);
	}

	removeSpaceClassStackFromViewData(spaceStack) {
		this.set('_spaceClassStacksForDisplay', null);
		const stackIndex = this._stacksBySpaceClass.findIndex(stack => {
			return isEquivalent(stack, spaceStack);
		});
		this._stacksBySpaceClass.splice(stackIndex, 1);
		this.set('_stacksBySpaceClass', Object.assign([], this._stacksBySpaceClass));

		if (spaceStack.assignable) {
			const stackIndexAssignable = this._stacksBySpaceClassAssignable.findIndex(stack => {
				return isEquivalent(stack, spaceStack);
			});
			this._stacksBySpaceClassAssignable.splice(stackIndexAssignable, 1);
			this.set('_stacksBySpaceClassAssignable', Object.assign([], this._stacksBySpaceClassAssignable));
		}
	}

	splitSpaceClassStackFromViewData(spaceStack, countToSplit) {
		const spaceClass = spaceStack.spaceClass;
		const stackIndex = this._stacksBySpaceClass.findIndex(stack => {
			return isEquivalent(stack, spaceStack);
		});
		const newStack = Object.assign({}, spaceStack);
		newStack.spaces = Object.assign({}, spaceStack.spaces);
		const newStackArea = newStack.spaces[spaceClass].area * (countToSplit / newStack.spaces[spaceClass].count);
		const newStackCount = countToSplit;
		newStack.spaces[spaceClass] = {
			area: newStackArea,
			assignable: spaceStack.spaces[spaceClass].assignable,
			count: newStackCount,
			spaceClassId: spaceStack.spaces[spaceClass].spaceClassId,
			spaceClassIdField: spaceStack.spaces[spaceClass].spaceClassIdField,
			uom: spaceStack.spaces[spaceClass].uom,
			spaceClass: spaceClass,
			building: spaceStack.spaces[spaceClass].building,
			floor: spaceStack.spaces[spaceClass].floor
		};
		
		spaceStack.spaces[spaceClass].area = spaceStack.spaces[spaceClass].area * (spaceStack.spaces[spaceClass].count - countToSplit) / spaceStack.spaces[spaceClass].count;
		spaceStack.spaces[spaceClass].count -= countToSplit;

		const [newArea, newPercentage] = calcAreaAndPercentage(newStack.spaces, newStack.floor.area);
		newStack.areaAllocated = newArea;
		newStack.percentage = newPercentage;

		const [area, percentage] = calcAreaAndPercentage(spaceStack.spaces, spaceStack.floor.area);
		spaceStack.areaAllocated = area;
		spaceStack.percentage = percentage;

		this._stacksBySpaceClass.splice(stackIndex, 0, newStack);
		this.set('_stacksBySpaceClass', Object.assign([], this._stacksBySpaceClass));

		if (spaceStack.assignable) {
			const stackIndexAssignable = this._stacksBySpaceClassAssignable.findIndex(stack => {
				return isEquivalent(stack, spaceStack);
			});

			newStack.assignableSpaces = Object.assign({}, newStack.spaces);
			spaceStack.assignableSpaces = Object.assign({}, spaceStack.spaces);

			newStack.assignableSpacesAreaAllocated = newArea;
			newStack.assignableSpacesPercentage = newPercentage;

			spaceStack.assignableSpacesAreaAllocated = area;
			spaceStack.assignableSpacesPercentage = percentage;

			this._stacksBySpaceClassAssignable.splice(stackIndexAssignable, 0, newStack);
			this.set('_stacksBySpaceClassAssignable', Object.assign([], this._stacksBySpaceClassAssignable));	
		}
		this._handleViewChange(this.assignableSpacesOnly, this.showToScale);
	}

	_handleViewChange(assignable, showToScale) {
		this.set('_spaceClassStacksForDisplay', this._computedSpaceStacksToView(this._stacksBySpaceClass, this._stacksBySpaceClassAssignable, this.assignableSpacesOnly));
	}

	_computeHighLuminance(color) {
		let luminance = 0;
		let rgb = hexToRgb(color);
		if (rgb) {
			luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
		}
		return luminance > 128;
	}

	_handleSpaceStackChange(value, oldValue) {
		if (oldValue) {
			this._resetViewSpaceClassData();
			this.show();
		}
	}
}

window.customElements.define(SpaceAllocationStackComponent.is, SpaceAllocationStackComponent);