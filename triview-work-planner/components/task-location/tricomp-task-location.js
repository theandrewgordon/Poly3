/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

class TricompTaskLocation extends PolymerElement {
	static get is() { return "tricomp-task-location"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				.content {
					@apply --layout-horizontal;

					@apply --tricomp-task-location-content;
				}

				.divider {
					@apply --tricomp-task-location-divider;
				}
			</style>

			<div class="content" hidden$="[[_hideLocationSection(_building, _floor, _room, _location)]]">
				<div hidden$="[[!_hideAlternateLocation(_location)]]">
					<span hidden$="[[!_building]]">[[_building]]</span><span class="divider" hidden$="[[!_floor]]">[[divider]]</span><span hidden$="[[!_floor]]">[[_floor]]</span><span class="divider" hidden$="[[!_room]]">[[divider]]</span><span hidden$="[[!_room]]">[[_room]]</span>
				</div>

				<div id="altLocation" hidden$="[[_hideAlternateLocation(_location)]]">
					<span>[[_location]]</span>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			locationPath: {
				type: String
			},

			locationTypeEnUs: {
				type: String,
				value: ""
			},

			divider: {
				type: String,
				value: ", "
			},

			_building: {
				type: String,
				value: ""
			},

			_floor: {
				type: String,
				value: ""
			},

			_room: {
				type: String,
				value: ""
			},

			/**
			 * Location different from building, floor and room.
			 */
			_location: {
				type: String,
				value: ""
			}
		};
	}

	static get observers() {
		return [
			"_setLocation(locationPath, locationTypeEnUs)"
		]
	}

	/**
	 * Set the location based on the location path.
	 */
	_setLocation(location, type) {
		this.set("_building", "");
		this.set("_floor", "");
		this.set("_room", "");
		this.set("_location", "");
		
		if (location && location != "" && type && type != "") {
			var locationArray = location.trim().split("\\");
			var length = locationArray.length;

			if (type === "Building") {
				this.set("_building", (locationArray[length - 1]) ? locationArray[length - 1] : "");
			} else if (type === "Floor") {
				this.set("_building", (locationArray[length - 2]) ? locationArray[length - 2] : "");
				this.set("_floor", (locationArray[length - 1]) ? locationArray[length - 1] : "");
			} else if (type === "Space") {
				this.set("_building", (locationArray[length - 3]) ? locationArray[length - 3] : "");
				this.set("_floor", (locationArray[length - 2]) ? locationArray[length - 2] : "");
				this.set("_room", (locationArray[length - 1]) ? locationArray[length - 1] : "");
			} else {
				this.set("_location", (locationArray[length - 1]) ? locationArray[length - 1] : "");
			}
		}
	}

	/**
	 * Indicate when to hide the location section.
	 */
	_hideLocationSection(building, floor, room, location) {
		return !(building !== "" || floor !== "" || room !== "" || location !== "");
	}

	/**
	 * Indicate when to hide the alternate location string.
	 * This will make building, floor and room string visible.
	 */
	_hideAlternateLocation(location) {
		return location === "";
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-location/tricomp-task-location.js");
	}
}

window.customElements.define(TricompTaskLocation.is, TricompTaskLocation);