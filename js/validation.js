var $siteForm = $(".js-form"),

    emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    siteForms = {},
    errors,
    FormElementData = function(elName, val, form) {
      this.inputName = elName;
      this.inputValue = val;
      this.formWrap = form;
      this.element = $(form).find("[name=" + elName + "]")
      this.emptyInput = false;
      this.isInvalid = false;
      this.errors = false;
    },
    hideError = function(data){
      var $formInput = data.element;
      var $errorMessage = $formInput.next(".error-msg");
      $formInput.removeClass("is-empty");
      $errorMessage.remove();
      data.emptyInput = false;
      data.errors = false;
    },
    validateEmail = function(data) {
      var inputData = data,
          $el = inputData.element
          inputValue = data.inputValue;

      if ( emailFormat.test(inputValue) ) {
        if (inputData.isInvalid) {
          hideError(inputData);
          inputData.isInvalid = false;
        }
        return;
      } else if (!inputData.isInvalid) {
        $el.addClass("is-empty");
        $el.after("<span class='error-msg'>Please enter correct email</span>");
        inputData.isInvalid = true;
        inputData.errors = true;
      }
    },
    validateValue = function(data){
      var inputName = data.inputName;
      if (inputName === "email") {
        validateEmail(data);
      }
    },
    displayError = function(data) {
      var $emptyInput = data.element;
      $emptyInput.addClass("is-empty");
      $emptyInput.after("<span class='error-msg'>Please fill out this field</span>");
      data.emptyInput = true;
      data.errors = true;
    },
    validateData = function(data){
      for (var i = 0; i < data.length; i++) {
        if ( !data[i].inputValue.trim() ) {
          if (!data[i].emptyInput) {
            displayError(data[i]);
          }
        } else {
          if (data[i].emptyInput) {
            hideError(data[i]);
          }
          validateValue(data[i]);
        }
        if (data[i].errors) {
          errors += 1;
        }
      }
    },
    getFormData = function(form){
      var getFormFields = form.serializeArray();
      var formName = form.attr("name");
      var storeElementData = [];
      errors = 0;

      if (siteForms.hasOwnProperty(formName)) {
        var formData = siteForms[formName];
        for (var i = 0; i < formData.length; i++) {
          if (formData[i].inputName === getFormFields[i].name) {
            formData[i].inputValue = getFormFields[i].value;
          }
        }
      } else {
        storeElementData.length = 0;
        $.each(getFormFields, function(i, obj) {
          var inputData = new FormElementData(obj.name, obj.value, form);
          storeElementData.push(inputData);
        });
        siteForms[formName] = storeElementData;
      }

      validateData(siteForms[formName]);

      if ( errors === 0 ) {
        return getFormFields;
      }
    };

$siteForm.on("submit", function(e){
  e.preventDefault();
  getFormData($(this));
});
