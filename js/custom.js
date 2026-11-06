(function ($) {
  "use strict";

  // PRE LOADER
  // 예전: 사진·지도까지 전부 다 받아질 때까지(window load) 흰 화면 유지 → 첫 접속이 매우 느림
  // 지금: 페이지 구조(HTML)만 준비되면 바로 걷어냄. 사진은 화면에 보이는 대로 이어서 로딩됨
  $(function () {
    $(".preloader").fadeOut(300);
  });

  // Navigation Section (드롭다운이 아닌 일반 메뉴 클릭 시 메뉴판 닫기)
  $(".navbar-collapse a:not(.dropdown-toggle)").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });

  // 드롭다운 메뉴 토글 (한 번 누르면 열리고 다시 누르면 닫힘)
  $(".dropdown-toggle").on("click", function (e) {
    e.preventDefault();
    // 모바일 메뉴(767px 이하): 서브페이지의 data-toggle="dropdown" 때문에 Bootstrap이
    // 같은 클릭에 한 번 더 토글해서 열리자마자 닫히는 것을 막음 (PC 동작은 그대로)
    if (window.matchMedia("(max-width: 767px)").matches) e.stopPropagation();

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

  // Owl Carousel (슬라이더는 index.html에만 있음, 다른 페이지는 owl 파일을 불러오지 않음)
  if ($.fn.owlCarousel) $(".owl-carousel").owlCarousel({
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
      // 같은 페이지 안의 #앵커만 스크롤. 다른 페이지 링크·"#"·없는 대상은 브라우저 기본 동작 그대로
      var href = $(this).attr("href") || "";
      if (href.charAt(0) !== "#" || href.length < 2 || !$(href).length) return;
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $(href).offset().top - 49,
          },
          1000,
        );
      event.preventDefault();
    });
  });

  // 상단 고정 메뉴 높이를 CSS 변수(--nav-height)로 저장 → 앵커 이동 시 scroll-margin-top에 사용
  // jquery.sticky가 감싼 .sticky-wrapper 높이도 nav 현재 높이로 다시 맞춤
  // (웹폰트 로드 전 메뉴가 줄바꿈된 높이로 고정돼 nav 아래에 빈 공간이 남는 것 방지)
  function setNavHeight() {
    var $nav = $(".navbar-default");
    if (!$nav.length || $(".navbar-collapse").hasClass("in")) return;
    var h = $nav.outerHeight();
    document.documentElement.style.setProperty("--nav-height", h + "px");
    $nav.parent(".sticky-wrapper").css("height", h + "px");
  }
  setNavHeight();
  $(window).on("load resize", setNavHeight);
  if (document.fonts) document.fonts.ready.then(setNavHeight);

  // WOW ANIMATION
  new WOW({ mobile: false }).init();
})(jQuery);

$(document).ready(function () {
  var today = new Date();
  var monthKey =
    today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2);
  var popupImages = {
    "2026-10": "images/popup_event_202610.jpg",
    "2026-11": "images/popup_event_202611.jpg",
    "2026-12": "images/popup_event_202612.jpg",
  };
  var $popupImage = $("#mainPopup .modal-body img");
  var defaultPopup = $popupImage.attr("data-default-src") || "images/popup_event.jpg";

  // 이번 달 팝업 이미지 1장만 내려받음 (예전엔 기본 팝업 + 이번 달 팝업 2장을 받았음)
  $popupImage.one("error", function () {
    $(this).attr("src", defaultPopup);
  });
  $popupImage.attr("src", popupImages[monthKey] || defaultPopup);

  // 메인 팝업 (index.html에만 있음). "오늘 하루 보지 않기" = 체크 후 닫으면 오늘 자정(로컬 시간)까지 안 뜸
  var $popup = $("#mainPopup");
  if (!$popup.length) return;

  if (!(Number(localStorage.getItem("hideMainPopup")) > Date.now())) {
    $popup.modal("show");
  }

  // X·[닫기]·배경 클릭·ESC 등 어떤 방법으로 닫아도 체크 상태를 반영
  $popup.on("hidden.bs.modal", function () {
    if ($("#closeToday").is(":checked")) {
      localStorage.setItem("hideMainPopup", new Date().setHours(23, 59, 59, 999));
    }
  });
});
