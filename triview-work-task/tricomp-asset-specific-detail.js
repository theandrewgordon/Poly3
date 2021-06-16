/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import "../triapp-task-list/tricomp-overflow-text.js";
import "./triservice-asset.js";
import "./tristyles-work-task-app.js";
import "./tricomp-documents-section.js";

Polymer({
	_template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				.label {
					color: var(--ibm-gray-50);
					padding-bottom: 3px;
				}

				.content {
					margin-bottom: 20px;
				}

				.description {
					background-color: white;
				}

				.section-label {
					border-bottom: 1px solid var(--ibm-gray-30);
				}

				.section-row {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 8px 5px;
				}

				.even {
					background-color: var(--ibm-neutral-2);
				}

				.asset-status-color {
					width: 14px;
					height: 14px;
					background-color: var(--asset-status-color, white);
					margin: 0px 5px;
					-webkit-border-radius: 10px; 
					-moz-border-radius: 10px; 
					border-radius: 10px;
				}

				tricomp-documents-section {
					@apply --layout-vertical;
					border-bottom: 1px solid var(--ibm-gray-30);
					border-top: 1px solid var(--ibm-gray-30);

					--tricomp-documents-section-header-text: {
						color: var(--ibm-gray-50);
					};
				}
			
		</style>

		<triservice-asset id="assetService" documents="{{_documents}}"></triservice-asset>

		<div>
			<div class="label" hidden\$="[[!asset.description]]">Description</div>
			<tricomp-overflow-text class="description content" lines="6" collapse="" hidden\$="[[!asset.description]]" text="[[asset.description]]">
				</tricomp-overflow-text>
			<div class="section-label label">Spec Information</div>
			<div class="content">
				<div class="section-row">
					<span>Specification Name:&nbsp;</span>
					<span>[[asset.specName]]</span>
				</div>
				<div class="section-row even">
					<span>Spec ID:&nbsp;</span>
					<span>[[asset.specID]]</span>
				</div>
				<div class="section-row">
					<span>Spec Class:&nbsp;</span>
					<span>[[asset.specClass]]</span>
				</div>
				<div class="section-row even">
					<span>Brand:&nbsp;</span>
					<span>[[asset.brand]]</span>
				</div>
				<div class="section-row">
					<span>Model Number:&nbsp;</span>
					<span>[[asset.modelNumber]]</span>
				</div>
			</div>
			<div class="section-label label">Asset Status</div>
			<div class="content">
				<div class="section-row">
					<span>In Service Date:&nbsp;</span>
					<span>[[formatDate(asset.inServiceDate, currentUser._DateFormat, currentUser._Locale)]]</span>
				</div>
				<div class="section-row even">
					<span>Asset Status:</span>
					<span class="asset-status-color"></span>
					<span>[[asset.assetStatus]]</span>
				</div>

				<div class="section-row">
					<span>Assign Date:&nbsp;</span>
					<span>[[formatDateWithTimeZone(asset.assignDate, currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)]]</span>
				</div>
				<div class="section-row even">
					<span>Return Due Date:&nbsp;</span>
					<span>[[formatDateWithTimeZone(asset.returnDueDate, currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)]]</span>
				</div>
				<div class="section-row">
					<span>Assigned To:&nbsp;</span>
					<span>[[asset.assignedTo]]</span>
				</div>
			</div>

			<template is="dom-if" if="[[_hasDocuments(_documents)]]">
				<tricomp-documents-section id="documents" documents="[[_documents]]" online="[[online]]" opened="{{documentsOpened}}"></tricomp-documents-section>
			</template>
		</div>
	`,

	is: "tricomp-asset-specific-detail",

	properties: {
		currentUser: Object,
		
		asset: {
			type: Object,
			value: function() {
				return {};
			}
		},

		documentsOpened: {
			type: Boolean
		},

		online: {
			type: Boolean
		},

		_documents: {
			type: Array
		}
	},

	behaviors: [
		TriDateUtilities
	],

	observers: [
		'_setAssetStatusColor(asset.assetStatusColor)'
	],

	_setAssetStatusColor: function(color) {
		if(color) {
			this.updateStyles({
				'--asset-status-color': this.asset.assetStatusColor
			}, {});
		}
	},

	_hasDocuments: function(documents) {
		return documents && documents.length > 0;
	}
});