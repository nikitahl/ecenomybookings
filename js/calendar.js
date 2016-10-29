'use strict';

/**
*	Calendar constructor
*/
var CalendarConstructor = function() {
	this.date = new Date();
	this.currentYear = this.date.getFullYear();
	this.currentMonth = this.date.getMonth();
  this.currentDay = this.date.getDate();
	this.startMonth = null;
	this.startMonthsYear = null;
	this.monthCount = null;
	this.containerId = null;
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
*	Store and parse month data
* @param month, year
*	@return monthData object
*/
CalendarConstructor.prototype.monthData = function(month, year) {
	var monthData = {
		year: year,
		month: month,
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
	return monthData;
};

/**
*	Get the name of the month
* @param monthNumber Number of the month (0 - 11)
*	@return String name of the month
*/
CalendarConstructor.prototype.getMonthName = function(monthNumber) {
	for	( var i = 0; i < this.monthNames.length; i++ ) {
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
CalendarConstructor.prototype.distributeDays = function(monthData, tbody) {
	var day = 1;
	var dayCount = monthData.monthDaysCount();
	while ( day < dayCount ) {
		var weekRow = document.createElement("tr");
		for (var i = 0; i < 7; i++) {
			if (monthData.weekDay(day) == i) {
        var dayData = monthData;
        dayData.day = day;
        var obj = JSON.stringify(dayData);
        if ( monthData.month === this.date.getMonth() ) {
          if ( day < this.currentDay ) {
            weekRow.innerHTML += "<td class='past-day'>" + day + "</td>";
          } else {
            weekRow.innerHTML += "<td class='month-day' data-day='" + obj + "'>" + day + "</td>";
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
*	Assigns properties values to render calendar
* @param data Object containing inital calendar data
*        id required Element id to contain calendar
*        month optional Starting month to display (values from 0 to 11) default is current
*	       year optional Year of the starting month to display (min value 1970) default is current
*        count Months optional to display (min value of 1)
*/
CalendarConstructor.prototype.parseInputData = function(id, count, month, year) {
  this.startMonth = month > 11 || month === undefined ? this.currentMonth : month;
	this.startMonthsYear = year < 1970 || year === undefined ? this.currentYear : year;
	this.monthCount = count === 0 || count > 3 || count === undefined ? 1 : count;
	this.containerId = id;
}

/**
*	Render HTML for calendar to page
*/
CalendarConstructor.prototype.renderCalendar = function(id, count, month, year) {
  this.parseInputData(id, count, month, year);
	var monthData = this.monthData(this.startMonth, this.startMonthsYear);
	var calendarContainer = document.getElementById(this.containerId);
	for(var i = 0; i < this.monthCount; i++) {
		var updatedData = this.updateMonthData(monthData, i);
		calendarContainer.appendChild(this.createMonthWrapper(updatedData));
	}
}

// var calendar = new CalendarConstructor("calendar", 6, 1985, 3);
// calendar.renderCalendar();






































// /**
//   * calendar.js
//   *
//   * Variables are available in global scope to use in datepicker.js
//   *
//   *
//   */
//
// // Global date object
// var date = new Date();
//
// // Current year
// // value will change
// var getCurrentYear = date.getFullYear();
// // value will not change
// var currentYear = getCurrentYear;
//
// // Current month 0 to 11. Initial month.
// // value will change
// var getCurrentMonth = date.getMonth();
// // value will not change
// var currentMonth = getCurrentMonth;
//
// // Current month day.
// var getCurrentDay = date.getDate();
//
// // Month names
// var monthNames = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December"
// ];
//
// // Week days names
// var daysShort = ["S", "M", "T", "W", "T", "F", "S"];
//
// // Current year months
// var monthsData = [];
//
// // Next month
// var increaseMonthNumber;
//
// // Constructor for calendar month
// var CreateCalendar = function(data) {
// 	this.monthData = data;
// 	this.calendarWrapper = function() {
// 		var div = document.createElement("div");
// 		div.classList.add("calendar-wrap");
// 		div.appendChild(this.monthNameWrap());
// 		div.appendChild(this.monthTableWrap());
//     this.monthData.monthElement = div;
// 		return div;
// 	};
// 	this.monthName = function() {
// 		for	( var i = 0; i < monthNames.length; i++ ) {
// 			if ( i === this.monthData.month ) {
// 				return monthNames[i];
// 			}
// 		}
// 	};
// 	this.monthNameWrap = function() {
// 		var div = document.createElement("div");
// 		div.classList.add("calendar-month-name");
//
// 		var span = document.createElement("span");
// 		span.classList.add("month-name");
// 		span.innerHTML = "<b>" + this.monthName() + "</b>" + " " + this.monthData.year;
//
// 		div.appendChild(span);
// 		return div;
// 	};
// 	this.monthTableWrap = function() {
// 		var div = document.createElement("div");
// 		div.classList.add("calendar-month");
// 		div.appendChild(this.monthTable());
// 		return div;
// 	};
// 	this.monthTable = function() {
// 		var table = document.createElement("table");
// 		table.classList.add("calendar");
//
// 		table.appendChild(this.monthTableHead());
// 		table.appendChild(this.monthTableBody());
// 		return table;
// 	};
// 	this.monthTableHead = function() {
// 		var thead = document.createElement("thead");
// 		thead.classList.add("calendar-header");
//
// 		var tr = document.createElement("tr");
// 		for	( var i = 0; i < daysShort.length; i++ ) {
// 			tr.innerHTML += "<th>" + daysShort[i] + "</th>";
// 		}
//
// 		thead.appendChild(tr);
// 		return thead;
// 	};
// 	this.monthTableBody = function() {
// 		var tbody = document.createElement("tbody");
// 		tbody.classList.add("calendar-body");
//
// 		this.distributeDays(tbody);
// 		return tbody;
// 	};
// 	this.distributeDays = function(body) {
// 		var d = 1; // day
// 		var dc = this.monthData.monthDaysCount(); // days count
//
// 		while ( d < dc ) {
// 			var weekRow = document.createElement("tr");
// 			for (var i = 0; i < 7; i++) {
// 				if (this.monthData.weekDay(d) == i) {
//           var dayData = this.monthData;
//           dayData.day = d;
//           var string = JSON.stringify(dayData);
//           // console.log(string);
//           if ( this.monthData.month === date.getMonth() ) {
//             if ( d < getCurrentDay ) {
//               weekRow.innerHTML += "<td class='past-day'>" + d + "</td>";
//             } else {
//               weekRow.innerHTML += "<td class='month-day' data-day='" + string + "'>" + d + "</td>";
//             }
//           } else {
//             weekRow.innerHTML += "<td class='month-day' data-day='" + string + "'>" + d + "</td>";
//           }
// 					d++;
// 				} else {
// 					weekRow.innerHTML += "<td></td>";
// 				}
// 				if ( d > dc ) {
// 					break;
// 				}
// 			}
// 			body.appendChild(weekRow);
// 		}
// 	};
// 	this.appendCalendar = function() {
// 		var wrapper = document.querySelector(".dropdown-calendar");
// 		wrapper.appendChild(this.calendarWrapper());
// 	};
// 	this.init = function() {
// 		this.appendCalendar();
// 	};
// };
//
//
// // Constructor to store month data
// var MonthData = function(month, year) {
//   this.year = year;
// 	this.month = month;
//
// 	this.monthDaysCount = function() {
//     // Number of days in current month
//     var _this = this;
//     var daysCount = new Date(_this.year, _this.month + 1, 0).getDate();
//     return daysCount;
//   };
//
// 	this.weekDay = function(d) {
//     // Get week day for every day in the month 0 to 6.
//     var _this = this;
//   	var dayNum = new Date(_this.year, _this.month, d);
//   	return dayNum.getDay();
//   };
//
//   this.monthElement = null; // according months HTML wrapper
//   this.visibleMonth = true; // is month visible in view
//   // this.lastGeneratedMonth = false;
// };
//
//
// // Check if month is the last in the list of all
// // generated month and set its according value it to true
// // remove active value from previous month.
// // Accept as arguments array of all month objects,
// // generated month object.
//
// // var checkLastGeneratedMonth = function(arr, item) {
// //   var monthList = arr,
// //       monthListItem = item,
// //       secondLast = monthList.length - 2;
// //
// //   for (var i = 0; i < monthList.length; i++) {
// //     if (i === secondLast) {
// //       monthList[i].lastGeneratedMonth = false;
// //     }
// //     if (monthList[i].month === item.month) {
// //       monthList[i].lastGeneratedMonth = true;
// //     }
// //   }
// // };
//
//
// // Add new month, update variables
// var addMonth = function() {
//   if (getCurrentMonth < 11) {
//     getCurrentMonth++;
//   } else {
//     getCurrentMonth = 0;
//     getCurrentYear++;
//   }
// };
//
//
// // Generate calendar (one month)
// var generateCalendar = function(month, year) {
// 	var calendarData = new MonthData(month, year);
// 	monthsData.push(calendarData);
//
// 	var displayCalendar = new CreateCalendar(calendarData);
// 	displayCalendar.init();
//
//   // checkLastGeneratedMonth(monthsData, calendarData);
// };
//
//
// // Initial calendar consists of current month
// // plus next two months
// var initialCalendar = function() {
// 	generateCalendar(getCurrentMonth, getCurrentYear);
// 	var nextMonth;
//
// 	for ( var i = 0; i < 2; i++ ) {
//     // track last displayed month
// 		getCurrentMonth++;
// 		generateCalendar(getCurrentMonth, getCurrentYear);
// 	}
// };

// initialCalendar();
