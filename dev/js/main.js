$(document).ready(function(){
	$('#signUpNow').click(function(){
		showModal($('#modalWelcome'));
	});

	$('.mask, .modalClose').click(function(){hideModal();});

	$('#welcomeLogIn').click(function(){
		showModal($('#modalLogin'));
	});

	// $('#logInSubmit').click(function() {
	// 	validateLogin();
	// });

	$('#loginEmail, #loginPassword').focus(function(){clearInputErrors();});

	$('.bannerNext').click(function(){
		stopBannerRotation();
		nextBanner();
	});

	$('.bannerPrev').click(function(){
		stopBannerRotation();
		prevBanner();
	});

	totalBanners = $('.banner').length;
	var bannerPercentWidth = 100  * (1 / totalBanners);
	var bannerHolderWidth = 100 * totalBanners;
	$('.bannerHolder').css({width:bannerHolderWidth + '%'});
	$('.banner').css({width:bannerPercentWidth + '%'});

	initOnResize();

	/* $('#mobileNavigation').click(function(){toggleMobileNav();}); */

	$('#resultArrowLeft').click(function(){scrollFlashcards('left');});
	$('#resultArrowRight').click(function(){scrollFlashcards('right');});

	fitFlashCardsFrameToCardsWidth();

	$('#prArrowLeft').click(function(){scrollPR('left');});
	$('#prArrowRight').click(function(){scrollPR('right');});

	$('.filterDropdown').mouseenter(function(){
		//$(this).addClass('current');
	});

	$('.filterDropdown').click(function(){
		toggleFilterMenu($(this));
	});

	$('.filterDropdown').mouseleave(function(e){
		checkToHideOpenMenu($(this), e);
	});

	$('.filterMenu').mouseleave(function(){
		$('.filterDropdown').removeClass('current');
		$('.filterMenu').hide();
	});

	$('.tab').click(function(){tabClicked($(this));});

	$('#advancedSearch').click(function(){toggleAdvancedSearch();});

	$('#filterResults, #filterResults2').click(function(){doFilterResults();});

	$('#filterSearch input').focus(function(){
		
		$(this).val('');
	});

	$('#filterSearch input').blur(function(){
		if ($(this).val() == '') $(this).val('Search');
	});

	$('#filterSearch').click(function(){submitSearch();});

	$('.filterMenu ul li ').click(function(){filterMenuClicked($(this));});

	$('.closeAdvSearch').click(function(){hideAdvSearch();});

	$('.accordianTop').click(function(){toggleAccordian($(this));});

	try{
		$('.vidElement').fitVids();
	} catch (e) {}

	$('.favThisProj .bullet, .formAgree .bullet').click(function(){
		$(this).toggleClass('active');
	});

	$('.modalRadioBtn').click(function(){
		// if more than one radio button, only allow one to be selected
		var r = $(this);
		if (r.hasClass('active')){
			r.removeClass('active');
		} else {
			r.parent().find('.active').removeClass('active');
			r.addClass('active');
		}

		// to show the style only
		r.parent().parent().find('.modalButton').addClass('active');
	});

	$('.remove').click(function(){
		$('.mask').show();
		var m = $('#modalConfirmRemoveFromFavorites');
		var t = $(window).scrollTop() + 100;
		m.css({top:t});
		m.fadeIn();

		// TODO: make it so you can only choose one radio button
	});

	if (navigator.userAgent.match(/MSIE\s(?!9.0)/)) {
		// ie less than version 9
		IE8 = true;
	}
	//trace('ie8 = ' + IE8);

	startBannerRotation();

	$('.savedSearchItem .bullet, .saveSearch .bullet').click(function(){
		$(this).toggleClass('active');
	});

	// special treatment for apple devices, only do hover if not iOS
	// NOT WORKING
	// if (!isiPhone) {
	// 	trace('set hovers')
	// 	$('.filterDropdown').hover(function(){
	// 		trace('hover')
	// 		$(this).css({'background-image':'url(../img/arrowDownLg.png)'});
	// 	});
	// }

	$('#newsLeftCol .next').click(function(){
		fakeNextNews();
	});

	$('.grid4').click(function(){toggleGrid('1col');});
	$('.grid8').click(function(){toggleGrid('2col');});
});

