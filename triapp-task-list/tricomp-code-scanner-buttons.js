/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";

import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-tooltip/paper-tooltip.js";

import { TriplatCodeScannerMixin } from "../triplat-code-scanner/triplat-code-scanner-mixin.js";

class CodeScannerButtonsComp extends TriplatCodeScannerMixin(PolymerElement) {
	static get is() { return "tricomp-code-scanner-buttons"; }

	static get template() {
		return html`
			<style include="tristyles-theme">

				.code-scanner {
					@apply --layout-horizontal;
					@apply --layout-center
				}

				.divider {
					width: 1px;
					background-color: var(--tri-primary-content-accent-color);
					height: 22px;
					margin-left: 10px;
					margin-right: 5px;
				}

				paper-icon-button {
					height: 45px;
					width: 45px;
				}

			</style>

			<div class="code-scanner" hidden\$="[[!_hasCam]]">
				<div class="divider"></div>
				<paper-icon-button id="barCodeIcon" name="barcode" aria-label="Scan barcode" on-tap="_startBarCodeScan" noink primary icon="ibm-glyphs:bar-code" disabled="[[disableScanner]]"></paper-icon-button>
				<paper-tooltip for="barCodeIcon" fit-to-visible-bounds position="bottom" offset="5">Scan barcode</paper-tooltip>
				<paper-icon-button id="qrCodeIcon" name="qrcode" aria-label="Scan QR code" on-tap="_startQrCodeScan" noink primary icon="ibm-glyphs:qr-code" disabled="[[disableScanner]]"></paper-icon-button>
				<paper-tooltip for="qrCodeIcon" fit-to-visible-bounds position="bottom" offset="5">Scan QR code</paper-tooltip>
			</div>
		`;
	}

	static get properties() {
		return {

			disableScanner: {
				type: Boolean
			},

			_hasCam: {
				type: Boolean,
				value: true
			},

			online: {
				type: Boolean
			}

		};
	}

	static get observers() {
		return [
			"_handleDisplayOfScanIcons(online)"
		]
	}

	_handleDisplayOfScanIcons(online) {
		this.hasCamera().then(success => {
			this._hasCam = success && online;
		})
	}

	_startBarCodeScan(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('start-bar-code-scan', {
			bubbles: true,
			composed: false
		}));
	}

	_startQrCodeScan(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('start-qr-code-scan', {
			bubbles: true,
			composed: false
		}));
	}
}

window.customElements.define(CodeScannerButtonsComp.is, CodeScannerButtonsComp);