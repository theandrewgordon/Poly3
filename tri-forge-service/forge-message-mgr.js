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

var __dictionary__RESTError       = "REST Error";
var __dictionary__AuthError       = "Forge Authentication Error";
var __dictionary__ServiceError    = "Forge Service Error";

var __dictionary__ConfirmDelete    = "Confirm Delete";
var __dictionary__ConfirmDelete_1  = "Deleting a bucket deletes all models and bubble in the bucket";
var __dictionary__ConfirmDelete_2  = 'You must check "Delete Models" and "Delete Bubbles" to acknowledge they will be delteted';

var __dictionary__ModelList        = "Model List";
var __dictionary__ModelList_1      = "Before listing models, you must specify a bucket";
var __dictionary__ModelList_2      = "Before listing models, you must list the buckets on the 'Buckets' tab";

var __dictionary__NoBuildings      = "No Buildings";
var __dictionary__NoBuildings_1    = "There are no buildings that match the search criteria";

var __dictionary__NoModels         = "No Models";
var __dictionary__NoModels_1       = "There are no models in the bucket that match the search criteria";

var __dictionary__MissingBucket    = "Missing Bucket List";
var __dictionary__MissingBucket_1  = "Before uploading models, you must list the buckets on the 'Buckets' tab"

var __dictionary__AccessDenied     = "Access Denied";
var __dictionary__AccessDenied_1   = "The operation requires {scope} access";

var __dictionary__AutheRequired    = "Authenticaion required";
var __dictionary__AutheRequired_1  = "You must login with your Autodesk Forge applcation ID and secret";

var _messages = {
    AUTH_REQUIRED :
    {
        "title"  : __dictionary__AutheRequired,
        messages : [
            __dictionary__AutheRequired_1,
        ]
    },
    BUCKET_LIST_UPLOAD :
    {
        "title"  : __dictionary__MissingBucket,
        messages : [
            __dictionary__MissingBucket_1,
        ]
    },
    CONFIRM_DELETE : 
    {
        "title"  : __dictionary__ConfirmDelete,
        messages : [
            __dictionary__ConfirmDelete_1,
            __dictionary__ConfirmDelete_2
        ]
    },
    LIST_BUCKETS :
    {
        "title"  : __dictionary__ModelList,
        messages : [
            __dictionary__ModelList_2,
        ]
    },
    NO_MODELS :
    {
        "title"  : __dictionary__NoModels,
        messages : [
            __dictionary__NoModels_1,
        ]
    },
    NO_BUILDINGS :
    {
        "title"  : __dictionary__NoBuildings,
        messages : [
            __dictionary__NoBuildings_1,
        ]
    },
    SELECT_BUCKET :
    {
        "title"  : __dictionary__ModelList,
        messages : [
            __dictionary__ModelList_1,
        ]
    },
};

var __dictionary__BucketList             = "Bucket List";
var __dictionary__BucketDetail           = "Bucket Detail";
var __dictionary__BucketCreate           = "Bucket Create";
var __dictionary__BucketDelete           = "Bucket Delete";
var __dictionary__BucketGrant            = "Bucket Grant";
var __dictionary__BucketRevoke           = "Bucket Revoke";
var __dictionary__ModelList              = "Model List";
var __dictionary__ModelDetail            = "Model Detail";
var __dictionary__ModelUpload            = "Model Upload";
var __dictionary__ModelDelete            = "Model Delete";
var __dictionary__BubbleDetail           = "Bubble Detail";
var __dictionary__BubbleTranslate        = "Bubble Translate";
var __dictionary__BubbleDelete           = "Bubble Delete";
var __dictionary__ListBIMConfiguration   = "List BIM Configuration";
var __dictionary__CreateBIMConfiguration = "Create BIM Configuration";
var __dictionary__UpdateBIMConfiguration = "Update BIM Configuration";

const SOURCES = {
    "Bucket List" : 	         __dictionary__BucketList, 
    "Bucket Detail" :	         __dictionary__BucketDetail, 
    "Bucket Create" :	         __dictionary__BucketCreate, 
    "Bucket Delete" :	         __dictionary__BucketDelete, 
    "Bucket Grant" :             __dictionary__BucketGrant, 
    "Bucket Revoke" : 	         __dictionary__BucketRevoke, 
    "Model List" : 		         __dictionary__ModelList, 
    "Model Detail" : 	         __dictionary__ModelDetail, 
    "Model Upload" : 	         __dictionary__ModelUpload, 
    "Model Delete" : 	         __dictionary__ModelDelete, 
    "Bubble Detail" :	         __dictionary__BubbleDetail, 
    "Bubble Translate" :         __dictionary__BubbleTranslate, 
    "Bubble Delete" :          	 __dictionary__BubbleDelete, 
    "List BIM Configuration" :   __dictionary__ListBIMConfiguration,
    "Create BIM Configuration" : __dictionary__CreateBIMConfiguration,
    "Update BIM Configuration" : __dictionary__UpdateBIMConfiguration,
}

