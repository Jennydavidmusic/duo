
document.addEventListener("DOMContentLoaded", () => {
  loadReviews();
});

function loadReviews() {
  fetch("reviews.json")
    .then((response) => response.json())
    .then((reviews) => {
      const container = document.getElementById("reviews-container");
      container.innerHTML = "";
      reviews.forEach((review, index) => {
        if (!review.validated) {
          const div = document.createElement("div");
          div.className = "review";
          div.innerHTML = `
            <div class="stars">${"★".repeat(review.rating)}</div>
            <p><strong>${review.name}</strong>: "${review.comment}"</p>
            <button onclick="approveReview(${index})">Approuver</button>
          `;
          container.appendChild(div);
        }
      });
    });
}

function approveReview(index) {
  fetch("reviews.json")
    .then((response) => response.json())
    .then((reviews) => {
      reviews[index].validated = true;
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reviews, null, 2));
      const dlAnchor = document.createElement("a");
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", "reviews.json");
      dlAnchor.click();
      alert("Review approved. Downloaded updated reviews.json.");
      loadReviews();
    });
}
