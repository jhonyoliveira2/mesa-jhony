'use strict';
// Links e respostas copiados literalmente de BRIEF.md.
window.MESA = {
  "maestro": "grokbot://app/v1/agent?id=2f98b868-c849-4445-87b9-d95e4dbe4141",
  "items": [
    {
      "id": "oficio",
      "title": "Ofício 11 Asten",
      "subtitle": "Assinar · Ofício 11/2026",
      "action": "Assinar",
      "reply": "Mesa: abrir assinatura Asten do Ofício 11/2026 e me lembrar se falta algo depois de assinar.",
      "deep_link": "https://plataforma.astenassinatura.com.br/assinar/ecoubatuba/cnJWYTFnYjJCTkhzUCtoUTFlekdSTnJFUHRpTnJqUVBubi1PSDFwRmpidXlsQVREbE1zYnFpbkZ2UU1OSE1vT3JGZ1VRUEY0Y3lwNzctaVN1eHVZUmJSMmpHTmc4NUFObnlqUUhHT0pOUyt3TmhkRStnaS1XeTRYeCtDS01XTlRSUHl5MTEwU2J6TEhIdlJqM2RjdG1ORWVqZnFYdmNPcHVzUHN4dHZkYitEc1ZWVWlJRk1xbjVlZVc1cjhWaVVRbFR3WU80djI2WnEtY0orWnNBRkVGVnFySzYwT3RVTHZSdEJNWGVQbzcwUDlHZG0tbXdHb3phS3pVZG9RcVJQZQ==",
      "draft": false
    },
    {
      "id": "samir",
      "title": "Samir rascunho",
      "subtitle": "Aprovar envio · e-TCESP",
      "action": "Abrir rascunho",
      "reply": "Mesa: abrir o rascunho Samir e-TCESP pra eu aprovar o envio.",
      "deep_link": "https://mail.google.com/mail/?authuser=jhonyo@gmail.com#drafts?compose=r8161082055109136667",
      "draft": false
    },
    {
      "id": "primacial",
      "title": "Primacial #9104688",
      "subtitle": "Confirmar compra / entrega",
      "action": "Acompanhar",
      "reply": "Mesa: abrir acompanhamento Primacial #9104688 pra eu confirmar a compra/entrega.",
      "deep_link": "https://primacial.com.br/checkout/v3/success/2101000556/ac34d0c65fa03799e457c81cf01621b15c312c57",
      "draft": false
    },
    {
      "id": "ana",
      "title": "Ana Marta v02",
      "subtitle": "Validar · Contraminuta",
      "action": "Abrir documento",
      "reply": "Mesa: abrir Contraminuta Ana Marta v02 pra eu validar antes de protocolar.",
      "deep_link": "https://docs.google.com/document/d/1HfAAUpA1GBUPDqG4c925yaPhAt0JfwVi/edit",
      "draft": false
    },
    {
      "id": "ricardo",
      "title": "Ricardo Emilio",
      "subtitle": "Autorizar pedido a–f",
      "action": "Abrir card",
      "reply": "Mesa: abrir card Emilio pra eu autorizar o pedido a–f ao Ricardo.",
      "deep_link": "https://trello.com/c/vJnSV7we",
      "draft": false
    },
    {
      "id": "sjb",
      "title": "SJB Meet",
      "subtitle": "Onboarding · 28/10, 8h–12h",
      "action": "Entrar na reunião",
      "reply": "Mesa: abrir Meet Onboarding SJB (28/10 8h–12h).",
      "deep_link": "https://meet.google.com/tsx-qtjn-rcp",
      "draft": false
    },
    {
      "id": "hermes",
      "title": "Hermes",
      "subtitle": "Instalar · aguarda créditos",
      "action": null,
      "reply": "Mesa: quando os créditos voltarem, me lembre de instalar o Hermes Agente no box.",
      "deep_link": null,
      "draft": false
    },
    {
      "id": "sidnei",
      "title": "Sidnei",
      "subtitle": "Rascunho · aprovar envio",
      "action": "Abrir rascunho",
      "reply": "Mesa: abrir rascunho … pra eu aprovar o envio.",
      "deep_link": "https://mail.google.com/mail/?authuser=jhonyo@gmail.com#drafts?compose=r5809623130021857844",
      "draft": true
    },
    {
      "id": "marta",
      "title": "Marta",
      "subtitle": "Rascunho · aprovar envio",
      "action": "Abrir rascunho",
      "reply": "Mesa: abrir rascunho … pra eu aprovar o envio.",
      "deep_link": "https://mail.google.com/mail/?authuser=jhonyo@gmail.com#drafts?compose=r8486347514203437937",
      "draft": true
    }
  ]
};
'use strict';