function fakeNextNews() {
	$('.newsArticle').hide();
	$('.spinner').show();
	$('html, body').animate({scrollTop:$('.spinner').offset().top});
}

function isiPhone(){
    return (
        //Detect iPhone
        (navigator.platform.indexOf("iPhone") != -1) ||
        //Detect iPod
        (navigator.platform.indexOf("iPod") != -1)
    );
}

// cd /Library/WebServer/Documents/fnex
// cap deploy

var totalCards = 0;
var totalBanners;
var bannerIndex = 0;
var testing = true;
var mobileNavVisible = true;
var IE8 = false;
var bannerInterval;
var bannerTiming = 5000; // milliseconds

function trace(m) {
	console.log(m);
}

function getScreen() {
	var w = $(window).width();
	var d = 'browser';
	if (w <= 768) {
		d = 'mobile';
	} else if (w <= 1024 && w >= 768 ) {
		d = 'tablet';
	}
	return d;
}

function initOnResize() {
	$(window).resize(function(){onResize();});
	onResize();
}

function onResize(){
	var w = $(window).width();

	if (testing) window.document.title = 'FNEX | ' + w;

	// realign banner content based on screen size?

	var d = getScreen();
	if (d != 'mobile') {
		$('#mobileLogin, #mobileManage').addClass('mobileOnly');
		$('.nav ul li').not($('.mobileOnly')).css({display:''});
		if (!IE8) checkToWrapFilters();
	} else {
		clearFilterWrapping();
		/* hideMobileNav(); */
	}

	$('.filterDropdown').removeClass('current');
	$('.filterMenu').hide();

	if ($('.advancedSearchPanel').is(':visible')){
		if (!IE8) hideAdvSearch();
	}

	var h = $(document).height();
	$('.mask').css({height:h});
}

function startBannerRotation() {
	stopBannerRotation();
	bannerInterval = setInterval(nextBanner, bannerTiming);
}

function stopBannerRotation() {
	clearInterval(bannerInterval);
}

function toggleMobileNav() {
	if (mobileNavVisible) {
		hideMobileNav();
	} else {
		showMobileNav();
	}
}

function hideMobileNav() {
	alert();
	$('#mobileLogin, #mobileManage').removeClass('mobileOnly');
	$('.nav ul li').not($('#mobileNavigation')).each(function(index){
		//trace(index + ' : ' + $(this).attr('id'));
		$(this).hide();
		//$(this).addClass('hiddenNav');
	});
	mobileNavVisible = false;
}

function showMobileNav() {
	$('#mobileLogin, #mobileManage').addClass('mobileOnly');
	$('.nav ul li').show();
	mobileNavVisible = true;

}

function nextBanner() {
	bannerIndex++;
	if (bannerIndex >= totalBanners) bannerIndex = 0;
	gotoBanner(bannerIndex);
}

function prevBanner() {
	bannerIndex--;
	gotoBanner(bannerIndex);
}

function gotoBanner(id) {
	 
	var offset =  (-id * 100) + '%';
	//trace('go to ' + id +' | ' + offset);

	$('.bannerHolder').stop().animate({'margin-left': offset});

	$('.bannerNext').show();
	$('.bannerPrev').show();
	if (bannerIndex == 0) $('.bannerPrev').hide();
	if (bannerIndex == totalBanners-1) $('.bannerNext').hide();
}

function showModal(m) {
	clearInputErrors();
	hideModal();
	var w = $(document).width();
	var h = $(document).height();
	$('.mask').css({width:w, height:h});
	$('.mask').show();

	m.show();
	//var mt = h/2 - $(window).height()/2;
	var mt = 400;
	//var ml = w/2 - m.width()/2;
	//m.css({top:mt, left:ml});
	m.css({top:mt});
}

function hideModal() {
	$('.mask').hide();
	$('.modal').hide();
}

