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
import '../@polymer/polymer/polymer-element.js';

import { IronResizableBehavior } from '../@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../@polymer/polymer/polymer-element.js';
Polymer(
{
  _template: html`
        <style>
            div.scrollpane {
                overflow         : var(--forge-scroll-pane-overflow);
                display          : block;
            }
        </style>

        <div id="scrollPane" class="scrollpane" on-scroll="_scroll">
            <slot></slot>
        </div>
`,

  is: 'forge-scroll-pane',

  behaviors : [ 
        IronResizableBehavior 
    ],

  listeners : { 
     'iron-resize': '_onIronResize' 
  },

  attached: function() 
  {
      this.resize();
  },

  ready : function()
  {
      this.top = 0;
  },

  // This is a hack because the custom style isn't working on Edge	    
  setOverflow : function(
      overflow
  ) {
      this.$.scrollPane.style.overflowY = overflow;
  },

  resize : function( evt )
  {
      var h = document.body.clientHeight;
      var w = document.body.clientWidth;
      var offsetTop = 0;
      var offsetLeft = 0;
      var node = this.$.scrollPane;
      while( node != null )
      { 
          if( node.offsetTop ) offsetTop += node.offsetTop;
          if( node.offsetLeft ) offsetLeft += node.offsetLeft;
          node = node.offsetParent;
      }
      h -= offsetTop;
      w -= offsetLeft

      if( h < 0 ) h = 0;
      if( w < 0 ) w = 0;
      
      this.$.scrollPane.style.height = "" + h + "px";
      this.$.scrollPane.style.width  = "" + w + "px";
      this.dispatchEvent( new CustomEvent('set-size', { bubbles: true, composed: true, detail : { height : h, width : w }}));
  },

  _onIronResize : function( event )
  {
      setTimeout( ( event ) => { this.resize( event ) }, 100 );
  },

  _scroll : function( evt )
  {
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
          this.dispatchEvent( new CustomEvent( 'next-page', { bubbles: true, composed: true } ));
      }
  }
})
