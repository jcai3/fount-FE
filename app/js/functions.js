/*global jQuery,google,G_vmlCanvasManager:false */

/* ==================================================

Custom jQuery functions.

================================================== */

(function(){
	
	// USE STRICT
	"use strict";
	
	/////////////////////////////////////////////
	// PAGE FUNCTIONS
	/////////////////////////////////////////////
	
	var page = {
		init: function () {
			
			var deviceAgent = navigator.userAgent.toLowerCase(),
				agentID = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/);
			
			if (agentID) {
				jQuery('body').addClass("mobile-browser");
			} else {
				jQuery('body').addClass("standard-browser");
			}
			
			if (jQuery.browser.msie && (parseInt(jQuery.browser.version, 10) <= 10)) {
				jQuery('body').addClass("browser-ie");
			}
			
			if (jQuery.browser.opera) {
				jQuery('body').addClass("browser-opera");
			}
			
			if (jQuery('body').hasClass("woocommerce-page") && !jQuery('body').hasClass("woocommerce")) {
				jQuery('body').addClass("woocommerce");
			}
									
			// FITVIDS
			jQuery('.portfolio-items:not(.carousel-items),.blog-items:not(.carousel-items),article.type-portfolio,article.type-post,article.type-team,.spb_video_widget,.infocus-item,.recent-posts,.full-width-detail').fitVids();
										
			// FOOTER BEAM ME UP LINK
			jQuery('.beam-me-up').on('click', 'a', function(e) {
				e.preventDefault();
				jQuery('body,html').animate({scrollTop: 0}, 800);
			});
		}
	};
	
	/////////////////////////////////////////////
	// SUPER SEARCH
	/////////////////////////////////////////////
		
	var superSearch = {
		init: function() {
			
			var deviceAgent = navigator.userAgent.toLowerCase(),
				agentID = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/);
			
			jQuery('.search-options .ss-dropdown').on('click', function(e) {
				e.preventDefault();
				
				var option = jQuery(this),
					dropdown = option.find( 'ul' );
								
				if (agentID) {
					if (dropdown.hasClass('show-dropdown')) {
						dropdown.removeClass('show-dropdown');
					} else {
						dropdown.addClass('show-dropdown');							
					}
				} else {
					if (dropdown.hasClass('show-dropdown')) {
						dropdown.css('top', 30);
						dropdown.removeClass('show-dropdown');
					} else {
						dropdown.css('top', -10);
						dropdown.addClass('show-dropdown');							
					}
				}
			});
						
			jQuery('.ss-option').on('click', function(e) {
				e.preventDefault();
				
				var selectedOption = jQuery(this).attr('data-attr_value');
				var parentOption = jQuery(this).parent().parent().parent();
								
				parentOption.find('li').removeClass('selected');
				jQuery(this).parent().addClass('selected');
				
				parentOption.attr('data-attr_value', selectedOption);
				parentOption.find('span').text(jQuery(this).text());
			});
			
			jQuery('.swift-search-link').on('click', function(e) {
				e.preventDefault();
				var superSearch = jQuery('#super-search');
				
				if (!superSearch.is(":visible")) {
					superSearch.slideDown(400);
				}
			});
			
			jQuery('.swift-search-link-alt').on('click', function(e) {
				e.preventDefault();
				var superSearch = jQuery('#super-search');
				
				if (!superSearch.is(":visible")) {
					jQuery('body,html').animate({scrollTop: 0}, 200);
					superSearch.slideDown(400);
				}
			});
			
			
			jQuery('#super-search-go').on('click', function(e) {
				e.preventDefault();
				var filterURL = superSearch.urlBuilder(),
					homeURL = jQuery(this).attr('data-home_url'),
					shopURL = jQuery(this).attr('data-shop_url');
				
				if (filterURL.indexOf("product_cat") >= 0) {
				location.href = homeURL + filterURL;
				} else {
				location.href = shopURL + filterURL;
				}
				
			});
			
			jQuery('#super-search-close').on('click', function(e) {
				e.preventDefault();
				jQuery('#super-search').slideUp(300);
			});
		
		},
		urlBuilder: function() {
			
			var queryString = "";
			
			jQuery('.search-options .ss-dropdown').each(function() {
				
				var attr = jQuery(this).attr('id');
				var attrValue = jQuery(this).attr('data-attr_value');
				if (attrValue !== "") {
					if (attr === "product_cat") {
						if (queryString == "") {
							queryString += "?product_cat=" + attrValue;
						} else {
							queryString += "&product_cat=" + attrValue;
						}
					} else {
						if (queryString === "") {
						queryString += "?filter_" + attr + "=" + attrValue;				
						} else {
						queryString += "&filter_" + attr + "=" + attrValue;									
						}
					}
				}
			});
			
			jQuery('.search-options input').each(function() {
				var attr = jQuery(this).attr('name');
				var attrValue = jQuery(this).attr('value');
				if (queryString === "") {
					queryString += "?"+ attr + "=" + attrValue;				
				} else {
					queryString += "&" + attr + "=" + attrValue;									
				}
			});
			
			return queryString;
		}
	};
	
	
	/////////////////////////////////////////////
	// HEADER
	/////////////////////////////////////////////
	
	var navSearch = jQuery('#nav-search').find('input'),
		navSearchLink = jQuery('.nav-search-link'),		
		miniHeader = jQuery('#mini-header'),
		miniHeaderSearch = jQuery('#mini-search').find('input'),
		miniHeaderSearchLink = jQuery('.mini-search-link');
		
	var header = {
		init: function() {
			
			if (jQuery('body').hasClass('header-overlay')) {
				header.headerOverlaySet();
				$window.smartresize(function(){  
					header.headerOverlaySet();
				});
			}
			
			
			header.miniHeaderInit();
			
			navSearchLink.on('click', function(e) {
				if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
					e.preventDefault();
					navSearch.animate({
						opacity: 1,
						width: 140
					}, 200);
					navSearch.focus();
				}
			});
			
			navSearch.focus(function() {
				if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
					navSearch.css('display', 'inline-block').animate({
						opacity: 1,
						width: 140
					}, 200);
				}
			});
					
			navSearch.blur(function() {
				if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
					jQuery(this).animate({
						opacity: 0,
						width: 1
					}, 200);
					setTimeout(function() {
						navSearch.css('display', 'none');
					}, 300);
				}
			});
						
			miniHeaderSearchLink.on('click', function(e) {
				e.preventDefault();
				miniHeaderSearch.animate({
					opacity: 1,
					width: 140
				}, 200);
				miniHeaderSearch.focus();
			});
			
			miniHeaderSearch.focus(function() {
				jQuery(this).animate({
					opacity: 1,
					width: 140
				}, 200);
			});
					
			miniHeaderSearch.blur(function() {
				jQuery(this).animate({
					opacity: 0,
					width: 1
				}, 200);
			});
			
			jQuery(window).scroll(function() { 
				if ((jQuery(this).scrollTop() > 300) && !jQuery('body').hasClass('has-mini-header')) {
					header.miniHeaderShow();
				} else if ((jQuery(this).scrollTop() < 250) && jQuery('body').hasClass('has-mini-header')) {
					header.miniHeaderHide();
				}
			});
			
			jQuery('.mobile-search-link').on('click', function() {
				
				var isVisible = jQuery('.mobile-search-form').is(":visible");
				
				jQuery('.mobile-search-form').slideToggle();
				
				if (isVisible) {
					jQuery('.mobile-search-link').removeClass('active');
				} else {
					jQuery('.mobile-search-form input').focus();
					jQuery('.mobile-search-link').addClass('active');
				}
			});
							
		},
		miniHeaderInit: function() {
			miniHeader.find('a[title="home"]').html('<i class="fa-home"></i>');
		},
		miniHeaderShow: function() {
			jQuery('body').addClass('has-mini-header');
			miniHeader.css('display', 'block');
			miniHeader.animate({
				"top": "0"
			}, 400);
		},
		miniHeaderHide: function() {
			jQuery('body').removeClass('has-mini-header');
			miniHeader.animate({
				"top": "-80"
			}, 400);
			setTimeout(function() {
				miniHeader.css('display', 'none');
			}, 600);
		},
		headerOverlaySet: function() {
			var headerWrapHeight = jQuery('.header-wrap').height();
							
			if (jQuery('#main-container').find('#swift-slider').length === 0 && jQuery('#main-container').find('.home-slider-wrap').length === 0 && jQuery('#page-wrap').find('.page-heading').length === 0) {
				jQuery('.inner-page-wrap').animate({
					'padding-top': headerWrapHeight + 20
				}, 300);
			} else {
				jQuery('.page-heading').animate({
					'padding-top': headerWrapHeight + 25
				}, 300);
			}
		}
	};
	
	
	/////////////////////////////////////////////
	// NAVIGATION
	/////////////////////////////////////////////
	
	var nav = {
		init: function() {
			
			var lastAjaxSearchValue = "",
				searchTimer = false;
		
			// Add parent class to items with sub-menus
			jQuery("ul.sub-menu").parent().addClass('parent');
			
			// Menu parent click function
			jQuery('.menu li.parent > a').on('click', function(e) {
			
				if (jQuery('#container').width() < 768 || jQuery('body').hasClass('standard-browser')) {
					return e;
				}
				
				var directDropdown = jQuery(this).parent().find('ul.sub-menu').first();
				if (directDropdown.css('opacity') == 1) {
					return e;
				} else {
					e.preventDefault();
				}
			});
			
			var menuTop = 40;
			var menuTopReset = 80;
			
			// Enable hover dropdowns for window size above tablet width
			jQuery("nav").find(".menu li.parent").not(".no-hover").hoverIntent({
				over: function() {
					if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
						
						// Setup menuLeft variable, with main menu value
						var closestSubMenu = jQuery(this).find('ul.sub-menu').first();
						var subMenuWidth = closestSubMenu.outerWidth(true);
						var mainMenuItemWidth = jQuery(this).outerWidth(true);
						var menuLeft = '-' + (Math.round(subMenuWidth / 2) - Math.round(mainMenuItemWidth / 2)) + 'px';
						var menuContainer = jQuery(this).closest('nav');
						
						// Check if this is the top bar menu							
						if (menuContainer.hasClass("top-menu")) {
							if (menuContainer.parent().parent().parent().hasClass("top-bar-menu-right")) {
							menuLeft = "";
							} else {
							menuLeft = "-1px";
							}
							menuTop = 30;
							menuTopReset = 40;
						} else if (menuContainer.hasClass("header-menu")) {
							menuLeft = "-1px";
							menuTop = 28;
							menuTopReset = 40;
						} else if (menuContainer.hasClass("mini-menu") || menuContainer.parent().hasClass("mini-menu")) {
							menuTop = 40;
							menuTopReset = 58;
						} else {
							menuTop = 44;
							menuTopReset = 64;
						}
						
						// Check if second level dropdown
						if (closestSubMenu.parent().parent().hasClass("sub-menu")) {
							menuLeft = closestSubMenu.parent().parent().outerWidth(true) - 2;
						}
											
						closestSubMenu.addClass('show-dropdown').css('top', menuTop);
						closestSubMenu.css('z-index', parseInt(closestSubMenu.css('z-index')) + 1);
					}
				},
				out:function() {
					if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
						jQuery(this).find('ul.sub-menu').first().removeClass('show-dropdown').css('top', menuTopReset);
					}
				}
			});
			
			jQuery(".shopping-bag-item").live("mouseenter", function() {
				
				var subMenuTop = 44;
				
				if (jQuery(this).parent().parent().hasClass("mini-menu")) {
					subMenuTop = 40;
				}
				
				jQuery(this).find('ul.sub-menu').first().addClass('show-dropdown').css('top', subMenuTop);
			}).live("mouseleave", function() {
				if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
					jQuery(this).find('ul.sub-menu').first().removeClass('show-dropdown').css('top', 64);
				}
			});
		
			// Toggle Mobile Nav show/hide			
			jQuery('a.show-main-nav').on('click', function(e) {
				e.preventDefault();
				if (jQuery('#main-navigation').is(':visible')) {
				jQuery('.header-overlay .header-wrap').css('position', '');
				} else {
				jQuery('.header-overlay .header-wrap').css('position', 'relative');
				}
				jQuery('#main-navigation').toggle();
			});
			
			$window.smartresize(function(){  
				if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
					var menus = jQuery('nav').find('ul.menu');
					menus.each(function() {
						jQuery(this).css("display", "");
					});
				}
			});
			
			// Set current language to top bar item
			var currentLanguage = jQuery('li.aux-languages').find('.current-language span').text();
			if (currentLanguage !== "") {
				jQuery('li.aux-languages > a').text(currentLanguage);
			}
			
			
			// AJAX SEARCH
			jQuery('li.menu-search a').on('click', function(e) {
				e.preventDefault();
				
				var subSearchMenu = jQuery(this).parent().find('.sub-menu'),
					menuContainer = jQuery(this).closest('nav'),
					menuTop = 44,
					menuTopReset = 64;
				
				if (menuContainer.hasClass("mini-menu") || menuContainer.parent().hasClass("mini-menu")) {
					menuTop = 40;
					menuTopReset = 58;
				}
				
				if (!subSearchMenu.hasClass('show-dropdown')) {
					subSearchMenu.addClass('show-dropdown').css('top', menuTop);
					subSearchMenu.css('z-index', parseInt(subSearchMenu.css('z-index')) + 1);
				} else {
					if (jQuery('#container').width() > 767 || jQuery('body').hasClass('responsive-fixed')) {
						subSearchMenu.removeClass('show-dropdown').css('top', menuTopReset);
					}
				}
				
			});
			
			jQuery('.ajax-search-form input[name=s]').on('keyup', function(e) {
				var searchvalue = e.currentTarget.value;

				clearTimeout(searchTimer);								
	            if (lastAjaxSearchValue != jQuery.trim(searchvalue) && searchvalue.length >= 3) {
	                searchTimer = setTimeout( function() {
	                	nav.ajaxSearch(e);
	                }, 400);
	            }
			});
			
		},
		hideNav: function(subnav) {
			setTimeout(function() {
				if (subnav.css("opacity") === "0") {
					subnav.css("display", "none");
				}
			}, 300);
		},
		ajaxSearch: function(e) {			
			var searchInput = jQuery(e.currentTarget),
				searchValues = searchInput.parents('form').serialize() + '&action=sf_ajaxsearch',
				results = jQuery('.ajax-search-results'),
				loadingIndicator = jQuery('.ajax-search-wrap .ajax-loading');

			jQuery.ajax({
				url: ajaxurl,
				type: "POST",
				data: searchValues,
				beforeSend: function() {
					loadingIndicator.fadeIn(50);
				},
				success: function(response) {
				    if (response == 0) {
				    	response = "";
			        } else {
			        	results.html(response);
					}
				},
				complete: function() {
				    loadingIndicator.fadeOut(200);
				    results.slideDown(400);
				}
			});
		}
	};
	
	
	/////////////////////////////////////////////
	// WOOCOMMERCE FUNCTIONS
	/////////////////////////////////////////////
	
	var woocommerce = {
		init: function() {
			jQuery('figcaption .add_to_cart_button').on('click', function() {
				var button = jQuery(this);
				var added_text = button.attr("data-added_text");
				button.addClass("product-added");
				button.text(added_text);
			});
			
			jQuery('.show-products-link').on('click', function(e) {
				e.preventDefault();
				var linkHref = jQuery(this).attr('href').replace('?', '');
				var currentQuery = document.location.search;
				
				if (currentQuery.indexOf('?show') >= 0) {				
					window.location = jQuery(this).attr('href');
				} else if (currentQuery.indexOf('?') >= 0) {
					window.location = currentQuery + '&' + linkHref;
				} else {
					window.location = document.location + '?' + linkHref;
				}
			});
						
			jQuery('ul.products li').hover(function() {
				var imageOverlay = jQuery(this).find('.image-overlay');
				imageOverlay.animate({
					top: jQuery(this).height()*-1
				}, 400);
			}, function() {
				var imageOverlay = jQuery(this).find('.image-overlay');
				imageOverlay.animate({
					top: 0
				}, 400);
			});
			
			if (jQuery.fn.imagesLoaded) {
				woocommerce.productSetup();
				
				$window.smartresize(function(){  
					woocommerce.productSetupResize();
				});
			}
			
	        jQuery('.shipping-calculator-form input').keypress(function(e) {
	            if(e.which == 10 || e.which == 13) {
	            	jQuery(".update-totals-button button").click();
	            }
	        });
	        
		},
		productSetup: function() {
			jQuery('ul.products').imagesLoaded(function() {
				var products = jQuery('ul.products');
				setTimeout(function() {
					var product = products.find('li').first();
					var productImageHeight = product.find('.product-image > img').height();
					if (jQuery('#container').width() <= 1024 && product.find('figure > figcaption').is(":visible")) {
						productImageHeight = productImageHeight + 20;
					}
					products.find('li').each(function() {
						jQuery(this).find('figure').css('padding-bottom', productImageHeight  + 'px');
					});
					woocommerce.resizeCarousel();
				}, 300);
			});
		},
		productSetupResize: function() {
			var products = jQuery('ul.products');
			var productImageHeight = products.find('li').first().find('.product-image > img').height();
			console.log(productImageHeight);
			if (jQuery('#container').width() <= 1024 && jQuery(this).find('figure > figcaption').is(":visible")) {
				productImageHeight = productImageHeight + 20;
			}
			products.find('li').each(function() {
				jQuery(this).find('figure').css('padding-bottom', productImageHeight  + 'px');
			});
		},
		productCarousel: function() {
			
			var products = jQuery('.product-carousel');
			
			products.addClass('carousel-wrap');
			
			var carousel = products.find('ul.products');
			
			carousel.each(function() {
				var carouselPrev = jQuery(this).parent().parent().find('.prev');
				var carouselNext = jQuery(this).parent().parent().find('.next');
				var carouselColumns = parseInt(jQuery(this).parent().parent().attr("data-columns"), 10);
			
				if (isMobileAlt & jQuery(window).width() <= 480) {
					carouselColumns = 2;
				} else if (isMobileAlt & jQuery(window).width() <= 320) {
					carouselColumsn = 1;
				}
				
				jQuery(this).imagesLoaded(function () {
					jQuery(this).carouFredSel({
						items				: carouselColumns,
						scroll : {
							visible			: {
												width: carousel.find("> li:first").width(),
												min: 1,
												max: carouselColumns
											},
							easing			: "easeInOutCubic",
							duration		: 800,							
							pauseOnHover	: true
						},
						auto : {
							play			: false
						},
						prev : {	
							button			: carouselPrev,
							key				: "left"
						},
						next : { 
							button			: carouselNext,
							key				: "right"
						},
						onCreate : function() {
							woocommerce.resizeCarousel();
							$window.smartresize(function() {
								woocommerce.resizeCarousel();
							});
						}	
					});
				});
			});
		},
		resizeCarousel: function() {
			var carousel = jQuery('.product-carousel').find('.products');
			
			carousel.each(function() {
				var carouselItem = jQuery(this).find('li');
				var itemWidth = carouselItem.width() + carouselItem.css('margin-left');
				var visible = parseInt(carousel.parent().parent().attr("data-columns"), 10);
				
				if (jQuery('#container').width() < 460 && jQuery('body').hasClass('responsive-fluid')) {
					visible = 1;
				} else if (jQuery('#container').width() < 768 && jQuery('body').hasClass('responsive-fluid')) {
					visible = 2;
				}
				
				carousel.trigger("configuration", {
					items : {
						width : itemWidth
					},
					scroll : {
						items: visible
					}
				});
				
			});
		},
		variations: function() {
			jQuery('.variations select').each( function() {
				var variationSelect = jQuery(this);
				variationSelect.live("change", function(){
					if (jQuery('#sf-included').hasClass('has-productzoom')) {
						jQuery('.zoomContainer').remove();
						setTimeout(function() {
							jQuery('.product-slider-image').each(function() {
								jQuery(this).data('zoom-image', jQuery(this).parent().find('a.zoom').attr('href'));
							});
							jQuery('#product-img-slider li:first').find('.product-slider-image').elevateZoom({
								zoomType: "inner",
								cursor: "crosshair",
								responsive: true,
								zoomWindowFadeIn: 500,
								zoomWindowFadeOut: 750
							});
							jQuery('#product-img-slider').flexslider(0);
						}, 500);
					} else {
						setTimeout(function() {
		                    jQuery('#product-img-slider').flexslider(0);
		                    var flexViewport = jQuery('#product-img-slider').find('.flex-viewport'),
		                        flexsliderHeight = flexViewport.find('ul.slides').css('height');
			                flexViewport.animate({
			                	'height': flexsliderHeight
			                }, 300);
			                jQuery('#product-img-slider').flexslider(0);
		                }, 500);
					}
				});
			});
		}
	};
	
	/////////////////////////////////////////////
	// FLEXSLIDER FUNCTION
	/////////////////////////////////////////////
	
	var flexSlider = {
		init: function() {
			
			var hasProductZoom = false;
			
			if (jQuery('#sf-included').hasClass('has-productzoom') && !jQuery('body').hasClass('mobile-browser')) {
				hasProductZoom = true;
			}
			
			if(jQuery('.recent-posts').length > 0) {
				flexSlider.thumb();
			}
			
			jQuery('#product-img-nav').flexslider({
				animation: "slide",
				directionNav: false,
				controlNav: false,
				animationLoop: false,
				slideshow: false,
				itemWidth: 70,
				itemMargin: 30,
				asNavFor: '#product-img-slider'
			});

			jQuery('#product-img-slider').flexslider({
				animation: "slide",
				controlNav: false,
				smoothHeight: true,
				animationLoop: false,
				slideshow: false,
				sync: "#product-img-nav",
				start: function(productSlider) {
					if (hasProductZoom) {
						if (productSlider.slides) {
							productSlider.slides.eq(productSlider.currentSlide).find('.product-slider-image').elevateZoom({
							    zoomType: "inner",
								cursor: "crosshair",
								responsive: true,
								zoomWindowFadeIn: 500,
								zoomWindowFadeOut: 750
							});
						} else {
							jQuery('#product-img-slider').find('.product-slider-image').elevateZoom({
							    zoomType: "inner",
								cursor: "crosshair",
								responsive: true,
								zoomWindowFadeIn: 500,
								zoomWindowFadeOut: 750
							});
						}
					}
				},
				before: function(productSlider) {
					if (hasProductZoom) {
						jQuery('.zoomContainer').remove();
					}
				},
				after: function(productSlider) {
					if (hasProductZoom) {
						productSlider.slides.eq(productSlider.currentSlide).find('.product-slider-image').elevateZoom({
						    zoomType: "inner",
							cursor: "crosshair",
							responsive: true,
							zoomWindowFadeIn: 500,
							zoomWindowFadeOut: 750
						});
					}
				}
			});
					
			jQuery('.item-slider').flexslider({
				animation: "slide",              //String: Select your animation type, "fade" or "slide"
				slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
				slideshow: true,	//Boolean: Animate slider automatically
				slideshowSpeed: 6000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
				animationDuration: 500,			//Integer: Set the speed of animations, in milliseconds
				smoothHeight: true,         
				directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
				controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
				keyboardNav: false,              //Boolean: Allow slider navigating via keyboard left/right keys
				mousewheel: false,              //Boolean: Allow slider navigating via mousewheel
				prevText: "Prev",           //String: Set the text for the "previous" directionNav item
				nextText: "Next",               //String: Set the text for the "next" directionNav item
				pausePlay: true,               //Boolean: Create pause/play dynamic element
				pauseText: '',             //String: Set the text for the "pause" pausePlay item
				playText: '',               //String: Set the text for the "play" pausePlay item
				randomize: false,               //Boolean: Randomize slide order
				slideToStart: 0,                //Integer: The slide that the slider should start on. Array notation (0 = first slide)
				animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
				pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
				pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
				controlsContainer: "",          //Selector: Declare which container the navigation elements should be appended too. Default container is the flexSlider element. Example use would be ".flexslider-container", "#container", etc. If the given element is not found, the default action will be taken.
				manualControls: "",             //Selector: Declare custom control navigation. Example would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
				start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
				before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
				after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
				end: function(){}               //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
			});
			jQuery('#swift-slider').flexslider({
				animation: "slide",              //String: Select your animation type, "fade" or "slide"
				slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
				slideshow: false,	//Boolean: Animate slider automatically
				slideshowSpeed: 8000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
				animationDuration: 600,         //Integer: Set the speed of animations, in milliseconds
				directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
				controlNav: false,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
				keyboardNav: false,              //Boolean: Allow slider navigating via keyboard left/right keys
				mousewheel: false,              //Boolean: Allow slider navigating via mousewheel
				prevText: "Prev",           //String: Set the text for the "previous" directionNav item
				nextText: "Next",               //String: Set the text for the "next" directionNav item
				pausePlay: false,               //Boolean: Create pause/play dynamic element
				animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
				pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
				pauseOnHover: true,
				start: function(postsSlider) {
					jQuery('.swift-slider-loading').fadeOut(200);
					if (postsSlider.slides) {
						postsSlider.slides.eq(postsSlider.currentSlide).addClass('flex-active-slide'); 
						if (postsSlider.slides.eq(postsSlider.currentSlide).has('.flex-caption-large')) {
							var chart = postsSlider.slides.eq(postsSlider.currentSlide).find('.fw-chart');
							if (jQuery('body').hasClass("browser-ie")) {
							chart = postsSlider.slides.eq(postsSlider.currentSlide).find('.chart');
							}
							chart.each( function() {
								var countValue = parseInt(jQuery(this).attr('data-count'), 10);
								jQuery(this).data('easyPieChart').update(80);
								jQuery(this).find('span').replaceWith("<span>0</span>");
								jQuery(this).find('span').animateNumber(countValue);
							});
						}
						postsSlider.slides.eq(postsSlider.currentSlide).find('.comment-chart:not(.fw-chart) span').replaceWith("<span>0</span>");
					}
				},
				before: function(postsSlider) {
					if (postsSlider.slides) {
						if (postsSlider.slides.eq(postsSlider.currentSlide).has('.flex-caption-large')) {
							var chart = postsSlider.slides.eq(postsSlider.currentSlide).find('.fw-chart');
							if (jQuery('body').hasClass("browser-ie")) {
							chart = postsSlider.slides.eq(postsSlider.currentSlide).find('.chart');
							}
							chart.each( function() {
								jQuery(this).data('easyPieChart').update(0);
								jQuery(this).find('span').replaceWith("<span>0</span>");
							});
						}
						setTimeout( function() {
							postsSlider.slides.eq(postsSlider.currentSlide).addClass('flex-active-slide');
							if (postsSlider.slides.eq(postsSlider.currentSlide).has('.flex-caption-large')) {
								var chart = postsSlider.slides.eq(postsSlider.currentSlide).find('.fw-chart');
								if (jQuery('body').hasClass("browser-ie")) {
								chart = postsSlider.slides.eq(postsSlider.currentSlide).find('.chart');
								}
								chart.each( function() {
									var countValue = parseInt(jQuery(this).attr('data-count'), 10);
									jQuery(this).data('easyPieChart').update(80);
									jQuery(this).find('span').animateNumber(countValue);
								});
							}
						}, 1000);
					}
				}
			});
			jQuery('.content-slider').each(function() {
				var sliderAnimation = jQuery(this).attr('data-animation');
				var autoplay = jQuery(this).attr('data-autoplay');
				autoplay = ((autoplay === "yes") ? true : false);
				
				jQuery(this).flexslider({
					animation: sliderAnimation,              //String: Select your animation type, "fade" or "slide"
					slideshow: autoplay,	//Boolean: Animate slider automatically
					slideshowSpeed: 6000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
					animationDuration: 1000,			//Integer: Set the speed of animations, in milliseconds
					smoothHeight: true,         
					directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
					controlNav: false               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
				});
			});
						
			// LOAD THE LOVE-IT CHARTS
			jQuery('#swift-slider li').each( function() {
				jQuery(this).find('.chart').each( function() {
					jQuery(this).easyPieChart({
						animate: 1000,
						size: 70,
						barColor: jQuery(this).attr('data-barcolor'),
						trackColor: 'transparent',
						scaleColor: false
					});
					jQuery(this).find('span').replaceWith("<span>0</span>");
				});
			});
			
			// CAPTION HOVER ADD/REMOVE CLASSES
			jQuery('#swift-slider li').hover(function() {
				jQuery(this).find('.flex-caption-details').removeClass('closing');
				jQuery(this).find('.flex-caption-details').addClass('open');
			}, function() {
				jQuery(this).find('.flex-caption-details').addClass('closing');
				jQuery(this).find('.flex-caption-details').removeClass('open');
			});
						
			// CAPTION TRANSITION LISTENERS
			jQuery('.caption-details-inner').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
				var chart = jQuery(this).find('.chart');
				if (jQuery(this).parent().hasClass('closing')) {
					chart.each( function() {
						jQuery(this).data('easyPieChart').update(0);
						jQuery(this).find('span').replaceWith("<span>0</span>");
					});
					jQuery(this).parent().removeClass('closing');
				} else if (jQuery(this).parent().hasClass('open')) {
					chart.each( function() {
						var countValue = parseInt(jQuery(this).attr('data-count'), 10);
						jQuery(this).data('easyPieChart').update(80);
						jQuery(this).find('span').animateNumber(countValue);
					});
				}
			});
			
		},
		thumb: function() {
			jQuery('.thumb-slider').flexslider({
				animation: "fade",              //String: Select your animation type, "fade" or "slide"
				slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
				slideshow: true,	//Boolean: Animate slider automatically
				slideshowSpeed: 6000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
				animationDuration: 600,         //Integer: Set the speed of animations, in milliseconds
				directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
				controlNav: false,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
				keyboardNav: false              //Boolean: Allow slider navigating via keyboard left/right keys
			});
		}
	};
	
	/////////////////////////////////////////////
	// PORTFOLIO
	/////////////////////////////////////////////
	
	var portfolioContainer = jQuery('.portfolio-wrap').find('.filterable-items');
	
	var portfolio = {
		init: function() {
			
			
			portfolio.standardSetup();
			
			// SET ITEM HEIGHTS
			portfolio.setItemHeight();
			
			// PORTFOLIO WINDOW RESIZE
			$window.smartresize(function(){  
					portfolio.windowResized();
			});
			
			// Enable filter options on when there are items from that skill
			jQuery('.filtering li').each( function() {
				var itemCount = 0;
				var filter = jQuery(this),
					filterName = jQuery(this).find('a').attr('class'),
					portfolioItems = jQuery(this).parent().parent().parent().next('.filterable-items');
				
				portfolioItems.find('li').each( function() {
					if ( jQuery(this).hasClass(filterName) ) {
						filter.addClass('has-items');
						itemCount++;
					}
				});
				
				if (jQuery(this).hasClass('all')) {
					itemCount = portfolioItems.children('li').length;
					jQuery(this).find('.item-count').text(itemCount);
				} else {
					jQuery(this).find('.item-count').text(itemCount);
				}
			});
	
			// filter items when filter link is clicked
			jQuery('.filtering li').on('click', 'a', function(e) {
				e.preventDefault();
				jQuery(this).parent().parent().find('li').removeClass('selected');
				jQuery(this).parent().addClass('selected');
				var selector = jQuery(this).attr('data-filter');
				var portfolioItems = jQuery(this).parent().parent().parent().parent().next('.filterable-items');
				portfolioItems.isotope({ filter: selector });
			});  
			
			jQuery('.filter-wrap > a').on('click', function(e) {
				e.preventDefault();
				jQuery(this).parent().find('.filter-slide-wrap').slideToggle();
			});
		},
		standardSetup: function() {
			portfolioContainer.isotope({
				animationEngine: 'best-available',
				animationOptions: {
					duration: 300,
					easing: 'easeInOutQuad',
					queue: false
				},
				resizable: true,
				layoutMode: 'fitRows'
			});
			flexSlider.thumb();
			portfolioContainer.isotope("reLayout");
		},
		setItemHeight: function() {
			if (!portfolioContainer.hasClass('single-column')) {
				portfolioContainer.children().css('min-height','0');
				portfolioContainer.equalHeights();
			}
		},
		windowResized: function() {
			if (!portfolioContainer.hasClass('single-column')) {
				portfolio.setItemHeight();
			}
		}
	};
	
	
	/////////////////////////////////////////////
	// BLOG
	/////////////////////////////////////////////
	
	var blogItems = jQuery('.blog-wrap').find('.blog-items'),
		masonryPagination = jQuery('.blog-wrap').find('.masonry-pagination');
	
	var blog = {
		init: function() {
		
			// BLOG ITEM SETUP
			if (blogItems.hasClass('masonry-items')) {
				jQuery('.masonry-items').fitVids();
				blog.masonrySetup();
				blogItems.imagesLoaded(function () {
					blogItems.animate({opacity: 1}, 800);
					masonryPagination.fadeIn(1000);
					blog.masonrySetup();
				});
				flexSlider.thumb();
				blogItems.isotope("reLayout");
				
				// BLOG WINDOW RESIZE
				$window.smartresize(function(){  
						blog.windowResized();
				});
			} else {
				flexSlider.thumb();
			}
			
			
			// BLOG AUX SLIDEOUT
			jQuery('.blog-slideout-trigger').on('click', function(e) {
				e.preventDefault();
				
				// VARIABLES
				var blogWrap = jQuery(this).parent().parent().parent().parent();
				var filterPanel = blogWrap.find('.filter-wrap .filter-slide-wrap');
				var auxType = jQuery(this).attr('data-aux');
								
				// ADD COLUMN SIZE AND REMOVE BRACKETS FROM COUNT
				blogWrap.find('.aux-list li').addClass('span2');
				blogWrap.find('.aux-list li a span').each(function() {
					jQuery(this).html(jQuery(this).html().replace("(","").replace(")",""));
				});
				
				// IF SELECTING AN OPTION THAT IS OPEN, CLOSE THE PANEL
				if (jQuery(this).parent().hasClass('selected') && !filterPanel.is(':animated')) {
					blogWrap.find('.blog-aux-options li').removeClass('selected');
					filterPanel.slideUp(400);
					return;
				}
				
				// AUX BUTTON SELECTED STATE
				blogWrap.find('.blog-aux-options li').removeClass('selected');	
				jQuery(this).parent().addClass('selected');
				
				// IF SLIDEOUT IS OPEN
				if (filterPanel.is(':visible')) {
					
					filterPanel.slideUp(400);
					setTimeout(function() {
						blogWrap.find('.aux-list').css('display', 'none');
						blogWrap.find('.aux-'+auxType).css('display', 'block');
						filterPanel.slideDown();
					}, 600);
					
				// IF SLIDEOUT IS CLOSED
				} else {
					
					blogWrap.find('.aux-list').css('display', 'none');
					blogWrap.find('.aux-'+auxType).css('display', 'block');
					filterPanel.slideDown();
					
				}
			});
			
		},
		masonrySetup: function() {
			blogItems.isotope({
				itemSelector : '.blog-item',
				masonry : {
					columnWidth : 0
				},
				animationEngine: 'best-available',
				animationOptions: {
					duration: 300,
					easing: 'easeInOutQuad',
					queue: false
				},
				transformsEnabled: false,
				resizable: true
			});
		},
		windowResized: function() {
			blogItems.isotope("reLayout");
		}	
	};
	
	
	/////////////////////////////////////////////
	// CAROUSEL FUNCTIONS
	/////////////////////////////////////////////
	
	var carouselWidgets = {
		init: function() {
	
			// CAROUSELS
			var carousel = jQuery('.carousel-items');
			
			carousel.each(function() {
				var carouselInstance = jQuery('#'+jQuery(this).attr('id'));
				var carouselPrev = carouselInstance.parent().parent().find('.prev');
				var carouselNext = carouselInstance.parent().parent().find('.next');
				var carouselColumns = parseInt(carouselInstance.attr("data-columns"), 10);
				
				carouselInstance.imagesLoaded(function () {
					jQuery(this).carouFredSel({
						items				: carouselColumns,
						scroll : {
							visible			: {
												width: carousel.find("> li:first").width(),
												min: 1,
												max: carouselColumns
											},
							easing			: "easeOutQuart",
							duration		: 1000,							
							pauseOnHover	: true
						},
						auto : {
							play			: false
						},
						prev : {	
							button			: carouselPrev,
							key				: "left"
						},
						next : { 
							button			: carouselNext,
							key				: "right"
						},
						onCreate : function() {
							jQuery(this).fitVids();
							flexSlider.thumb();
							carouselWidgets.resizeCarousels();
							$window.smartresize(function() {
								carouselWidgets.resizeCarousels();	
							});
						}	
					});
				});
			});			
		},
		resizeCarousels: function() {
			var carousel = jQuery('.carousel-items');
			
			carousel.each(function() {
				var carouselItem = jQuery(this).find('.carousel-item');
				var itemWidth = carouselItem.width() + carouselItem.css('margin-left');
				var visible = parseInt(carousel.parent().parent().attr("data-columns"), 10);
				
				if (jQuery('#container').width() < 460 && jQuery('body').hasClass('responsive-fluid')) {
					visible = 1;
				} else if (jQuery('#container').width() < 768 && jQuery('body').hasClass('responsive-fluid')) {
					visible = 2;
				}
				
				carousel.trigger("configuration", {
					items : {
						width : itemWidth
					},
					scroll : {
						items: visible
					}
				});

			});
		}
	};
	
	
	/////////////////////////////////////////////
	// WIDGET FUNCTIONS
	/////////////////////////////////////////////
	
	var widgets = {
		init: function() {
			
			// CHARTS
			if (sfIncluded.hasClass('has-chart')) {
				jQuery('.chart-shortcode').each(function(){
					jQuery(this).easyPieChart({
						animate: 1000,
						lineCap: 'square',
						lineWidth: jQuery(this).attr('data-linewidth'),
						size: jQuery(this).attr('data-size'),
						barColor: jQuery(this).attr('data-barcolor'),
						trackColor: jQuery(this).attr('data-trackcolor'),
						scaleColor: false
					});
				});
			}
			
			// LOAD WIDGETS
			widgets.accordion();
			widgets.tabs();
			widgets.toggle();	
			widgets.introAnimations();
			
			if (sfIncluded.hasClass('has-imagebanner')) {
			widgets.imageBanners();
			}
			
			// RESIZE ASSETS
			widgets.resizeAssets();
			$window.smartresize(function() {  
				widgets.resizeAssets();
			});
			
			// SF TOOLTIPS
			jQuery('[rel=tooltip]').tooltip();
			
		},
		resizeAssets: function() {	
			var carousels = jQuery('.carousel-items,.product-carousel .products');
			var assets = jQuery('.alt-bg');
			var assetWidth = 0;
			
			if (jQuery('#container').width() < 460 && jQuery('body').hasClass('responsive-fluid')) {
				assetWidth = jQuery('#container').width() - 40;			
				carousels.find('.carousel-item,.product').each(function() {
					jQuery(this).css("width", assetWidth + "px");
					
				});
			} else if (jQuery('#container').width() < 768 && jQuery('body').hasClass('responsive-fluid')) {
				if (carousels.hasClass('testimonials')) {
				assetWidth = jQuery('#container').width() - 40;	
				} else {
				assetWidth = Math.floor(jQuery('#container').width() / 2) - 35;	
				}
				carousels.find('.carousel-item,.product').each(function() {
					jQuery(this).css("width", assetWidth + "px");
				});
			} else if (jQuery('body').hasClass('responsive-fluid')) {
				carousels.find('.carousel-item,.product').each(function() {
					jQuery(this).css("width", "");
				});
			}
			
			if (jQuery('#container').width() < 768 && jQuery('body').hasClass('responsive-fluid')) {
				assetWidth = jQuery('#container').width();
				assets.each(function() {
					jQuery(this).css("width", assetWidth + "px");
				});	
			} else {
				assets.each(function() {
					jQuery(this).css("width", "");
				});	
			}
		},
		accordion: function() {
			jQuery('.spb_accordion').each(function() {
				var spb_tabs,				
					active_tab = false,
					active_attr = parseInt(jQuery(this).attr('data-active'), 10);
							
				if (jQuery.type( active_attr ) === "number") { active_tab = active_attr; }
							
				spb_tabs = jQuery(this).find('.spb_accordion_wrapper').accordion({
					header: "> div > h3",
					autoHeight: true,
					collapsible: true,
					active: active_tab,
					heightStyle: "content"
				});
			});
		},
		tabs: function() {
			// SET ACTIVE TABS PANE
			jQuery('.spb_tabs').each(function() {
				jQuery(this).find('.tab-pane').first().addClass('active');
			});
			
			// SET ACTIVE TOUR PANE
			jQuery('.spb_tour').each(function() {
				jQuery(this).find('.tab-pane').first().addClass('active');
			});
		},
		toggle: function() {
			jQuery(".spb_toggle").click(function() {
				if ( jQuery(this).hasClass('spb_toggle_title_active') ) {
					jQuery(this).removeClass('spb_toggle_title_active').next().slideUp(500);
				} else {
					jQuery(this).addClass('spb_toggle_title_active').next().slideDown(500);
				}
			});
			jQuery('.spb_toggle_content').each(function() {
				if ( jQuery(this).next().is('h4.spb_toggle') === false ) {
					jQuery('<div class="last_toggle_el_margin"></div>').insertAfter(this);
				}
			});
		},
		initSkillBars: function() {		
			// SKILL BARS
			widgets.animateSkillBars();			
			jQuery(window).scroll(function() { 
				widgets.animateSkillBars();
			});
		},
		animateSkillBars: function() {
			jQuery('.progress:in-viewport').each(function(){
				var progressBar = jQuery(this),
				progressValue = progressBar.find('.bar').attr('data-value');
				if (!progressBar.hasClass('animated')) {
					progressBar.addClass('animated');
					progressBar.find('.bar').animate({
						width: progressValue + "%"
					}, 600, function() {
						progressBar.find('.bar-text').fadeIn(400);
					});
				}
			});
		},
		charts: function() {
			widgets.animateCharts();
			jQuery(window).scroll(function() { 
				widgets.animateCharts();
			});	
		},
		animateCharts: function() {
			jQuery('.chart-shortcode:in-viewport').each(function(){
				if (!jQuery(this).hasClass('animated')) {
					jQuery(this).addClass('animated');
					var animatePercentage = parseInt(jQuery(this).attr('data-animatepercent'), 10);
					jQuery(this).data('easyPieChart').update(animatePercentage);
				}
			});
		},
		introAnimations: function() {
			if (!isMobileAlt) {
				jQuery('.sf-animation').each(function() {
	
					var animatedItem = jQuery(this),
						itemAnimation = animatedItem.data('animation'),
						itemDelay = animatedItem.data('delay');
										
					animatedItem.appear(function() {			
						if (itemAnimation == 'fade-from-left') {
							animatedItem.delay(itemDelay).animate({
								'opacity' : 1,
								'left' : '0px'
							}, 600, 'easeOutCubic');
						} else if (itemAnimation == 'fade-from-right') {
							animatedItem.delay(itemDelay).animate({
								'opacity' : 1,
								'right' : '0px'
							}, 600, 'easeOutCubic');
						} else if(itemAnimation == 'fade-from-bottom') {
							if (animatedItem.hasClass('image-banner-content')) {
								animatedItem.delay(itemDelay).animate({
									'opacity' : 1,
									'bottom' : '50%'
								}, 1000, 'easeOutCubic');
							} else {
								animatedItem.delay(itemDelay).animate({
									'opacity' : 1,
									'bottom' : '0px'
								}, 600, 'easeOutCubic');
							}
						} else if (itemAnimation == 'fade-in') {
							animatedItem.delay(itemDelay).animate({
								'opacity' : 1
							}, 600, 'easeOutCubic');
						} else if (itemAnimation == 'grow') {
							setTimeout(function(){ 
								animatedItem.addClass('sf-animate');
							}, itemDelay);
						} else {
							setTimeout(function() {
								animatedItem.addClass('sf-animate');						
							}, itemDelay);
						}
					}, {accX: 0, accY: -150}, 'easeInCubic');
				
				});
			}
		},
		imageBanners: function() {
			jQuery('.sf-image-banner').each(function() {
				jQuery(this).find('.image-banner-content').vCenter();
			});
		}
	};
	
	
	/////////////////////////////////////////////
	// TEAM MEMBERS FUNCTION
	/////////////////////////////////////////////
	
	var teamMembers = {
		init: function() {
			// TEAM EQUAL HEIGHTS
			var team = jQuery('.team-members');
			team.imagesLoaded(function () {
				jQuery('.team-members').equalHeights();
			});
			
			// TEAM ASSETS
			jQuery(window).on("debouncedresize", function( ) { 
				jQuery('.team-members').children().css('min-height','0');
				jQuery('.team-members').equalHeights();
			});
		}
	};
	
	
	/////////////////////////////////////////////
	// PRETTYPHOTO FUNCTION
	/////////////////////////////////////////////
	
	var prettyPhoto = {
		init: function() {
			jQuery("a[rel^='prettyPhoto']").prettyPhoto({
				theme: 'pp_woocommerce'
			});
		}
	};
	
	
	/////////////////////////////////////////////
	// PARALLAX FUNCTION
	/////////////////////////////////////////////
	
	var parallax = {
		init: function() {
			var controller = jQuery.superscrollorama({
				triggerAtCenter: true,
				playoutAnimations: true,
				reverse: false
			});
//			controller.addTween('.fade-it', TweenMax.from( jQuery('.fade-it'), .5, {css:{opacity: 0}}));
//			controller.addTween('.fly-it', TweenMax.from( jQuery('.fly-it'), .25, {css:{right:'1000px'}, ease:Quad.easeInOut}));
//			controller.addTween('.spin-it', TweenMax.from( jQuery('.spin-it'), .25, {css:{opacity:0, rotation: 720}, ease:Quad.easeOut}));
//			controller.addTween('.smush-it', TweenMax.fromTo( jQuery('.smush-it'), .25, {css:{opacity:0, 'letter-spacing':'30px'}, immediateRender:true, ease:Quad.easeInOut}, {css:{opacity:1, 'letter-spacing':'-10px'}, ease:Quad.easeInOut}), 0, 100); // 100 px offset for better timing
			// parallax example
//			controller.addTween('.sf-parallax', (new TimelineLite()).append([
//				TweenMax.fromTo(jQuery('.spb_content_wrapper'), 1, 
//					{css:{opacity: 0}, immediateRender:true}, 
//					{css:{opacity: 1}})
//				]),
//				300 // scroll duration of tween
//			);
			
		}
	};
	
	
	
	/////////////////////////////////////////////
	// MAP FUNCTIONS
	/////////////////////////////////////////////
	
	var map = {
		init:function() {
			
			var maps = jQuery('.map-canvas');
			maps.each(function(index, element) {
				var mapContainer = element,
					mapAddress = mapContainer.getAttribute('data-address'),
					mapZoom = mapContainer.getAttribute('data-zoom'),
					mapType = mapContainer.getAttribute('data-maptype'),
					pinLogoURL = mapContainer.getAttribute('data-pinimage');
				
				map.getCoordinates(mapAddress, mapContainer, mapZoom, mapType, pinLogoURL);
								
			});
			
			map.fullscreenMap();
			$window.smartresize(function(){
				map.fullscreenMap();
			});
			
		},
		getCoordinates: function(address, mapContainer, mapZoom, mapType, pinLogoURL) {
			var geocoder, geocodeReturn;
			geocoder = new google.maps.Geocoder();			
			geocoder.geocode({
				'address': address
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					
					var mapTypeIdentifier = "",
						companyPos = "",
						mapCoordinates = results[0].geometry.location,
						latitude = results[0].geometry.location.lat(),
						longitude = results[0].geometry.location.lng();				
					
					if (mapType === "satellite") {
					mapTypeIdentifier = google.maps.MapTypeId.SATELLITE;
					} else if (mapType === "terrain") {
					mapTypeIdentifier = google.maps.MapTypeId.TERRAIN;
					} else if (mapType === "hybrid") {
					mapTypeIdentifier = google.maps.MapTypeId.HYBRID;
					} else {
					mapTypeIdentifier = google.maps.MapTypeId.ROADMAP;
					}
							
					var latlng = new google.maps.LatLng(latitude, longitude);
					var settings = {
						zoom: parseInt(mapZoom, 10),
						scrollwheel: false,
						center: latlng,
						mapTypeControl: true,
						mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
						navigationControl: true,
						navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
						mapTypeId: mapTypeIdentifier
					};
					var mapInstance = new google.maps.Map(mapContainer, settings);
					var companyMarker = "";
					if (pinLogoURL) {
						var companyLogo = new google.maps.MarkerImage(pinLogoURL,
							new google.maps.Size(150,75),
							new google.maps.Point(0,0),
							new google.maps.Point(75,75)
						);
						companyPos = new google.maps.LatLng(latitude, longitude);
						companyMarker = new google.maps.Marker({
							position: mapCoordinates,
							map: mapInstance,
							icon: companyLogo
						});
					} else { 
						companyPos = new google.maps.LatLng(latitude, longitude);
						companyMarker = new google.maps.Marker({
							position: mapCoordinates,
							map: mapInstance
						});
					}
					google.maps.event.addListener(companyMarker, 'click', function() {
						window.location.href = 'http://maps.google.com/maps?q='+companyPos;
					});
					
					google.maps.event.addDomListener(window, 'resize', function() {
						mapInstance.setCenter(companyPos);
					});
				} else {
					var alert;
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});			
		},
		fullscreenMap: function() {
			var fullscreenMap = jQuery('.fullscreen-map'),
				container = jQuery('#page-wrap'),
				mapOffset = container.offset().left,
				windowWidth = jQuery(window).width();

			if (windowWidth > 768) {
				mapOffset = mapOffset;
			} else {
				mapOffset = 20;
			}
						
			fullscreenMap.find('.map-canvas').css('width', windowWidth);
			fullscreenMap.css('margin-left', '-' + mapOffset + 'px');
			
		}
	};
		
	
	/////////////////////////////////////////////
	// RELOAD FUNCTIONS
	/////////////////////////////////////////////
	
	var reloadFunctions = {
		init:function() {	
			
			var deviceAgent = navigator.userAgent.toLowerCase(),
				appleAgentID = deviceAgent.match(/(iphone|ipod|ipad)/);
	
			// Remove title attributes from images to avoid showing on hover 
			jQuery('img[title]').each(function() {
				jQuery(this).removeAttr('title');
			});
			
			if (!appleAgentID) {
				jQuery('embed').show();
			}
						
			// Animate Top Links
			jQuery('.animate-top').on('click', function(e) {
				e.preventDefault();
				jQuery('body,html').animate({scrollTop: 0}, 800);           
			});
		},
		load:function() {
			var deviceAgent = navigator.userAgent.toLowerCase(),
				agentID = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/);
				
			if (!agentID) {
			
				// Button hover tooltips
				jQuery('.tooltip').each( function() {
					jQuery(this).css( 'marginLeft', '-' + Math.round( (jQuery(this).outerWidth(true) / 2) ) + 'px' );
				});
				
				jQuery('.comment-avatar').hover( function() {
					jQuery(this).find('.tooltip' ).stop().animate({
						bottom: '44px',
						opacity: 1
					}, 500, 'easeInOutExpo');
				}, function() {
						jQuery(this).find('.tooltip').stop().animate({
							bottom: '25px',
							opacity: 0
						}, 400, 'easeInOutExpo');
				});
				
				jQuery('.grid-image').hover( function() {
					jQuery(this).find('.tooltip' ).stop().animate({
						bottom: '85px',
						opacity: 1
					}, 500, 'easeInOutExpo');
				}, function() {
						jQuery(this).find('.tooltip').stop().animate({
							bottom: '65px',
							opacity: 0
						}, 400, 'easeInOutExpo');
				});
			
			}	
		}
	};
	
	
	/////////////////////////////////////////////
	// LOAD + READY FUNCTION
	/////////////////////////////////////////////
	
	var $window = jQuery(window),
		sfIncluded = jQuery('#sf-included'),
		deviceAgent = navigator.userAgent.toLowerCase(),
		isMobileAlt = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/);
	
	var onReady = {
		init: function(){
			page.init();
			superSearch.init();
			header.init();
			nav.init();
			if (sfIncluded.hasClass('has-products') || jQuery('body').hasClass('woocommerce-cart') || jQuery('body').hasClass('woocommerce-account')) {
			woocommerce.init();
			}
			widgets.init();
			if (sfIncluded.hasClass('has-team')) {
			teamMembers.init();
			}
			prettyPhoto.init();
			if (sfIncluded.hasClass('has-carousel')) {
			carouselWidgets.init();
			woocommerce.productCarousel();
			}
			if (sfIncluded.hasClass('has-parallax')) {
			parallax.init();
			}
			reloadFunctions.init();
		}
	};
	var onLoad = {
		init: function(){
			flexSlider.init();
			if (sfIncluded.hasClass('has-portfolio')) {
			portfolio.init();
			}
			if (sfIncluded.hasClass('has-blog')) {
			blog.init();
			}
			if (sfIncluded.hasClass('has-chart')) {
				widgets.charts();
			}
			if (sfIncluded.hasClass('has-progress-bar')) {
				widgets.initSkillBars();
			}
			if (sfIncluded.hasClass('has-map')) {
			map.init();
			}
			reloadFunctions.load();
			woocommerce.variations();
		}
	};
	
	jQuery(document).ready(onReady.init);
	jQuery(window).load(onLoad.init);
	
})(jQuery);

