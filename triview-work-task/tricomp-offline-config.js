/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-offline-manager/triplat-offline-manager.js";
import "../triplat-signout-button/triplat-signout.js";
import "../triplat-icon/ibm-icons.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/neon-animation/neon-animation.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "./tristyles-work-task-app.js";
import "./triservice-work-task.js";
import "./triservice-new-work-task.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, importJs } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

const importJsPromise = importJs(
    ["../web-animations-js/web-animations-next-lite.min.js"],
	"triview-work-task/tricomp-offline-config.js"
);

importJsPromise.then(() => {
    Polymer({
	    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				.offline-page {
					@apply --layout-vertical;
					@apply --layout-flex;
					overflow: auto;
					padding: 20px;
				}

				.page-header {
					font-weight: 300;
					border-bottom: 1px solid var(--ibm-gray-30);
					padding-bottom: 10px;
				}

				.row {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-top: 10px;
					padding-bottom: 10px;
				}

				:host([show-error]) {
					display: flex !important;
					@apply --layout-fit;
					background-color: white;
					z-index: 10;
				}

				:host([dir="ltr"]) label {
					padding-right: 10px;
				}

				:host([dir="rtl"]) label {
					padding-left: 10px;
				}

				.row-text {
					max-height: 150px;
					overflow: auto;
				}

				:host([dir="ltr"]) .icon {
					padding-right: 10px;
				}

				:host([dir="rtl"]) .icon {
					padding-left: 10px;
				}

				.icon {
					width: 22px;
					height: 22px;
					flex-shrink: 0;
				}

				.icon[error] {
					color: var(--tri-error-color);
				}

				.icon:not([error]) {
					color: var(--tri-success-color);
				}

				.even-row {
					background-color: var(--ibm-neutral-2);
				}

				.error-container  {
					@apply --layout-vertical;
				}

				.error-header {
					color: var(--tri-major-warning-color);
					font-weight: 300;
					border-bottom: 1px solid var(--ibm-gray-30);
					padding-bottom: 10px;
					padding-top: 10px;
				}

				.action-bar:not([small-layout]) {
					border-top: 1px solid var(--ibm-gray-30);
					padding-top: 10px;
				}
				
			
		</style>

		<triplat-signout id="signout"></triplat-signout>

		<triservice-work-task id="workTaskService" application-settings="{{_applicationSettings}}"></triservice-work-task>
		<triservice-work-task-base id="workTaskBaseService"></triservice-work-task-base>
		<triservice-new-work-task id="newWorkTaskService"></triservice-new-work-task>

		<template is="dom-if" if="[[!disableOffline]]">
			<triplat-offline-manager id="offlineManager" supported="{{_offlineSupported}}" installed="{{_installed}}" on-online-changed="_handleOnlineChanged" on-uploading-changed="_handleUploadingChanged" has-pending-actions="{{_hasPendingActions}}" on-downloading-changed="_handleDownloadingChanged" has-upload-error="{{_hasUploadError}}" upload-error="{{_uploadError}}" last-download="{{_lastDownload}}" config-dev-file="sw-config-dev.json" config-file="sw-config.json" on-download-success="_handleDownloadSuccess" on-download-error="_handleDownloadError" on-upload-success="_handleUploadSuccess" on-upload-error="_handleUploadError" download-callback="[[_boundDownloadCallback]]">
			</triplat-offline-manager>
		</template>

		<div class="offline-page">
			<div class="page-header tri-h2">Offline Status</div>
			<div class="row" hidden\$="[[!disableOffline]]">
				<iron-icon class="icon" error="" icon="ibm:status-error"></iron-icon>
				<div>Offline feature is disabled.</div>
			</div>
			<div class="row" hidden\$="[[!_showNotEnabledMessage]]">
				<iron-icon class="icon" error="" icon="ibm:status-error"></iron-icon>
				<div>Offline feature is not enabled in the Work Task application settings.</div>
			</div>
			<div class="row" hidden\$="[[!_showNotSupportedMessage]]">
				<iron-icon class="icon" error="" icon="ibm:status-error"></iron-icon>
				<div>Offline feature is not installed. The browser does not support it or the connection is not secure.</div>
			</div>
			<template is="dom-if" if="[[_installed]]">
				<div class="row">
					<iron-icon class="icon" icon="ibm:status-success"></iron-icon>
					<div>Offline feature is installed.</div>
				</div>
				<div class="row even-row">
					<label for="uploadErrorAction">Last download:</label>
					<div>[[_formatDate(_lastDownload, currentUser)]]</div>
				</div>
				<div class="error-container" hidden\$="[[!showError]]">
					<div class="error-header tri-h2">Upload Error</div>
					<div class="row">
						<div id="uploadErrorTaskID" class="row-text">An offline action by the user could not be uploaded.</div>
					</div>
					<div class="row even-row">
						<label for="uploadErrorAction">Action:</label>
						<div id="uploadErrorAction" class="row-text">[[_uploadError.appContext]]</div>
					</div>
					<div class="row">
						<label for="uploadErrorMessage">Error:</label>
						<div id="uploadErrorMessage" class="row-text">[[_uploadError.error.translatedMessage]]</div>
					</div>
				</div>
				<div class="action-bar" hidden\$="[[!online]]">
					<paper-button id="downloadButton" on-tap="_handleDownload" footer\$="[[smallLayout]]" hidden="[[_hasUploadError]]">Download Data</paper-button>
					<paper-button id="skipUploadErrorButton" on-tap="_handleSkipAction" footer\$="[[smallLayout]]" hidden="[[_hideSkipButton(_uploadError.error.errorType)]]">Skip Action</paper-button>
					<paper-button id="retryUploadButton" on-tap="_handleRetryUpload" footer\$="[[smallLayout]]" hidden="[[_hideRetryButton(_uploadError.error.errorType)]]">Retry</paper-button>
					<paper-button id="skipAllButton" on-tap="_handleSkipAllActions" footer\$="[[smallLayout]]" hidden="[[_hideSkipAllButton(_uploadError.error.errorType)]]">Skip All Actions</paper-button>
					<paper-button id="signoutButton" on-tap="_handleSignout" footer\$="[[smallLayout]]" hidden="[[_hideSignoutButton(_uploadError.error.errorType)]]">Sign Out</paper-button>
				</div>
			</template>
		</div>
	`,

	    is: "tricomp-offline-config",
	    behaviors: [ TriDateUtilities, TriDirBehavior],

	    properties: {
			online: {
				type: Boolean,
				value: true,
				notify: true,
				readOnly: true
			},

			currentUser: Object,

			_offlineSupported: {
				type: Boolean,
				value: false
			},

			_installed: {
				type: Boolean,
				value: false
			},

			uploading: {
				type: Boolean,
				value: false,
				notify: true,
				readOnly: true
			},

			downloading: {
				type: Boolean,
				value: false,
				notify: true,
				readOnly: true
			},

			_hasPendingActions: {
				type: Boolean,
				value: false,
				notify: true
			},

			_lastDownload: {
				type: Date
			},

			showHasPendingActions: {
				type: Boolean,
				value: false,
				notify: true,
				readOnly: true
			},

			disableOffline: {
				type: Boolean,
				value: false
			},

			_hasUploadError: {
				type: Boolean,
				value: false
			},

			_uploadError: {
				type: Object
			},

			showError: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
				readOnly: true,
				notify: true
			},
			
			busy: {
				type: Boolean,
				value: false,
				readOnly: true,
				notify: true
			},

			_applicationSettings: {
				type: Object
			},

			_showNotEnabledMessage: {
				type: Boolean,
				value: false
			},

			_showNotSupportedMessage: {
				type: Boolean,
				value: false
			},

			_boundDownloadCallback: {
				type: Function,
				value: function() {
					return this._downloadCallback.bind(this);
				}
			},

			smallLayout: {
				type: Boolean,
				notify: true,
				reflectToAttribute: true
			}
		},

	    observers: [
			"_computeShowHasPendingActions(online, uploading, _hasPendingActions, _hasUploadError)",
			"_computeShowError(_hasUploadError, online, uploading)",
			"_computeBusy(online, uploading, _hasPendingActions)",
			"_handleApplicationSettingsChange(disableOffline, _applicationSettings)",
			"_controlOfflineMessages(disableOffline, _applicationSettings, _offlineSupported, _installed)"
		],

	    _handleDownload: function() {
			this.$$("#offlineManager").download().catch(function(error) {
				// Handle the error by listening to the download-error event 
				console.warn("Download failed:", error);
			});
		},

	    _computeBusy: function(online, uploading, hasPendingActions) {
		    if (!assertParametersAreDefined(arguments)) {
			    return;
			}

			this._setBusy(online && (uploading || hasPendingActions));
		},

	    _handleRetryUpload: function() {
			this.$$("#offlineManager").retryUpload().catch(function(error) {
				console.warn("Retry failed:", error);
			});
		},

	    _handleSkipAction: function(e) {
			this._skipAction(false);
		},

	    _handleSkipAllActions: function(e) {
			this._skipAction(true);
		},

	    _skipAction: function(allActions) {
			this.$$("#offlineManager").skipAction(allActions)
				.then(function(result) {
					if (result == "NO_MORE_PENDING_ACTIONS") {
						var __dictionary__skipTitle = "The pending action was skipped";
						var __dictionary__skipAllTitle = "Pending actions were skipped";
						var __dictionary__appreload = "Application will be reloaded.";
						var title = allActions ? __dictionary__skipAllTitle : __dictionary__skipTitle;

						this.fire(
							"work-task-alert", 
							{ type: "success", title: title, text: __dictionary__appreload }
						);
						this.async(
							function() {
								this.fire("reload-app");
							},
							5000
						);
					}
				}.bind(this))
				.catch(function(error) {
					console.warn("Skip action failed:", error);
				});
		},

	    _computeShowError: function(hasUploadError, online, uploading) {
		    if (!assertParametersAreDefined(arguments)) {
			    return;
			}

			this._setShowError(online && hasUploadError && !uploading);
		},

	    _downloadCallback: function() {
			return this.$.newWorkTaskService.cacheMyTasksBuildings();
		},

	    _handleDownloadSuccess: function(e) {
			var __dictionary__title = "Download complete";
-				this.fire("work-task-alert", { type: "success", title: __dictionary__title, text: e.detail.message });
		},

	    _handleDownloadError: function(e) {
			var error = e && e.detail ? e.detail : {};
			if (e.detail.cause == "CANNOT_EXECUTE_OFFLINE" || e.detail.cause == "SERVER_IS_OFFLINE") {
				//On Android the download process may be triggered while offline and of course it fails, in that case
				//the app should not display an error message to the user.
				return;
			}
			if (error.cause == "UNAUTHORIZED") {
				return this._handleUnauthorized(e);
			}
			var __dictionary__title = "Download failed";
			this.fire(
				"work-task-alert", 
				{ type: "error", title: __dictionary__title, text: error.message ? error.message : "" }
			);
		},

	    _handleUploadSuccess: function(e) {
			var __dictionary__appreload = "Application will be reloaded.";
			var __dictionary__title = "Upload complete";
			this.fire(
				"work-task-alert", 
				{ type: "success", title: __dictionary__title, text: e.detail.message + " " + __dictionary__appreload }
			);
			this.async(
				function() {
					this.fire("reload-app");
				},
				5000
			);
		},

	    _handleUploadError: function(e) {
			if (e.detail.cause == "CANNOT_EXECUTE_OFFLINE" || e.detail.cause == "SERVER_IS_OFFLINE") {
				//On Android the upload process may be triggered while offline and of course it fails, in that case
				//the app should not display an error message to the user.
				return;
			}
			if (e.detail.cause == "UNAUTHORIZED") {
				return this._handleUnauthorized(e);
			}
			var __dictionary__title = "Upload failed";
			this.fire(
				"work-task-alert", 
				{ type: "error", title: __dictionary__title, text: e.detail.message ? e.detail.message : e.detail }
			);
		},

	    _handleOnlineChanged: function(e) {
			this._setOnline(e.detail.value);
		},

	    _handleUploadingChanged: function(e) {
			this._setUploading(e.detail.value);
		},

	    _handleDownloadingChanged: function(e) {
			this._setDownloading(e.detail.value);
		},

	    _handleUnauthorized: function(e) {
			var __dictionary__title = "Unauthorized";
			this.fire(
				"work-task-alert", 
				{ type: "error", title: __dictionary__title, text: e.detail.message }
			);
			this.async(
				function() {
					this.fire("reload-app");
				},
				5000
			);
		},

	    _hideSignoutButton: function(errorType) {
			return errorType != "UserMismatch";
		},

	    _hideSkipAllButton: function(errorType) {
			return errorType != "UserMismatch";
		},

	    _handleSignout: function() {
			this.$.signout.signout();
		},

	    _hideRetryButton: function(errorType) {
			return !errorType || errorType == "UserMismatch";
		},

	    _hideSkipButton: function(errorType) {
			return !errorType || errorType == "UserMismatch";
		},

	    _computeShowHasPendingActions: function(online, uploading, hasPendingActions, hasUploadError) {
		    if (!assertParametersAreDefined(arguments)) {
			    return;
			}

			this._setShowHasPendingActions(online && !uploading && hasPendingActions && !hasUploadError);
		},

	    _formatDate: function(date, currentUser) {
		    if (!assertParametersAreDefined(arguments)) {
			    return;
			}

			if (!date) {
				return "-";
			}

			return this.formatDateWithTimeZone(date.toISOString(), currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)
		},

	    _controlOfflineMessages: function(disableOffline, applicationSettings, offlineSupported, installed) {
		    if (!assertParametersAreDefined(arguments)) {
			    return;
			}

			this._showNotEnabledMessage = !disableOffline && !installed && applicationSettings != null && !applicationSettings.enableOffline;
			this._showNotSupportedMessage = !disableOffline && !installed && !this._showNotEnabledMessage && !offlineSupported;
		},

	    _handleApplicationSettingsChange: function(disableOffline, applicationSettings) {
		    if (!assertParametersAreDefined(arguments)) {
			    return;
			}

			if (disableOffline || !applicationSettings) {
				return;
			}

			if (applicationSettings.enableOffline) {
				afterNextRender(this, function() {
					if (this._offlineSupported && this.online && !this.uploading) {
						this.$$("#offlineManager").install().catch(function(error) {
							// Handle the error by listening to the error events 
							console.log("offline-config:", error);
						});
					}
				});
			} else {
				afterNextRender(this, function() {
					if (this._installed && this.online) {
						this.$$("#offlineManager").uninstall()
							.then(function() {
								var __dictionary__offlineDisabled = "Offline feature was disabled";
								var __dictionary__appreload = "Application will be reloaded.";
								this.fire(
									"work-task-alert", 
									{ type: "warning", title:__dictionary__offlineDisabled, text: __dictionary__appreload}
								);
								this.async(
									function() {
										this.fire("reload-app");
									},
									5000
								);
							}.bind(this))
							.catch(function(error) {
								// Handle the error by listening to the error events 
								console.log("offline-config:", error);
							});
					}
				});
			}
		}
	});
});