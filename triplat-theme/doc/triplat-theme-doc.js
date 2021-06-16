/*
@license
IBM Confidential - OCO Source Materials - (C) COPYRIGHT IBM CORP. 2015-2019 - The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
import { html } from "../../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriplatThemeDocData } from "./triplat-theme-doc-data.js";
import "../triplat-theme.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../@polymer/iron-icon/iron-icon.js";
import "../../@polymer/iron-icons/iron-icons.js";
import "../../triplat-icon/ibm-icons.js";
import "../../@polymer/paper-button/paper-button.js";
import "../../@polymer/paper-checkbox/paper-checkbox.js";
import "../../@polymer/paper-dialog/paper-dialog.js";
import "../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../@polymer/paper-input/paper-input.js";
import "../../@polymer/paper-item/paper-item.js";
import "../../@polymer/paper-radio-group/paper-radio-group.js";
import "../../@polymer/paper-radio-button/paper-radio-button.js";
import "../../@polymer/paper-spinner/paper-spinner.js";
import "../../@polymer/paper-toast/paper-toast.js";
import "../../@polymer/paper-toolbar/paper-toolbar.js";
import "../../@polymer/paper-tooltip/paper-tooltip.js";
import { dom } from "../../@polymer/polymer/lib/legacy/polymer.dom.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">


			:host {
				display: block;
				background-color: var(--tri-body-background-color);

				@apply --layout-vertical;
				@apply --layout-center;
			}

			.container {
				max-width: 600px;
			}

			.dialog-button-container {
				@apply --layout-horizontal;
				@apply --layout-center-center;
			}

			.elements-container {
				@apply --layout-horizontal;
				@apply --layout-center-justified;
				@apply --layout-wrap;
				margin: 5px 0;
			}

			.element-and-label-container {
				@apply --layout-vertical;
				@apply --layout-center-center;
			}

			.element-item {
				margin: 5px;
			}

			.footer-button-container {
				background-color: var(--tri-footer-background-color);
				color: var(--tri-footer-color);
			}

			.group {
				margin: 20px;
				padding: 20px;
				background-color: var(--tri-primary-content-background-color);
				border: 1px solid var(--tri-primary-content-accent-color);
			}

			.group-name {
				font-weight: 500;
				color: var(--tri-primary-content-color);
			}

			.group-description {
				font-style: italic;
				margin-bottom: 15px;
			}

			.header-paragraph {
				text-align: center;
			}
			.header-paragraph:not(:last-child) {
				margin-bottom: 20px;
			}

			.header-tag-container {
				text-align: center;
			}

			.link-container {
				text-align: center;
				padding: 5px;
			}

			paper-icon-button {
				width: 50px;
				height: 50px;
			}

			paper-toolbar {
				@apply --layout-flex;
			}

			.section-title {
				margin: 30px 20px 5px;
				text-align: center;
			}

			.section-description {
				text-align: center;
				margin: 0 20px 10px;
				font-style: italic;
			}

			.sub-group-label {
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
				margin-bottom: 5px;
				margin-top: 15px;
			}

			.variable-container {
				@apply --layout;
				@apply --layout-horizontal;
				@apply --layout-center;
				@apply --layout-justified;
				padding: 5px;
			}

			.variable-name {
				@apply --layout-flex;
			}

			.variable-swatch {
				height: 14px;
				width: 14px;
				margin: 2px;
				border: 1px solid var(--tri-primary-content-accent-color);
				margin-left: 10px;
			}

		
		</style>

		<paper-toast id="toast" text="I'm a paper-toast!"></paper-toast>

		<paper-dialog id="dialog">
			<h2>Dialog Title</h2>
			<div>Here's some dialog content.</div>
			<div class="dialog-button-container">
				<paper-button dialog-confirm="" autofocus="">Close Dialog</paper-button>
			</div>
		</paper-dialog>

		<div class="container">
			<div class="tri-h1 section-title">TRIRIGA UX Theme</div>
			<div class="group">
				<div class="header-paragraph">The theme file (triplat-theme.html) is included in the root document of all TRIRIGA UX applications. It provides CSS variables and element styles, detailed below.</div>
				<div class="header-paragraph"><b>To view and edit triplat-theme.html</b>, use WebViewSync to download, modify, and sync the Web View record named "triplat-theme". The UX Framework looks for the "triplat-theme.html" file within the "triplat-theme" Web View record to load into the root document. If none is found, then a copy of the original, unmodified triplat-theme.html, which is kept internally in the UX Framework, is loaded instead.</div>
				<!-- <div class="alert-message">
					<div class="alert-message-status-icon-container">
						<iron-icon class="alert-message-status-icon" icon="ibm:status-warning"></iron-icon>
					</div>
					<div class="alert-message-body">
						<div class="alert-message-title">Warning</div>
						<div>If a <a class="underline" target="_blank" href="http://tabatkins.github.io/specs/css-apply-rule/">CSS mix-in</a> is applied locally within a web component, it will overwrite any identical mix-in applied from the global theme file. If both the theme mix-in and the local mix-in need to be applied, then you will need to manually copy the theme's mix-in styles into the local mix-in.</div>
					</div>
				</div> -->
			</div>
			<div class="tri-h1 section-title">CSS Variables</div>
			<div class="section-description">CSS custom property variables that are available for use throughout all UX applications</div>
			<template is="dom-repeat" items="{{_varData}}">
				<div class="group">
					<div class="tri-h2 group-name">{{item.name}}</div>
					<div class="group-description">{{item.description}}</div>
					<div class="tri-h3 sub-group-label">CSS Variables:</div>
					<template is="dom-repeat" items="{{item.vars}}">
						<div class="variable-container">
							<div class="variable-name">{{item.name}}</div>
							<div class="variable-value">{{item.value}}</div>
							<div class="variable-swatch" style\$="{{_computeSwatchStyle(item.value)}}" hidden\$="{{!item.isColorVariable}}"></div>
						</div>
					</template>
				</div>
			</template>
			<div class="tri-h1 section-title">Automatically-styled Elements</div>
			<div class="section-description">Elements that will be automatically styled by the theme</div>
			<div class="group" id="anchor">
				<div class="tri-h2 group-name"><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a" target="_blank">&lt;a&gt;</a> / class="tri-link"</div>
				<div class="group-description">&lt;a&gt; is only meant to be used for hyperlinks (links to specific URLs), so the "tri-link" class is provided for tappable text that isn't a hyperlink. Use the "footer" class or attribute to get the footer/dark-background link styling. Use the "underline" class to always show the underline on the link, instead of only when hovering the cursor over the link; this is meant to be used when a link appears inline with other text.</div>
				<div class="link-container">
					<a href="#anchor">Test Link</a>
				</div>
				<div class="link-container">
					<div>Example of a <span class="tri-link underline">link</span> using the "underline" class.</div>
				</div>
				<div class="link-container footer-button-container">
					<span class="element-item tri-link footer" tabindex="0">Test [footer] Link</span>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name">class="tri-h#" / class="tri-fine-print"</div>
				<div class="group-description">&lt;h#&gt; and &lt;small&gt; elements are avoided here, since these elements have preset browser settings that we don't want.</div>
				<div class="header-tag-container">
					<span class="tri-h1">class="tri-h1"</span>
				</div>
				<div class="header-tag-container">
					<span class="tri-h2">class="tri-h2"</span>
				</div>
				<div class="header-tag-container">
					<span class="tri-h3">class="tri-h3"</span>
				</div>
				<div class="header-tag-container">
					<span class="tri-fine-print">class="tri-fine-print"</span>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/iron-icon" target="_blank">&lt;iron-icon&gt;</a></div>
				<div class="group-description">Each iron-icon's label represents the class or attribute value necessary to get that styling.</div>
				<div class="elements-container">
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:music"></iron-icon>
						<div>*DEFAULT*</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:add-new" primary=""></iron-icon>
						<div>primary</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:edit" secondary=""></iron-icon>
						<div>secondary</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:status-info" info=""></iron-icon>
						<div>info</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:status-success" success=""></iron-icon>
						<div>success</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:status-warning" warning=""></iron-icon>
						<div>warning</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:status-warning-major" major-warning=""></iron-icon>
						<div>major-warning</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:remove-delete" danger=""></iron-icon>
						<div>danger</div>
					</div>
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:status-error" error=""></iron-icon>
						<div>error</div>
					</div>
				</div>
				<div class="elements-container footer-button-container">
					<div class="element-and-label-container element-item">
						<iron-icon class="element-item" icon="ibm:bottom" noink="" footer=""></iron-icon>
						<div>footer</div>
					</div>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label" target="_blank">&lt;label&gt;</a></div>
				<div class="elements-container">
					<label>Label</label>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-button" target="_blank">&lt;paper-button&gt;</a></div>
				<div class="group-description">Each paper-button's label represents the class or attribute value necessary to get that styling. The "noink" property has been set on the demo paper-buttons below and should be set on all paper-buttons using this theme.</div>
				<div class="tri-h3 sub-group-label">Enabled:</div>
				<div class="elements-container">
					<paper-button class="element-item" noink="">*DEFAULT*</paper-button>
					<paper-button class="element-item" noink="" secondary="">secondary</paper-button>
					<paper-button class="element-item" noink="" info="">info</paper-button>
					<paper-button class="element-item" noink="" success="">success</paper-button>
					<paper-button class="element-item" noink="" warning="">warning</paper-button>
					<paper-button class="element-item" noink="" major-warning="">major-warning</paper-button>
					<paper-button class="element-item" noink="" danger="">danger</paper-button>
					<paper-button class="element-item" noink="" info-outline="">info-outline</paper-button>
					<paper-button class="element-item" noink="" success-outline="">success-outline</paper-button>
					<paper-button class="element-item" noink="" warning-outline="">warning-outline</paper-button>
					<paper-button class="element-item" noink="" major-warning-outline="">major-warning-outline</paper-button>
					<paper-button class="element-item" noink="" danger-outline="">danger-outline</paper-button>
				</div>
				<div class="elements-container footer-button-container">
					<div class="elements-container">
						<paper-button noink="" footer="">footer</paper-button>
						<paper-button noink="" footer-secondary="">footer-secondary</paper-button>
						<paper-button noink="" footer-danger="">footer-danger</paper-button>
					</div>
				</div>
				<div class="tri-h3 sub-group-label">Disabled:</div>
				<div class="elements-container">
					<paper-button class="element-item" disabled="" noink="">*DEFAULT*</paper-button>
					<paper-button class="element-item" disabled="" noink="" secondary="">secondary</paper-button>
					<paper-button class="element-item" disabled="" noink="" info="">info</paper-button>
					<paper-button class="element-item" disabled="" noink="" success="">success</paper-button>
					<paper-button class="element-item" disabled="" noink="" warning="">warning</paper-button>
					<paper-button class="element-item" disabled="" noink="" major-warning="">major-warning</paper-button>
					<paper-button class="element-item" disabled="" noink="" danger="">danger</paper-button>
					<paper-button class="element-item" disabled="" noink="" info-outline="">info-outline</paper-button>
					<paper-button class="element-item" disabled="" noink="" success-outline="">success-outline</paper-button>
					<paper-button class="element-item" disabled="" noink="" warning-outline="">warning-outline</paper-button>
					<paper-button class="element-item" disabled="" noink="" major-warning-outline="">major-warning-outline</paper-button>
					<paper-button class="element-item" disabled="" noink="" danger-outline="">danger-outline</paper-button>
				</div>
				<div class="elements-container footer-button-container">
					<div class="element-item">
						<paper-button disabled="" noink="" footer="">footer</paper-button>
					</div>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-checkbox" target="_blank">&lt;paper-checkbox&gt;</a></div>
				<div class="elements-container">
					<paper-checkbox class="element-item">Enabled</paper-checkbox>
					<paper-checkbox class="element-item" disabled="">Disabled</paper-checkbox>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-dialog" target="_blank">&lt;paper-dialog&gt;</a></div>
				<div class="elements-container">
					<paper-button on-tap="_showDialog">Show Dialog</paper-button>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-icon-button" target="_blank">&lt;paper-icon-button&gt;</a></div>
				<div class="group-description">Each paper-icon-button's label represents the class or attribute value necessary to get that styling. The "noink" property has been set on the demo paper-icon-buttons below and should be set on all paper-icon-buttons using this theme.</div>
				<div class="tri-h3 sub-group-label">Enabled:</div>
				<div class="elements-container">
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:add-new" noink="" primary=""></paper-icon-button>
						<div>primary</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:edit" noink="" secondary=""></paper-icon-button>
						<div>secondary</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-info" noink="" info=""></paper-icon-button>
						<div>info</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-success" noink="" success=""></paper-icon-button>
						<div>success</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-warning" noink="" warning=""></paper-icon-button>
						<div>warning</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-warning-major" noink="" major-warning=""></paper-icon-button>
						<div>major-warning</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:remove-delete" noink="" danger=""></paper-icon-button>
						<div>danger</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-error" noink="" error=""></paper-icon-button>
						<div>error</div>
					</div>
				</div>
				<div class="elements-container footer-button-container">
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:bottom" noink="" footer=""></paper-icon-button>
						<div>footer</div>
					</div>
				</div>
				<div class="tri-h3 sub-group-label">Disabled:</div>
				<div class="elements-container">
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:add-new" noink="" disabled="" primary=""></paper-icon-button>
						<div>primary</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:edit" noink="" disabled="" secondary=""></paper-icon-button>
						<div>secondary</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-info" noink="" disabled="" info=""></paper-icon-button>
						<div>info</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-success" noink="" disabled="" success=""></paper-icon-button>
						<div>success</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-warning" noink="" disabled="" warning=""></paper-icon-button>
						<div>warning</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-warning-major" noink="" disabled="" major-warning=""></paper-icon-button>
						<div>major-warning</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:remove-delete" noink="" disabled="" danger=""></paper-icon-button>
						<div>danger</div>
					</div>
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:status-error" noink="" disabled="" error=""></paper-icon-button>
						<div>error</div>
					</div>
				</div>
				<div class="elements-container footer-button-container">
					<div class="element-and-label-container element-item">
						<paper-icon-button class="element-item" icon="ibm:bottom" noink="" disabled="" footer=""></paper-icon-button>
						<div>footer</div>
					</div>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-input" target="_blank">&lt;paper-input&gt;</a></div>
				<div class="group-description">Type a non-alpha character in the input to see the invalid styling.</div>
				<div class="elements-container">
					<paper-input label="Letter-only Input" auto-validate="" pattern="[a-zA-Z]*" error-message="Letters only!" class="element-item"></paper-input>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-item" target="_blank">&lt;paper-item&gt;</a></div>
				<div class="elements-container">
					<paper-item>paper-item</paper-item>
					<paper-item disabled="">Disabled paper-item</paper-item>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-radio-button" target="_blank">&lt;paper-radio-button&gt;</a></div>
				<div class="elements-container">
					<paper-radio-group class="element-item">
						<paper-radio-button name="op1">Option 1</paper-radio-button>
						<paper-radio-button name="op2">Option 2</paper-radio-button>
						<paper-radio-button name="op3">Option 3</paper-radio-button>
						<paper-radio-button name="op4" disabled="">Disabled Option</paper-radio-button>
					</paper-radio-group>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-spinner" target="_blank">&lt;paper-spinner&gt;</a></div>
				<div class="elements-container">
					<paper-spinner active=""></paper-spinner>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-toast" target="_blank">&lt;paper-toast&gt;</a></div>
				<div class="elements-container">
					<paper-button noink="" on-tap="_openToast">Show Toast</paper-button>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-toolbar" target="_blank">&lt;paper-toolbar&gt;</a></div>
				<div class="elements-container">
					<paper-toolbar>
						<paper-icon-button icon="menu" slot="top"></paper-icon-button>
						<span class="title" slot="top">Title</span>
						<paper-icon-button icon="refresh" slot="top"></paper-icon-button>
						<paper-icon-button icon="add" slot="top">+</paper-icon-button>
					</paper-toolbar>
				</div>
			</div>
			<div class="group">
				<div class="tri-h2 group-name"><a href="https://elements.polymer-project.org/elements/paper-tooltip" target="_blank">&lt;paper-tooltip&gt;</a></div>
				<div class="elements-container">
					<div>Hover/tap this text to see the tooltip!</div>
					<paper-tooltip position="top">Tooltip text</paper-tooltip>
				</div>
			</div>
		</div>
	`,

    is: "triplat-theme-doc",

    properties: {

		_varData: {
			type: Array,
			notify: false,
			readOnly: true
		}

	},

   ready: function() {
		this.async(function() {
			TriplatThemeDocData.forEach(function(group) {
				let styleValue = ""
				group.vars.forEach(function(cssVar) {
					if (ShadyCSS) {
						styleValue = ShadyCSS.getComputedStyleValue(this, cssVar.name);
					} else {
						styleValue = getComputedStyle(this).getPropertyValue(cssVar.name);
					}
					cssVar.value = styleValue;
				}.bind(this));
			}.bind(this));

			this._set_varData(TriplatThemeDocData);
		}, 100);
	},

    _computeSwatchStyle: function(variableValue) {
		return "background-color: " + variableValue + ";";
	},

    _openToast: function() {
		this.$.toast.open();
	},

    _showDialog: function() {
		this.$.dialog.open();
	}
});