function validateLogin() {
	clearInputErrors();

	var score = 0;

	if ($('#loginEmail').val() === ''){
		$('#loginEmail').addClass('inputError');
		$('#loginEmailError').show();
	} else {
		score++;
	}

	if ($('#loginPassword').val() === ''){
		$('#loginPassword').addClass('inputError');
		$('#loginPasswordError').show();
	} else {
		score++;
	}


	if (score == 2) {
		// success
		//alert('do ajax call to log in');
	}
}

function clearInputErrors() {
	$('.inputError').removeClass('inputError');
	$('.modalError').hide();
}

function fitFlashCardsFrameToCardsWidth() {
	var w = 0;
	var count = 0;
	$('.flashCard').each(function(){
		w += $(this).outerWidth(true);
		count++;
	});
	// if ($('#dealListB').hasClass('searchResults')) {
	// 	w *= 0.5;
	// 	$('.flashCard').css({'margin-bottom': '20px'});
	// 	trace('flashcard margin bottom = ' + $('.flashCard').css('margin-bottom'));
	// }
	$('.resultsFrame').css({width:w});
	trace(count + ' cards, width is ' + w);
	totalCards = count;
}

function toggleGrid(col) {
	//var cards = $('.flashcards').size();
	var cardW = $('.flashCard').outerWidth(true);
	var w = totalCards * cardW;
	trace('toggle ' + col + ' : ' + totalCards + ' : ' + w);
	if (col == '2col') {
		$('.grid4').css({opacity:0.3});
		$('.grid8').css({opacity:1});
		w *= 0.5;
		if (totalCards%2 !== 0) {
			// add 1 card width to prevent 3 rows
			w += cardW;
		}
		$('.flashCard').css({'margin-bottom': '20px'});
	} else {
		// 1 col
		$('.grid4').css({opacity:1});
		$('.grid8').css({opacity:0.3});
		$('.flashCard').css({'margin-bottom': '0'});
	}
	$('.resultsFrame').css({width:w});
}

function fitPRFrameToItemsWidth() {
	var w = 0;
	$('.prItem').each(function(){
		w += $(this).outerWidth(true);
	});
	$('.prFrame').css({width:w});
	trace("pr frame widht is " + w);
}

function scrollFlashcards(direction) {
	var dir = 1;
	if (direction == 'left') dir = -1;
	var w = $('#resultsTwelveCol').width();
	var pos = $('#resultsTwelveCol').scrollLeft();
	var scr = "+=" + (dir * w);
	trace('scroll ' + direction + ' | ' + w + ' | ' + pos);
	$('#resultsTwelveCol').stop().animate({scrollLeft:scr}, 500);
}

function scrollPR(direction) {
	var dir = 1;
	if (direction == 'left') dir = -1;
	var w = $('#prTwelveCol').width();
	var pos = $('#prTwelveCol').scrollLeft();
	var scr = "+=" + (dir * w);
	trace('scroll ' + direction + ' | ' + w + ' | ' + pos);
	$('#prTwelveCol').stop().animate({scrollLeft:scr}, 500);
}

function toggleFilterMenu(div) {
	//trace('toggleFilterMenu');
	if ($(div).hasClass('current')) {
		$('.filterDropdown').removeClass('current');
		$('.filterMenu').hide();
	} else {
		showFilterMenu(div);
	}
}

function showFilterMenu(div) {
	$('.filterDropdown').removeClass('current');
	$('.filterMenu').hide();
	var id = div.attr('id');
	var n = id.substr(7, id.length);
	//trace('show ' + n);
	var m = $('#menu_' + n);
	m.css({
		left:div.offset().left,
		top: (div.offset().top + div.height())
	});
	m.find('li').css({width:div.width()});
	div.addClass('current');
	m.slideDown(100);
}

function checkToHideOpenMenu(div, e) {
	//trace('check ');
	if (div.hasClass('current')){
		var fm = $('.filterMenu');
		var o = div.offset();
		//trace('menu hover? ' + e.pageX + ' / ' + o.left);
		var hover = false;
		var bottom = o.top + div.height();
		//trace(e.pageY + ' : ' + bottom);
		if (e.pageY >= bottom){
			//trace('under');
		} else {
			$('.filterDropdown').removeClass('current');
			$('.filterMenu').hide();
		}
		
	}
	
}

