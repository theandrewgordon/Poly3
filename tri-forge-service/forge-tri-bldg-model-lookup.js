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

import '../@polymer/paper-dialog/paper-dialog.js';
import '../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../@polymer/paper-item/paper-item.js';
import '../@polymer/paper-listbox/paper-listbox.js';
class ForgeTriBldgModelLookup extends PolymerElement 
{
  static get template() {
   return html`
        <style>
            html, body {
                margin  : 0;
                padding : 0;
                height  : 100%;
                width   : 100%;
            }
            h2 {
                font-family      : arial; 
                margin-top       : 4px;
                margin-bottom    : 4px;
            }
            paper-button {
                background-color : #204080;
                color            : white;
            }		
            paper-icon-button {
                margin-right : 40px;
                margin-top   : 20px;
                float        : right;
            }
            paper-input {
                flex : 1;
            }
            .buttons {
                float            : right;
            }
            .icons {
                height           : 48px;
                width            : 48px;
                padding          : 8px;
            }
            .item {
                cursor           : pointer;
                padding          : 0;
                display          : block;
                background-color : white;
                width            : 100%;
                margin-top       : 5px;
                margin-bottom    : 5px;
            }
            div.lookup {
                margin           : 0;
                margin-left      : 20px;
                padding          : 0;
                display          : inline-flex;
                width            : 100%;
            }
            div.list {
                background-color: #B0BEC5;
                padding         : 0;
                margin          : 0;
                margin-left     : 20px;
                margin-right    : 20px;
            }
            div.search {
                   width         : 64px;
                   height        : 64px;
                padding       : 0;
                float         : right;
            }
        </style>

        <paper-dialog id="lookup">
            <h2>Model Lookup</h2>
            <div class="lookup">
                <paper-input floatinglabel="" label="Object Key" value="{{nameSearch}}" on-keypress="_onSearchKey"></paper-input>
                <div class="search">
                    <paper-icon-button id="search" icon="search" on-click="_filterModelList" class="icons"></paper-icon-button>
                </div>
            </div>
            <paper-dialog-scrollable id="container">
                <div class="list">
                    <template id="repeat" is="dom-repeat" items="[[list]]">
                        <paper-item value="{{item.bubble.urn}}" on-click="onSelect" class="item">
                            {{item.objectKey}}
                            <div style="height:200px; width:200px;">
                                <forge-thumbnail url="[[item.thumbnail]]"></forge-thumbnail>
                            </div>
                        </paper-item>
                    </template>
                </div>
            </paper-dialog-scrollable>
            <div class="buttons">
                <paper-button dialog-confirm="" on-click="_accept" raised="">OK</paper-button>
                <paper-button dialog-dismiss="" autofocus="" raised="">Cancel</paper-button>
            </div>
        </paper-dialog>
`;
 }

 static get is() { return 'forge-tri-bldg-model-lookup' }

 static get properties() {
     return {
         building : {
             type     : Array,
             notify   : true
         },
         list : {
             type     : Array,
             notify   : true
         },
         modelmanager : {
             type     : Object,
         },
         selected : {
             type     : Number,
             readonly : true,
             notify   : true
         },
         value : {
             type     : Object,
             readonly : true,
             notify   : true
         }
     }
 }

 constructor()
 {
     super();
     this.selected = -1;
     this.list = [];
     this.nameSearch = null;
 }

 ready() 
 {
    super.ready();
    var s = this.$.container.$.scrollable;
    s.onscroll = ( evt ) => { this._scroll( evt ); };
   window.addEventListener("model-list",    ( event ) => { this._onList( event ) } ); 
   window.addEventListener("model-add",     ( event ) => { this._onList( event ) } ); 
   window.addEventListener("model-delete",  ( event ) => { this._onList( event ) } ); 
}

 _filterModelList(
     event
 ) {
     var search = this.nameSearch;
     this.modelmanager.getModelList( this.nameSearch );
//				this.$.repeat.render();
 }

 _onList(
     event
 ) {
     this.$.repeat.render();				// Force the filter to be updated if the base list hasn't changed
 }

 _onSearchKey(
     event
 ) {
     if( event.keyCode == 13 ) 
     {
         this.modelmanager.getModelList( this.nameSearch );
//					this.$.repeat.render();
     }
 }

 // Filter for dom-repeat for model list
 show( item )
 {
     if( !item.bubble ) return false;
     if( item.bubble.status != "success" ) return false;
     if( this.nameSearch != null && this.nameSearch != "" )
     {
         if( !item.objectKey.includes( this.nameSearch )) return false;
     }
     return true;
 }

 onSelect(
     event
 ) {
     this.selected = -1;
   this.value = event.model.item;
   for( var i in this.list )
   {
       if( this.list[i].objectKey == this.value.objectKey )
       {
             this.selected = i;
             break;
       }
   }
   this.dispatchEvent( new CustomEvent('accept', { bubbles: false, composed: true, detail: this.value } ));
   this.$.lookup.close();
 }

 open()
 {
     this.$.repeat.render();
     this.$.lookup.open();
 }

 _accept(
     event
 ) {
     this.dispatchEvent( new CustomEvent('accept', { bubbles: false, composed: true, detail: this.value } ));
 }

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
         this.dispatchEvent( new CustomEvent( 'forge-model-next-page', { bubbles: true, composed: true } ));
     }
 }

 //============================================================================
 // Observers
 //============================================================================
 modelsChanged(
       newValue, oldValue
   ) {
       this.set( "list", newValue );
 }
}

customElements.define( ForgeTriBldgModelLookup.is, ForgeTriBldgModelLookup );
