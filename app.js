'use strict';
const M = window.MESA;
const fila = document.getElementById('fila');
const frota = document.getElementById('frota');
const dlg = document.getElementById('dlg');
const dlgTitle = document.getElementById('dlg-title');
const dlgText = document.getElementById('dlg-text');
const dlgStatus = document.getElementById('dlg-status');
const dlgOpen = document.getElementById('dlg-open');
dlgOpen.href = M.maestro;

document.getElementById('meta').textContent =
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date()) +
  ' · ' + M.items.length + ' itens';

function openMaestro(item) {
  dlgTitle.textContent = item.title;
  dlgText.value = item.reply;
  dlgStatus.textContent = '';
  dlg.showModal();
}

document.getElementById('dlg-copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(dlgText.value);
    dlgStatus.textContent = 'Copiado. Cole no Maestro.';
  } catch {
    dlgText.select();
    dlgStatus.textContent = 'Selecione e copie manualmente.';
  }
};

function row(item) {
  const el = document.createElement('article');
  el.className = 'row';
  const body = item.deep_link
    ? `<a class="action" href="${item.deep_link}" target="_blank" rel="noopener noreferrer"><span class="t go">${item.title}</span><span class="s">${item.subtitle}</span></a>`
    : `<div class="action"><span class="t">${item.title}</span><span class="s">${item.subtitle}</span></div>`;
  el.innerHTML = `${body}<div class="side"><button type="button" data-m>Maestro</button></div>`;
  el.querySelector('[data-m]').onclick = () => openMaestro(item);
  return el;
}

M.items.forEach((item) => fila.appendChild(row(item)));
fila.insertAdjacentHTML('beforeend', '<p class="note">Toque no título abre a ação. Maestro copia a mensagem se o app não abrir.</p>');

const bots = [
  ['Auditor', true], ['Maestro', true], ['Eco', true], ['OTIMIZA', true],
  ['IAGOV PO', true], ['IAGov QA', true], ['Advocacia', true], ['e-mail e zap', true],
  ['Acesso Remoto', true], ['Financeiro', false], ['Doméstico', true],
];
bots.forEach(([name, on]) => {
  const el = document.createElement('div');
  el.className = 'bot';
  el.innerHTML = `<span>${name}</span><span class="led${on ? '' : ' off'}" aria-label="${on ? 'em operação' : 'pausado'}"></span>`;
  frota.appendChild(el);
});

document.querySelectorAll('.tabs button').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('.tabs button').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
    });
    fila.hidden = btn.dataset.tab !== 'fila';
    frota.hidden = btn.dataset.tab !== 'frota';
  };
});

if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
