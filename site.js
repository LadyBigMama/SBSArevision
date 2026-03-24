(function() {
  function getHomeUrl(link) {
    var href = link.getAttribute("href") || "";
    return href.split("#")[0].split("?")[0];
  }

  function isHomePage() {
    return document.body && document.body.dataset.page === "home";
  }

  function forceTopScroll() {
    window.scrollTo(0, 0);
    window.requestAnimationFrame(function() {
      window.scrollTo(0, 0);
    });
    window.setTimeout(function() {
      window.scrollTo(0, 0);
    }, 60);
    window.setTimeout(function() {
      window.scrollTo(0, 0);
    }, 180);
  }

  function clearHomeUrl() {
    history.replaceState(null, "", window.location.pathname);
  }

  function resetHomePageOnEntry() {
    if (!isHomePage()) {
      return;
    }

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    forceTopScroll();
    window.addEventListener("load", forceTopScroll);
    window.addEventListener("pageshow", forceTopScroll);
    window.setTimeout(forceTopScroll, 0);
    window.setTimeout(forceTopScroll, 120);
    window.setTimeout(forceTopScroll, 260);
    window.setTimeout(forceTopScroll, 420);

    var params = new URLSearchParams(window.location.search);
    if (!params.has("navtop") && window.location.hash !== "#page-top") {
      return;
    }

    window.setTimeout(function() {
      clearHomeUrl();
    }, 320);
  }

  function bindFlyingSitesLinks() {
    var links = document.querySelectorAll(".topbar-nav a");

    links.forEach(function(link) {
      if (link.textContent.trim() !== "FLYING SITES") {
        return;
      }

      link.addEventListener("click", function(event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();

        if (isHomePage()) {
          forceTopScroll();
          window.setTimeout(function() {
            clearHomeUrl();
          }, 220);
          return;
        }

        window.location.href = getHomeUrl(link) + "?navtop=" + Date.now();
      });
    });
  }

  function openCardLink(link, openInNewTab) {
    if (openInNewTab) {
      window.open(link.href, "_blank", "noopener");
      return;
    }

    window.location.href = link.href;
  }

  function bindSiteCards() {
    var cards = document.querySelectorAll(".site-card");

    cards.forEach(function(card) {
      var primaryLink = card.querySelector(".site-image[href]");
      var image = primaryLink ? primaryLink.querySelector("img") : null;
      var label = primaryLink && primaryLink.textContent ? primaryLink.textContent.trim() : "";

      if (!primaryLink) {
        return;
      }

      card.classList.add("site-card-clickable");
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", label || (image && image.alt) || "Open site page");

      card.addEventListener("click", function(event) {
        if (event.target.closest("a")) {
          return;
        }

        openCardLink(primaryLink, event.metaKey || event.ctrlKey);
      });

      card.addEventListener("keydown", function(event) {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        openCardLink(primaryLink, event.metaKey || event.ctrlKey);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    bindFlyingSitesLinks();
    bindSiteCards();
    resetHomePageOnEntry();
  });
}());
