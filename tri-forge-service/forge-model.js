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
import '../@polymer/app-layout/app-grid/app-grid-style.js';
import '../@polymer/iron-icons/iron-icons.js';
import '../@polymer/iron-pages/iron-pages.js';
import '../@polymer/paper-button/paper-button.js';
import '../@polymer/paper-checkbox/paper-checkbox.js';
import '../@polymer/paper-dialog/paper-dialog.js';
import '../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../@polymer/paper-fab/paper-fab.js';
import '../@polymer/paper-icon-button/paper-icon-button.js';
import '../@polymer/paper-input/paper-input.js';
import '../@polymer/paper-item/paper-item.js';
import '../@polymer/paper-listbox/paper-listbox.js';
import '../@polymer/paper-progress/paper-progress.js';
import '../@polymer/paper-spinner/paper-spinner-lite.js';
import './forge-card.js';
import './forge-model-detail.js';
import './forge-model-storage.js';
import './forge-bubble-storage.js';
import './forge-model-sidebar.js';
import './forge-thumbnail.js';
import { getModuleUrl  } from '../tricore-util/tricore-util.js';
var __dictionary__toggelSideBar = "Toggle side bar";
class ForgeModel extends PolymerElement 
{
  static get template() {
    return html`
        <style>
            :host {
                --forge-scroll-pane-overflow:auto;
            }
            html, body {
                margin  : 0;
                padding : 0;
                height  : 100%;
                width   : 100%;
            }
            app-drawer-layout:not([narrow]) [drawer-toggle] {
                  display: none;
            }
            #modelheader {
                top              : 64px;
                background-color : #407DC9;
                font-family      : arial; 
                padding-right    : 0;
            }
            app-header {
                top              : 64px;
            }
            app-drawer {
                top : 64px;
                --app-drawer-content-container: {
                    background-color: #B0BEC5;
                }
            }
            app-toolbar {
                background-color : #0696D7;
                font-family      : arial; 
                width            : 100%;
                padding          : 0;
            }
            paper-button {
                background-color : #204080;
                color            : white;
            }		
            .buttons {
                float            : right;
            }
            #contentContainer {
                position         : relative;
                top              : 64px;
                width            : calc( 100% + 268px );
                height           : 100%;
                left             : -300px;
            }
            #wrapper 
            {
                top              : 64px;
            }
            .drawer-content 
            { 
                height        : calc( 100% + 56px ); 
                overflow      : auto; 
                padding-left  : 10px;
                padding-right : 10px;
                position      : relative;
                top           :-120px
            } 
            img.logo {
                   width         : 240px;
                   height        : 48px;
                   float         : left;
            }
            paper-fab {
                background-color : #e0a30b;
                position         : absolute !important;
                bottom           : 1em;
                right            : 1em;
                z-index          : 10;
            }
            paper-progress {
                width                   : 100%;
                --paper-progress-height : 8px;
                float                   : bottom;
            }
            paper-spinner-lite {
                width            : 200px;
                height           : 200px;
                --paper-spinner-stroke-width : 8px;
            }
            h3 {
                margin-top    : 8px;
                margin-bottom : 4px;
                width : 100%;
            }
            h4.label {
                margin-top    : 4px;
                margin-bottom : 4px;
            }
            #drawerToggle {
                height           : 64px;
                width            : 64px;
            }
            .scrollpane {
                --forge-scroll-pane-overflow : auto;
                overflow                     : auto;
            }
            .card-body {
                display          : inline-block;
                width            : 320px;
                height           : 280px;
                background-color : white;
                padding-bottom   : 0px;
                overflow-x       : auto;
                overflow-y       : hidden;
                box-sizing       : border-box;
                margin           : 12px;
                padding          : 12px;
                padding-bottom   : 0;
                box-shadow       : 10px 10px 5px #abc;
            }
            .card-title {
                width            : 100%;
                padding-top		 : 0px;
                white-space      : nowrap;
            }
            .translate {
                margin           : 0;
                padding          : 0;
                height           : 160px;
                width            : 160px;
                margin           : 20px;
                cursor           : pointer;
            }
            .detail {
                float            : right;
                height           : 48px;
                width            : 48px;
            }
            paper-input.search {
                min-width        : 150px;
            }
            .icons {
                height           : 48px;
                width            : 48px;
                padding          : 8px;
            }
            div.search {
                   width         : 64px;
                   height        : 64px;
                padding       : 0;
                float         : right;
                margin-top    : 16px;
            }
            
           @media (max-width: 800px) {
              :host {
                --app-grid-columns: 2;
              }
            }
           @media (max-width: 640px) {
              :host {
                --app-grid-columns: 1;
              }
            }
        </style>
             
        <paper-fab icon="icons:cloud-upload" on-click="showUploadModelDlg"></paper-fab>
        <app-drawer-layout id="drawerPanel"> 
            <app-drawer slot="drawer" swipe-open="true" align="left"> 
                <app-toolbar style="top :-120px">
                    <span style="text-align: center; width:100%;"><h1>Buckets</h1></span>
                </app-toolbar>
                <div class="drawer-content"> 
                    <forge-model-sidebar id="bucketlist" on-bucket-select="_onBucketSelect">
                    </forge-model-sidebar>
                </div> 
            </app-drawer> 
            
            <app-header-layout>
                <app-header id="modelheader" slot="header" reveals="true">
                    <app-toolbar>
                        <div style="padding-left:24px"></div>
                        <paper-icon-button id="drawerToggle" icon="chevron-left" class="icons" on-click="_toggleDrawer" alt="[[__dictionary__toggelSideBar]]"></paper-icon-button> 
                        <img src="[[importPath]]images/AutodeskForgeLogo.png" class="logo">
                        <span style="text-align: center; width:100%;"><h1>Models</h1></span>
                        <paper-input floatinglabel="" label="Model Name" value="{{nameSearch}}" on-keypress="_onSearchKey" class="search"></paper-input>
                        <div class="search">
                            <paper-icon-button id="search" icon="search" on-click="_onSearch" class="icons"></paper-icon-button>
                        </div>
                    </app-toolbar>
                </app-header>

                <forge-scroll-pane id="scrollPane" class="scrollpane" on-next-page="_getNextPage">
                    <div style="display:inline">
                        <template id="repeat" is="dom-repeat" items="[[modellist]]">
                            <div class="card-body">
                                <div class="card-title">
                                    <h3>{{item.objectKey}}</h3>
                                </div>
                                <div style="display:inline; width:300px;">
                                    <iron-pages selected="{{item.cardImage}}" style="display:inline">
                                        <paper-spinner-lite active="">
                                        <!-- 0: Spinner while bubble loading -->
                                        </paper-spinner-lite>
                                        <!-- 1: No bubble, button to request translation -->
                                        <img src="[[importPath]]images/translate_model.png" on-click="_createBubble" class="translate" alt="Translate to viewable">
                                        <!-- 2: Bubble with Thumbnail -->
                                        <div style="display:inline; width:200px">
                                            <forge-thumbnail url="[[item.thumbnail]]" on-select="_onDisplayModel">
                                        </forge-thumbnail></div>
                                        <!-- 3: Bubble, but no thumbnail -->
                                        <div></div>
                                        <!-- 4: Bubble not completely translated -->
                                        <table style="height:200px; width:200px; display:inline">
                                            <tbody><tr>
                                                <td><h4 class="label">Success:</h4></td>
                                                <td>{{item.bubble.success}}</td>
                                            </tr>
                                            <tr>
                                                <td><h4 class="label">Progress:</h4></td>
                                                <td>{{item.bubble.progress}}</td>
                                            </tr>
                                            <tr>
                                                <td><h4 class="label">Status:</h4></td>
                                                <td>{{item.bubble.status}}</td>
                                            </tr>
                                        </tbody></table>
                                    </iron-pages>
                                    <div style="float:right; display:inline;">
                                          <paper-icon-button src="[[importPath]]images/information.png" class="detail" on-click="_onModelDetail" alt="Display Model Detail">
                                    </paper-icon-button></div>
                                </div>
                                <div style="height:12px;">
                                    <template is="dom-if" if="[[item.hasProgress]]">
                                        <paper-progress value="[[item.uploadProgress]]"></paper-progress>
                                    </template>
                                </div>
                            </div>
                        </template> 
                    </div>
                 </forge-scroll-pane>
            </app-header-layout>
        </app-drawer-layout> 

        <paper-dialog id="uploadModelDlg">
            <h2>Model Upload</h2>
            <div>
                <paper-input id="uploadModelFile" floatinglabel="" label="Model File" type="file" required="true"></paper-input>
                  <paper-checkbox id="uploadModelRegister" checked="{{uploadModelRegister}}">Also translate to viewable?</paper-checkbox>
                <paper-dropdown-menu label="Region">
                    <paper-listbox id="uploadModelRegion" slot="dropdown-content" attr-for-selected="value" selected="US">
                        <paper-item value="US">US</paper-item>
                        <paper-item value="EMEA">EMEA</paper-item>
                    </paper-listbox>
                </paper-dropdown-menu>
                <paper-input id="uploadModelRoot" floatinglabel="" label="Root file Name" value="{{uploadModelRoot}}"></paper-input>
            </div>
            <div class="buttons">
                <paper-button dialog-confirm="" on-click="uploadModel" raised="">OK</paper-button>
                <paper-button dialog-dismiss="" autofocus="" raised="">Cancel</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="translateModelDlg">
            <h2>Model Translate to Viewable</h2>
            <paper-dialog-scrollable>
                <paper-input id="translateModelobjectKey" floatinglabel="" label="Object Key" readonly="true"></paper-input>
                <paper-input id="translateModelRoot" floatinglabel="" label="Root file" value="{{uploadModelRoot}}"></paper-input>
                <paper-dropdown-menu label="Region">
                    <paper-listbox id="translateModelRegion" slot="dropdown-content" attr-for-selected="value" selected="US">
                        <paper-item value="US">US</paper-item>
                        <paper-item value="EMEA">EMEA</paper-item>
                    </paper-listbox>
                </paper-dropdown-menu>
            </paper-dialog-scrollable>
            <div class="buttons">
                <paper-button dialog-confirm="" on-click="_translateModel" raised="">OK</paper-button>
                <paper-button dialog-dismiss="" autofocus="" raised="">Cancel</paper-button>
            </div>
        </paper-dialog>

           <forge-model-detail id="model_detail" on-model-delete="_onDeleteModel" on-bubble-delete="_deleteBubble" on-bubble-refresh="_refreshBubble">
           </forge-model-detail>

        <forge-model-storage id="storage" appkey="{{appKey}}" restpath="[[restpath]]" on-model-list="_onModelList" on-model-add="_onModelAdd" on-model-delete="_onModelDelete" on-model-detail="onModelDetail">
        </forge-model-storage>

        <forge-bubble-storage id="bubbles" restpath="[[restpath]]" on-bubble-add="_onBubbleAdd" on-bubble-delete="_onBubbleDelete" on-bubble-detail="_onBubbleDetail">
        </forge-bubble-storage>
`;
  }

