/**
 * div-lines
 * Small and simple utility library to draw lines just using javascript and HTML Document Object Model. No JQuery needed.
 * @version v1.3.0 - 2019-04-16
 * @link https://github.com/ajsoriar/div-lines
 * @author Andres J. Soria R. <ajsoriar@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
 
(function() {

    "use strict";

    window.dljs = {
      "el": null,
      "boards":[],
      "pointer":{
        x:0,
        y:0
      }
    };

  dljs.init = function ( el ) {

    console.log("dljs.init()");

    if (!el){

      this.createBoard();

    } else {

      this.el = document.getElementById( el );
    }

    return this;
  };

  dljs.line = function (x1,y1,x2,y2,thickness,color) {
    if (!this.el) this.init();
    if (color === "RANDOM") color = this.utils.getRandomColor();
    if (color === null) color = "#000";
    if (thickness === null) thickness = 2;
    var new_content = dljs.getLineString(null,x1,y1,x2,y2, thickness, color, 1, false, 0, null);
    this.draw( new_content );
    this.goTo(x2,y2);
    return this.el.lastElementChild;
  };

  dljs.linex = function (idString,x1,y1,x2,y2,weight,color,opacity, roundBorder, longSombra, colSombra){ 
    if (!this.el) this.init();
    if (color === "RANDOM") color = this.utils.getRandomColor();
    if (color === null) color = "#000";
    var new_content = dljs.getLineString(idString,x1,y1,x2,y2,weight,color,opacity, roundBorder, longSombra, colSombra);
    this.draw( new_content );
    this.goTo(x2,y2);
    return this.el.lastElementChild;
  };

  dljs.rndLine = function(){
    var u = this.utils;
    this.line( u.rndX(), u.rndY(), u.rndX(), u.rndY(), 1,  u.rndColor() );
    return this.el.lastElementChild;
  };

  dljs.draw = function(html){ 
    this.el.innerHTML = this.el.innerHTML + html; 
  };

  dljs.goTo = function(x,y){
    this.pointer.x = x;
    this.pointer.y = y;
  };

  dljs.lineTo = function(x2,y2,thickness,color) {
    var x1 = this.pointer.x;
    var y1 = this.pointer.y;
    this.line(x1,y1,x2,y2,thickness,color);
  };

  dljs.rmLine = function(lineID){ 

  };

  dljs.updateLine = function(id, propsArr ){

  };

  dljs.trace = function(arr){

  };

    dljs.createBoard = function( boardID, targetEl, objOptions ) { 

        var brd = null; 
        if ( boardID === undefined || boardID === null ) boardID = "dljs-"+ Date.now();

        if ( objOptions != null ) {

        } else {

            brd = document.createElement('ul');
            brd.setAttribute("id", boardID );
            brd.setAttribute("style", "position: absolute; top: 0; left: 0; width: 0; height: 0; background-color: transparent; display: inline-block; margin: 0; padding: 0; list-style: none;");
        }
        dljs.boards.push( brd );
        if ( targetEl != null ){
            
            var el = document.getElementById( targetEl );
            el .appendChild( brd );

        } else {

            document.body.appendChild( brd );
        }
        this.el = brd;

        return brd;
    };

    dljs.getBoards = function() {
        return dljs.boards;
    };

    dljs.setBoard = function( boardID ) {
        if ( boardID === undefined || boardID === null ) {
            this.el = dljs.boards[0];
            return this.el;
        } else {

            if( isNaN( boardID ) ){

                for (var i=0; i < dljs.boards.length; i++ ) {
                    if ( boardID === dljs.boards[i].id ) {
                        this.el = dljs.boards[i];
                    } 
                }
                return this.el;

            } else {

                if ( boardID > dljs.boards.length -1 ) return false;
                this.el = dljs.boards[ boardID ];
                return this.el;
            }
        }
    };

    dljs.rmBoard = function( boardID ) {

        var selectedID = null;
        var index = null;

        if( isNaN( boardID ) ){
            for (var i=0; i < dljs.boards.length; i++ ) {
              
                if ( boardID === dljs.boards[i].id ) {
                    selectedID = dljs.boards[i].id;
                    index = i;
                } 
            }

        } else {

            if ( boardID > dljs.boards.length -1 ) return false;
            selectedID = dljs.boards[ boardID ].id;
            index = boardID;
        }

        if ( selectedID != null ) {

            var node = document.getElementById( selectedID );
            if (node.parentNode) {
                node.parentNode.removeChild(node);
                dljs.boards.splice( index, 1 );
                if ( dljs.boards.length != 0 ){
                    dljs.el = dljs.boards[0];
                } else {
                    dljs.el = null;
                }
            }
        }
        
    };

  dljs.utils = {};

  dljs.utils.getDistance = function(x1,y1,x2,y2){
    return Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) );
  };

  dljs.utils.getSlope = function(x1,y1,x2,y2){
    return (y2-y1)/(x2-x1);
  };

  dljs.utils.getRandomNum = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  dljs.utils.rndColor = function() {
      var r = this.getRandomNum(0, 255);
      var g = this.getRandomNum(0, 255);
      var b = this.getRandomNum(0, 255);
      var a = 1;
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

  dljs.utils.rndX = function() {
      return this.getRandomNum(1, window.innerWidth );
  };

  dljs.utils.rndY = function() {
      return this.getRandomNum(1, window.innerHeight );
  };

  dljs.CONST_180_BY_PI = 180 / Math.PI;
  dljs.getLineString = function (idString,x1,y1,x2,y2,weight,color,opacity, roundBorder, longSombra, colSombra){

      if (x2 < x1){ var aux = x1; x1 = x2; x2 = aux; aux = y1; y1 = y2; y2 = aux; }

      if ( idString === null ) idString = "line-"+ Date.now();
      var cathetus1 = x2-x1,
          cathetus2 = y2-y1,
          hypotenuse = Math.sqrt(cathetus1*cathetus1+cathetus2*cathetus2),
          w=hypotenuse + weight,
          angRadians = Math.asin(cathetus2/hypotenuse),
          ang = (angRadians * 180 / Math.PI );
      var string = ''+
      '<li id="'+ idString +'" class="line" '+
        'style="'+
          'top:'+y1+'px;'+
          'left:'+x1+'px; '+
          'width:'+w+'px; '+
          'height:'+weight+'px; '+
          'transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); '+
          '-webkit-transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); '+
          '-o-transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px); '+
          'background-color: '+color+'; '+
          'opacity:'+opacity+'; '+
          'border-radius: '+weight+'px; '+
          'box-shadow: 0 0 '+ longSombra +'px '+ colSombra +'; '+
          'transform-origin: 0 0; '+
          '-webkit-transform-origin: 0 0; '+
          '-o-transform-origin: 0 0; '+
          'position: absolute;">'+
      '</li>';

      return string;
  };

  dljs.getFastLineString = function (x1,y1,x2,y2,weight,color){

      if (x2 < x1){ var aux = x1; x1 = x2; x2 = aux; aux = y1; y1 = y2; y2 = aux; }

      var cathetus1 = x2-x1,
          cathetus2 = y2-y1,
          hypotenuse = Math.sqrt(cathetus1*cathetus1+cathetus2*cathetus2),
          w = hypotenuse + weight,
          angRadians = Math.asin(cathetus2/hypotenuse),
          ang = (angRadians * dljs.CONST_180_BY_PI );
      var string = '<li class="line" '+
        'style="'+
          'top:'+y1+'px;'+
          'left:'+x1+'px;'+
          'width:'+w+'px;'+
          'height:'+weight+'px;'+
          'transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px);'+
          '-webkit-transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px);'+
          '-o-transform: rotateZ('+ang+'deg) translateX(-'+weight/2+'px) translateY(-'+weight/2+'px);'+
          'background-color: '+color+';">'+
      '</li>';

      return string;
  };

})();
