var $siteForm = $(".js-form"),

    emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    emailValue = false,
    bookingNumberValue = false,
    hideError = function(element, form){
      var $formInput = form.find("[name=" + element + "]");;
      $formInput.removeClass("is-empty");
    },
    displayError = function(element, form) {
      var $emptyInput = form.find("[name=" + element + "]");
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
    validateEmail = function(el, email, form){
      var $emailInput = form.find("[name=" + el + "]");
      if ( emailFormat.test(email) ) {
        hideError(el, form);
        emailValue = true;
      } else {
        $emailInput.val('')
        $emailInput.addClass("is-empty");
        $emailInput.attr("placeholder", "Please enter correct email");
        emailValue = false;
      }
    },
    validateNumber = function(el, bookingNumber, form){
      hideError(el, form);
      bookingNumberValue = true;
    },
    validateData = function(formData, form){
      $.each(formData, function(index, obj){
        var fieldName = obj.name,
            fieldValue = obj.value,
            fieldEmpty = fillCheck(fieldValue);
        if ( fieldEmpty ) {
          if (fieldName === "email") { validateEmail(fieldName, fieldValue, form); }
          if (fieldName === "booking-number") { validateNumber(fieldName, fieldValue, form); }
        } else {
          displayError(fieldName, form);
        }
      });
      if ( emailValue && bookingNumberValue) {
        return true;
      } else {
        return false;
      }
    },
    getFormData = function(form){
      var getData = form.serializeArray(),
          results = validateData(getData, form);
      if ( results ) {
        return getData;
      }
    };

$siteForm.on("submit", function(e){
  e.preventDefault();
  getFormData($(this));
});
