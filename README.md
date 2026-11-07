# Intelligent Medical Information Assistant

Project is a static, browser-only health information and navigation coursework project. The working assistant uses a transparent set of predefined JavaScript rules to turn user-selected symptoms or warning signs and a duration into general next-step guidance. A separate three-page portfolio presents the project, features, technical details, and safety boundaries.

## Repository layout

| Location | Contents |
|---|---|
| `/` | Three-page portfolio: `index.html`, `features.html`, and `about.html`, with shared `portfolio.css` and `portfolio.js` |
| `/project/` | Working health information assistant and its CSS, JavaScript rule engine, knowledge base, and assets |

## Run locally

Open the root `index.html` in a modern browser to view the portfolio. Open `project/index.html` to use the assistant. Both run directly from `file://`; no build step, package installation, backend, or server is required.

## Deploy on GitHub Pages

1. Push the repository contents, including both the portfolio root and `project/`, to the `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. The portfolio will be published at the URL below; its assistant link points to the `project/` subdirectory.

## Add the lecturer as a collaborator

In the repository, open **Settings → Collaborators → Add people** and invite `stanslausphillimon@gmail.com`.

## Project links

- GitHub repo: [https://github.com/desire1515/medical-info-assistant](https://github.com/desire1515/medical-info-assistant)
- Live portfolio: [https://desire1515.github.io/medical-info-assistant/](https://desire1515.github.io/medical-info-assistant/)
- Live assistant: [https://desire1515.github.io/medical-info-assistant/project/](https://desire1515.github.io/medical-info-assistant/project/)

## Rules

The emergency rule is a safety gate checked before all other rules. Otherwise, matching rules are considered in ascending priority order; the first matching rule is returned.

| Priority | Rule ID | Match condition | Urgency | General action |
|---:|---|---|---|---|
| 1 | `emergency_red_flag` | Any emergency warning sign selected | Emergency | Seek emergency care at the nearest health facility now. |
| 2 | `fever_extended` | Fever selected and duration is medium or long | See a clinician soon | Contact a health worker soon so the fever can be assessed. |
| 2 | `cough_extended` | Cough selected and duration is long | See a clinician soon | Contact a health worker soon to discuss the ongoing cough. |
| 3 | `diarrhea_or_vomiting` | Diarrhea or vomiting selected | Routine appointment | Arrange a routine appointment or consult a local health worker for guidance. |
| 3 | `headache_extended` | Headache selected and duration is not short | Routine appointment | Arrange a routine appointment so a health worker can assess the ongoing headache. |
| 4 | `rash_or_fatigue` | Rash or fatigue selected | General guidance | Monitor your symptoms and consult a health worker if you are concerned or they worsen. |

If no rule matches, the assistant uses a general fallback and suggests contacting a local health worker if concerned. The About page generates its rule table directly from the project knowledge base.

## Safety & disclaimer

This educational prototype provides general health information and care-navigation suggestions only. It is not a medical device, does not provide a diagnosis, and is not a substitute for an individual assessment or advice from a qualified health worker. The rules are simplified and may not cover your situation. Do not delay seeking urgent or emergency care to use this website. If you are concerned, contact a qualified local health worker or visit a health facility. No personal health information is stored or transmitted by the site. Malawi resource availability may vary; confirm with official sources.

## Tech stack

HTML5, CSS3, and vanilla JavaScript (ES2020). There are no frameworks, build tools, external JavaScript libraries, or backend services. Google Fonts is an optional font enhancement; system fonts are used as fallback.

## Author

Desire Chimtsitsi · Reg No: 23311351018 · Project 10

## License

No license is provided. Add a license file if you wish to grant reuse permissions.
