var express = require("express");
var router = express.Router();
var request = require("request");
var dayjs = require("dayjs");

router.get("/", function (req, res) {
  request.get(
    "https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=" +
      process.env.API_KEY,
    function (err, response, body) {
      if (!err && response.statusCode == 200) {
        var received = JSON.parse(body);
        // Array of unique countries
        let countryList = [];

        // Object which will return final JSON
        let result = { countries: [] };

        // Gets suitable start days for the given attendee
        const getDoubleDays = (dates, index) => {
          let doubleDays = [];
          for (let date of dates) {
            nextDay = dayjs(date).add(1, "day").format("YYYY-MM-DD");
            if (dates.includes(nextDay)) {
              doubleDays.push(date);
            }
          }
          return doubleDays;
        };

        // Reformat data to be divided into countries
        received.partners.map((partner, index) => {
          // Initialise new country if it hasn't been encountered yet
          if (!countryList.includes(partner.country)) {
            countryList.push(partner.country);
            result.countries.push({
              attendees: [partner.email],
              name: partner.country,
              // 2D array of possible start dates for each attendee
              availability: [getDoubleDays(partner.availableDates)],
              // 1D array via spread operator of possible start dates for all attendees
              dates: [...getDoubleDays(partner.availableDates)],
            });
            // If country already initialised, then push new data to country
          } else {
            let existingCountry =
              result.countries[countryList.indexOf(partner.country)];
            existingCountry.attendees.push(partner.email);
            existingCountry.dates.push(
              ...getDoubleDays(partner.availableDates, index)
            );
            existingCountry.availability.push(
              getDoubleDays(partner.availableDates)
            );
          }
        });

        // Get most commonly available date for each country
        for (let country of result.countries) {
          dateCounts = {};
          for (let date of country.dates) {
            if (date in dateCounts) {
              dateCounts[date] += 1;
            } else {
              dateCounts[date] = 1;
            }
          }

          // Find possible start date for each country - most commonly available (if tie, then earliest date)
          let start = null;
          for (let [key, value] of Object.entries(dateCounts)) {
            if (start == null) {
              start = { date: key, count: value };
            } else if (
              (dayjs(key).isBefore(start.date) && value == start.count) ||
              value > start.count
            ) {
              start = { date: key, count: value };
            }
          }
          country.startDate = start.date;

          // Find attendees that can attend the chosen date
          country.attendees = country.attendees.filter((attendee, index) =>
            country.availability[index].includes(country.startDate)
          );
          country.attendeeCount = country.attendees.length;

          // Remove data from JSON that is no longer necessary
          delete country.availability;
          delete country.dates;
        }
        // Return JSON
        res.json(result);
      }
    }
  );
});

module.exports = router;
