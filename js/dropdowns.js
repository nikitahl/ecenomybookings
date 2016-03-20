// Toggle navbar dropdown menus
$(".js-dropdown").each(function(){
	var $dropdown = $(this),
  		$dropdownToggler = $dropdown.find(".js-dropdown-toggler"),
  		$dropdownBox = $dropdown.find(".js-dropdown-box"),
  		dropdownType = $dropdown.data("dropdown-type"),
		  closeDropdown = function(e){
				var $target = $(e.target),
					  inBox = $target.closest($dropdownBox[0]).length,
					  inButton = $target.closest($dropdownToggler[0]).length;
		        outside = (!inButton) ? (dropdownType !== "closing") ? (!inBox) ? true : false : true : false;
		    if(outside) {
					$dropdown.removeClass("is-open");
		      $(document).unbind("click", closeDropdown );
				}
		  },
		  openDropdown = function() {
		    if(!$dropdown.hasClass("is-open")){
					$dropdown.addClass("is-open");
					$(document).bind("click", closeDropdown);
				} else {
					$dropdown.removeClass("is-open");
					$(document).unbind("click", closeDropdown);
				}
		  };
	$dropdownToggler.on( "click", openDropdown );
});

// Assign dropdown menu values on click
$(".js-local").each(function(){
  var $locale = $(this),
      $localeDisplay = $locale.find(".js-local-display"),
      $localeToggler = $locale.find(".js-local-toggler");

  $localeToggler.on("click", function(e){
    e.preventDefault();
    var dataValue = $(this).data("locale-value");
    $localeDisplay.text(dataValue);

    if ( $localeToggler.hasClass("is-active-locale") ) {
      $localeToggler.removeClass("is-active-locale");
      $(this).addClass("is-active-locale");
    }
  });
});
