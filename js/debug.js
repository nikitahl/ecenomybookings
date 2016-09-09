$(function(){

  $(".overlay-button").click(function(){
    $(".layer").toggleClass("fixed-image");
  });

  $(".overlay-button-640").click(function(){
    $(".layer").toggleClass("fixed-image-640");
  });

  $(".overlay-button-320").click(function(){
    $(".layer").toggleClass("fixed-image-320");
  });

});