function tabClicked(div) {
	$('.tab.current').removeClass('current');
	div.addClass('current');
	var id = div.attr('id');
	var n = id.substr(3, 1);
	var c = $('#tab' + n + '_content');
	$('.tabContent').hide();
	//trace('show ' + n)
	c.show();
}

function toggleAdvancedSearch() {
	//if (IE8) alert('toggle ' + $('.advancedSearchPanel').css('display'));
	//trace('toggle: ' + $('.advancedSearchPanel').is(':visible'))
	if ($('.advancedSearchPanel').is(':visible')){
	//if ($('.advancedSearchPanel').css('display') != 'none'){
		//if (IE8) alert('toggle conditional ' + $('.advancedSearchPanel').css('display'));
		hideAdvSearch();
	} else {
		showAdvSearch();
	}

}

function hideAdvSearch() {
	$('.filterMenu').hide();

	$('.advancedSearchPanel').stop().animate({width:0});
	setTimeout(function(){$('.advancedSearchPanel').hide();}, 400);

	// reset flashcards frame
	$('#resultsTwelveCol').stop().animate({width: '92%', margin: '0 4% 20px'});
	$('#recommendedTitle').stop().animate({width: '92%', margin: '30px 4%'});

}

function showAdvSearch() {
	// position adv panel
	var al = $('#resultArrowLeft');
	var l = al.offset().left + al.width() + 10;
	var ap = $('.advancedSearchPanel');

	ap.css({left:l, width:0});

	ap.show();
	ap.stop().animate({width: 268});

	reiszeCardsForAdvSearch();
	
	if (getScreen() == 'mobile') {
		$('html, body').stop().animate({scrollTop:'+=200'});
	}
}

function reiszeCardsForAdvSearch() {
	// var al = $('#resultArrowLeft');
	// var l = al.offset().left + al.width() + 10;
	// $('.advancedSearchPanel').css({left:l});

	var frame = $('#resultsTwelveCol');
	var currentW = frame.width();
	//trace('currentW = ' + currentW);
	var apW = 320;
	var newW = currentW - apW;

	if (IE8 == false) {
		frame.stop().animate({width:newW, 'margin-left':apW});
		$('#recommendedTitle').stop().animate({width:newW, 'margin-left':apW});
	} else {
		frame.css({width:newW, 'margin-left':apW});
		$('#recommendedTitle').css({width:newW, 'margin-left':apW});
	}
	

}

function doFilterResults(){
	trace('filter');
	// fake spinner
	$('.spinner').show();
	$('.resultsFrame').hide();

}

function submitSearch() {
	// do something
	trace('search...')
}

function filterMenuClicked(div) {
	trace(div.find('span').html() + ' clicked');

	div.parent().find('.current').removeClass('current');
	div.addClass('current');

	// do something

	// close menu
	$('.filterDropdown').removeClass('current');
	$('.filterMenu').hide();
}

function toggleAccordian(div) {
	div = div.parent();
	var c = div.find('.accordianContent');
	if (c.is(':visible')) {
		c.slideUp();
		div.removeClass('open');
	} else {
		c.slideDown();
		div.addClass('open');
	}
}

function checkToWrapFilters() {
	clearFilterWrapping();
	try{
		if ($('#advancedSearch').offset().top > $('#filter_1').offset().top) {
			// wrap
			$('#filterResults').css({clear:'left', 'margin-left':99});
			$('#divider2').hide();
		}
	} catch (e) {}
	
}

function clearFilterWrapping() {
	$('#divider2').show();
	$('#filterResults').css({clear:'none', 'margin-left':0});
}

	/*-------------------------------------------
		Signup Toggle
	-------------------------------------------*/


	// Show/hide behavior of section


	$("#whatIsFnex").click(function() {

		$(this).parent().parent().toggleClass("active");

	});


	/*-------------------------------------------
		Footer Section Toggle
	-------------------------------------------*/


	// Show/hide behavior of section


	$("#footer-content").find(".toggle").click(function() {

		$(this).parent().toggleClass("active");

	});