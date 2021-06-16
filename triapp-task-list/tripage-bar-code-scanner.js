/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";

import "../@polymer/paper-button/paper-button.js";
import "../triplat-code-scanner/triplat-barcode-scanner.js";
import "../triblock-popup/triblock-popup.js";
import "./tristyles-task-list.js";

class BarCodeScannerPage extends PolymerElement {
	static get is() { return "tripage-bar-code-scanner"; }

	static get template() {
		return html`
			<style include="tristyles-theme task-list-scanner task-list-scan-popup"></style>

			<div class="scanner-container">
				<div class="scanner-action-bar">
					<span class="scanner-label label tri-h2">Scan Bar code</span>
					<paper-button secondary class="cancel-scan-button" on-tap="_stopBarCodeScan" noink>Cancel</paper-button>
				</div>
				<triplat-barcode-scanner id="barCodeScanner" 
					timeout="[[_timeout]]" 
					on-barcode-timeout="_scanSessionTimeOut" 
					on-barcode-detected="_stopBarCodeScan" 
					decoded-data="{{scannedData}}">
				</triplat-barcode-scanner>
			</div>

			<triblock-popup id="barCodePopup" class="popup-alert" modal no-cancel-on-outside-click small-screen-max-width="0px">
				<div class="header-warning tri-h2">Warning</div>
				<div>Unable to detect a Bar code.</div>
				<div class="footer">
					<paper-button secondary class="try-again" on-tap="_continueBarCodeScan">Try again</paper-button>
					<paper-button class="close-camera" on-tap="_stopBarCodeScan">Close camera</paper-button>
				</div>
			</triblock-popup>
		`; 
	}

	static get properties() {
		return {

			routeActive: {
				type: Boolean,
				observer: '_onScannerRouteActive'
			},

			scannedData: {
				type: String,
				notify: true
			},

			_timeout: {
				type: Number,
				value : 60000
			}

		};
	}

	_onScannerRouteActive(routeActive, oldRouteActive) {
		if (!routeActive && oldRouteActive === undefined) return;
		if(routeActive) {
			this.dispatchEvent(new CustomEvent('clear-selected-item', {
				bubbles: true,
				composed: true
			}));
			this.set("scannedData", "");
			this.$.barCodeScanner.start();
		} else {
			this.$.barCodeScanner.stop();
		}
		this.$.barCodePopup.closePopup();
	}

	_scanSessionTimeOut() {
		if(this.routeActive) this.$.barCodePopup.openPopup();
	}

	_continueBarCodeScan(e) {
		e.stopPropagation();
		this.$.barCodePopup.closePopup();
		this.$.barCodeScanner.startTimer();
	}

	_stopBarCodeScan(e) {
		e.stopPropagation();
		if (this.routeActive) {
			this.$.barCodeScanner.stop();
			this.$.barCodePopup.closePopup();
			window.history.back();
		} else {
			this.set("scannedData", "");
		}
	}
}

window.customElements.define('tripage-bar-code-scanner', BarCodeScannerPage);