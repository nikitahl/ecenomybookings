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
  this.count = 3,
  this.id = "calendar",
  this.locale = "en-us",
  this.selected = data.selected,
  this.startDay = data.startDay,
  this.startMonth = data.startMonth,
  this.startYear = data.startYear,
  this.startElement = null,
  this.startDate = function() {
    var _this = this;
    return new Date(_this.startYear, _this.startMonth, _this.startDay);
  },
  this.startPlaceholder = this.startDate().toLocaleString(this.locale, {
    month: "short",
    day: "numeric"
  }),
  this.endDay = data.endDay,
  this.endMonth = data.endMonth,
  this.endYear = data.endYear,
  this.endElement = null,
  this.endDate = function() {
    var _this = this;
    return new Date(_this.endYear, _this.endMonth, _this.endDay);
  },
  this.endPlaceholder = this.endDate().toLocaleString(this.locale, {
    month: "short",
    day: "numeric"
  })
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
  this.elements.calendarContainer.addEventListener("click", this.selectDate);
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
  // console.log(e.target);
  var selected,
      monthName,
      rentState = datepicker.state.rentDates.selected;
  if (e.target.classList.contains("month-day")) {
    selected = JSON.parse(e.target.dataset.day);
    // monthName = datepicker.calendar.monthNames[selected.month].slice(0, 3) + selected.day;
  }
  console.log(selected);
  // datepicker.setRentDate(rentState, monthName, selected.day, selected.month, selected.year, e.target);
  // console.log(datepicker.state.rentDates[rentState]);
}

/**
*	 Hide datepicker if clicked outside and remove event
*/
Datepicker.prototype.hideDatepicker = function(e) {
  e.preventDefault();
  if (e.target.classList.contains("js-date-btn") || e.target.closest(".dropdown-calendar-wrap")) {
    return;
  }
  datepicker.elements.datepicker.classList.add("is-hidden");
  datepicker.state.isDatepickerActive = false;
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
  this.elements.datepicker.classList.add("date-" + selected);
  if (this.state.rentDates.selected) {
    this.elements.datepicker.classList.remove("date-" + this.state.rentDates.selected);
  }
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
  if (!this.state.isDatepickerActive || this.state.rentDates.hasOwnProperty('selected') && this.state.rentDates.selected !== selected) {
    this.elements.datepicker.classList.remove("is-hidden");
    document.body.addEventListener("click", datepicker.hideDatepicker);
    // First indicateDate, then set state!
    this.indicateDate(selected);
    this.state.rentDates.selected = selected;
    this.state.isDatepickerActive = true;
    this.setRenderDates();
    this.renewDatepicker();
    this.setRenderDates();
  }
}

/**
* Sets element content according to received state data
*/
Datepicker.prototype.setRentDate = function() {
  this.elements.rentBtn.start.textContent = this.state.rentDates.startPlaceholder;
  this.elements.rentBtn.end.textContent = this.state.rentDates.endPlaceholder;
  // if (year) {
  //   this.state.rentDates[date].year = year;
  // }
  // if (el) {
  //   this.state.rentDates[date].el = el;
  // }
  // if (date === "end") {
  //   this.state.rentDates[date].startDay = this.state.rentDates["start"].day;
  // }
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