if (!window.MESA || !Array.isArray(window.MESA.items)) {
  document.getElementById('pending-list').innerHTML = '<p class="footnote">Falha ao carregar pendências. Puxe pra atualizar.</p>';
  throw new Error('MESA data missing');
}
const { items, maestro } = window.MESA;
const dialog = document.querySelector('#maestro-dialog');
const replyText = document.querySelector('#reply-text');
const copyStatus = document.querySelector('#copy-status');
let opener;

function showReply(item, source) {
  opener = source;
  document.querySelector('#dialog-title').textContent = item.title;
  replyText.value = item.reply;
  copyStatus.textContent = '';
  if (!dialog.open) dialog.showModal();
}

function wireMaestro(anchor, item) {
  anchor.href = maestro;
  anchor.addEventListener('click', () => showReply(item, anchor));
  // Keep the real href and native navigation; the fallback remains visible on return.
}

function renderRow(item, index) {
  const row = document.createElement('article');
  row.className = 'pending-row' + (item.id === 'hermes' ? ' hermes' : '');
  const number = document.createElement('span');
  number.className = 'row-number';
  number.textContent = String(index + 1).padStart(2, '0');
  number.setAttribute('aria-hidden', 'true');
  const primary = document.createElement(item.deep_link ? 'a' : 'div');
  primary.className = item.deep_link ? 'primary-link' : 'row-content';
  if (item.deep_link) {
    primary.href = item.deep_link;
    primary.target = '_blank';
    primary.rel = 'noopener noreferrer';
    primary.setAttribute('aria-label', `${item.action}: ${item.title} (nova aba)`);
  }
  const title = document.createElement('span');
  title.className = 'row-title';
  title.textContent = item.title;
  const subtitle = document.createElement('span');
  subtitle.className = 'row-subtitle';
  subtitle.textContent = item.subtitle;
  primary.append(title, subtitle);
  const secondary = document.createElement('a');
  secondary.className = 'maestro-link';
  secondary.textContent = 'Com Maestro';
  secondary.setAttribute('aria-label', `Com Maestro: ${item.title}`);
  wireMaestro(secondary, item);
  row.append(number, primary, secondary);
  return row;
}

items.filter(item => !item.draft).forEach((item, i) => document.querySelector('#pending-list').append(renderRow(item, i)));
items.filter(item => item.draft).forEach((item, i) => document.querySelector('#draft-list').append(renderRow(item, i)));

const tabs = [...document.querySelectorAll('[data-tab]')];
function selectTab(name, focus = false) {
  const selected = tabs.find(tab => tab.dataset.tab === name) || tabs[0];
  tabs.forEach(tab => {
    const active = tab === selected;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  document.querySelector('main').scrollTop = 0;
  if (focus) selected.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    history.replaceState(null, '', '#' + tab.dataset.tab);
    selectTab(tab.dataset.tab);
  });
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].click();
    tabs[next].focus();
  });
});
window.addEventListener('hashchange', () => selectTab(location.hash.slice(1)));
selectTab(location.hash.slice(1));

document.querySelector('#open-maestro').href = maestro;
document.querySelector('#maestro-system-link').href = maestro;
wireMaestro(document.querySelector('#hermes-system-link'), items.find(item => item.id === 'hermes'));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => opener?.focus());
document.querySelector('#copy-reply').addEventListener('click', async () => {
  const text = replyText.value;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Área de transferência indisponível');
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Mensagem copiada. Cole na conversa com Maestro.';
  } catch {
    replyText.focus();
    replyText.select();
    replyText.setSelectionRange(0, text.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Keep text selected for manual copy. */ }
    copyStatus.textContent = copied ? 'Mensagem copiada. Cole na conversa com Maestro.' : 'Toque e segure o texto selecionado e escolha Copiar.';
  }
});

function updateDate() {
  const date = new Date();
  document.querySelector('#today').dateTime = date.toISOString();
  document.querySelector('#today').textContent = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
}
function updateConnection() {
  document.querySelector('#connection-label').textContent = navigator.onLine ? 'Com conexão' : 'Sem conexão';
  document.querySelector('#connection-led').classList.toggle('red', !navigator.onLine);
}
updateDate();
updateConnection();
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { updateDate(); updateConnection(); } });

let installPrompt;
const installButton = document.querySelector('#install-button');
function showInstalled() {
  installButton.hidden = true;
  document.querySelector('#installed-label').hidden = false;
}
if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) showInstalled();
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});
window.addEventListener('appinstalled', showInstalled);

const shellStatus = document.querySelector('#shell-status');
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
    shellStatus.textContent = 'Mesa disponível sem conexão. Links externos precisam de acesso à internet.';
  }).catch(() => {
    shellStatus.textContent = 'Acesso sem conexão indisponível neste navegador.';
    document.querySelector('#shell-led').classList.add('red');
  });
} else {
  shellStatus.textContent = 'Acesso sem conexão requer HTTPS ou localhost.';
  document.querySelector('#shell-led').classList.add('red');
}
