var ibu_land = document.getElementById( "ibu-land" );
var audio = document.getElementById( "ibu-audio" );

var type_writer_text = function( el, text, period ) 
{
    this.toRotate = text;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt( period, 10 ) || 2000;
    this.txt = "";
    this.tick( );
    this.isDeleting = false;
};

type_writer_text.prototype.tick = function( )
{
    var i = this.loopNum % this.toRotate.length;
    var full_txt = this.toRotate[ i ];

    if ( this.isDeleting )
        this.txt = full_txt.substring( 0, this.txt.length - 1 );
    else
        this.txt = full_txt.substring( 0, this.txt.length + 1 );

    this.el.innerHTML = "<span class='wrap'>" + this.txt + "</span>";

    var that = this;
    var delta = 200 - Math.random( ) * 100;

    if ( this.isDeleting )
        delta /= 2;

    if ( !this.isDeleting && this.txt === full_txt )
    {
        delta = this.period;
        this.isDeleting = true;
    } 
    else if ( this.isDeleting && this.txt === "" )
    {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout( function( )
    {
        that.tick( );
    }, delta );
};

function ibu_enter( )
{
    var ibu_style = document.createElement( "style" );
    var pill_svg = document.getElementById( "pill-svg" );
    var pill_svg1 = document.getElementById( "pill-svg1" );
    var type_write_elements = document.getElementsByClassName( "type-write" );
    var audio_ctx = new ( window.AudioContext || window.webkitAudioContext )( )
    var audio_src = audio_ctx.createMediaElementSource( audio )
    var audio_analyser = audio_ctx.createAnalyser( );

    ibu_land.style.display = "block";
    ibu_captcha.style.display = "none";

    audio.play( );
    audio_src.connect( audio_analyser )
    audio_src.connect( audio_ctx.destination );
    audio_analyser.fftSize = 2048;

    var buffer_length = audio_analyser.frequencyBinCount;
    var data_array = new Uint8Array( buffer_length );

    audio_analyser.getByteTimeDomainData( data_array );

    function anim_frame( )
    {
        requestAnimationFrame( anim_frame );
        audio_analyser.getByteFrequencyData( data_array );

        var freq = data_array[ 3 ] * 2;

        pill_svg.width = freq;
        pill_svg1.width = freq;

        pill_svg.height = freq;
        pill_svg1.height = freq;
    };
    anim_frame( );

    for ( var i = 0; i < type_write_elements.length; i++ )
    {
        var txt_data = type_write_elements[ i ].getAttribute( "data-type" );
        var data_period = type_write_elements[ i ].getAttribute( "data-period" );

        if ( txt_data )
            new type_writer_text( type_write_elements[ i ], JSON.parse( txt_data ), data_period );
    }
    ibu_style.innerHTML = ".type-write > .wrap { border-right: 0.1em solid #ffffff }";
    document.body.appendChild( ibu_style );
}