/////////////////////////////////////////////
// SMARTRESIZE PLUGIN
/////////////////////////////////////////////

(function($,sr){

	// USE STRICT
	"use strict";
	
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;
		
		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap) {
					func.apply(obj, args);
					timeout = null;
				}
			}
			
			if (timeout) {
				clearTimeout(timeout);
			} else if (execAsap) {
				func.apply(obj, args);
			}
			
			timeout = setTimeout(delayed, threshold || 100); 
		};
	};
	
	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
 
})(jQuery,'smartresize');


/////////////////////////////////////////////
// EQUALHEIGHTS PLUGIN
/////////////////////////////////////////////

(function($) {

	// USE STRICT
	"use strict";
	
	$.fn.equalHeights = function(px) {
		$(this).each(function(){
			var currentTallest = 0;
			$(this).children().each(function(){
				if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
			});
			if (!px && Number.prototype.pxToEm) {
				currentTallest = currentTallest.pxToEm(); //use ems unless px is specified
			}
			// for ie6, set height since min-height isn't supported
			if ($.browser.msie && $.browser.version === 6.0) {
				(this).children().css({'height': currentTallest});
			}
			$(this).children().css({'min-height': currentTallest}); 
		});
		return this;
	};
})(jQuery);


/////////////////////////////////////////////
// EASYPIECHART PLUGIN
/////////////////////////////////////////////

