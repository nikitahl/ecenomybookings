"use strict";

// polyfill to use closest() method on an element
this.Element && function(ElementPrototype) {
  ElementPrototype.closest = ElementPrototype.closest ||
  function(selector) {
    var el = this;
    while (el.matches && !el.matches(selector)) el = el.parentNode;
    return el.matches ? el : null;
  }
}(Element.prototype);

/**
*   Rent Data constructor, holds information about rent dates
*   @param object
*/
var RentData = function(data) {
  this.count = 3;
  this.id = "calendar";
  this.locale = "en-us";
  this.selected = data.selected;
  this.startDay = data.startDay;
  this.startMonth = data.startMonth;
  this.startYear = data.startYear;
  this.startDate = function() {
    var _this = this;
    return new Date(_this.startYear, _this.startMonth, _this.startDay);
  };
  this.startPlaceholder = function() {
    return this.startDate().toLocaleString(this.locale, {
      month: "short",
      day: "numeric"
    });
  };
  this.endDay = data.endDay;
  this.endMonth = data.endMonth;
  this.endYear = data.endYear;
  this.endDate = function() {
    var _this = this;
    return new Date(_this.endYear, _this.endMonth, _this.endDay);
  };
  this.endPlaceholder = function() {
    return this.endDate().toLocaleString(this.locale, {
      month: "short",
      day: "numeric"
    })
  };
  this.range = false;
};

/**
*	 Datepicker Constructor
*/
var Datepicker = function() {
  this.calendar = new CalendarConstructor();
  this.initialDate = {
    locale: "en-us",
    day: this.calendar.date.getDate(),
    month: this.calendar.date.getMonth(),
    year: this.calendar.date.getFullYear(),
    placeholder: this.calendar.date.toLocaleString(this.locale, {
      month: "short",
      day: "numeric"
    })
  };
  this.elements = {
    documentBody: document.querySelector("body"),
    headerSearchForm: document.querySelector("#datepicker"),
    nav: document.querySelectorAll(".js-date-btn")
  };
  this.state = {
    isDatepickerActive: false,
    isDatepickerInit: false,
    rentDates: {}
  };
};

