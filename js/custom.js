(function ($) {
  "use strict";

  // PRE LOADER
  $(window).load(function () {
    $(".preloader").fadeOut(1000);
  });

  // Navigation Section (드롭다운이 아닌 일반 메뉴 클릭 시 메뉴판 닫기)
  $(".navbar-collapse a:not(.dropdown-toggle)").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });

  // 드롭다운 메뉴 토글 (한 번 누르면 열리고 다시 누르면 닫힘)
  $(".dropdown-toggle").on("click", function (e) {
    e.preventDefault();

    var $parent = $(this).parent(".dropdown");

    if ($parent.hasClass("open")) {
      $parent.removeClass("open");
    } else {
      $(".dropdown").removeClass("open");
      $parent.addClass("open");
    }
  });

  // ★ 사라졌던 X 닫기 버튼 복구 및 기능 추가
  if ($(".navbar-collapse .close-menu-x").length === 0) {
    $(".navbar-collapse").prepend(
      '<div class="close-menu-x" style="position:absolute; right:20px; top:15px; font-size:35px; cursor:pointer; color:#000; z-index:10005; line-height:1;">&times;</div>',
    );
  }

  $(document).on("click", ".close-menu-x", function () {
    if ($(".navbar-collapse").hasClass("in")) {
      $(".navbar-toggle").click();
    }
  });

  // Owl Carousel
  $(".owl-carousel").owlCarousel({
    animateOut: "fadeOut",
    items: 1,
    loop: true,
    autoplay: true,
  });

  // PARALLAX EFFECT
  $.stellar();

  // SMOOTHSCROLL
  $(function () {
    $(".navbar-default a, #home a, footer a").on("click", function (event) {
      var $anchor = $(this);
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $($anchor.attr("href")).offset().top - 49,
          },
          1000,
        );
      event.preventDefault();
    });
  });

  // WOW ANIMATION
  new WOW({ mobile: false }).init();
})(jQuery);

$(document).ready(function () {
  // 1. 로컬 스토리지 확인 (오늘 하루 보지 않기가 설정되어 있는지)
  var isHidden = localStorage.getItem("hideMainPopup");
  var now = new Date().getTime();

  // 설정된 시간이 지났거나 기록이 없으면 팝업 띄우기
  if (!isHidden || now > isHidden) {
    setTimeout(function () {
      $("#mainPopup").modal("show");
    }, 800); // 페이지 로드 0.8초 후 등장
  }

  // 2. 닫기 버튼이나 체크박스 로직
  $("#mainPopup .btn-close-text, #mainPopup .close").click(function () {
    if ($("#closeToday").is(":checked")) {
      // 현재 시간으로부터 24시간 후의 시간을 저장
      var expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("hideMainPopup", expiryTime);
    }
  });
});