  static get is() { return 'forge-model' }

  static get properties() 
  {
      return {
          appkey : {
              type     : String,
              observer : 'appKeyChanged'
          },
          fetchSize : {
              type               : Number,
              value              : 30
          },
          modellist : {
              type               : Array,
              readonly           : true,
              notify             : true,
              reflectToAttribute : true
          },
          restpath : {
              type     : String,
          }
      }
  }

  constructor()
  {
      super();
      this.nameSearch   = "";
     this.activeBucket = null;
    this.reset        = false;		// Stops timers monitoring model translation if key is changed

  }

  ready() 
  {
      super.ready();

      this._url = "";
       var path = location.pathname;
      var idx = path.lastIndexOf( "/" );
      if( idx > 0 )
     {
        this._url = path.substring( 0, idx );  		    		
     }

    // Hack for firefox
     if( this.$.modelheader )
     {
         this.$.modelheader.style.top = "64px";	
     }
     
     // Hack for Edge
     this.$.scrollPane.setOverflow( "auto" );
  }

  _onBucketSelect(
      event
  ) {
      this.activeBucket = event.detail;
      if( this.activeBucket )
      {
          this.$.storage.bucketkey = this.activeBucket.bucketKey;
        this.getModelList();
      }
      else
      {
          this.$.storage.buckekKey = "";
      }
    this.modellist = [];
  }

