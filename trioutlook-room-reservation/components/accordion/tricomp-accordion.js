/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-collapse/iron-collapse.js";
import "../../../@polymer/iron-icon/iron-icon.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";

import "../../styles/tristyles-carbon-theme.js";

class TricompAccordion extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-accordion"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-vertical;
				}

				#header {
					@apply --layout-center;
					@apply --layout-horizontal;
					font-size: 14px;
					padding: 10px 0;
					@apply --tricomp-accordion-header;
				}

				:host([dir="ltr"]) #header ::slotted(*) {
					margin-right: 15px;
				}
				
				:host([dir="rtl"]) #header ::slotted(*) {
					margin-left: 15px;
				}

				iron-icon {
					height: 15px;
					width: 15px;
					cursor: pointer;
					flex-shrink: 0;
				}

				:host(:not([opened])) iron-icon {
					transform: rotate(90deg);
				}

				:host([opened]) iron-icon {
					transform: rotate(270deg);
				}
			</style>

			<div id="header" class="body-short-01" role="button" aria-expanded="false">
				<dom-if if="[[title]]">
					<template>
						[[title]]
					</template>
				</dom-if>
				<slot name="accordion-header"></slot>
				<iron-icon icon="ibm-glyphs:expand-open" on-tap="_handleToggleCollapse"></iron-icon>
			</div>

			<iron-collapse id="collapse" opened="{{opened}}">
				<slot name="accordion-content"></slot>
			</iron-collapse>
		`;
	}

	static get properties() {
		return {
			title: {
				type: String
			},

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
		this.$.collapse.toggle();
	}

	_observeOpened(opened) {
		this.$.header.setAttribute("aria-expanded", opened ? "true" : "false");
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/accordion/tricomp-accordion.js");
	}
}

window.customElements.define(TricompAccordion.is, TricompAccordion);