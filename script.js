const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();

const accessibilityWidget = document.querySelector(".accessibility-widget");
const accessibilityPanel = document.querySelector("#accessibility-panel");
const accessibilityTrigger = document.querySelector("#accessibility-trigger");
const themeColor = document.querySelector('meta[name="theme-color"]');
const colorFilterClasses = [
  "accessibility-monochrome",
  "accessibility-protanopia",
  "accessibility-deuteranopia",
  "accessibility-tritanopia",
];
const scalableTextElements = document.querySelectorAll("main p, main a, main button");

const setLargeTextEnabled = (isEnabled) => {
  scalableTextElements.forEach((element) => {
    if (isEnabled) {
      const currentFontSize = Number.parseFloat(getComputedStyle(element).fontSize);
      element.style.fontSize = `${currentFontSize * 1.2}px`;
      if (element.tagName === "P") {
        element.style.lineHeight = "1.6";
      }
    } else {
      element.style.removeProperty("font-size");
      element.style.removeProperty("line-height");
    }
  });
};

const setPanelOpen = (isOpen, restoreFocus = false) => {
  accessibilityPanel.hidden = !isOpen;
  accessibilityTrigger.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    document.querySelector("#accessibility-close").focus();
  } else if (restoreFocus) {
    accessibilityTrigger.focus();
  }
};

accessibilityTrigger.addEventListener("click", () => {
  setPanelOpen(accessibilityPanel.hidden);
});

document.querySelector("#accessibility-close").addEventListener("click", () => {
  setPanelOpen(false, true);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !accessibilityPanel.hidden) {
    setPanelOpen(false, true);
  }
});

document.addEventListener("click", (event) => {
  if (!accessibilityPanel.hidden && !accessibilityWidget.contains(event.target)) {
    setPanelOpen(false);
  }
});

document.querySelector("#theme-toggle").addEventListener("click", (event) => {
  const isLightMode = document.body.classList.toggle("light-mode");
  event.currentTarget.setAttribute("aria-pressed", String(isLightMode));
  event.currentTarget.querySelector("strong").textContent = isLightMode
    ? "Modo oscuro"
    : "Modo claro";
  event.currentTarget.querySelector("small").textContent = isLightMode
    ? "Cambiar a la apariencia oscura"
    : "Cambiar a la apariencia clara";
  themeColor.content = isLightMode ? "#f7f1e9" : "#17120f";
});

document.querySelectorAll(".filter-option").forEach((button) => {
  button.addEventListener("click", () => {
    colorFilterClasses.forEach((className) => {
      document.body.classList.remove(className);
    });

    const selectedFilter = button.dataset.filter;
    if (selectedFilter !== "original") {
      document.body.classList.add(`accessibility-${selectedFilter}`);
    }

    document.querySelectorAll(".filter-option").forEach((option) => {
      const isSelected = option === button;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
    });
  });
});

document.querySelector("#text-size-toggle").addEventListener("click", (event) => {
  const isEnabled = document.body.classList.toggle("accessibility-large-text");
  setLargeTextEnabled(isEnabled);
  event.currentTarget.setAttribute("aria-pressed", String(isEnabled));
});

document.querySelector("#focus-toggle").addEventListener("click", (event) => {
  const isEnabled = document.body.classList.toggle("accessibility-focus");
  event.currentTarget.setAttribute("aria-pressed", String(isEnabled));
});

document.querySelector("#accessibility-reset").addEventListener("click", () => {
  setLargeTextEnabled(false);
  document.body.classList.remove(
    "light-mode",
    "accessibility-large-text",
    "accessibility-focus",
    ...colorFilterClasses,
  );
  themeColor.content = "#17120f";

  const themeToggle = document.querySelector("#theme-toggle");
  themeToggle.setAttribute("aria-pressed", "false");
  themeToggle.querySelector("strong").textContent = "Modo claro";
  themeToggle.querySelector("small").textContent = "Cambiar a la apariencia clara";
  document.querySelector("#text-size-toggle").setAttribute("aria-pressed", "false");
  document.querySelector("#focus-toggle").setAttribute("aria-pressed", "false");

  document.querySelectorAll(".filter-option").forEach((option) => {
    const isOriginal = option.dataset.filter === "original";
    option.classList.toggle("is-selected", isOriginal);
    option.setAttribute("aria-pressed", String(isOriginal));
  });
});