  //============================================================================
  // Model List
  //============================================================================
  getModelList(
      search
  ) {
      if( this.$.bucketlist.bucketlist.length == 0 )
      {
          this.dispatchEvent( new CustomEvent('forge-message', { bubbles: true, composed: true, 
                                                                 detail: { key : "LIST_BUCKETS"	}  } ));
          return;
      }
      this.$.search.disabled = "true";
      this.lastFetchIdx = 0;
      if( search == null ) search = this.nameSearch; 
      this.$.storage.getList( search, this.fetchSize );
  }

  _onSearch(
      event
  ) {
      this.getModelList();
  }

  _onSearchKey(
      event
  ) {
      if( event.keyCode == 13 ) 
      {
          this._onSearch();
      }
  }

  _getNextPage()
  {
      this.$.storage.getNextPage();
  }

  _onModelList( 
      event 
  ) {
      this.$.search.disabled = false;
      if( !event.detail )		// Fetch error
      {
          this.$.repeat.render();
          return;
      }

      this.reset     = false;
      
      var start = this.lastFetchIdx;
      this.lastFetchIdx = event.detail.length;

      for( var i = start; i < event.detail.length; i++ )
      {
          event.detail[i].activeTab      = 0;
          event.detail[i].cardImage      = 0;
          event.detail[i].thumbnail      = "";
          event.detail[i].hasBubble      = false;
          event.detail[i].hasProgress    = false;
          event.detail[i].hasThumbnail   = false;
          event.detail[i].hasProject     = false;
          event.detail[i].uploadProgress = null;
      } 

      this.$.repeat.render();

      if( event.detail.length == 0 )
      {
          this.dispatchEvent( new CustomEvent('forge-message', { bubbles: true, composed: true, 
                                                                 detail: { key : "NO_MODELS" }  } ));
          return;
      }
      
      this.listLength = event.detail.length - start;
      this.bubbleCount = 0;
      
      for( var i = start; i < event.detail.length; i++ )
      {
            this.$.storage.details( event.detail[ i ].objectKey, event.detail[ i ] );
            this.$.bubbles.details( event.detail[ i ].objectId, { processingList : true} );
      } 
  }

