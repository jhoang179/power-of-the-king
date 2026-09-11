const STORAGE_KEY = 'power-of-the-king-save';

const attributeDetails = {
  jawline: { label: 'Jawline', description: 'First impressions' },
  abs: { label: 'Abs', description: 'Quiet confidence' },
  technique: { label: 'Pulling Technique', description: 'Social instincts' }
};

const seanAttributes = { jawline: 10, abs: 10, technique: 9 };

const venues = {
  rooftop: {
    name: 'Rooftop',
    description: 'Music, city lights, and a loose circle of new people.',
    prospects: [
      { id: 'hannah', name: 'Hannah', detail: 'PHD Student · affinity for the arts', style: 'coral' },
      { id: 'leah', name: 'Leah', detail: 'Nurse · intelligence of a pig', style: 'yellow' }
    ]
  },
  cafe: {
    name: 'Café',
    description: 'A bright neighborhood spot where conversation comes easy.',
    prospects: [
      { id: 'sierra', name: 'Sierra', detail: 'Insurance Agent · never been rejected', style: 'sage' },
      { id: 'ashley', name: 'Ashley', detail: 'HR · home body', style: 'blue' }
    ]
  },
  arcade: {
    name: 'Arcade',
    description: 'Friendly competition, loud games, and instant icebreakers.',
    prospects: [
      { id: 'julia', name: 'Julia', detail: 'Game designer · undefeated at pinball', style: 'blue' },
      { id: 'jackie', name: 'Jackie', detail: 'Musician · has excellent taste', style: 'coral' }
    ]
  },
  gallery: {
    name: 'Gallery',
    description: 'A quiet opening full of strange art and strong opinions.',
    prospects: [
      { id: 'ava', name: 'Ava', detail: 'Curator · asks thoughtful questions', style: 'yellow' },
      { id: 'brooke', name: 'Brooke', detail: 'Illustrator · loves bold ideas', style: 'sage' }
    ]
  }
};

const replacementNames = ['Camille', 'Dani', 'Erin', 'Jade', 'Kenzie', 'Morgan', 'Riley', 'Taylor', 'Valerie', 'Whitney'];
const replacementDetails = [
  'Creative · always has a story',
  'Designer · quick with a comeback',
  'Researcher · notices the little things',
  'Entrepreneur · impossible to bore',
  'Photographer · sees the room differently'
];

function createInitialRoster() {
  return Object.fromEntries(Object.entries(venues).map(([venueKey, venue]) => [
    venueKey,
    { prospects: structuredClone(venue.prospects) }
  ]));
}

const defaultState = {
  statsVersion: 3,
  originComplete: false,
  originStage: 0,
  snapchats: 0,
  bodies: 0,
  upgradePoints: 3,
  seanStolen: 0,
  talking: [],
  interactions: {},
  retiredProspects: [],
  replacementIndex: 0,
  roster: createInitialRoster(),
  prospectDirectory: Object.fromEntries(Object.values(venues).flatMap((venue) => venue.prospects).map((prospect) => [prospect.id, prospect])),
  attributes: { jawline: 1, abs: 1, technique: 1 },
  log: [
    '<strong>Origin:</strong> Dylan makes a move. Sean gets there first.',
    '<strong>Origin:</strong> Dylan tries again. Sean wins the second round too.'
  ]
};

let state = loadState();
let selectedLocation = 'rooftop';
let selectedProspect = null;

