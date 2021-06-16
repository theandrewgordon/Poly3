/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { MutableData } from "../../../@polymer/polymer/lib/mixins/mutable-data.js";
import { templatize } from "../../../@polymer/polymer/lib/utils/templatize.js";
import { Base } from "../../../@polymer/polymer/polymer-legacy.js";
import "../../../@polymer/iron-meta/iron-meta.js";
import { getModuleUrl, addCustomStyle } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";

/*
 * Component that generates the element that is displayed when dragging a task.
 * The drag image element must be attached to the dom to be displayed by the browser whem the drag starts.
 * But at the same time the must not be visible by the user until the drag starts, so it is set with z-index = -1, do it will be not visible.
 * If the drag element is hidden behind another element that contains visible elements, Safari will also display the elements in front of the drag element. 
 * To overcome this issues, the drag element is places in a part of the page that there is no other element in front of it.
 * Firefox has a bug when setting a drag image that is inside the shadow-dom of another element or if the drag elememt uses shadow dom. Because of that, 
 * the drag element is added to the main document as a simple div.
 */
export class TricompTaskDragImage extends MutableData(PolymerElement) {
	static get is() { return "tricomp-task-drag-image"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					display: none;
				}
			</style>
			<template id="dragImageTemplate">
				<div id="dragImageContainer" class="drag-image">
					<div id="dragImageContainerIcon" class="drag-image-icon"></div>
					<div class="drag-image-text-container">
						<div class="drag-image-text">Assign Task</div>
						<div class="drag-image-id-container">
							<dom-repeat items="[[_displayableIds]]">
								<template>
									<div>[[item]]</div>
								</template>
							</dom-repeat>
						</div>
					</div>
				</div>
			</template>
		`;
	}
	
	static get properties() {
		return {
			tasks: {
				type: Array
			},

			_displayableIds: {
				type: Array
			},

			_meta: {value: Base.create("iron-meta", {type: "iconset"})}
		};
	}

	static get observers() {
		return [
			"_handleTasksChange(tasks.*)"
		]
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		let dragImageElement = document.querySelector("#dragImageContainer");
		if (dragImageElement) {
			document.body.removeChild(dragImageElement);
		}
		this._dragImageElement = null;
	}

	getDragImageElement(top, left) {
		if (!this._dragImageElement) {
			const dragImageTemplate = this.$.dragImageTemplate;
			const DragImageTemplateClass = templatize(dragImageTemplate, this, {
				mutableData: true,
				forwardHostProp: function (prop, value) {
					let instance = this._dragElementInstance;
					if (!instance) return;
					instance.forwardHostProp(prop, value);
				}
			});
			this._dragElementInstance = new DragImageTemplateClass(null);
			document.body.appendChild(this._dragElementInstance.root);
			this._dragImageElement = document.querySelector("#dragImageContainer");
			const iconset = this._meta.byKey("ibm-glyphs");
			iconset.applyIcon(document.querySelector("#dragImageContainerIcon"), "drag-handle");
			this._dragImageElement.style.left = left + "px";
			this._dragImageElement.style.top = top + "px";
		}
		return this._dragImageElement;
	}

	_handleTasksChange(tasksChange) {
		let displayableIds = [];
		if (tasksChange && tasksChange.base) {
			for (let i = 0; i < tasksChange.base.length && i < 4; i++) {
				displayableIds[i] = i < 3 ? tasksChange.base[i].id : "...";
			}
		}
		this._displayableIds = displayableIds;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-list/tricomp-task-drag-image.js");
	}
}

window.customElements.define(TricompTaskDragImage.is, TricompTaskDragImage);

const taskDragImageStyle = `
<style>
	.drag-image {
		z-index: -1;
		position: absolute;
		background-color: var(--ibm-purple-60);
		color: white;
		display: flex;
		flex-direction: row;
		padding: 10px 20px 10px 0px;
		border-radius: 10px;
		align-items: center;
	}

	.drag-image-icon {
		width: 24px;
		height: 24px;
		fill: white;
	}

	.drag-image-text-container {
		flex-direction: row;
		display: flex;
	}
	
	.drag-image-id-container {
		flex-direction: column;
		display: flex;
		align-items: flex-end;
	}

	.drag-image-text::after {
		content: " ";
		padding: 2px;
	}
</style>
`;
addCustomStyle(taskDragImageStyle);