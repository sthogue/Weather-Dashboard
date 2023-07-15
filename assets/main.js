var userFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-input');
var cityButtonsEl = document.querySelector('#major-cities-buttons');
var fiveDayContainerEl = document.querySelector('#five-day-container');
var currentCitySearch = document.querySelector('#Current-City-search');

var lon = "";
var lat = "";
// form submit event handler for search results
var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var userInputEl = cityInputEl.value.trim();
  
    if (isNaN(userInputEl)) {
        var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+ userInputEl +'&limit=1&appid=349ff99c6078919fabcd80ffc046fad1';
        fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                lon = data[0].lon;
                lat = data[0].lat;
                console.log(lat);
                console.log(lon);
                getCityData(lon, lat);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect OpenWeather.com connection');
        });
    //   getUserRepos(lon, lat);
  
      fiveDayContainerEl.textContent = '';
      cityInputEl.value = '';
    } else {
        // converts Zip Code to lon at lats
        var apiUrl = 'http://api.openweathermap.org/geo/1.0/zip?zip='+ userInputEl +'&appid=349ff99c6078919fabcd80ffc046fad1';
        fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                lon = data.lon;
                lat = data.lat;
                console.log(lat);
                console.log(lon);
                getCityData(lon, lat);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect OpenWeather.com connection');
        });
      
  
      fiveDayContainerEl.textContent = '';
      cityInputEl.value = '';;
    }
  };

// gets city data from converted lon at lat
var getCityData = function (lon, lat) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon +'&appid=349ff99c6078919fabcd80ffc046fad1';
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
           displayCityInfo(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect OpenWeather.com');
      });
  };

function displayCityInfo(data){
  // gets current weather image id and updates image 
  var currentWeatherIcon = document.getElementById("today-weather-icon");
  var weatherIconSrc = "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon+"@2x.png";
  currentWeatherIcon.src = weatherIconSrc
  currentCitySearch.innerHTML = data.city.name;

  


}
// get current city forecast
// display current city weather
// display 5 day forecast for the city

userFormEl.addEventListener('submit', formSubmitHandler);
//cityButtonsEl.addEventListener('click', buttonClickHandler);