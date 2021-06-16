/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-routing/triplat-route.js";
var singleton = null;

export const TriroutesTask = Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triplat-route id="taskDetailRoute" name="taskDetail" path="/detail" on-route-active="_onTaskDetailRouteActive"></triplat-route>

		<triplat-route id="locationDetailsRoute" name="locationDetails" path="/location/:locationId" on-route-active="_onLocationDetailsRouteActive" active="{{locationDetailRouteActive}}"></triplat-route>

		<triplat-route id="assetDetailsRoute" name="assetDetails" path="/asset/:assetId/:defaultFloorPlan" on-route-active="_onAssetDetailsRouteActive" active="{{assetDetailsRouteActive}}"></triplat-route>
		
		<triplat-route id="procedureDetailsRoute" name="procedureDetails" path="/procedure/:procedureId/asset/:assetId/location/:locationId" on-route-active="_onProcedureDetailsRouteActive" active="{{procedureDetailsRouteActive}}"></triplat-route>

		<triplat-route id="stepDetailsRoute" name="stepDetails" path="/procedure/:procedureId/asset/:assetId/location/:locationId/step/:stepNumber" on-route-active="_onProcedureDetailsRouteActive" active="{{stepDetailsRouteActive}}"></triplat-route>

		<triplat-route id="taskDetailBarCodeScanRoute" name="taskDetailBarCodeScan" path="/detail/barCodeScan" active="{{taskDetailBarCodeRouteActive}}"></triplat-route>

		<triplat-route id="taskDetailQrCodeScanRoute" name="taskDetailQrCodeScan" path="/detail/qrCodeScan" active="{{taskDetailQrCodeRouteActive}}"></triplat-route>
	`,

    is: "triroutes-task",

    properties: {
		locationDetailRouteActive: {
			type: Boolean,
			notify: true
		},

		assetDetailsRouteActive: {
			type: Boolean,
			notify: true
		},

		procedureDetailsRouteActive: {
			type: Boolean,
			notify: true
		},

		stepDetailsRouteActive: {
			type: Boolean,
			notify: true
		},

		taskDetailBarCodeRouteActive: {
			type: Boolean,
			notify: true
		},

		taskDetailQrCodeRouteActive: {
			type: Boolean,
			notify: true
		},
	},

    created: function() {
		if (!singleton) {
			singleton = this;
		} else {
			throw "Cannot instantiate more than one triroutes-task element";
		}
	},

    openTaskLocationDetails: function (locationId) {
		var params = { locationId: locationId };
		this.$.locationDetailsRoute.navigate(params);
	},

    openTaskAssetDetails: function (assetId, taskId, defaultFloorPlan) {
		var params = { assetId: assetId };
		if (taskId) { params.taskId = taskId; }
		params.defaultFloorPlan = (defaultFloorPlan) ? defaultFloorPlan : false;
		this.$.assetDetailsRoute.navigate(params);
	},

    openTaskProcedureDetails: function (procedureId, assetId, locationId, taskId) {
		var params = { procedureId: procedureId, assetId: assetId, locationId: locationId};
		if (taskId) {
			params.taskId = taskId;
		}
		this.$.procedureDetailsRoute.navigate(params);
	},

    openTaskProcedureStepDetails: function (stepNumber, procedureId, assetId, locationId) {
		var params = { stepNumber: stepNumber, procedureId: procedureId, assetId: assetId, locationId: locationId };
		this.$.stepDetailsRoute.navigate(params);
	},

	openTaskDetailBarCodeScan: function() {
		this.shadowRoot.querySelector("#taskDetailBarCodeScanRoute").navigate();
	},
	
	openTaskDetailQrCodeScan: function() {
		this.shadowRoot.querySelector("#taskDetailQrCodeScanRoute").navigate();
	},

    _onTaskDetailRouteActive: function(e) {
		e.stopPropagation();
		this.fire("task-detail-route-active", { active: e.detail.active });
	},

    _onLocationDetailsRouteActive: function(e) {
		e.stopPropagation();
		var __dictionary__locationDetailsPageLabel = "Location Details";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__locationDetailsPageLabel, hasBackButton: true }
		);
	},

    _onAssetDetailsRouteActive: function(e) {
		e.stopPropagation();
		var __dictionary__assetDetailsPageLabel = "Asset Details";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__assetDetailsPageLabel, hasBackButton: true }
		);
	},

    _onProcedureDetailsRouteActive: function(e) {
		e.stopPropagation();
		var __dictionary__procedureDetailsPageLabel = "Procedures";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__procedureDetailsPageLabel, hasBackButton: true }
		);
	}

});

TriroutesTask.getInstance = function () {
	return singleton;
};