(function($) {
	// USE STRICT
	"use strict";
	$.easyPieChart = function(el, options) {
		var addScaleLine, animateLine, drawLine, easeInOutQuad, renderBackground, renderScale, renderTrack,
		_this = this;
		this.el = el;
		this.$el = $(el);
		this.$el.data("easyPieChart", this);
		this.init = function() {
			var percent;
			_this.options = $.extend({}, $.easyPieChart.defaultOptions, options);
			percent = parseInt(_this.$el.data('percent'), 10);
			_this.percentage = 0;
			_this.canvas = $("<canvas width='" + _this.options.size + "' height='" + _this.options.size + "'></canvas>").get(0);
			_this.$el.append(_this.canvas);
			if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
				G_vmlCanvasManager.initElement(_this.canvas);
			}
			_this.ctx = _this.canvas.getContext('2d');
			if (window.devicePixelRatio > 1.5) {
				$(_this.canvas).css({
					width: _this.options.size,
					height: _this.options.size
				});
				_this.canvas.width *= 2;
				_this.canvas.height *= 2;
				_this.ctx.scale(2, 2);
			}
			_this.ctx.translate(_this.options.size / 2, _this.options.size / 2);
			_this.$el.addClass('easyPieChart');
			_this.$el.css({
				width: _this.options.size,
				height: _this.options.size,
				lineHeight: "" + _this.options.size + "px"
			});			
			_this.update(percent);
			return _this;
		};
		this.update = function(percent) {
			if (_this.options.animate === false) {
				return drawLine(percent);
			} else {
				if (percent === 0) {
					return animateLine(0, 0);	
				} else {
					return animateLine(_this.percentage, percent);	
				}
			}
		};
		renderScale = function() {
			var i, _i, _results;
			_this.ctx.fillStyle = _this.options.scaleColor;
			_this.ctx.lineWidth = 1;
			_results = [];
			for (i = _i = 0; _i <= 24; i = ++_i) {
				_results.push(addScaleLine(i));
			}
			return _results;
		};
		addScaleLine = function(i) {
			var offset;
			offset = i % 6 === 0 ? 0 : _this.options.size * 0.017;
			_this.ctx.save();
			_this.ctx.rotate(i * Math.PI / 12);
			_this.ctx.fillRect(_this.options.size / 2 - offset, 0, -_this.options.size * 0.05 + offset, 1);
			return _this.ctx.restore();
		};
		renderTrack = function() {
			var offset;
			offset = _this.options.size / 2 - _this.options.lineWidth / 2;
			if (_this.options.scaleColor !== false) {
				offset -= _this.options.size * 0.08;
			}
			_this.ctx.beginPath();
			_this.ctx.arc(0, 0, offset, 0, Math.PI * 2, true);
			_this.ctx.closePath();
			_this.ctx.strokeStyle = _this.options.trackColor;
			_this.ctx.lineWidth = _this.options.lineWidth;
			return _this.ctx.stroke();
		};
		renderBackground = function() {
//			if (_this.options.scaleColor !== false) {
//				renderScale();
//			}
			if (_this.options.trackColor !== false) {
				return renderTrack();
			}
		};
		drawLine = function(percent) {
			var offset;
			renderBackground();
			_this.ctx.strokeStyle = $.isFunction(_this.options.barColor) ? _this.options.barColor(percent) : _this.options.barColor;
			_this.ctx.lineCap = _this.options.lineCap;
			_this.ctx.lineWidth = _this.options.lineWidth;
			offset = _this.options.size / 2 - _this.options.lineWidth / 2;
			if (_this.options.scaleColor !== false) {
				offset -= _this.options.size * 0.08;
			}
			_this.ctx.save();
			_this.ctx.rotate(-Math.PI / 2);
			_this.ctx.beginPath();
			_this.ctx.arc(0, 0, offset, 0, Math.PI * 2 * percent / 100, false);
			_this.ctx.stroke();
			return _this.ctx.restore();
		};
		animateLine = function(from, to) {
			var currentStep, fps, steps;
			fps = 30;
			steps = fps * _this.options.animate / 1000;
			currentStep = 0;
			_this.options.onStart.call(_this);
			_this.percentage = to;
			if (_this.animation) {
				clearInterval(_this.animation);
				_this.animation = false;
			}
			_this.animation = setInterval(function() {
				_this.ctx.clearRect(-_this.options.size / 2, -_this.options.size / 2, _this.options.size, _this.options.size);
				renderBackground.call(_this);
				drawLine.call(_this, [easeInOutQuad(currentStep, from, to - from, steps)]);
				currentStep++;
				if ((currentStep / steps) > 1) {
					clearInterval(_this.animation);
					_this.animation = false;
					return _this.options.onStop.call(_this);
				}
			}, 1000 / fps);
			return _this.animation;
		};
		easeInOutQuad = function(t, b, c, d) {
			var easeIn, easing;
			easeIn = function(t) {
				return Math.pow(t, 2);
			};
			easing = function(t) {
				if (t < 1) {
					return easeIn(t);
				} else {
					return 2 - easeIn((t / 2) * -2 + 2);
				}
			};
			t /= d / 2;
			return c / 2 * easing(t) + b;
		};
		return this.init();
	};
	$.easyPieChart.defaultOptions = {
		barColor: '#ef1e25',
		trackColor: '#f2f2f2',
		scaleColor: false,
		lineCap: 'round',
		size: 110,
		lineWidth: 3,
		animate: false,
		onStart: $.noop,
		onStop: $.noop
	};
	$.fn.easyPieChart = function(options) {
		return $.each(this, function(i, el) {
		var $el;
		$el = $(el);
		if (!$el.data('easyPieChart')) {
			return $el.data('easyPieChart', new $.easyPieChart(el, options));
		}
		});
	};
	return void 0;
})(jQuery);


