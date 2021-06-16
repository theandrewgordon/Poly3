/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../components/accordion/tricomp-content-accordion.js";
import "../../services/triservice-room-filters.js";
import "../../styles/tristyles-carbon-theme.js"
import "./tricomp-filter-item.js";

class TricompFiltersList extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-filters-list"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					display: block;
				}

				tricomp-filter-item {
					margin-top: 4px;
					margin-bottom: 4px;
				}
				:host([dir="ltr"]) tricomp-filter-item {
					float: left;
					margin-right: 8px;
				}
				:host([dir="rtl"]) tricomp-filter-item {
					float: right;
					margin-left: 8px;
				}
			</style>

			<triservice-room-filters all-filters="{{_allFilters}}"></triservice-room-filters>

			<dom-if if="[[_hasOneFilter(_allFilters)]]" restamp>
				<template>
					<dom-repeat items="[[_allFilters]]">
						<template>
							<tricomp-filter-item filter="[[item]]"></tricomp-filter-item>
						</template>
					</dom-repeat>
				</template>
			</dom-if>

			<dom-if if="[[!_hasOneFilter(_allFilters)]]" restamp>
				<template>
					<tricomp-content-accordion>
						<div slot="accordion-header" class="label-01">Show [[_allFilters.length]] applied filters</div>
						<div slot="accordion-content">
							<dom-repeat items="[[_allFilters]]">
								<template>
									<tricomp-filter-item filter="[[item]]"></tricomp-filter-item>
								</template>
							</dom-repeat>
						</div>
					</tricomp-content-accordion>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			_allFilters: {
				type: Array
			}
		};
	}

	_hasOneFilter(allFilters) {
		return allFilters && allFilters.length === 1;
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/filters-list/tricomp-filters-list.js");
	}
}

window.customElements.define(TricompFiltersList.is, TricompFiltersList);