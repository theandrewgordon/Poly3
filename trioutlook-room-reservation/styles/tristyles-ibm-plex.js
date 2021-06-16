/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { addDomStyleModule } from "../../tricore-util/tricore-util.js";

const tristylesIBMPlexFonts = `
<dom-module id="tristyles-ibm-plex-fonts">
	<template>
		<style>
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 700;
				src: local("IBM Plex Sans Bold"), local("IBMPlexSans-Bold"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-Bold.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-Bold.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 700;
				src: local("IBM Plex Sans Bold Italic"), local("IBMPlexSans-BoldItalic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-BoldItalic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-BoldItalic.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 200;
				src: local("IBM Plex Sans ExtraLight"), local("IBMPlexSans-ExtraLight"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-ExtraLight.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-ExtraLight.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 200;
				src: local("IBM Plex Sans ExtraLight Italic"), local("IBMPlexSans-ExtraLightItalic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-ExtraLightItalic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-ExtraLightItalic.woff") format("woff"); }

			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 400;
				src: local("IBM Plex Sans Italic"), local("IBMPlexSans-Italic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-Italic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-Italic.woff") format("woff"); }
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 300;
				src: local("IBM Plex Sans Light"), local("IBMPlexSans-Light"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-Light.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-Light.woff") format("woff"); }

			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 300;
				src: local("IBM Plex Sans Light Italic"), local("IBMPlexSans-LightItalic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-LightItalic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-LightItalic.woff") format("woff"); }

			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 500;
				src: local("IBM Plex Sans Medium"), local("IBMPlexSans-Medium"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-Medium.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-Medium.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 500;
				src: local("IBM Plex Sans Medium Italic"), local("IBMPlexSans-MediumItalic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-MediumItalic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-MediumItalic.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 400;
				src: local("IBM Plex Sans"), local("IBMPlexSans"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-Regular.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-Regular.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 600;
				src: local("IBM Plex Sans SemiBold"), local("IBMPlexSans-SemiBold"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-SemiBold.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-SemiBold.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 600;
				src: local("IBM Plex Sans SemiBold Italic"), local("IBMPlexSans-SemiBoldItalic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-SemiBoldItalic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-SemiBoldItalic.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 450;
				src: local("IBM Plex Sans Text"), local("IBMPlexSans-Text"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-Text.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-Text.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 450;
				src: local("IBM Plex Sans Text Italic"), local("IBMPlexSans-TextItalic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-TextItalic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-TextItalic.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: normal;
				font-weight: 100;
				src: local("IBM Plex Sans Thin"), local("IBMPlexSans-Thin"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-Thin.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-Thin.woff") format("woff"); }
			
			@font-face {
				font-family: 'IBM Plex Sans';
				font-style: italic;
				font-weight: 100;
				src: local("IBM Plex Sans Thin Italic"), local("IBMPlexSans-ThinItalic"), url("../fonts/IBM-Plex-Sans/woff2/IBMPlexSans-ThinItalic.woff2") format("woff2"), url("../fonts/IBM-Plex-Sans/woff/IBMPlexSans-ThinItalic.woff") format("woff"); }
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(tristylesIBMPlexFonts, "trioutlook-room-reservation/styles/tristyles-ibm-plex.js");