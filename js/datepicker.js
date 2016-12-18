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
*   Rent Data constructor
*   @param object
*/
var RentData = function(data) {
  this.locale = "en-us",
  this.day = data.day,
  this.month = data.month,
  this.year = data.year,
  this.el = null,
  this.id = "calendar",
  this.count = 3,
  this.trip = data.trip,
  this.date = function() {
    var _this = this;
    return new Date(_this.year, _this.month, _this.day);
  },
  this.placeholder = this.date().toLocaleString(this.locale, {
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
  this.element = {
    documentBody: document.querySelector("body"),
    headerSearchForm: document.querySelector("#datepicker"),
    nav: document.querySelectorAll(".js-date-btn")
  };
  this.state = {
    initialMonth: this.initialDate.month,
    initialYear: this.initialDate.year,
    isDatepickerActive: false,
    isDatepickerInit: false,
    rentState: null,
    rentDates: {}
  };
};

/**
*	 Create datepicker wrapper with elements, attach to DOM
*/
Datepicker.prototype.createDatepickerBase = function() {
  var datepickerWrapper = document.createElement("div");
  datepickerWrapper.classList.add("dropdown-calendar-wrap", "dropdown-content", "is-hidden");
  datepickerWrapper.innerHTML += "<div class='prev-month js-months-nav' data-nav-dir='prev'></div>";
  datepickerWrapper.innerHTML += "<div class='next-month js-months-nav' data-nav-dir='next'></div>";
  datepickerWrapper.innerHTML += "<div class='dropdown-calendar' id='calendar'></div>";
  this.element.headerSearchForm.appendChild(datepickerWrapper);
}

/**
*	 Display datepicker Previous button depending on visible month
*  @param string
*  @param string
*/
Datepicker.prototype.togglePrevButton = function(month, year) {
  if (this.state.isPrevButtonActive && month === this.initialDate.month && year === this.initialDate.year) {
    this.element.datepickerPrev.classList.add("is-hidden");
    this.state.isPrevButtonActive = false;
  } else {
    this.element.datepickerPrev.classList.remove("is-hidden");
    this.state.isPrevButtonActive = true;
  }
}

/**
*	 Renew datepicker accordingly depending on navigation click
*  @param string
*  @param string
*/
Datepicker.prototype.renewDatepicker = function(month, year) {
  // clear HTML
  while (this.element.calendarContainer.firstChild) {
    this.element.calendarContainer.removeChild(this.element.calendarContainer.firstChild);
  }
  this.togglePrevButton(month, year);
  this.calendar.renderCalendar(this.state.rentDates[this.state.rentState]);
}

/**
*	 Handle click event on datepicker navigation
*/
Datepicker.prototype.handleDatepickerNav = function(e) {
  console.log('handleDatepickerNav', this.state.rentDates[this.state.rentState]);
  var rentDate = this.state.rentDates[this.state.rentState];
  if (e.target.dataset.navDir === "next") {
    if (rentDate.month < 11) {
      rentDate.month++;
    } else {
      rentDate.month = 0;
      rentDate.year++;
    }
  } else if (e.target.dataset.navDir === "prev") {
    if (rentDate.month > 0) {
      rentDate.month--;
    } else {
      rentDate.month = 11;
      rentDate.year--;
    }
  }
  this.renewDatepicker(rentDate.month, rentDate.year);
}

/**
*	 Handle click event on calendar day
*/
Datepicker.prototype.selectDate = function(e) {
  console.log(e.target);
  var selected,
      monthName,
      rentState = datepicker.state.rentState;
  if (e.target.classList.contains("month-day")) {
    selected = JSON.parse(e.target.dataset.day);
    monthName = datepicker.calendar.monthNames[selected.month].slice(0, 3) + selected.day;
  }
  // datepicker.setRentDate(rentState, monthName, selected.day, selected.month, selected.year, e.target);
  // console.log(datepicker.state.rentDates[rentState]);
}

/**
*	 Add events to datepicker elements
*/
Datepicker.prototype.createDatepickerEvents = function() {
  var navBtns = this.element.calendarNavButton;
  for (var i in navBtns) {
    if (navBtns.hasOwnProperty(i)) {
      navBtns[i].addEventListener("click", this.handleDatepickerNav.bind(this));
      if (navBtns[i].dataset.navDir === "prev") {
        this.element.datepickerPrev = navBtns[i];
        this.element.datepickerPrev.classList.add("is-hidden");
        this.state.isPrevButtonActive = false;
      } else {
        this.element.datepickerNext = navBtns[i];
      }
    }
  }
  this.element.calendarContainer.addEventListener("click", this.selectDate);
}

/**
*	 Call methods to construct datepicker
*/
Datepicker.prototype.constructDatepicker = function(toShow) {
  this.createDatepickerBase();
  this.calendar.renderCalendar(this.state.rentDates[toShow]);
  this.element.datepicker = document.querySelector(".dropdown-calendar-wrap");
  this.element.calendarNavButton = document.querySelectorAll(".js-months-nav");
  this.element.calendarContainer = document.querySelector(".dropdown-calendar");
  this.createDatepickerEvents();
}

/**
*	 Hide datepicker if clicked outside and remove event
*/
Datepicker.prototype.hideDatepicker = function(e) {
  e.preventDefault();
  if (e.target.classList.contains("js-date-btn") || e.target.closest(".dropdown-calendar-wrap")) {
    return;
  }
  datepicker.element.datepicker.classList.add("is-hidden");
  datepicker.state.isDatepickerActive = false;
  document.body.removeEventListener("click", datepicker.hideDatepicker);
}

/**
*	 Add/remove class to indicate clicked button
*  @param string
*  @param string
*/
Datepicker.prototype.indicateDate = function(toShow, toHide) {
  this.element.datepicker.classList.add("date-" + toShow);
  this.element.datepicker.classList.remove("date-" + toHide);
}

/**
*	 Handle datepicker depending on clicked control
*  @param string
*  @param string
*/
Datepicker.prototype.handleDatepicker = function(toShow, toHide) {
  console.log(arguments);
  if (!this.state.isDatepickerInit) {
    this.constructDatepicker(toShow);
    this.state.isDatepickerInit = true;
  }
  if (!this.state.isDatepickerActive) {
    this.element.datepicker.classList.remove("is-hidden");
    document.body.addEventListener("click", datepicker.hideDatepicker);
    this.state.isDatepickerActive = true;
  }
  // TODO remove this.state.rentState if unused
  this.state.rentState = toShow;
  this.indicateDate(toShow, toHide);
}

/**
* Sets element content according to received state data
* @param object
*/
Datepicker.prototype.setRentDate = function(data) {
  // console.log(data);
  this.element.rentBtn[data.trip].textContent = data.placeholder;
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
* Creates objects for rent dates in state,
* calls setRentDate method for both states
*/
Datepicker.prototype.setInitialRentDates = function() {
  this.state.rentDates.start = new RentData({
    day: this.initialDate.day,
    month: this.initialDate.month,
    year: this.initialDate.year,
    trip: "start"
  });

  var endState = {};
  endState.day = this.initialDate.day;
  endState.month = this.initialDate.month;
  endState.year = this.initialDate.year;
  endState.trip = "end";
  var returnMonthDayCount = new Date(endState.year, endState.month + 1, 0).getDate();

  for (var i = 0; i < 7; i++) {
    if (endState.day < returnMonthDayCount) {
      endState.day++;
    } else {
      endState.day = 1;
      endState.month++;
      returnMonthDayCount = new Date(endState.year, endState.month + 1, 0).getDate();
      if (endState.month > 11) {
        endState.month = 0;
        endState.year++;
        returnMonthDayCount = new Date(endState.year, endState.month + 1, 0).getDate();
      }
    }
  }

  this.state.rentDates.end = new RentData(endState);
  this.setRentDate(this.state.rentDates.start);
  this.setRentDate(this.state.rentDates.end);
}

/**
* Assign event to form controls (header form buttons), set initial rent dates
*/
Datepicker.prototype.initiateDatepicker = function() {
  var dateButton = Array.prototype.slice.call(this.element.nav);
  this.element.rentBtn = {};
  dateButton.forEach(function(button) {
    if (button.dataset.tripDate === "start") {
      this.element.rentBtn.start = button;
      button.addEventListener("click", this.handleDatepicker.bind(this, "start", "end"));
    } else if (button.dataset.tripDate === "end") {
      this.element.rentBtn.end = button;
      button.addEventListener("click", this.handleDatepicker.bind(this, "end", "start"));
    }
  }, this);
  this.setInitialRentDates();
}

var datepicker = new Datepicker();
datepicker.initiateDatepicker();