const elements = {
  attributes: document.querySelector('#attributes'),
  seanAttributes: document.querySelector('#sean-attributes'),
  snapchats: document.querySelector('#snapchats'),
  bodies: document.querySelector('#bodies'),
  seanStolen: document.querySelector('#sean-stolen'),
  upgradePoints: document.querySelector('#upgrade-points'),
  rivalStatus: document.querySelector('#rival-status'),
  eventLog: document.querySelector('#event-log'),
  eventModal: document.querySelector('#event-modal'),
  eventModalKicker: document.querySelector('#event-modal-kicker'),
  eventCount: document.querySelector('#event-count'),
  eventModalDate: document.querySelector('#event-modal-date'),
  eventModalTitle: document.querySelector('#event-modal-title'),
  eventModalCopy: document.querySelector('#event-modal-copy'),
  eventModalResult: document.querySelector('#event-modal-result'),
  originButton: document.querySelector('#origin-button'),
  venueName: document.querySelector('#venue-name'),
  venueDescription: document.querySelector('#venue-description'),
  prospects: document.querySelector('#prospects'),
  selectionStatus: document.querySelector('#selection-status'),
  interestMeter: document.querySelector('#interest-meter'),
  interestActions: document.querySelector('#interest-actions'),
  snapchatButton: document.querySelector('#snapchat-button'),
  talkingList: document.querySelector('#talking-list')
};

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!savedState) return structuredClone(defaultState);
    const loadedState = {
      ...defaultState,
      ...savedState,
      originComplete: savedState.originComplete ?? true,
      originStage: savedState.originStage ?? 2,
      snapchats: savedState.snapchats ?? 0,
      bodies: savedState.bodies ?? savedState.connections ?? 0,
      talking: Array.isArray(savedState.talking) ? savedState.talking : [],
      interactions: savedState.interactions ?? {},
      retiredProspects: Array.isArray(savedState.retiredProspects) ? savedState.retiredProspects : [],
      replacementIndex: savedState.replacementIndex ?? 0,
      roster: Object.fromEntries(Object.entries(venues).map(([venueKey, venue]) => [
        venueKey,
        { prospects: savedState.roster?.[venueKey]?.prospects ?? structuredClone(venue.prospects) }
      ])),
      prospectDirectory: savedState.prospectDirectory ?? defaultState.prospectDirectory,
      attributes: { ...defaultState.attributes, ...savedState.attributes }
    };
    if (savedState.statsVersion !== defaultState.statsVersion) loadedState.attributes = { ...defaultState.attributes };
    return loadedState;
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function findProspect(prospectId) {
  return state.prospectDirectory[prospectId];
}

function findVenueForProspect(prospectId) {
  return Object.entries(state.roster).find(([, venue]) => venue.prospects.some((prospect) => prospect.id === prospectId));
}

function createReplacement() {
  const occupiedNames = Object.values(state.prospectDirectory).map((prospect) => prospect.name);
  const availableNames = replacementNames.filter((name) => !occupiedNames.includes(name));
  const name = availableNames[Math.floor(Math.random() * availableNames.length)] || `New Prospect ${state.replacementIndex + 1}`;
  const id = `${name.toLowerCase().replaceAll(' ', '-')}-${state.replacementIndex}`;
  const replacement = {
    id,
    name,
    detail: replacementDetails[Math.floor(Math.random() * replacementDetails.length)],
    style: ['coral', 'yellow', 'sage', 'blue'][Math.floor(Math.random() * 4)]
  };
  state.replacementIndex += 1;
  state.prospectDirectory[id] = replacement;
  return replacement;
}

function rotateProspect(prospectId) {
  const venueEntry = findVenueForProspect(prospectId);
  if (!venueEntry) return null;
  const [venueKey, venue] = venueEntry;
  venue.prospects = venue.prospects.filter((prospect) => prospect.id !== prospectId);
  state.retiredProspects.push(prospectId);
  delete state.interactions[prospectId];
  const replacement = createReplacement();
  state.roster[venueKey].prospects.push(replacement);
  return replacement;
}

function getInteraction(prospectId) {
  if (!state.interactions[prospectId]) state.interactions[prospectId] = { interest: 0, used: [] };
  return state.interactions[prospectId];
}