/**
*	 Get month day count in a given month
*  @param number month
*  @param numebr year
*  @return number
*/
Datepicker.prototype.getMonthDayCount = function(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

/**
*	 Display datepicker Previous button depending on visible month
*/
Datepicker.prototype.togglePrevButton = function() {
  var state = this.state.rentDates;
  if (state.monthToRender === this.initialDate.month && state.yearToRender === this.initialDate.year) {
    this.elements.navBtn.prev.classList.add("is-hidden");
  } else {
    this.elements.navBtn.prev.classList.remove("is-hidden");
  }
}

/**
*	 Renew datepicker, call render function
*/
Datepicker.prototype.renewDatepicker = function() {
  // clear HTML
  while (this.elements.calendarContainer.firstChild) {
    this.elements.calendarContainer.removeChild(this.elements.calendarContainer.firstChild);
  }
  this.calendar.renderCalendar(this.state.rentDates);
  this.togglePrevButton();
}

/**
*	 Handle click event on datepicker navigation
*  @param event
*/
Datepicker.prototype.handleDatepickerNav = function(e) {
  var state = this.state.rentDates;
  if (e.target.dataset.navDir === "next") {
    if (state.monthToRender < 11) {
      state.monthToRender = ++state.monthToRender;
    } else {
      state.monthToRender = 0;
      state.yearToRender = ++state.yearToRender;
    }
  } else {
    if (state.monthToRender > 0) {
      state.monthToRender = --state.monthToRender;
    } else {
      state.monthToRender = 11;
      state.yearToRender = --state.yearToRender;
    }
  }
  this.renewDatepicker();
}

/**
*	 Add events to datepicker elements
*/
Datepicker.prototype.createDatepickerEvents = function() {
  var navBtn = Array.prototype.slice.call(this.elements.calendarNavButton);
  this.elements.navBtn = {};
  navBtn.forEach(function(button) {
    this.elements.navBtn[button.dataset.navDir] = button;
    button.addEventListener("click", this.handleDatepickerNav.bind(this));
    if (button.dataset.navDir === "prev") {
      this.elements.navBtn[button.dataset.navDir].classList.add("is-hidden");
    }
  }, this);
  this.elements.calendarContainer.addEventListener("click", this.selectDate.bind(this));
}

/**
*	Create datepicker wrapper with elements, attach to DOM, assign proper events
*/
Datepicker.prototype.constructDatepickerBase = function() {
  var datepickerWrapper = document.createElement("div");
  datepickerWrapper.classList.add("dropdown-calendar-wrap", "dropdown-content", "is-hidden");
  datepickerWrapper.innerHTML += "<div class='prev-month js-months-nav' data-nav-dir='prev'></div>";
  datepickerWrapper.innerHTML += "<div class='next-month js-months-nav' data-nav-dir='next'></div>";
  datepickerWrapper.innerHTML += "<div class='dropdown-calendar' id='calendar'></div>";
  this.elements.headerSearchForm.appendChild(datepickerWrapper);
  this.elements.datepicker = document.querySelector(".dropdown-calendar-wrap");
  this.elements.calendarNavButton = document.querySelectorAll(".js-months-nav");
  this.elements.calendarContainer = document.querySelector(".dropdown-calendar");
  this.createDatepickerEvents();
}

/**
*	 Handle click event on calendar day
*/
Datepicker.prototype.selectDate = function(e) {
  if (this.state.rentDates.selected !== "end") {
    if (e.target.classList.contains("month-day")) {
      this.setRentDate(JSON.parse(e.target.dataset.day));
    }
  } else {
    if (e.target.classList.contains("month-day") && !e.target.classList.contains("start-day")) {
      this.setRentDate(JSON.parse(e.target.dataset.day));
    }
  }
}

/**
*	 Hide datepicker if clicked outside or called manually and remove event
*/
Datepicker.prototype.hideDatepicker = function(e) {
  if (e) {
    e.preventDefault();
    if (e.target.classList.contains("js-date-btn") || e.target.closest(".dropdown-calendar-wrap")) {
      return;
    }
  }
  datepicker.elements.datepicker.classList.add("is-hidden");
  datepicker.state.isDatepickerActive = false;
  datepicker.state.rentDates.range = false;
  document.body.removeEventListener("click", datepicker.hideDatepicker);
}

/**
*	 Set render dates
*/
Datepicker.prototype.setRenderDates = function() {
  if (this.state.rentDates.selected === "start") {
    this.state.rentDates.monthToRender = this.state.rentDates.startMonth;
    this.state.rentDates.yearToRender = this.state.rentDates.startYear;
  } else {
    this.state.rentDates.monthToRender = this.state.rentDates.endMonth;
    this.state.rentDates.yearToRender = this.state.rentDates.endYear;
  }
}

/**
*	 Add/remove class to indicate clicked button
*  @param string
*/
Datepicker.prototype.indicateDate = function(selected) {
  if (this.state.rentDates.selected) {
    this.elements.datepicker.classList.remove("date-" + this.state.rentDates.selected);
  }
  this.elements.datepicker.classList.add("date-" + selected);
}

/**
*	 Handle datepicker depending on clicked control
*  @param string
*/
Datepicker.prototype.handleDatepicker = function(selected) {
  if (!this.state.isDatepickerInit) {
    this.constructDatepickerBase();
    this.state.isDatepickerInit = true;
  }
  if (!this.state.isDatepickerActive || this.state.rentDates.hasOwnProperty("selected") && this.state.rentDates.selected !== selected) {
    this.elements.datepicker.classList.remove("is-hidden");
    document.body.addEventListener("click", datepicker.hideDatepicker);
    // First indicateDate, then set state!
    this.indicateDate(selected);
    this.state.rentDates.selected = selected;
    this.state.isDatepickerActive = true;
    this.setRenderDates();
    this.renewDatepicker();
    // reset monthToRender/yearToRender for further renewals
    this.setRenderDates();
  }
}

/**
* Highlight range on hover
*/
Datepicker.prototype.highlightRange = function(e) {
  var _this = datepicker;
  if (e.target.classList.contains("month-day")) {
    var days = _this.elements.datepicker.querySelectorAll(".month-day");
    days = Array.prototype.slice.call(days);
    for (var i = 0; i < days.length; i++) {
      var day = days[i];
      if (!day.classList.contains("start-day")) {
        day.classList.add("selected-day");
      }
      if (day === e.target) {
        break;
      }
    }
  }
}

/**
* Fade range on hover
*/
Datepicker.prototype.fadeRange = function(e) {
  var _this = datepicker;
  if (e.target.classList.contains("month-day")) {
    var days = _this.elements.datepicker.querySelectorAll(".month-day");
    days = Array.prototype.slice.call(days);
    for (var i = 0; i < days.length; i++) {
      var day = days[i];
      if (!day.classList.contains("start-day")) {
        day.classList.remove("selected-day");
      }
      if (day === e.target) {
        break;
      }
    }
  }
}

/**
* Handle dates range highlight on hover
*/
Datepicker.prototype.handleDynamicRange = function() {
  var _this = this;
  this.elements.datepicker.addEventListener("mouseover", _this.highlightRange);
  this.elements.datepicker.addEventListener("mouseout", _this.fadeRange);
}

/**
* Remove dates range highlight
*/
Datepicker.prototype.removeDynamicRange = function() {
  var _this = this;
  this.elements.datepicker.removeEventListener("mouseover", _this.highlightRange);
  this.elements.datepicker.removeEventListener("mouseout", _this.fadeRange);
}

/**
* Check if selected start date is lesser than existing end date
* @param object
* @return boolean
*/
Datepicker.prototype.checkEndDay = function(rentDates) {
  return rentDates.startDay < rentDates.endDay &&
         rentDates.startMonth === rentDates.endMonth &&
         rentDates.startYear === rentDates.endYear
}

/**
* Sets element content according to received state data
* @param object
*/
Datepicker.prototype.setRentDate = function(data) {
  var _this = this;
  var rentDates = this.state.rentDates;
  var simulateClick;
  if (arguments.length) {
    if (rentDates.selected === "start") {
      rentDates.startDay = data.day;
      rentDates.startMonth = data.month;
      rentDates.startYear = data.year;
      rentDates.endDay = data.day;
      rentDates.endMonth = data.month;
      rentDates.endYear = data.year;
      rentDates.range = true;
      simulateClick = setTimeout(function() {
        _this.handleDatepicker("end");
      }, 150)
      this.handleDynamicRange();
    } else if (rentDates.selected === "end") {
      rentDates.endDay = data.day;
      rentDates.endMonth = data.month;
      rentDates.endYear = data.year;
      clearTimeout(simulateClick);
      this.removeDynamicRange();
      this.hideDatepicker();
    }
  }
  this.elements.rentBtn.start.textContent = rentDates.startPlaceholder();
  this.elements.rentBtn.end.textContent = rentDates.endPlaceholder();
}

/**
*   Pass initial data to RentDates constructor
*/
Datepicker.prototype.setInitialRentState = function() {
  var endDay = this.initialDate.day,
      endMonth = this.initialDate.month,
      endYear = this.initialDate.year,
      endMonthDayCount = new Date(endYear, endMonth + 1, 0).getDate();

  for (var i = 0; i < 7; i++) {
    if (endDay < endMonthDayCount) {
      endDay++;
    } else {
      endDay = 1;
      endMonth++;
      endMonthDayCount = new Date(endYear, endMonth + 1, 0).getDate();
      if (endMonth > 11) {
        endMonth = 0;
        endYear++;
        endMonthDayCount = new Date(endYear, endMonth + 1, 0).getDate();
      }
    }
  }

  this.state.rentDates = new RentData({
    selected: false,
    startDay: this.initialDate.day,
    startMonth: this.initialDate.month,
    startYear: this.initialDate.year,
    endDay: endDay,
    endMonth: endMonth,
    endYear: endYear
  });
}

/**
*   Assign event to form controls (header form buttons),
*   set initial rent dates states
*/
Datepicker.prototype.initiateDatepicker = function() {
  var dateButton = Array.prototype.slice.call(this.elements.nav);
  this.elements.rentBtn = {};
  dateButton.forEach(function(button) {
    this.elements.rentBtn[button.dataset.tripDate] = button;
    button.addEventListener("click", this.handleDatepicker.bind(this, button.dataset.tripDate));
  }, this);
  this.setInitialRentState();
  this.setRentDate();
}

var datepicker = new Datepicker();
datepicker.initiateDatepicker();
