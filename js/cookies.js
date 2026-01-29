if(t && t.id === "cookieAccept"){
  setConsent("accepted");
  hideBanner();
  loadAllEmbeds();
}

if(t && t.classList && t.classList.contains("embed-accept")){
  const consentNow = getConsent();

  // If refused → do NOT load embeds
  if(consentNow === "rejected"){
    showBanner();
    return;
  }

  // If no choice yet → show banner, do NOT load
  if(!consentNow){
    showBanner();
    return;
  }

  // Only if accepted → load embeds
  if(consentNow === "accepted"){
    hideBanner();
    loadAllEmbeds();
    return;
  }
}
