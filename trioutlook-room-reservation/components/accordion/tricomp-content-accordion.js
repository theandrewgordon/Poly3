/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import "../../../@polymer/iron-collapse/iron-collapse.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";

import "../../styles/tristyles-carbon-theme.js";

class TricompContentAccordion extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-content-accordion"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-horizontal;
				}

				#content {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				:host([dir="ltr"]) #content {
					margin-right: 15px;
				}
				
				:host([dir="rtl"]) #content {
					margin-left: 15px;
				}

				.accordion-header ::slotted(*) {
					padding: 4px 0;
				}

				paper-icon-button {
					@apply --layout-horizontal;
					height: 15px;
					width: 15px;
					margin: 5px 0;
					padding: 0;
				}

				:host(:not([opened])) paper-icon-button {
					transform: rotate(90deg);
				}

				:host([opened]) paper-icon-button {
					transform: rotate(270deg);
				}
			</style>

			<div id="content">
				<iron-collapse class="accordion-header" opened="[[!opened]]">
					<slot name="accordion-header"></slot>
				</iron-collapse>

				<iron-collapse opened="[[opened]]">
					<slot name="accordion-content"></slot>
				</iron-collapse>
			</div>
			<paper-icon-button icon="ibm-glyphs:expand-open" on-tap="_handleToggleCollapse"></paper-icon-button>
		`;
	}

	static get properties() {
		return {
			opened: {
				type: Boolean,
				value: false,
				notify: true,
				reflectToAttribute: true,
				observer: "_observeOpened"
			}
		};
	}

	_handleToggleCollapse(e) {
		e.stopPropagation();
		this.opened = !this.opened;
	}

	_observeOpened(opened) {
		this.$.content.setAttribute("aria-expanded", opened ? "true" : "false");
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/accordion/tricomp-content-accordion.js");
	}
}

window.customElements.define(TricompContentAccordion.is, TricompContentAccordion);