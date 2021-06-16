/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";

class BuildingTabComp extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-building-tab"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
					font-weight: normal;
					padding: 20px 0;
				}

				.building-info {
					@apply --layout-relative;
					@apply --layout-horizontal;
					@apply --layout-center;
					max-width: 200px;
					cursor: pointer;
				}

				.building-name {
					padding: 10px 0;
				}

				.building-icon {
					--iron-icon-height: 44px;
					--iron-icon-width: 44px;
					min-width: 44px;
					min-height: 44px;
					border: 1px solid var(--ibm-gray-10);
				}
				:host([dir=ltr]) .building-icon {
					margin-right: 10px;
				}
				:host([dir=rtl]) .building-icon {
					margin-left: 10px;
				}
			</style>

			<div class="building-info" title="[[building.name]]">
				<iron-icon class="building-icon" icon="ibm:buildings"></iron-icon>
				<span class="building-name">[[building.name]]</span>
			</div>
		`;
	}

	static get properties() {
		return {
			building: Object
		};
	}

	ready() {
		super.ready();
		this._setupDropZone(this);
	}

	_setupDropZone(el) {
		if (!el.ondragenter) el.ondragenter = this._onDragEnter.bind(this);
		if (!el.ondragover) el.ondragover = this._onDragOver.bind(this);
		if (!el.ondragleave) el.ondragleave = this._onDragLeave.bind(this);
		if (!el.ondrop) el.ondrop = this._onDrop.bind(this);
	}

	_onDragEnter(event) {
		event.preventDefault();
		this.dispatchEvent(new CustomEvent("dragging-over", { detail: { draggingOver: true }, bubbles: true, composed: true }));
	}

	_onDragOver(event) {
		event.preventDefault();
	}

	_onDragLeave(event) {
		event.preventDefault();
		this.dispatchEvent(new CustomEvent("dragging-over", { detail: { draggingOver: false }, bubbles: true, composed: true }));
	}

	_onDrop(event) {
		event.preventDefault();
	}
}

window.customElements.define(BuildingTabComp.is, BuildingTabComp);
