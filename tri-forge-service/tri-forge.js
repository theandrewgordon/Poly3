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
import './tri-bim-config.js';
import './forge-tri-bldg.js';
import './forge-tri-views.js';
import { importJs } from "../tricore-util/tricore-util.js";
import { getModuleUrl  } from '../tricore-util/tricore-util.js';
const importJsPromise = importJs(["../web-animations-js/web-animations-next-lite.min.js"], "tri-forge-service/tri-forge.js");

const FILE_PATH     = "/p/web";
const RESOURCE_PATH = "/api/p/v1/forge";




class TriForge extends PolymerElement 
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
                background-color : #003E68;
                font-family      : arial; 
                  color            : #fff;
            }
            paper-listbox {
                overflow : hidden;
            }
             paper-item {
                --paper-item-selected-weight: 400;
                color : black;
            }
            paper-button {
                background-color : #204080;
                color            : white;
            }		
            .auth-menu {
                position : absolute;
                top      : 0;
                right    : 0;
                display  : inline;
                z-index  : 100;
                color    : white;
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
            <paper-icon-button icon="menu" slot="dropdown-trigger" horizontal-align="left" vertical-align="top" class="icons" alt="Menu"></paper-icon-button>
            <paper-listbox id="appMenu" slot="dropdown-content" opened="false" horizontal-align="left" vertical-align="top" onselect="_menuSelect">
                <paper-item on-click="_openAuthDlg" role="menuitemradio" class="menu">Set Key: This Session</paper-item>
                <paper-item on-click="_openBIMConfig" role="menuitemradio" class="menu">Set Key: System Wide</paper-item>
                <paper-item on-click="_doLogout" role="menuitemradio" class="menu">Log out</paper-item>
                <paper-item on-click="_doViewModel" role="menuitemradio" class="menu">View Model</paper-item>
                <paper-item on-click="_doSelectItem" role="menuitemradio" class="menu">Select Item in Model</paper-item>
                <paper-item on-click="_doForgeViews" role="menuitemradio" class="menu">Manage Saved Views</paper-item>
            </paper-listbox>
        </paper-menu-button></div>
        <app-header>
            <app-toolbar>
                <paper-tabs scrollable="" selected="{{activeTab}}" style="width:100%">
                    <paper-tab id="bucket">Buckets</paper-tab>
                    <paper-tab id="model">Model Files</paper-tab>
                    <paper-tab id="Building">Buildings</paper-tab>
                    <paper-tab id="viewer">Viewer</paper-tab>
                </paper-tabs>
                
              </app-toolbar>
        </app-header>
        <iron-pages selected="{{activeTab}}" style="height:100%; width:100%">
            <forge-bucket id="buckets" appkey="{{appKey}}" restpath="[[restpath]]"></forge-bucket>
            <forge-model id="models" appkey="{{appKey}}" restpath="[[restpath]]" modellist="{{models}}" on-model-list="_onModelList" on-display-model="_onDisplayModel">
            </forge-model>
            <forge-tri-bldg contextroot="[[contextroot]]" modellist="[[models]]" modelmanager="[[\$.models]]" on-display-model="_onDisplayModel">
            </forge-tri-bldg>
            <forge-viewable id="viewable" appkey="{{appKey}}" modellist="[[models]]" restpath="[[restpath]]" features="[[features]]" locale="[[locale]]" contextroot="[[contextroot]]">
            </forge-viewable>
        </iron-pages>
        
        <paper-dialog id="viewModelDlg">
            <h2>View Model</h2>
            <paper-input id="viewModelDlgURN" floatinglabel="" label="Model URN" autofocus=""></paper-input>
            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" on-click="_onViewModel">OK</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="selectItemDlg">
            <h2>Select Item in Model</h2>
            <paper-input id="modelItemGUID" floatinglabel="" label="GUID" autofocus=""></paper-input>
            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" on-click="_onSelectInModel">OK</paper-button>
            </div>
        </paper-dialog>

        <forge-tri-views id="manageViews" contextroot="[[contextroot]]" restpath="[[restpath]]" on-display-model="_onDisplayModel"></forge-tri-views>

        <forge-auth id="authDlg" restpath="[[restpath]]" on-authenticate="_onAuth"></forge-auth>
        <tri-bim-config id="bimConfig" restpath="[[restpath]]" contextroot="[[contextroot]]" on-authenticate="_onAuth"></tri-bim-config>
        <forge-message-mgr on-forge-401="_onAuthFailure"></forge-message-mgr>
`;
  }

  static get is() { return 'tri-forge' }

  constructor()
  {
      super();
      this.authenticated = false;
      this.models = [];
      this.activeTab = 0;
      this.contextroot = "";
       var path = location.pathname;
      var idx = path.lastIndexOf( FILE_PATH );
      if( idx > 0 )
     {
        this.contextroot = path.substring( 0, idx );  		    		
     }
      this.restpath = this.contextroot + RESOURCE_PATH;
      this.loadPath = this.importPath;
    /**
      * A list of features expressed as toolbar icons to enable or disable.  Supported values are:
      * - camera      : Autodesk camera submenu
      *                 Default = true
      * - explode     : Autodesk explode tool.
      *                 Default = false
      * - fullscreen  : Autodesk viewer full screen toggle
      *                 Default = true
      * - markup      : Loads the markup extensions and displayes markup tools on the toolbar
      *                 Default = false
      * - measure     : Autodesk measure tool.
      *                 Default = false
      * - modelTree   : Autodesk Model Tree viewer
      *                 Default = true
      * - multiselect : TRIRIGA single select/multi select toggle.
      *                 Default = false
      * - properties  : AUtodesk pproperty viewer
      *                 Default = true
      * - search      : TRIRIGA search bar
      *                 Default = true
      * - section     : TRIRIGA selection submenu: Isolate Selectiom, Hide Selection, Auto Zoom, MUlti-select
      *                 Default = true
      * - settings    : Autodesk viewer settings.
      *                 Default = false
      * - view        : Displays the save and restore view tools on the toolbar.
      *                 Default = false
      */
      this.features = { explode : true, measure : true, settings : true, views : true };
  }

  ready() 
  {
     super.ready();
     this._getUser();

  }

  _menuSelect(
      event
  ) {
      var sel = this.$.appMenu.selected;
  }

  _doLogout()
  {
      this.$.authDlg.logout();
      this.$.authDlg.getKey();
  }

  _openAuthDlg()
  {
      this.$.authDlg.open();
  }

  _openBIMConfig()
  {
      this.$.bimConfig.open();
  }

  _doViewModel(
      event
  ) {
      this.$.viewModelDlg.open();
  }

  _onDisplayModel(
      event
  ) {
      this.activeTab = 3;
      this.$.viewable.urn = event.detail.urn;
      if( event.detail.state )
      {
          this.$.viewable.displayView( event.detail.state );
      }
  }

  _onViewModel(
      event
  ) {
      this.activeTab = 3;
      var URN = this.$.viewModelDlgURN.value;
      this.$.viewable.urn = URN;
  }

  _doSelectItem(
      event
  ) {
      this.$.modelItemGUID.value = "";
      this.$.selectItemDlg.open();
  }

  _doForgeViews(
      event
  ) {
      this.$.manageViews.openPopup();
  }

  _onSelectInModel(
      event
  ) {
      this.activeTab = 3;
      var value = this.$.modelItemGUID.value;
      this.$.viewable.value = value;
  }

  _onAuth( event )
  {
      var token = event.detail;
    if( token.ErrorCode || token.errorCode )
    {
        this.dispatchEvent( new CustomEvent('forge-auth-error', { bubbles: true, composed: true, detail: token }));
        return;
    }
      this.authenticated = ( token.key && token.key != "undefined" ) ? true : false;
      this.appKey = token.key;
  }

  _onAuthFailure( event )
  {
      if( this.appKey == null || this.appKey.length == 0 )
      {
        this.dispatchEvent( new CustomEvent('forge-message', { bubbles: false, composed: true,
                             detail: { key : "AUTH_REQUIRED" }  }  ));
        return;
      }
      console.log( "401" );
  }

  _onModelList( event )
  {
      this.models = event.detail;
  }

  _getUser()
  {
      var url = this.contextroot + "/p/webapi/rest/v2/triBIMViewer/-1/user?query=true";

      fetch( url, 
             { 
                  method: "GET",
                  headers: {
                      'content-type': 'application/json',
                      'Accept': 'application/json',
                  },
                     credentials: 'same-origin', 
             } 
          ).then(
              ( request ) => { this._onUser( request ); },
              ( err ) => { this._onError( err ); } );
  }

  _onUser(
      response 
  ) {
      if( !response.ok )
      {
          this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                    detail: { response : response }} ));
          return;
      }
      response.json().then(
          ( json ) => {  
              this.locale = json.data._Locale;
          },
          ( err ) => { this._onError( err ); }
      );
  }

  static get importMeta() {
    return getModuleUrl("tri-forge-service/tri-forge.js");
  }
}

customElements.define( TriForge.is, TriForge );
