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

import '../@polymer/iron-icons/iron-icons.js';
import '../@polymer/paper-button/paper-button.js';
import '../@polymer/paper-checkbox/paper-checkbox.js';
import '../@polymer/paper-icon-button/paper-icon-button.js';
import '../@polymer/paper-input/paper-input.js';
import '../@polymer/paper-input/paper-textarea.js';
import './forge-pager.js';
import './forge-scroll-pane.js';
import './forge-thumbnail.js';
import "../triblock-popup/triblock-popup.js";
import { getModuleUrl  } from '../tricore-util/tricore-util.js';
var __dictionary__details         = "Display details";
var __dictionary__viewlist        = "Forge Views List";
var __dictionary__viewDelete      = "Forge Views Delete";
var __dictionary__viewGetState    = "Forge Views Delete State";
var __dictionary__viewDeleteState = "Forge Views Delete State";
var __dictionary__title           = "Manage Forge Views";

const _viewPath       = "/p/webapi/rest/v2/triBIMViewer/-1/forgeViews?query=true"
const _getDataPath    = "/p/webdata";
const _deleteDataPath = "/p/webdata";
const _deleteViewPath = "/p/webapi/rest/v2/triBIMViewer/-1/forgeViews?actionGroup=actions&action=delete";
const _updateViewPath = "/p/webapi/rest/v2/triBIMViewer/-1/forgeViews?actionGroup=actions&action=update";

class ForgeTriViews extends PolymerElement 
{
  static get template() {
   return html`
        <style>
            paper-icon-button {
                margin-top       : 10px;
                float            : right;
            }
            paper-icon-button.search {
                width            : 48px;
                height           : 48px;
                padding          : 0;
                float            : right;
            }
            paper-button {
                background-color : #204080;
                color            : white;
            }		
            triblock-popup {
                padding : 0; 
                height  : calc(100% - 50px); 
                width   : calc(100% - 50px);
            }
            .header {
                background-color : #0696D7;
                font-family      : arial; 
                  color            : black;
                  width            : 100%;
                  height           : 64px;
                  display          : inline-flex;
            }
            .icons {
                height           : 48px;
                width            : 48px;
                padding          : 8;
            }
            .card-body {
                display          : inline-block;
                width            : 400px;
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
                display          : inline-flex;
            }
            .list {
                height   : calc(100% - 72px); 
                overflow : auto;
            }
            img.logo {
                   width         : 240px;
                   height        : 48px;
                   float         : left;
            }
        </style>

        <triblock-popup id="popup" manual-close="true" title="[[__dictionary__title]]">
            <div class="header">
                <img src="[[importPath]]images/AutodeskForgeLogo.png" class="logo">
                <span style="text-align: center; width:100%;"><h1>Manage Forge Views</h1></span>
                <paper-input floatinglabel="" label="Building Name" value="{{filter}}" on-keypress="_onSearchKey"></paper-input>
                <paper-icon-button id="search" icon="search" on-click="getList" class="icons"></paper-icon-button>
            </div>
            <div id="container" on-scroll="_scroll" class="list">
                <div>
                    <template id="repeat" is="dom-repeat" items="[[viewlist]]">
                        <div class="card-body">
                            <div class="card-title">
                                <h3>[[item.description]]</h3>
                            </div>
                            <table style="width:100%;">
                                <tbody><tr>
                                    <td rowspan="4">
                                        <forge-thumbnail url="[[item.thumbnail]]" on-select="_onDisplayModel" style="margin-right:10px;">
                                        </forge-thumbnail>
                                    </td>
                                    <td>
                                        User:
                                    </td>
                                    <td>
                                        [[item.user]]
                                    </td>
                                    <td>
                                        <paper-icon-button id="drawerToggle" icon="chevron-right" on-click="_displayDetails" alt="[[__dictionary__details]]" class="icons" style="float:right; ">
                                       </paper-icon-button> 
                                    </td>
                                </tr>
                                    <tr><td colspan="3">
                                          <paper-checkbox checked="{{item.shared}}" disabled="disabled">Public ?</paper-checkbox>
                                    </td>
                                </tr><tr>
                                </tr>
                                <tr>
                                    <td colspan="3" style="height:100%; width:100%;">
                                          <paper-icon-button icon="delete-forever" on-click="_onDelete" alt="Delete View" class="icons" style="float:right;"></paper-icon-button>
                                    </td>
                                </tr>
                            </tbody></table>
                        </div>
                    </template>
                </div>
            </div>
        </triblock-popup>

        <paper-dialog id="viewDetailsDlg">
            <h2>View Details</h2>
            <paper-dialog-scrollable>
                <paper-textarea id="viewDetailsDlgDetails" floatinglabel="" label="Details" rows="4"></paper-textarea>
                  <paper-checkbox id="viewDetailsDlgShared">Public ?</paper-checkbox>
            </paper-dialog-scrollable>
            <div class="buttons">
                <paper-button dialog-confirm="" on-click="_onUpdateView" raised="">OK</paper-button>
                <paper-button dialog-dismiss="" autofocus="" raised="">Cancel</paper-button>
            </div>
        </paper-dialog>

        <forge-bubble-storage id="bubbles" restpath="[[restpath]]" on-bubble-detail="_onBubbleDetail">
        </forge-bubble-storage>
`;
 }

