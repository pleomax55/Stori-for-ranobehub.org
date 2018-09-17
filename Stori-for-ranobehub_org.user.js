// ==UserScript==
// @name         Stori для сайта Ranobehub.org
// @namespace    https://github.com/pleomax55/Stori-for-ranobehub.org
// @version      0.2.03
// @author       pleomax55
// @match        https://ranobehub.org/ranobe/*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function($) {
  'use strict';
  var cRRC = '.__ranobe_read_container';
  var cPEx = 0, maxP = 0, bmN = 0, nTNPage = 0;
  var currentP = 1, scrollToP = false, pTopOffset = 80;

  var ccss = ''+
      'blockquote:before{display:none;}'+
	  '.go-next-page{}'+
	  '.gnp-el{display:inline-block;width:calc(100% / 4);height:40px;vertical-align:middle;position:relative;}'+
	  '.gnp-el:last-child:before{display:none;}'+
	  '.gnp-el:last-child > div{position:absolute;top:calc(50% - 4px);left:40%;transform:translate(-50%, -50%);width:0;height:0;transition:left .4s;}'+
	  '.gnp-el.activ:last-child > div{left:50%;}'+
	  '.gnp-el > div:before{content:"";position:absolute;top: 5px;display:block;width:20px;height:7px;background:#424242;border-radius:7px;transform:rotate(-45deg);}'+
	  '.gnp-el > div:after {content:"";position:absolute;top:-5px;display:block;width:20px;height:7px;background:#424242;border-radius:7px;transform:rotate(45deg);}'+
	  '.gnp-el.activ:before, .gnp-el.activ *:before, .gnp-el.activ *:after{background-color:#0277BD;}'+
	  '.gnp-el:before{content:"";position:absolute;top:50%;left:calc(50% - 22px);transform:translate(-50%, -50%);width:7px;height:7px;border-radius:7px;background:#424242;transition:all .5s;}'+
	  '.gnp-el.activ:before, .gnp-el.activ:after{width:50px;left:calc(50%);}'+
	  ''+
      '';

  var storiSavedOptDef = {
    scrollToP: false,
	currentP: 1,
    pTopOffset: 80
  };
  var storiSavedOpt = null;
  if(localStorage.getItem("storiSavedOpt") != null){ storiSavedOpt = JSON.parse(localStorage.getItem("storiSavedOpt")); }
  else{ storiSavedOpt = storiSavedOptDef; localStorage.setItem("storiSavedOpt", JSON.stringify(storiSavedOptDef)); }
  // JSON.stringify(storiSavedOpt)  JSON.parse(storiSavedOpt)

  function sOpt(set, val){
	storiSavedOpt[set] = val;
	localStorage.setItem("storiSavedOpt", JSON.stringify(storiSavedOpt));
  }
  function slTP(ofset, time){
	if(time==null){time=222;}
	$('html, body').stop().animate({scrollTop: $(cRRC+' p').eq(currentP-1).offset().top-ofset}, time);
  }

  setInterval(function(){
    if($(cRRC+' p').length&&!$('#CurrentP').length&&cPEx==0){
      cPEx=1;
	  // __ranobe_read_container  // <i class="right chevron icon"></i>
	  $(cRRC).append('<div class="go-next-page"><div class="gnp-el"></div><div class="gnp-el"></div><div class="gnp-el"></div><div class="gnp-el"><div></div></div></div>');
	  $(cRRC+' p').each(function(){ if($(this).html().replace(/\s|&nbsp;/g, '').length === 0) $(this).remove(); });
      $(cRRC+' p').first().attr('id','CurrentP');
      $(cRRC+'>blockquote>p').addClass('rrMessage');
	  maxP = $(cRRC+' p').length;
	  $(cRRC+' p').eq(0).addClass('firstP');
	  $(cRRC+' p').eq(maxP-1).addClass('lastP');
	  bmN = parseFloat($(cRRC+' p').css('margin-bottom'));
	  for(var xy=0;xy<Object.keys(storiSavedOpt).length;xy++){
		if(xy==0){scrollToP = storiSavedOpt.scrollToP;}
		if(xy==1){currentP = storiSavedOpt.currentP;}
		if(xy==2){pTopOffset = storiSavedOpt.pTopOffset;}
		if(xy==3){}
	  }
	  $('head').append('<style>'+ccss+'</style>');
    }
    else if($('#CurrentP').length&&cPEx==1){
      cPEx=2;
	  if(storiSavedOpt.scrollToP == false){ /*$('html, body').stop().animate({scrollTop: $(cRRC+'>h1').offset().top+1}, 222);*/ }
	  if(storiSavedOpt.scrollToP == true && currentP > 1){$(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP');slTP(pTopOffset); }
	}
    else if($('#CurrentP').length&&cPEx>1){
      // loop
    }
  },10);

  $(document).keydown(function(e){
	var key=e.which;
	if(key==37||key==39){ sOpt('currentP', 1);sOpt('scrollToP',false); }
	if(key==38||key==40||key==192||key==13||key==32||key==9){e.preventDefault();}
	if((key==38||key==192) && currentP>1){
	  nTNPage = 0; $('.go-next-page .gnp-el').removeClass('activ');
	  currentP--; sOpt('currentP', currentP);
	  if(currentP == 1){sOpt('scrollToP',false);}else{sOpt('scrollToP',true);}
	  for(var i=1;i<=maxP;i++){ if(i==currentP){ $(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP'); slTP(45+bmN*2); } }
	  // if(currentP == maxP){sOpt('currentP', 1);sOpt('scrollToP',false); slTP(50+bmN*2);}
	}
	if((key==40||key==13||key==32||key==9) && currentP<maxP){
	  currentP++; sOpt('currentP', currentP);
	  if(currentP == 1){sOpt('scrollToP',false);}else{sOpt('scrollToP',true);}
	  for(var j=1;j<=maxP;j++){ if(j==currentP){ $(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP'); slTP(bmN*2); } }
	  // if(currentP == maxP){sOpt('currentP', 1);sOpt('scrollToP',false); slTP(50+bmN*2);}
    }
	if(currentP == maxP){ nTNPage++; $('.go-next-page .gnp-el').eq(nTNPage-1).addClass('activ'); }
	if(currentP == maxP && nTNPage>3){
	  var urlNPage = myTrim($('.__btn_toggle_chapter[data-type="next"]').attr('href'),'#text_container','');
	  setTimeout(function(){
		sOpt('currentP', 1);sOpt('scrollToP',false); slTP(50+bmN*2);
		window.location.href = urlNPage;
	  },350);
	}
  });
  $(document).on("click", ".__btn_toggle_chapter.read_nav__buttons__manage", function(){
	sOpt('currentP', 1);sOpt('scrollToP',false); slTP(50+bmN*2);
	//localStorage.removeItem("storiSavedOpt");
  });
  $(document).on("click", ".__btn_toggle_chapter", function(){
	sOpt('currentP', 1);sOpt('scrollToP',false); slTP(50+bmN*2);
	//localStorage.removeItem("storiSavedOpt");
  });
  function myTrim(x,str,val){return x.replace(str,val);}

})(jQuery);