class ForgeMessageMgr extends PolymerElement 
{
    static get is() { return 'forge-message-mgr' }
    
    ready()
    {
         super.ready();

        window.addEventListener( "forge-message",    ( evt ) => { this._onMessage( evt ); } );
        window.addEventListener( "forge-http-error", ( evt ) => { this._onHTTPError( evt ); } );
        window.addEventListener( "forge-auth-error", ( evt ) => { this._onAuthError( evt ); } );
    }
    
    displayHttpError(
        message
    ) {
        var value = {
            "title"  : "",
            messages : []
        }
        
        if( message.source )
        {
            value.messages.push( SOURCES[ message.source ] ? SOURCES[ message.source ] :  message.source );
        } 
        if( message.object ) value.messages.push( message.object );
        if( message.response )
        {
            value.label = "HTTP " + message.response.status;
            if( message.response.text )
            {
                message.response.text().then(
                    ( data ) => {
                        try
                        {
                            var json = "";
                            if( data && data != "" )  json = JSON.parse( data );
                            
                            // No session estiblished
                            if( message.response.status == 401 )
                            {
                                this.dispatchEvent( new CustomEvent('forge-401', { bubbles: false, composed: true, details : message  } ));
                                return;
                            }
                            
                            // Test for rights to an Autodesk scope being denied at the proxy layer
                            else if( message.response.status == 403 
                                && json.ErrorCode == - 4 )
                            {
                                value.title = __dictionary__AccessDenied;
                                value.messages.push( __dictionary__AccessDenied_1.replace( "{scope}", json.ErrorMessage ) );
                            }
                            else
                            {
                                value.title = __dictionary__ServiceError;
                                var i = 3;
                            }
                            for( var msg in json )
                            {
                                if( msg == "more info" )
                                {
                                    value.link = json[ msg ];
                                    continue;
                                }
                                if( json[ msg ].startsWith( "<HTML") || json[ msg ].startsWith( "<html") )
                                {
                                    value.body = json[ msg ];
                                    continue;
                                }
                                value.messages.push( json[ msg ] );
                            }
                        }
                        catch( e )
                        {
                            if( value.title == "" ) value.title = __dictionary__RESTError;
                            value.messages.push( message.response.statusText );
                            if(    data.startsWith( "<HTML") 
                                || data.startsWith( "<html") 
                                || data.startsWith( "<H1>") 
                                || data.startsWith( "<!DOCTYPE" ) )
                            {
                                value.body = data;
                            }
                            else
                            {
                                value.messages.push( data );
                            }
                        }
                        this._open( value );
                    },
                    ( err ) => { 
                        if( value.title == "" ) value.title = __dictionary__RESTError;
                        var txt = response.response.statusText;
                        if( txt.startsWith( "<HTML") || txt.startsWith( "<html") || txt.startsWith( "<H1>") )
                        {
                            value.body = txt;
                        }
                        else
                        {
                            value.messages.push( txt );
                        }
                        this._open( value );
                    } ); 
            }
            else if( message.response.responseText )
            {
                value.messages.push( message.response.responseText );
                this._open( value );
            } 
        }
    };
    
    displayAuthError( 
        token 
    ) {
        var value = {
            "title"  : "",
            messages : [
            ]
        };
        
        value.title = __dictionary__AuthError;
        if( token.ErrorCode ) value.messages.push( token.ErrorCode );
        if( token.errorCode ) value.messages.push( token.errorCode );
        if( token.developerMessage ) value.messages.push( token.developerMessage );
        if( token.userMessage ) value.messages.push( token.userMessage );

        if( token.ErrorType ) value.messages.push( token.ErrorType );
        if( token.ErrorMessage ) value.messages.push( token.ErrorMessage );

        if( token[ "more info"] ) value.link = token[ "more info"];

        this._open( value );
    };
    
    displayMessage(
        message
    ) {
        if( message.key )
        {
            if( _messages[ message.key ] )
            {
                message = _messages[ message.key ];
            } 
        }
        this._open( message );
    }
    
    _onAuthError(
        event
    ) {	
        this.displayAuthError( event.detail );
    }
    
    _onHTTPError(
        event
    ) {	
        this.displayHttpError( event.detail );
    }
    
    _onMessage(
        event
    ) {	
        this.displayMessage( event.detail );
    }
    
    _open(
        value
    ) {
        var messageBox = document.createElement( 'forge-message-box' );
        messageBox.value = value;
        this.parentNode.appendChild( messageBox );
        messageBox.open();
    }
}

// Register custom element definition using standard platform API
customElements.define( ForgeMessageMgr.is, ForgeMessageMgr );
