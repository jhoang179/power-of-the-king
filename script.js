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
      { id: 'leah', name: 'Leah', detail: 'HR · home body', style: 'blue' }
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

const defaultState = {
  statsVersion: 3,
  originComplete: false,
  originStage: 0,
  snapchats: 0,
  bodies: 0,
  upgradePoints: 3,
  seanStolen: 0,
  talking: [],
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
  abilityNote: document.querySelector('#ability-note'),
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

function render() {
  const originEvents = [
    {
      date: "New Year's Eve party",
      title: 'The countdown is on.',
      copy: 'Dylan spots Sophia across the party. Before he can make his move, Sean sweeps in and steals the moment.',
      result: 'Sean steals Sophia.'
    },
    {
      date: "Bonfire at Sean's house",
      title: 'The fire burns brighter.',
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
  elements.venueName.textContent = venue.name;
  elements.venueDescription.textContent = venue.description;
  elements.prospects.innerHTML = venue.prospects.map((prospect) => `<button class="prospect ${selectedProspect === prospect.id ? 'selected' : ''}" data-prospect="${prospect.id}" type="button"><span class="prospect-avatar ${prospect.style}" aria-hidden="true">${prospect.name[0]}</span><span><strong>${prospect.name}</strong><small>${prospect.detail}</small></span><span class="prospect-arrow" aria-hidden="true">→</span></button>`).join('');
  elements.snapchatButton.disabled = !selectedProspect;
  const talkingProspects = state.talking.map((id) => Object.values(venues).flatMap((item) => item.prospects).find((prospect) => prospect.id === id)).filter(Boolean);
  elements.talkingList.innerHTML = talkingProspects.length ? talkingProspects.map((prospect) => `<article class="talking-card"><span class="prospect-avatar ${prospect.style}" aria-hidden="true">${prospect.name[0]}</span><div><strong>${prospect.name}</strong><small>${prospect.detail}</small></div><button class="interest-button" data-interest="${prospect.id}" type="button">Show interest <span aria-hidden="true">↗</span></button></article>`).join('') : '<p class="talking-empty">No one is in the talking phase yet. Ask for a Snapchat to start something.</p>';
  document.querySelectorAll('[data-location]').forEach((button) => button.classList.toggle('active', button.dataset.location === selectedLocation));
  elements.attributes.innerHTML = renderAttributes(state.attributes, true);
  const tranceUnlocked = state.attributes.technique === 10;
  elements.abilityNote.hidden = false;
  elements.abilityNote.innerHTML = tranceUnlocked
    ? '<strong>Dyl Trance unlocked.</strong> Your success rate in Snapchat and Talking is doubled.'
    : '<strong>Dyl Trance unlocks at Pulling Technique 10/10.</strong> When unlocked, it doubles your success rate in Snapchat and Talking.';
  elements.seanAttributes.innerHTML = renderAttributes(seanAttributes, false);
  elements.eventLog.innerHTML = state.log.map((entry) => `<li>${entry}</li>`).join('');
}

function renderAttributes(attributes, canUpgrade) {
  return Object.entries(attributeDetails).map(([key, detail]) => {
    const value = attributes[key];
    const maximum = canUpgrade && key !== 'technique' ? 9 : 10;
    const segments = Array.from({ length: maximum }, (_, index) => `<i class="${index < value ? 'active' : ''}"></i>`).join('');
    const upgradeButton = canUpgrade ? `<button class="upgrade-button" data-attribute="${key}" type="button" ${state.upgradePoints === 0 || value >= maximum ? 'disabled' : ''}>Upgrade +1</button>` : '<span class="locked-stat">Locked</span>';
    return `<article class="attribute"><div class="attribute-top"><span class="attribute-name">${detail.label}</span><span class="attribute-value">${value}/${maximum}</span></div><div class="meter" aria-label="${detail.label}: ${value} out of ${maximum}">${segments}</div>${upgradeButton}</article>`;
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

function askForSnapchat() {
  const prospect = Object.values(venues).flatMap((venue) => venue.prospects).find((item) => item.id === selectedProspect);
  const score = Object.values(state.attributes).reduce((total, value) => total + value, 0) / 3;
  const success = rollSuccess(score, 4.5, 3);

  if (success) {
    if (!state.talking.includes(prospect.id)) state.talking.push(prospect.id);
    state.snapchats += 1;
    addLog(`<strong>Snapchat secured:</strong> ${prospect.name} is now in the talking phase. Sean has not noticed yet.`, 'good');
  } else {
    addLog(`<strong>No Snapchat:</strong> ${prospect.name} is not feeling the approach. Try a different person or upgrade Dylan.`, 'bad');
  }
  selectedProspect = null;
  render();
  saveState();
}

function showInterest(prospectId) {
  const prospect = Object.values(venues).flatMap((venue) => venue.prospects).find((item) => item.id === prospectId);
  if (!prospect || !state.talking.includes(prospectId)) return;
  const averageAttribute = Object.values(state.attributes).reduce((total, value) => total + value, 0) / 3;
  const score = averageAttribute;
  const seanPressure = 4 + Math.max(0, 5 - averageAttribute) * 1.2 + Math.random() * 2.5;
  const success = rollSuccess(score, seanPressure, 2.5);

  state.talking = state.talking.filter((id) => id !== prospectId);
  if (success) {
    state.bodies += 1;
    state.upgradePoints += 1;
    addLog(`<strong>Body secured:</strong> ${prospect.name} chooses to keep seeing you. You earn an upgrade point.`, 'good');
  } else {
    state.seanStolen += 1;
    addLog(`<strong>Sean gets there first:</strong> He steals ${prospect.name} after you show interest.`, 'bad');
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
  const selected = venues[selectedLocation].prospects.find((item) => item.id === selectedProspect);
  elements.selectionStatus.textContent = `${selected.name} looks interesting. Ask for her Snapchat?`;
  render();
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