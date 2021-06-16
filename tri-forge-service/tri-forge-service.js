/** 
* Copyright Wipro 2017
*
* Licensed under the Eclipse Public License - v 1.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* https://www.eclipse.org/legal/epl-v10.html
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* 
* @Author Doug Wood 
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import './tri-forge.js';

import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../@polymer/polymer/polymer-element.js';
import { TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js"

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<style>
    html, body {
        margin                 : 0;
        padding                : 0;
        font-family            : 'Roboto', 'Noto', sans-serif;
        -webkit-font-smoothing : antialiased;
        background             : #f1f1f1;
        height                 : 100%;
        width                  : 100%;
        overflow               : hidden;
    }
</style>`;

document.head.appendChild($_documentContainer.content);
Polymer({
  _template: html`
        <tri-forge></tri-forge>
`,

  is: "tri-forge-service",
  behaviors: [TriPlatViewBehavior]
});