function render() {
  const attributesAtFive = Object.values(state.attributes).every((value) => value >= 5);
  const rivalStatus = state.attributes.technique === 10
    ? 'Sean is worried'
    : attributesAtFive
      ? 'Sean is getting nervous'
      : 'Sean is ready to pounce';
  elements.rivalStatus.textContent = rivalStatus;
  const originEvents = [
    {
      date: "Sean's Big Day",
      title: "New Year's Eve Party",
      copy: 'Dylan spots Sophia across the party. Before he can make his move, Sean sweeps in and steals the moment.',
      result: 'Sean steals Sophia.'
    },
    {
      date: "Sleepover at Sean's",
      title: "Bonfire at Sean's House",
      copy: 'A week later, Dylan connects with Lexie by the bonfire. Sean sees the opening and takes over the conversation.',
      result: 'Sean steals Lexie.'
    }
  ];
  const originEvent = originEvents[state.originStage] || originEvents[1];
  elements.eventModal.hidden = state.originComplete;
  elements.eventModalKicker.textContent = state.originStage < 2 ? 'The origin story' : 'The comeback begins';
  elements.eventCount.textContent = state.originStage < 2 ? `${state.originStage + 1} / 2` : '2 / 2';
  elements.eventModalDate.textContent = state.originStage < 2 ? originEvent.date : 'Your turn';
  elements.eventModalTitle.textContent = state.originStage < 2 ? originEvent.title : 'No more easy wins for Sean.';
  elements.eventModalCopy.textContent = state.originStage < 2 ? originEvent.copy : "Sophia and Lexie are gone, but Dylan is done watching Sean win. Upgrade Dylan's Attributes so this never happens again.";
  elements.eventModalResult.textContent = state.originStage < 2 ? originEvent.result : 'Get your revenge.';
  elements.originButton.innerHTML = state.originStage < 2 ? 'See what happens next <span aria-hidden="true">↗</span>' : 'Start Dylan\'s comeback <span aria-hidden="true">↗</span>';
  elements.snapchats.textContent = state.snapchats;
  elements.bodies.textContent = state.bodies;
  elements.seanStolen.textContent = state.seanStolen;
  elements.upgradePoints.textContent = state.upgradePoints;
  const venue = venues[selectedLocation];
  const roster = state.roster[selectedLocation];
  elements.venueName.textContent = venue.name;
  elements.venueDescription.textContent = venue.description;
  elements.prospects.innerHTML = roster.prospects.filter((prospect) => !state.talking.includes(prospect.id)).map((prospect) => `<button class="prospect ${selectedProspect === prospect.id ? 'selected' : ''}" data-prospect="${prospect.id}" type="button"><span class="prospect-avatar ${prospect.style}" aria-hidden="true">${prospect.name[0]}</span><span><strong>${prospect.name}</strong><small>${prospect.detail}</small></span><span class="prospect-arrow" aria-hidden="true">→</span></button>`).join('');
  const interaction = selectedProspect ? getInteraction(selectedProspect) : null;
  const interest = interaction?.interest || 0;
  elements.interestMeter.innerHTML = Array.from({ length: 3 }, (_, index) => `<span class="${index < interest ? 'active' : ''}"></span>`).join('');
  elements.interestActions.hidden = !selectedProspect || interest >= 3;
  elements.interestActions.querySelectorAll('[data-action]').forEach((button) => {
    button.disabled = !selectedProspect || interest >= 3 || interaction.used.includes(button.dataset.action);
  });
  elements.snapchatButton.disabled = !selectedProspect || interest < 3;
  const talkingProspects = state.talking.map((id) => findProspect(id)).filter(Boolean);
  elements.talkingList.innerHTML = talkingProspects.length ? talkingProspects.map((prospect) => `<article class="talking-card"><span class="prospect-avatar ${prospect.style}" aria-hidden="true">${prospect.name[0]}</span><div><strong>${prospect.name}</strong><small>${prospect.detail}</small></div><button class="interest-button" data-interest="${prospect.id}" type="button">Show interest <span aria-hidden="true">↗</span></button></article>`).join('') : '<p class="talking-empty">No one is in the talking phase yet. Ask for a Snapchat to start something.</p>';
  document.querySelectorAll('[data-location]').forEach((button) => button.classList.toggle('active', button.dataset.location === selectedLocation));
  elements.selectionStatus.textContent = selectedProspect
    ? interest >= 3 ? 'Interest is full. Ask for her Snapchat.' : `Build interest: ${interest}/3`
    : 'Choose someone to approach.';
  elements.attributes.innerHTML = renderAttributes(state.attributes, true);
  elements.seanAttributes.innerHTML = renderAttributes(seanAttributes, false);
  elements.eventLog.innerHTML = state.log.map((entry) => `<li>${entry}</li>`).join('');
}

