"use strict";

document.documentElement.classList.add("js");

function initThemeToggle() {
  const storageKey = "mia-theme";
  const root = document.documentElement;
  const buttons = document.querySelectorAll(".theme-toggle");
  if (!buttons.length) return;

  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  const readStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  };
  const writeStoredTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return false;
    }
    return true;
  };

  const getInitialTheme = () => {
    const stored = readStoredTheme();
    if (stored === "light" || stored === "dark") return stored;
    return preference.matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  };

  applyTheme(getInitialTheme());
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      writeStoredTheme(nextTheme);
    });
  });

  const handlePreferenceChange = (event) => {
    if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light");
  };
  if (typeof preference.addEventListener === "function") {
    preference.addEventListener("change", handlePreferenceChange);
  } else if (typeof preference.addListener === "function") {
    preference.addListener(handlePreferenceChange);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("primary-menu");
  const backdrop = document.querySelector(".menu-backdrop");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const setScrolledState = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    const indicator = document.querySelector(".scroll-indicator");
    if (indicator) indicator.classList.toggle("is-hidden", window.scrollY > 200);
  };
  setScrolledState();
  window.addEventListener("scroll", setScrolledState, { passive: true });

  const closeMenu = (restoreFocus) => {
    if (!menuToggle || !menu) return;
    menu.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
    if (restoreFocus) menuToggle.focus();
  };

  if (menuToggle && menu) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        event.preventDefault();
        closeMenu(true);
      }
    });
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu(false);
        return;
      }
      menu.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation menu");
      document.body.classList.add("menu-open");
      const firstLink = menu.querySelector("a");
      if (firstLink) firstLink.focus();
    });

    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu(false)));
    document.addEventListener("pointerdown", (event) => {
      if (menuToggle.getAttribute("aria-expanded") === "true" && header && !header.contains(event.target) && !(backdrop && backdrop.contains(event.target))) {
        closeMenu(false);
      }
    });
    if (backdrop) backdrop.addEventListener("click", () => closeMenu(false));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 767 && menuToggle.getAttribute("aria-expanded") === "true") closeMenu(false);
    });
  }

  const revealItems = Array.from(document.querySelectorAll(".reveal, [data-reveal]"));
  const revealGroups = document.querySelectorAll(".feature-grid, .stats-grid, .flow-grid, .urgency-grid, .safety-list, .project-link-buttons");
  revealGroups.forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${index * 80}ms`;
      revealItems.push(child);
    });
  });

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll("[data-counter]");
  const animateCounter = (element) => {
    const target = Number(element.dataset.counter);
    if (!Number.isFinite(target)) return;
    if (reducedMotion || !("requestAnimationFrame" in window)) {
      element.textContent = String(target);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const tableBody = document.getElementById("rules-table-body");
  if (!tableBody || !Array.isArray(window.RULES)) return;

  const urgencyLabels = {
    emergency: "EMERGENCY",
    soon: "SEE A CLINICIAN SOON",
    routine: "ROUTINE APPOINTMENT",
    general: "GENERAL GUIDANCE"
  };
  const urgencyClasses = {
    emergency: "table-emergency",
    soon: "table-soon",
    routine: "table-routine",
    general: "table-general"
  };
  const labels = ["Priority", "Rule ID", "Urgency", "Action", "Reason"];
  const rules = [...window.RULES].sort((left, right) => left.priority - right.priority);

  rules.forEach((rule) => {
    const row = document.createElement("tr");
    const values = [
      String(rule.priority),
      rule.id,
      urgencyLabels[rule.urgency] || rule.urgency,
      rule.action,
      rule.reason
    ];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.dataset.label = labels[index];
      if (index === 0) {
        const pill = document.createElement("span");
        pill.className = `priority-pill priority-${rule.priority}`;
        pill.textContent = value;
        cell.append(pill);
      } else if (index === 2) {
        const pill = document.createElement("span");
        pill.className = `urgency-table-pill ${urgencyClasses[rule.urgency] || ""}`;
        pill.textContent = value;
        cell.append(pill);
      } else {
        cell.textContent = value;
      }
      row.append(cell);
    });
    tableBody.append(row);
  });

  const ruleCount = document.getElementById("rule-count");
  if (ruleCount) ruleCount.textContent = `${rules.length} rules`;
});
