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
	var monthName;
	this.monthNames.forEach(function(name, i) {
		if (i === monthNumber) {
			monthName = name;
		}
	});
	return monthName;
}

/**
*	Construct HTML with month name and year
* @param monthData object
*	@return HTML with month name and year
*/
CalendarConstructor.prototype.createMonthNameWrap = function(monthData) {
	var div = this.createNewElement("div", "calendar-month-name");
	var span = this.createNewElement("span", "month-name");
	span.innerHTML = "<b>" + this.getMonthName(monthData.monthToRender) + "</b> " + monthData.yearToRender;
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
	this.daysShort.forEach(function(day) {
		tr.innerHTML += "<th>" + day + "</th>";
	});
	thead.appendChild(tr);
	return thead;
}

/**
*	Store and parse month data
* @param month number, year number
*	@return monthData object
*/
CalendarConstructor.prototype.getMonthDays = function(month, year) {
	var monthDays = {
		// Number of days in current month
		monthDaysCount: function() {
			return new Date(year, month + 1, 0).getDate();
  	},
		// Get week day for every day in the month 0 to 6.
		weekDay: function(d) {
			var dayNum = new Date(year, month, d);
			return dayNum.getDay();
		}
	};
	return monthDays;
};

/**
*	Get HTML day template for table
* @param string
* @param JSON string
* @param string
*	@return string
*/
CalendarConstructor.prototype.getDayTemplate = function(day, data, type) {
	return "<td class='month-day " + type + "' data-day='" + data + "'>" + day + "</td>";
}

/**
*	Distribute month days to the according table cells if start date is selected
* @param monthData object
*	@return HTML
*/
CalendarConstructor.prototype.distributeStartDays = function(data, tbody) {
	var day = 1,
			startDay = data.startDay,
			startMonth = data.startMonth,
			startYear = data.startYear,
			monthToRender = data.monthToRender,
			yearToRender = data.yearToRender,
			monthDays = this.getMonthDays(monthToRender, yearToRender),
			dayCount = monthDays.monthDaysCount();

	while ( day < dayCount ) {
		var html = "",
				weekRow = document.createElement("tr");
		for ( var i = 0; i < 7; i++ ) {
			if ( monthDays.weekDay(day) === i ) {
				var dayObj = {};
				dayObj.day = day;
				dayObj.month = data.monthToRender;
				dayObj.year = data.yearToRender;
				var dayData = JSON.stringify(dayObj);
				if ( day < this.currentDay && monthToRender === this.currentMonth && yearToRender === this.currentYear) {
					html += "<td class='past-day'>" + day + "</td>";
				} else if (day === startDay && monthToRender === startMonth && yearToRender === startYear) {
					html += this.getDayTemplate(day, dayData, 'start-day');
				} else {
					html += this.getDayTemplate(day, dayData, '');
				}
				// increment day counter
				day++;
			} else {
				html += "<td></td>";
			}

			if ( day > dayCount ) {
				break;
			}
		}
		weekRow.innerHTML = html;
		tbody.appendChild(weekRow);
	}
}

/**
*	Distribute month days to the according table cells if end date is selected
* @param monthData object
*	@return HTML
*/
CalendarConstructor.prototype.distributeEndDays = function(data, tbody) {
	var day = 1,
			startDay = data.startDay,
			startMonth = data.startMonth,
			startYear = data.startYear,
			endDay = data.endDay,
			endMonth = data.endMonth,
			endYear = data.endYear,
			monthToRender = data.monthToRender,
			yearToRender = data.yearToRender,
			monthDays = this.getMonthDays(monthToRender, yearToRender),
			dayCount = monthDays.monthDaysCount();

	while ( day < dayCount ) {
		var html = "",
				weekRow = document.createElement("tr");
		for ( var i = 0; i < 7; i++ ) {
			if ( monthDays.weekDay(day) === i ) {
				var dayObj = {};
				dayObj.day = day;
				dayObj.month = data.monthToRender;
				dayObj.year = data.yearToRender;
				var dayData = JSON.stringify(dayObj);
				if (day < startDay && monthToRender === startMonth && yearToRender === startYear ||
					monthToRender < startMonth && yearToRender === startYear ||
					monthToRender > startMonth && yearToRender < startYear) {
					html += "<td class='past-day'>" + day + "</td>";
				} else if (monthToRender === startMonth && yearToRender === startYear) {
					if (day === startDay) {
						html += this.getDayTemplate(day, dayData, 'start-day');
					} else if (startMonth === endMonth && startYear === endYear) {
						if (day === endDay) {
							html += this.getDayTemplate(day, dayData, 'end-day');
						} else if (day > startDay && day < endDay) {
							html += this.getDayTemplate(day, dayData, 'selected-day');
						} else {
							html += this.getDayTemplate(day, dayData, '');
						}
					} else {
						html += this.getDayTemplate(day, dayData, 'selected-day');
					}
				} else if (monthToRender === endMonth && yearToRender === endYear) {
					if (day === endDay) {
						html += this.getDayTemplate(day, dayData, 'end-day');
					} else if (day < endDay) {
						html += this.getDayTemplate(day, dayData, 'selected-day');
					} else {
						html += this.getDayTemplate(day, dayData, '');
					}
				} else if (yearToRender === startYear && yearToRender === endYear && monthToRender > startMonth && monthToRender < endMonth ||
					yearToRender === startYear && yearToRender < endYear && monthToRender > startMonth ||
					yearToRender > startYear && yearToRender === endYear && monthToRender < endMonth ||
					yearToRender > startYear && yearToRender < endYear) {
						html += this.getDayTemplate(day, dayData, 'selected-day');
				} else {
					html += this.getDayTemplate(day, dayData, '');
				}

				// increment day counter
				day++;
			} else {
				html += "<td></td>";
			}

			if ( day > dayCount ) {
				break;
			}
		}
		weekRow.innerHTML = html;
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
	if ( monthData.selected === "start" ) {
		this.distributeStartDays(monthData, tbody);
	} else {
		this.distributeEndDays(monthData, tbody);
	}
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
*	Update monthData object by incrementing month and year accordingly
* @param Object with month data
*	@return monthData Updated monthData object
*/
CalendarConstructor.prototype.updateMonthData = function(monthData) {
	if ( monthData.renderIteration ) {
		if (monthData.monthToRender < 11) {
			monthData.monthToRender = ++monthData.monthToRender;
		} else {
			monthData.monthToRender = 0;
			monthData.yearToRender = ++monthData.yearToRender;
		}
	} else {
		monthData.monthToRender = monthData.monthToRender;
		monthData.yearToRender = monthData.yearToRender;
	}
	return monthData;
}

/**
*	Create wrapper element for calendar month
* @param data object
*	@return HTML element
*/
CalendarConstructor.prototype.createMonthWrapper = function(data) {
	var div = this.createNewElement("div", "calendar-wrap");
	var monthData = this.updateMonthData(data);
	div.appendChild(this.createMonthNameWrap(monthData));
	div.appendChild(this.createMonthTableWrap(monthData));
	return div;
}

/**
*	Render HTML for calendar to page
* @param object
*/
CalendarConstructor.prototype.renderCalendar = function(data) {
	var month = data.monthToRender;
	var year = data.yearToRender;
	var calendarContainer = document.getElementById(data.id);
	for(var i = 0; i < data.count; i++) {
		data.renderIteration = i;
		calendarContainer.appendChild(this.createMonthWrapper(data));
	}
	data.monthToRender = month;
	data.yearToRender = year;
}
