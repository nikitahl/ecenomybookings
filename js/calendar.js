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
*	Distribute month days to the according table cells if start date is selected
* @param monthData object
*	@return HTML
*/
CalendarConstructor.prototype.distributeStartDays = function(data, tbody) {
	var monthDays = this.getMonthDays(data.monthToRender, data.yearToRender),
			day = 1;
	var dayCount = monthDays.monthDaysCount();
	while ( day < dayCount ) {
		var weekRow = document.createElement("tr");
		for ( var i = 0; i < 7; i++ ) {
			if ( monthDays.weekDay(day) === i ) {
				var dayObj = {};
				dayObj.day = day;
				dayObj.month = data.monthToRender;
				dayObj.year = data.yearToRender;
				var dayData = JSON.stringify(dayObj);
				if ( data.monthToRender === this.currentMonth) {
					// distribute days for current month
					if ( day < this.currentDay ) {
						weekRow.innerHTML += "<td class='past-day'>" + day + "</td>";
					} else {
						if (day === data.startDay) {
							weekRow.innerHTML += "<td class='start-day' data-day='" + dayData + "'>" + day + "</td>";
						} else {
							weekRow.innerHTML += "<td class='month-day' data-day='" + dayData + "'>" + day + "</td>";
						}
					}
				} else {
					// distribute days for next months
					if (day === data.startDay && data.monthToRender === data.startMonth) {
						weekRow.innerHTML += "<td class='start-day' data-day='" + dayData + "'>" + day + "</td>";
					} else {
						weekRow.innerHTML += "<td class='month-day' data-day='" + dayData + "'>" + day + "</td>";
					}
				}
				// increment day counter
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
*	Distribute month days to the according table cells if end date is selected
* @param monthData object
*	@return HTML
*/
CalendarConstructor.prototype.distributeEndDays = function(data, tbody) {
	var monthDays = this.getMonthDays(data.monthToRender, data.yearToRender),
			day = 1;
	var dayCount = monthDays.monthDaysCount();
	while ( day < dayCount ) {
		var weekRow = document.createElement("tr");
		for ( var i = 0; i < 7; i++ ) {
			if ( monthDays.weekDay(day) === i ) {
				var dayObj = {};
				dayObj.day = day;
				dayObj.month = data.monthToRender;
				dayObj.year = data.yearToRender;
				var dayData = JSON.stringify(dayObj);
				if ( data.monthToRender === this.currentMonth) {
					// distribute days for current month
					if ( day < data.startDay ) {
						weekRow.innerHTML += "<td class='past-day'>" + day + "</td>";
					} else {
						if (day === data.startDay && data.monthToRender === data.startMonth) {
							weekRow.innerHTML += "<td class='start-day' data-day='" + dayData + "'>" + day + "</td>";
						} else if (
							day > data.startDay && data.monthToRender === data.startMonth ||
							day < data.endDay && data.monthToRender === data.endMonth ||
							data.monthToRender > data.startMonth && data.yearToRender === data.startYear && data.monthToRender < data.endMonth && data.yearToRender === data.endYear ||
							data.monthToRender < data.startMonth && data.yearToRender < data.startYear && data.monthToRender < data.endMonth && data.yearToRender === data.endYear
							) {
							weekRow.innerHTML += "<td class='selected-day' data-day='" + dayData + "'>" + day + "</td>";
						} else if (day === data.endDay && data.monthToRender === data.endMonth) {
							weekRow.innerHTML += "<td class='end-day' data-day='" + dayData + "'>" + day + "</td>";
						} else {
							weekRow.innerHTML += "<td class='month-day' data-day='" + dayData + "'>" + day + "</td>";
						}
					}
				} else {
					// distribute days for next months
					if (day === data.startDay && data.monthToRender === data.startMonth) {
						weekRow.innerHTML += "<td class='start-day' data-day='" + dayData + "'>" + day + "</td>";
					} else if (
						day > data.startDay && data.monthToRender === data.startMonth ||
						day < data.endDay && data.monthToRender === data.endMonth ||
						data.monthToRender > data.startMonth && data.yearToRender === data.startYear && data.monthToRender < data.endMonth && data.yearToRender === data.endYear ||
						data.monthToRender < data.startMonth && data.yearToRender < data.startYear && data.monthToRender < data.endMonth && data.yearToRender === data.endYear
					) {
						weekRow.innerHTML += "<td class='selected-day' data-day='" + dayData + "'>" + day + "</td>";
					} else if (day === data.endDay && data.monthToRender === data.endMonth) {
						weekRow.innerHTML += "<td class='end-day' data-day='" + dayData + "'>" + day + "</td>";
					} else {
						weekRow.innerHTML += "<td class='month-day' data-day='" + dayData + "'>" + day + "</td>";
					}
				}
				// increment day counter
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
CalendarConstructor.prototype.updateMonthData = function(monthData, month, year) {
	if ( monthData.renderIteration ) {
		console.log('iteration > 0');
		if (monthData.monthToRender < 11) {
			monthData.monthToRender = ++monthData.monthToRender;
		} else {
			monthData.monthToRender = 0;
			monthData.yearToRender = ++year;
		}
	} else {
		console.log('iteration < 0');
		monthData.monthToRender = month;
		monthData.yearToRender = year;
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
	var monthData;
	// if ( data.hasOwnProperty("monthToRender") && data.monthToRender !== null ) {
	// 	console.log('hasOwnProperty("monthToRender")');
	// 	monthData = this.updateMonthData(data, data.monthToRender, data.yearToRender);
	// } else
	if ( data.selected === "start" ) {
		monthData = this.updateMonthData(data, data.startMonth, data.startYear);
	} else {
		monthData = this.updateMonthData(data, data.endMonth, data.endYear);
	}
	div.appendChild(this.createMonthNameWrap(monthData));
	div.appendChild(this.createMonthTableWrap(monthData));
	return div;
}

/**
*	Render HTML for calendar to page
* @param object
*/
CalendarConstructor.prototype.renderCalendar = function(data) {
	var calendarContainer = document.getElementById(data.id);
	for(var i = 0; i < data.count; i++) {
		data.renderIteration = i;
		calendarContainer.appendChild(this.createMonthWrapper(data));
	}
}
