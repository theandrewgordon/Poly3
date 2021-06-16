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

import '../@polymer/app-layout/app-layout.js';
import '../@polymer/iron-icons/iron-icons.js';
import '../@polymer/iron-pages/iron-pages.js';
import '../@polymer/neon-animation/web-animations.js';
import '../@polymer/paper-checkbox/paper-checkbox.js';
import '../@polymer/paper-dialog/paper-dialog.js';
import '../@polymer/paper-icon-button/paper-icon-button.js';
import '../@polymer/paper-item/paper-item.js';
import '../@polymer/paper-listbox/paper-listbox.js';
import '../@polymer/paper-menu-button/paper-menu-button.js';
import '../@polymer/paper-menu-button/paper-menu-button-animations.js';
import '../@polymer/paper-tabs/paper-tabs.js';
import './forge-auth.js';
import './forge-bucket.js';
import './forge-model.js';
import './forge-viewable.js';
import './forge-scroll-pane.js';
import './forge-message-mgr.js';
import { getModuleUrl  } from '../tricore-util/tricore-util.js';
// Stand-alone
const FILE_PATH     = "/";
const RESOURCE_PATH = "/resource/proxy";

// TRIRIGA integration
// const FILE_PATH     = "/html/en/default/bim/forge";
// const RESOURCE_PATH = "/api/p/v1/forge";

class ForgeShell extends PolymerElement 
{
  static get template() {
    return html`
        <style>
            html, body {
                margin           : 0;
                padding          : 0;
                height           : 100%;
                width            : 100%;
                font-family      : arial; 
            }
            app-header {
                background-color : #204080;
                font-family      : arial; 
                  color            : #fff;
            }
            app-toolbar {
                padding : 0;
                margin  : 0;
            }
            paper-listbox {
                overflow : hidden;
            }
            paper-checkbox {
                font-size : 10pt;
            }
             paper-item {
                --paper-item-selected-weight: 400;
                color : black;
            }
            .auth-menu {
                position : absolute;
                top      : 0;
                right    : 0;
                display  : inline;
                z-index  : 100;
                color    : white;
            }
            img.logo {
                   width         : 200px;
                   height        : 48px;
                   margin-right  : 64px; 
                   float         : right;
            }
            .icons {
                height           : 48px;
                width            : 48px;
                padding          : 8;
            }
            .menu {
                cursor        : pointer;
            }
        </style>

        <div class="auth-menu">
        <paper-menu-button horizontal-align="right" vertical-align="top">
            <paper-icon-button icon="menu" slot="dropdown-trigger" class="icons" horizontal-align="left" vertical-align="top" alt="Menu"></paper-icon-button>
            <paper-listbox id="appMenu" slot="dropdown-content" opened="false" horizontal-align="left" vertical-align="top" onselect="menuSelect">
                <paper-item on-click="openAuthDlg">
                      <paper-checkbox checked="{{authenticated}}" disabled="true"></paper-checkbox>
                    Authenicate
                </paper-item>
                <paper-item on-click="doLogout" class="menu">Log out</paper-item>
                <paper-item on-click="doViewModel" class="menu">View Model</paper-item>
                <paper-item on-click="doSelectItem" class="menu">Select Item in Model</paper-item>
            </paper-listbox>
        </paper-menu-button></div>
        <app-header>
            <app-toolbar>
                <paper-tabs scrollable="" selected="{{activeTab}}" style="width:100%">
                    <paper-tab id="bucket">Buckets</paper-tab>
                    <paper-tab id="model">Model Files</paper-tab>
                    <paper-tab id="viewer">Viewer</paper-tab>
                </paper-tabs>
                <img src="[[importPath]]images/AutodeskForgeLogo.png" class="logo">
                
              </app-toolbar>
        </app-header>
        <iron-pages selected="{{activeTab}}" style="height:100%; width:100%">
            <forge-bucket appkey="{{appKey}}" restpath="[[restpath]]"></forge-bucket>
            <forge-model id="models" ,="" appkey="{{appKey}}" restpath="[[restpath]]" on-model-list="onModelList" on-display-model="_onDisplayModel">
            </forge-model>
            <forge-viewable id="viewable" appkey="{{appKey}}" modellist="[[models]]" restpath="[[restpath]]" features="{}"></forge-viewable>
        </iron-pages>
        
        <paper-dialog id="viewModelDlg">
            <h2>View Model</h2>
            <paper-input id="viewModelDlgURN" floatinglabel="" label="Model URN" autofocus=""></paper-input>
            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" on-click="onViewModel">OK</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="selectItemDlg">
            <h2>Select Item in Model</h2>
            <paper-input id="modelItemGUID" floatinglabel="" label="GUID" autofocus=""></paper-input>
            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" on-click="onSelectInModel">OK</paper-button>
            </div>
        </paper-dialog>

        <forge-auth id="authDlg" restpath="[[restpath]]" on-authenticate="onAuth"></forge-auth>
        <forge-message-mgr on-forge-401="_onAuthFailure"></forge-message-mgr>
`;
  }

  static get is() { return 'forge-shell' }

  constructor()
  {
      super();
      this.authenticated = false;
      this.models = [];
      this.activeTab = 0;
      this._contextRoot = "";
       var path = location.pathname;
      var idx = path.lastIndexOf( FILE_PATH );
      if( idx> 0 )
     {
        this._contextRoot = path.substring( 0, idx );  		    		
     }
      this.restpath = this._contextRoot + RESOURCE_PATH;
  }

  ready() 
  {
     super.ready();
  }

  menuSelect(
      event
  ) {
      var sel = this.$.appMenu.selected;
  }

  doLogout()
  {
      this.$.authDlg.logout();
  }

  openAuthDlg()
  {
      this.$.authDlg.open();
  }

  doViewModel(
      event
  ) {
      this.$.viewModelDlg.open();
  }

  _onDisplayModel(
      event
  ) {
      this.activeTab = 2;
      this.$.viewable.urn = event.detail.urn;
      if( event.detail.state )
      {
          this.$.viewable.displayView( event.detail.state );
      }
  }

  onViewModel(
      event
  ) {
      this.activeTab = 2;
      var URN = this.$.viewModelDlgURN.value;
      this.$.viewable.urn = URN;
  }

  doSelectItem(
      event
  ) {
      this.$.selectItemDlg.open();
  }

  onSelectInModel(
      event
  ) {
      this.activeTab = 2;
      var value = this.$.modelItemGUID.value;
      this.$.viewable.value = value;
  }

  onAuth( event )
  {
      var token = event.detail;
      this.authenticated = ( token.key && token.key != "undefined" ) ? true : false;
      this.appKey = token.key;
  }

  _onAuthFailure( event )
  {
    this.dispatchEvent( new CustomEvent('forge-message', { bubbles: true, composed: true,
                         detail: { key : "AUTH_REQUIRED" }  }  ));
  }

  onModelList( event )
  {
      this.models = event.detail;
  }

  static get importMeta() {
    return getModuleUrl("tri-forge-service/forge-shell.js");
  }
}

customElements.define( ForgeShell.is, ForgeShell );
