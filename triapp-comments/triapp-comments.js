/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-tooltip/paper-tooltip.js";
import "../@polymer/paper-spinner/paper-spinner.js";
import "../@polymer/iron-icons/iron-icons.js";
import "../triplat-icon/triplat-icon.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../triplat-image/triplat-image.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../triblock-popup/triblock-popup.js";
import "./tricomp-comment.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				:host > * {
					flex-shrink: 0;
				}

				.comments-list {
					@apply --layout-vertical;
				}

				:host(:not([small-screen-width])) .comments-list {
					@apply --layout-flex;
					min-height: 100px;
					overflow: auto;
				}

				:host(:not([small-screen-width])) .comments-list > * {
					flex-shrink: 0;
				}

				.comment-add {
					@apply --layout-vertical;
				}

				.comment-add-textarea {
					border: 1px solid var(--ibm-gray-30);
					resize: none;
					outline: none;
					box-shadow: none;
					font-size: inherit;
					font-family: inherit;
					padding: 3px 6px;
				}

				.comment-add-actions {
					@apply --layout-horizontal;
					@apply --layout-justified;
					padding-top: 5px;
					padding-bottom: 10px;
					padding-top: 11px;
				}

				.comment-add-photo {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.comment-photo-uploading {
					width: 20px;
					height: 20px;
					padding: 8px
				}

				.comment-show-photo {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				:host([dir="ltr"]) .comment-photo {
					padding-right: 8px;
				}

				:host([dir="rtl"]) .comment-photo {
					padding-left: 8px;
				}

				.comment-add-button {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				paper-icon-button {
					flex-shrink: 0;
					padding: 0px;
					margin-right: 8px;
					width: 31px;
					height: 31px;
				}

				.comment-add-text {
					font-weight: bold;
				}

				.comment-add-text[disabled] {
					color: var(--paper-icon-button-disabled-text)!important;
					cursor: default!important;
				}

				.comment-add-text[disabled]:hover {
					text-decoration: none!important;
				}

				:host([small-screen-width])>.action-bar-space{
					height: 55px;
				}

				paper-button {
					margin: 0px !important;
					height: 35px;
					border-width: 2px !important;
				}

				:host([small-screen-width]) triblock-popup {
					padding: 20px 10px 0px 10px;
				}

			
		</style>

		<div class="comment-add" hidden\$="[[readOnly]]">
			<textarea class="comment-add-textarea" rows="3" placeholder="Enter your comment here and select the Post button" maxlength="250" value="{{_newComment.comment::input}}" aria-label="Comments and Photos" tri-scroll-into-view=""></textarea>

			<div class="comment-add-actions">
				<div class="comment-add-photo" on-tap="_onAddPhoto" hidden\$="[[_hasPhoto(_newComment.photo)]]">
					<paper-icon-button id="addPhotoButton" primary="" icon="ibm:picturefile" hidden="[[_photoUploading]]" alt="Attach a photo"></paper-icon-button>
					<span class="tri-link" hidden="[[_photoUploading]]">Attach a photo</span>
					<paper-spinner class="comment-photo-uploading" active="[[_photoUploading]]"></paper-spinner>
				</div>
				<div class="comment-show-photo" hidden\$="[[!_hasPhoto(_newComment.photo)]]">
					<triplat-image id="addPhoto" class="comment-photo" uploading="{{_photoUploading}}" src="{{_newComment.photo}}" width="54" height="54" sizing="contain" on-image-uploadfile-response="_handleUploadPhotoResponse" tabindex="0" thumbnail="" aria-label="Attached photo" role="img">
					</triplat-image>
					<paper-icon-button id="deletePhotoBtn" danger="" icon="ibm:remove-delete" on-tap="_onDeletePhoto" alt="Delete photo"></paper-icon-button>
					<paper-tooltip for="deletePhotoBtn" position="right" animation-delay="0" offset="5">
						Delete photo
					</paper-tooltip>
				</div>
				<div class="comment-add-button" on-tap="_onAddComment">
					<paper-button secondary="" disabled="[[_disableAddButton]]" id="postButton" aria-label="Post">Post</paper-button>
				</div>
			</div>
		</div>

		<template is="dom-if" if="[[_hasComments(comments)]]">
			<div class="comments-list">
				<template is="dom-repeat" items="[[comments]]" initial-count="3">
					<tricomp-comment class="comment-box" comment="{{item}}" current-user="[[currentUser]]" small-screen="[[smallScreenWidth]]" on-open-image-popup="_handleOpenImagePopup"></tricomp-comment>
				</template>
			</div>
		</template>

		<triblock-popup id="photoDialog" with-backdrop="[[!smallScreenWidth]]" small-screen-max-width="0px" aria-label="Attached photo">
			<triplat-image id="photoDialogImage" sizing="contain" cache="" thumbnail="[[_computePhotoDialogThumbnail(online, _isIOS)]]" aria-label="Attached photo" role="img">
			</triplat-image>
		</triblock-popup>

		<div class="action-bar-space"></div>
	`,

    is: "triapp-comments",

    behaviors: [
		TriBlockViewResponsiveBehavior, TriDirBehavior
	],

    properties: {

		currentUser: Object,

		readOnly: {
			type: Boolean,
			value: false
		},

		comments: {
			type: Array,
		},

		online: {
			type: Object,
			value: true
		},

		_newComment: {
			type: Object,
			value: function() {
				return this._createNewComment();
			}
		},

		_photoUploading: {
			type: Boolean,
			value: false
		},

		loading: {
			type: Boolean,
			value: false
		},

		_showComments: {
			type: Boolean,
			value: false
		},

		_disableAddButton: {
			type: Boolean,
			computed: "_computeDisableAddButton(loading, _photoUploading, _newComment.photo, _newComment.comment)"
		},

		_isIOS: {
			type: Boolean,
			value: function() {
				var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
				return iOS;
			}
		},

		_translatedMessages: {
			type: Object,
			value: function() {
				var __dictionary__invalidExcludeExtension = "Invalid file extension";
				var __dictionary__invalidIncludeExtension = "Invalid file extension";
				var __dictionary__invalidToSaveFile = "File is not valid for saving";
				var __dictionary__failAntiVirusScanResult = "Antivirus scan failed";
				var __dictionary__fileNotFound = "Fail to load the selected file for unknown reason";
				var __dictionary__invalidImageSize = "The file size exceeds the maximum of {size} MB";
				var __dictionary__invalidEmptyExtension = "Invalid file extension";
				var __dictionary__uploadFailed = "Upload failed";

				var _messages = {};
				_messages["invalidExcludeExtension"] = __dictionary__invalidExcludeExtension;
				_messages["invalidIncludeExtension"] = __dictionary__invalidIncludeExtension;
				_messages["invalidToSaveFile"] = __dictionary__invalidToSaveFile;
				_messages["failAntiVirusScanResult"] = __dictionary__failAntiVirusScanResult;
				_messages["fileNotFound"] = __dictionary__fileNotFound;
				_messages["invalidImageSize"] = __dictionary__invalidImageSize;
				_messages["uploadFailed"] = __dictionary__uploadFailed;
				_messages["invalidEmptyExtension"] = __dictionary__invalidEmptyExtension;
				return _messages;
			}
		}
	},

    observers: [
		"_observeNewComment(_newComment.*)"
	],

    createNewComment: function() {
		this._newComment = this._createNewComment();
	},

    _createNewComment: function() {
		return {
			comment: "",
			photo: null
		};
	},

    _onAddPhoto: function() {
		if (this._photoUploading) {
			return;
		}
		this.$.addPhoto.openFileSelection();
	},

    _onDeletePhoto: function() {
		this.$.addPhoto.clearImage();
	},

    _hasPhoto: function(photo) {
		return photo !=null && photo.length > 0;
	},

    _onAddComment: function() {
		if (this._disableAddButton) {
			return;
		}
		if(!this.online){
			this._newComment.createdDateTime = new Date().toISOString();
			this._newComment.createdBy = this.currentUser.fullName;
			this._newComment.submitterImage = this.currentUser.image;
		}
		this.fire('add-comment', {comment: this._newComment});
	},

    _hasComments: function(comments) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return comments !=null && comments.length > 0;
	},

    _computeLoading: function(_photoUploading) {
		return _photoUploading;
	},

    _computeDisableAddButton: function(loading, photoUploading, photo, comment) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return loading || photoUploading || (this._isEmpty(photo) && this._isEmpty(comment));
	},

    _isEmpty: function(value) {
		return 	value == null || value.length == 0
	},

    _handleOpenImagePopup: function(event) {
		event.stopPropagation();
		var comment = event.detail;
		if (this.smallScreenWidth) {
			this.$.photoDialogImage.width = window.innerWidth-60;//subtract the dialog padding
			this.$.photoDialogImage.height = window.innerHeight-100;//subtract the dialog padding and button height
		} else {
			this.$.photoDialogImage.width = window.innerWidth/2;
			this.$.photoDialogImage.height = window.innerHeight/2;
		}
		this.$.photoDialogImage.src = comment.photo;
		this.$.photoDialog.openPopup();
	},

    _observeNewComment: function() {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.fire('field-changed');
	},

    _handleUploadPhotoResponse: function(event) {
		if (event.detail.isFileLoaded == "FALSE") {
			var errorMessage = this._translatedMessages[event.detail.errorMessage];
			if (event.detail.errorMessage == "invalidImageSize") {
				this.$.addPhoto.getMaximumFileSizeForUpload().then(
					function(maxSize) {
						errorMessage = errorMessage.replace("{size}",  maxSize / (1024*1024));
						this.fire("error-alert", errorMessage);
					}.bind(this)
				);
			} else {
				errorMessage = errorMessage != null ? errorMessage : this._translatedMessages["uploadFailed"];
				this.fire("error-alert", errorMessage);
			}
		}
	},

    _computePhotoDialogThumbnail: function(online, isIOS) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !online && isIOS;
	}
});