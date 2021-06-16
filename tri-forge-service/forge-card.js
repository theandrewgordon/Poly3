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
import { PolymerElement, html } from '../@polymer/polymer/polymer-element.js';

import '../@polymer/iron-collapse/iron-collapse.js';
import '../@polymer/paper-icon-button/paper-icon-button.js';
class ForgeCard extends PolymerElement 
{
  static get template() {
   return html`
        <style>
            .body {
                padding          : 0;
            }
            .header {
                display          : inline;
                width            : 100%; 
            }
            .icons {
                height           : 48px;
                width            : 48px;
                padding          : 8px;
            }
            .title {
                width            : 100%; 
            }
        </style>

        <div class="body">
            <div class"header""="">
                   <paper-icon-button id="toggleButton" icon="expand-more" on-click="_toggleDetails" class="icons" alt="Toggle details"></paper-icon-button>
                <slot id="titleSlot" name="title" class="title"></slot>
            </div>
            <iron-collapse id="details">
                <slot></slot>
            </iron-collapse>
        </div>
`;
 }

 static get is() { return 'forge-card' }

 static get properties() {
     return {
         value : {
             type     : Object,
         },
         opened : {
             type     : Boolean,
             readOnly : true
         }
     }
 }

 constructor()
 {
     super();
 }

 ready() 
 {
    super.ready();
 }

 close()
 {
   if( this.$.details.opened )
   {
       this.$.details.toggle();
   }
   this.$.icon = this.$.details.opened ? "expand-more" : "expand-less";
 }

 open()
 {
   if( !this.$.details.opened )
   {
       this.$.details.toggle();
   }
   this.$.icon = this.$.details.opened ? "expand-more" : "expand-less";
 }

 _toggleDetails (
   event
) {
   event.currentTarget.icon = this.$.details.opened ? "expand-more" : "expand-less";
   this.$.details.toggle();
   
   this.opened = this.$.details.opened;

   if( this.$.details.opened )
   {
       this.dispatchEvent( new CustomEvent('display-details', { bubbles: true, composed: true, detail: this.value } ));
   }
}
}

customElements.define( ForgeCard.is, ForgeCard );
