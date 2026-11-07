(() => {
'use strict';
const site = window.portfolioData;
const $ = (selector) => document.querySelector(selector);
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};
const assetUrl = (path) => location.protocol === 'file:' && path.startsWith('/') ? `.${path}` : path;
const safeUrl = (path) => {
  const url = new URL(assetUrl(path), location.href);
  return ['http:', 'https:', 'file:'].includes(url.protocol) ? url.href : null;
};
document.title = site.name;
$('#site-name').textContent = site.name;
$('#footer-name').textContent = site.name;
$('#greeting').replaceChildren(document.createTextNode("hey, i'm "), node('strong', '', site.firstName || site.name));
$('#bio').textContent = site.bio;
$('#background').textContent = site.background;
$('#say-hi').href = `mailto:${site.email}`;
$('#intro-email').textContent = site.email;
for (const link of site.links || []) {
  const url = new URL(link.url, location.href);
  if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) continue;
  const anchor = node('a', '', link.label);
  anchor.href = url.href;
  if (url.protocol !== 'mailto:') { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
  $('#footer-links').append(anchor);
}

const toggle = $('#theme-toggle');
const dog = $('#footer-dog');
let petTimeout;
dog.addEventListener('click', () => {
  clearTimeout(petTimeout);
  dog.classList.add('is-petted');
  dog.querySelector('.dog-heart').getAnimations().forEach(animation => { animation.currentTime = 0; });
  petTimeout = setTimeout(() => dog.classList.remove('is-petted'), 950);
});
const hello = $('#intro-hello');
let helloTimeout;
hello.addEventListener('click', () => {
  clearTimeout(helloTimeout);
  hello.classList.add('is-waving');
  hello.querySelector('.hello-hand').getAnimations().forEach(animation => { animation.currentTime = 0; });
  helloTimeout = setTimeout(() => hello.classList.remove('is-waving'), 950);
});
function syncTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  toggle.title = toggle.getAttribute('aria-label');
}
syncTheme();
toggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('portfolio-theme', next); } catch {}
  syncTheme();
});

const dialog = $('#detail-dialog');
let currentPhoto = null;
function openDialog(title, content) {
  dialog.classList.remove('photo-dialog');
  currentPhoto = null;
  const heading = node('h2', '', title);
  heading.id = 'dialog-title';
  $('#dialog-content').replaceChildren(heading, content);
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = 'hidden';
}
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.style.overflow = ''; currentPhoto = null; dialog.classList.remove('photo-dialog'); });
dialog.addEventListener('click', (event) => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});