 static get is() { return 'forge-tri-views' }

 static get properties() {
     return {
         contextroot : {
             type     : String,
         },
         pagesize : {
             type     : Number,
             value    : 10,
         },
         restpath : {
             type     : String,
         },
         viewlist : {
             type     : Array,
            },
     }
 }

 constructor()
 {
     super();
     this.filter     = "";
  }

 openPopup() 
 {
// 				var s = this.$.container;
// 				s.onscroll = ( evt ) => { this._scroll( evt ); };
    if( !this.pagesize ) this.pagesize = 50;
     this.getList();
    this.$.popup.openPopup();
}

 //============================================================================
 // View List
 //============================================================================

 getList() 
 {
     this.set( "viewlist", [] );
     this.query     = {};
     this.start     = null;

     if( this.filter && this.filter.length > 0 )
     {
         this.query = {
             "page":	{"from":0,"size":50},
               "filters":[
                 {
                     name     : "description",
                      operator : "contains",
                      value    : this.filter,
                  },
             ],
         }
     }
     this.query.sorts = [
         {
             name : "urn",
             desc : false
         }
     ]

     this._getList( 0 );
   }

 _getList(
    start
) {
   if( this.pagesize > 0 )
   {
       this.query.page = {
           "from": start,
           "size": this.pagesize
       }
   }

   fetch( this.contextroot + _viewPath, 
          { 
               method: "POST",
               headers: {
                   'content-type': 'application/json',
                   'Accept': 'application/json',
               },
                  credentials: 'same-origin', 
                  body : JSON.stringify( this.query )
          } 
       ).then(
           ( request ) => { this._onList( request ); },
           ( err ) => { this._onError( err ); } );
}

