/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../triplat-icon/ibm-icons.js";
import "../triplat-image/triplat-image.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import { TriValidationBehavior } from "./tribehav-validation.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-horizontal;
					@apply --layout-start;
					border-top: 1px solid var(--ibm-gray-10);
					padding: 10px 0;
					flex-shrink: 0;
					margin-right: 1px;
					margin-left: 1px;
				}

				.user-photo {
					border-radius: 50%;
					border: 0;
					box-sizing: border-box;
					overflow: hidden;
					z-index: 2;
					--triplat-image-placeholder-icon: {
						height: 44px;
						width: 44px;
					}
				}

				:host([ltr]) .user-photo {
					margin-right: 10px;
				}

				:host([rtl]) .user-photo {
					margin-left: 10px;
				}

				.user-comment-photo {
					@apply --layout-flex;
					overflow-x: hidden;
					color: var(--ibm-gray-30);
				}

				:host(:not([small-screen])) .user-comment-photo {
					@apply --layout-vertical;
				}

				:host([small-screen]) .user-comment-photo {
					@apply --layout-vertical;
				}

				:host(:not([small-screen])) .user-and-date {
					@apply --layout-horizontal;
				}

				:host([ltr]:not([small-screen])) .user-and-date {
					padding-right: 20px;
				}

				:host([rtl]:not([small-screen])) .user-and-date {
					padding-left: 20px;
				}

				:host([small-screen]) .user-and-date {
					@apply --layout-horizontal;
				}

				.user-name {
					color: black;
				}

				.created-date {
					@apply --layout-flex;
					color: var(--ibm-gray-30);
				}

				:host([small-screen]) .created-date::before {
					padding-left: 5px;
					padding-right: 5px;
				}
				
				.comment-and-photo {
					@apply --layout-vertical;
					overflow-x: hidden;
					color: black;
					padding-top: 7px;
					padding-bottom: 7px;
				}

				.comment {
					text-align: justify;
					overflow-x: hidden;
					word-wrap: break-word;
				}

				.comment-photo {
					@apply --layout-self-start;
					cursor: pointer;
					margin: 5px 3px 3px 3px;
				}
			
		</style>

		<triplat-image class="user-photo" placeholder-icon="user-profile" src="[[comment.submitterImage]]" width="44" height="44" sizing="cover" thumbnail="" cache="">
		</triplat-image>

		<div class="user-comment-photo">
			<div class="user-and-date">
				<div class="user-name">[[comment.createdBy]]</div>&nbsp;on&nbsp;
				<div class="created-date">[[_convertDateTime(comment.createdDateTime, currentUser)]]</div>
			</div>

			<div class="comment-and-photo">
				<div class="comment" hidden\$="[[!comment.comment]]">[[comment.comment]]</div>

				<triplat-image id="commentImage" class="comment-photo" src="[[comment.photo]]" width="[[_computePhotoSize(smallScreen)]]" height="[[_computePhotoSize(smallScreen)]]" sizing="contain" on-tap="_handleCommentPhotoTap" hidden="[[!_hasPhoto(comment.photo)]]" tabindex="0" thumbnail="" cache="" aria-label="Attached photo image" role="link">
				</triplat-image>
				<iron-a11y-keys id="commentImageKey" target="[[commentImage]]" keys="enter" on-keys-pressed="_handleCommentPhotoTap"></iron-a11y-keys>
			</div>
		</div>
	`,

    is: "tricomp-comment",

    behaviors: [
		TriValidationBehavior,
		TriDateUtilities
	],

    properties: {
		comment: {
			type: Object
		},
		smallScreen: {
			type: Boolean,
			value: true
		},
		currentUser: Object,
	},

    attached: function() {
		var textDirectionValue = document.querySelector('body').getAttribute('dir');
		this.toggleAttribute(textDirectionValue, true, this);
	},

    _handleCommentPhotoTap: function() {
		this.fire("open-image-popup",this.comment);
	},

    _computePhotoSize: function(smallScreen) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return smallScreen ? 64 : 80;
	},

    _hasPhoto: function(photo) {
		return this._isValidString(photo);
	},

    _convertDateTime: function(dateTime, currentUser) {
		if (!assertParametersAreDefined(arguments)) {
		    return;
		}
		
		return this.formatDateWithTimeZone(dateTime, currentUser._TimeZoneId, 
				currentUser._DateTimeFormat, currentUser._Locale);
	}
});