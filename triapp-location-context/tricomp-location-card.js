/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-icon/triplat-icon.js";
import "../triblock-responsive-layout/triblock-responsive-layout.js";
import "../triplat-word-highlight/triplat-word-highlight.js";
import "../triblock-search-popup/triblock-image-info-card.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.detail * {
					margin: 0;
					font-size: 14px;
				}

				.detail h3 {
					font-weight: 400;
				}
			
		</style>

		<triblock-image-info-card class="detail" data="[[data]]" placeholder-icon="ibm:buildings" thumbnail="">
			<h3><triplat-word-highlight value="[[data.building]]" search-value="[[searchValue]]"></triplat-word-highlight></h3>
			<p>
				<triplat-word-highlight value="[[data.city]]" search-value="[[searchValue]]"></triplat-word-highlight><template is="dom-if" if="[[data.stateProvince]]">, </template>
				[[data.stateProvince]]<template is="dom-if" if="[[data.country]]">, </template>
				[[data.country]]
			</p>
		</triblock-image-info-card>
	`,

    is: "tricomp-location-card",

    properties: {
		data: Object,
		searchValue: String
	}
});