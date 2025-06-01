(function ($) {
	"use strict";

	// Verifica existencia antes de usar
	if ($('.header-text').length && $('header').length) {
		$(window).scroll(function() {
			var scroll = $(window).scrollTop();
			var box = $('.header-text').height();
			var header = $('header').height();

			if (scroll >= box - header) {
				$("header").addClass("background-header");
			} else {
				$("header").removeClass("background-header");
			}
		});
	}

	if ($('.input-group.date').length) {
		$('.input-group.date').datepicker({ format: "dd.mm.yyyy" });
	}

	// Filtros con Isotope
	if ($('.filters ul li').length && $(".grid").length) {
		var $grid = $(".grid").isotope({
			itemSelector: ".all",
			percentPosition: true,
			masonry: {
				columnWidth: ".all"
			}
		});

		$('.filters ul li').click(function() {
			$('.filters ul li').removeClass('active');
			$(this).addClass('active');

			var data = $(this).attr('data-filter');
			$grid.isotope({ filter: data });
		});
	}

	// Espera carga de imágenes antes de iniciar Slick
	var $slider = $(".Modern-Slider");
	if ($slider.length) {
		var images = $slider.find("img");
		var total = images.length, count = 0;

		function iniciarSlider() {
			$slider.slick({
				autoplay: true,
				autoplaySpeed: 20000,
				speed: 1200,
				slidesToShow: 1,
				slidesToScroll: 1,
				pauseOnHover: false,
				dots: true,
				pauseOnDotsHover: true,
				cssEase: 'linear',
				draggable: false,
				prevArrow: '<button class="PrevArrow"></button>',
				nextArrow: '<button class="NextArrow"></button>'
			});
		}

		if (total === 0) {
			iniciarSlider(); // No hay imágenes
		} else {
			images.each(function () {
				if (this.complete) {
					count++;
				} else {
					$(this).on("load error", function () {
						count++;
						if (count === total) iniciarSlider();
					});
				}
			});
			if (count === total) iniciarSlider();
		}
	}

	// Buscador emergente
	$('.search-icon a').on("click", function(event) {
		event.preventDefault();
		$("#search").addClass("open");
		$('#search > form > input[type="search"]').focus();
	});

	$("#search, #search button.close").on("click keyup", function(event) {
		if (event.target === this || event.target.className === "close" || event.keyCode === 27) {
			$(this).removeClass("open");
		}
	});

	$("#search-box").submit(function(event) {
		event.preventDefault();
		return false;
	});

	// Tabs UI
	if ($("#tabs").length) {
		$("#tabs").tabs();
	}

	// Owl Carousel
	if ($('.owl-menu-item').length) {
		$('.owl-menu-item').owlCarousel({
			items: 5,
			loop: true,
			dots: true,
			nav: true,
			autoplay: true,
			margin: 30,
			responsive: {
				0: { items: 1 },
				600: { items: 2 },
				1000: { items: 5 }
			}
		});
	}

	// Menu móvil
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').off('click').on('click', function() {
			if (width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}

	mobileNav();
	$(window).on('resize', mobileNav);

	// ScrollReveal (evitado en Safari)
	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	if (!isSafari && typeof scrollReveal !== 'undefined') {
		window.sr = new scrollReveal();
	}

	// Menú hamburguesa
	if ($('.menu-trigger').length) {
		$(".menu-trigger").on('click', function() {
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}

	// Scroll suave a secciones
	$('.scroll-to-section a[href*="#"]:not([href="#"])').on('click', function(e) {
		if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') &&
			location.hostname === this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				var width = $(window).width();
				if (width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);
				}
				$('html, body').animate({
					scrollTop: target.offset().top - 80
				}, 700);
				return false;
			}
		}
	});

	// Activación de menú en scroll
	function onScroll() {
		var scrollPos = $(document).scrollTop();
		$('.nav a').each(function() {
			var currLink = $(this);
			var refElement = $(currLink.attr("href"));
			if (refElement.length &&
				refElement.position().top <= scrollPos &&
				refElement.position().top + refElement.height() > scrollPos) {
				$('.nav ul li a').removeClass("active");
				currLink.addClass("active");
			} else {
				currLink.removeClass("active");
			}
		});
	}

	$(document).ready(function () {
		$(document).on("scroll", onScroll);

		$('.scroll-to-section a[href^="#"]').on('click', function (e) {
			e.preventDefault();
			$(document).off("scroll");

			$('.scroll-to-section a').removeClass('active');
			$(this).addClass('active');

			var target = $(this.hash);
			$('html, body').stop().animate({
				scrollTop: target.offset().top - 79
			}, 500, 'swing', function () {
				window.location.hash = target.selector;
				$(document).on("scroll", onScroll);
			});
		});
	});

	// Animación de carga y parallax
	$(window).on('load', function() {
		if ($('.cover').length && !isSafari) {
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		if ($('#preloader').length) {
			$("#preloader").animate({ 'opacity': '0' }, 600, function() {
				setTimeout(function() {
					$("#preloader").css("visibility", "hidden").fadeOut();
				}, 300);
			});
		}
	});

})(window.jQuery);
