class VoiceEditor {

  constructor( voice ) {

    const tmpl = voice => html`
      <div class="voice-editor-container">
        <ul class="sliders">
        ${voice.params.map(param => html`
          <input type="range" orient="vertical" value="${param.val}" min="${param.min || 0}" max="${param.max || 1}" step="${param.step || 0.01}"  />
          <span>$${param.label}</span>
        `)}
        </ul>
      </div>
    `;

    //http://2ality.com/2015/01/template-strings-html.html

    function html( literalSections, ...substs ) {

      let raw = literalSections.raw;

      let result = "";

      substs.forEach( ( subst, i ) => {

        let lit = raw[ i ];

        if ( Array.isArray( subst ) ) {
        
            subst = subst.join( "" );
        
        }

        if ( lit.endsWith( "$" ) ) {
        
            subst = htmlEscape( subst );
            lit = lit.slice( 0, -1 );
        
        }
        
        result += lit;
        result += subst;

      });

      result += raw[ raw.length-1 ]; // (A)

      return result;

    }

    function htmlEscape(str) {
      
      return str.replace(/&/g, '&amp;') // first!
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/`/g, '&#96;');
    
    }

    this.element = document.createElement( "div" );
    this.element.classList.add("voice-editor");
    this.element.innerHTML = tmpl( voice );

    document.body.appendChild( this.element );

    var sliders = this.element.querySelectorAll( "input" );

    sliders.forEach( ( slider, index ) => {

      slider.addEventListener( "change", function( event ) {
        
        voice.params[ index ].param = event.value;

      })

    } )

  }

}
