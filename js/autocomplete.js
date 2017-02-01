// Plain JS solution
(function() {

	var searchInputWrap = document.querySelector(".js-search-wrap");
	var searchInput = document.querySelector(".js-search-input");
	var storeLocations;

	var ResultItem = function(country, city, airport, locations, searchInput) {
		this.country = country;
		this.city = city;
		this.airport = airport;
		this.locations = locations;
		this.searchInput = searchInput;
	};

	var autocomplete = {
		resultsContainer: false,
		activeResults: false,
		citiesFound: [],
		locationsFound: [],
		suggestionList: [],
		suggestionOnFocus: null,
		enterKeyEvent: false,
		clearResults: function() {
			this.activeResults = false;
			this.citiesFound.length = 0;
			this.locationsFound.length = 0;
			this.suggestionList.length = 0;
			this.suggestionOnFocus = null;
		},
		collapse: function() {
			if (this.activeResults) {
				this.clearResults();
				this.hideResults();
				var acWrap = document.querySelector(".autocomplete-wrap");
				acWrap.classList.add("is-hidden");
			}
		},
		closeSearch: function(e) {
			var acWrap = document.querySelector(".autocomplete-wrap");
			if (e.target != acWrap ) {
				autocomplete.collapse();
			}
		},
		addAutocompleteWrap: function() {
			var containerDiv  = document.createElement("div");
			containerDiv.classList.add("autocomplete-wrap");
			searchInputWrap.appendChild(containerDiv);
			this.resultsContainer = true;
		},
		hideResults: function() {
			var acWrap = document.querySelector(".autocomplete-wrap");
			while (acWrap.firstChild) {
	    acWrap.removeChild(acWrap.firstChild);
			}
		},
		selectResultByIndex: function(result) {
			for (var i = 0; i < this.suggestionList.length; i++) {
				if (result === this.suggestionList[i]) {
					this.suggestionOnFocus = i;
				}
			}
		},
		mouseHighlightResult: function() {
			var elems = autocomplete.suggestionList,
					elemCount = elems.length - 1,
					focusedElem = autocomplete.suggestionOnFocus;
			if (focusedElem != null) {
				elems[focusedElem].classList.remove("is-selected-result");
			}
			this.classList.add("is-selected-result");
			autocomplete.selectResultByIndex(this);
		},
		mouseFadeResult: function() {
			this.classList.remove("is-selected-result");
		},
		highlightNextResult: function() {
			var elems = this.suggestionList,
					elemCount = elems.length - 1;
			if ( this.suggestionOnFocus == null ) {
				this.suggestionOnFocus = 0;
				elems[0].classList.add("is-selected-result");
			} else if ( this.suggestionOnFocus < elemCount ) {
				elems[this.suggestionOnFocus].classList.remove("is-selected-result");
				this.suggestionOnFocus++;
				elems[this.suggestionOnFocus].classList.add("is-selected-result");
			} else if ( this.suggestionOnFocus === elemCount ) {
				elems[this.suggestionOnFocus].classList.remove("is-selected-result");
				this.suggestionOnFocus = 0;
				elems[0].classList.add("is-selected-result");
			}
		},
		highlightPrevResult: function() {
			var elems = this.suggestionList,
					elemCount = elems.length - 1;
			if ( 	this.suggestionOnFocus == null) {
				this.suggestionOnFocus = elemCount;
				elemCount[elemCount].classList.add("is-selected-result");
			} else if ( this.suggestionOnFocus > 0 ) {
				elems[this.suggestionOnFocus].classList.remove("is-selected-result");
				this.suggestionOnFocus--;
				elems[this.suggestionOnFocus].classList.add("is-selected-result");
			} else if ( this.suggestionOnFocus === 0 ) {
				elems[this.suggestionOnFocus].classList.remove("is-selected-result");
				this.suggestionOnFocus = elemCount;
				elems[this.suggestionOnFocus].classList.add("is-selected-result");
			}
		},
		chooseResult: function(e) {
			e.preventDefault();
			if (this.activeResults) {
				this.selectValue(e);
			}
		},
		selectResult: function(e) {
			if (e.keyCode === 40) {
				this.highlightNextResult();
			} else if (e.keyCode === 38) {
				this.highlightPrevResult();
			} else if ( e.keyCode === 13 ) {
				this.chooseResult(e);
			} else if ( e.keyCode === 27 ) {
				this.collapse();
			}
		},
		selectValue: function(e) {
			var enterKey = (e.code === "Enter" || e.code === "NumpadEnter");
			if (e.type === "click") {
				var selectedValue = this.innerText;
				searchInput.value = selectedValue;
				autocomplete.collapse();
			} else if (e.type === "keydown" && enterKey) {
				if (this.suggestionOnFocus != null) {
					var selectedValue = this.suggestionList[this.suggestionOnFocus].innerText;
					searchInput.value = selectedValue;
					autocomplete.collapse();
				}
			}
		},
		assignEvents: function() {
			var _this = this;
			var suggestedResult = document.querySelectorAll(".js-suggested-item");
			for (var i = 0; i < suggestedResult.length; i++) {
				suggestedResult[i].addEventListener("click", _this.selectValue);
				suggestedResult[i].addEventListener("mouseenter", _this.mouseHighlightResult);
				suggestedResult[i].addEventListener("mouseleave", _this.mouseFadeResult);
			}
			if (!this.enterKeyEvent) {
				document.addEventListener("keydown", _this.selectResult.bind(_this));
				document.addEventListener("click", _this.closeSearch);
				this.enterKeyEvent = true;
			}
		},
		getResultsCount: function() {
			var acWrap = document.querySelector(".autocomplete-wrap");
			var acWrapChildren = acWrap.children;
			var childrenArr = [].slice.call(acWrapChildren);
			for (var i = 0; i < childrenArr.length; i++) {
				var el = childrenArr[i];
				var elClass = el.classList;
				for (var j = 0; j < elClass.length; j++) {
					if (elClass[j] == "js-suggested-item") {
						this.suggestionList.push(el)
					}
				}
			}
		},
		showResultForCity: function() {
			this.hideResults();
			var acWrap = document.querySelector(".autocomplete-wrap");
			var suggestedCity = this.citiesFound[0].city,
					suggestedCityCountry = this.citiesFound[0].country,
					suggestedCityAirport = this.citiesFound[0].airport.name,
					suggestedCityLocations = this.citiesFound[0].locations;
			var inputValue = searchInput.value;
			var l = inputValue.length;
			var c;
			var strPos = suggestedCity.toLowerCase().indexOf(inputValue);
			if (strPos > 0) {
				c = suggestedCity.slice(0, strPos) + "<b>" + suggestedCity.slice(strPos, strPos + l) + "</b>" + suggestedCity.slice(strPos + l);
			} else if (strPos === 0) {
				c = "<b>" + suggestedCity.slice(0,l) + "</b>" +  suggestedCity.slice(l);
			}
			acWrap.innerHTML = "<div class='suggested-city js-suggested-item'>" + c + ", " + "<span class='country-faded'>" + suggestedCityCountry + "</span>" + "</div>";
			acWrap.innerHTML += "<div class='suggested-city-airport js-suggested-item'>" + suggestedCityAirport + "</div>";
			for (var i = 0; i < suggestedCityLocations.length; i++) {
				acWrap.innerHTML += "<div class='suggested-city-locations js-suggested-item'>" + suggestedCityLocations[i] + "</div>";
			}
		},
		showResultForCities: function() {
			this.hideResults();
			var acWrap = document.querySelector(".autocomplete-wrap");
			var citiesFound = this.citiesFound;
			for (var city in citiesFound) {
				if (citiesFound.hasOwnProperty(city)) {
					var suggestedCity = citiesFound[city].city,
							suggestedCityCountry = citiesFound[city].country;
					var inputValue = searchInput.value;
					var l = inputValue.length;
					var c;
					var strPos = suggestedCity.toLowerCase().indexOf(inputValue);
					if (strPos > 0) {
						c = suggestedCity.slice(0, strPos) + "<b>" + suggestedCity.slice(strPos, strPos + l) + "</b>" + suggestedCity.slice(strPos + l);
					} else if (strPos === 0) {
						c = "<b>" + suggestedCity.slice(0,l) + "</b>" +  suggestedCity.slice(l);
					}
					acWrap.innerHTML += "<div class='suggested-cities js-suggested-item'>" + c + ", " + "<span class='country-faded'>" + suggestedCityCountry + "</span>" + "</div>";
				}
			}
		},
		showResultForLocations: function() {
			this.hideResults();
			var acWrap = document.querySelector(".autocomplete-wrap");
			var suggestedCity = this.locationsFound[0].city,
					suggestedCityCountry = this.locationsFound[0].country,
					suggestedCityAirport = this.locationsFound[0].airport,
					suggestedCityLocations = this.locationsFound[0].locations;
			acWrap.innerHTML = "<div class='suggested-airport js-suggested-item'>" + suggestedCityAirport + ", " + "<span class='country-faded'>" + suggestedCityCountry + "</span>" + "</div>";
			acWrap.innerHTML += "<div class='suggested-airport-country'>" + suggestedCityCountry + "</div>";
			for (var i = 0; i < suggestedCityLocations.length; i++) {
				acWrap.innerHTML += "<div class='suggested-airport-location js-suggested-item'>" + suggestedCityLocations[i] + "</div>";
			}
		},
		showNothingFound: function() {
			this.hideResults();
			var acWrap = document.querySelector(".autocomplete-wrap");
			acWrap.innerHTML = "<div class='nothing-found'>Nothing found</div>"
		},
		parseResults: function() {
			if ( !this.resultsContainer ) {
				this.addAutocompleteWrap();
			} else {
				var acWrap = document.querySelector(".autocomplete-wrap");
				acWrap.classList.remove("is-hidden");
			}
			if (this.citiesFound.length) {
				if (this.citiesFound.length === 1 ) {
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
			this.assignEvents();
		},
		searchCities: function(obj, inputValue) {
			for (var city in obj.cities) {
				if (obj.cities.hasOwnProperty(city)) {
					var dataValue = city.toLowerCase();
					var compareValues = dataValue.indexOf(inputValue);
					if (compareValues > -1) {
						var cityAirport = obj.cities[city].airport,
								cityLocations = obj.cities[city].locations;
						var item = new ResultItem(obj.countryName, city, cityAirport, cityLocations, inputValue);
						this.citiesFound.push(item);
					} else {
						var airportCode = obj.cities[city].airport.code.toLowerCase();
						var compareNames = airportCode.indexOf(inputValue);
						var cityAirport = obj.cities[city].airport.name,
								cityLocations = obj.cities[city].locations;
						if (compareNames > -1) {
							var item = new ResultItem(obj.countryName, city, cityAirport, cityLocations, inputValue);
							this.locationsFound.push(item)
						}
					}
				}
			}
		},
		searchData: function(obj) {
		  var userInput = searchInput.value,
		      inputValue = userInput.toLowerCase();
			this.searchCities(obj, inputValue);
		},
		init: function() {
			var inputValue = searchInput.value;

			this.clearResults();
			for (var k in storeLocations) {
		    if (storeLocations.hasOwnProperty(k)) {
		      this.searchData(storeLocations[k]);
		    }
		  }
			this.parseResults();
		}
	}

	// Activate search results after 3 or more characters are entered
	var parseData = function() {
	  var inputValue = searchInput.value;
		if ( inputValue.length >= 3 ) {
			autocomplete.init();
		} else {
			autocomplete.collapse();
		}
	};

	// Load data with AJAX and store it in a variable
	var loadData = function() {
	  var ajax = new XMLHttpRequest();
	  ajax.open("GET", "https://api.myjson.com/bins/3809q", false);
	  ajax.onreadystatechange = function() {
	    if (ajax.readyState == 4 && ajax.status == 200) {
	      var data = JSON.parse(ajax.responseText);
				// Store object's "country" property with an array of countries objects
	      storeLocations = data.countries;
	    }
	  };
	  ajax.send(null);
	  searchInput.removeEventListener("focus", loadData);
	};

	searchInput.addEventListener("focus", loadData);
	searchInput.addEventListener("input", parseData);
})();
