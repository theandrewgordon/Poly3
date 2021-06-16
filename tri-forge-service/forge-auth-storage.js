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
import '../@polymer/neon-animation/animations/scale-up-animation.js';
import '../@polymer/neon-animation/animations/fade-out-animation.js';
import './forge-message-box.js';
var __dictionary__Authenicate = "Authenticate";
var __dictionary__Logout      = "Logout";

class ForgeAuthStorage extends PolymerElement 
{
    static get is() { return 'forge-auth-storage' }
    
    static get properties() {
        return {
            appkey : {
                type     : String,
            },
            restpath : {
                type     : String,
            }
        }
    };

      ready() 
      {
         super.ready();
      }
      
      getKey()
      {
        fetch( this.restpath + "/auth/key",
               { 
                    headers: {
                        'Accept': 'application/json',
                    },
                       credentials: 'same-origin' 
               } 
            ).then(
                ( request  )=> { this._onAppKey( request ); },
                function( err ) { console.error( err ); } );
      }

    _onAppKey(
        response 
    ) {
        if( response.redirected )
        {
            location.href = response.url;
            return;
        }
        if( !response.ok )
        {
            response.json().then(
                 ( json ) => { 
                       this.dispatchEvent( new CustomEvent('authenticate', { bubbles: true, composed: true, detail: json } ));
                },
                ( err ) => { 
                       this.dispatchEvent( new CustomEvent('authenticate', { bubbles: true, composed: true, detail: {} } ));
                }
            );
            return;	
        }
        response.json().then(
            ( json ) => { 
                if( json.authenticated )
                {
                       this.dispatchEvent( new CustomEvent('authenticate', { bubbles: true, composed: true, detail: json } ));
                } 
            },
            function( err ) { console.error( err ); }
        );
    }
    
    getToken(
        key, secret
    ) {
        if( key ) key = key.trim();
        if( this.save )
        {
            this.set( "credentials", { key : this.appkey, secret : this.secret } );
        }
        else
        {
            this.set( "credentials", { key : "", secret : "" } );
        }
        var url = this.restpath + "/token?key=" + key + "&secret=" + secret; 
        fetch( url,
               { 
                    headers: {
                        'Accept': 'application/json',
                    },
                       credentials: 'same-origin' 
               } 
              ).then(
                ( request  )=> { this.onAuthToken( request ); },
                function( err ) { console.error( err ); } );
    }

    onAuthToken(
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
                                                                                source : __dictionary__Authenicate }} ));
            return;	
        }
        response.json().then(
            ( json ) => { this._processToken( json ) },
            function( err ) { console.error( err ); }
        );
    }
    
    _processToken( 
        token
    ) {
        this.authToken = token;
        if( token.ErrorCode || token.errorCode )
        {
            this.dispatchEvent( new CustomEvent('forge-auth-error', { bubbles: true, composed: true,  detail: token }));
            return;
        }
    
        token.key = this.appkey;
        var d = new Date();
        this.authTokenFetchTime = d.getTime();
           this.dispatchEvent( new CustomEvent('authenticate', { bubbles: true, composed: true, detail: token } ));
    }
    
    logout()
    {
        this.appkey = "";
        this.secret = "";
        var url = this.restpath + "/auth/logout"; 
        fetch( url, 					
               { 
                       method: "POST",
                       credentials: 'same-origin' 
               }	
              ).then(
                ( request  )=> { this._onLogout( request ); },
                function( err ) { console.error( err ); } );
    }
    
    _onLogout(
        response 
    ) {
        if( response.redirected )
        {
            location.href = response.url;
        }
        if( !response.ok )
        {
            token.key = "";
            this.dispatchEvent( new CustomEvent('forge-http-error', { bubbles: true, composed: true,
                                                                      detail: { response : response, 
                                                                                source : __dictionary__Logout}} ));
            return;	
        }
        this.appkey = "";
           this.dispatchEvent( new CustomEvent('authenticate', { bubbles: true, composed: true, detail: {} } ));
    }			
}

customElements.define(ForgeAuthStorage.is, ForgeAuthStorage);
