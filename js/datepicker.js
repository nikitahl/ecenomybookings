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
*	 Datepicker Constructor
*/
var Datepicker = function() {
  this.state = {
    isDatepickerActive: false,
    isDatepickerInit: false,
    rentState: null,
    rentDates: {
      start: {
        day: null,
        month: null,
        year: null,
        date: function() {
          return new Date(this.year, this.month, this.day);
        }
      },
      end: {
        day: null,
        month: null,
        year: null,
        date: function() {
          return new Date(this.year, this.month, this.day);
        }
      }
    },
    initialMonth: null,
    initalYear: null,
    monthsToShow: 3,
    windowWidth: window.innerWidth
  };
  this.element = {
    documentBody: document.querySelector("body"),
    headerSearchForm: document.querySelector("#datepicker")
  };
  this.calendar = new CalendarConstructor();
  this.initialDate = {
    locale: "en-us",
    day: this.calendar.date.getDate(),
    month: this.calendar.date.getMonth(),
    year: this.calendar.date.getFullYear(),
    name: this.calendar.date.toLocaleString(this.locale, {
      month: "short",
      day: "numeric"
    })
  };
};

Datepicker.prototype.createDatepickerBase = function() {
  var datepickerWrapper = document.createElement("div");
  datepickerWrapper.classList.add("dropdown-calendar-wrap", "dropdown-content", "is-hidden");
  datepickerWrapper.innerHTML += "<div class='prev-month js-months-nav' data-nav-dir='prev'></div>";
  datepickerWrapper.innerHTML += "<div class='next-month js-months-nav' data-nav-dir='next'></div>";
  datepickerWrapper.innerHTML += "<div class='dropdown-calendar' id='calendar'></div>";
  this.element.headerSearchForm.appendChild(datepickerWrapper);
  this.state.isDatepickerInit = true;
}

Datepicker.prototype.renewDatepicker = function(id, count, month, year) {
  while (this.element.calendarContainer.firstChild) {
    this.element.calendarContainer.removeChild(this.element.calendarContainer.firstChild);
  }
  if (this.state.isPrevButtonActive && month === this.initialDate.month && year === this.initialDate.year) {
    this.element.datepickerPrev.classList.add("is-hidden");
    this.state.isPrevButtonActive = false;
  } else {
    this.element.datepickerPrev.classList.remove("is-hidden");
    this.state.isPrevButtonActive = true;
  }
  this.calendar.renderCalendar(id, count, month, year);
}

Datepicker.prototype.calendarNavigation = function(e) {
  if (e.target.dataset.navDir === "next") {
    if (this.state.initialMonth < 11) {
      this.state.initialMonth++;
    } else {
      this.state.initialMonth = 0;
      this.state.initialYear++;
    }
  } else if (e.target.dataset.navDir === "prev") {
    if (this.state.initialMonth > 0) {
      this.state.initialMonth--;
    } else {
      this.state.initialMonth = 11;
      this.state.initialYear--;
    }
  }
  this.renewDatepicker("calendar", this.state.monthsToShow, this.state.initialMonth, this.state.initialYear);
}

Datepicker.prototype.selectDate = function(e) {
  var selected,
      rentState = datepicker.state.rentState;
  if (e.target.classList.contains("month-day")) {
    selected = JSON.parse(e.target.dataset.day);
    console.log(selected);
  }
  console.log(rentState);

  datepicker.setRentDate(rentState, 'Mth'+selected.day, selected.day, selected.month, selected.year);
  console.log(datepicker.state.rentDates[rentState]);
  // datepicker.setRentDate(
  //   datepicker.state.rentState,
  //   datepicker.state.rentDates[datepicker.state.rentState].month,
  //   datepicker.state.rentDates[datepicker.state.rentState].year,
  // );
}

Datepicker.prototype.createDatepickerEvents = function() {
  var datepickerNavBtns = this.element.calendarNavButton,
      calendar = this.element.calendarContainer;
  for (var i in datepickerNavBtns) {
    if (datepickerNavBtns.hasOwnProperty(i)) {
      datepickerNavBtns[i].addEventListener("click", this.calendarNavigation.bind(this));
      // hide "previous" button for inital calendar
      if (datepickerNavBtns[i].getAttribute("data-nav-dir") === "prev") {
        this.element.datepickerPrev = datepickerNavBtns[i];
        this.element.datepickerPrev.classList.add("is-hidden");
        this.state.isPrevButtonActive = false;
      } else {
        this.element.datepickerNext = datepickerNavBtns[i];
      }
    }
  }
  calendar.addEventListener("click", this.selectDate);
}

