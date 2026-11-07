"use strict";

const SYMPTOMS = [
  { id: "chest_pain", label: "Chest pain or tightness", category: "emergency" },
  { id: "severe_breath", label: "Severe difficulty breathing", category: "emergency" },
  { id: "unconscious", label: "Fainting or unconsciousness", category: "emergency" },
  { id: "severe_bleeding", label: "Severe bleeding", category: "emergency" },
  { id: "fever", label: "Fever", category: "general" },
  { id: "cough", label: "Cough", category: "general" },
  { id: "headache", label: "Headache", category: "general" },
  { id: "diarrhea", label: "Diarrhea", category: "general" },
  { id: "vomiting", label: "Vomiting", category: "general" },
  { id: "rash", label: "Rash", category: "general" },
  { id: "fatigue", label: "Fatigue", category: "general" }
];

const RULES = [
  {
    id: "emergency_red_flag",
    priority: 1,
    match: (selectedIds) => SYMPTOMS.some((symptom) => symptom.category === "emergency" && selectedIds.includes(symptom.id)),
    urgency: "emergency",
    action: "Seek emergency care at the nearest health facility now.",
    reason: "A selected emergency warning sign should be assessed urgently by a qualified health worker."
  },
  {
    id: "fever_extended",
    priority: 2,
    match: (selectedIds, duration) => selectedIds.includes("fever") && (duration === "medium" || duration === "long"),
    urgency: "soon",
    action: "Contact a health worker soon so the fever can be assessed.",
    reason: "Fever selected with a duration of 3 days or longer is included in this rule for timely clinical assessment."
  },
  {
    id: "cough_extended",
    priority: 2,
    match: (selectedIds, duration) => selectedIds.includes("cough") && duration === "long",
    urgency: "soon",
    action: "Contact a health worker soon to discuss the ongoing cough.",
    reason: "A cough selected with a duration of more than 14 days is included in this rule for clinical assessment."
  },
  {
    id: "diarrhea_or_vomiting",
    priority: 3,
    match: (selectedIds) => selectedIds.includes("diarrhea") || selectedIds.includes("vomiting"),
    urgency: "routine",
    action: "Arrange a routine appointment or consult a local health worker for guidance.",
    reason: "Diarrhea or vomiting was selected, so this rule recommends discussing the concern with a health worker."
  },
  {
    id: "headache_extended",
    priority: 3,
    match: (selectedIds, duration) => selectedIds.includes("headache") && duration !== "short",
    urgency: "routine",
    action: "Arrange a routine appointment so a health worker can assess the ongoing headache.",
    reason: "Headache selected with a duration of 3 days or longer is included in this rule for assessment."
  },
  {
    id: "rash_or_fatigue",
    priority: 4,
    match: (selectedIds) => selectedIds.includes("rash") || selectedIds.includes("fatigue"),
    urgency: "general",
    action: "Monitor your symptoms and consult a health worker if you are concerned or they worsen.",
    reason: "Rash or fatigue was selected; this rule provides general guidance and encourages follow-up if needed."
  }
];

const FALLBACK = {
  urgency: "general",
  action: "Information is insufficient for a specific recommendation. Please consult a local health worker or visit a nearby health centre if you are concerned.",
  reason: "No specific rule matched the information provided."
};

const DISCLAIMER = "This information is for general guidance only and does not replace professional medical advice. Only a qualified health worker can diagnose and treat medical conditions.";

window.SYMPTOMS = SYMPTOMS;
window.RULES = RULES;
window.FALLBACK = FALLBACK;
window.DISCLAIMER = DISCLAIMER;
