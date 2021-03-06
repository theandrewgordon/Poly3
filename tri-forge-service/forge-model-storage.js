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

var __dictionary__ModelList   = "Model List";
var __dictionary__ModelDetail = "Model Detail";
var __dictionary__ModelUpload = "Model Upload";
var __dictionary__ModelDelete = "Model Delete";

class ForgeModelStorage extends PolymerElement 
{
  static get template() {
    return html`

`;
  }

  static get is() { return 'forge-model-storage' }

  static get properties() {
      return {
          appkey : {
              type     : String,
              observer : 'appKeyChanged'
          },
          bucketkey : {
              type     : String,
              observer : 'bucketKeyChanged'
          },
          modellist : {
              type     : Array,
              reflectToAttribute : true,
                 notify: true
             },
          restpath : {
              type     : String,
          }
      }
  }

  constructor()
  {
      super();
      
      this.modellist = [];
  }

  ready() 
  {
     super.ready();

    this.set( "modellist", [] );
    window.addEventListener( "forge-model-next-page", ( evt ) => { this.getNextPage(); } );
  }

  //============================================================================
  // Model List
  //============================================================================
  getList(
      filter, pagesize
  ) {
      this.modellist = [];
      this.filter    = filter;
      this.start     = null;
      this.pagesize  = pagesize;
      
      if( !this.bucketkey )
      {
          this.dispatchEvent( new CustomEvent('forge-message', { bubbles: true, composed: true, 
                                                                 detail: { key :"SELECT_BUCKET" }} ));
          this.dispatchEvent( new CustomEvent('model-list', { bubbles: true, composed: true, detail: null } ));
          return;
      }

      this._getList();
    }

