/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../tricore-url/tricore-url.js";

class TricompPeopleImage extends PolymerElement {
	static get is() { return "tricomp-people-image"; }

	constructor() {
		super();
		this._tricoreUrl = document.createElement("tricore-url");
	}

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					position: relative;
					height: 45px;
					width: 45px;
					min-width: 45px;
				}

				.image {
					background-size: cover;
					background-position: center center;
					background-repeat: no-repeat;
					border-radius: 50%;
					border: 1px solid var(--tri-secondary-color);
					height: 43px;
					width: 43px;
					position: absolute;
					top: 0px;
					left: 0px;
					z-index: 1;
					@apply  --tricomp-people-image-size;
				}

				.name-initials {
					font-size: 20px;
					color: white;
					font-weight: bold;
					border-radius: 50%;
					border: 1px solid var(--tri-secondary-color);
					height: 43px;
					width: 43px;
					background-color: var(--ibm-magenta-60);
					@apply --layout-vertical;
					@apply --layout-center-center;
					@apply --tricomp-people-image-name;
				}
			</style>

			<dom-if if="[[_hasImage]]">
				<template>
					<div class="image" style\$="background-image: url('[[_computeImageSrc(image)]]')"></div>
				</template>
			</dom-if>
			<div class="name-initials">[[_computeInitials(firstName, lastName)]]</div>
		`;
	}
	
	static get properties() {
		return {
			image: {
				type: Object
			},

			firstName: {
				type: String
			},

			lastName: {
				type: String
			},

			_hasImage: {
				type: Boolean,
				computed: "_computeHasImage(image)"
			}
		};
	}

	_computeHasImage(image) {
		return image != null && image.length > 0;
	}

	_computeInitials(firstName, lastName) {
		return (firstName && firstName.length > 0 ? firstName.toUpperCase().charAt(0) : "") + (lastName && lastName.length > 0 ? lastName.toUpperCase().charAt(0) : "")
	}

	_computeImageSrc(image) {
		return this._tricoreUrl.getUrl(`/html/en/default/images/getImageThumbnail.jsp?fileLoc=${image}`);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/people-image/tricomp-people-image.js");
	}
}

window.customElements.define(TricompPeopleImage.is, TricompPeopleImage);