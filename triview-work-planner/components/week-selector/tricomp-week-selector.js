/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../../triplat-icon/triplat-icon.js";
import { TriDateUtilities } from "../../../triplat-date-utilities/triplat-date-utilities.js";
import "../../services/triservice-work-planner.js";
import "../../styles/tristyles-work-planner.js";
import { formatDate } from "../../utils/triutils-date.js";

class TricompWeekSelector extends mixinBehaviors([TriDateUtilities], PolymerElement) {
	static get is() { return "tricomp-week-selector"; }

	static get template() {
		return html`
		<style include="work-planner-shared-styles tristyles-theme">
			:host {
				@apply --layout-horizontal;
				@apply --layout-center;
				height: 35px;
			}

			:host([small-layout]) {
				height: 45px;
			}

			.week-date {
				font-size: 18px;
				font-weight: 100;
				height: 35px;
				line-height: 35px;
				min-width: 200px;
				text-align: center;
			}

			:host([small-layout]) .expand-button {
				height: 45px;
				width: 45px;
				padding:15px;
			}
		</style>

		<triservice-work-planner current-user="{{_currentUser}}"></triservice-work-planner>

		<paper-icon-button class="expand-button" icon="ibm-glyphs:back" on-tap="_previous" primary></paper-icon-button>
		<span class="week-date">[[_formatDate(startDate, _currentUser)]] - [[_formatDate(endDate, _currentUser)]]</span>
		<paper-icon-button class="expand-button" icon="ibm-glyphs:expand-open" on-tap="_next" primary></paper-icon-button>
		`;
	}

	static get properties() {
		return {

			startDate: {
				type: String,
				notify: true
			},

			endDate: {
				type: String,
				notify: true
			},

			smallLayout: {
				type: Boolean,
				reflectToAttribute: true
			},

			_currentUser: {
				type: Object
			},
		};
	}

	_formatDate(date, currentUser) {
		if (!date || !currentUser) {
			return "";
		}
		return formatDate(date, currentUser._DateFormat, currentUser._Locale);
	}

	_next() {
		this.startDate = moment(this.startDate).utc().add(1, "weeks").toISOString();
		this.endDate = moment(this.endDate).utc().add(1, "weeks").toISOString();
	}

	_previous() {
		this.startDate = moment(this.startDate).utc().subtract(1, "weeks").toISOString();
		this.endDate = moment(this.endDate).utc().subtract(1, "weeks").toISOString();
	}
}

window.customElements.define(TricompWeekSelector.is, TricompWeekSelector);