for (const item of site.experience) {
  const row = node('div', 'experience-row');
  const label = node('span', 'experience-copy');
  const company = node('span', 'company-name', item.company);
  const icon = node('span', 'company-icon');
  icon.setAttribute('aria-hidden', 'true');
  if (item.logoUrl) {
    const logo = node('img', 'company-logo');
    logo.alt = '';
    logo.width = 28;
    logo.height = 28;
    logo.decoding = 'async';
    logo.referrerPolicy = 'no-referrer';
    logo.hidden = true;
    if (item.logoCrop) logo.classList.add('company-logo--crop');
    logo.addEventListener('load', () => { logo.hidden = false; });
    let triedFallback = false;
    logo.addEventListener('error', () => {
      logo.hidden = true;
      if (item.logoFallbackUrl && !triedFallback) {
        triedFallback = true;
        logo.src = item.logoFallbackUrl;
      }
    });
    icon.append(logo);
    logo.src = item.logoUrl;
  }
  label.append(company);
  if (item.role) label.append(node('span', 'experience-role', item.role));
  row.append(icon, label, node('span', 'experience-period', item.period));
  $('#experience-list').append(row);
}
for (const project of site.projects) {
  const url = project.url ? safeUrl(project.url) : null;
  const row = node('li', 'project-row');
  const copy = node('div', 'project-copy');
  const title = node('h3', '');
  if (url) {
    const link = node('a', 'project-link', project.name);
    const arrow = node('span', 'project-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${project.name} on GitHub (opens in a new tab)`);
    title.append(link);
  } else {
    title.textContent = project.name;
  }
  copy.append(title, node('p', '', project.description));
  row.append(copy);
  $('#project-list').append(row);
}
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
for (const note of site.notes) note.slug = note.slug || slugify(note.title);
for (const target of ['#home-notes', '#notes-list']) {
  if (!site.notes.length) $(target).append(node('p', 'empty', 'nothing here yet.'));
  for (const note of site.notes) {
    const link = node('a', 'note-link');
    link.href = `#notes/${note.slug}`;
    link.append(node('span', '', note.title), node('time', '', note.date));
    $(target).append(link);
  }
}
// Keep the viewer and its controls mounted while only the photograph changes.
const photoUI = (() => {
  const heading = node('h2');
  heading.id = 'dialog-title';
  const content = node('div', 'photo-viewer');
  const stage = node('div', 'photo-stage');
  const image = node('img', 'lightbox-photo');
  image.decoding = 'async';
  stage.append(image);
  const controls = node('div', 'photo-controls');
  const previous = node('button', 'text-button', '← previous');
  const next = node('button', 'text-button', 'next →');
  previous.type = next.type = 'button';
  previous.setAttribute('aria-label', 'Previous photo');
  next.setAttribute('aria-label', 'Next photo');
  previous.addEventListener('click', () => showPhoto(currentPhoto - 1, 'previous'));
  next.addEventListener('click', () => showPhoto(currentPhoto + 1, 'next'));
  const count = node('span', 'photo-count');
  count.setAttribute('aria-live', 'polite');
  controls.append(previous, count, next);
  content.append(stage, controls);
  return { heading, content, image, previous, next, count };
})();
function showPhoto(index, focusDirection) {
  currentPhoto = (index + site.photos.length) % site.photos.length;
  const photo = site.photos[currentPhoto];
  photoUI.heading.textContent = photo.caption || 'photo';
  photoUI.image.src = assetUrl(photo.src);
  photoUI.image.alt = photo.alt;
  if (photo.width && photo.height) { photoUI.image.width = photo.width; photoUI.image.height = photo.height; }
  photoUI.count.textContent = `${currentPhoto + 1} / ${site.photos.length}`;
  if (!dialog.classList.contains('photo-dialog')) {
    dialog.classList.add('photo-dialog');
    $('#dialog-content').replaceChildren(photoUI.heading, photoUI.content);
  }
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = 'hidden';
  if (focusDirection) photoUI[focusDirection].focus({ preventScroll: true });
}
dialog.addEventListener('keydown', (event) => {
  if (currentPhoto === null) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(currentPhoto + (event.key === 'ArrowLeft' ? -1 : 1), event.key === 'ArrowLeft' ? 'previous' : 'next');
  }
});
site.photos.forEach((photo, index) => {
  if (!photo.src) {
    $('#photo-grid').append(node('div', 'photo-placeholder', `photo ${String(index + 1).padStart(2, '0')}`));
    return;
  }
  const button = node('button', 'photo-card');
  const image = node('img');
  image.src = assetUrl(photo.thumbnail || photo.src);
  image.alt = photo.alt;
  image.loading = 'lazy';
  image.decoding = 'async';
  if (photo.width && photo.height) { image.width = photo.width; image.height = photo.height; }
  button.setAttribute('aria-label', `Enlarge ${photo.alt || photo.caption || 'photograph'}`);
  if (photo.position) image.style.objectPosition = photo.position;
  const frame = node('span', 'photo-frame');
  frame.append(image);
  button.append(frame);
  if (photo.caption) button.append(node('small', '', photo.caption));
  button.addEventListener('click', () => showPhoto(index));
  $('#photo-grid').append(button);
});

function showView() {
  const hash = decodeURIComponent(location.hash);
  const note = hash.startsWith('#notes/') ? site.notes.find((item) => item.slug === hash.slice(7)) : null;
  const view = note ? 'note' : ['#gallery', '#notes'].includes(hash) ? hash.slice(1) : 'home';
  if (note) {
    $('#note-title').textContent = note.title;
    $('#note-date').textContent = note.date;
    $('#note-body').replaceChildren(...note.paragraphs.map((paragraph) => node('p', '', paragraph)));
  }
  for (const name of ['home', 'notes', 'note', 'gallery']) $(`#${name}-view`).hidden = name !== view;
  const navView = view === 'note' ? 'notes' : view;
  for (const link of document.querySelectorAll('nav a')) {
    if (link.hash === `#${navView}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  document.title = view === 'home' ? site.name : view === 'note' ? `${note.title} — ${site.name}` : `${view} — ${site.name}`;
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', showView);
showView();
})();