  //============================================================================
  // Model Details
  //============================================================================
  requestModel (
    event
) {
    this.$.storage.details( this.modellist[ event.model.index ].bucketKey,
                            this.modellist[ event.model.index ].objectKey,
                            event.model );
}

  onModelDetail( event )
  {
      var model = event.detail.model;
      for( var i in this.modellist )
      {
          if( model.objectKey === this.modellist[i].objectKey )
          {
              this.set( "modellist." + i + ".hasProgress", false );
              for( var name in model )
              {
                  this.set( "modellist." + i + "." + name, model[ name ] );
              }
              break;
          }
      }

        var data = event.detail.data;
        
        if( data )
        {
            if( data.translate )
            {
                if( this.reset ) return;		// App key changed
                var translate = {
                    storage  : this.$.bubbles,
                    data     : data,
                    objectId : model.objectId,
                    region   : data.region,
                    rootFile : data.rootFile,
                    timeout  : function() 
                    { 
                        this.storage.translate(  this.objectId, this.region, this.rootFile, this.data );  
                    }
                };
                window.setTimeout( translate.timeout(), 10000 );
            }
            else if( data.add )
            {
                this.$.bubbles.details( model.objectId );
            }
        }
  }

  //============================================================================
  // Model Upload
  //============================================================================
  showUploadModelDlg()
  {
      if( this.$.bucketlist.bucketlist.length == 0 )
      {
          this.dispatchEvent( new CustomEvent('forge-message', { bubbles: true, composed: true, 
                                                                 detail : { key : "BUCKET_LIST_UPLOAD" }  } ));
          return;
      }

      this.$.uploadModelFile.$.nativeInput.value = "";
      this.uploadModelFile     = "";
      this.uploadModelRoot     = "";
        this.uploadModelRegister = false;
      this.$.uploadModelDlg.open();
  }

