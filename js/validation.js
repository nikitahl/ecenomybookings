var $navbarForm = $(".js-navbar-form"),
    $navbarFormInput = $navbarForm.find("input"),

    emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    emailValue = false,
    bookingNumberValue = false,
    hideError = function(element){
      var $formInput = $("[name=" + element + "]");;
      $formInput.removeClass("is-empty");
    },
    displayError = function(element) {
      var $emptyInput = $("[name=" + element + "]");
      $emptyInput.attr("placeholder", "Please fill out this field");
      $emptyInput.addClass("is-empty");
      return false;
    },
    fillCheck = function(val){
      if ( val.trim() ) {
        return true;
      } else {
        return false;
      }
    },
    validateEmail = function(el, email){
      var $emailInput = $("[name=" + el + "]");
      if ( emailFormat.test(email) ) {
        hideError(el);
        emailValue = true;
      } else {
        $emailInput.val('')
        $emailInput.addClass("is-empty");
        $emailInput.attr("placeholder", "Please enter correct email");
        emailValue = false;
      }
    },
    validateNumber = function(el, bookingNumber){
      hideError(el);
      bookingNumberValue = true;
    },
    validateData = function(formData){
      $.each(formData, function(index, obj){
        var fieldName = obj.name,
            fieldValue = obj.value,
            fieldEmpty = fillCheck(fieldValue);
        if ( fieldEmpty ) {
          if (fieldName === "email") { validateEmail(fieldName, fieldValue); }
          if (fieldName === "booking-number") { validateNumber(fieldName, fieldValue); }
        } else {
          displayError(fieldName);
        }
      });
      if ( emailValue && bookingNumberValue) {
        return true;
      } else {
        return false;
      }
    },
    getFormData = function(){
      var getData = $navbarForm.serializeArray(),
          results = validateData(getData);
      if ( results ) {
        return getData;
      }
    };

$navbarForm.on("submit", function(e){
  e.preventDefault();
  getFormData();
});
