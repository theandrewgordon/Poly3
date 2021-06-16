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

import '../@polymer/iron-localstorage/iron-localstorage.js';
import '../@polymer/paper-button/paper-button.js';
import '../@polymer/paper-dialog/paper-dialog.js';
import '../@polymer/paper-input/paper-input.js';
import '../@polymer/paper-input/paper-input-container.js';
import '../@polymer/neon-animation/animations/scale-up-animation.js';
import '../@polymer/neon-animation/animations/fade-out-animation.js';
import './forge-message-box.js';
import './forge-auth-storage.js';
class ForgeAuth extends PolymerElement 
{
  static get template() {
    return html`
        <style>
            paper-dialog {
                width : 300px;
            }
            paper-dialog-scrollable {
                overflow : auto;
            }
            paper-button {
                background-color : #204080;
                color            : white;
            }		
            .buttons {
                float            : right;
            }
        </style>

        <iron-localstorage name="forge-service-auth" value="{{credentials}}"></iron-localstorage>

        <paper-dialog id="authDlg" modal="">
            <h2>Authenticate</h2>
            <div>
                <paper-input floatinglabel="" label="Client ID" value="{{appkey}}" autofocus=""></paper-input>
                <paper-input-container floatinglabel="">
                    <label slot="label">Client Secret</label>
                    <input id="secret" slot="input" type="password" value="{{secret}}" required="" class="paper-input-input">
                </paper-input-container>
                  <paper-checkbox checked="{{save}}">Save to local browser?</paper-checkbox>
            </div>
            <div class="buttons">
                <paper-button dialog-confirm="" on-click="getToken" raised="">OK</paper-button>
                <paper-button dialog-dismiss="" raised="">Cancel</paper-button>
            </div>
        </paper-dialog>
        
        <forge-auth-storage id="storage" appkey="[[appkey]]" restpath="[[restpath]]"></forge-auth-storage>
`;
  }

  static get is() { return 'forge-auth' }

  static get properties() {
      return {
          appkey : {
              type     : String,
          },
          restpath : {
              type     : String,
          }
      }
  }

  constructor()
  {
      super();
      if( ! this.credentials )
      {
          this.credentials = { key : null, secret : null };
      }
  }

  ready() 
  {
     super.ready();
    this.$.storage.getKey();
  }

  open() 
  { 
      if( this.credentials )
      {
          if( this.credentials.key )
          {
              this.appkey = this.credentials.key.trim();
              this.save = true;
          }    
          if( this.credentials.secret ) this.secret = this.credentials.secret;
      }
      this.$.authDlg.open(); 
  }

  getKey()
  {
      this.$.storage.getKey();
   }

  getToken() 
  {
      var ell = this.shadowRoot.getElementById( "secret" );
      var secret = ell.value;
      if( secret ) secret = secret.trim();
      this.set( "secret", ell.value );
      if( this.appkey ) this.appkey = this.appkey.trim();
      this.$.storage.getToken( this.appkey, this.secret );
      if( this.save )
      {
          this.set( "this.credentials.key", this.appkey );
          this.set( "this.credentials.secret", this.secret );
      }
      else
      {
          this.set( "this.credentials.key", "" );
          this.set( "this.credentials.secret", "" );
      }
  }

  logout()
  {
      this.$.storage.logout();
  }
}

customElements.define(ForgeAuth.is, ForgeAuth);
