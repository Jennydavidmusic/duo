
fetch("https://opensheet.elk.sh/1-7nFW51MxrXj1fzymfnCrETIHCMTkYHNZjVx1XX9iug/1")
  .then(response => response.json())
  .then(data => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDate = (str) => {
      if (!str) return null;
      const [day, month, year] = str.split('/');
      return new Date(+year, +month - 1, +day);
    };

    data.forEach(row => {
      const dateObj = parseDate(row.Date);
      if (!dateObj || dateObj < today || !row.Time || !row.Venue) return;

      const [hour, minute] = row.Time.split(':').map(Number);
      if (isNaN(hour) || isNaN(minute)) return;

      dateObj.setHours(hour + 1, minute);  // +1 hour

      const isoString = dateObj.toISOString();
      const startDate = isoString.slice(0, 19);

      const eventJson = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": `Jenny & David Live at ${row.Venue}`,
        "startDate": startDate,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": row.Venue,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "London",
            "addressCountry": "GB"
          }
        },
        "performer": {
          "@type": "MusicGroup",
          "name": "Jenny & David"
        },
        "description": `Live acoustic performance by Jenny & David at ${row.Venue} in London.`
      };

      if (row.Link) {
        eventJson.location.url = row.Link;
      }

      const scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(eventJson, null, 2);
      document.head.appendChild(scriptTag);
    });
  })
  .catch(error => {
    console.error("Failed to load gig events for schema.org:", error);
  });
