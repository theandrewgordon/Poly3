/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import "../triplat-routing/triplat-route.js";

var singleton = null;

export const TriroutesTaskList = Polymer({
	_template: html`
		<triplat-route id="homeRoute" name="home" path="/home"></triplat-route>
		<triplat-route id="barCodeScanRoute" name="barCodeScan" path="/barCodeScan" active="{{barCodeScanActive}}"></triplat-route>
		<triplat-route id="qrCodeScanRoute" name="qrCodeScan" path="/qrCodeScan" active="{{qrCodeScanActive}}"></triplat-route>
	`,

	is: "triroutes-task-list-base",

	properties: {
		barCodeScanActive: {
			type: Boolean,
			notify: true
		},
		qrCodeScanActive: {
			type: Boolean,
			notify: true
		}
	},

	created: function () {
		if (!singleton) {
			singleton = this;
		} else {
			throw "Cannot instantiate more than one triroutes-work-task-app element";
		}
	},

	navigateToBarCodeScan(e) {
		this.shadowRoot.querySelector("#barCodeScanRoute").navigate();
	},

	navigateToQRCodeScan(e) {
		this.shadowRoot.querySelector("#qrCodeScanRoute").navigate();
	}
});

TriroutesTaskList.getInstance = function () {
	return singleton;
};