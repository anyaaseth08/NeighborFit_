export const fetchGeoNamesData = async (query: string) => {
  const username = import.meta.env.VITE_GEONAMES_USERNAME;

  if (!username) {
    throw new Error("GeoNames username is not set in .env");
  }

  const url = `https://secure.geonames.org/searchJSON?q=${query}&maxRows=1&username=${username}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("GeoNames request failed");

    const data = await res.json();

    if (!data.geonames || data.geonames.length === 0) {
      throw new Error("No data found for the given query");
    }

    const place = data.geonames[0];

    return {
      name: place.name,
      country: place.countryName,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lng),
      population: place.population,
    };
  } catch (err) {
    console.error("GeoNames error:", err);
    return null;
  }
};
