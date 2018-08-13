$(document).ready(function() {
	
	//compactMode = true;
	activeTab = null;

	getCompactMode = function(){
		value = Cookies.get('compactModeCFClub');

		if(value)
		{
			return (value == 'true');
		}
		
		return true;
	};


    getScoutsApiUri = function(url){
        return "/scouts-ao-vivo/api" + url.replace("https://" + location.host + "/scouts-ao-vivo/rodada", "")
    };

	bindPageData = function(data){
		document.title = data.title;
		$("#panel-games").html(data.panelGames);
		$(".game-info").html(data.dateTime);
		$(".tabs").html(data.tabs);
		$(".scout-container-content").html(data.containerContent);
	};

    renderDestin = function(url){
		$(".loading").fadeIn(600);
        var jqxhr = $.getJSON(getScoutsApiUri(url), function(data) {
            bindPageData(data);
            adjustTabsSize();
            adjustCompactMode();
			createTimer();
			$(".loading").fadeOut(1000);
        })
        .done(function() {
        })
        .fail(function() {
        })
        .always(function() {
        });
    };

	enableTabAndColumn = function(element){
		$(".scout-tab").removeClass("active");
		$(".scout-tab-"+element).addClass("active");
		$(".scout-column").hide();
		$(".scout-column-"+element).show();		
	};

	getActiveTab = function(){
		if (activeTab != null)
		{
			return activeTab;
		}

		active = $(".active");
		
		if(active.length > 1)
		{
			active = active[0];
		}
		
		return $($(active).find('a')).data("content");
	};

	removeTabsClickEvent = function(){
		$(".scout-tab a").unbind("click");
	};

	applyTabsClickEvent = function(){
		$(".scout-tab a").click(function(e){
			e.preventDefault();
		});
	};

	getPageWidth = function(){
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	};

	removeCompactClasses = function (){
		if ($(".scout-column").hasClass("scout-column-compact"))
		{
			$(".scout-column").removeClass("scout-column-compact");
		}
		if ($(".scout-column-separator").hasClass("scout-column-separator-compact"))
		{
			$(".scout-column-separator").removeClass("scout-column-separator-compact");
		}
	};

	removeCompactStrategy = function(){
		$(".scout-tab").removeClass("active").addClass("active");	
		$(".scout-column").hide().show();	
		$(".loading-lists").removeClass("loading-lists-right");
		$("#compactBtn").removeClass("show");	
	};

	applyTabsStrategy = function(active){
		$(".scout-tab a").click(function(e){
			activeTab = $(this).data("content");
			enableTabAndColumn(getActiveTab());
		});
		enableTabAndColumn(active);
		$(".loading-lists").addClass("loading-lists-right");
		$("#compactBtn").addClass("show");		
	};

	applyCompactStrategy = function(){
		if (!$(".scout-column").hasClass("scout-column-compact"))
		{
			$(".scout-column").addClass("scout-column-compact");
		}
		if (!$(".scout-column-separator").hasClass("scout-column-separator-compact"))
		{
			$(".scout-column-separator").addClass("scout-column-separator-compact");
		}
		$("#compactBtn").addClass("show");
	};

	adjustCompactMode = function(){
		active = getActiveTab();
		win = getPageWidth();
		compactMode = getCompactMode();
		removeTabsClickEvent();

		removeCompactClasses();
		removeCompactStrategy();

		if((win <= 666) && !compactMode)
		{
			applyTabsStrategy(active);
		}
		else if((win <= 666) && compactMode)
		{
			applyCompactStrategy();
		}

		applyTabsClickEvent();
	};

	adjustTabsSize = function(){
		home_abv = $(".abv-name-home");
		away_abv = $(".abv-name-away");
		home_full = $(".full-name-home");
		away_full = $(".full-name-away");

		away_abv.css("width","auto");
		home_abv.css("width","auto");
		away_full.css("width","auto");
		home_full.css("width","auto");			

		if(home_abv.width() > away_abv.width())
		{
			away_abv.width(home_abv.width() + 1);
			home_abv.width(home_abv.width() + 1);
		}
		else
		{
			home_abv.width(away_abv.width() + 1);
			away_abv.width(away_abv.width() + 1);
		}

		if(home_full.width() > away_full.width())
		{
			away_full.width(home_full.width() + 1);
			home_full.width(home_full.width() + 1);
		}
		else
		{
			home_full.width(away_full.width() + 1);
			away_full.width(away_full.width() + 1);
		}
	};

	toggleCompactModeCookie = function(compactMode){
		if (compactMode == true)
		{
			Cookies.set('compactModeCFClub', false, { expires: 365 });
		}
		else
		{
			Cookies.set('compactModeCFClub', true, { expires: 365 });
		}		
	};

	toggleCompactModeBtn = function(btn, compactMode){
		if (compactMode == true)
		{
			$(btn).addClass("side-button-on").removeClass("side-button-on");
		}
		else
		{
			$(btn).removeClass("side-button-on").addClass("side-button-on");
		}
	};

	manageCompactMode = function(btn){
		toggleCompactModeCookie(getCompactMode());
		toggleCompactModeBtn(btn, getCompactMode());

		adjustCompactMode();
		adjustTabsSize();
	};

	adjustFixedTabs = function(){
		$(".tabs").scrollToFixed();
	};

	 destroyTimer = function(){
		if (typeof(timer) != 'undefined') {
			clearTimeout(timer);
		}
	};

	createTimer = function(){
		timer = setTimeout(function() {
			updater()
		}, 1000 * 5);
	};

	updater = function(){
		destroyTimer();
		renderDestin(location.href);
	};

	$(window).on('resize', function(){
		adjustCompactMode();
		adjustTabsSize();
	});

	$("#compactBtn").click(function(){
		manageCompactMode(this);
	});

	toggleCompactModeBtn("#compactBtn", getCompactMode());
	adjustCompactMode();
	adjustTabsSize();
	adjustFixedTabs();
	updater();

});