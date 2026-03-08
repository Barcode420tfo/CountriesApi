const loader = document.querySelector("#loader");
const tableBody = document.querySelector("#countriesTableBody");
const searchInput = document.querySelector("#searchInput");
const regionFilter = document.querySelector("#regionFilter");
const clearFiltersBtn = document.querySelector("#clearFilters");
const resultCount = document.querySelector("#resultCount");

let countriesData = [];

function formatPopulation(value) {
  return Number(value || 0).toLocaleString();
}

function updateResultCount(totalShown, totalAvailable) {
  resultCount.textContent = `Showing ${totalShown} of ${totalAvailable} countries`;
}

function renderCountries(countries) {
  if (!countries.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state text-center">
          No countries match your search.
        </td>
      </tr>`;
    updateResultCount(0, countriesData.length);
    return;
  }

  const rows = countries
    .map(
      (country, index) => `
        <tr style="--row-index:${index}">
          <td data-label="Flag">
            <img
              src="${country.flags.svg}"
              alt="${country.flags.alt || `${country.name.common} flag`}"
              class="country-flag"
            >
          </td>
          <td data-label="Country">${country.name.common}</td>
          <td data-label="Region">${country.region || "N/A"}</td>
          <td data-label="Population">${formatPopulation(country.population)}</td>
        </tr>
      `
    )
    .join("");

  tableBody.innerHTML = rows;
  updateResultCount(countries.length, countriesData.length);
}

function applyFilters() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedRegion = regionFilter.value;

  const filtered = countriesData.filter((country) => {
    const name = country.name.common.toLowerCase();
    const matchesSearch = name.includes(searchText);
    const matchesRegion =
      selectedRegion === "all" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  renderCountries(filtered);
}

function populateRegionFilter(countries) {
  const uniqueRegions = [...new Set(countries.map((c) => c.region).filter(Boolean))].sort();
  uniqueRegions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionFilter.append(option);
  });
}

fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,population")
  .then((response) => response.json())
  .then((countries) => {
    countriesData = countries.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );
    populateRegionFilter(countriesData);
    renderCountries(countriesData);
  })
  .catch((error) => {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-danger text-center">
          Error: ${error.message}
        </td>
      </tr>`;
    resultCount.textContent = "Unable to load countries data.";
  })
  .finally(() => {
    loader.remove();
  });

searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);
clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  regionFilter.value = "all";
  applyFilters();
  searchInput.focus();
});
