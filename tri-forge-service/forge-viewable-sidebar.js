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

import '../@polymer/paper-icon-button/paper-icon-button.js';
import '../@polymer/paper-item/paper-item.js';
import '../@polymer/paper-listbox/paper-listbox.js';
class ForgeViewableSidebar extends PolymerElement 
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
            .item {
                width            : 100%;
                cursor           : pointer;
                padding          : 0;
            }
            .icons {
                height           : 48px;
                width            : 48px;
                padding          : 8;
            }
            div.displayItem {
                display          : inline;
                width            : 100%;
            }
        </style>

        <div style="display:inline-flex">
            <paper-input floatinglabel="" label="Object Key" value="{{nameSearch}}" on-keypress="_onSearchKey"></paper-input>
            <paper-icon-button id="search" icon="search" class="icons" on-click="_filterModelList"></paper-icon-button>
        </div>
        <paper-listbox id="list" style="background-color: #B0BEC5; width:100%">
            <template id="repeat" is="dom-repeat" items="[[list]]" filter="show">
                <paper-item value="{{item.bubble.urn}}" on-click="onSelect" class="item">
                    {{item.objectKey}}
                </paper-item>
            </template>
        </paper-listbox>
`;
 }

 static get is() { return 'forge-viewable-sidebar' }

 static get properties() {
     return {
         list : {
             type     : Array,
             readonly : true,
             notify   : true
         },
         selected : {
             type     : Number,
             readonly : true,
             notify   : true
         },
         urn : {
             type     : String,
             observer : 'urnChanged',
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
   window.addEventListener("model-list",    ( event ) => { this.onList( event ) } ); 
   window.addEventListener("model-add",     ( event ) => { this.onAdd( event ) } ); 
   window.addEventListener("model-delete",  ( event ) => { this.onDelete( event ) } ); 
   window.addEventListener("bubble-detail", ( event ) => { this.onDetail( event ) } ); 
   window.addEventListener("bubble-delete", ( event ) => { this.onDetail( event ) } ); 
}

 _filterModelList(
     event
 ) {
     this.$.repeat.render();
     this.syncSelection();
 }

 _onSearchKey(
     event
 ) {
     if( event.keyCode == 13 ) 
     {
         this._filterModelList();
     }
 }

 clearSelection()
 {
     this.value           = null;
     this.urn             = null;
     this.selected        = -1;
     this.$.list.selected = -1;
     this.dispatchEvent( new CustomEvent('select', { bubbles: false, composed: true, detail: this.value } ));
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

 // The display is filtered so the index of the visual emelement is not the same as
 // the index of the selected element in the underlying list.  When the enderlying list
 // is changed, the index of the visual element needs to be updated 
 async syncSelection() 
 {
     if( !this.list || this.list.length == 0 )
     {
         this.clearSelection();
         return;
     } 
     
   var sel = -1;
   var idx = 0;
   if( !this.value )  // Find the first translated item
   {
       while( idx < this.list.length )
       {
           if( this.show( this.list[idx] ))
           {
               sel++;
               break;
           }
           idx++
       }
   }
   else
   {
       while( idx < this.list.length )
       {
           if( this.show( this.list[idx] ))
           {
               sel++;
           }
           if( this.value.objectKey == this.list[idx].objectKey ) break;
           idx++
       }
   }
   
   // See if the selected item was deleted
   if( idx == this.list.length )
   {
       if( sel == -1 )	// No traslated files
       {
           idx = -1;
       }
       else			// Selected item was not found so reset to top of list
       {
           this.value = null;
           this.syncSelection();
           return;
       }
   } 
   
   var newValue = null;
   if( idx >= 0 )
   {
       newValue = this.list[ idx ];
   }
   this.$.list.selected = sel;
     this.selected = idx;
   if( this.value != newValue )
   {
       this.value = newValue;
       this.dispatchEvent( new CustomEvent('select', { bubbles: false, composed: true, detail: this.value } ));
   }
 }

 onList(
     event
 ) {
     this.set( "list", event.detail );
     this.$.repeat.render();				// Force the filter to be updated if the base list hasn't changed
     this.clearSelection();
 }

 onAdd(
     event
 ) {
     this.$.repeat.render();
     this.syncSelection();
 }

 onDelete(
     event
 ) {
     this.$.repeat.render();
     this.syncSelection();
 }

 onDetail(
     event
 ) {
     this.$.repeat.render();
     if( this.value = null )	this.syncSelection();
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
   this.dispatchEvent( new CustomEvent('select', { bubbles: false, composed: true, detail: this.value } ));
 }

 //============================================================================
 // Observers
 //============================================================================
 urnChanged(
       newValue, oldValue
   ) {
       for( var i in this.list )
       { 
           if( this.list[i].bubble && this.list[i].bubble.urn == newValue )
           {
               this.value = this.list[i];
               this.syncSelection();
               break;
           }
       }
 }
}

customElements.define( ForgeViewableSidebar.is, ForgeViewableSidebar );
