import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  const searchQuery = evt.target.value.trim();

  clearMarkup();

  if (!searchQuery) {
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length >= 10) {
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length >= 2 && countries.length < 10) {
        createCountriesListMarkup(countries);
        console.log('2-10', countries);
      }
      if (countries.length === 1) {
        createCountryDescriptionMarkup(countries);
        console.log('1', countries);
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function clearMarkup() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function createCountriesListMarkup(countriesArr) {
  let markup = countriesArr.reduce(
    (acc, { flags: { png }, name: { common } }) =>
      acc +
      ` <li class="countries_list__item"><img src="${png}" alt="" width="100"><h2>${common}</h2></li>`,
    ''
  );

  // let markup = countriesArr
  //   .map(({ flags: { png }, name: { common } }) => {
  //     return ` <li><img src="${png}" alt=""><h2>${common}</h2></li>`;
  //   })
  //   .join('');

  // countryList.insertAdjacentHTML('beforeend', markup);
  countryList.innerHTML = markup;
}
function createCountryDescriptionMarkup(countriesArr) {
  let markup = countriesArr.reduce(
    (
      acc,
      { flags: { png }, name: { official }, capital, languages, population }
    ) =>
      acc +
      `<div class="country_name"> <img src="${png}" alt="${capital}" width = "80">
    <h2>${official}</h2></div>
    <p class="country_info">Capital: <span class="country_info_value">${capital}</span></p>
    <p class="country_info">Population: <span class="country_info_value">${population}</span></p>
    <p class="country_info">Languages: <span class="country_info_value">${Object.values(
      languages
    )}</span></p>`,
    ''
  );

  // let markup = countriesArr
  //   .map(
  //     ({
  //       flags: { png },
  //       name: { official },
  //       capital,
  //       languages,
  //       population,
  //     }) => {
  //       return `<img src="${png}" alt="${capital}">
  // //     <h2>${official}</h2>
  // //     <p>Capital: <span>${capital}</span></p>
  // //     <p>Population: <span>${population}</span></p>
  // //     <p>Languages: <span>${languages.values()}</span></p>`;
  //     }
  //   )
  //   .join('');

  // countryInfo.insertAdjacentHTML('beforeend', markup);
  countryInfo.innerHTML = markup;
}

console.log(debounce);
