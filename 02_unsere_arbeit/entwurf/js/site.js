/*! Andersen Webworks Preview AW-PREVIEW-IMMOSENIO-2026-11-12 | Jan-Erik Andersen | 2026-11-12 */
const awPreviewProof = Object.freeze({
  previewId: "AW-PREVIEW-IMMOSENIO-2026-11-12",
  project: "ImmoSenio Designentwurf",
  author: "Jan-Erik Andersen / Andersen Webworks",
  created: "2026-11-12"
});

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

/* Aufklappmenü: Hauptmenü und Untermenüs auf kleinen Bildschirmen */
const installNavigation = () => {
  const toggle = document.querySelector(".nav-toggle");
  const liste = document.querySelector(".nav-liste");
  if (!toggle || !liste) return;

  const schliesseAlles = () => {
    liste.classList.remove("is-offen");
    toggle.setAttribute("aria-expanded", "false");
    liste.querySelectorAll("li.is-offen").forEach((li) => {
      li.classList.remove("is-offen");
      li.querySelector(".unter-toggle")?.setAttribute("aria-expanded", "false");
    });
  };

  toggle.addEventListener("click", () => {
    const offen = liste.classList.toggle("is-offen");
    toggle.setAttribute("aria-expanded", String(offen));
  });

  liste.querySelectorAll(".unter-toggle").forEach((knopf) => {
    knopf.addEventListener("click", () => {
      const li = knopf.closest("li");
      const offen = li.classList.toggle("is-offen");
      knopf.setAttribute("aria-expanded", String(offen));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && liste.classList.contains("is-offen")) {
      schliesseAlles();
      toggle.focus();
    }
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
installFormAttrappen();