function renderAttributes(attributes, canUpgrade) {
  return Object.entries(attributeDetails).map(([key, detail]) => {
    const value = attributes[key];
    const maximum = canUpgrade && key !== 'technique' ? 9 : 10;
    const segments = Array.from({ length: maximum }, (_, index) => `<i class="${index < value ? 'active' : ''}"></i>`).join('');
    const upgradeButton = canUpgrade ? `<button class="upgrade-button" data-attribute="${key}" type="button" ${state.upgradePoints === 0 || value >= maximum ? 'disabled' : ''}>Upgrade +1</button>` : '<span class="locked-stat">Locked</span>';
    const limitNote = canUpgrade && (key === 'jawline' || key === 'abs')
      ? `<div class="ability-note"><strong>${detail.label} Limit</strong><ul><li>Dylan cannot reach 10/10.</li><li>Sean's ${detail.label} ${key === 'abs' ? 'are' : 'is'} out of this world.</li></ul></div>`
      : '';
    const abilityNote = canUpgrade && key === 'technique'
      ? `<div class="ability-note"><strong>${value === 10 ? 'Dyl Trance unlocked.' : 'Dyl Trance Ability:'}</strong><ul><li>When unlocked, it doubles your success rate asking for a Snapchat and showing interest in a Talking Stage.</li><li>Unlocks at 10/10 Pulling Technique.</li></ul></div>`
      : '';
    return `<article class="attribute"><div class="attribute-top"><span class="attribute-name">${detail.label}</span><span class="attribute-value">${value}/${maximum}</span></div><div class="meter" aria-label="${detail.label}: ${value} out of ${maximum}">${segments}</div>${upgradeButton}${limitNote}${abilityNote}</article>`;
  }).join('');
}

function addLog(message, tone = '') {
  state.log.unshift(`<span class="${tone}">${message}</span>`);
  state.log = state.log.slice(0, 5);
}

function rollSuccess(score, threshold, spread) {
  const baseChance = Math.min(1, Math.max(0, (score + spread - threshold) / spread));
  const successChance = state.attributes.technique === 10 ? Math.min(1, baseChance * 2) : baseChance;
  return Math.random() < successChance;
}

const interactionDetails = {
  question: 'Dylan asks a thoughtful question and keeps the conversation moving.',
  humor: 'Dylan finds a shared joke and gets her laughing.',
  confidence: 'Dylan brings confident energy without forcing the moment.'
};

function takeInterestAction(action) {
  if (!selectedProspect || !interactionDetails[action]) return;
  const interaction = getInteraction(selectedProspect);
  if (interaction.used.includes(action) || interaction.interest >= 3) return;
  interaction.used.push(action);
  interaction.interest += 1;
  addLog(`<strong>${findProspect(selectedProspect).name}:</strong> ${interactionDetails[action]}`);
  render();
  saveState();
}

function askForSnapchat() {
  const prospect = findProspect(selectedProspect);
  const interaction = getInteraction(selectedProspect);
  if (!prospect || interaction.interest < 3) return;
  const score = Object.values(state.attributes).reduce((total, value) => total + value, 0) / 3;
  const success = rollSuccess(score, 4.5, 3);

  if (success) {
    if (!state.talking.includes(prospect.id)) state.talking.push(prospect.id);
    state.snapchats += 1;
    state.upgradePoints += 1;
    addLog(`<strong>Snapchat secured:</strong> ${prospect.name} is now in the talking phase. You earned 1 Upgrade Point. Spend it on Dylan's Attributes.`, 'good');
  } else {
    const replacement = rotateProspect(prospect.id);
    addLog(`<strong>No Snapchat:</strong> ${prospect.name} is not feeling the approach. ${replacement.name} takes her place.`, 'bad');
  }
  selectedProspect = null;
  render();
  saveState();
}