  uploadModel()
  {
      var files      = this.$.uploadModelFile.$.nativeInput.files;
      var rootFile   = this.$.uploadModelRoot.value;
        var translate  = this.$.uploadModelRegister.checked;
        var region     = this.$.uploadModelRegion.selected;
        if( files.length == 0 ) return;
        var modelFile = files[0];
        
        
        var fileName  = modelFile.name; 
        fileName      = fileName.replace( "\\", "/" );
      var idx       = fileName.lastIndexOf( '/' );
      var objectKey = fileName.substring( idx + 1 );
      
      var data = {
          translate : translate,
          rootFile  : rootFile,
          region    : region,
          add       : true
      };
      
      this.$.storage.upload( objectKey,
                             modelFile, 
                             ( objectKey, read, total ) => { this._onProgress( objectKey, read, total ) }, 
                             data );
  }

  _onProgress(
      objectKey, bytesRead, bytesTotal
  ) {
      var progress = null;
      if( bytesRead > 0 || bytesRead < bytesTotal )
      {
          progress = bytesRead / bytesTotal * 100;
      } 
      for( var i in this.modellist )
      {
          if( objectKey === this.modellist[i].objectKey )
          {
              var m = this.modellist[i];
              this.set( "modellist." + i + ".hasProgress", true );
              this.set( "modellist." + i + ".uploadProgress", progress );
              break;
          }
      }
  }

  _onModelAdd(
      event
  ) {
      var model = event.detail.model;
      model.activeTab      = 0;
      model.uploadProgress = 0;
      model.hasProgress    = false;
        this.$.repeat.render();
  }

  //============================================================================
  // Model Delete
  //============================================================================
  _onDeleteModel(
      event
  ) {
    this.$.storage.delete( event.detail.objectKey, event.detail.model );
  }

  _onModelDelete(
      event
  ) {
      this.$.repeat.render();
  }

  //============================================================================
  // Bubble Details
  //============================================================================
  _refreshBubble(
      event
  ) {
      this.$.bubbles.details( event.detail.objectId );
  }

  _onBubbleDetail(
      event
  ) {
      var bubble = event.detail.bubble;
      var data = event.detail.data;
      this._setBubbleData( bubble, event.detail.objectId, event.detail.projectInfo );
      if( data && data.processingList )
      {
          var ml = this.modellist;
          this.bubbleCount++;
          if( this.bubbleCount == this.listLength )
          {
              this.dispatchEvent( new CustomEvent('model-list', { bubbles: true, composed: true, detail: this.modellist } ));
          }
      }
  }

  //============================================================================
  // Bubble Create
  //============================================================================
  _createBubble(
      event
  ) {
        this.$.translateModelDlg.model = event.model;
        this.$.translateModelobjectKey.value = event.model.item.objectKey;
        this.$.translateModelRoot.value = "";
        this.$.translateModelDlg.open();
  }

  _translateModel()
  {
      var model  = this.$.translateModelDlg.model;
        var region = this.$.translateModelRegion.selected;
        var root   = this.$.translateModelRoot.value;
        
        this.$.bubbles.translate( model.item.objectId, region, root, model );
  }

  _onBubbleAdd( event )
  {
      var bubble = event.detail.bubble;
      if( bubble.result != "success" )
      {
          return;
      }
      this._setBubbleData( bubble, event.detail.objectId, event.detail.projectInfo );

      var update = {
          refresh : function(
          ) {
              this.storage.details( this.objectId, this.data );
              this.count++;
              for( var i in this.modellist )
              {
                  if( this.modellist[i].objectId == this.objectId )
                  {
                      var bubble = this.modellist[i].bubble;
                      if( bubble )
                      {
                          if( bubble.success == "100%" ) return;
                          if( bubble.status )
                          {
                               if(    bubble.status != "inprogress" 
                                   && bubble.status != "pending"
                               ) return;
                          }
                      }
                  }
              }
              if( this.count > 200 ) return;

              window.setTimeout( () => { this.refresh() }, 30000 )
          },
          storage     : this.$.bubbles,
          modellist   : this.modellist,
          objectId    : event.detail.objectId,
          bubble      : event.detail.bubble,
          data        : event.detail.data,
          count       : 0
      }
      update.refresh();
  }

