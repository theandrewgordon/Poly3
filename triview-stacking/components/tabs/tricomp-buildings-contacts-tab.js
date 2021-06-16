/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../triblock-tabs/triblock-tabs.js";

class TricompBuildingsContactsTab extends PolymerElement {
	static get is() { return "tricomp-buildings-contacts-tab"; }

	static get template() {
		return html`
			<style>
				triblock-tabs{
					--triblock-tabs-background-color: var(--ibm-neutral-2);
					--triblock-tab-background-color: var(--ibm-neutral-2);
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
					margin-left: 20px;
					margin-right: 20px;
					--triblock-tab-paper-badge-icon-color: var(--tri-danger-color);
 					--triblock-tab-paper-badge-background: var(--tri-primary-content-background-color);
				}
			</style>

			<triblock-tabs hide-scroll-buttons selected="{{selectedTab}}">
				<triblock-tab id="buildingsTab" label="Buildings" slot="tab" badge-max-number="99" badge-number="{{selectedBuildings.length}}">
				</triblock-tab>
				<triblock-tab id="contactsTab" label="Contacts" slot="tab" badge-icon="{{_errorIndicatorIcon}}" badge-max-number="99" badge-number="{{_selectedContactsCount}}">
				</triblock-tab>
			</triblock-tabs>
		`
	}

	static get properties() {
		return {
			selectedTab: {
				type: String,
				notify: true,
				value: "buildingsTab"
			},

			selectedBuildings: {
				type: Array,
				notify: true
			},

			_selectedContactsCount: {
				type: Number,
				notify: true
			},

			_errorIndicatorIcon: {
				type: String
			}
		}
	}

	displayInvalid(count, invalid) {
		this.set("_errorIndicatorIcon", (invalid) ? "icons:error" : "")
		this.set("_selectedContactsCount", count);
	}
}

window.customElements.define('tricomp-buildings-contacts-tab', TricompBuildingsContactsTab);