// Plain JS solution
(function () {
	"use strict";

	// Form elements
	var searchInputWrap = document.querySelector(".js-search-wrap");
	var searchInput = document.querySelector(".js-search-input");

	var ResultItem = function (country, city, airport, locations, inputValue) {
		this.country = country;
		this.city = city;
		this.airport = airport;
		this.locations = locations;
		this.inputValue = inputValue;
	};

	var autocomplete = {
		locationData: "",
		autocompleteWrapper: false,
		resultContainer: false,
		activeResults: false,
		citiesFound: [],
		locationsFound: [],
		suggestionList: [],
		suggestionOnFocus: null,
		enterKeyEvent: false,
		activeEvents: false,
		activeScroll: false,
		clearResults: function () {
			this.activeResults = false;
			this.citiesFound.length = 0;
			this.locationsFound.length = 0;
			this.suggestionList.length = 0;
			this.suggestionOnFocus = null;
		},
		collapse: function () {
			if (this.activeResults) {
				this.unassignEvents();
				this.clearResults();
				this.removeResults();
				this.autocompleteWrapper.classList.add("is-hidden");
			}
		},
		addAutocompleteWrap: function () {
			var wrapperDiv = document.createElement("div");
			wrapperDiv.classList.add("autocomplete-wrap");
			var containerDiv = document.createElement("div");
			containerDiv.classList.add("autocomplete");
			wrapperDiv.appendChild(containerDiv);
			searchInputWrap.appendChild(wrapperDiv);
			this.autocompleteWrapper = wrapperDiv;
			this.resultContainer = containerDiv;
		},
		removeResults: function () {
			while (this.resultContainer.firstChild) {
				this.resultContainer.removeChild(this.resultContainer.firstChild);
			}
			if (this.activeScroll) {
				this.activeScroll = false;
				this.resultContainer.classList.remove("autocomplete-scroll");
			}
		},
		handleMouseMove: function (e) {
			if (e.target.classList.contains("js-suggested-item")) {
				var curIndx = [].slice.call(e.target.parentNode.children).indexOf(e.target);
				if (this.suggestionOnFocus !== null) {
					this.fadeResult(this.suggestionOnFocus);
				}
				this.suggestionOnFocus = curIndx;
				this.highlightResult(curIndx);
			}
		},
		fadeResult: function (i) {
			this.suggestionList[i].classList.remove("is-selected-result");
		},
		highlightResult: function (i) {
			this.suggestionList[i].classList.add("is-selected-result");
		},
		selectValue: function (e) {
			e.preventDefault();
			if (e.type === "click" && e.target.closest(".js-suggested-item")) {
				searchInput.value = e.target.closest(".js-suggested-item").innerText;
			} else if (e.type === "keydown" && this.suggestionOnFocus != null) {
				searchInput.value = this.suggestionList[this.suggestionOnFocus].innerText;
			}
			autocomplete.collapse();
		},
		handleKeydown: function (e) {
			if (e.keyCode === 40 && !this.nothingFound) { // key down
				e.preventDefault();
				if (this.suggestionOnFocus === null) {
					this.suggestionOnFocus = 0;	
					this.highlightResult(this.suggestionOnFocus);	
				} else if (this.suggestionOnFocus === this.suggestionList.length - 1) {
					this.fadeResult(this.suggestionOnFocus);
					this.suggestionOnFocus = 0;	
					this.highlightResult(this.suggestionOnFocus);	
				} else {
					this.fadeResult(this.suggestionOnFocus);
					this.suggestionOnFocus++;
					this.highlightResult(this.suggestionOnFocus);	
				}
				if (!this.suggestionList[this.suggestionOnFocus].classList.contains("js-suggested-item")) {
					this.fadeResult(this.suggestionOnFocus);
					this.suggestionOnFocus++;
					this.highlightResult(this.suggestionOnFocus);
				}
 			} else if (e.keyCode === 38 && !this.nothingFound) { // key up
				e.preventDefault();
				if (this.suggestionOnFocus === null) {
					this.suggestionOnFocus = this.suggestionList.length - 1;	
					this.highlightResult(this.suggestionOnFocus);	
				} else if (this.suggestionOnFocus === 0) {
					this.fadeResult(this.suggestionOnFocus);
					this.suggestionOnFocus = this.suggestionList.length - 1;	
					this.highlightResult(this.suggestionOnFocus);	
				} else {
					this.fadeResult(this.suggestionOnFocus);
					this.suggestionOnFocus--;
					this.highlightResult(this.suggestionOnFocus);
				}
				if (!this.suggestionList[this.suggestionOnFocus].classList.contains("js-suggested-item")) {
					this.fadeResult(this.suggestionOnFocus);
					this.suggestionOnFocus--;
					this.highlightResult(this.suggestionOnFocus);	
				}
			} else if (e.keyCode === 13 && !this.nothingFound) { // key enter
				this.selectValue(e);
			} else if (e.keyCode === 27) { // key escape
				this.collapse();
			}
		},
		handleClick: function (e) {
			e.target.closest(".autocomplete-wrap") !== this.autocompleteWrapper ? this.collapse() : this.selectValue(e);
		},
		assignEvents: function () {
			this.resultContainer.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("keydown", handleKeydown);
			document.addEventListener("click", handleClick);
			this.activeEvents = true;
		},
		unassignEvents: function() {
			this.resultContainer.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("keydown", handleKeydown);
			document.removeEventListener("click", handleClick);
			this.activeEvents = false;
		},
		getResultsCount: function () {
			this.suggestionList = Array.prototype.slice.call(this.resultContainer.children);
		},
		showResultForCity: function () {
			var city = this.citiesFound[0];
			var l = city.inputValue.length;
			var c;
			var strPos = city.city.toLowerCase().indexOf(city.inputValue);
			if (strPos > 0) {
				c = city.city.slice(0, strPos) + "<b>" + city.city.slice(strPos, strPos + l) + "</b>" + city.city.slice(strPos + l);
			} else if (strPos === 0) {
				c = "<b>" + city.city.slice(0, l) + "</b>" + city.city.slice(l);
			}
			this.resultContainer.innerHTML = "<div class='suggested-city js-suggested-item'>" + c + "<span class='country-faded'> " + city.country + "</span></div>";
			this.resultContainer.innerHTML += "<div class='suggested-city-airport js-suggested-item'>" + city.airport + "</div>";
			city.locations.forEach(function(location) {
				this.resultContainer.innerHTML += "<div class='suggested-city-locations js-suggested-item'>" + c + " " + location + "</div>";
			}.bind(this));
			this.nothingFound = false;
		},
		showResultForCities: function () {
			this.citiesFound.forEach(function(city) {
				var l = city.inputValue.length;
				var c;
				var strPos = city.city.toLowerCase().indexOf(city.inputValue);
				if (strPos > 0) {
					c = city.city.slice(0, strPos) + "<b>" + city.city.slice(strPos, strPos + l) + "</b>" + city.city.slice(strPos + l);
				} else if (strPos === 0) {
					c = "<b>" + city.city.slice(0, l) + "</b>" + city.city.slice(l);
				}
				this.resultContainer.innerHTML += "<div class='suggested-cities js-suggested-item'>" + c + "<span class='country-faded'> " + city.country + "</span></div>";
			}.bind(this));
			this.nothingFound = false;
		},
		showResultForLocations: function () {
			var result = this.locationsFound[0];
			this.resultContainer.innerHTML = "<div class='suggested-airport js-suggested-item'>" + result.airport + "<span class='country-faded'> " + result.country + "</span></div>";
			this.resultContainer.innerHTML += "<div class='suggested-airport-country'>" + result.country + "</div>";
			result.locations.forEach(function(location) {
				this.resultContainer.innerHTML += "<div class='suggested-city-locations js-suggested-item'>" + result.city + " " + location + "</div>";
			}.bind(this));
			this.nothingFound = false;
		},
		showNothingFound: function () {
			this.resultContainer.innerHTML = "<div class='nothing-found'>Nothing found</div>";
			this.nothingFound = true;
		},
		parseResults: function () {
			if (!this.autocompleteWrapper) {
				this.addAutocompleteWrap();
			} else {
				this.autocompleteWrapper.classList.remove("is-hidden");
			}
			this.removeResults();
			if (this.citiesFound.length) {
				if (this.citiesFound.length === 1) {
					this.showResultForCity();
				} else {
					this.showResultForCities();
				}
			} else if (this.locationsFound.length) {
				this.showResultForLocations();
			} else {
				this.showNothingFound();
			}
			this.activeResults = true;
			this.getResultsCount();
			if (this.autocompleteWrapper.getBoundingClientRect().height > 200) {
				this.activeScroll = true;
				this.resultContainer.classList.add("autocomplete-scroll");
			} else {
				this.activeScroll = false;
				this.resultContainer.classList.remove("autocomplete-scroll");
			}
		},
		searchData: function (country) {
			var inputValue = searchInput.value.trim().toLowerCase().split(" ");
			country.cities.forEach(function(city) {
				var dataValue = city.name.toLowerCase();
				var airportCode = city.airport.code.toLowerCase();
				for (var i = 0; i < inputValue.length; i++) {
					if (dataValue.indexOf(inputValue[i]) > -1) {
						var item = new ResultItem(country.countryName, city.name, city.airport.name, city.locations, inputValue[i]);
						this.citiesFound.push(item);
						break;
					} else if (airportCode.indexOf(inputValue[i]) > -1) {
						var item = new ResultItem(country.countryName, city.name, city.airport.name, city.locations, inputValue[i]);
						this.locationsFound.push(item);
						break;
					}
				}
			}.bind(this));
		},
		construct: function () {
			this.clearResults();
			this.locationData.forEach(function(country) {
				this.searchData(country);
			}.bind(this));
			this.parseResults();
			if (!this.activeEvents) {
				this.assignEvents();
			}
		},
		handleInput: function () {
			searchInput.value.trim().length >= 3 ? this.construct() : this.collapse();
		},
		loadData: function () {
			var _this = this;
			var ajax = new XMLHttpRequest();
			ajax.open("GET", "https://api.myjson.com/bins/13jigt", false);
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && ajax.status == 200) {
					var data = JSON.parse(ajax.responseText);
					// Store object's "country" property with an array of countries objects
					_this.locationData = data.countries;
				}
			};
			ajax.send(null);
		},
		init: function () {
			this.loadData();
			handleClick = this.handleClick.bind(this);
			handleKeydown = this.handleKeydown.bind(this);
			handleMouseMove = this.handleMouseMove.bind(this);
			handleInput = this.handleInput.bind(this)
			searchInput.addEventListener("input", handleInput);
			searchInput.removeEventListener("focus", init);
		}
	}

	// Cache methods for events
	var handleInput, handleClick, handleKeydown, handleMouseMove;
	var init = autocomplete.init.bind(autocomplete);

	searchInput.addEventListener("focus", init);
	
})();
