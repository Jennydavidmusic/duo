
fetch("reviews.json")
  .then(res => res.json())
  .then(data => {
    const approved = data.filter(r => r.approved);
    const container = document.getElementById("review-list");
    approved.forEach(r => {
      const div = document.createElement("div");
      div.className = "review";
      div.innerHTML = `
        <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p><strong>${r.name}</strong>: "${r.comment}" <br><small>${r.date}</small></p>
      `;
      container.appendChild(div);
    });
  });
