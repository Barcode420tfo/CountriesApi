// Select elements from DOM
const loader = document.querySelector("#loader");
const tableBody = document.querySelector("#countriesTableBody");

// Fetch countries data asynchronously
fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,population")
  .then((response) => response.json())
  .then((countries) => {
    // Loop through each country and build table rows
    countries.forEach((country) => {
      const row = `
        <tr>
          <td>
            <img src="${country.flags.svg}" 
                 alt="${country.flags.alt || 'Country flag'}" 
                 style="width:50px; height:auto; border-radius:4px;">
          </td>
          <td>${country.name.common}</td>
          <td>${country.region}</td>
          <td>${country.population.toLocaleString()}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  })
  .catch((error) => {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-danger text-center">
          Error: ${error.message}
        </td>
      </tr>`;
  })
  .finally(() => {
    // Hide loader after everything finishes
    loader.remove();
  });
