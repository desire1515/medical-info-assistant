"use strict";

function evaluate(selectedIds, duration) {
  const selected = Array.isArray(selectedIds) ? selectedIds : [];
  const emergencyRule = RULES.find((rule) => rule.id === "emergency_red_flag");

  if (emergencyRule.match(selected, duration)) {
    return emergencyRule;
  }

  const matchingRules = RULES
    .filter((rule) => rule.id !== "emergency_red_flag" && rule.match(selected, duration))
    .sort((left, right) => left.priority - right.priority);

  return matchingRules[0] || FALLBACK;
}

window.evaluate = evaluate;
