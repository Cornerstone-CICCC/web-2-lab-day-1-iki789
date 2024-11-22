const form = document.getElementById("searchForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const searchValue = formData.get("search").trim();

  try {
    const cityCoordinates = await getCityCoordinates(searchValue);
    if (cityCoordinates.results.length) {
      const city = cityCoordinates.results[0].name;
      const country = cityCoordinates.results[0].country;
      const population = cityCoordinates.results[0].population;
      const timezone = cityCoordinates.results[0].timezone;
      const lat = cityCoordinates.results[0].latitude;
      const lng = cityCoordinates.results[0].longitude;
      const weather = await getWeatherResult(lat, lng);
      const temperature = `${weather.current.temperature_2m}${weather.current_units.temperature_2m}`;
      const low = `${weather.daily.temperature_2m_min.pop()}${
        weather.daily_units.temperature_2m_min
      }`;
      const high = `${weather.daily.temperature_2m_max.pop()}${
        weather.daily_units.temperature_2m_max
      }`;
      const isDay = weather.current.is_day;
      console.log({ weather });

      updateUI({
        city,
        country,
        timezone,
        temperature,
        population,
        forecast: {
          low,
          high,
        },
        isDay,
      });
      showTableUI();
    }
  } catch (err) {
    console.log(err);
    showErrorUI();
    updateUI({});
  }
  return;
});

const getCityCoordinates = async (city) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
  const req = await fetch(url);
  return await req.json();
};

const getWeatherResult = async (lat, lng) => {
  const req = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`
  );
  return await req.json();
};

const updateUI = ({
  city,
  country,
  timezone,
  temperature,
  population,
  forecast,
  isDay = false,
}) => {
  const cityEl = document.getElementById("city");
  const countryEl = document.getElementById("country");
  const timezoneEl = document.getElementById("timezone");
  const temperatureEl = document.getElementById("temp");
  const populationEl = document.getElementById("population");
  const lowEl = document.getElementById("low");
  const highEl = document.getElementById("high");

  cityEl.textContent = city;
  countryEl.textContent = country;
  timezoneEl.textContent = timezone;
  temperatureEl.textContent = temperature;
  populationEl.textContent = population;
  lowEl.textContent = forecast.low;
  highEl.textContent = forecast.high;

  if (isDay) {
    document.body.classList.remove("night");
  } else {
    document.body.classList.add("night");
  }
};

const showErrorUI = () => {
  const table = document.getElementById("table");
  const error = document.getElementById("error");
  table.style.display = "none";
  error.style.display = "block";
};

const showTableUI = () => {
  const table = document.getElementById("table");
  const error = document.getElementById("error");
  table.style.display = "block";
  error.style.display = "none";
};
