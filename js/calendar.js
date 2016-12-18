"use strict";

/**
*	Calendar constructor
*/
var CalendarConstructor = function() {
	this.date = new Date();
	this.currentYear = this.date.getFullYear();
	this.currentMonth = this.date.getMonth();
  this.currentDay = this.date.getDate();
	this.monthData = null;
	this.daysShort = ["S", "M", "T", "W", "T", "F", "S"];
	this.monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
};

/**
*	Create new HTML element with a class
* @param element Element tag name
* @param className Element class name
*	@return HTML element
*/
CalendarConstructor.prototype.createNewElement = function(element, className) {
	var el = document.createElement(element);
	el.classList.add(className);
	return el;
}

/**
*	Get the name of the month
* @param monthNumber Number of the month (0 - 11)
*	@return String name of the month
*/
CalendarConstructor.prototype.getMonthName = function(monthNumber) {
	for (var i = 0; i < this.monthNames.length; i++) {
		if ( i === monthNumber ) {
			return this.monthNames[i];
		}
	}
}

/**
*	Construct HTML with month name and year
* @param monthData object
*	@return HTML with month name and year
*/
CalendarConstructor.prototype.createMonthNameWrap = function(monthData) {
	var div = this.createNewElement("div", "calendar-month-name");
	var span = this.createNewElement("span", "month-name");
	span.innerHTML = "<b>" + this.getMonthName(monthData.month) + "</b> " + monthData.year;
	div.appendChild(span);
	return div;
}

/**
*	Construct HTML thead element
*	@return HTML
*/
CalendarConstructor.prototype.createMonthTableHead = function() {
	var thead = this.createNewElement("thead", "calendar-header");
	var tr = this.createNewElement("tr", "calendar-row");
	for	( var i = 0; i < this.daysShort.length; i++ ) {
		tr.innerHTML += "<th>" + this.daysShort[i] + "</th>";
	}
	thead.appendChild(tr);
	return thead;
}

/**
*	Distribute month days to the according table cells
* @param monthData object
*	@return HTML
*/
CalendarConstructor.prototype.distributeDays = function(data, tbody) {
	var monthData = data;
	var day = 1;
	var dayCount = monthData.monthDaysCount();
	while ( day < dayCount ) {
		var weekRow = document.createElement("tr");
		for (var i = 0; i < 7; i++) {
			if (monthData.weekDay(day) === i) {
        // var dayData = monthData;
        // dayData.day = day;
        // var obj = JSON.stringify(dayData);
				// TODO use stringified object above
				var obj = "data";
        if ( monthData.month === this.date.getMonth() ) {
					// console.log(monthData);
          if ( day < this.currentDay ) {
            weekRow.innerHTML += "<td class='past-day'>" + day + "</td>";
          } else if ( day === monthData.day ) {
						weekRow.innerHTML += "<td class='" + monthData.trip + "-day'>" + day + "</td>";
						// this.monthData.el = document.querySelector("." + monthData.trip + "-day");
					} else {
						var dayClass = "month-day";
						if (monthData.trip === "end") {
							dayClass += " selected-day"
						}
            weekRow.innerHTML += "<td class='" + dayClass + "' data-day='" + obj + "'>" + day + "</td>";
          }
        } else {
          weekRow.innerHTML += "<td class='month-day' data-day='" + obj + "'>" + day + "</td>";
        }
				day++;
			} else {
				weekRow.innerHTML += "<td></td>";
			}
			if ( day > dayCount ) {
				break;
			}
		}
		tbody.appendChild(weekRow);
	}
}

/**
*	Construct HTML tbody element
* @param monthData object
*	@return HTML
*/
CalendarConstructor.prototype.createMonthTableBody = function(monthData) {
	var tbody = this.createNewElement("tbody", "calendar-body");
	this.distributeDays(monthData, tbody);
	return tbody;
}

/**
*	Construct HTML table element
* @param monthData object
*	@return HTML table element inside wrapper element
*/
CalendarConstructor.prototype.createMonthTableWrap = function(monthData) {
	var div = this.createNewElement("div", "calendar-month");
	var table = this.createNewElement("table", "calendar");
	table.appendChild(this.createMonthTableHead());
	table.appendChild(this.createMonthTableBody(monthData));
	div.appendChild(table);
	return div;
}

/**
*	Create wrapper element for calendar month
* @param monthData object
*	@return HTML element
*/
CalendarConstructor.prototype.createMonthWrapper = function(monthData) {
	var div = this.createNewElement("div", "calendar-wrap");
	div.appendChild(this.createMonthNameWrap(monthData));
	div.appendChild(this.createMonthTableWrap(monthData));
	return div;
}

/**
*	Update monthData object by incrementing month and year accordingly
* @param monthData, counter Object with month data, loop counter
*	@return monthData Updated monthData object
*/
CalendarConstructor.prototype.updateMonthData = function(monthData, counter) {
	if (counter !== 0) {
		if (monthData.month < 11) {
			monthData.month++
		} else {
			monthData.month = 0;
			monthData.year++;
		}
	}
	return monthData;
}

/**
*	Store and parse month data
* @param data object from datepicker
*	@return monthData object
*/
CalendarConstructor.prototype.getMonthData = function(data) {
	var monthData = {
		// Number of days in current month
		monthDaysCount: function() {
			var _this = this;
			var daysCount = new Date(_this.year, _this.month + 1, 0).getDate();
			return daysCount;
  	},
		// Get week day for every day in the month 0 to 6.
		weekDay: function(d) {
			var _this = this;
			var dayNum = new Date(_this.year, _this.month, d);
			return dayNum.getDay();
		}
	};
	var newMonthData = Object.assign(monthData, data);
	return newMonthData;
};

/**
*	Render HTML for calendar to page
*/
CalendarConstructor.prototype.renderCalendar = function(data) {
	this.monthData = this.getMonthData(data);
	var calendarContainer = document.getElementById(this.monthData.id);
	for(var i = 0; i < this.monthData.count; i++) {
		var updatedData = this.updateMonthData(this.monthData, i);
		calendarContainer.appendChild(this.createMonthWrapper(updatedData));
	}
}