Datepicker.prototype.setInitialDatepickerState = function() {
  this.state.initialMonth = this.initialDate.month;
  this.state.initialYear = this.initialDate.year;
}

Datepicker.prototype.constructDatepicker = function() {
  this.createDatepickerBase();
  this.setInitialDatepickerState();
  this.calendar.renderCalendar("calendar", this.state.monthsToShow, this.state.initialMonth, this.state.initialYear);
  // make generated elements available for manipulation
  this.element.datepicker = document.querySelector(".dropdown-calendar-wrap");
  this.element.calendarNavButton = document.querySelectorAll(".js-months-nav");
  this.element.calendarContainer = document.querySelector(".dropdown-calendar");
  this.createDatepickerEvents();
}

Datepicker.prototype.hideDatepicker = function(e) {
  e.preventDefault();
  if (e.target.classList.contains("js-date-btn") || e.target.closest(".dropdown-calendar-wrap")) {
    return;
  }
  datepicker.element.datepicker.classList.add("is-hidden");
  datepicker.state.isDatepickerActive = false;
  document.body.removeEventListener("click", datepicker.hideDatepicker);
}

Datepicker.prototype.openDatepicker = function(toShow, toHide) {
  this.element.datepicker.classList.add("date-" + toShow);
  this.element.datepicker.classList.remove("date-" + toHide);
}

Datepicker.prototype.highlightRentDates = function(date) {
  console.log(date);
  // this.renewDatepicker("calendar", this.state.monthsToShow, date.month, date.year);
}

/**
*	 Handle datepicker depending on clicked control
*/
Datepicker.prototype.handleDatepicker = function(toShow, toHide) {
  if (!this.state.isDatepickerInit) {
    this.constructDatepicker();
  }
  if (!this.state.isDatepickerActive) {
    this.element.datepicker.classList.remove("is-hidden");
    this.state.isDatepickerActive = true;
    document.body.addEventListener("click", datepicker.hideDatepicker);
  }
  this.state.rentState = toShow;
  this.openDatepicker(toShow, toHide);
  this.highlightRentDates(this.state.rentDates[toShow]);
  // this.resetDatepicker();
}

Datepicker.prototype.setRentDate = function(date, name, day, month, year) {
  this.state.rentDates[date].day = day;
  this.state.rentDates[date].month = month;
  this.element.rentBtn[date].textContent = name;
  if (year) {
    this.state.rentDates[date].year = year;
    console.log(year);
  }
}

Datepicker.prototype.setInitialRentDates = function(date) {
  var locale = this.initialDate.locale;
  var returnDay = this.initialDate.day,
      returnMonth = this.initialDate.month,
      returnYear = this.initialDate.year,
      returnMonthDayCount = new Date(returnYear, returnMonth + 1, 0).getDate();
  for (var i = 0; i < 7; i++) {
    if (returnDay < returnMonthDayCount) {
      returnDay++;
    } else {
      returnDay = 1;
      returnMonth++;
      returnMonthDayCount = new Date(returnYear, returnMonth + 1, 0).getDate();
      if (returnMonth === 11) {
        returnMonth = 0;
        returnYear++;
        returnMonthDayCount = new Date(returnYear, returnMonth + 1, 0).getDate();
      }
    }
  }
  var returnDate = new Date(returnYear, returnMonth, returnDay),
      returnMonthName = returnDate.toLocaleString(locale, { month: "short", day: "numeric" });

  this.setRentDate('end', returnMonthName, returnDay, returnMonth, returnYear);
  this.setRentDate('start', this.initialDate.name, this.initialDate.day, this.initialDate.month, this.initialDate.year);
}

/**
* Assign event to form controls (header form buttons), set initial rent dates
*/
Datepicker.prototype.initiateDatepicker = function() {
  var dateButton = document.querySelectorAll(".js-date-btn");
  console.log(dateButton);
  this.element.rentBtn = {};
  for (var i in dateButton) {
    if (dateButton.hasOwnProperty(i)) {
      if (dateButton[i].dataset.tripDate === "start") {
        this.element.rentBtn.start = dateButton[i];
        dateButton[i].addEventListener("click", this.handleDatepicker.bind(this, "start", "end"));
      } else if (dateButton[i].dataset.tripDate === "end") {
        this.element.rentBtn.end = dateButton[i];
        dateButton[i].addEventListener("click", this.handleDatepicker.bind(this, "end", "start"));
      }
    }
  }
  this.setInitialRentDates();
}

var datepicker = new Datepicker();
datepicker.initiateDatepicker();
