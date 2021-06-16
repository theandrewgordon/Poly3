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
import '../@polymer/paper-spinner/paper-spinner-lite.js';
import '../@polymer/neon-animation/animations/scale-up-animation.js';
import '../@polymer/neon-animation/animations/fade-out-animation.js';
import './forge-message-box.js';
import './forge-auth-storage.js';
const _getConfigPath    = "/p/webapi/rest/v2/triBIMViewer/-1/config?query=true";
const _updateConfigPath = "/p/webapi/rest/v2/triBIMViewer/-1/config?actionGroup=actions&action=update";
const _addConfigPath    = "/p/webapi/rest/v2/triBIMViewer/-1/config?actionGroup=actions&action=create";

class TriBIMConfig extends PolymerElement 
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
            paper-spinner-lite {
                width            : 200px;
                height           : 200px;
                --paper-spinner-stroke-width : 8px;
            }
            .buttons {
                float            : right;
            }
        </style>

        <paper-dialog id="authDlg" modal="">
            <h2>System Wide Forge Application Key</h2>
            <div>
                <template is="dom-if" if="[[!hasConfig]]">
                    <paper-spinner-lite active="" class="green">
                </paper-spinner-lite></template>
                <template is="dom-if" if="[[hasConfig]]">
                    <paper-input floatinglabel="" label="Client ID" value="{{appkey}}" autofocus="" required=""></paper-input>
                    <paper-input-container floatinglabel="">
                        <label slot="label">Client Secret</label>
                        <input id="secret" slot="input" type="password" value="{{secret}}" required="" class="paper-input-input">
                    </paper-input-container>
                </template>
            </div>
            <div class="buttons">
                <paper-button dialog-confirm="" on-click="getToken" raised="">OK</paper-button>
                <paper-button dialog-dismiss="" raised="">Cancel</paper-button>
            </div>
        </paper-dialog>
        
        <paper-dialog id="updateConfigDlg" modal="">
            <h2>Confirm Forge Key Update</h2>
            <div>
                <p>Updating the system Forge application key change the key for all user of the Forge viewer 
                and will make existing model inaccessible to the viewer unless the new key has read access 
                to the buckets the models are stored in.</p>
                <p>Do you want to continue?</p>
            </div>
            <div class="buttons">
                <paper-button dialog-confirm="" on-click="updateConfig" raised="">Continue</paper-button>
                <paper-button dialog-dismiss="" raised="">Cancel</paper-button>
            </div>
        </paper-dialog>

        <forge-auth-storage id="storage" appkey="[[appkey]]" restpath="[[restpath]]" on-authenticate="">
        </forge-auth-storage>
`;
  }

  static get is() { return 'tri-bim-config' }

  static get properties() {
      return {
          appkey : {
              type     : String,
          },
          contextroot : {
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
      this.hasConfig = false;
      this.secret = "";
  }

  open() 
  { 
      this.getConfig(); 
      this.$.authDlg.open(); 
  }

  getToken() 
  {
      // this.$.secret down't work.  Possible becasue its inside a domif
      var ell = this.shadowRoot.getElementById( "secret" );
      this.secret = ell.value;
      this.$.storage.getToken( this.appkey, this.secret );
      this.$.updateConfigDlg.open();
  }

  updateConfig() 
  {
      var data = {
          "key"    : this.appkey,
          "secret" : this.secret,
      }
      
      if( this._id && this._id != "" )
      {
          data._id = this._id;
          this.update( data );
      }
      else
      {
          this.create( data );
      }
  }

  //============================================================================
  // Get BIM COnfiguration
  //============================================================================

  getConfig() 
  {
      this.set( "hasConfig", false );

      var url = this.contextroot + _getConfigPath;
      
      fetch( url, 
             { 
                  method: "GET",
                  headers: {
                      'Accept': 'application/json',
                  },
                     credentials: 'same-origin' 
             } 
          ).then(
              ( request ) => { this._onConfig( request ); },
              ( err ) => { this._onError( err ); } );
  }

  _onConfig(
      response 
  ) {
      if( response.redirected )
      {
          location.href = response.url;
      }
      if( !response.ok )
      {
          this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                    detail: { response : response, 
                                                                              source : "List BIM Configuration"  }} ));
          return;
      }
      response.json().then(
          ( json ) => {  
              this.set( "appkey",          json.data.key );
              this.set( "encrtypedSecret", json.data.secret );
              this.set( "secret",          "" );
              this.set( "_id",             json.data._id );
              this.set( "hasConfig",       true );
          },
          ( err ) => { this._onError( err ); }
      );
  }

  //============================================================================
  // Update BIM COnfiguration
  //============================================================================

  create(
      data
  ) {
      var body = {};
      body.data = data;
      
      var url = this.contextroot + _addConfigPath;
      
      fetch( url, 
             { 
                  method: "POST",
                  headers: {
                      'Accept': 'application/json',
                      'content-type' : 'application/json',
                  },
                     credentials: 'same-origin',
                     body : JSON.stringify( body )
             } 
          ).then(
              ( request ) => { this._onUpdate( request, "Create BIM Configuration" ); },
              ( err ) => { this._onError( err ); } );
  }

  update(
      data, path
  ) {
      var body = {};
      body.data = data;
      
      var url = this.contextroot + _updateConfigPath;
      
      fetch( url, 
             { 
                  method: "PUT",
                  headers: {
                      'Accept': 'application/json',
                      'content-type' : 'application/json',
                  },
                     credentials: 'same-origin',
                     body : JSON.stringify( body )
             } 
          ).then(
              ( request ) => { this._onUpdate( request, "Update BIM Configuration" ); },
              ( err ) => { this._onError( err ); } );
  }

  _onUpdate(
      response, source 
  ) {
      if( response.redirected )
      {
          location.href = response.url;
      }
      if( !response.ok )
      {
          this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                    detail: { response : response, 
                                                                              source : source  }} ));
          return;
      }
      response.json().then(
          ( json ) => {  
          },
          ( err ) => { this._onError( err ); }
      );
  }
}

customElements.define(TriBIMConfig.is, TriBIMConfig);
