/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";

import "../@polymer/paper-button/paper-button.js";
import "../triplat-code-scanner/triplat-qrcode-scanner.js";
import "../triblock-popup/triblock-popup.js";
import "./tristyles-task-list.js";

class QrCodeScannerPage extends PolymerElement {
	static get is() { return "tripage-qr-code-scanner"; }

	static get template() {
		return html`
			<style include="tristyles-theme task-list-scanner task-list-scan-popup"></style>

			<div class="scanner-container">
				<div class="scanner-action-bar">
					<span class="scanner-label label tri-h2">Scan QR code</span>
					<paper-button secondary class="cancel-scan-button" on-tap="_stopQrCodeScan" noink>Cancel</paper-button>
				</div>
				<triplat-qrcode-scanner id="qrCodeScanner" 
					timeout="[[_timeout]]" 
					on-qrcode-timeout="_scanSessionTimeOut" 
					on-qrcode-detected="_stopQrCodeScan" 
					decoded-data="{{scannedData}}">
				</triplat-qrcode-scanner>
			</div>

			<triblock-popup id="qrCodePopup" class="popup-alert" modal no-cancel-on-outside-click small-screen-max-width="0px">
				<div class="header-warning tri-h2">Warning</div>
				<div>Unable to detect a QR code.</div>
				<div class="footer">
					<paper-button secondary class="try-again" on-tap="_continueQrCodeScan">Try again</paper-button>
					<paper-button class="close-camera" on-tap="_stopQrCodeScan">Close camera</paper-button>
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
			this.$.qrCodeScanner.start();
		} else {
			this.$.qrCodeScanner.stop();
		}
		this.$.qrCodePopup.closePopup();
	}

	_scanSessionTimeOut() {
		if(this.routeActive) this.$.qrCodePopup.openPopup();
	}

	_continueQrCodeScan(e) {
		e.stopPropagation();
		this.$.qrCodePopup.closePopup();
		this.$.qrCodeScanner.startTimer();
	}

	_stopQrCodeScan(e) {
		e.stopPropagation();
		if (this.routeActive) {
			this.$.qrCodeScanner.stop();
			this.$.qrCodePopup.closePopup();
			window.history.back()
		} else {
			this.set("scannedData", "");
		}
	}
}

window.customElements.define('tripage-qr-code-scanner', QrCodeScannerPage);