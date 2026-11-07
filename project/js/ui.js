"use strict";

const URGENCY_LABELS = {
  emergency: "EMERGENCY",
  soon: "SEE A CLINICIAN SOON",
  routine: "ROUTINE APPOINTMENT",
  general: "GENERAL GUIDANCE"
};

const LOCAL_NEXT_STEPS = {
  emergency: "Go to the nearest health centre, district hospital, or emergency department now.",
  soon: "Consider contacting a Health Surveillance Assistant, local health worker, or a recognised health information line such as Chipatala Cha Pa Foni where available.",
  routine: "Consider contacting a Health Surveillance Assistant, local health worker, or a recognised health information line such as Chipatala Cha Pa Foni where available.",
  general: "If you are unsure or symptoms worsen, visit your nearest health facility."
};

function setActiveNavigation(page) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function createSymptomCard(symptom) {
  const label = document.createElement("label");
  label.className = `symptom-option${symptom.category === "emergency" ? " emergency-option" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "symptoms";
  checkbox.value = symptom.id;

  const visibleCheckbox = document.createElement("span");
  visibleCheckbox.className = "visible-checkbox";
  visibleCheckbox.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.textContent = symptom.label;

  label.append(checkbox, visibleCheckbox, text);
  return label;
}

function renderSymptoms() {
  const host = document.getElementById("symptom-groups");
  if (!host) return;

  const groups = [
    { id: "emergency", heading: "Emergency warning signs" },
    { id: "general", heading: "General symptoms" }
  ];

  groups.forEach((group) => {
    const symptoms = SYMPTOMS.filter((symptom) => symptom.category === group.id);
    const section = document.createElement("section");
    section.className = `symptom-group${group.id === "emergency" ? " emergency-group" : ""}`;
    section.setAttribute("aria-labelledby", `group-${group.id}`);

    const heading = document.createElement("h3");
    heading.id = `group-${group.id}`;
    heading.textContent = group.heading;

    const list = document.createElement("div");
    list.className = "symptom-list";
    symptoms.forEach((symptom) => list.append(createSymptomCard(symptom)));
    section.append(heading, list);
    host.append(section);
  });
}

function appendResultElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  parent.append(element);
  return element;
}

function renderResult(rule) {
  const host = document.getElementById("result-content");
  if (!host) return;

  const result = document.createElement("div");
  result.className = "result-card";

  appendResultElement(result, "span", `urgency-badge urgency-${rule.urgency}`, URGENCY_LABELS[rule.urgency] || URGENCY_LABELS.general);
  appendResultElement(result, "h3", "result-action", rule.action);

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Why this guidance?";
  const reason = document.createElement("p");
  reason.textContent = rule.reason;
  details.append(summary, reason);
  result.append(details);

  const nextStep = document.createElement("div");
  nextStep.className = "local-next-step";
  appendResultElement(nextStep, "h4", "", "Next step locally");
  appendResultElement(nextStep, "p", "", LOCAL_NEXT_STEPS[rule.urgency] || LOCAL_NEXT_STEPS.general);
  result.append(nextStep);

  host.replaceChildren(result);
}

function initAssistant() {
  renderSymptoms();
  const form = document.getElementById("assistant-form");
  if (!form) return;

  const resultPanel = document.querySelector(".result-panel");
  const resetButton = document.getElementById("reset-button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedIds = Array.from(form.querySelectorAll('input[name="symptoms"]:checked'))
      .map((input) => input.value);
    const duration = form.elements.duration.value;
    renderResult(evaluate(selectedIds, duration));

    if (resultPanel) {
      resultPanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const host = document.getElementById("result-content");
      if (host) {
        host.innerHTML = '<div class="empty-state"><div class="empty-icon" aria-hidden="true"><svg viewBox="0 0 120 120" role="presentation"><circle cx="60" cy="60" r="48" fill="#eaf5f6"/><path d="M47 25h26v22h22v26H73v22H47V73H25V47h22z" fill="#16b8a6"/><circle cx="91" cy="31" r="8" fill="#127a9e"/></svg></div><h3>Your guidance will appear here.</h3><p>Choose the items that apply, then select “View Guidance”.</p></div>';
      }
    });
  }
}

function renderRulesTable() {
  const body = document.getElementById("rules-table-body");
  if (!body) return;

  const orderedRules = [...RULES].sort((left, right) => left.priority - right.priority);
  orderedRules.forEach((rule) => {
    const row = document.createElement("tr");
    [String(rule.priority), rule.id, URGENCY_LABELS[rule.urgency] || rule.urgency, rule.action, rule.reason].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    body.append(row);
  });

  const count = document.getElementById("rule-count");
  if (count) count.textContent = `${orderedRules.length} rules`;
}

function initLanding() {
  return undefined;
}

function initAbout() {
  renderRulesTable();
}

window.UI = { setActiveNavigation, initLanding, initAssistant, initAbout };