/////////////////////////////////////////////
// ANIMATE NUMBER PLUGIN
/////////////////////////////////////////////

(function($) {
	
	// USE STRICT
	"use strict";
	
    $.fn.animateNumber = function(to) {
        var $ele = $(this),
            num = parseInt($ele.html(), 10),
            up = to > num,
            num_interval = Math.abs(num - to) / 90;

        var loop = function() {
            num = up ? Math.ceil(num+num_interval) : Math.floor(num-num_interval);
            if ( (up && num > to) || (!up && num < to) ) {
                num = to;
                clearInterval(animation);
            }
            $ele.html(num);
        };
        
        var intervalTime = to <= 5 ? intervalTime = 100 : to <= 25 ? intervalTime = 50 : to <= 50 ? intervalTime = 25 : 10;

        var animation = setInterval(loop, intervalTime);
    };
})(jQuery);


/////////////////////////////////////////////
// VIEWPORT PLUGIN
/////////////////////////////////////////////

/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */


(function($) {

	// USE STRICT
	"use strict";
    
    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    
    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    
    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    
    $.extend($.expr[':'], {
        "below-the-fold": function(a) {
            return $.belowthefold(a, {threshold : 0});
        },
        "above-the-top": function(a) {
            return $.abovethetop(a, {threshold : 0});
        },
        "left-of-screen": function(a) {
            return $.leftofscreen(a, {threshold : 0});
        },
        "right-of-screen": function(a) {
            return $.rightofscreen(a, {threshold : 0});
        },
        "in-viewport": function(a) {
            return $.inviewport(a, {threshold : 0});
        }
    });

    
})(jQuery);


