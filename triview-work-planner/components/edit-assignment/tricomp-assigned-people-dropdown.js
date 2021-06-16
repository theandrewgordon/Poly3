/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { animationFrame } from "../../../@polymer/polymer/lib/utils/async.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/paper-button/paper-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../services/triservice-work-planner.js";
import "../../services/triservice-people.js";
import "../../services/triservice-task-assignment.js";
import "../../services/triservice-security.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "./tricomp-assigned-people-card.js";
import "../../styles/tristyles-work-planner.js";
import "./tricomp-assign-people-popup.js";

class TricompAssignedPeopleDropdown extends mixinBehaviors([TriDirBehavior], TrimixinDropdown(PolymerElement)) {
	static get is() { return "tricomp-assigned-people-dropdown"; }

	static get template() {
		return html`
			<style include="work-planner-dropdown-styles tristyles-theme">
				.content {
					border-radius: 4px;
				}

				.content-title {
					padding-bottom: 5px;
				}

				.arrow:after, .arrow:before {
					border: solid transparent;
					content: " ";
					height: 0;
					width: 0;
					position: absolute;
					pointer-events: none;
				}

				.arrow:after {
					border-width: 10px;
					right: 11px;
				}

				.arrow:before {
					border-width: 11px;
					right: 10px;
				}

				.arrow.up:after, .arrow.up:before {
					bottom: 100%;
					margin-bottom: -1px;
				}

				.arrow.up:after {
					border-bottom-color: var(--primary-background-color);
				}

				.arrow.up:before {
					border-bottom-color: var(--ibm-gray-30);
				}

				.arrow.down:after, .arrow.down:before {
					top: 100%;
					margin-top: -1px;
				}

				.arrow.down:after {
					border-top-color: var(--primary-background-color);
				}

				.arrow.down:before {
					border-top-color: var(--ibm-gray-30);
				}

				.button-row {
					@apply --layout-horizontal;
					@apply --layout-justified;
					border-top: 1px solid var(--tri-primary-content-accent-color);
					padding: 15px 5px 0px 5px;
					flex-shrink: 0;
				}

				.close-btn {
					@apply --layout-horizontal;
					@apply --layout-start-justified;
					color: var(--tri-primary-icon-button-color);
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px;
				}

				.close-btn:hover {
					color: var(--tri-primary-icon-button-hover-color);
				}

				.close-btn:hover > span {
					text-decoration: underline;
				}

				.close-btn[pressed] {
					color: var(--tri-primary-icon-button-press-color);
				}

				#dropdownContent[hide-list] > tricomp-assigned-people-card {
					display: none;
				}

				paper-button.add-btn {
					@apply --layout-horizontal;
					margin: 0px;
					padding: 7px 12px;
				}
				
				paper-button.add-btn > iron-icon {
					height: 16px;
					width: 16px;
				}

				:host([dir="ltr"]) paper-button.add-btn > iron-icon {
					padding-left: 10px;
				}

				:host([dir="rtl"]) paper-button.add-btn > iron-icon {
					padding-right: 10px;
				}
			</style>

			<triservice-work-planner current-user="{{_currentUser}}"></triservice-work-planner>
			<triservice-task-assignment id="taskAssignmentService" allocated-people="{{_allocatedPeople}}"></triservice-task-assignment>
			<triservice-people id="peopleservice"  selected-member="{{_selectedMember}}"></triservice-people>
			<triservice-security can-unassign="{{_canUnassign}}" can-assign="{{_canAssign}}"></triservice-security>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll horizontal-align="right"
				vertical-offset="32" horizontal-offset="-10" opened="{{_opened}}"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" on-iron-overlay-opened="_handleDropdownOpened"
				scroll-action="[[_scrollAction]]">

				<div id="dropdownContent" slot="dropdown-content" class="content arrow" hide-list$=[[_hidePeopleList]]>
					<div class="content-title">People assigned to this task:</div>
					<dom-repeat as="people" id="peopleDomRepeat">
						<template>
							<tricomp-assigned-people-card people="[[people]]" current-user="[[_currentUser]]"
								on-remove-assignment="_handleRemoveAssignment" disable-unassign="[[!_canUnassign]]">
							</tricomp-assigned-people-card>
						</template>
					</dom-repeat>
					<div class="button-row">
						<paper-button class="close-btn tri-disable-theme" on-tap="_handleCloseTap"><span>Close</span></paper-button>
						<paper-button class="add-btn" on-tap="_handleAddTap" disabled="[[!_canAssign]]"><span>Add</span><iron-icon icon="ibm-glyphs:add-new"></paper-button>
					</div>
				</div>
			</iron-dropdown>

			<tricomp-assign-people-popup id="assignPeoplePopup" task="[[_task]]"></tricomp-assign-people-popup>
		`;
	}

