/*! Andersen Webworks Preview AW-PREVIEW-IMMOSENIO-2026-11-12 | Jan-Erik Andersen | 2026-11-12 */
const awPreviewProof = Object.freeze({
  previewId: "AW-PREVIEW-IMMOSENIO-2026-11-12",
  project: "ImmoSenio Designentwurf",
  author: "Jan-Erik Andersen / Andersen Webworks",
  created: "2026-11-12"
});

const wenigBewegung = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktopMenue = window.matchMedia("(min-width: 1100px)");

const installPreviewProof = () => {
  document.documentElement.dataset.awPreviewId = awPreviewProof.previewId;
  document.body?.setAttribute("data-aw-preview-id", awPreviewProof.previewId);
  if (window.console?.info) {
    console.info(
      "Andersen Webworks Preview\nPreview-ID: %s\nEntwurf und Code: %s\nNutzungsrechte werden im Rahmen einer Beauftragung eingeräumt.",
      awPreviewProof.previewId,
      awPreviewProof.author
    );
  }
};

/* Navigation: Vollbild-Menü auf kleinen Bildschirmen, Aufklappmenüs auf großen */
const installNavigation = () => {
  const toggle = document.querySelector(".nav-toggle");
  const liste = document.querySelector(".nav-liste");
  if (!toggle || !liste) return;
  const wurzel = document.documentElement;

  const schliesseUnterpunkte = () => {
    liste.querySelectorAll("li.is-offen").forEach((li) => {
      li.classList.remove("is-offen");
      li.querySelector(".unter-toggle")?.setAttribute("aria-expanded", "false");
    });
  };
  const schliesseMenue = () => {
    liste.classList.remove("is-offen");
    wurzel.classList.remove("menue-offen");
    toggle.setAttribute("aria-expanded", "false");
    schliesseUnterpunkte();
  };

  toggle.addEventListener("click", () => {
    const offen = liste.classList.toggle("is-offen");
    wurzel.classList.toggle("menue-offen", offen);
    toggle.setAttribute("aria-expanded", String(offen));
  });

  liste.querySelectorAll(".unter-toggle").forEach((knopf) => {
    knopf.addEventListener("click", () => {
      const li = knopf.closest("li");
      const offen = !li.classList.contains("is-offen");
      if (desktopMenue.matches) schliesseUnterpunkte();
      li.classList.toggle("is-offen", offen);
      knopf.setAttribute("aria-expanded", String(offen));
    });
  });

  /* Auf dem Handy schließt ein Tipp auf einen Link das Menü */
  liste.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (link && !desktopMenue.matches) schliesseMenue();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (liste.classList.contains("is-offen")) {
      schliesseMenue();
      toggle.focus();
    } else if (liste.querySelector("li.is-offen")) {
      schliesseUnterpunkte();
    }
  });

  document.addEventListener("click", (event) => {
    if (desktopMenue.matches && !event.target.closest(".hat-unter")) schliesseUnterpunkte();
  });

  const beiGroessenwechsel = () => schliesseMenue();
  if (desktopMenue.addEventListener) desktopMenue.addEventListener("change", beiGroessenwechsel);
};

/* Kopfzeile bekommt nach dem Scrollen Rand und Schatten; feste Leiste auf dem Handy */
const installScrollZustand = () => {
  const kopf = document.querySelector(".kopf");
  const leiste = document.querySelector(".mobil-leiste");
  let wartet = false;
  const pruefen = () => {
    wartet = false;
    const y = window.scrollY;
    kopf?.classList.toggle("is-scrolled", y > 24);
    leiste?.classList.toggle("is-sichtbar", y > 520);
  };
  window.addEventListener("scroll", () => {
    if (wartet) return;
    wartet = true;
    window.requestAnimationFrame(pruefen);
  }, { passive: true });
  pruefen();
};

/* Sanftes Einblenden beim Scrollen */
const installReveal = () => {
  const elemente = document.querySelectorAll(".reveal, .reveal-wisch, .schritt");
  if (!elemente.length) return;
  const zeigeAlle = () => elemente.forEach((el) => el.classList.add("is-sichtbar"));
  if (wenigBewegung.matches || !("IntersectionObserver" in window)) {
    zeigeAlle();
    return;
  }
  const beobachter = new IntersectionObserver((eintraege) => {
    eintraege.forEach((eintrag) => {
      if (!eintrag.isIntersecting) return;
      eintrag.target.classList.add("is-sichtbar");
      beobachter.unobserve(eintrag.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  elemente.forEach((el) => beobachter.observe(el));
};

/* Kennzahlen zählen einmal hoch, sobald sie sichtbar werden */
const installZaehler = () => {
  const felder = document.querySelectorAll("[data-zaehlen]");
  if (!felder.length || wenigBewegung.matches || !("IntersectionObserver" in window)) return;
  const formatiere = (wert) => new Intl.NumberFormat("de-DE").format(Math.round(wert));
  const laufe = (feld) => {
    const ziel = Number(feld.dataset.zaehlen);
    if (!Number.isFinite(ziel)) return;
    const dauer = 1600;
    const start = performance.now();
    const schritt = (jetzt) => {
      const t = Math.min(1, (jetzt - start) / dauer);
      const weich = 1 - Math.pow(1 - t, 3);
      feld.textContent = formatiere(ziel * weich);
      if (t < 1) window.requestAnimationFrame(schritt);
      else feld.textContent = formatiere(ziel);
    };
    window.requestAnimationFrame(schritt);
  };
  const beobachter = new IntersectionObserver((eintraege) => {
    eintraege.forEach((eintrag) => {
      if (!eintrag.isIntersecting) return;
      beobachter.unobserve(eintrag.target);
      laufe(eintrag.target);
    });
  }, { threshold: 0.6 });
  felder.forEach((feld) => {
    feld.textContent = "0";
    beobachter.observe(feld);
  });
};

/* Merkliste: Zustand wird nur angezeigt, nichts gespeichert */
const installMerkliste = () => {
  document.querySelectorAll("[data-merken]").forEach((knopf) => {
    knopf.addEventListener("click", () => {
      const an = knopf.getAttribute("aria-pressed") !== "true";
      knopf.setAttribute("aria-pressed", String(an));
    });
  });
};

/* Formulare sind Attrappen: nichts wird gesendet. */
const installFormAttrappen = () => {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
  });
};

installPreviewProof();
installNavigation();
installScrollZustand();
installReveal();
installZaehler();
installMerkliste();
installFormAttrappen();
