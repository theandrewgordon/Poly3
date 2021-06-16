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

import '../@polymer/paper-button/paper-button.js';
import '../@polymer/paper-dialog/paper-dialog.js';
import '../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../@polymer/paper-icon-button/paper-icon-button.js';

class ForgeMessageBox extends PolymerElement 
{
  static get template() {
    return html`
        <style>
            paper-button {
                background-color : #204080;
                color            : white;
            }		
            .buttons {
                float            : right;
            }
        </style>

        <paper-dialog id="messageBox" modal="">
            <h2>[[value.title]]</h2>
            <paper-dialog-scrollable>
                <div style="display:inline">
                    [[value.label]]
                    <paper-icon-button icon="[[icon]]">[[value.label]]</paper-icon-button>
                </div>
                <template id="repeat" is="dom-repeat" items="[[value.messages]]">
                    <p>[[item]]</p>
                </template>
                <div id="body"></div>
                <div> <a href="[[value.link]]">[[value.link]]</a></div>
            </paper-dialog-scrollable>
            <div class="buttons">
                <paper-button dialog-dismiss="" autofocus="" on-click="_close" raised="">Close</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'forge-message-box' }

  static get properties() {
      return {
          value : {
              type     : Object,
              observer : '_onValue'
          },
      }
  }

  ready()
  {
       super.ready();
       
       this.icon     = "error";
      this.messages = [];
  }

  open()
  {
      this.$.messageBox.open();
  }

  _close()
  {
      this.parentNode.removeChild( this );
  }

  //============================================================================
  // Observers
  //============================================================================
  _onValue(
        newValue, oldValue
    ) {
        if( newValue.body )
        {
            this.$.body.innerHTML = newValue.body;
        }
  }
}

customElements.define( ForgeMessageBox.is, ForgeMessageBox );