/*!
 * jquery.customSelect() - v0.4.1
 * http://adam.co/lab/jquery/customselect/
 * 2013-05-13
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */

(function ($) {
    'use strict';

    $.fn.extend({
        customSelect: function (options) {
            // filter out <= IE6
            if (typeof document.body.style.maxHeight === 'undefined') {
                return this;
            }
            var defaults = {
                    customClass: 'customSelect',
                    mapClass:    true,
                    mapStyle:    true
            },
            options = $.extend(defaults, options),
            prefix = options.customClass,
            changed = function ($select,customSelectSpan) {
                var currentSelected = $select.find(':selected'),
                customSelectSpanInner = customSelectSpan.children(':first'),
                html = currentSelected.html() || '&nbsp;';

                customSelectSpanInner.html(html);
                
                if (currentSelected.attr('disabled')) {
                	customSelectSpan.addClass(getClass('DisabledOption'));
                } else {
                	customSelectSpan.removeClass(getClass('DisabledOption'));
                }
                
                setTimeout(function () {
                    customSelectSpan.removeClass(getClass('Open'));
                    $(document).off('mouseup.'+getClass('Open'));                  
                }, 60);
            },
            getClass = function(suffix){
                return prefix + suffix;
            };

            return this.each(function () {
                var $select = $(this),
                    customSelectInnerSpan = $('<span />').addClass(getClass('Inner')),
                    customSelectSpan = $('<span />');

                $select.after(customSelectSpan.append(customSelectInnerSpan));
                
                customSelectSpan.addClass(prefix);

                if (options.mapClass) {
                    customSelectSpan.addClass($select.attr('class'));
                }
                if (options.mapStyle) {
                    customSelectSpan.attr('style', $select.attr('style'));
                }

                $select
                    .addClass('hasCustomSelect')
                    .on('update', function () {
						changed($select,customSelectSpan);
						
                        var selectBoxWidth = parseInt($select.outerWidth(), 10) -
                                (parseInt(customSelectSpan.outerWidth(), 10) -
                                    parseInt(customSelectSpan.width(), 10));
						
						// Set to inline-block before calculating outerHeight
						customSelectSpan.css({
                            display: 'inline-block'
                        });
						
                        var selectBoxHeight = customSelectSpan.outerHeight();

                        if ($select.attr('disabled')) {
                            customSelectSpan.addClass(getClass('Disabled'));
                        } else {
                            customSelectSpan.removeClass(getClass('Disabled'));
                        }

                        customSelectInnerSpan.css({
                            width:   selectBoxWidth,
                            display: 'inline-block'
                        });

                        $select.css({
                            '-webkit-appearance': 'menulist-button',
                            width:                customSelectSpan.outerWidth(),
                            position:             'absolute',
                            opacity:              0,
                            height:               selectBoxHeight,
                            fontSize:             customSelectSpan.css('font-size')
                        });
                    })
                    .on('change', function () {
                        customSelectSpan.addClass(getClass('Changed'));
                        changed($select,customSelectSpan);
                    })
                    .on('keyup', function (e) {
                        if(!customSelectSpan.hasClass(getClass('Open'))){
                            $select.blur();
                            $select.focus();
                        }else{
                            if(e.which==13||e.which==27){
                                changed($select,customSelectSpan);
                            }
                        }
                    })
                    .on('mousedown', function (e) {
                        customSelectSpan.removeClass(getClass('Changed'));
                    })
                    .on('mouseup', function (e) {
                        
                        if( !customSelectSpan.hasClass(getClass('Open'))){
                            // if FF and there are other selects open, just apply focus
                            if($('.'+getClass('Open')).not(customSelectSpan).length>0 && typeof InstallTrigger !== 'undefined'){
                                $select.focus();
                            }else{
                                customSelectSpan.addClass(getClass('Open'));
                                e.stopPropagation();
                                $(document).one('mouseup.'+getClass('Open'), function (e) {
                                    if( e.target != $select.get(0) && $.inArray(e.target,$select.find('*').get()) < 0 ){
                                        $select.blur();
                                    }else{
                                        changed($select,customSelectSpan);
                                    }
                                });
                            }
                        }
                    })
                    .focus(function () {
                        customSelectSpan.removeClass(getClass('Changed')).addClass(getClass('Focus'));
                    })
                    .blur(function () {
                        customSelectSpan.removeClass(getClass('Focus')+' '+getClass('Open'));
                    })
                    .hover(function () {
                        customSelectSpan.addClass(getClass('Hover'));
                    }, function () {
                        customSelectSpan.removeClass(getClass('Hover'));
                    })
                    .trigger('update');
            });
        }
    });
})(jQuery);