	static get properties() {
		return {
			_closeAfterSelectedMemberRemoval: {
				type: Boolean,
				value: false
			},

			_currentUser: {
				type: Object
			},

			_allocatedPeople: {
				type: Array
			},

			_hidePeopleList: {
				type: Boolean,
				value: false
			},

			_selectedMember: {
				type: Object
			},

			_task: {
				type: Object
			},

			_canUnassign: {
				type: Boolean
			},

			_canAssign: {
				type: Boolean
			}
		};
	}

	static get observers() {
		return [
			"_handleAllocatedPeopleChanged(_allocatedPeople.*)",
			"_observeStyleChangeWhenOpened(_opened)"
		]
	}

	ready() {
		super.ready();
		this._styleDropdownObserver = new MutationObserver(this._handleDropdownStyleChanged.bind(this));
	}

	toggle(fitInto = window, scrollContainer, targetElement, task, closeAfterSelectedMemberRemoval) {
		if (!this._opened || this._targetElement != targetElement) {
			this._hidePeopleList = true;
			this._task = task;
			this._closeAfterSelectedMemberRemoval = closeAfterSelectedMemberRemoval;

			this.$.taskAssignmentService.refreshAllocatedPeople(task._id)
				.then(() => this._hidePeopleList = false)
				.catch(() => this._hidePeopleList = false);

			this._targetElement = targetElement;
			this._fitInto = fitInto;
			this._scrollContainer = scrollContainer;
			this.$.dropdown.open();
		} else {
			this.$.dropdown.close();
		}
	}

	_handleDropdownOpened(e) {
		this.$.dropdown.notifyResize();
	}

	_handleCloseTap(e) {
		e.stopPropagation();
		this.$.dropdown.close()
	}

	_observeStyleChangeWhenOpened(newOpened) {
		if (!this._styleDropdownObserver) {
			return;
		}
		if (newOpened) {
			this._styleDropdownObserver.observe(this.$.dropdown, { attributes : true, attributeFilter : ["style"] });
		} else {
			this._styleDropdownObserver.disconnect();
		}
	}

	_handleDropdownStyleChanged() {
		this._debounceDropdownStyleChanged = Debouncer.debounce(
			this._debounceDropdownStyleChanged,
			animationFrame,
			this._computeDropdownContentClasses.bind(this)
		);
	}

	_computeDropdownContentClasses() {
		const positionTargetRect = this.$.dropdown.positionTarget.getBoundingClientRect();
		const dropdownRect = this.$.dropdown.getBoundingClientRect();
		const classToAdd = dropdownRect.top > positionTargetRect.top ?  "up" : "down";
		this._addArrowClass(this.$.dropdownContent, classToAdd);
	}

	_addArrowClass(node, arrowClass) {
		const classToRemove = arrowClass == "up" ? "down" : "up";
		node.classList.remove(classToRemove);
		node.classList.add(arrowClass);
	}

	_handleRemoveAssignment(e) {
		this.$.taskAssignmentService.removeAllocatedPeople(this._task, e.detail.people);
	}

	_handleAllocatedPeopleChanged(allocatedPeopleChanges) {
		if (!allocatedPeopleChanges || allocatedPeopleChanges.path == "_allocatedPeople.length") return;
		
		if (this.$.peopleDomRepeat.items != allocatedPeopleChanges.value) {
			this.$.peopleDomRepeat.notifyPath(allocatedPeopleChanges.path.replace("_allocatedPeople", "items"), allocatedPeopleChanges.value);
			setTimeout(this.$.dropdown.notifyResize.bind(this.$.dropdown), 10);
		}
		const selectedMember = this._selectedMember;
		if (this._closeAfterSelectedMemberRemoval && selectedMember && allocatedPeopleChanges.base) {
			const removedIndex = this._getRemovedIndex(allocatedPeopleChanges);
			const selectedMemberIndex = allocatedPeopleChanges.base.findIndex((item) => item.peopleRecordID == selectedMember._id);
			if (removedIndex >= 0 && selectedMemberIndex < 0) {
				this.$.dropdown.close();
			}
		}
	}

	_getRemovedIndex(changes) {
		if (changes.path.indexOf(".splices") < 0) {
			return -1;
		}
		for (let i = 0; i < changes.value.indexSplices.length; i++) {
			const indexSplice = changes.value.indexSplices[i];
			if (indexSplice.removed && indexSplice.removed.length > 0) {
				return indexSplice.index;
			}
		}
		return -1;
	}

	_handleAddTap() {
		this.$.assignPeoplePopup.open();
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/edit-assignment/tricomp-assigned-people-dropdown.js");
	}
}

window.customElements.define(TricompAssignedPeopleDropdown.is, TricompAssignedPeopleDropdown);