  _getList()
  {

    var seprator = "?";
    var url = this.restpath + "/model/" +  this.bucketkey;
    if( this.pagesize )	
    {
        url += seprator + "pagesize=" + this.pagesize;
        seprator = "&";
    }
    if( this.start )    
    {
        url +=  seprator + "start=" + this.start;
        seprator = "&";
    }

    if( this.filter && this.filter.length > 0 )
    {
        url = url + seprator + "name=" +  this.filter;
    }
    
    fetch( url, 
           { 
                headers: {
                    'Accept': 'application/json',
                },
                   credentials: 'same-origin' 
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
                                                                              source : __dictionary__ModelList  }} ));
          this.dispatchEvent( new CustomEvent('model-list', { bubbles: true, composed: true, detail: null } ));
          return;
      }
      response.json().then(
          ( json ) => {  
              var ml = this.modellist;
              for( var i in json.items )
              {
                  ml.push( json.items[i] );
              }
              this.set( "modellist", ml );

              this.dispatchEvent( new CustomEvent('model-list', { bubbles: true, composed: true, detail: ml } ));
              var next;
              if( json.next )
              {
                  next = json.next;
                  var idx = next.indexOf( "startAt=" );
                  if( idx >= 0 )
                  {
                      next = next.substring( idx + 8 );
                      idx = next.indexOf( "&" );
                      if( idx != 0 )
                      {
                          next = next.substring( 0, idx );
                      }
                  } 
              }
              this.start = next;
              ml = this.modellist;
          },
          ( err ) => { this._onError( err ); }
      );
  }

  getNextPage()
  {
      if( !this.start || this.start == "" ) return;
      
      this._getList();
      
      // Prevent more data from being fetched until this fetch finishes.
      this.start = null;
  }

  //============================================================================
  // Model Detail
  //============================================================================
  details(
    objectKey, data
) {
    var url = this.restpath + "/model/" + this.bucketkey
    url += "/object?objectKey="  + objectKey;
    fetch( url,
           { 
                headers: {
                    'Accept': 'application/json',
                },
                   credentials: 'same-origin' 
           } 
        ).then(
    ( response ) => { this._onDetail( response, objectKey, data ); },
    ( err ) => { this._onError( err ); } );
}

  _onDetail(
      response, objectKey, data 
  ) {
      if( response.redirected )
      {
          location.href = response.url;
      }
      if( response.status == 404 )		// Detail not always available
      {
          return;
      }
      if( !response.ok )
      {
          this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                    detail: { response : response, 
                                                                              source : __dictionary__ModelDetail, 
                                                                              object : objectKey }} ));
          return;
      }
      response.json().then(
          ( json ) => { 
              this.dispatchEvent( new CustomEvent( 'model-detail', { bubbles: true, composed: true, 
                                                   detail: { model : json, data : data } } ));
          },
          ( err ) => { this._onError( err ); }
      );
  }

  //============================================================================
  // Model Add
  //============================================================================
  upload(
      objectKey, 
      modelFile,
      onProgress, 
      data
  ) {
      var url = this.restpath + "/model/" + this.bucketkey + "/object?objectKey=" + objectKey;
        var xmlReq = new window.XMLHttpRequest();

      //Upload progress
      xmlReq.upload.addEventListener( "progress", function(evt)
      {
          if( evt.lengthComputable && onProgress ) 
          {
              onProgress( objectKey, evt.loaded, evt.total )
          }
      }, false);

      var _self = this;
      xmlReq.onreadystatechange = function() { _self._onAdd( this, objectKey, data ) };

      // This could be updating an existing model file not adding a new one
      var match = false;
      for( var i in this.modellist )
      {
          if( this.modellist.objectKey == objectKey )
          {
              match = true;
              break;
          } 
      }
      
      var model = { 
          bucketkey : this.bucketkey,
          objectKey : objectKey 
      };
      if( !match )
      {
          if( this.modellist.length > 0 )
          {
              this.unshift( "modellist", model );
              this.dispatchEvent( new CustomEvent('model-add', { bubbles: true, composed: true, 
                                                                 detail : { model : model }} ));
          }
          else
          {
              this.dispatchEvent( new CustomEvent('model-list', { bubbles: true, composed: true, detail: [ model ] } ));
          }
      } 

      xmlReq.open( "PUT", url, true );

      xmlReq.send( modelFile );
  }

  _onAdd( response, objectKey, data )
  {
      if( response.readyState != 4 )  
      { 
          return; 
      }

      if( response.redirected )
      {
          location.href = response.url;
      }
      if( response.status > 299 )
      {
          this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true, 
                                                                    detail: { response : response, 
                                                                              source : __dictionary__ModelUpload, 
                                                                              object : objectKey }} ));
          return;
      }

      var json = JSON.parse( response.responseText );
      
      this.dispatchEvent( new CustomEvent('model-detail', { bubbles: true, composed: true, 
                                                            detail : { model : json, data : data }} ));
  }

  //============================================================================
  // Model Delete
  //============================================================================
  delete(
    objectKey, data
) {
    var url = this.restpath + "/model/" + this.bucketkey;
    url += "/object?objectKey="  + objectKey;

    fetch( 
        url,
        { 
            method: "DELETE", 
               credentials: 'same-origin' 
        }	
    ).then(
        ( response ) => { this._onDelete( response, objectKey, data ); },
        ( err ) => {  this._onError( err ); } );
}

  _onDelete(
      response, objectKey, data
  ) {
    if( response.redirected )
    {
        location.href = response.url;
    }
    if( !response.ok )
    {
        this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true, 
                                                                  detail: { response : response, 
                                                                            source : __dictionary__ModelDelete, 
                                                                            object : objectKey }} ));
        if( response.status != 404 )		// Detail not always available
        {
            return;
        }
    }
    for( var i in this.modellist )
    {
        if( objectKey === this.modellist[i].objectKey )
        {
            this.splice( "modellist", i, 1 );
            break;
        }
    }
    this.dispatchEvent( new CustomEvent('model-delete', { bubbles: true, composed: true, 
                                                          detail: { objectKey : objectKey, 
                                                                    data      : data }} ));
  }

  //============================================================================
  // Utilities
  //============================================================================

  _onError( err )
  {
      console.error( err );
  }

  //============================================================================
  // Observers
  //============================================================================
  appKeyChanged(
        newValue, oldValue
    ) {
      this.appKey  = newValue;
      this.modellist = [];
  }

  bucketKeyChanged(
        newValue, oldValue
    ) {
      this.bucketkey = newValue;
      this.modellist = [];
      this.dispatchEvent( new CustomEvent('model-list', { bubbles: true, composed: true, detail: null } ));
  }
}

customElements.define(ForgeModelStorage.is, ForgeModelStorage );