/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function($) {
    $.fn.appear = function(fn, options) {

        var settings = $.extend({

            //arbitrary data to pass to fn
            data: undefined,

            //call fn only on the first appear?
            one: true,

            // X & Y accuracy
            accX: 0,
            accY: 0

        }, options);

        return this.each(function() {

            var t = $(this);

            //whether the element is currently visible
            t.appeared = false;

            if (!fn) {

                //trigger the custom event
                t.trigger('appear', settings.data);
                return;
            }

            var w = $(window);

            //fires the appear event when appropriate
            var check = function() {

                //is the element hidden?
                if (!t.is(':visible')) {

                    //it became hidden
                    t.appeared = false;
                    return;
                }

                //is the element inside the visible window?
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= b &&
                    y <= b + wh + ay &&
                    x + tw + ax >= a &&
                    x <= a + ww + ax) {

                    //trigger the custom event
                    if (!t.appeared) t.trigger('appear', settings.data);

                } else {

                    //it scrolled out of view
                    t.appeared = false;
                }
            };

            //create a modified fn with some additional logic
            var modifiedFn = function() {

                //mark the element as visible
                t.appeared = true;

                //is this supposed to happen only once?
                if (settings.one) {

                    //remove the check
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0) $.fn.appear.checks.splice(i, 1);
                }

                //trigger the original fn
                fn.apply(this, arguments);
            };

            //bind the modified fn to the element
            if (settings.one) t.one('appear', settings.data, modifiedFn);
            else t.bind('appear', settings.data, modifiedFn);

            //check whenever the window scrolls
            w.scroll(check);

            //check whenever the dom changes
            $.fn.appear.checks.push(check);

            //check now
            (check)();
        });
    };

    //keep a queue of appearance checks
    $.extend($.fn.appear, {

        checks: [],
        timeout: null,

        //process the queue
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0) while (length--) ($.fn.appear.checks[length])();
        },

        //check the queue asynchronously
        run: function() {
            if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });

    //run checks when these methods are called
    $.each(['append', 'prepend', 'after', 'before', 'attr',
        'removeAttr', 'addClass', 'removeClass', 'toggleClass',
        'remove', 'css', 'show', 'hide'], function(i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function() {
                var r = old.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });

})(jQuery);


/////////////////////////////////////////////
// vCenter PLUGIN
/////////////////////////////////////////////

(function($) {$.fn.vCenter = function() {return this.each(function(){var height = $(this).outerHeight();$(this).css('margin-bottom',-height/2);});};})(jQuery);
(function($) {$.fn.vCenterTop = function() {return this.each(function(){var height = $(this).outerHeight();$(this).css('margin-top',-height/2);});};})(jQuery);