  //============================================================================
  // Bubble Delete
  //============================================================================
  _deleteBubble(
      event
  ) {
        this.$.bubbles.delete( event.detail.objectId )
  }

  _onBubbleDelete(
      event 
  ) {
      var result = event.detail.result;
      if( result.result != "success" )
      {
          return;
      }
      this._setBubbleData( null, event.detail.objectId, null );
  }

  //============================================================================
  // Utilities
  //============================================================================
  _setBubbleData(
      bubble, objectId, projectInfo
  ) {
      for( var i in this.modellist )
      {
          if( this.modellist[i].objectId == objectId )
          {
              if( !bubble )
              {
                  this.set( "modellist." + i + ".cardImage", 1 );
                  this.set( "modellist." + i + ".thumbnail", "" );
                  this.set( "modellist." + i + ".hasBubble", false );
                  this.set( "modellist." + i + ".hasProject", false );
                  this.set( "modellist." + i + ".bubble", {} );
                  this.set( "modellist." + i + ".hasThumbnail", false );
                  return;
              }
              this.set( "modellist." + i + ".hasBubble", true );
              
              if( !this.modellist[i].bubble ) this.modellist[i].bubble = {};
              for( var name in bubble )
              {
                  this.set( "modellist." + i + ".bubble." + name, bubble[ name ] );
              }
              for( var j in bubble.children )
              {
                  if( bubble.children[j].role == "viewable" )
                  {
                      if( bubble.children[j].messages && bubble.children[j].messages.length > 0 )
                      {
                          this.modellist[i].bubble.message = {};
                          bubble.message = bubble.children[j].messages[0];
                          this.set( "modellist." + i + ".bubble.message", bubble.children[j].messages[0] );
                      }
                  }
              }

              var thumbnail = this.$.bubbles.getThumbnail( bubble );

              var cardImage = 2;
              this.set( "modellist." + i + ".projectInfo", projectInfo );
              this.set( "modellist." + i + ".hasProject", this.modellist[i].projectInfo != null );
              this.set( "modellist." + i + ".thumbnail", thumbnail );
              this.set( "modellist." + i + ".hasThumbnail", thumbnail != null );
              if( bubble.success != "100%" ) cardImage = 4;
              else if( !this.modellist[i].hasThumbnail ) cardImage = 3;
              this.set( "modellist." + i + ".cardImage", cardImage );
              return i;
          }
      }
  }

  _toggleDrawer() 
  {
      var drawerPanel = this.$.drawerPanel;
      var drawer = drawerPanel.drawer;
      drawer.toggle();
      if( drawer.opened )
      {
          this.$.drawerToggle.icon = "chevron-left";
      }
      else
      {
          this.$.drawerToggle.icon = "chevron-right";
      }
      drawerPanel.forceNarrow = !drawer.opened;
      setTimeout( () => { this.$.scrollPane.resize(); }, 100 );
  }

  _onDisplayModel(
      event
  ) {
      var urn = event.model.item.bubble.urn;
      this.dispatchEvent( new CustomEvent('display-model', { bubbles: true, composed: true, 
                                                             detail: { urn : urn  } } ));
  }

  _onModelDetail(
      event
  ) {
      this.$.model_detail.open( event.model.item );
  }

  //============================================================================
  // Observers
  //============================================================================
  appKeyChanged(
        newValue, oldValue
    ) {
      this.key       = newValue;
      this.reset     = true;
      this.modellist = [];
      this.dispatchEvent( new CustomEvent('model-list', { bubbles: true, composed: true, detail: null } ));
  }

  static get importMeta() {
    return getModuleUrl("tri-forge-service/forge-models.js");
  }
}

customElements.define( ForgeModel.is, ForgeModel );
