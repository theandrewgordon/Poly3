/*
@license
IBM Confidential - OCO Source Materials - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
import "../@polymer/iron-icon/iron-icon.js";

import "../@polymer/iron-iconset-svg/iron-iconset-svg.js";
import { addDomNodes } from "../tricore-util/tricore-util.js";

const domNodesContainer = `
<iron-iconset-svg name="portal" size="24">
<!--
	  icon: request (from TRIRIGA)
  -->
<svg version="1.1" id="request" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
<style type="text/css">
	.request-st0{clip-path:url(#SVGID_2_);}
	.request-st1{clip-path:url(#SVGID_4_);}
	.request-st2{clip-path:url(#SVGID_6_);}
</style>
<g>
	<defs>
		<path id="SVGID_1_" d="M23,20.6L18,26v-1v-2h-2c-2.7,0-5.2-1-7.1-2.9C7,18.2,6,15.7,6,13s1-5.2,2.9-7.1C10.8,4,13.3,3,16,3
			s5.2,1,7.1,2.9C25,7.8,26,10.3,26,13C26,15.9,24.9,18.6,23,20.6z M24.5,4.5C22.3,2.3,19.3,1,16,1c-3.3,0-6.3,1.3-8.5,3.5
			C5.3,6.7,4,9.7,4,13s1.3,6.3,3.5,8.5C9.7,23.7,12.7,25,16,25v6l8.5-9c2.2-2.3,3.5-5.5,3.5-9C28,9.7,26.7,6.7,24.5,4.5z"></path>
	</defs>
	<use xlink:href="#SVGID_1_" style="overflow:visible;"></use>
	<clipPath id="SVGID_2_">
		<use xlink:href="#SVGID_1_" style="overflow:visible;"></use>
	</clipPath>
	<rect x="-1" y="-4" class="request-st0" width="34" height="40"></rect>
</g>
<g>
	<defs>
		<polygon id="SVGID_3_" points="15,7 15,11 15.5,16 16.5,16 17,11 17,7 		"></polygon>
	</defs>
	<use xlink:href="#SVGID_3_" style="overflow:visible;"></use>
	<clipPath id="SVGID_4_">
		<use xlink:href="#SVGID_3_" style="overflow:visible;"></use>
	</clipPath>
	<rect x="10" y="2" class="request-st1" width="12" height="19"></rect>
</g>
<g>
	<defs>
		<circle id="SVGID_5_" cx="16" cy="18" r="1"></circle>
	</defs>
	<use xlink:href="#SVGID_5_" style="overflow:visible;"></use>
	<clipPath id="SVGID_6_">
		<use xlink:href="#SVGID_5_" style="overflow:visible;"></use>
	</clipPath>
	<rect x="10" y="12" class="request-st2" width="12" height="12"></rect>
</g>
</svg>
<!--
	  icon: locate (from TRIRIGA)
  -->
<svg version="1.1" id="locate" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
<g>
	<path d="M24.484,4.515C22.313,2.343,19.313,1,16,1c-3.314,0-6.314,1.343-8.484,3.515C5.344,6.687,4,9.686,4,13
		c0,3.508,1.344,6.685,3.516,8.984L16,31l8.484-9.016C26.656,19.685,28,16.508,28,13C28,9.686,26.656,6.687,24.484,4.515z
		 M23.028,20.613L16,28.081L8.969,20.61C7.055,18.583,6,15.881,6,13c0-2.671,1.04-5.182,2.93-7.071C10.818,4.04,13.329,3,16,3
		c2.671,0,5.182,1.04,7.07,2.93C24.959,7.818,26,10.329,26,13C26,15.881,24.945,18.583,23.028,20.613z"></path>
	<circle cx="16" cy="13" r="4"></circle>
</g>
</svg>

</iron-iconset-svg>
`;

addDomNodes(domNodesContainer);