function showInterest(prospectId) {
  const prospect = findProspect(prospectId);
  if (!prospect || !state.talking.includes(prospectId)) return;
  const averageAttribute = Object.values(state.attributes).reduce((total, value) => total + value, 0) / 3;
  const score = averageAttribute;
  const seanPressure = 4 + Math.max(0, 5 - averageAttribute) * 1.2 + Math.random() * 2.5;
  const success = rollSuccess(score, seanPressure, 2.5);

  state.talking = state.talking.filter((id) => id !== prospectId);
  if (success) {
    state.bodies += 1;
    state.upgradePoints += 1;
    const replacement = rotateProspect(prospect.id) || createReplacement();
    if (!findVenueForProspect(replacement.id)) state.roster[selectedLocation].prospects.push(replacement);
    addLog(`<strong>Body secured:</strong> ${prospect.name} chooses to keep seeing you. ${replacement.name} takes her place as a prospect.`, 'good');
  } else {
    state.seanStolen += 1;
    const replacement = rotateProspect(prospect.id);
    addLog(`<strong>Sean got his hands all over your sweet ${prospect.name}!</strong> ${replacement.name} takes her place as a prospect.`, 'bad');
  }
  render();
  saveState();
}

elements.attributes.addEventListener('click', (event) => {
  const button = event.target.closest('[data-attribute]');
  if (!button || state.upgradePoints === 0) return;
  const attribute = button.dataset.attribute;
  const maximum = attribute === 'technique' ? 10 : 9;
  if (state.attributes[attribute] >= maximum) return;
  const techniqueBeforeUpgrade = state.attributes.technique;
  state.attributes[attribute] += 1;
  state.upgradePoints -= 1;
  addLog(`<strong>Upgrade:</strong> Dylan puts work into his ${attributeDetails[attribute].label.toLowerCase()}.`);
  if (attribute === 'technique' && techniqueBeforeUpgrade < 10 && state.attributes.technique === 10) {
    addLog('<strong>Dyl Trance unlocked:</strong> Your Snapchat and Talking success rates are now doubled.', 'good');
  }
  render();
  saveState();
});

document.querySelectorAll('[data-location]').forEach((button) => {
  button.addEventListener('click', () => {
    selectedLocation = button.dataset.location;
    selectedProspect = null;
    elements.selectionStatus.textContent = 'Choose someone to approach.';
    render();
  });
});

elements.prospects.addEventListener('click', (event) => {
  const prospect = event.target.closest('[data-prospect]');
  if (!prospect) return;
  selectedProspect = prospect.dataset.prospect;
  const selected = findProspect(selectedProspect);
  elements.selectionStatus.textContent = `${selected.name} looks interesting. Ask for her Snapchat?`;
  render();
});

elements.interestActions.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) takeInterestAction(button.dataset.action);
});

elements.snapchatButton.addEventListener('click', askForSnapchat);

elements.talkingList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-interest]');
  if (button) showInterest(button.dataset.interest);
});

elements.originButton.addEventListener('click', () => {
  if (state.originStage < 2) {
    state.originStage += 1;
  } else {
    state.originComplete = true;
    addLog('<strong>Comeback begins:</strong> Upgrade Dylan and make Sean regret those first two wins.', 'good');
  }
  render();
  saveState();
});

document.querySelector('#reset-button').addEventListener('click', () => {
  state = structuredClone(defaultState);
  selectedLocation = 'rooftop';
  selectedProspect = null;
  render();
  saveState();
});

render();