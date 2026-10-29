'use strict';
// Atualizado pela rotina Atualizar Mesa PWA a partir dos conectores (29/10/2026).
window.MESA = {
  "maestro": "grokbot://app/v1/agent?id=2f98b868-c849-4445-87b9-d95e4dbe4141",
  "items": [
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
      "id": "hermes",
      "title": "Hermes",
      "subtitle": "Instalado 25/10 · gateway parado",
      "action": null,
      "reply": "Mesa: religar o gateway do Hermes (Telegram) no box e me confirmar quando estiver no ar.",
      "deep_link": null,
      "draft": false,
      "done": true
    },
    {
      "id": "sidnei",
      "title": "Sidnei · FLT1B27",
      "subtitle": "Rascunho isenção · aprovar envio",
      "action": "Abrir rascunho",
      "reply": "Mesa: abrir rascunho Sidnei (isenção FLT1B27) pra eu aprovar o envio.",
      "deep_link": "https://mail.google.com/mail/?authuser=jhonyo@gmail.com#drafts?compose=r5809623130021857844",
      "draft": true
    },
    {
      "id": "marta",
      "title": "Marta · FLT1B27",
      "subtitle": "Rascunho isenção · aprovar envio",
      "action": "Abrir rascunho",
      "reply": "Mesa: abrir rascunho Marta (isenção FLT1B27) pra eu aprovar o envio.",
      "deep_link": "https://mail.google.com/mail/?authuser=jhonyo@gmail.com#drafts?compose=r8486347514203437937",
      "draft": true
    },
    {
      "id": "sidnei-serpro",
      "title": "Sidnei · SERPRO",
      "subtitle": "Rascunho certificado TPA · aprovar envio",
      "action": "Abrir rascunho",
      "reply": "Mesa: abrir rascunho Sidnei (renovação certificado SERPRO da TPA) pra eu aprovar o envio.",
      "deep_link": "https://mail.google.com/mail/?authuser=jhonyo@gmail.com#drafts?compose=r-3481694404499593999",
      "draft": true
    }
  ]
};
'use strict';

function boot() {
  if (!window.MESA || !Array.isArray(window.MESA.items)) {
    const list = document.getElementById('pending-list');
    if (list) list.innerHTML = '<p class="footnote">Falha ao carregar pendências. Puxe pra atualizar.</p>';
    throw new Error('MESA data missing');
  }

  const { items, maestro } = window.MESA;
  const dialog = document.querySelector('#maestro-dialog');
  const replyText = document.querySelector('#reply-text');
  const copyStatus = document.querySelector('#copy-status');
  const pendingList = document.querySelector('#pending-list');
  const draftList = document.querySelector('#draft-list');
  if (!pendingList || !draftList || !dialog) {
    throw new Error('Mesa DOM incompleto');
  }
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

  pendingList.replaceChildren();
  draftList.replaceChildren();
  items.filter(item => !item.draft && !item.done).forEach((item, i) => pendingList.append(renderRow(item, i)));
  items.filter(item => item.draft).forEach((item, i) => draftList.append(renderRow(item, i)));

  const tabs = [...document.querySelectorAll('[data-tab]')];
  function selectTab(name, focus) {
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
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  document.querySelector('#copy-reply').addEventListener('click', async () => {
    const text = replyText.value;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = 'Mensagem copiada. Cole na conversa com Maestro.';
    } catch (err) {
      replyText.focus();
      replyText.select();
      replyText.setSelectionRange(0, text.length);
      let copied = false;
      try { copied = document.execCommand('copy'); } catch (e) { /* Keep text selected for manual copy. */ }
      copyStatus.textContent = copied ? 'Mensagem copiada. Cole na conversa com Maestro.' : 'Toque e segure o texto selecionado e escolha Copiar.';
    }
  });

  function updateDate() {
    const date = new Date();
    const today = document.querySelector('#today');
    today.dateTime = date.toISOString();
    today.textContent = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
