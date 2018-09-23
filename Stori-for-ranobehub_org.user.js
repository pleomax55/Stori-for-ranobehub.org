// ==UserScript==
// @name         Stori для сайта Ranobehub.org
// @namespace    https://github.com/pleomax55/Stori-for-ranobehub.org
// @version      0.2.05
// @author       pleomax55
// @match        https://ranobehub.org/ranobe/*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function($) {
  'use strict';
  var cRRC = '.__ranobe_read_container';
  var cPEx = 0, maxP = 0, bmN = 0, nTNPage = 0;
  var currentP = 1, scrollToP = false, pTopOffset = 80, tSUI = false, tSFSM = false;

  var ccss = ''+
      /*'blockquote:before{display:none;}'+
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
	  '#S_UI-btn, #S_FSM-btn{position:fixed;bottom:0;left:0;width:40px;height:40px;background:rgba(0,0,0,.3);z-index:9999999;cursor:pointer;}'+
	  '#S_FSM-btn{bottom:40px;}'+
	  '#S_UI-btn:before, #S_FSM-btn:before{content:"\\F070";display:block;width:40px;line-height:40px;color:#424242;text-align:center;font-family: Icons;font-size:20px;}'+
	  '#S_UI-btn:after, #S_FSM-btn:after{content:"\\F06E";display:none;width:40px;line-height:40px;color:#424242;text-align:center;font-family: Icons;font-size:20px;}'+
	  '#S_FSM-btn:before{content:"\\F065";} #S_FSM-btn:after{content:"\\F066";}'+
	  '#S_UI-btn.act:before, #S_FSM-btn.act:before{display:none;}'+
	  '#S_UI-btn.act:after, #S_FSM-btn.act:after{display:block;}'+
	  '.S_UI-on .menu, .S_UI-on .b-breadcrumbs, .S_UI-on .ranobe__read_manage_desktop>div:last-child{display:none!important;}'+
	  '.S_FSM-on{margin-top: calc(var(--tlh) - var(--tlh) * 2);} .S_FSM-on .ui.text.container.__ranobe_read_container{padding:0!important;margin-bottom:0;} .S_FSM-on .__ranobe_read_container h1{font-size:18px!important;position:fixed;top:0;left:10px;margin:0!important;}'+
	  '.S_FSM-on .__ranobe_read_container p{display:none;} .S_FSM-on .__ranobe_read_container #CurrentP{display:block;position:fixed;top:44%;transform:translateY(-44%);z-index:99999;max-width:1100px;margin:0!important;}'+
	  '.S_FSM-on .go-next-page, .S_FSM-on .ranobe__read_manage_desktop{display:none;}'+*/
	  ''+
      '';

  var storiSavedOptDef = {
    scrollToP: false,
	currentP: 1,
    pTopOffset: 80,
	tSUI: false,
	tSFSM: false
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
	  $('body').append('<div class="progressBar"><div class="PB-el"></div></div>');
	  $(cRRC).append('<div class="go-next-page dN"><div class="gnp-el"></div><div class="gnp-el"></div><div class="gnp-el"></div><div class="gnp-el"><div></div></div></div>');
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
		if(xy==3){tSUI = storiSavedOpt.tSUI;}
		if(xy==4){tSFSM = storiSavedOpt.tSFSM;}
	  }
	  $('head').append('<style>'+ccss+'</style>');
	  $('body').append('<div id="S_UI-btn"></div><div id="S_FSM-btn"></div>');
    }
    else if($('#CurrentP').length&&cPEx==1){
      cPEx=2;
	  //if(currentP == maxP){$('.go-next-page').removeClass('dN');}
	  if(storiSavedOpt.tSUI == true){ tBClassIcoBtn('S_UI-btn','S_UI-on','tSUI'); }
	  if(storiSavedOpt.tSFSM==true){if(storiSavedOpt.tSUI==false){tBClassIcoBtn('S_UI-btn','S_UI-on','tSUI');}tBClassIcoBtn('S_FSM-btn','S_FSM-on','tSFSM');$('.progressBar').removeClass('dN');}
	  if(storiSavedOpt.scrollToP == false){ /*$('html, body').stop().animate({scrollTop: $(cRRC+'>h1').offset().top+1}, 222);*/ }
	  if(storiSavedOpt.scrollToP == true && currentP > 1){$(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP');slTP(pTopOffset); }
	  chPB(currentP);
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
	  nTNPage = 0; $('.go-next-page .gnp-el').removeClass('activ'); $('.go-next-page').addClass('dN');
	  currentP--; sOpt('currentP', currentP);
	  if(currentP == 1){sOpt('scrollToP',false);}else{sOpt('scrollToP',true);}
	  for(var i=1;i<=maxP;i++){
		if(i==currentP){
		  $(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP');
		  if(!$('.S_FSM-on').length){if($('.S_UI-on').length){slTP(bmN*2);}else{slTP(45+bmN*2);}}
		}
	  }
	  chPB(currentP);
	}
	if((key==40||key==13||key==32||key==9) && currentP<maxP){
	  currentP++; sOpt('currentP', currentP);
	  if(currentP == 1){sOpt('scrollToP',false);}else{sOpt('scrollToP',true);}
	  for(var j=1;j<=maxP;j++){ if(j==currentP){ $(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP'); if(!$('.S_FSM-on').length){slTP(bmN*2); } }}
	  chPB(currentP);
    }
	if(currentP == maxP){ nTNPage++; $('.go-next-page .gnp-el').eq(nTNPage-1).addClass('activ'); $('.go-next-page').removeClass('dN'); }
	if(currentP == maxP && nTNPage>3){
	  var urlNPage = myTrim($('.__btn_toggle_chapter[data-type="next"]').attr('href'),'#text_container','');
	  $('html').css({backgroundColor:'#000'}); $('body').css({transition:'all .3s',opacity:'0'});
	  sOpt('currentP', 1);sOpt('scrollToP',false);
	  setTimeout(function(){ window.location.href = urlNPage; },350);
	}
  });
  window.addEventListener('wheel', function(e) {
	if($('.S_FSM-on').length){
	  if(e.deltaY < 0 && currentP>1){ /* UP */
		nTNPage = 0; $('.go-next-page .gnp-el').removeClass('activ'); $('.go-next-page').addClass('dN');
		currentP--; sOpt('currentP', currentP);
		if(currentP == 1){sOpt('scrollToP',false);}else{sOpt('scrollToP',true);}
		for(var i=1;i<=maxP;i++){
		  if(i==currentP){
			$(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP');
			if(!$('.S_FSM-on').length){if($('.S_UI-on').length){slTP(bmN*2);}else{slTP(45+bmN*2);}}
		  }
		}
		chPB(currentP);
	  }
	  if(e.deltaY > 0 && currentP<maxP){ /* DOWN */
		currentP++; sOpt('currentP', currentP);
		if(currentP == 1){sOpt('scrollToP',false);}else{sOpt('scrollToP',true);}
		for(var j=1;j<=maxP;j++){ if(j==currentP){ $(cRRC+' p#CurrentP').removeAttr('id');$(cRRC+' p').eq(currentP-1).attr('id','CurrentP'); if(!$('.S_FSM-on').length){slTP(bmN*2); } }}
		chPB(currentP);
	  }
	  if(e.deltaY > 0 && currentP == maxP){ nTNPage++; $('.go-next-page .gnp-el').eq(nTNPage-1).addClass('activ'); $('.go-next-page').removeClass('dN'); }
	  if(e.deltaY > 0 && currentP == maxP && nTNPage>3){
		var urlNPage = myTrim($('.__btn_toggle_chapter[data-type="next"]').attr('href'),'#text_container','');
		$('html').css({backgroundColor:'#000'}); $('body').css({transition:'all .3s',opacity:'0'});
		sOpt('currentP', 1);sOpt('scrollToP',false);
		setTimeout(function(){ window.location.href = urlNPage; },350);
	  }
	}
  });
  //localStorage.removeItem("storiSavedOpt");
  $(document).on("click", ".__btn_toggle_chapter.read_nav__buttons__manage", function(){ sOpt('currentP', 1);sOpt('scrollToP',false); });
  $(document).on("click", ".__btn_toggle_chapter", function(){ sOpt('currentP', 1);sOpt('scrollToP',false); });
  $(document).on("click", "#S_UI-btn", function(){ tBClassIcoBtn('S_UI-btn','S_UI-on','tSUI'); /*$('.progressBar').toggleClass('dN');*/ });
  $(document).on("click", "#S_FSM-btn", function(){ setTimeout(function(){slTP(bmN*2);},50); if(storiSavedOpt.tSUI == false){tBClassIcoBtn('S_UI-btn','S_UI-on','tSUI');} tBClassIcoBtn('S_FSM-btn','S_FSM-on','tSFSM'); /*$('.progressBar').toggleClass('dN');*/ });

  function tBClassIcoBtn(tid,tclass,topt){ $('body').toggleClass(tclass); $('#'+tid).toggleClass('act'); if($('.'+tclass).length){sOpt(topt, true);}else{sOpt(topt, false);} }

  function myTrim(x,str,val){return x.replace(str,val);}

  function chPB(curNP){ $('.progressBar, .S_FSM-on '+cRRC+' p').css({maxWidth:$(cRRC).css('max-width')}); $('.PB-el').css({width:parseFloat(100/maxP*curNP).toFixed(3)+'%',background:$(cRRC+' p').css('color')}); }














})(jQuery);
