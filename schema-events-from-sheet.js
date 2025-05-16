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

      const localHour = hour + 1;
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hStr = String(localHour).padStart(2, '0');
      const mStr = String(minute).padStart(2, '0');

      const startDate = `${year}-${month}-${day}T${hStr}:${mStr}:00`;

      const endDateObj = new Date(dateObj);
      endDateObj.setHours(localHour + 3, minute);
      const hEnd = String(endDateObj.getHours()).padStart(2, '0');
      const mEnd = String(endDateObj.getMinutes()).padStart(2, '0');
      const endDate = `${year}-${month}-${day}T${hEnd}:${mEnd}:00`;

      const eventJson = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": `Jenny & David Live at ${row.Venue}`,
        "startDate": startDate,
        "endDate": endDate,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": row.Venue,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "London",
            "addressCountry": "GB"
          },
          ...(row.Link ? { url: row.Link } : {})
        },
        "performer": {
          "@type": "MusicGroup",
          "name": "Jenny & David"
        },
        "description": `Live acoustic performance by Jenny & David at ${row.Venue} in London.`,
        "organizer": {
          "@type": "Organization",
          "name": "Jenny & David Music",
          "url": "https://jennydavidmusic.com"
        },
        "image": "https://jennydavidmusic.com/images/photo21.jpg",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "GBP",
          "availability": "https://schema.org/InStock",
          "validFrom": startDate,
          "url": row.Link || "https://jennydavidmusic.com/gigs.html"
        }
      };

      const scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(eventJson, null, 2);
      document.head.appendChild(scriptTag);
    });
  })
  .catch(error => {
    console.error("Failed to load gig events for schema.org:", error);
  });