 _onList(
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
                                                                             source : __dictionary__viewlist  }} ));
         this.set( "viewlist", [] );
         return;
     }
     response.json().then(
         ( json ) => {  
             var models = {};

             var vl = this.viewlist;
             this.fetchCount = 0;
             var data = json.data;
             for( var i = 0; data && i < data.length; i++ )
             {
                 data[i].thumbnail      = "";
                 data[i].hasThumbnail   = false;

                 if( !data[i].urn )	// Bad data should never happen
                 {
                     this.fetchCount++;
                     continue;   
                 }
                 var objectId = data[i].urn.substring( 4 );
                 objectId = window.atob( objectId );

                 vl.push( json.data[this.fetchCount++] );

                 models[ data[i].urn ] = objectId;
             }
             this.set( "viewlist", vl );
             this.$.repeat.render();

             for( var urn in models )
             {
                 this.$.bubbles.details( models[ urn ], urn );
             }
         },
         ( err ) => { this._onError( err ); }
     );
 }

 _onSearchKey(
     event
 ) {
     if( event.keyCode == 13 ) 
     {
         this.getList();
     }
 }

 getNextPage()
 {
     if( !this.viewlist ) return;
     if( this.fetchCount < this.pagesize ) return;	// We've gotten everything
     this.fetchCount = 0;							// Prevent anther call until this call has completed
     console.log( "Scroll - Next Page" );
     this._getList( this.viewlist.length );
 }

 //============================================================================
 // Update View
 //============================================================================

 _updateView(
     view
 ) {
     var body = {
             data :{}
         };
     body.data = view;
     
     var url = this.contextroot + _updateViewPath;

     fetch( url, 
            { 
                 method: "PUT",
                 headers: {
                     'content-type': 'application/json',
                     'Accept': 'application/json',
                 },
                    credentials: 'same-origin', 
                    body : JSON.stringify( body )
            } 
         ).then(
             ( response ) => {
                 if( response.status == 404 )
                 {
                     return;		// Just ignore. Nothing can be done to fix this
                 }
                 if( !response.ok )
                 {
                     this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                               detail: { response : response, 
                                                                                         source : __dictionary__viewDelete  }} ));
                     return;
                 }
                 response.json().then(
                     ( json ) => {  
                         for( var i in this.viewlist )
                         {
                             if( view._id == this.viewlist[i]._id )
                             {
                                 this.set( "viewlist." + i + ".detail", view.detail );
                                 this.set( "viewlist." + i + ".shared", view.shared );
                                 break;
                             }
                         }
                     },
                     ( err ) => { this._onError( err ); }
                 );
             },
             ( err ) => { this._onError( err ); } );
 }

 //============================================================================
 // Scroll and fetch
 //============================================================================
 _scroll(
   evt 
) {
    var client = evt.srcElement;
    var top = client.scrollTop;
    if( top < this.top )
    {
        this.top = top;
        return;
    }

    this.top = top;
    if(    client.scrollHeight > client.clientHeight		// Is data larger than window?
            && top + client.clientHeight >= client.scrollHeight -50 )
    {
        this.getNextPage();
        console.log( "scroll" );
// 					this.dispatchEvent( new CustomEvent( 'forge-model-next-page', { bubbles: true, composed: true } ));
    }
}

 //============================================================================
 // Delete View
 //============================================================================

 _onDelete(
     event
 ) {
     var view = event.model.item;
     var contentID = view.viewerState.contentID;
     for( var i in this.viewlist )
     {
         if( view.urn === this.viewlist[i].urn )
         {
             this.splice( "viewlist", i, 1 );
             break;
         }
     }

     this._deleteViewerState( contentID );
     this._deleteView( view._id );
 }

 _deleteView(
     id
 ) {
     var body = {
             data :{
                 "_id" : id,
             }
         };

     var url = this.contextroot + _deleteViewPath;

     fetch( url, 
            { 
                 method: "PUT",
                 headers: {
                     'content-type': 'application/json',
                     'Accept': 'application/json',
                 },
                    credentials: 'same-origin', 
                    body : JSON.stringify( body )
            } 
         ).then(
             ( response ) => {
                 if( response.status == 404 )
                 {
                     return;		// Just ignore. Nothing can be done to fix this
                 }
                 if( !response.ok )
                 {
                     this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                               detail: { response : response, 
                                                                                         source : __dictionary__viewDelete  }} ));
                     return;
                 }
             },
             ( err ) => { this._onError( err ); } );
 }

 //============================================================================
 // Get Viewer State
 //============================================================================

 _getViewerState(
     contentID, urn
 ) {
     var url = this.contextroot + _getDataPath + "/" + contentID;

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
             ( response ) => {
                 if( response.status == 404 )
                 {
                     return;		// Just ignore. Nothing can be done to fix this
                 }
                 if( !response.ok )
                 {
                     this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                               detail: { response : response, 
                                                                                         source : __dictionary__viewGetState  }} ));
                     return;
                 }
                 response.text().then(
                     ( data ) => { 
                         this.dispatchEvent( new CustomEvent('display-model', { bubbles: true, composed: true, 
                                                                                detail: { urn : urn, state : data  } } ));
                     },
                     ( err ) => { this._onError( err ); }
                 );
             },
             ( err ) => { this._onError( err ); } );
 }

 //============================================================================
 // Delete Viewer State
 //============================================================================

 _deleteViewerState(
     contentID
 ) {
     var url = this.contextroot + _deleteDataPath + "/" + contentID;

     fetch( url, 
            { 
                 method: "DELETE",
                 headers: {
                     'content-type': 'application/json',
                     'Accept': 'application/json',
                 },
                    credentials: 'same-origin', 
            } 
         ).then(
             ( response ) => {
                 if( response.status == 404 )
                 {
                     return;		// Just ignore. Nothing can be done to fix this
                 }
                 if( !response.ok )
                 {
                     this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                               detail: { response : response, 
                                                                                         source : __dictionary__viewDeleteState  }} ));
                     return;
                 }
             },
             ( err ) => { this._onError( err ); } );
 }

 //============================================================================
 // Bubble Details
 //============================================================================

 _onBubbleDetail(
     event
 ) {
     var bubble = event.detail.bubble;
     var urn = event.detail.data;
     for( var i = 0; i < this.viewlist.length; i++ )
     {
         // May be many views for this URN
         if( urn == this.viewlist[i].urn )
         {
             var thumbnail = this.$.bubbles.getThumbnail( bubble );
             this.set( "viewlist." + i + ".thumbnail", thumbnail );
             this.set( "viewlist." + i + ".hasThumbnail", thumbnail != null );
         }
     }
 }

 //============================================================================
 // Utilities
 //============================================================================

 _displayDetails(
     event
 ) {
   var item = event.model.item;
   this.$.viewDetailsDlgDetails.item   = item;
   this.$.viewDetailsDlgDetails.value  = item.detail;
   this.$.viewDetailsDlgShared.checked = item.shared;
     this.$.viewDetailsDlg.open();
 }

 _onUpdateView(
     event
) {
   var item   = this.$.viewDetailsDlgDetails.item;
   var detail = this.$.viewDetailsDlgDetails.value;
   var shared = this.$.viewDetailsDlgShared.checked;
   var view = {
       _id    : item._id,
       detail : detail,
       shared : shared
   };
   this._updateView( view );
 }

 _onDisplayModel(
     event
 ) {
     var item = event.model.item;
     this._getViewerState( item.viewerState.contentID, item.urn )
 }

 _onError( err )
 {
     console.error( err );
 }

 static get importMeta() {
    return getModuleUrl("tri-forge-service/forge-tri-views.js");
 }
}

customElements.define( ForgeTriViews.is, ForgeTriViews );
