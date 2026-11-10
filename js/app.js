/* Aplikasi Sekolah v2.0.0 — © Arraihan Academy. Seluruh hak dilindungi. */
(function () {
'use strict';


const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = v => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = n => `<i class="bi bi-${n}" aria-hidden="true"></i>`;
const uid = p => (p || '') + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-5);
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms || 250); }; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONF = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const todayStr = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const addDays = (d, n) => { const t = new Date(d + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const fmtD = d => (d && /^\d{4}-\d{2}-\d{2}/.test(d)) ? `${+d.slice(8, 10)} ${MON[+d.slice(5, 7) - 1]} ${d.slice(0, 4)}` : (d || '');
const fmtDT = d => d ? `${fmtD(String(d).slice(0, 10))}, ${String(d).slice(11, 16)} WIB` : '';
const fmtBulan = b => b ? `${MONF[+b.slice(5, 7) - 1]} ${b.slice(0, 4)}` : '';
const hariD = d => HARI[new Date(d + 'T00:00:00Z').getUTCDay()];
const rp = n => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const pct = (a, b) => b ? Math.round(a / b * 1000) / 10 : 0;
const num = v => v === '' || v === null || v === undefined ? NaN : Number(v);
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const thumbUrl = (id, w) => id ? `https:\/\/drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${w || 800}` : '';
const waLink = (n, text) => { let s = String(n || '').replace(/\D/g, ''); if (s.startsWith('0')) s = '62' + s.slice(1); return `https:\/\/wa.me/${s}` + (text ? `?text=${encodeURIComponent(text)}` : ''); };
const accent = t => esc(t).replace(/\*(.+?)[*]/g, '<span class="acc">$1</span>');

const LS = {
  get(k, d) { try { const v = localStorage.getItem('as_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('as_' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem('as_' + k); } catch (e) {   } }
};

const BADGE = { Aktif: 'g', Nonaktif: 's', Lunas: 'g', Menunggu: 'a', Belum: 'r', 'Belum Bayar': 'r', Hadir: 'g', Izin: 'a', Sakit: 'b', Alpa: 'r', Baru: 'a', Diverifikasi: 'g', 'Berkas Kurang': 'r', Diterima: 'g', 'Tidak Diterima': 'r', Terbit: 'g', Draf: 's', Dibuka: 'g', Ditutup: 'r', Segera: 'a', Baik: 'g', 'Rusak Ringan': 'a', 'Rusak Berat': 'r', Ya: 'g', Tidak: 's' };
const bdg = (t, c, dot) => `<span class="bdg ${c || BADGE[t] || 's'}">${dot ? '<span class="dot"></span>' : ''}${esc(t)}</span>`;
const PAL = [['#D9F5EC', '#0F6F5C'], ['#FEF3C7', '#92400E'], ['#FEE2E2', '#991B1B'], ['#DBEAFE', '#1D4ED8'], ['#EDE9FE', '#5B21B6'], ['#FCE7F3', '#9D174D']];
function avatar(nama, thumb, cls) {
  if (thumb && String(thumb).indexOf('data:image/') === 0) return `<img class="avatar ${cls || ''}" src="${esc(thumb)}" alt="">`;
  const p = String(nama || '?').trim().split(/\s+/); const ini = ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  let h = 0; for (let i = 0; i < String(nama).length; i++) h = (h * 31 + String(nama).charCodeAt(i)) | 0;
  const c = PAL[Math.abs(h) % PAL.length];
  return `<span class="avatar ${cls || ''}" style="background:${c[0]};color:${c[1]}" aria-hidden="true">${esc(ini)}</span>`;
}

const OBJ_DS = ['profil', 'absensiSiswa', 'lms'];
const S = { token: null, user: null, db: {}, ver: {}, ix: {}, pub: null, view: null, params: {}, hist: [], ui: {}, files: {}, sync: 'ok', syncing: false, serverDate: null, charts: {}, ready: false };
const D = n => S.db[n] || (OBJ_DS.indexOf(n) >= 0 ? {} : []);
function ix(name, key) {
  const k = name + ':' + (key || 'ID');
  if (!S.ix[k]) { const m = {}; D(name).forEach(r => { m[r[key || 'ID']] = r; }); S.ix[k] = m; }
  return S.ix[k];
}
const kelasNama = id => (ix('kelas')[id] || {}).Nama || id || '-';
const siswaNama = id => (ix('siswa')[id] || {}).Nama || '(siswa dihapus)';
const prof = () => D('profil');
const ROLE_LABEL = { admin: 'Administrator TU', guru: 'Guru Kelas', kepsek: 'Kepala Sekolah', bendahara: 'Bendahara', ortu: 'Orang Tua / Wali', siswa: 'Siswa' };
const today = () => todayStr();

const CFG = window.APP_CONFIG || {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const IDEM = { init: 1, sync: 1, publicData: 1, lisensiStatus: 1, ping: 1 };
/** Transport REST (gas-pro-api): POST text/plain agar tidak memicu preflight CORS yang ditolak GAS. */
async function rpcHttp(fn, args) {
  const url = String(CFG.GAS_URL || '').trim();
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) throw new Error('Alamat server belum diisi. Buka berkas js/config.js lalu isi GAS_URL dengan URL Web App berakhiran /exec.');
  const tries = IDEM[fn] ? 3 : 1; const long = fn === 'api' || fn === 'apiBatch' || fn === 'ppdbSubmit';
  let last;
  for (let i = 0; i < tries; i++) {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), long ? 90000 : 40000);
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn, args }), signal: ctl.signal });
      const txt = await res.text(); clearTimeout(to);
      let j; try { j = JSON.parse(txt); } catch (e) { throw new Error('SERVER_FORMAT'); }
      return j;
    } catch (e) {
      clearTimeout(to);
      last = e && e.name === 'AbortError' ? new Error('Waktu tunggu server habis. Periksa koneksi internet lalu coba lagi.')
        : (e && e.message === 'SERVER_FORMAT' ? new Error('Respons server tidak valid. Pastikan URL /exec benar, akses deployment "Siapa saja", dan sudah memakai Versi baru.')
          : new Error('Tidak dapat menghubungi server. Periksa internet Anda, atau pastikan deployment Web App berakses "Siapa saja".'));
      if (i < tries - 1) await sleep(700 * (i + 1));
    }
  }
  throw last;
}
function rpc(fn) {
  const args = Array.prototype.slice.call(arguments, 1).map(a => a === undefined ? null : JSON.parse(JSON.stringify(a)));
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => { const r = google.script.run.withSuccessHandler(resolve).withFailureHandler(e => reject(e)); r[fn].apply(r, args); });
  }
  return rpcHttp(fn, args);
}

async function api(action, payload) {
  try {
    const r = await rpc('api', S.token, action, payload || {});
    if (r && r.code === 'SESSION') sessionExpired();
    if (r && r.code === 'LICENSE') licenseLocked();
    return r || { success: false, message: 'Tidak ada respons dari server.' };
  } catch (e) { return { success: false, code: 'NET', message: 'Gagal terhubung ke server: ' + ((e && e.message) || e) }; }
}
const ACTION_DS = {
  siswaSave: ['siswa', 'kelas'], siswaDelete: ['siswa', 'kelas'], siswaImport: ['siswa', 'kelas'], absensiSave: ['absensi', 'absensiSiswa', 'absensiAgg'], nilaiSave: ['nilai', 'nilaiAgg'],
  sppSave: ['spp', 'sppAgg'], sppGenerate: ['spp', 'sppAgg'], sppSet: ['spp', 'sppAgg'], invSave: ['inventaris'], invDelete: ['inventaris'], guruSave: ['guru', 'kelas'], guruDelete: ['guru'],
  kelasSave: ['kelas'], penggunaSave: ['pengguna'], penggunaDelete: ['pengguna'], galeriSave: ['galeri'], galeriPublik: ['galeri'], galeriDelete: ['galeri'], beritaSave: ['berita'],
  beritaDelete: ['berita'], ppdbSetStatus: ['pendaftar', 'ppdbAgg'], ppdbDelete: ['pendaftar', 'ppdbAgg'], profilSave: ['profil'], gelSave: ['gelombang'], gelDelete: ['gelombang'], infoSave: ['ppdbInfo'], infoDelete: ['ppdbInfo']
};
const Outbox = {
  q: LS.get('outbox', []), busy: false, timer: null, cbs: {}, n: 0,
  save() { LS.set('outbox', this.q); },
  mine() { return this.q.filter(i => S.user && i.u === S.user.email); },
  push(action, payload, cb) {
    const it = { id: uid('q'), u: S.user ? S.user.email : '', action, payload, t: Date.now() };
    this.q.push(it); if (cb) this.cbs[it.id] = cb; this.save(); setSync(); this.flush(); return it.id;
  },
  async flush() {
    if (this.busy || !S.token || !S.user) return;
    this.q = this.q.filter(i => i.u === S.user.email);
    if (!this.q.length) return;
    if (!navigator.onLine) { setSync('off'); return; }
    this.busy = true; setSync('sync');
    const failed = {}; let expired = false;
    try {
      while (this.q.length && !expired) {
        const batch = this.q.slice(0, 8);
        const res = await rpc('apiBatch', S.token, batch.map(b => ({ action: b.action, payload: b.payload })));
        for (let i = 0; i < batch.length; i++) {
          const r = res[i]; const b = batch[i];
          if (r && r.code === 'SESSION') { expired = true; break; }
          this.q.shift();
          const cb = this.cbs[b.id]; delete this.cbs[b.id];
          if (r && r.success) { if (cb && cb.ok) cb.ok(r); }
          else {
            (ACTION_DS[b.action] || []).forEach(d => { failed[d] = 1; });
            toast((r && r.message) || 'Sebuah perubahan gagal disimpan.', 'err');
            if (cb && cb.fail) cb.fail(r);
          }
        }
        this.save(); this.n = 0;
      }
    } catch (e) { this.busy = false; this.backoff(); setSync('off'); return; }
    this.busy = false;
    if (expired) { sessionExpired(); return; }
    Object.keys(failed).forEach(d => { delete S.ver[d]; });
    setSync(); await resync();
  },
  backoff() { clearTimeout(this.timer); this.n++; this.timer = setTimeout(() => this.flush(), Math.min(30000, 3000 * this.n)); }
};

function mutate(action, payload, applyFn, cb) {
  try { if (applyFn) applyFn(); } catch (e) { console.warn(e); }
  S.ix = {}; persistSoon(); refreshView(true);
  return Outbox.push(action, payload, cb);
}
let _resyncing = false;
async function resync() {
  if (!S.token || _resyncing || Outbox.busy) return;
  _resyncing = true; S.syncing = true; setSync();
  try {
    const r = await rpc('sync', S.token, S.ver);
    if (r && r.code === 'SESSION') { sessionExpired(); return; }
    if (r && r.code === 'LICENSE') { licenseLocked(); return; }
    if (r && r.success) { S.serverDate = r.data.serverDate; mergeData(r.data.data, r.data.ver); if (r.data.lic) setLic(r.data.lic); }
  } catch (e) {   } finally { _resyncing = false; S.syncing = false; setSync(); }
}
function mergeData(data, ver) {
  const changed = [];
  Object.keys(data || {}).forEach(n => { if (JSON.stringify(S.db[n]) !== JSON.stringify(data[n])) { S.db[n] = data[n]; changed.push(n); } });
  S.ver = Object.assign({}, S.ver, ver || {});
  if (changed.length) { S.ix = {}; persistSoon(); onDataChanged(changed); }
}
const persistSoon = debounce(() => { if (S.user) LS.set('snap', { user: S.user, db: S.db, ver: S.ver, at: Date.now() }); }, 600);
let _pollT = null;
function startPolling() {
  stopPolling();
  _pollT = setInterval(() => { if (document.visibilityState === 'visible' && S.token) { if (Outbox.q.length) Outbox.flush(); else resync(); } }, 45000);
}
function stopPolling() { clearInterval(_pollT); _pollT = null; }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.token) { Outbox.flush(); resync(); } });
window.addEventListener('online', () => { setSync(); Outbox.flush(); resync(); });
window.addEventListener('offline', () => setSync('off'));

function setSync(force) {
  S.sync = force || (!navigator.onLine ? 'off' : (Outbox.mine().length ? (Outbox.busy ? 'sync' : 'q') : (S.syncing ? 'sync' : 'ok')));
  const el = $('#synChip'); if (!el) return;
  const n = Outbox.mine().length;
  const map = { ok: ['', ic('cloud-check') + ' Tersinkron'], sync: ['', '<span class="spin sm"></span> Menyinkronkan…'], q: ['q', ic('cloud-upload') + ` ${n} perubahan antre`], off: ['off', ic('wifi-off') + ' Offline — tersimpan di perangkat'] };
  const m = map[S.sync] || map.ok; el.className = 'syn ' + m[0]; el.innerHTML = m[1];
}

function applySession(boot) {
  S.user = boot.user; S.db = Object.assign({}, boot.data); S.ver = boot.ver || {}; S.ix = {}; S.serverDate = boot.serverDate;
  persistSoon();
}
async function doLogin(email, kode) {
  let r;
  try { r = await rpc('login', email, kode); } catch (e) { return { success: false, message: 'Gagal terhubung ke server: ' + ((e && e.message) || e) }; }
  if (r && r.success) {
    S.token = r.data.token; LS.set('token', S.token); applySession(r.data); if (r.data.lic) setLic(r.data.lic);
    Outbox.q = Outbox.q.filter(i => i.u === S.user.email); Outbox.save();
    startPolling(); Outbox.flush();
  }
  return r;
}
function resetClient() {
  S.token = null; S.user = null; S.db = {}; S.ver = {}; S.ix = {}; S.ui = {};
  LS.del('token'); LS.del('snap'); stopPolling();
}
function logout() {
  if (Outbox.mine().length && !confirm('Masih ada perubahan yang belum terkirim ke server. Tetap keluar? Perubahan tersebut akan hilang.')) return;
  resetClient(); Outbox.q = []; Outbox.save();
  go('home', {}, { noHist: true }); toast('Anda telah keluar.', 'info');
}
let _expiring = false;
function sessionExpired() {
  if (_expiring || !S.token) return; _expiring = true;
  resetClient();
  go('login', { msg: 'Sesi Anda berakhir. Silakan masuk kembali.' }, { noHist: true });
  setTimeout(() => { _expiring = false; }, 800);
}

function toast(msg, type) {
  const t = type || 'ok'; const icn = { ok: 'check-circle-fill', err: 'exclamation-triangle-fill', warn: 'exclamation-circle-fill', info: 'info-circle-fill' }[t];
  const el = document.createElement('div'); el.className = 'toast ' + t; el.setAttribute('role', t === 'err' ? 'alert' : 'status');
  el.innerHTML = `${ic(icn)}<div>${esc(msg)}</div>`;
  const box = $('#toasts'); box.appendChild(el);
  while (box.children.length > 4) box.removeChild(box.firstChild);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 220); }, t === 'err' ? 6000 : 3200);
}
const _modals = [];
function openModal(o) {
  const root = $('#modalRoot'); const el = document.createElement('div');
  el.className = 'mo' + (o.drawer ? ' drawer' : '') + (o.cls ? ' ' + o.cls : ''); const id = uid('m');
  el.innerHTML = `<div class="mo-box ${o.size || ''}" role="dialog" aria-modal="true" aria-labelledby="${id}t">
    ${o.bare ? '' : `<div class="mo-h"><h3 id="${id}t">${esc(o.title || '')}</h3><button class="ibtn" data-close aria-label="Tutup">${ic('x-lg')}</button></div>`}
    <div class="mo-b">${o.body || ''}</div>${o.footer ? `<div class="mo-f">${o.footer}</div>` : ''}</div>`;
  const prev = document.activeElement;
  const h = { el, close(v) { const i = _modals.indexOf(h); if (i >= 0) _modals.splice(i, 1); el.remove(); if (!_modals.length) document.body.classList.remove('lock'); if (prev && prev.focus) try { prev.focus(); } catch (e) {   } if (o.onClose) o.onClose(v); }, $: s => $(s, el) };
  el.addEventListener('mousedown', e => { if (e.target === el && o.dismissible !== false) h.close(); });
  el.addEventListener('click', e => { if (e.target.closest('[data-close]')) h.close(); });
  root.appendChild(el); _modals.push(h); document.body.classList.add('lock');
  const f = $('input:not([type=hidden]):not([type=file]),select,textarea,button.btn-pri', $('.mo-b', el)) || $('[data-close]', el); if (f && !o.noFocus) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) {   } }, 30);
  if (o.onOpen) o.onOpen(h);
  return h;
}
document.addEventListener('keydown', e => {
  const top = _modals[_modals.length - 1];
  if (e.key === 'Escape' && top) { top.close(); return; }
  if (e.key === 'Tab' && top) {
    const f = $$('button:not([disabled]),input:not([disabled]):not([type=hidden]),select,textarea,a[href]', top.el).filter(x => x.offsetParent !== null);
    if (!f.length) return; const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
function confirmBox(o) {
  return new Promise(res => {
    let done = false;
    const m = openModal({ title: o.title || 'Konfirmasi', size: 'sm', body: `<p>${o.text || ''}</p>`, onClose: () => { if (!done) res(false); },
      footer: `<button class="btn btn-ghost" data-close>Batal</button><button class="btn ${o.danger === false ? 'btn-pri' : 'btn-danger'}" data-ok>${esc(o.ok || 'Ya, lanjutkan')}</button>` });
    $('[data-ok]', m.el).addEventListener('click', () => { done = true; m.close(); res(true); });
  });
}
function busy(btn, on, label) {
  if (!btn) return;
  if (on) { btn.dataset.html = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spin sm"></span> ${esc(label || 'Memproses…')}`; }
  else { btn.disabled = false; if (btn.dataset.html) btn.innerHTML = btn.dataset.html; }
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast('Disalin ke papan klip.', 'ok'); return; } catch (e) {   }
  const a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select();
  try { document.execCommand('copy'); toast('Disalin ke papan klip.', 'ok'); } catch (e) { toast('Tidak dapat menyalin otomatis. Salin manual: ' + t, 'warn'); }
  a.remove();
}
function downloadCSV(name, rows) {
  const q = v => { let s = String(v === null || v === undefined ? '' : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
  const blob = new Blob(['\ufeff' + rows.map(r => r.map(q).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function toB64(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = () => rej(new Error('Gagal membaca berkas.')); r.readAsDataURL(file); }); }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Gambar tidak dapat dibaca. Gunakan JPG, PNG, atau WEBP.')); i.src = src; }); }
async function prepFile(file, o) {
  o = o || {}; const maxDim = o.maxDim || 1600;
  if (file.type === 'application/pdf') {
    if (o.imageOnly) throw new Error('Gunakan berkas gambar (JPG/PNG/WEBP).');
    if (file.size > 3 * 1024 * 1024) throw new Error('PDF maksimal 3 MB.');
    return { b64: await toB64(file), mime: 'application/pdf', name: file.name, size: file.size, pdf: true };
  }
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Jenis berkas tidak didukung. Gunakan JPG, PNG, WEBP' + (o.imageOnly ? '.' : ', atau PDF.'));
  if (file.size > 25 * 1024 * 1024) throw new Error('Ukuran gambar terlalu besar.');
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url); const sc = Math.min(1, maxDim / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    let q = 0.86, d = c.toDataURL('image/jpeg', q);
    while (d.length * 0.75 > 2.7 * 1024 * 1024 && q > 0.4) { q -= 0.1; d = c.toDataURL('image/jpeg', q); }
    const pv = document.createElement('canvas'); const ps = Math.min(1, 220 / Math.max(c.width, c.height)); pv.width = Math.round(c.width * ps); pv.height = Math.round(c.height * ps);
    pv.getContext('2d').drawImage(c, 0, 0, pv.width, pv.height);
    return { b64: d.split(',')[1], mime: 'image/jpeg', name: file.name.replace(/\.\w+$/, '') + '.jpg', size: Math.round(d.length * 0.75), preview: pv.toDataURL('image/jpeg', 0.7) };
  } finally { URL.revokeObjectURL(url); }
}
async function squareThumb(file, size) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url); const s = Math.min(img.width, img.height);
    const c = document.createElement('canvas'); c.width = c.height = size || 72;
    c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.7);
  } finally { URL.revokeObjectURL(url); }
}

function dz(id, label, o) {
  o = o || {};
  return `<div class="fld"><label>${esc(label)}${o.req ? ' <span class="req" aria-hidden="true">*</span>' : (o.opt ? ' <span class="muted xs">(opsional)</span>' : '')}</label>
    <div class="dz" id="dz-${id}" data-dz="${id}" data-img="${o.imageOnly ? 1 : ''}" data-max="${o.maxDim || ''}">
      <input type="file" accept="${o.imageOnly ? 'image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,application/pdf'}" aria-label="${esc(label)}" ${o.camera ? 'capture' : ''}>
      <div class="pvbox"></div><div class="t">${ic('cloud-arrow-up')} Tarik berkas ke sini atau klik untuk memilih</div><div class="s">${o.imageOnly ? 'JPG, PNG, WEBP' : 'JPG, PNG, WEBP, atau PDF'} · maks. 3 MB</div></div>
    <div class="fld-msg" id="dzm-${id}">Berkas wajib diunggah.</div></div>`;
}
document.addEventListener('change', async e => {
  const inp = e.target; const box = inp.closest && inp.closest('[data-dz]');
  if (!box || inp.type !== 'file') return;
  const id = box.dataset.dz; const f = inp.files[0]; if (!f) return;
  box.classList.remove('has'); $('.t', box).innerHTML = '<span class="spin sm"></span> Memproses…';
  try {
    const p = await prepFile(f, { imageOnly: !!box.dataset.img, maxDim: Number(box.dataset.max) || 1600 });
    S.files[id] = p; box.classList.add('has'); box.closest('.fld').classList.remove('err');
    $('.pvbox', box).innerHTML = p.preview ? `<img class="pv" src="${p.preview}" alt="Pratinjau">` : `<div style="font-size:30px">${ic('file-earmark-pdf')}</div>`;
    $('.t', box).innerHTML = `${ic('check-circle-fill')} ${esc(p.name)}`; $('.s', box).textContent = `${Math.round(p.size / 1024)} KB · klik untuk mengganti`;
  } catch (err) { delete S.files[id]; inp.value = ''; $('.t', box).innerHTML = `${ic('cloud-arrow-up')} Tarik berkas ke sini atau klik untuk memilih`; toast(err.message, 'err'); }
});
document.addEventListener('dragover', e => { const b = e.target.closest && e.target.closest('[data-dz]'); if (b) b.classList.add('over'); });
document.addEventListener('dragleave', e => { const b = e.target.closest && e.target.closest('[data-dz]'); if (b) b.classList.remove('over'); });
document.addEventListener('drop', e => { const b = e.target.closest && e.target.closest('[data-dz]'); if (b) b.classList.remove('over'); });
const fileOf = id => S.files[id] ? { b64: S.files[id].b64, mime: S.files[id].mime, name: S.files[id].name } : null;
const clearFiles = (...ids) => ids.forEach(i => delete S.files[i]);

function validate(form) {
  let first = null;
  $$('.fld', form).forEach(f => f.classList.remove('err'));
  $$('input,select,textarea', form).forEach(el => {
    if (el.type === 'file' || el.type === 'hidden' || el.disabled) return;
    if (!el.checkValidity()) {
      const f = el.closest('.fld'); if (!f) return; f.classList.add('err');
      let m = f.querySelector('.fld-msg'); if (!m) { m = document.createElement('div'); m.className = 'fld-msg'; f.appendChild(m); }
      m.textContent = el.dataset.msg || (el.validity.valueMissing ? 'Kolom ini wajib diisi.' : el.validity.typeMismatch ? 'Format tidak valid.' : el.validity.patternMismatch ? (el.dataset.msg || 'Format tidak valid.') : 'Nilai tidak valid.');
      if (!first) first = el;
    }
  });
  $$('[data-dz][data-req]', form).forEach(b => { if (!S.files[b.dataset.dz]) { b.closest('.fld').classList.add('err'); if (!first) first = b; } });
  if (first) { try { first.scrollIntoView({ block: 'center', behavior: 'smooth' }); if (first.focus && first.tagName !== 'DIV') first.focus({ preventScroll: true }); } catch (e) {   } }
  return !first;
}
const formData = form => { const o = {}; new FormData(form).forEach((v, k) => { if (!(v instanceof File)) o[k] = typeof v === 'string' ? v.trim() : v; }); $$('input[type=checkbox]', form).forEach(c => { o[c.name] = c.checked; }); return o; };
const field = (name, label, o) => {
  o = o || {}; const t = o.type || 'text'; const v = o.value === undefined || o.value === null ? '' : o.value;
  const attrs = `name="${name}" id="f-${name}" ${o.req ? 'required' : ''} ${o.attrs || ''} ${o.ph ? `placeholder="${esc(o.ph)}"` : ''} ${o.msg ? `data-msg="${esc(o.msg)}"` : ''}`;
  let ctl;
  if (t === 'select') ctl = `<select class="inp" ${attrs}>${(o.options || []).map(x => { const a = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(a[0])}" ${String(a[0]) === String(v) ? 'selected' : ''}>${esc(a[1])}</option>`; }).join('')}</select>`;
  else if (t === 'textarea') ctl = `<textarea class="inp" rows="${o.rows || 3}" ${attrs}>${esc(v)}</textarea>`;
  else ctl = `<input class="inp" type="${t}" value="${esc(v)}" ${attrs}>`;
  return `<div class="fld ${o.cls || ''}"><label for="f-${name}">${esc(label)}${o.req ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>${ctl}${o.help ? `<div class="help">${o.help}</div>` : ''}<div class="fld-msg">${esc(o.msg || 'Kolom ini wajib diisi.')}</div></div>`;
};

let _chartP = null;

function loadChart() {
  if (typeof Chart !== 'undefined') return Promise.resolve();
  if (_chartP) return _chartP;
  const urls = ['https:\/\/cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js', 'https:\/\/cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'];
  _chartP = new Promise((res, rej) => {
    let i = 0;
    const next = () => {
      if (i >= urls.length) { _chartP = null; rej(new Error('Chart.js gagal dimuat')); return; }
      const s = document.createElement('script'); let done = false; s.src = urls[i++]; s.async = true;
      const fail = () => { if (done) return; done = true; clearTimeout(t); s.remove(); next(); };
      const t = setTimeout(fail, 9000);
      s.onload = () => { if (done) return; done = true; clearTimeout(t); res(); };
      s.onerror = fail; document.head.appendChild(s);
    };
    next();
  });
  return _chartP;
}
function drawChart(id, cfg) {
  const cv = document.getElementById(id); if (!cv) return;
  if (S.charts[id]) { S.charts[id].destroy(); delete S.charts[id]; }
  if (typeof Chart === 'undefined') {
    loadChart().then(() => { if (document.getElementById(id)) drawChart(id, cfg); })
      .catch(() => { const c = document.getElementById(id); if (c && c.parentNode) c.parentNode.innerHTML = '<div class="empty"><div class="t">Grafik tidak dapat dimuat</div>Periksa koneksi internet Anda lalu muat ulang.</div>'; });
    return;
  }
  const txt = cssVar('--mut'), grid = cssVar('--chart-grid');
  cfg.options = Object.assign({ responsive: true, maintainAspectRatio: false, animation: { duration: 350 }, plugins: { legend: { display: (cfg.data.datasets || []).length > 1, labels: { color: txt, usePointStyle: true, boxWidth: 8 } } } }, cfg.options || {});
  if (cfg.type !== 'doughnut') cfg.options.scales = Object.assign({ x: { ticks: { color: txt, maxRotation: 0, autoSkip: true }, grid: { display: false } }, y: { ticks: { color: txt }, grid: { color: grid }, beginAtZero: true } }, cfg.options.scales || {});
  S.charts[id] = new Chart(cv, cfg);
}
function killCharts() { Object.keys(S.charts).forEach(k => { try { S.charts[k].destroy(); } catch (e) {   } delete S.charts[k]; }); }
const cv = (id, cls) => `<div class="cv ${cls || ''}"><canvas id="${id}" role="img" aria-label="Grafik"></canvas></div>`;

function paginate(list, page, per) {
  const pages = Math.max(1, Math.ceil(list.length / per)); const p = Math.min(Math.max(1, page || 1), pages);
  return { items: list.slice((p - 1) * per, p * per), page: p, pages, total: list.length, from: list.length ? (p - 1) * per + 1 : 0, to: Math.min(list.length, p * per) };
}
function pager(key, pg, label) {
  if (pg.total === 0) return '';
  const nums = []; for (let i = 1; i <= pg.pages; i++) if (i === 1 || i === pg.pages || Math.abs(i - pg.page) <= 1) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…');
  return `<div class="pager"><span>Menampilkan <b>${pg.from}–${pg.to}</b> dari <b>${pg.total}</b> ${esc(label || 'data')}</span><div class="pg" role="navigation" aria-label="Halaman">
    <button data-act="page" data-k="${key}" data-p="${pg.page - 1}" ${pg.page <= 1 ? 'disabled' : ''} aria-label="Sebelumnya">${ic('chevron-left')}</button>
    ${nums.map(n => n === '…' ? '<span class="muted" style="padding:8px 4px">…</span>' : `<button data-act="page" data-k="${key}" data-p="${n}" class="${n === pg.page ? 'on' : ''}" ${n === pg.page ? 'aria-current="page"' : ''}>${n}</button>`).join('')}
    <button data-act="page" data-k="${key}" data-p="${pg.page + 1}" ${pg.page >= pg.pages ? 'disabled' : ''} aria-label="Berikutnya">${ic('chevron-right')}</button></div></div>`;
}
const emptyBox = (icn, t, s, btn) => `<div class="empty">${ic(icn)}<div class="t">${esc(t)}</div><div>${s || ''}</div>${btn ? `<div class="sp"></div>${btn}` : ''}</div>`;
const statCard = (l, v, n, icn, c) => `<div class="stat"><div><div class="l">${esc(l)}</div><div class="v">${v}</div><div class="n">${n || ''}</div></div><span class="icon-c ${c || 'mint'}">${ic(icn)}</span></div>`;

const VIEWS = {}; const ACT = {}; const SUBMIT = {}; const BIND = {};
const NAV = {
  admin: [['dash', 'Dashboard', 'grid-1x2'], ['siswa', 'Data Siswa', 'people'], ['lms', 'Kelas Belajar (LMS)', 'easel2'], ['guru', 'Guru, Staf & Akses', 'person-badge'], ['inventaris', 'Inventaris', 'box-seam'], ['konten', 'Konten Publik', 'newspaper'], ['ppdb', 'Pendaftar PPDB', 'person-plus'], ['rekap', 'Rekap & Laporan', 'bar-chart-line'], ['pengaturan', 'Pengaturan', 'gear']],
  guru: [['dash', 'Dashboard', 'grid-1x2'], ['siswa', 'Data Siswa', 'people'], ['absensi', 'Absensi Harian', 'calendar-check'], ['nilai', 'Buku Nilai', 'journal-text'], ['lms', 'Kelas Belajar (LMS)', 'easel2']],
  bendahara: [['spp', 'Pembayaran SPP', 'cash-coin']],
  kepsek: [['rekap', 'Rekap & Laporan', 'bar-chart-line']],
  ortu: [['anak', 'Anak Saya', 'person-heart'], ['lms', 'Kelas Belajar (LMS)', 'easel2']],
  siswa: [['lms', 'Kelas Belajar', 'easel2'], ['anak', 'Nilai & Absensi', 'person-heart']]
};
const LANDING = { admin: 'dash', guru: 'dash', bendahara: 'spp', kepsek: 'rekap', ortu: 'anak', siswa: 'lms' };
const goAttr = (v, p) => `data-go="${v}"${p ? ` data-p="${esc(JSON.stringify(p))}"` : ''}`;
const pubP = () => (S.pub && S.pub.profil) || {};
const gelStatus = g => { const t = todayStr(); if (!g.Buka || !g.Tutup) return 'Ditutup'; return t < g.Buka ? 'Segera' : (t > g.Tutup ? 'Ditutup' : 'Dibuka'); };

function go(view, params, opts) {
  opts = opts || {}; params = params || {};
  if (S.lic && S.lic.locked && (view === 'login' || (VIEWS[view] && VIEWS[view].panel))) view = 'aktivasi';
  const v = VIEWS[view]; if (!v) return;
  if (v.panel) {
    if (!S.user) { go('login', { next: view }, { noHist: true }); return; }
    if (v.role && v.role.indexOf(S.user.role) < 0) { toast('Menu tidak tersedia untuk peran Anda.', 'warn'); go(LANDING[S.user.role], {}, { noHist: true }); return; }
  }
  if (view === 'login' && S.user) { go(LANDING[S.user.role], {}, { noHist: true }); return; }
  if (!opts.noHist && S.view && !(S.view === view && JSON.stringify(S.params) === JSON.stringify(params))) { S.hist.push({ v: S.view, p: S.params }); if (S.hist.length > 30) S.hist.shift(); }
  killCharts(); closeSide(); closeMenu();
  S.view = view; S.params = params;
  $('#pubShell').hidden = !!v.panel; $('#appShell').hidden = !v.panel;
  renderView(true);
  if (params.anchor) setTimeout(() => { const a = document.getElementById('sec-' + params.anchor); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 40);
  else window.scrollTo(0, 0);
}
function goBack(fallback) {
  const h = S.hist.pop();
  if (h) go(h.v, h.p, { noHist: true }); else go(fallback || (S.user ? LANDING[S.user.role] : 'home'), {}, { noHist: true });
}
function renderView(animate) {
  const v = VIEWS[S.view]; if (!v) return;
  const box = v.panel ? $('#appView') : $('#pubView');
  box.innerHTML = v.render(S.params || {});
  if (animate) { box.classList.remove('view-in'); void box.offsetWidth; box.classList.add('view-in'); }
  if (v.panel) chromePanel(); else chromePub();
  if (v.after) v.after(S.params || {});
  const t = $('#boot'); if (t && !t.classList.contains('off')) { t.classList.add('off'); setTimeout(() => t.remove(), 300); }
}
function isEditing() {
  const a = document.activeElement;
  return !!(a && a.matches && a.matches('input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,select') && a.closest('#appView,#pubView'));
}
function refreshView(soft) {
  if (!S.view || !VIEWS[S.view]) return;
  if (isEditing()) { S.pendingRefresh = true; return; }
  S.pendingRefresh = false;
  const y = window.scrollY; killCharts(); renderView(false); if (soft !== 'top') window.scrollTo(0, y);
}

function rerender() { if (!S.view || !VIEWS[S.view]) return; S.pendingRefresh = false; const y = window.scrollY; killCharts(); renderView(false); window.scrollTo(0, y); }
document.addEventListener('focusout', () => { if (S.pendingRefresh) setTimeout(() => { if (S.pendingRefresh && !isEditing()) refreshView(); }, 250); });
function onDataChanged(names) {
  if (typeof refreshPubSoon === 'function') refreshPubSoon(names);
  const v = VIEWS[S.view];
  if (v && (!v.deps || v.deps.some(d => names.indexOf(d) >= 0))) refreshView(); else if (v && v.panel) chromePanel();
}
function toggleTheme() {
  const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', n); try { localStorage.setItem('as_theme', n); } catch (e) {   }
  const v = VIEWS[S.view]; if (v && v.after && S.view) { killCharts(); v.after(S.params || {}); } chromePanel(); chromePub();
}
const themeIcon = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'sun' : 'moon-stars';

document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); let p = {}; try { p = g.dataset.p ? JSON.parse(g.dataset.p) : {}; } catch (x) {   } go(g.dataset.go, p); return; }
  const a = e.target.closest('[data-act]');
  if (a && ACT[a.dataset.act]) { e.preventDefault(); ACT[a.dataset.act](a, e); }
});
document.addEventListener('submit', e => { const f = e.target.closest('[data-submit]'); if (f) { e.preventDefault(); if (SUBMIT[f.dataset.submit]) SUBMIT[f.dataset.submit](f, e); } });
document.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.bind && BIND[t.dataset.bind]) BIND[t.dataset.bind](t, e); });
document.addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.chg && BIND[t.dataset.chg]) BIND[t.dataset.chg](t, e); });
ACT.page = el => { const k = el.dataset.k; S.ui[k] = S.ui[k] || {}; S.ui[k].page = Number(el.dataset.p); const f = REDRAW[k]; if (f) f(); else refreshView(); };
ACT.theme = () => toggleTheme();
ACT.logout = () => logout();
ACT.menu = () => { const m = $('#pubLinks'); if (m) { m.classList.toggle('open'); $('#hamb').setAttribute('aria-expanded', m.classList.contains('open')); } };
ACT.side = () => openSide();
ACT.syncNow = async () => { toast('Menyinkronkan data…', 'info'); await Outbox.flush(); S.ver = {}; await resync(); toast('Data sudah terbaru.', 'ok'); };
ACT.copy = el => copyText(el.dataset.v);
ACT.back = el => goBack(el.dataset.fb);
ACT.pw = el => { const i = $('#f-kode'); if (!i) return; i.type = i.type === 'password' ? 'text' : 'password'; el.innerHTML = ic(i.type === 'password' ? 'eye' : 'eye-slash'); };
const REDRAW = {};
$('#skipLink').addEventListener('click', () => { const m = $(S.user && VIEWS[S.view] && VIEWS[S.view].panel ? '#appView' : '#pubView'); if (m) m.focus(); });
function closeMenu() { const m = $('#pubLinks'); if (m) m.classList.remove('open'); }
function openSide() { $('#side').classList.add('open'); const b = $('#drawerBackdrop'); b.hidden = false; b.onclick = closeSide; document.body.classList.add('lock'); }
function closeSide() { $('#side').classList.remove('open'); $('#drawerBackdrop').hidden = true; if (!_modals.length) document.body.classList.remove('lock'); }

function navBadge(k) { if (k === 'ppdb') { const n = D('pendaftar').filter(p => p.Status === 'Baru').length; return n || ''; } return ''; }
function chromePanel() {
  if (!S.user) return;
  const nav = NAV[S.user.role] || []; const cur = S.view;
  const logo = pubP().logo ? `<img src="${thumbUrl(pubP().logo, 96)}" alt="" referrerpolicy="no-referrer">` : ic('mortarboard-fill');
  $('#side').innerHTML = `<div class="brand"><span class="lg">${logo}</span><span><b>${esc(pubP().namaSekolah || 'Aplikasi Sekolah')}</b><small>${esc(ROLE_LABEL[S.user.role])}</small></span></div>
    <div class="sec-l">Menu</div><nav aria-label="Menu panel">${nav.map(n => { const b = navBadge(n[0]); return `<button class="nv ${cur === n[0] || (cur === 'siswa-form' && n[0] === 'siswa') ? 'on' : ''}" ${goAttr(n[0])} ${cur === n[0] ? 'aria-current="page"' : ''}>${ic(n[2])}<span>${n[1]}</span>${b ? `<span class="cnt" aria-label="${b} baru">${b}</span>` : ''}</button>`; }).join('')}</nav>
    <div class="side-f"><button class="nv" ${goAttr('home')}>${ic('globe2')}<span>Lihat Situs Publik</span></button><button class="nv" data-act="theme">${ic(themeIcon())}<span>${themeIcon() === 'sun' ? 'Mode Terang' : 'Mode Gelap'}</span></button><button class="nv" data-act="logout">${ic('box-arrow-left')}<span>Keluar</span></button></div>`;
  const cur2 = nav.find(n => n[0] === (cur === 'siswa-form' ? 'siswa' : cur));
  $('#topbar').innerHTML = `<button class="ibtn hamb-p" data-act="side" aria-label="Buka menu" style="display:${window.innerWidth < 1024 ? 'inline-flex' : 'none'}">${ic('list')}</button>
    <div><div class="ttl">${esc(cur2 ? cur2[1] : 'Panel')}</div><div class="bc">Panel Sekolah · ${esc(ROLE_LABEL[S.user.role])}</div></div><div class="sp2"></div>
    <span class="bdg m hide-m">${ic('calendar3')} TA ${esc(prof().tahunAjaran || '')} · ${esc(prof().semester || '')}</span>
    <button id="synChip" class="syn" data-act="syncNow" aria-label="Sinkronkan sekarang"></button>
    <button class="ibtn" data-act="theme" aria-label="Ganti tema">${ic(themeIcon())}</button>
    <div class="usr">${avatar(S.user.nama, '', 'sm')}<div class="tx"><b>${esc(S.user.nama)}</b><small>${esc(ROLE_LABEL[S.user.role])}</small></div><button class="ibtn" data-act="logout" aria-label="Keluar" style="width:34px;height:34px">${ic('box-arrow-right')}</button></div>`;
  const items = nav.length > 5 ? nav.slice(0, 4) : nav;
  $('#bnav').innerHTML = nav.length <= 1 ? '' : items.map(n => { const b = navBadge(n[0]); return `<button class="${cur === n[0] ? 'on' : ''}" ${goAttr(n[0])}>${ic(n[2])}<span>${n[1].split(' ')[0]}</span>${b ? `<span class="cnt">${b}</span>` : ''}</button>`; }).join('') + (nav.length > 5 ? `<button data-act="side">${ic('three-dots')}<span>Menu</span></button>` : '');
  $('#bnav').style.display = nav.length <= 1 ? 'none' : '';
  setSync();
}
window.addEventListener('resize', debounce(() => { if (S.user && VIEWS[S.view] && VIEWS[S.view].panel) chromePanel(); }, 200));

const PUB_LINKS = [['Beranda', 'home', null], ['Tentang', 'home', 'tentang'], ['Kegiatan', 'home', 'kegiatan'], ['PPDB', 'ppdb', null], ['Galeri', 'galeri', null], ['Berita', 'berita', null]];
function logoBox() { const l = pubP().logo; return l ? `<img src="${thumbUrl(l, 96)}" alt="" referrerpolicy="no-referrer">` : ic('mortarboard-fill'); }
function chromePub() {
  const P = pubP(); const v = S.view;
  $('#pubTop').innerHTML = `<div class="pub-nav" style="position:relative"><button class="brand" ${goAttr('home')} aria-label="Ke beranda"><span class="lg">${logoBox()}</span><span><b>${esc(P.namaSekolah || 'Nama Sekolah')}</b><small>${esc(P.tagline || '')}</small></span></button>
    <nav class="pub-links" id="pubLinks" aria-label="Menu situs">${PUB_LINKS.map(l => `<button class="${(l[1] === v && !l[2] && v !== 'home') || (v === 'home' && l[0] === 'Beranda') || (v === 'ppdb-form' && l[1] === 'ppdb') || (v === 'berita-detail' && l[1] === 'berita') ? 'on' : ''}" ${goAttr(l[1], l[2] ? { anchor: l[2] } : null)}>${l[0]}</button>`).join('')}</nav>
    <span class="grow"></span><button class="ibtn" data-act="theme" aria-label="Ganti tema">${ic(themeIcon())}</button>
    <button class="btn btn-coral pill sm" ${goAttr(S.user ? LANDING[S.user.role] : 'login')}>${S.user ? 'Buka Panel' : 'Masuk'}</button>
    <button class="ibtn hamb" id="hamb" data-act="menu" aria-label="Menu" aria-expanded="false">${ic('list')}</button></div>`;
  const open = ((S.pub || {}).gelombang || []).find(g => gelStatus(g) === 'Dibuka');
  $('#pubBanner').innerHTML = open ? `<div class="banner"><span class="tag">INFO BARU</span>Pendaftaran Peserta Didik Baru (PPDB) TA ${esc(P.tahunAjaran || '')} — ${esc(open.Nama)} telah dibuka!<a ${goAttr('ppdb')}>Lihat Info & Jadwal →</a></div>` : '';
  const soc = [['instagram', 'instagram'], ['youtube', 'youtube'], ['facebook', 'facebook']].filter(s => /^https?:\/[/]/.test(P[s[0]] || '')).map(s => `<a href="${esc(P[s[0]])}" target="_blank" rel="noopener" aria-label="${s[0]}">${ic(s[1])}</a>`).join('');
  $('#pubFoot').innerHTML = `<div class="wrap"><div class="g"><div><div class="brand" style="color:#fff;margin-bottom:12px"><span class="lg">${logoBox()}</span><b style="color:#fff">${esc(P.namaSekolah || '')}</b></div><p class="small">${esc(P.tagline || '')}. Sekolah yang mendidik dengan hati dan menyiapkan generasi berkarakter.</p><div class="sp"></div><div class="soc">${soc}</div></div>
    <div><h5>Alamat & Kontak</h5><div class="it">${ic('geo-alt-fill')}<span>${esc(P.alamat || '-')}</span></div><div class="it">${ic('telephone-fill')}<span>${esc(P.telepon || '-')}</span></div><div class="it">${ic('envelope-fill')}<span>${esc(P.email || '-')}</span></div></div>
    <div><h5>Tautan</h5>${PUB_LINKS.map(l => `<button class="l" ${goAttr(l[1], l[2] ? { anchor: l[2] } : null)}>${l[0]}</button>`).join('')}</div>
    <div><h5>Ikuti Kabar Sekolah</h5><p class="small">Dapatkan kabar terbaru dan keseruan kegiatan siswa kami.</p></div></div>
    <div class="cp"><span>© ${new Date().getFullYear()} ${esc(P.namaSekolah || '')}. Semua hak dilindungi.</span><span>Data pribadi siswa tidak pernah ditampilkan di halaman publik.</span></div></div>`;
}

const warnaMap = { mint: 'mint', coral: 'coral', yellow: 'yellow', blue: 'blue' };
const pubSkeleton = () => `<div class="wrap" style="padding-top:60px;padding-bottom:60px"><div class="skel" style="height:48px;width:60%;margin-bottom:16px"></div><div class="skel" style="height:20px;width:80%;margin-bottom:10px"></div><div class="skel" style="height:20px;width:70%;margin-bottom:30px"></div><div class="skel" style="height:260px"></div></div>`;
function imgOrPh(id, w, icn, alt) { return id ? `<img src="${thumbUrl(id, w)}" alt="${esc(alt || '')}" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML='<div class=&quot;ph&quot; style=&quot;width:100%;height:100%&quot;><i class=&quot;bi bi-${icn || 'image'}&quot;></i></div>'">` : `<div class="ph" style="width:100%;height:100%">${ic(icn || 'image')}</div>`; }
const KAT = { Prestasi: 'g', Kegiatan: 'b', Pengumuman: 'a' };
function galCard(g) {
  return `<button class="act-card" data-act="lightbox" data-id="${esc(g.id)}" aria-label="Lihat foto ${esc(g.judul)}"><div class="im">${imgOrPh(g.foto, 600, 'image', g.judul)}<span class="tg">${esc(g.kategori || 'Kegiatan')}</span></div><div class="bd"><h4>${esc(g.judul)}</h4><small>${fmtD(g.tanggal)}</small></div></button>`;
}
function newsCard(b) {
  return `<article class="card-x pad0 hover news-c" style="display:flex;flex-direction:column"><div style="aspect-ratio:16/9;overflow:hidden">${imgOrPh(b.foto, 700, 'newspaper', b.judul)}</div><div class="bd" style="display:flex;flex-direction:column;flex:1"><div class="meta">${bdg(b.kategori, KAT[b.kategori])}<span>${fmtD(b.tanggal)}</span></div><h4>${esc(b.judul)}</h4><p>${esc(b.ringkasan)}</p><button class="btn btn-ghost sm" style="margin-top:auto;align-self:flex-start;padding-left:0" ${goAttr('berita-detail', { id: b.id })}>Baca selengkapnya ${ic('arrow-right')}</button></div></article>`;
}
VIEWS.home = {
  render() {
    if (!S.pub) return pubSkeleton();
    const P = pubP(), st = S.pub.stats || {}, info = S.pub.info || [], gal = S.pub.galeri || [], ber = S.pub.berita || [];
    const poin = info.filter(i => i.Tipe === 'poin'), jd = info.filter(i => i.Tipe === 'jadwal');
    const rasio = st.guru ? Math.max(1, Math.round(st.siswa / st.guru)) : 0;
    const open = (S.pub.gelombang || []).some(g => gelStatus(g) === 'Dibuka');
    return `<section class="hero"><div class="wrap hero-g"><div><span class="kicker">Tahun Ajaran ${esc(P.tahunAjaran || '')}</span><h1>${accent(P.heroJudul || 'Selamat Datang')}</h1><p class="lead">${esc(P.heroSub || '')}</p>
      <div class="row-gap" style="margin-top:24px"><button class="btn btn-coral pill lg" ${goAttr('ppdb')}>Daftar PPDB ${ic('arrow-right')}</button><button class="btn btn-out pill lg" ${goAttr('home', { anchor: 'tentang' })}>${ic('compass')} Jelajahi Program</button></div>
      <div class="hero-stats"><div><b class="tnum">${st.siswa || 0}</b><span>Siswa Aktif</span></div><div><b class="tnum">${rasio ? '1 : ' + rasio : '-'}</b><span>Rasio Guru & Siswa</span></div><div><b class="tnum">${st.guru || 0}</b><span>Guru & Staf</span></div></div></div>
      <div class="hero-vis">${P.heroFoto ? `<img src="${thumbUrl(P.heroFoto, 1100)}" alt="Suasana sekolah" referrerpolicy="no-referrer">` : `<span class="art">${ic('backpack2-fill')}</span><span class="f" style="left:16px;top:18px">${ic('stars')} Belajar Seru</span><span class="f" style="right:16px;bottom:22px">${ic('heart-fill')} Karakter Baik</span>`}</div></div></section>
    <section class="sec" id="sec-tentang"><div class="wrap"><div class="sec-h"><div class="orn">${ic('star-fill')}${ic('flower1')}${ic('star-fill')}</div><h2>Keunggulan Kami</h2><p>Pilar utama yang dirancang untuk mendukung tumbuh kembang anak secara menyeluruh dan seimbang.</p></div>
      <div class="g4">${(P.keunggulan || []).map(k => `<div class="card-x hover feat"><span class="icon-c ${warnaMap[k.warna] || 'mint'}">${ic(esc(k.ikon || 'star'))}</span><h4>${esc(k.judul)}</h4><p>${esc(k.isi)}</p></div>`).join('')}</div></div></section>
    <section class="sec alt" id="sec-kegiatan"><div class="wrap"><div class="sec-h"><div class="orn">${ic('star-fill')}${ic('camera-fill')}${ic('star-fill')}</div><h2>Kegiatan Siswa</h2><p>Momen keceriaan, kolaborasi, dan eksplorasi seru para siswa kami.</p></div>
      ${gal.length ? `<div class="g4">${gal.slice(0, 4).map(galCard).join('')}</div><div class="center sp" style="margin-top:24px"><button class="btn btn-out pill" ${goAttr('galeri')}>Lihat semua galeri ${ic('arrow-right')}</button></div>` : emptyBox('images', 'Belum ada foto kegiatan', 'Foto kegiatan akan tampil di sini.')}</div></section>
    <section class="sec"><div class="wrap ppdb-g"><div class="card-x" style="background:var(--soft2)"><div class="card-h"><h3>${ic('backpack2')} Informasi PPDB</h3><span class="bdg m">TA ${esc(P.tahunAjaran || '')}</span></div><ul class="ticks">${poin.map(p => `<li>${ic('check-circle-fill')}<span>${esc(p.Judul)}</span></li>`).join('') || '<li class="muted">Informasi akan diumumkan.</li>'}</ul>
      <button class="btn btn-pri block lg" ${goAttr(open ? 'ppdb-form' : 'ppdb')}>${ic('pencil-square')} ${open ? 'Formulir Pendaftaran Online' : 'Lihat Informasi PPDB'}</button></div>
      <div class="card-x"><div class="card-h"><h3>${ic('calendar-event')} Jadwal Penting</h3></div><ul class="timeline">${jd.map(j => `<li><span class="d ${esc(j.Warna || 'mint')}"></span><span>${esc(j.Judul)}</span><span class="w">${esc(j.Tanggal)}</span></li>`).join('') || '<li class="muted">Jadwal akan diumumkan.</li>'}</ul></div></div></section>
    <section class="sec alt"><div class="wrap"><div class="sec-h"><div class="orn">${ic('star-fill')}${ic('megaphone-fill')}${ic('star-fill')}</div><h2>Berita Sekolah</h2><p>Informasi prestasi siswa, agenda kegiatan komunitas, dan pengumuman terbaru.</p></div>
      ${ber.length ? `<div class="g3">${ber.slice(0, 3).map(newsCard).join('')}</div><div class="center" style="margin-top:24px"><button class="btn btn-out pill" ${goAttr('berita')}>Semua berita ${ic('arrow-right')}</button></div>` : emptyBox('newspaper', 'Belum ada berita', 'Berita yang diterbitkan akan tampil di sini.')}</div></section>
    <section class="sec"><div class="wrap"><div class="cta"><div class="row-gap"><span class="icon-c mint" style="width:56px;height:56px">${ic('buildings')}</span><div><h3>Kunjungi Kampus Kami</h3><p class="muted">Rasakan langsung suasana belajar yang hangat, fasilitas, dan lingkungan yang aman untuk putra-putri Anda.</p></div></div>
      ${P.whatsapp ? `<a class="btn btn-wa pill lg" href="${esc(waLink(P.whatsapp, 'Assalamualaikum, saya ingin bertanya tentang ' + (P.namaSekolah || 'sekolah')))}" target="_blank" rel="noopener">${ic('whatsapp')} Hubungi Kami via WhatsApp</a>` : ''}</div></div></section>`;
  }
};
ACT.lightbox = el => {
  const list = (S.pub.galeri || []); let i = list.findIndex(g => g.id === el.dataset.id); if (i < 0) return;
  const draw = () => { const g = list[i]; h.el.querySelector('.mo-b').innerHTML = `<div class="center">${g.foto ? `<img src="${thumbUrl(g.foto, 1400)}" alt="${esc(g.judul)}" referrerpolicy="no-referrer">` : `<div class="ph" style="height:50dvh;border-radius:14px">${ic('image')}</div>`}<h3 style="color:#fff;margin-top:14px">${esc(g.judul)}</h3><p style="opacity:.8">${fmtD(g.tanggal)} · ${esc(g.kategori || '')}</p><div class="row-gap" style="justify-content:center;margin-top:12px"><button class="btn btn-white sm" data-lb="-1" aria-label="Sebelumnya">${ic('chevron-left')}</button><button class="btn btn-white sm" data-close>${ic('x-lg')} Tutup</button><button class="btn btn-white sm" data-lb="1" aria-label="Berikutnya">${ic('chevron-right')}</button></div></div>`; };
  const h = openModal({ bare: true, cls: 'lightbox', body: '', size: 'xl' }); draw();
  h.el.addEventListener('click', e => { const b = e.target.closest('[data-lb]'); if (b) { i = (i + Number(b.dataset.lb) + list.length) % list.length; draw(); } });
};
VIEWS.berita = {
  render() {
    if (!S.pub) return pubSkeleton();
    const u = S.ui.berita = S.ui.berita || { q: '', cat: '', page: 1 };
    return `<div class="wrap" style="padding:36px 20px 64px"><div class="page-h"><div><h1>Berita Sekolah</h1><p class="sub">Prestasi, kegiatan, dan pengumuman terbaru.</p></div><div class="inp-ic" style="min-width:260px">${ic('search')}<input class="inp" data-bind="beritaQ" value="${esc(u.q)}" placeholder="Cari berita…" aria-label="Cari berita"></div></div>
      <div class="filters">${['', 'Prestasi', 'Kegiatan', 'Pengumuman'].map(c => `<button class="chip ${u.cat === c ? 'on' : ''}" data-act="beritaCat" data-c="${c}">${c || 'Semua'}</button>`).join('')}</div><div id="beritaList"></div></div>`;
  },
  after() { if (S.pub) drawBerita(); }
};
function drawBerita() {
  const u = S.ui.berita; const q = (u.q || '').toLowerCase();
  const list = (S.pub.berita || []).filter(b => (!u.cat || b.kategori === u.cat) && (!q || (b.judul + ' ' + b.ringkasan).toLowerCase().indexOf(q) >= 0));
  const pg = paginate(list, u.page, 6);
  $('#beritaList').innerHTML = pg.total ? `<div class="g3">${pg.items.map(newsCard).join('')}</div>${pager('berita', pg, 'berita')}` : emptyBox('newspaper', 'Berita tidak ditemukan', 'Coba kata kunci atau kategori lain.');
}
REDRAW.berita = drawBerita;
BIND.beritaQ = debounce(t => { S.ui.berita.q = t.value; S.ui.berita.page = 1; drawBerita(); }, 200);
ACT.beritaCat = el => { S.ui.berita.cat = el.dataset.c; S.ui.berita.page = 1; $$('.filters .chip').forEach(c => c.classList.toggle('on', c.dataset.c === el.dataset.c)); drawBerita(); };
VIEWS['berita-detail'] = {
  render(p) {
    const b = ((S.pub || {}).berita || []).find(x => x.id === p.id);
    if (!b) return `<div class="wrap" style="padding:60px 20px">${emptyBox('newspaper', 'Berita tidak ditemukan', 'Berita mungkin sudah ditarik.', `<button class="btn btn-pri" ${goAttr('berita')}>Kembali ke Berita</button>`)}</div>`;
    const more = S.pub.berita.filter(x => x.id !== b.id).slice(0, 3);
    return `<div class="wrap" style="padding:32px 20px 64px;max-width:820px"><div class="crumb"><button data-act="back" data-fb="berita">← Kembali ke Berita</button></div><div class="row-gap">${bdg(b.kategori, KAT[b.kategori])}<span class="muted small">${fmtD(b.tanggal)}</span></div><h1 style="font-size:clamp(26px,4vw,38px);margin:12px 0 18px">${esc(b.judul)}</h1>
      ${b.foto ? `<div style="border-radius:18px;overflow:hidden;margin-bottom:22px;max-height:440px">${imgOrPh(b.foto, 1200, 'newspaper', b.judul)}</div>` : ''}
      <div style="font-size:16.5px;line-height:1.75">${String(b.isi || b.ringkasan).split(/\n{2,}/).map(t => `<p style="margin-bottom:14px">${esc(t).replace(/\n/g, '<br>')}</p>`).join('')}</div>
      ${more.length ? `<div class="sp"></div><h3 style="margin:24px 0 14px">Berita Lainnya</h3><div class="g3">${more.map(newsCard).join('')}</div>` : ''}</div>`;
  }
};
VIEWS.galeri = {
  render() {
    if (!S.pub) return pubSkeleton();
    const u = S.ui.galeri = S.ui.galeri || { cat: '', page: 1 }; const cats = Array.from(new Set((S.pub.galeri || []).map(g => g.kategori).filter(Boolean)));
    return `<div class="wrap" style="padding:36px 20px 64px"><div class="page-h"><div><h1>Galeri Kegiatan</h1><p class="sub">Momen keceriaan dan kebersamaan di sekolah kami.</p></div></div>
      <div class="filters"><button class="chip ${!u.cat ? 'on' : ''}" data-act="galCat" data-c="">Semua</button>${cats.map(c => `<button class="chip ${u.cat === c ? 'on' : ''}" data-act="galCat" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div><div id="galList"></div></div>`;
  },
  after() { if (S.pub) drawGal(); }
};
function drawGal() {
  const u = S.ui.galeri; const list = (S.pub.galeri || []).filter(g => !u.cat || g.kategori === u.cat); const pg = paginate(list, u.page, 12);
  $('#galList').innerHTML = pg.total ? `<div class="g4">${pg.items.map(galCard).join('')}</div>${pager('galeri', pg, 'foto')}` : emptyBox('images', 'Belum ada foto', 'Foto kegiatan yang disetujui akan tampil di sini.');
}
REDRAW.galeri = drawGal;
ACT.galCat = el => { S.ui.galeri.cat = el.dataset.c; S.ui.galeri.page = 1; $$('.filters .chip').forEach(c => c.classList.toggle('on', c.dataset.c === el.dataset.c)); drawGal(); };

VIEWS.ppdb = {
  render() {
    if (!S.pub) return pubSkeleton();
    const P = pubP(), info = S.pub.info || [], gel = S.pub.gelombang || [], open = gel.find(g => gelStatus(g) === 'Dibuka');
    const langkah = info.filter(i => i.Tipe === 'langkah'), faq = info.filter(i => i.Tipe === 'faq');
    const biaya = Number(P.ppdbBiaya) || 0;
    return `<div class="wrap" style="padding:32px 20px 64px"><div class="crumb"><button ${goAttr('home')}>Beranda</button> / PPDB TA ${esc(P.tahunAjaran || '')}</div>
      <div class="page-h"><div><span class="kicker">Penerimaan Peserta Didik Baru</span><h1 style="margin-top:12px">Mulai Petualangan Belajar Ananda</h1><p class="sub">Selamat datang, Ayah & Bunda! Pendaftaran dilakukan online, mudah, dan transparan.</p></div>
        <button class="btn btn-coral pill lg" ${goAttr(open ? 'ppdb-form' : 'ppdb')} ${open ? '' : 'disabled aria-disabled="true"'}>${open ? 'Daftar Sekarang ' + ic('arrow-right') : 'Pendaftaran sedang ditutup'}</button></div>
      <h3 style="margin:8px 0 14px">${ic('calendar2-week')} Jadwal Gelombang</h3><div class="g3">${gel.map(g => { const s = gelStatus(g); return `<div class="gel ${s === 'Dibuka' ? 'open' : ''}"><div class="card-h" style="margin-bottom:8px"><div><div class="xs muted bold" style="text-transform:uppercase;letter-spacing:.05em">${esc(g.Label || '')}</div><h4>${esc(g.Nama)}</h4></div>${bdg(s, null, true)}</div><p class="small muted">Pendaftaran: <b>${fmtD(g.Buka)}</b> – <b>${fmtD(g.Tutup)}</b></p>${g.Kuota ? `<p class="small muted">Kuota: ${g.Kuota} kursi</p>` : ''}${g.Catatan ? `<p class="small" style="margin-top:6px">${esc(g.Catatan)}</p>` : ''}</div>`; }).join('') || emptyBox('calendar', 'Jadwal belum tersedia', 'Jadwal gelombang akan diumumkan sekolah.')}</div>
      ${langkah.length ? `<h3 style="margin:36px 0 14px">${ic('signpost-split')} Tahapan Pendaftaran</h3><div class="steps">${langkah.map((l, i) => `<div class="card-x step"><div class="no">${i + 1}</div><h4 style="font-size:16px;margin-bottom:4px">${esc(l.Judul)}</h4><p class="small muted">${esc(l.Isi)}</p></div>`).join('')}</div>` : ''}
      <div class="g2" style="margin-top:36px"><div class="card-x"><div class="card-h"><h3>${ic('folder2-open')} Kelengkapan Dokumen</h3></div>
        ${[['Kartu Keluarga (KK)', 'Foto/scan KK terbaru yang memuat identitas anak.', true], ['Bukti Bayar Pendaftaran', 'Foto bukti transfer atau struk pembayaran biaya formulir.', true], ['Akta Kelahiran', 'Untuk verifikasi usia calon siswa.', false], ['Ijazah / Surat Keterangan Lulus TK', 'Bila ada.', false]].map(d => `<div class="row-gap" style="padding:10px 0;border-bottom:1px solid var(--line);align-items:flex-start;flex-wrap:nowrap"><div class="grow"><b>${d[0]}</b><div class="small muted">${d[1]}</div></div>${d[2] ? bdg('Wajib', 'r') : bdg('Opsional', 's')}</div>`).join('')}</div>
        <div class="card-x"><div class="card-h"><h3>${ic('wallet2')} Biaya & Pembayaran</h3></div><div class="note" style="margin-bottom:14px">${ic('receipt')}<div><b>Biaya formulir PPDB: ${biaya ? rp(biaya) : '(akan diumumkan)'}</b><div class="small muted">Satu kali bayar. Unggah bukti bayar saat mengisi formulir.</div></div></div>
        <dl class="kv"><dt>Bank</dt><dd>${esc(P.ppdbBank || '(akan diumumkan)')}</dd><dt>No. Rekening</dt><dd>${P.ppdbRekening ? `<span class="mono">${esc(P.ppdbRekening)}</span> <button class="ibtn" style="width:30px;height:30px" data-act="copy" data-v="${esc(P.ppdbRekening)}" aria-label="Salin nomor rekening">${ic('copy')}</button>` : '(akan diumumkan)'}</dd><dt>Atas Nama</dt><dd>${esc(P.ppdbAtasNama || '(akan diumumkan)')}</dd></dl>
        <div class="sp"></div><div class="row-gap" style="align-items:flex-start;flex-wrap:nowrap"><div style="width:120px;height:120px;border-radius:12px;overflow:hidden;border:1px solid var(--line);flex:none">${P.ppdbQris ? imgOrPh(P.ppdbQris, 400, 'qr-code', 'QRIS pembayaran') : `<div class="ph" style="width:100%;height:100%">${ic('qr-code')}</div>`}</div><div class="small muted">${P.ppdbQris ? 'Scan QRIS untuk membayar lewat aplikasi bank atau dompet digital.' : 'QRIS akan diumumkan sekolah.'}</div></div></div></div>
      ${faq.length ? `<h3 style="margin:36px 0 14px">${ic('question-circle')} Pertanyaan yang Sering Diajukan</h3><div class="faq">${faq.map(f => `<details><summary>${esc(f.Judul)}${ic('chevron-down')}</summary><p>${esc(f.Isi)}</p></details>`).join('')}</div>` : ''}
      <div class="cta" style="margin-top:36px"><div><h3>Siap mendaftarkan ananda?</h3><p class="muted">Isi formulir online — hanya sekitar 10 menit. Hasil diumumkan langsung oleh sekolah.</p></div><div class="row-gap"><button class="btn btn-coral pill lg" ${goAttr('ppdb-form')} ${open ? '' : 'disabled'}>Daftar Sekarang</button>${P.whatsapp ? `<a class="btn btn-wa pill lg" href="${esc(waLink(P.whatsapp, 'Saya ingin bertanya tentang PPDB'))}" target="_blank" rel="noopener">${ic('whatsapp')} Tanya Panitia</a>` : ''}</div></div></div>`;
  }
};

const PPDB_FIELDS = ['gelombangId', 'namaSiswa', 'jk', 'tempatLahir', 'tglLahir', 'asalSekolah', 'alamat', 'namaOrtu', 'pekerjaan', 'wa', 'email'];
VIEWS['ppdb-form'] = {
  render() {
    if (!S.pub) return pubSkeleton();
    const P = pubP(), gel = S.pub.gelombang || [], dr = LS.get('ppdb_draft', {}); const open = gel.filter(g => gelStatus(g) === 'Dibuka');
    if (!open.length) return `<div class="wrap" style="padding:60px 20px;max-width:640px">${emptyBox('lock', 'Pendaftaran sedang ditutup', 'Formulir hanya dapat dikirim selama gelombang pendaftaran dibuka.', `<button class="btn btn-pri" ${goAttr('ppdb')}>Lihat Jadwal PPDB</button>`)}</div>`;
    const biaya = Number(P.ppdbBiaya) || 0;
    return `<div class="wrap" style="padding:32px 20px 64px"><div class="form-card"><div class="crumb"><button data-act="back" data-fb="ppdb">← Kembali ke Informasi PPDB</button></div>
      <div class="center" style="margin-bottom:22px"><span class="kicker">PPDB Online TA ${esc(P.tahunAjaran || '')}</span><h1 style="margin-top:12px;font-size:clamp(26px,4vw,34px)">Formulir Pendaftaran Siswa Baru</h1><p class="muted" style="margin-top:6px">Kolom bertanda <span class="req acc">*</span> wajib diisi. Data Anda hanya dapat dilihat panitia PPDB.</p></div>
      <div class="wiz" id="wiz">${['Data Calon Siswa', 'Orang Tua / Wali', 'Berkas & Bayar'].map((t, i) => `<div class="s ${i === 0 ? 'on' : ''}" data-s="${i + 1}"><div class="c">${i + 1}</div>${t}</div>`).join('')}</div>
      <form data-submit="ppdb" novalidate class="card-x" autocomplete="off"><input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0">
        <section data-step="1"><h3 style="margin-bottom:4px">${ic('person-fill')} Data Calon Siswa</h3><p class="muted small" style="margin-bottom:16px">Identitas sesuai Kartu Keluarga.</p>
          <div class="fld"><label>Pilihan Gelombang <span class="req">*</span></label><div class="grid2" style="gap:10px">${gel.map(g => { const o = gelStatus(g) === 'Dibuka'; return `<label class="gel ${o ? '' : 'muted'}" style="cursor:${o ? 'pointer' : 'not-allowed'};display:flex;gap:10px;align-items:flex-start;opacity:${o ? 1 : .55}"><input type="radio" name="gelombangId" value="${esc(g.ID)}" ${o ? '' : 'disabled'} ${(dr.gelombangId === g.ID || (!dr.gelombangId && o && g.ID === open[0].ID)) ? 'checked' : ''} style="margin-top:4px;accent-color:var(--btn)"><span><b>${esc(g.Nama)}</b><br><span class="small muted">${esc(g.Label || '')} · ${o ? 'Dibuka' : (gelStatus(g) === 'Segera' ? 'Dibuka ' + fmtD(g.Buka) : 'Ditutup')}</span></span></label>`; }).join('')}</div></div>
          ${field('namaSiswa', 'Nama Lengkap Calon Siswa', { req: 1, value: dr.namaSiswa, attrs: 'maxlength="100" autocomplete="off"', msg: 'Nama calon siswa wajib diisi.' })}
          <div class="fld"><label>Jenis Kelamin</label><div class="row-gap">${['Laki-laki', 'Perempuan'].map(j => `<label class="chk"><input type="radio" name="jk" value="${j}" ${dr.jk === j ? 'checked' : ''}> ${j}</label>`).join('')}</div></div>
          <div class="grid2">${field('tempatLahir', 'Tempat Lahir', { req: 1, value: dr.tempatLahir, attrs: 'maxlength="60"', msg: 'Tempat lahir wajib diisi.' })}${field('tglLahir', 'Tanggal Lahir', { req: 1, type: 'date', value: dr.tglLahir, attrs: `max="${todayStr()}"`, msg: 'Tanggal lahir wajib diisi.' })}</div>
          ${field('asalSekolah', 'Asal Sekolah / TK', { value: dr.asalSekolah, attrs: 'maxlength="100"', ph: 'Bila ada' })}${field('alamat', 'Alamat Lengkap', { req: 1, type: 'textarea', value: dr.alamat, attrs: 'maxlength="300"', msg: 'Alamat wajib diisi.' })}</section>
        <section data-step="2" hidden><h3 style="margin-bottom:4px">${ic('people-fill')} Data Orang Tua / Wali</h3><p class="muted small" style="margin-bottom:16px">Kontak ini dipakai panitia untuk menghubungi Anda.</p>
          <div class="grid2">${field('namaOrtu', 'Nama Orang Tua / Wali', { req: 1, value: dr.namaOrtu, attrs: 'maxlength="100"', msg: 'Nama orang tua/wali wajib diisi.' })}${field('pekerjaan', 'Pekerjaan', { value: dr.pekerjaan, attrs: 'maxlength="80"' })}</div>
          ${field('wa', 'Nomor WhatsApp Aktif', { req: 1, type: 'tel', value: dr.wa, attrs: 'inputmode="tel" pattern="^(\\+?62|0)8[0-9]{8,12}$" maxlength="16"', ph: '081234567890', msg: 'Isi nomor WhatsApp yang valid, contoh 081234567890.', help: 'Dipakai untuk jadwal observasi dan informasi dari sekolah.' })}
          ${field('email', 'Email Orang Tua', { type: 'email', value: dr.email, attrs: 'maxlength="100"', ph: 'Opsional', msg: 'Format email tidak valid.' })}</section>
        <section data-step="3" hidden><h3 style="margin-bottom:4px">${ic('folder-fill')} Unggah Berkas & Bukti Bayar</h3><p class="muted small" style="margin-bottom:14px">Foto dari HP boleh — ukuran dikecilkan otomatis. Maks. 3 MB per berkas.</p>
          <div class="note" style="margin-bottom:16px">${ic('wallet2')}<div><b>Biaya pendaftaran: ${biaya ? rp(biaya) : '(akan diumumkan)'}</b><div class="small muted">${P.ppdbRekening ? `${esc(P.ppdbBank || '')} · <span class="mono">${esc(P.ppdbRekening)}</span> a.n. ${esc(P.ppdbAtasNama || '')}` : 'Rekening akan diumumkan sekolah.'}</div></div></div>
          <div class="grid2"><div>${dz('kk', 'Kartu Keluarga (KK)', { req: 1 }).replace('data-dz="kk"', 'data-dz="kk" data-req="1"')}</div><div>${dz('bukti', 'Bukti Bayar Pendaftaran', { req: 1 }).replace('data-dz="bukti"', 'data-dz="bukti" data-req="1"')}</div><div>${dz('akta', 'Akta Kelahiran', { opt: 1 })}</div><div>${dz('ijazah', 'Ijazah / SKL TK', { opt: 1 })}</div></div>
          <div class="fld" style="margin-top:6px"><label class="chk"><input type="checkbox" name="setuju" required data-msg="Centang pernyataan untuk melanjutkan."><span>Saya menyatakan data dan berkas yang saya unggah adalah benar dan dapat dipertanggungjawabkan.</span></label><div class="fld-msg">Centang pernyataan untuk melanjutkan.</div></div></section>
        <div class="sticky-bar"><button type="button" class="btn btn-ghost" data-act="ppdbPrev" id="ppdbPrev" hidden>${ic('arrow-left')} Kembali</button><span class="grow"></span><span class="muted xs" id="ppdbSave">${ic('floppy')} Draf tersimpan otomatis</span><button type="button" class="btn btn-pri" data-act="ppdbNext" id="ppdbNext">Lanjut ${ic('arrow-right')}</button><button type="submit" class="btn btn-coral" id="ppdbSend" hidden>${ic('send')} Kirim Pendaftaran</button></div></form></div></div>`;
  },
  after() { S.ppdbStep = 1; const f = $('form[data-submit=ppdb]'); if (f) f.addEventListener('input', debounce(() => { const d = {}; PPDB_FIELDS.forEach(k => { const el = f.elements[k]; if (el) d[k] = el.value; }); LS.set('ppdb_draft', d); }, 400)); }
};
function ppdbStep(n) {
  S.ppdbStep = n; $$('[data-step]').forEach(s => { s.hidden = Number(s.dataset.step) !== n; });
  $$('#wiz .s').forEach(s => { const k = Number(s.dataset.s); s.classList.toggle('on', k === n); s.classList.toggle('done', k < n); if (k < n) $('.c', s).innerHTML = ic('check-lg'); else $('.c', s).textContent = k; });
  $('#ppdbPrev').hidden = n === 1; $('#ppdbNext').hidden = n === 3; $('#ppdbSend').hidden = n !== 3; window.scrollTo({ top: 0, behavior: 'smooth' });
}
ACT.ppdbNext = () => { const sec = $(`[data-step="${S.ppdbStep}"]`); if (validate(sec)) ppdbStep(S.ppdbStep + 1); };
ACT.ppdbPrev = () => ppdbStep(S.ppdbStep - 1);
SUBMIT.ppdb = async f => {
  if (S.ppdbStep < 3) { ACT.ppdbNext(); return; }
  if (!validate(f)) return;
  const b = $('#ppdbSend'); busy(b, true, 'Mengirim…');
  const d = {}; PPDB_FIELDS.forEach(k => { const el = f.elements[k]; if (el) d[k] = el.type === 'radio' ? (f.querySelector(`[name=${k}]:checked`) || {}).value : el.value; });
  d.gelombangId = (f.querySelector('[name=gelombangId]:checked') || {}).value; d.jk = (f.querySelector('[name=jk]:checked') || {}).value || '';
  d.website = f.elements.website.value; d.kk = fileOf('kk'); d.bukti = fileOf('bukti'); d.akta = fileOf('akta'); d.ijazah = fileOf('ijazah');
  let r; try { r = await rpc('ppdbSubmit', d); } catch (e) { r = { success: false, message: 'Gagal terhubung ke server. Periksa internet Anda lalu coba lagi.' }; }
  busy(b, false);
  if (r && r.success) { S.ppdbOk = r.data; LS.del('ppdb_draft'); clearFiles('kk', 'bukti', 'akta', 'ijazah'); S.hist = []; go('ppdb-ok', {}, { noHist: true }); }
  else { toast((r && r.message) || 'Pendaftaran gagal dikirim.', 'err'); if (r && (r.code === 'CLOSED' || r.code === 'DUP')) ppdbStep(1); }
};
VIEWS['ppdb-ok'] = {
  render() {
    const o = S.ppdbOk; if (!o) return `<div class="wrap" style="padding:60px 20px">${emptyBox('inbox', 'Belum ada pendaftaran', '', `<button class="btn btn-pri" ${goAttr('ppdb')}>Ke Halaman PPDB</button>`)}</div>`;
    return `<div class="wrap" style="padding:40px 20px 64px"><div class="card-x form-card center" style="max-width:720px;padding:36px 28px"><span class="icon-c mint" style="width:84px;height:84px;font-size:42px;margin-bottom:12px">${ic('check-circle-fill')}</span><span class="kicker">Pendaftaran Diterima</span><h1 style="margin:12px 0 8px;font-size:30px">Pendaftaran Berhasil Dikirim!</h1><p class="muted">Terima kasih telah mempercayakan pendidikan ananda kepada kami. Data dan berkas tersimpan aman untuk proses verifikasi.</p>
      <div class="note" style="margin:22px 0;text-align:left;flex-wrap:wrap;justify-content:space-between"><div><div class="xs muted bold" style="text-transform:uppercase;letter-spacing:.06em">Nomor Registrasi</div><div class="mono" style="font-size:20px;font-weight:800">${esc(o.noReg)} <button class="ibtn" data-act="copy" data-v="${esc(o.noReg)}" aria-label="Salin nomor registrasi">${ic('copy')}</button></div></div><div class="small"><div>${esc(o.gelombang)}</div><div class="muted">${fmtDT(o.waktu)}</div></div></div>
      <dl class="kv" style="text-align:left;margin-bottom:22px"><dt>Calon Siswa</dt><dd>${esc(o.nama)}</dd><dt>Orang Tua / Wali</dt><dd>${esc(o.ortu)}</dd><dt>WhatsApp</dt><dd>${esc(o.wa)}</dd></dl>
      <div class="steps" style="grid-template-columns:repeat(3,1fr);text-align:left;margin-bottom:22px">${[['Verifikasi Berkas', 'Panitia memeriksa kelengkapan data dan berkas.'], ['Dihubungi via WhatsApp', 'Jadwal dan informasi selanjutnya dikirim ke nomor Anda.'], ['Pengumuman', 'Hasil diumumkan langsung oleh sekolah.']].map((s, i) => `<div><div class="no" style="width:34px;height:34px;border-radius:50%;background:var(--soft);display:flex;align-items:center;justify-content:center;font-weight:900;margin-bottom:6px">${i + 1}</div><b class="small">${s[0]}</b><div class="xs muted">${s[1]}</div></div>`).join('')}</div>
      <div class="row-gap no-print" style="justify-content:center"><button class="btn btn-out" onclick="window.print()">${ic('printer')} Cetak / Simpan Bukti</button><button class="btn btn-pri" ${goAttr('home')}>${ic('house')} Kembali ke Beranda</button></div></div></div>`;
  }
};

VIEWS.login = {
  render(p) {
    const P = pubP();
    return `<div class="wrap" style="padding:36px 20px 64px"><div class="login-g"><div class="login-l"><span class="kicker" style="align-self:flex-start">${ic('shield-check')} Portal Terpadu</span><h2 style="font-size:30px">Satu portal untuk seluruh komunitas sekolah</h2><p class="muted">Akses cepat, transparan, dan aman untuk pembelajaran, administrasi, dan pemantauan perkembangan putra-putri tercinta.</p>
      <div class="g2" style="gap:10px">${[['person-gear', 'Admin TU'], ['mortarboard', 'Dewan Guru'], ['person-badge', 'Kepala Sekolah'], ['cash-coin', 'Bendahara'], ['people', 'Orang Tua & Wali']].map(r => `<div class="card-x flat row-gap" style="padding:12px 14px;gap:10px"><span class="icon-c mint" style="width:36px;height:36px;font-size:16px">${ic(r[0])}</span><b class="small">${r[1]}</b></div>`).join('')}</div>
      <div class="note">${ic('lock')}<span class="small">Data siswa, nilai, dan keuangan hanya dapat dilihat sesuai peran. Orang tua hanya melihat data anaknya sendiri.</span></div></div>
      <div class="login-r"><button class="btn btn-ghost sm" style="align-self:flex-start;margin-left:-12px" ${goAttr('home')}>${ic('arrow-left')} Kembali ke Beranda</button><h2 style="margin:14px 0 6px;font-size:28px">Masuk ke Aplikasi</h2><p class="muted" style="margin-bottom:20px">Gunakan email yang didaftarkan sekolah dan kode akses 6 digit dari admin.</p>
      ${p.msg ? `<div class="note warn" style="margin-bottom:14px" role="alert">${ic('exclamation-circle')}<span>${esc(p.msg)}</span></div>` : ''}
      <form data-submit="login" novalidate><div class="fld"><label for="f-email">Email terdaftar <span class="req">*</span></label><div class="inp-ic">${ic('envelope')}<input class="inp" id="f-email" name="email" type="email" required autocomplete="username" inputmode="email" placeholder="nama@gmail.com" data-msg="Isi email yang didaftarkan sekolah."></div><div class="fld-msg">Isi email yang didaftarkan sekolah.</div></div>
      <div class="fld"><label for="f-kode">Kode akses <span class="req">*</span></label><div class="inp-ic">${ic('key')}<input class="inp" id="f-kode" name="kode" type="password" required autocomplete="current-password" inputmode="numeric" maxlength="12" placeholder="6 digit" data-msg="Isi kode akses Anda."><button type="button" class="ibtn" data-act="pw" aria-label="Tampilkan kode" style="position:absolute;right:4px;top:3px">${ic('eye')}</button></div><div class="fld-msg">Isi kode akses Anda.</div></div>
      <div id="loginErr" class="note bad" hidden role="alert" style="margin-bottom:14px"></div><button class="btn btn-pri lg block" type="submit">${ic('box-arrow-in-right')} Masuk</button></form>
      <div class="sp"></div><p class="small muted">Belum punya akses atau lupa kode? Hubungi Tata Usaha${P.whatsapp ? ` — <a href="${esc(waLink(P.whatsapp, 'Saya ingin meminta akses / kode masuk aplikasi sekolah'))}" target="_blank" rel="noopener">WhatsApp sekolah</a>` : ''}.</p></div></div></div>`;
  },
  after(p) { const e = $('#f-email'); if (e && p.email) e.value = p.email; const last = LS.get('last_email', ''); if (e && !e.value && last) e.value = last; }
};
SUBMIT.login = async f => {
  if (!validate(f)) return; const b = $('button[type=submit]', f); busy(b, true, 'Memeriksa…'); const er = $('#loginErr'); er.hidden = true;
  const d = formData(f); const r = await doLogin(d.email, d.kode); busy(b, false);
  if (r && r.success) {
    LS.set('last_email', d.email); const nxt = (S.params && S.params.next) || LANDING[S.user.role];
    S.hist = []; go(VIEWS[nxt] && VIEWS[nxt].panel && (!VIEWS[nxt].role || VIEWS[nxt].role.indexOf(S.user.role) >= 0) ? nxt : LANDING[S.user.role], {}, { noHist: true }); toast('Selamat datang, ' + S.user.nama + '!', 'ok');
  } else if (r && r.code === 'NOT_REGISTERED') go('denied', { email: d.email });
  else { er.hidden = false; er.innerHTML = `${ic('exclamation-triangle')}<span>${esc((r && r.message) || 'Gagal masuk.')}</span>`; }
};
VIEWS.denied = {
  render(p) {
    const P = pubP();
    return `<div class="wrap" style="padding:48px 20px 64px"><div class="card-x form-card center" style="max-width:600px;padding:34px 28px"><span class="icon-c coral" style="width:76px;height:76px;font-size:34px;margin-bottom:12px">${ic('lock-fill')}</span><h1 style="font-size:28px">Akun Anda belum terdaftar</h1><p class="muted" style="margin:8px 0 18px">Email <b>${esc(p.email || '')}</b> belum tercatat dalam daftar akses sekolah.</p>
      <div style="text-align:left;display:grid;gap:10px;margin-bottom:22px">${[['people', 'Sebagai Orang Tua', 'Pastikan Anda memakai email yang didaftarkan sekolah untuk data anak Anda.'], ['mortarboard', 'Sebagai Guru / Staf', 'Gunakan email yang didaftarkan admin pada data guru.'], ['person-plus', 'Pendaftar PPDB baru', 'Akses aplikasi diberikan setelah anak diterima. Hubungi Tata Usaha bila perlu.']].map(r => `<div class="note">${ic(r[0])}<div><b>${r[1]}</b><div class="small muted">${r[2]}</div></div></div>`).join('')}</div>
      <div class="row-gap" style="justify-content:center"><button class="btn btn-pri" ${goAttr('login')}>${ic('person-circle')} Coba Email Lain</button>${P.whatsapp ? `<a class="btn btn-wa" href="${esc(waLink(P.whatsapp, 'Email saya belum terdaftar di aplikasi sekolah: ' + (p.email || '')))}" target="_blank" rel="noopener">${ic('whatsapp')} Hubungi Tata Usaha</a>` : ''}</div><div class="sp"></div><button class="btn btn-ghost sm" ${goAttr('home')}>← Kembali ke Beranda</button></div></div>`;
  }
};

function formModal(o) {
  const fid = uid('f');
  const h = openModal({ title: o.title, size: o.size, body: `<form id="${fid}" novalidate autocomplete="off">${o.body}</form>`,
    footer: `<button class="btn btn-ghost" data-close type="button">Batal</button><button class="btn btn-pri" form="${fid}" type="submit">${o.ok || 'Simpan'}</button>`, onOpen: o.onOpen });
  const form = $('#' + fid, h.el); const btn = $('button[type=submit]', h.el);
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (!validate(form)) return; busy(btn, true, 'Menyimpan…');
    let res; try { res = await o.onSubmit(formData(form), form, h); } catch (err) { toast(err.message || 'Gagal.', 'err'); res = false; }
    busy(btn, false); if (res !== false) h.close();
  });
  return h;
}
const kelasOpts = (all, label) => [[all ? '' : '', label || (all ? 'Semua kelas' : 'Pilih kelas')]].concat(D('kelas').map(k => [k.ID, 'Kelas ' + k.Nama]));
const statusSearch = (txt, ...parts) => !txt || parts.join(' ').toLowerCase().indexOf(txt.toLowerCase()) >= 0;
const isReadOnly = () => !S.user || S.user.role !== 'admin';
async function previewFile(fileId, title) {
  const h = openModal({ title: title || 'Pratinjau Berkas', size: 'lg', body: '<div class="center" style="padding:40px"><span class="spin"></span><p class="muted" style="margin-top:12px">Memuat berkas…</p></div>' });
  const r = await api('fileData', { id: fileId });
  if (!h.el.isConnected) return;
  const body = $('.mo-b', h.el);
  if (!r.success) { body.innerHTML = `<div class="note bad">${ic('exclamation-triangle')}<span>${esc(r.message)}</span></div>`; return; }
  const bin = atob(r.data.b64); const arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([arr], { type: r.data.mime }));
  h.onUrl = url; const old = h.close; h.close = v => { URL.revokeObjectURL(url); old(v); };
  body.innerHTML = (r.data.mime === 'application/pdf' ? `<iframe src="${url}" title="PDF" style="width:100%;height:68dvh;border:1px solid var(--line);border-radius:12px"></iframe>` : `<div class="center"><img src="${url}" alt="${esc(r.data.name)}" style="max-height:70dvh;border-radius:12px"></div>`) + `<div class="center" style="margin-top:12px"><a class="btn btn-soft sm" href="${url}" download="${esc(r.data.name)}">${ic('download')} Unduh</a></div>`;
}
ACT.preview = el => previewFile(el.dataset.id, el.dataset.t);

const absByDate = () => { const m = {}; D('absensiAgg').forEach(d => { const o = m[d.t] || (m[d.t] = { h: 0, s: 0, i: 0, a: 0 }); o.h += d.h; o.s += d.s; o.i += d.i; o.a += d.a; }); return m; };
const absTot = o => o.h + o.s + o.i + o.a;
const absPct = o => absTot(o) ? pct(o.h, absTot(o)) : 0;
const activeSiswa = () => D('siswa').filter(s => s.Status === 'Aktif');
function recountKelas() { const c = {}; activeSiswa().forEach(s => { c[s.KelasID] = (c[s.KelasID] || 0) + 1; }); D('kelas').forEach(k => { k.Jumlah = c[k.ID] || 0; }); }
function thisMonth() { return todayStr().slice(0, 7); }

function insightsAdmin() {
  const out = []; const days = D('absensiAgg'); const t0 = todayStr(); const from = addDays(t0, -7);
  const per = {}; days.filter(d => d.t >= from).forEach(d => { const o = per[d.k] || (per[d.k] = { h: 0, t: 0 }); o.h += d.h; o.t += d.h + d.s + d.i + d.a; });
  const low = Object.keys(per).map(k => ({ k, p: pct(per[k].h, per[k].t) })).sort((a, b) => a.p - b.p)[0];
  if (low && low.p < 95) out.push(['graph-down-arrow', `Kehadiran <b>Kelas ${esc(kelasNama(low.k))}</b> 7 hari terakhir hanya <b>${low.p}%</b> — perlu perhatian wali kelas.`]);
  const dow = new Date(t0 + 'T00:00:00Z').getUTCDay();
  if (dow !== 0 && dow !== 6) { const done = {}; days.filter(d => d.t === t0).forEach(d => { done[d.k] = 1; }); const miss = D('kelas').filter(k => k.Jumlah && !done[k.ID]); if (miss.length) out.push(['hourglass-split', `${miss.length} kelas belum mengisi absensi hari ini: ${miss.slice(0, 4).map(k => esc(k.Nama)).join(', ')}${miss.length > 4 ? '…' : ''}.`]); }
  const sp = D('sppAgg').find(x => x.bulan === thisMonth()); if (sp) { const tt = sp.lunas + sp.menunggu + sp.belum; out.push(['cash-coin', `SPP ${fmtBulan(sp.bulan)}: <b>${sp.lunas} dari ${tt}</b> siswa lunas (${pct(sp.lunas, tt)}%)${sp.menunggu ? `, ${sp.menunggu} menunggu verifikasi bendahara` : ''}.`]); }
  const nb = D('pendaftar').filter(p => p.Status === 'Baru').length; if (nb) out.push(['person-plus', `<b>${nb} pendaftar PPDB baru</b> menunggu verifikasi berkas.`]);
  const ni = activeSiswa().filter(s => s.IzinFoto !== 'Ya').length; if (ni) out.push(['shield-exclamation', `${ni} siswa belum tercatat persetujuan foto publik — fotonya tidak akan tampil di situs.`]);
  if (!out.length) out.push(['emoji-smile', 'Semua berjalan baik. Tidak ada hal mendesak hari ini.']);
  return out;
}
VIEWS.dash = {
  panel: true, role: ['admin', 'guru'],
  render() { return S.user.role === 'admin' ? dashAdmin() : dashGuru(); },
  after() { if (S.user.role === 'admin') chartsAdmin(); }
};
function dashAdmin() {
  const aktif = activeSiswa(); const abd = absByDate(); const ds = Object.keys(abd).sort(); const last = ds[ds.length - 1]; const lo = last ? abd[last] : { h: 0, s: 0, i: 0, a: 0 };
  const guruN = D('guru').filter(g => g.Status !== 'Nonaktif').length; const nb = D('pendaftar').filter(p => p.Status === 'Baru').length;
  const sp = D('sppAgg').find(x => x.bulan === thisMonth());
  return `<div class="hello"><div><h1>Selamat datang, ${esc(S.user.nama.split(',')[0])}</h1><p class="muted">${hariD(todayStr())}, ${fmtD(todayStr())} · Kelola data siswa, PPDB, dan konten sekolah dalam satu tempat.</p></div>
    <div class="quick"><button class="btn btn-pri" ${goAttr('siswa-form')}>${ic('person-plus')} Tambah Siswa</button><button class="btn btn-out" ${goAttr('konten', { tab: 'berita', new: 1 })}>${ic('plus-lg')} Tambah Berita</button><button class="btn btn-soft" ${goAttr('ppdb')}>${ic('person-lines-fill')} Lihat Pendaftar ${nb ? `<span class="bdg r">${nb} baru</span>` : ''}</button></div></div>
    <div class="stats">${statCard('Total siswa aktif', `<span class="tnum">${aktif.length}</span>`, `${D('kelas').length} kelas`, 'people-fill', 'mint')}${statCard('Guru & staf', `<span class="tnum">${guruN}</span>`, 'Aktif', 'person-badge-fill', 'blue')}
    ${statCard(last === todayStr() ? 'Kehadiran hari ini' : 'Kehadiran terakhir', `<span class="tnum">${absTot(lo) ? absPct(lo) + '%' : '–'}</span>`, absTot(lo) ? `${lo.h} hadir · ${lo.i} izin · ${lo.s} sakit · ${lo.a} alpa <span class="muted">(${last ? fmtD(last) : ''})</span>` : 'Belum ada absensi tercatat', 'calendar-check-fill', 'yellow')}${statCard('Pendaftar PPDB baru', `<span class="tnum">${nb}</span>`, nb ? 'Perlu verifikasi berkas' : 'Tidak ada yang menunggu', 'person-plus-fill', 'coral')}</div>
    <div class="two"><div class="card-x"><div class="card-h"><div><h3>Tren Kehadiran Siswa</h3><div class="sub">30 hari pencatatan terakhir · seluruh kelas</div></div></div>${ds.length ? cv('chAbs') : emptyBox('graph-up', 'Belum ada data absensi', 'Grafik muncul setelah guru mengisi absensi.')}</div>
      <div class="card-x"><div class="card-h"><div><h3>Pembayaran SPP</h3><div class="sub">${sp ? `${fmtBulan(sp.bulan)} · terkumpul ${rp(sp.total)}` : 'Belum ada tagihan'}</div></div></div>${D('sppAgg').length ? cv('chSpp') : emptyBox('cash-stack', 'Belum ada data SPP', 'Bendahara membuat tagihan bulanan.')}</div></div>
    <div class="two eq"><div class="insight"><h3>${ic('stars')} Wawasan Otomatis</h3><ul>${insightsAdmin().map(i => `<li>${ic(i[0])}<span>${i[1]}</span></li>`).join('')}</ul></div>
      <div class="card-x"><div class="card-h"><div><h3>Aktivitas Terakhir</h3><div class="sub">Catatan perubahan data oleh pengguna</div></div></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Waktu</th><th>Pengguna</th><th>Modul</th><th>Aktivitas</th></tr></thead><tbody>${D('log').slice(0, 7).map(l => `<tr><td class="mono xs">${esc(String(l.w).slice(5, 16))}</td><td>${esc(l.n || l.e)}</td><td>${bdg(l.m, 'm')}</td><td class="small">${esc(l.a)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted center">Belum ada aktivitas.</td></tr>'}</tbody></table></div></div></div>`;
}
function chartsAdmin() {
  const abd = absByDate(); const ds = Object.keys(abd).sort().slice(-30);
  if (ds.length) drawChart('chAbs', { type: 'line', data: { labels: ds.map(d => d.slice(8) + ' ' + MON[+d.slice(5, 7) - 1]), datasets: [{ label: 'Kehadiran (%)', data: ds.map(d => absPct(abd[d])), borderColor: cssVar('--pri'), backgroundColor: 'rgba(21,138,115,.14)', fill: true, tension: .35, pointRadius: 3, borderWidth: 2.5 }] }, options: { scales: { y: { min: Math.max(0, Math.min(...ds.map(d => absPct(abd[d]))) - 8), max: 100, ticks: { callback: v => v + '%' } } }, plugins: { legend: { display: false } } } });
  const sp = D('sppAgg').slice(-6);
  if (sp.length) drawChart('chSpp', { type: 'bar', data: { labels: sp.map(x => MON[+x.bulan.slice(5) - 1]), datasets: [{ label: 'Lunas', data: sp.map(x => x.lunas), backgroundColor: cssVar('--pri'), borderRadius: 6 }, { label: 'Belum / menunggu', data: sp.map(x => x.belum + x.menunggu), backgroundColor: cssVar('--coral'), borderRadius: 6 }] }, options: { scales: { x: { stacked: true }, y: { stacked: true } } } });
}
function dashGuru() {
  const k = S.user.kelasId; const rows = D('absensi'); const t = todayStr(); const hari = rows.filter(r => r.t === t); const sis = activeSiswa();
  if (!k) return `<div class="page-h"><div><h1>Dashboard Guru</h1></div></div>${emptyBox('person-x', 'Anda belum ditetapkan sebagai wali kelas', 'Minta admin mengisi kolom "Kelas yang diampu" pada data Anda.')}`;
  const cnt = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0 }; hari.forEach(r => { cnt[r.st]++; });
  const from = addDays(t, -7); const w = rows.filter(r => r.t >= from); const wp = w.length ? pct(w.filter(r => r.st === 'Hadir').length, w.length) : 0;
  const bln = thisMonth(); const sd = D('absensiSiswa'); const rank = sis.map(s => { const m = (sd[s.ID] && sd[s.ID].m[bln]) || [0, 0, 0, 0]; return { s, bad: m[1] + m[2] + m[3] * 2, m }; }).filter(x => x.bad > 0).sort((a, b) => b.bad - a.bad).slice(0, 4);
  const nl = {}; D('nilai').forEach(n => { const o = nl[n.Mapel] || (nl[n.Mapel] = { n: 0, sum: 0, st: n.Status, w: '' }); if (n.Akhir !== '') { o.n++; o.sum += Number(n.Akhir); } if (n.Waktu > o.w) o.w = n.Waktu; if (n.Status === 'Draf') o.st = 'Draf'; });
  return `<div class="hello"><div><h1>Selamat datang, ${esc(S.user.nama.split(',')[0])}</h1><p class="muted">Wali Kelas ${esc(kelasNama(k))} · ${hariD(t)}, ${fmtD(t)}</p></div><div class="quick"><button class="btn btn-soft" data-act="fotoKegiatan">${ic('camera')} Unggah Foto Kegiatan</button></div></div>
    <div class="card-x" style="background:${hari.length ? 'var(--g-bg)' : 'var(--soft)'};margin-bottom:20px"><div class="row-gap" style="justify-content:space-between"><div class="row-gap"><span class="icon-c ${hari.length ? 'mint' : 'yellow'}">${ic(hari.length ? 'check2-circle' : 'hourglass-split')}</span><div><div class="xs bold muted" style="letter-spacing:.06em;text-transform:uppercase">Status absensi hari ini</div><h3>${hari.length ? `Absensi Kelas ${esc(kelasNama(k))} sudah diisi` : `Absensi Kelas ${esc(kelasNama(k))} belum diisi`}</h3><div class="small muted">${hari.length ? `${cnt.Hadir} hadir · ${cnt.Izin} izin · ${cnt.Sakit} sakit · ${cnt.Alpa} alpa` : 'Isi sebelum jam pelajaran dimulai agar rekap harian akurat.'}</div></div></div><button class="btn btn-coral" ${goAttr('absensi')}>${hari.length ? 'Lihat / Ubah Absensi' : 'Isi Absensi Sekarang'} ${ic('arrow-right')}</button></div></div>
    <div class="stats" style="grid-template-columns:repeat(3,1fr)">${statCard('Siswa terdaftar', `<span class="tnum">${sis.length}</span>`, `${sis.filter(s => s.JK === 'Laki-laki').length} laki-laki · ${sis.filter(s => s.JK === 'Perempuan').length} perempuan`, 'people-fill', 'mint')}${statCard('Hadir hari ini', `<span class="tnum">${hari.length ? cnt.Hadir : '–'}</span>`, hari.length ? `dari ${hari.length} siswa tercatat` : 'Belum diabsen', 'check2-all', 'yellow')}${statCard('Kehadiran 7 hari', `<span class="tnum">${w.length ? wp + '%' : '–'}</span>`, 'Rata-rata kelas', 'graph-up-arrow', 'blue')}</div>
    <div class="two eq"><div class="card-x"><div class="card-h"><div><h3>Nilai yang Anda input</h3><div class="sub">Semester ${esc(prof().semester || '')} · TA ${esc(prof().tahunAjaran || '')}</div></div><button class="btn btn-soft sm" ${goAttr('nilai')}>Buku Nilai</button></div>
      ${Object.keys(nl).length ? Object.keys(nl).map(m => `<div class="row-gap" style="padding:10px 0;border-bottom:1px solid var(--line)"><div class="grow"><b>${esc(m)}</b><div class="xs muted">${nl[m].n} siswa dinilai · diperbarui ${fmtD(String(nl[m].w).slice(0, 10))}</div></div><span class="akhir ${nl[m].n && nl[m].sum / nl[m].n < Number(prof().kkm || 70) ? 'low' : ''}">${nl[m].n ? (Math.round(nl[m].sum / nl[m].n * 10) / 10) : '–'}</span>${bdg(nl[m].st)}</div>`).join('') : emptyBox('journal', 'Belum ada nilai', 'Mulai input nilai dari menu Buku Nilai.')}</div>
      <div class="card-x"><div class="card-h"><div><h3>Perlu perhatian bulan ini</h3><div class="sub">Siswa dengan izin, sakit, atau alpa terbanyak</div></div></div>${rank.length ? rank.map(x => `<div class="row-gap" style="padding:10px 0;border-bottom:1px solid var(--line)">${avatar(x.s.Nama, x.s.FotoThumb, 'sm')}<div class="grow"><b>${esc(x.s.Nama)}</b><div class="xs muted">${x.m[1]} sakit · ${x.m[2]} izin · ${x.m[3]} alpa</div></div></div>`).join('') : emptyBox('emoji-smile', 'Kehadiran baik', 'Belum ada catatan ketidakhadiran bulan ini.')}</div></div>`;
}
ACT.fotoKegiatan = () => {
  formModal({ title: 'Unggah Foto Kegiatan', body: `<div class="note" style="margin-bottom:14px">${ic('info-circle')}<span class="small">Foto yang Anda unggah akan ditinjau admin. Hanya admin yang dapat menampilkannya di situs publik, setelah memastikan persetujuan orang tua.</span></div>${field('Judul', 'Judul kegiatan', { req: 1, attrs: 'maxlength="120"', msg: 'Judul wajib diisi.' })}<div class="grid2">${field('Tanggal', 'Tanggal kegiatan', { type: 'date', value: todayStr(), req: 1 })}${field('Kategori', 'Kategori', { value: 'Kegiatan', attrs: 'maxlength="40"' })}</div>${dz('gfoto', 'Foto', { req: 1, imageOnly: 1 }).replace('data-dz="gfoto"', 'data-dz="gfoto" data-req="1"')}`,
    onSubmit: async d => { const r = await api('galeriSave', { rec: { Judul: d.Judul, Tanggal: d.Tanggal, Kategori: d.Kategori }, file: fileOf('gfoto') }); if (!r.success) { toast(r.message, 'err'); return false; } clearFiles('gfoto'); toast('Foto terkirim. Menunggu tinjauan admin.', 'ok'); } });
};

S.sel = { siswa: new Set() };
function siswaFiltered() {
  const u = S.ui.siswa; return D('siswa').filter(s => (!u.kelas || s.KelasID === u.kelas) && (!u.status || s.Status === u.status) && (!u.izin || s.IzinFoto !== 'Ya') && statusSearch(u.q, s.Nama, s.NIS, s.NamaOrtu))
    .sort((a, b) => (kelasNama(a.KelasID) + a.Nama).localeCompare(kelasNama(b.KelasID) + b.Nama, 'id'));
}
VIEWS.siswa = {
  panel: true, role: ['admin', 'guru'], deps: ['siswa', 'kelas'],
  render() {
    const u = S.ui.siswa = S.ui.siswa || { q: '', kelas: '', status: '', izin: false, page: 1 }; const adm = !isReadOnly(); const all = D('siswa'); const aktif = all.filter(s => s.Status === 'Aktif');
    const izinN = aktif.filter(s => s.IzinFoto === 'Ya').length;
    return `<div class="page-h"><div><h1>${adm ? 'Data Siswa' : 'Siswa Kelas ' + esc(kelasNama(S.user.kelasId))}</h1><p class="sub">TA ${esc(prof().tahunAjaran || '')} · <b>${aktif.length}</b> siswa aktif</p></div>
      <div class="row-gap">${adm ? `<button class="btn btn-soft" data-act="siswaCsv">${ic('download')} Unduh Rekap (CSV)</button><button class="btn btn-pri" ${goAttr('siswa-form')}>${ic('person-plus')} Tambah Siswa</button>` : ''}</div></div>
    <div class="stats">${statCard('Siswa aktif', `<span class="tnum">${aktif.length}</span>`, `${all.length - aktif.length} nonaktif`, 'people-fill', 'mint')}${statCard('Persetujuan foto publik', `<span class="tnum">${aktif.length ? pct(izinN, aktif.length) : 0}%</span>`, `${izinN} siswa tercatat disetujui`, 'patch-check-fill', 'mint')}${statCard('Belum ada persetujuan', `<span class="tnum">${aktif.length - izinN}</span>`, 'Foto tidak tampil di publik', 'shield-exclamation', 'coral')}${statCard('Jumlah kelas', `<span class="tnum">${D('kelas').length}</span>`, 'Rombel aktif', 'door-open-fill', 'blue')}</div>
    <div class="card-x pad0"><div style="padding:16px 18px 4px"><div class="filters"><div class="inp-ic">${ic('search')}<input class="inp" data-bind="siswaQ" value="${esc(u.q)}" placeholder="Cari nama siswa, NIS, atau orang tua…" aria-label="Cari siswa"></div>
      ${adm ? `<select class="inp" data-chg="siswaKelas" aria-label="Filter kelas">${kelasOpts(true).map(k => `<option value="${esc(k[0])}" ${u.kelas === k[0] ? 'selected' : ''}>${esc(k[1])}</option>`).join('')}</select>` : ''}
      <select class="inp" data-chg="siswaStatus" aria-label="Filter status"><option value="">Semua status</option><option ${u.status === 'Aktif' ? 'selected' : ''}>Aktif</option><option ${u.status === 'Nonaktif' ? 'selected' : ''}>Nonaktif</option></select>
      <button class="chip ${u.izin ? 'on' : ''}" data-act="siswaIzin">${ic('shield-exclamation')} Belum ada persetujuan foto</button>${adm ? '<span id="selBar"></span>' : ''}</div></div><div id="siswaTbl"></div></div>`;
  },
  after() { drawSiswa(); }
};
function drawSiswa() {
  const u = S.ui.siswa; const adm = !isReadOnly(); const list = siswaFiltered(); const pg = paginate(list, u.page, 10);
  const izin = s => s.IzinFoto === 'Ya' ? bdg('Disetujui', 'g') : bdg('Belum ada surat', 'a');
  const act = s => `<button class="ibtn" data-act="siswaView" data-id="${esc(s.ID)}" aria-label="Lihat ${esc(s.Nama)}">${ic('eye')}</button>${adm ? `<button class="ibtn" ${goAttr('siswa-form', { id: s.ID })} aria-label="Ubah ${esc(s.Nama)}">${ic('pencil')}</button><button class="ibtn danger" data-act="siswaDel" data-id="${esc(s.ID)}" aria-label="Hapus ${esc(s.Nama)}">${ic('trash3')}</button>` : ''}`;
  const sel = S.sel.siswa;
  $('#siswaTbl').innerHTML = pg.total ? `<div class="tbl-w stack"><table class="tbl"><thead><tr>${adm ? `<th style="width:40px"><input type="checkbox" data-act="siswaAll" aria-label="Pilih semua di halaman ini" ${pg.items.every(s => sel.has(s.ID)) ? 'checked' : ''}></th>` : ''}<th>Siswa</th><th>Kelas</th><th>Orang tua & kontak</th><th>Foto publik</th><th>Status</th><th class="act">Aksi</th></tr></thead><tbody>
    ${pg.items.map(s => `<tr class="${sel.has(s.ID) ? 'sel' : ''}">${adm ? `<td><input type="checkbox" data-act="siswaSel" data-id="${esc(s.ID)}" ${sel.has(s.ID) ? 'checked' : ''} aria-label="Pilih ${esc(s.Nama)}"></td>` : ''}<td><div class="row-gap" style="gap:10px;flex-wrap:nowrap">${avatar(s.Nama, s.FotoThumb)}<div><b>${esc(s.Nama)}</b><div class="xs muted tnum">NIS ${esc(s.NIS)} · ${esc(s.JK || '')}</div></div></div></td><td>${bdg('Kelas ' + kelasNama(s.KelasID), 'm')}</td><td><div>${esc(s.NamaOrtu || '-')}</div><div class="xs muted tnum">${esc(s.WA || '')}</div></td><td>${izin(s)}</td><td>${bdg(s.Status)}</td><td class="act">${act(s)}</td></tr>`).join('')}</tbody></table></div>
    <div class="cards-m" style="padding:0 14px 14px">${pg.items.map(s => `<div class="m-card"><div class="row-gap" style="flex-wrap:nowrap">${avatar(s.Nama, s.FotoThumb)}<div class="grow"><b>${esc(s.Nama)}</b><div class="xs muted">NIS ${esc(s.NIS)} · Kelas ${esc(kelasNama(s.KelasID))}</div></div>${bdg(s.Status)}</div><div class="row-gap">${izin(s)}</div><div class="row-gap">${act(s)}</div></div>`).join('')}</div>${pager('siswa', pg, 'siswa')}`
    : emptyBox('people', 'Tidak ada siswa ditemukan', 'Ubah kata kunci atau filter.', adm ? `<button class="btn btn-pri" ${goAttr('siswa-form')}>${ic('person-plus')} Tambah Siswa</button>` : '');
  const sb = $('#selBar'); if (sb) sb.innerHTML = sel.size ? `<button class="btn btn-danger sm" data-act="siswaDelSel">${ic('trash3')} Hapus ${sel.size} terpilih</button>` : '';
}
REDRAW.siswa = drawSiswa;
BIND.siswaQ = debounce(t => { S.ui.siswa.q = t.value; S.ui.siswa.page = 1; drawSiswa(); }, 180);
BIND.siswaKelas = t => { S.ui.siswa.kelas = t.value; S.ui.siswa.page = 1; drawSiswa(); };
BIND.siswaStatus = t => { S.ui.siswa.status = t.value; S.ui.siswa.page = 1; drawSiswa(); };
ACT.siswaIzin = el => { S.ui.siswa.izin = !S.ui.siswa.izin; el.classList.toggle('on', S.ui.siswa.izin); S.ui.siswa.page = 1; drawSiswa(); };
ACT.siswaSel = el => { el.checked ? S.sel.siswa.add(el.dataset.id) : S.sel.siswa.delete(el.dataset.id); drawSiswa(); };
ACT.siswaAll = el => { const pg = paginate(siswaFiltered(), S.ui.siswa.page, 10); pg.items.forEach(s => el.checked ? S.sel.siswa.add(s.ID) : S.sel.siswa.delete(s.ID)); drawSiswa(); };
ACT.siswaCsv = () => downloadCSV('data-siswa-' + todayStr() + '.csv', [['NIS', 'Nama', 'JK', 'Kelas', 'Tempat Lahir', 'Tgl Lahir', 'Orang Tua', 'WA', 'Status', 'Persetujuan Foto']].concat(siswaFiltered().map(s => [s.NIS, s.Nama, s.JK, kelasNama(s.KelasID), s.TempatLahir, s.TglLahir, s.NamaOrtu, s.WA, s.Status, s.IzinFoto === 'Ya' ? 'Disetujui' : 'Belum'])));
async function hapusSiswa(ids) {
  const names = ids.map(i => siswaNama(i)); const ok = await confirmBox({ title: 'Hapus data siswa?', text: ids.length === 1 ? `Data <b>${esc(names[0])}</b> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.` : `<b>${ids.length} data siswa</b> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`, ok: 'Ya, hapus' });
  if (!ok) return;
  mutate('siswaDelete', { ids }, () => { S.db.siswa = D('siswa').filter(s => ids.indexOf(s.ID) < 0); ids.forEach(i => S.sel.siswa.delete(i)); recountKelas(); }, { ok: r => toast(r.message, 'ok') });
  toast('Data siswa dihapus.', 'ok');
}
ACT.siswaDel = el => hapusSiswa([el.dataset.id]);
ACT.siswaDelSel = () => hapusSiswa(Array.from(S.sel.siswa));
ACT.siswaView = el => {
  const s = ix('siswa')[el.dataset.id]; if (!s) return; const adm = !isReadOnly();
  const h = openModal({ title: 'Detail Siswa', size: 'lg', body: `<div class="row-gap" style="gap:16px;flex-wrap:nowrap;margin-bottom:18px">${avatar(s.Nama, s.FotoThumb, 'lg')}<div><h2 style="font-size:22px">${esc(s.Nama)}</h2><div class="muted small">NIS ${esc(s.NIS)} · Kelas ${esc(kelasNama(s.KelasID))} · ${bdg(s.Status)}</div></div></div>
    <dl class="kv"><dt>Jenis kelamin</dt><dd>${esc(s.JK || '-')}</dd><dt>Tempat, tgl lahir</dt><dd>${esc(s.TempatLahir || '-')}, ${fmtD(s.TglLahir) || '-'}</dd>${s.Alamat !== undefined ? `<dt>Alamat</dt><dd>${esc(s.Alamat || '-')}</dd>` : ''}<dt>Orang tua / wali</dt><dd>${esc(s.NamaOrtu || '-')}</dd><dt>WhatsApp</dt><dd>${s.WA ? `<a href="${esc(waLink(s.WA))}" target="_blank" rel="noopener">${esc(s.WA)}</a>` : '-'}</dd>${s.EmailOrtu !== undefined ? `<dt>Email orang tua</dt><dd>${esc(s.EmailOrtu || '-')}</dd>` : ''}</dl>
    <div class="note ${s.IzinFoto === 'Ya' ? '' : 'warn'}" style="margin-top:16px">${ic(s.IzinFoto === 'Ya' ? 'patch-check' : 'shield-exclamation')}<div><b>Persetujuan foto di publik: ${s.IzinFoto === 'Ya' ? 'Disetujui' + (s.TglIzinFoto ? ' (' + fmtD(s.TglIzinFoto) + ')' : '') : 'Belum ada surat'}</b><div class="small muted">Surat persetujuan orang tua disimpan sebagai arsip fisik sekolah.</div></div></div>
    ${adm ? `<div class="row-gap" style="margin-top:12px"><button class="btn btn-soft sm" data-act="siswaIzinToggle" data-id="${esc(s.ID)}">${s.IzinFoto === 'Ya' ? ic('x-circle') + ' Cabut persetujuan' : ic('check-circle') + ' Catat persetujuan diterima'}</button><button class="btn btn-ghost sm" ${goAttr('siswa-form', { id: s.ID })}>${ic('pencil')} Ubah data</button></div>
    <h4 style="margin:22px 0 10px">${ic('file-earmark-text')} Dokumen Rapor</h4><div id="dokBox"><span class="spin sm"></span></div>` : ''}` });
  if (adm) loadDok(s.ID, h);
};
async function loadDok(id, h) {
  const r = await api('dokumenList', { siswaId: id }); const box = $('#dokBox', h.el); if (!box) return;
  const rows = r.success ? r.data : [];
  box.innerHTML = `${rows.length ? rows.map(d => `<div class="row-gap" style="padding:8px 0;border-bottom:1px solid var(--line)"><span class="grow">${ic('file-earmark-pdf')} <b>${esc(d.Jenis)}</b> <span class="muted small">${esc(d.Semester || '')} · ${fmtD(d.Tgl)}</span></span><button class="btn btn-ghost sm" data-act="preview" data-id="${esc(d.FileId)}" data-t="${esc(d.Jenis + ' ' + siswaNama(id))}">Buka</button><button class="ibtn danger" data-act="dokDel" data-id="${esc(d.ID)}" data-s="${esc(id)}" aria-label="Hapus dokumen">${ic('trash3')}</button></div>`).join('') : '<p class="muted small">Belum ada dokumen rapor.</p>'}
    <div style="margin-top:12px">${dz('rapor', 'Unggah dokumen rapor', { opt: 0 })}<div class="grid2">${field('rSem', 'Semester', { value: (prof().tahunAjaran || '') + ' ' + (prof().semester || '') })}<div class="fld"><label>&nbsp;</label><button class="btn btn-pri" data-act="dokUp" data-id="${esc(id)}">${ic('cloud-arrow-up')} Unggah</button></div></div></div>`;
}
ACT.dokUp = async el => {
  const f = fileOf('rapor'); if (!f) { toast('Pilih berkas rapor terlebih dahulu.', 'warn'); return; }
  busy(el, true, 'Mengunggah…'); const sem = ($('#f-rSem') || {}).value || '';
  const r = await api('dokumenUpload', { siswaId: el.dataset.id, jenis: 'Rapor', semester: sem, file: f }); busy(el, false);
  if (!r.success) { toast(r.message, 'err'); return; } clearFiles('rapor'); toast('Dokumen rapor tersimpan.', 'ok'); const m = el.closest('.mo'); const hh = _modals.find(x => x.el === m); if (hh) loadDok(el.dataset.id, hh);
};
ACT.dokDel = async el => { if (!await confirmBox({ title: 'Hapus dokumen?', text: 'Dokumen rapor akan dihapus.', ok: 'Hapus' })) return; const r = await api('dokumenDelete', { id: el.dataset.id }); if (!r.success) { toast(r.message, 'err'); return; } toast('Dokumen dihapus.', 'ok'); const m = el.closest('.mo'); const hh = _modals.find(x => x.el === m); if (hh) loadDok(el.dataset.s, hh); };
ACT.siswaIzinToggle = el => {
  const s = ix('siswa')[el.dataset.id]; const ya = s.IzinFoto !== 'Ya'; el.closest('.mo').querySelector('[data-close]').click();
  mutate('siswaSave', { rec: { ID: s.ID, NIS: s.NIS, Nama: s.Nama, KelasID: s.KelasID, IzinFoto: ya ? 'Ya' : 'Tidak', TglIzinFoto: ya ? todayStr() : '' } }, () => { s.IzinFoto = ya ? 'Ya' : 'Tidak'; s.TglIzinFoto = ya ? todayStr() : ''; }, { ok: () => { } });
  toast(ya ? 'Persetujuan foto dicatat.' : 'Persetujuan dicabut. Foto terkait ditarik dari publik.', ya ? 'ok' : 'warn');
};

VIEWS['siswa-form'] = {
  panel: true, role: ['admin'],
  render(p) {
    const s = p.id ? ix('siswa')[p.id] : null; S.formSiswa = { thumb: '', has: !!(s && s.FotoThumb) }; delete S.files.foto;
    const v = s || { JK: 'Perempuan', Status: 'Aktif', IzinFoto: 'Tidak' };
    return `<div class="page-h"><div><button class="btn btn-ghost sm" data-act="back" data-fb="siswa" style="margin-left:-12px">${ic('arrow-left')} Kembali</button><h1>${s ? 'Ubah Data Siswa' : 'Tambah Siswa Baru'}</h1></div></div>
    <form id="siswaForm" data-submit="siswa" novalidate class="split" style="grid-template-columns:minmax(0,1fr) 340px"><div><div class="card-x" style="margin-bottom:20px"><div class="card-h"><h3>${ic('person-fill')} Data Siswa</h3></div><div class="grid2">${field('NIS', 'NIS', { req: 1, value: v.NIS, attrs: 'maxlength="30"', msg: 'NIS wajib diisi.' })}${field('Nama', 'Nama lengkap', { req: 1, value: v.Nama, attrs: 'maxlength="100"', msg: 'Nama wajib diisi.' })}
      ${field('JK', 'Jenis kelamin', { type: 'select', options: ['Perempuan', 'Laki-laki'], value: v.JK })}${field('KelasID', 'Kelas', { req: 1, type: 'select', options: kelasOpts(false), value: v.KelasID, msg: 'Pilih kelas.' })}${field('TempatLahir', 'Tempat lahir', { value: v.TempatLahir, attrs: 'maxlength="60"' })}${field('TglLahir', 'Tanggal lahir', { type: 'date', value: v.TglLahir, attrs: `max="${todayStr()}"`, msg: 'Tanggal lahir tidak boleh di masa depan.' })}</div>${field('Alamat', 'Alamat', { type: 'textarea', value: v.Alamat, attrs: 'maxlength="300"' })}${field('Status', 'Status siswa', { type: 'select', options: ['Aktif', 'Nonaktif'], value: v.Status })}</div>
      <div class="card-x"><div class="card-h"><h3>${ic('people-fill')} Data Orang Tua / Wali</h3></div><div class="grid2">${field('NamaOrtu', 'Nama orang tua / wali', { value: v.NamaOrtu, attrs: 'maxlength="100"' })}${field('WA', 'Nomor WhatsApp', { type: 'tel', value: v.WA, attrs: 'pattern="^(\\+?62|0)8[0-9]{8,12}$" inputmode="tel"', ph: '081234567890', msg: 'Nomor WhatsApp tidak valid.' })}</div>${field('EmailOrtu', 'Email orang tua (untuk akses aplikasi)', { type: 'email', value: v.EmailOrtu, ph: 'orangtua@gmail.com', msg: 'Format email tidak valid.', help: 'Akun orang tua didaftarkan di menu Guru, Staf & Akses. Anak otomatis terhubung bila email sama.' })}</div></div>
      <div><div class="card-x" style="margin-bottom:20px"><div class="card-h"><h3>${ic('camera')} Foto Siswa</h3></div><div class="center"><div id="fotoPv">${avatar(v.Nama || 'Siswa', v.FotoThumb, 'lg')}</div><div class="sp"></div><label class="btn btn-soft sm" style="cursor:pointer">${ic('upload')} Pilih foto<input type="file" id="fotoIn" accept="image/jpeg,image/png,image/webp" hidden></label><p class="help" style="margin-top:8px">Foto disimpan privat; hanya terlihat oleh pengguna berwenang.</p></div></div>
      <div class="card-x"><div class="card-h"><h3>${ic('patch-check')} Persetujuan Foto Publik</h3></div>${field('IzinFoto', 'Surat persetujuan orang tua', { type: 'select', options: [['Tidak', 'Belum ada surat'], ['Ya', 'Sudah ada (disetujui)']], value: v.IzinFoto })}${field('TglIzinFoto', 'Tanggal surat diterima', { type: 'date', value: v.TglIzinFoto || '', attrs: `max="${todayStr()}"` })}<p class="help">Surat disimpan sebagai arsip fisik. Foto anak hanya tampil di publik bila persetujuan dicatat di sini.</p></div></div>
      <div class="sticky-bar" style="grid-column:1/-1"><span class="muted xs">${s ? 'Perubahan tampil seketika dan disimpan di latar belakang.' : 'Data baru tampil seketika di daftar.'}</span><div class="row-gap"><button type="button" class="btn btn-ghost" data-act="back" data-fb="siswa">Batal</button><button type="submit" class="btn btn-pri">${ic('check-lg')} Simpan</button></div></div></form>`;
  },
  after() {
    const inp = $('#fotoIn'); if (!inp) return;
    inp.addEventListener('change', async () => { const f = inp.files[0]; if (!f) return; try { const p = await prepFile(f, { maxDim: 600, imageOnly: true }); S.files.foto = p; S.formSiswa.thumb = await squareThumb(f, 72); $('#fotoPv').innerHTML = `<img class="avatar lg" src="${S.formSiswa.thumb}" alt="Foto baru">`; } catch (e) { toast(e.message, 'err'); inp.value = ''; } });
  }
};
SUBMIT.siswa = async f => {
  if (!validate(f)) return; const d = formData(f); const id = S.params.id || 'sw-' + uid(); const lama = ix('siswa')[id];
  if (D('siswa').some(x => x.NIS === d.NIS && x.ID !== id)) { const fl = $('#f-NIS').closest('.fld'); fl.classList.add('err'); $('.fld-msg', fl).textContent = 'NIS sudah dipakai siswa lain.'; $('#f-NIS').focus(); return; }
  const rec = { ID: id, NIS: d.NIS, Nama: d.Nama, JK: d.JK, KelasID: d.KelasID, TempatLahir: d.TempatLahir, TglLahir: d.TglLahir, Alamat: d.Alamat, NamaOrtu: d.NamaOrtu, EmailOrtu: (d.EmailOrtu || '').toLowerCase(), WA: d.WA, Status: d.Status, IzinFoto: d.IzinFoto, TglIzinFoto: d.IzinFoto === 'Ya' ? (d.TglIzinFoto || todayStr()) : '' };
  const apply = () => { const o = Object.assign({}, lama || {}, rec); if (S.formSiswa.thumb) o.FotoThumb = S.formSiswa.thumb; if (lama) Object.assign(lama, o); else D('siswa').push(o); if (!S.db.siswa) S.db.siswa = [o]; recountKelas(); };
  if (S.files.foto) {
    const b = $('button[type=submit]', f); busy(b, true, 'Mengunggah…');
    const r = await api('siswaSave', { rec, foto: { b64: S.files.foto.b64, mime: S.files.foto.mime, thumb: S.formSiswa.thumb } }); busy(b, false);
    if (!r.success) { toast(r.message, 'err'); return; } apply(); S.ix = {}; clearFiles('foto'); toast(r.message, 'ok'); S.ver.siswa = ''; go('siswa', {}, { noHist: true }); resync(); return;
  }
  mutate('siswaSave', { rec }, apply, { ok: r => { }, fail: r => { } });
  toast(lama ? 'Perubahan disimpan.' : 'Siswa baru ditambahkan.', 'ok'); S.hist.pop(); go('siswa', {}, { noHist: true });
};

const JABATAN = ['Guru Kelas', 'Guru Mapel', 'Kepala Sekolah', 'Bendahara', 'Tata Usaha', 'Staf'];
VIEWS.guru = {
  panel: true, role: ['admin'], deps: ['guru', 'pengguna', 'kelas', 'siswa'],
  render() {
    const u = S.ui.guru = S.ui.guru || { tab: 'guru', q: '' };
    return `<div class="page-h"><div><h1>Guru, Staf & Akses</h1><p class="sub">Kelola data guru/staf, kelas, dan siapa saja yang boleh masuk aplikasi.</p></div></div>
    <div class="tabs" role="tablist" style="margin-bottom:18px">${[['guru', 'Guru & Staf'], ['akses', 'Akun & Akses'], ['kelas', 'Kelas']].map(t => `<button class="tab ${u.tab === t[0] ? 'on' : ''}" role="tab" aria-selected="${u.tab === t[0]}" data-act="guruTab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="guruBody"></div>`;
  },
  after() { drawGuru(); }
};
ACT.guruTab = el => { S.ui.guru.tab = el.dataset.t; $$('.tabs .tab').forEach(t => { t.classList.toggle('on', t === el); t.setAttribute('aria-selected', t === el); }); drawGuru(); };
const guruNama = id => (ix('guru')[id] || {}).Nama || '';
function drawGuru() {
  const t = S.ui.guru.tab, box = $('#guruBody'); if (!box) return;
  if (t === 'guru') {
    box.innerHTML = `<div class="card-x pad0"><div style="padding:16px 18px 4px"><div class="filters"><div class="inp-ic">${ic('search')}<input class="inp" data-bind="guruQ" value="${esc(S.ui.guru.q)}" placeholder="Cari nama atau email…" aria-label="Cari guru"></div><button class="btn btn-pri" data-act="guruAdd">${ic('plus-lg')} Tambah Guru / Staf</button></div></div><div id="guruTbl"></div></div>`; drawGuruTbl();
  } else if (t === 'akses') {
    box.innerHTML = `<div class="note" style="margin-bottom:14px">${ic('shield-lock')}<div><b>Masuk memakai email + kode akses 6 digit.</b><div class="small muted">Kode dibuat saat akun didaftarkan dan hanya tampil sekali. Bila lupa, buat kode baru. Orang tua hanya dapat melihat data anak yang terhubung.</div></div></div><div class="card-x pad0"><div class="card-h" style="padding:16px 18px 0"><h3>Akun terdaftar</h3><button class="btn btn-pri sm" data-act="akunAdd">${ic('person-plus')} Daftarkan Akun</button></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Pengguna</th><th>Peran</th><th>Terhubung ke</th><th>Status</th><th class="act">Aksi</th></tr></thead><tbody>
      ${D('pengguna').map(a => `<tr><td><b>${esc(a.Nama || '-')}</b><div class="xs muted">${esc(a.Email)}</div></td><td>${bdg(ROLE_LABEL[a.Peran] || a.Peran, 'm')}</td><td class="small">${a.Peran === 'guru' ? esc(guruNama(a.RefID) || '-') : (a.Peran === 'ortu' ? esc(String(a.RefID || 'otomatis lewat email').split(',').map(i => (ix('siswa')[i.trim()] || {}).Nama || i).join(', ')) : '-')}</td><td>${bdg(a.Aktif === 'Tidak' ? 'Nonaktif' : 'Aktif')}</td><td class="act"><button class="ibtn" data-act="akunEdit" data-e="${esc(a.Email)}" aria-label="Ubah">${ic('pencil')}</button><button class="ibtn" data-act="akunKode" data-e="${esc(a.Email)}" aria-label="Buat kode baru" title="Buat kode baru">${ic('key')}</button><button class="ibtn danger" data-act="akunDel" data-e="${esc(a.Email)}" aria-label="Hapus">${ic('trash3')}</button></td></tr>`).join('')}</tbody></table></div></div>`;
  } else {
    box.innerHTML = `<div class="card-x pad0"><div class="card-h" style="padding:16px 18px 0"><h3>Daftar kelas</h3><button class="btn btn-pri sm" data-act="kelasAdd">${ic('plus-lg')} Tambah Kelas</button></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Kelas</th><th>Tingkat</th><th>Wali kelas</th><th class="num">Siswa aktif</th><th class="act">Aksi</th></tr></thead><tbody>${D('kelas').map(k => `<tr><td><b>Kelas ${esc(k.Nama)}</b></td><td>${esc(k.Tingkat || '-')}</td><td>${esc(guruNama(k.WaliID) || '-')}</td><td class="num tnum">${k.Jumlah}</td><td class="act"><button class="ibtn" data-act="kelasEdit" data-id="${esc(k.ID)}" aria-label="Ubah">${ic('pencil')}</button></td></tr>`).join('')}</tbody></table></div></div>`;
  }
}
function drawGuruTbl() {
  const q = (S.ui.guru.q || '').toLowerCase(); const l = D('guru').filter(g => !q || (g.Nama + ' ' + g.Email).toLowerCase().indexOf(q) >= 0);
  $('#guruTbl').innerHTML = l.length ? `<div class="tbl-w"><table class="tbl"><thead><tr><th>Nama</th><th>Jabatan</th><th>Kelas diampu</th><th>Kontak</th><th>Status</th><th class="act">Aksi</th></tr></thead><tbody>${l.map(g => `<tr><td><div class="row-gap" style="gap:10px;flex-wrap:nowrap">${avatar(g.Nama, '', 'sm')}<div><b>${esc(g.Nama)}</b><div class="xs muted">${esc(g.Email || '')}</div></div></div></td><td>${bdg(g.Jabatan, 'm')}</td><td>${g.KelasID ? 'Kelas ' + esc(kelasNama(g.KelasID)) : '-'}</td><td class="small tnum">${esc(g.WA || '-')}</td><td>${bdg(g.Status || 'Aktif')}</td><td class="act"><button class="ibtn" data-act="guruEdit" data-id="${esc(g.ID)}" aria-label="Ubah ${esc(g.Nama)}">${ic('pencil')}</button><button class="ibtn danger" data-act="guruDel" data-id="${esc(g.ID)}" aria-label="Hapus ${esc(g.Nama)}">${ic('trash3')}</button></td></tr>`).join('')}</tbody></table></div>` : emptyBox('person-badge', 'Belum ada data', 'Tambahkan guru dan staf sekolah.');
}
BIND.guruQ = debounce(t => { S.ui.guru.q = t.value; drawGuruTbl(); }, 180);
function guruForm(g) {
  const v = g || { Status: 'Aktif', Jabatan: 'Guru Kelas' };
  formModal({ title: g ? 'Ubah Guru / Staf' : 'Tambah Guru / Staf', body: `${field('Nama', 'Nama lengkap', { req: 1, value: v.Nama, attrs: 'maxlength="100"', msg: 'Nama wajib diisi.' })}<div class="grid2">${field('Jabatan', 'Jabatan', { type: 'select', options: JABATAN, value: v.Jabatan })}${field('KelasID', 'Kelas yang diampu', { type: 'select', options: [['', '— tidak ada —']].concat(D('kelas').map(k => [k.ID, 'Kelas ' + k.Nama])), value: v.KelasID })}${field('Email', 'Email', { type: 'email', value: v.Email, msg: 'Format email tidak valid.' })}${field('WA', 'WhatsApp', { type: 'tel', value: v.WA, attrs: 'pattern="^(\\+?62|0)8[0-9]{8,12}$"', msg: 'Nomor WhatsApp tidak valid.' })}</div>${field('Status', 'Status', { type: 'select', options: ['Aktif', 'Nonaktif'], value: v.Status })}`,
    onSubmit: d => { const rec = Object.assign({ ID: g ? g.ID : 'gr-' + uid() }, d, { Email: (d.Email || '').toLowerCase() }); mutate('guruSave', { rec }, () => { if (g) Object.assign(g, rec); else D('guru').push(rec); }); toast('Data guru/staf disimpan.', 'ok'); } });
}
ACT.guruAdd = () => guruForm(null); ACT.guruEdit = el => guruForm(ix('guru')[el.dataset.id]);
ACT.guruDel = async el => { const g = ix('guru')[el.dataset.id]; if (!await confirmBox({ title: 'Hapus data?', text: `<b>${esc(g.Nama)}</b> akan dihapus dari daftar guru & staf.`, ok: 'Hapus' })) return; mutate('guruDelete', { ids: [g.ID] }, () => { S.db.guru = D('guru').filter(x => x.ID !== g.ID); }); toast('Data dihapus.', 'ok'); };
ACT.kelasAdd = () => kelasForm(null); ACT.kelasEdit = el => kelasForm(ix('kelas')[el.dataset.id]);
function kelasForm(k) {
  const v = k || {}; formModal({ title: k ? 'Ubah Kelas' : 'Tambah Kelas', size: 'sm', body: `${field('Nama', 'Nama kelas', { req: 1, value: v.Nama, ph: 'contoh: 1A', attrs: 'maxlength="40"', msg: 'Nama kelas wajib diisi.' })}${field('Tingkat', 'Tingkat', { value: v.Tingkat, attrs: 'maxlength="4"', ph: 'contoh: 1' })}${field('WaliID', 'Wali kelas', { type: 'select', options: [['', '— belum ditetapkan —']].concat(D('guru').map(g => [g.ID, g.Nama])), value: v.WaliID })}`,
    onSubmit: d => { const rec = { ID: k ? k.ID : 'k-' + d.Nama.toLowerCase().replace(/[^a-z0-9]/g, ''), Nama: d.Nama, Tingkat: d.Tingkat, WaliID: d.WaliID }; mutate('kelasSave', { rec }, () => { if (k) Object.assign(k, rec); else D('kelas').push(Object.assign({ Jumlah: 0 }, rec)); }); toast('Kelas disimpan.', 'ok'); } });
}
function akunForm(a) {
  const v = a || { Peran: 'guru', Aktif: 'Ya' }; const refs = String(v.RefID || '').split(',').map(x => x.trim());
  const h = formModal({ title: a ? 'Ubah Akun' : 'Daftarkan Akun Baru', body: `${field('Email', 'Email', { req: 1, type: 'email', value: v.Email, attrs: a ? 'readonly' : '', msg: 'Isi email yang valid.' })}${field('Nama', 'Nama', { value: v.Nama, attrs: 'maxlength="100"' })}<div class="grid2">${field('Peran', 'Peran', { type: 'select', options: PERAN_OPT, value: v.Peran })}${field('Aktif', 'Status akun', { type: 'select', options: [['Ya', 'Aktif'], ['Tidak', 'Nonaktif']], value: v.Aktif })}</div>
    <div id="refBox"></div>`, onOpen: hh => { const drawRef = () => { const p = $('#f-Peran', hh.el).value; $('#refBox', hh.el).innerHTML = p === 'guru' ? field('RefID', 'Terhubung ke data guru', { type: 'select', options: [['', '— pilih —']].concat(D('guru').map(g => [g.ID, g.Nama])), value: v.RefID }) : (p === 'siswa' ? field('RefID', 'Terhubung ke data siswa', { type: 'select', options: [['', '— pilih siswa —']].concat(D('siswa').map(s => [s.ID, s.Nama + ' (Kelas ' + kelasNama(s.KelasID) + ')'])), value: v.RefID }) : p === 'ortu' ? `<div class="fld"><label>Anak yang terhubung</label><div class="chipbox" id="anakBox">${D('siswa').map(s => `<label class="chip ${refs.indexOf(s.ID) >= 0 ? 'on' : ''}" style="cursor:pointer"><input type="checkbox" value="${esc(s.ID)}" ${refs.indexOf(s.ID) >= 0 ? 'checked' : ''} hidden>${esc(s.Nama)}</label>`).join('')}</div><div class="help">Opsional: anak yang Email Orang Tuanya sama dengan email ini terhubung otomatis.</div></div>` : ''); }; drawRef(); $('#f-Peran', hh.el).addEventListener('change', drawRef); hh.el.addEventListener('click', e => { const c = e.target.closest('#anakBox .chip'); if (c) setTimeout(() => c.classList.toggle('on', c.querySelector('input').checked), 0); }); },
    onSubmit: async (d, f) => { const rec = { Email: d.Email.toLowerCase(), Nama: d.Nama, Peran: d.Peran, Aktif: d.Aktif, RefID: d.Peran === 'ortu' ? $$('#anakBox input:checked', f).map(i => i.value).join(',') : (d.RefID || '') };
      const r = await api('penggunaSave', { rec }); if (!r.success) { toast(r.message, 'err'); return false; } S.ver.pengguna = ''; resync(); if (r.data && r.data.kode) showKode(rec.Email, r.data.kode, 'Akun didaftarkan'); else toast(r.message, 'ok'); } });
  return h;
}
const PERAN_OPT = [['admin', 'Administrator TU'], ['guru', 'Guru Kelas'], ['kepsek', 'Kepala Sekolah'], ['bendahara', 'Bendahara'], ['ortu', 'Orang Tua / Wali'], ['siswa', 'Siswa']];
function showKode(email, kode, title) {
  openModal({ title, size: 'sm', dismissible: false, body: `<p>Berikan kode akses ini kepada <b>${esc(email)}</b>. Kode hanya tampil <b>sekali</b>.</p><div class="note" style="margin:16px 0;justify-content:center"><span class="mono" style="font-size:30px;letter-spacing:.2em;font-weight:800">${esc(kode)}</span></div><div class="row-gap" style="justify-content:center"><button class="btn btn-soft" data-act="copy" data-v="${esc(kode)}">${ic('copy')} Salin kode</button></div>`, footer: '<button class="btn btn-pri" data-close>Sudah saya catat</button>' });
}
ACT.akunAdd = () => akunForm(null); ACT.akunEdit = el => akunForm(D('pengguna').find(a => a.Email === el.dataset.e));
ACT.akunKode = async el => { if (!await confirmBox({ title: 'Buat kode baru?', text: `Kode lama <b>${esc(el.dataset.e)}</b> tidak berlaku lagi.`, ok: 'Buat kode baru', danger: false })) return; const r = await api('penggunaKode', { email: el.dataset.e }); if (!r.success) { toast(r.message, 'err'); return; } showKode(el.dataset.e, r.data.kode, 'Kode akses baru'); };
ACT.akunDel = async el => { if (!await confirmBox({ title: 'Hapus akun?', text: `<b>${esc(el.dataset.e)}</b> tidak akan dapat masuk lagi.`, ok: 'Hapus' })) return; const r = await api('penggunaDelete', { email: el.dataset.e }); if (!r.success) { toast(r.message, 'err'); return; } toast(r.message, 'ok'); S.ver.pengguna = ''; resync(); };

VIEWS.inventaris = {
  panel: true, role: ['admin'], deps: ['inventaris'],
  render() {
    const u = S.ui.inv = S.ui.inv || { q: '', kat: '', kond: '', page: 1 }; const l = D('inventaris'); const kats = Array.from(new Set(l.map(i => i.Kategori).filter(Boolean)));
    return `<div class="page-h"><div><h1>Inventaris Sekolah</h1><p class="sub">${l.length} jenis barang · ${l.reduce((a, b) => a + Number(b.Jumlah || 0), 0)} unit</p></div><button class="btn btn-pri" data-act="invAdd">${ic('plus-lg')} Tambah Barang</button></div>
    <div class="stats">${KONDISI_LIST.map(k => statCard('Kondisi ' + k, `<span class="tnum">${l.filter(i => i.Kondisi === k).reduce((a, b) => a + Number(b.Jumlah || 0), 0)}</span>`, 'unit', k === 'Baik' ? 'check-circle-fill' : 'exclamation-triangle-fill', k === 'Baik' ? 'mint' : (k === 'Rusak Ringan' ? 'yellow' : 'coral'))).join('')}${statCard('Kategori', `<span class="tnum">${kats.length}</span>`, 'jenis', 'tags-fill', 'blue')}</div>
    <div class="card-x pad0"><div style="padding:16px 18px 4px"><div class="filters"><div class="inp-ic">${ic('search')}<input class="inp" data-bind="invQ" value="${esc(u.q)}" placeholder="Cari nama atau kode barang…" aria-label="Cari barang"></div><select class="inp" data-chg="invKat" aria-label="Kategori"><option value="">Semua kategori</option>${kats.map(k => `<option ${u.kat === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}</select><select class="inp" data-chg="invKond" aria-label="Kondisi"><option value="">Semua kondisi</option>${KONDISI_LIST.map(k => `<option ${u.kond === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div></div><div id="invTbl"></div></div>`;
  },
  after() { drawInv(); }
};
const KONDISI_LIST = ['Baik', 'Rusak Ringan', 'Rusak Berat'];
function drawInv() {
  const u = S.ui.inv; const q = (u.q || '').toLowerCase(); const l = D('inventaris').filter(i => (!u.kat || i.Kategori === u.kat) && (!u.kond || i.Kondisi === u.kond) && (!q || (i.Nama + ' ' + i.Kode).toLowerCase().indexOf(q) >= 0)); const pg = paginate(l, u.page, 10);
  $('#invTbl').innerHTML = pg.total ? `<div class="tbl-w"><table class="tbl"><thead><tr><th>Kode</th><th>Nama barang</th><th>Kategori</th><th class="num">Jumlah</th><th>Kondisi</th><th>Lokasi</th><th class="act">Aksi</th></tr></thead><tbody>${pg.items.map(i => `<tr><td class="mono">${esc(i.Kode)}</td><td><b>${esc(i.Nama)}</b></td><td>${esc(i.Kategori || '-')}</td><td class="num tnum">${i.Jumlah}</td><td>${bdg(i.Kondisi)}</td><td>${esc(i.Lokasi || '-')}</td><td class="act"><button class="ibtn" data-act="invEdit" data-id="${esc(i.ID)}" aria-label="Ubah ${esc(i.Nama)}">${ic('pencil')}</button><button class="ibtn danger" data-act="invDel" data-id="${esc(i.ID)}" aria-label="Hapus ${esc(i.Nama)}">${ic('trash3')}</button></td></tr>`).join('')}</tbody></table></div>${pager('inv', pg, 'barang')}` : emptyBox('box-seam', 'Belum ada barang', 'Tambahkan inventaris sekolah.', `<button class="btn btn-pri" data-act="invAdd">${ic('plus-lg')} Tambah Barang</button>`);
}
REDRAW.inv = drawInv; BIND.invQ = debounce(t => { S.ui.inv.q = t.value; S.ui.inv.page = 1; drawInv(); }, 180);
BIND.invKat = t => { S.ui.inv.kat = t.value; S.ui.inv.page = 1; drawInv(); }; BIND.invKond = t => { S.ui.inv.kond = t.value; S.ui.inv.page = 1; drawInv(); };
function invForm(i) {
  const v = i || { Kondisi: 'Baik', Jumlah: 1 };
  formModal({ title: i ? 'Ubah Barang' : 'Tambah Barang', body: `${field('Nama', 'Nama barang', { req: 1, value: v.Nama, attrs: 'maxlength="100"', msg: 'Nama barang wajib diisi.' })}<div class="grid2">${field('Kode', 'Kode (otomatis bila kosong)', { value: v.Kode })}${field('Kategori', 'Kategori', { value: v.Kategori, attrs: 'maxlength="40" list="katList"' })}${field('Jumlah', 'Jumlah', { req: 1, type: 'number', value: v.Jumlah, attrs: 'min="0" max="100000" step="1"', msg: 'Isi jumlah (angka ≥ 0).' })}${field('Kondisi', 'Kondisi', { type: 'select', options: KONDISI_LIST, value: v.Kondisi })}</div>${field('Lokasi', 'Lokasi', { value: v.Lokasi, attrs: 'maxlength="60"' })}<datalist id="katList">${Array.from(new Set(D('inventaris').map(x => x.Kategori))).map(k => `<option value="${esc(k)}">`).join('')}</datalist>`,
    onSubmit: d => { const id = i ? i.ID : 'iv-' + uid(); const rec = { ID: id, Kode: d.Kode || 'INV-' + id.slice(-5).toUpperCase(), Nama: d.Nama, Kategori: d.Kategori, Jumlah: Number(d.Jumlah), Kondisi: d.Kondisi, Lokasi: d.Lokasi }; mutate('invSave', { rec }, () => { if (i) Object.assign(i, rec); else D('inventaris').push(rec); }); toast('Barang disimpan.', 'ok'); } });
}
ACT.invAdd = () => invForm(null); ACT.invEdit = el => invForm(ix('inventaris')[el.dataset.id]);
ACT.invDel = async el => { const i = ix('inventaris')[el.dataset.id]; if (!await confirmBox({ title: 'Hapus barang?', text: `<b>${esc(i.Nama)}</b> akan dihapus dari inventaris.`, ok: 'Hapus' })) return; mutate('invDelete', { ids: [i.ID] }, () => { S.db.inventaris = D('inventaris').filter(x => x.ID !== i.ID); }); toast('Barang dihapus.', 'ok'); };

function upsertLocal(name, rec, key) {
  key = key || 'ID'; const l = D(name); const i = l.findIndex(x => x[key] === rec[key]);
  if (i >= 0) l[i] = Object.assign({}, l[i], rec); else l.push(rec);
  if (!S.db[name]) S.db[name] = l; S.ix = {}; persistSoon();
}
VIEWS.konten = {
  panel: true, role: ['admin'], deps: ['berita', 'galeri', 'siswa'],
  render(p) {
    const u = S.ui.konten = S.ui.konten || { tab: 'berita' }; if (p && p.tab) u.tab = p.tab;
    return `<div class="page-h"><div><h1>Konten Publik</h1><p class="sub">Kelola berita dan galeri kegiatan yang tampil di situs sekolah.</p></div></div>
    <div class="tabs" role="tablist" style="margin-bottom:18px">${[['berita', 'Berita'], ['galeri', 'Galeri Kegiatan']].map(t => `<button class="tab ${u.tab === t[0] ? 'on' : ''}" role="tab" aria-selected="${u.tab === t[0]}" data-act="kontenTab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="kontenBody"></div>`;
  },
  after(p) { drawKonten(); if (p && p.new) { p.new = 0; setTimeout(() => beritaForm(null), 60); } }
};
ACT.kontenTab = el => { S.ui.konten.tab = el.dataset.t; $$('.tabs .tab').forEach(t => { t.classList.toggle('on', t === el); t.setAttribute('aria-selected', t === el); }); drawKonten(); };
function drawKonten() {
  const box = $('#kontenBody'); if (!box) return;
  if (S.ui.konten.tab === 'berita') {
    const l = D('berita').slice().sort((a, b) => String(b.Tanggal).localeCompare(a.Tanggal));
    box.innerHTML = `<div class="card-x pad0"><div class="card-h" style="padding:16px 18px 0"><div><h3>Daftar berita</h3><div class="sub">${l.filter(b => b.Status === 'Terbit').length} terbit · ${l.filter(b => b.Status !== 'Terbit').length} draf</div></div><button class="btn btn-pri" data-act="beritaAdd">${ic('plus-lg')} Tambah Berita</button></div>
      ${l.length ? `<div class="tbl-w"><table class="tbl"><thead><tr><th>Judul</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th class="act">Aksi</th></tr></thead><tbody>${l.map(b => `<tr><td style="max-width:380px"><b>${esc(b.Judul)}</b><div class="xs muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(b.Ringkasan)}</div></td><td>${bdg(b.Kategori, KAT[b.Kategori])}</td><td class="small tnum">${fmtD(b.Tanggal)}</td><td>${bdg(b.Status)}</td><td class="act"><button class="ibtn" data-act="beritaToggle" data-id="${esc(b.ID)}" aria-label="${b.Status === 'Terbit' ? 'Tarik dari publik' : 'Terbitkan'}" title="${b.Status === 'Terbit' ? 'Tarik ke draf' : 'Terbitkan'}">${ic(b.Status === 'Terbit' ? 'eye-slash' : 'send')}</button><button class="ibtn" data-act="beritaEdit" data-id="${esc(b.ID)}" aria-label="Ubah">${ic('pencil')}</button><button class="ibtn danger" data-act="beritaDel" data-id="${esc(b.ID)}" aria-label="Hapus">${ic('trash3')}</button></td></tr>`).join('')}</tbody></table></div>` : emptyBox('newspaper', 'Belum ada berita', 'Tulis berita pertama untuk ditampilkan di situs.', `<button class="btn btn-pri" data-act="beritaAdd">${ic('plus-lg')} Tambah Berita</button>`)}</div>`;
  } else {
    const l = D('galeri').slice().sort((a, b) => String(b.Tanggal).localeCompare(a.Tanggal));
    box.innerHTML = `<div class="card-h"><div><h3>Foto kegiatan</h3><div class="sub">${l.filter(g => g.Publik === 'Ya').length} tampil di publik · ${l.filter(g => g.Publik !== 'Ya').length} privat</div></div><button class="btn btn-pri" data-act="galAdd">${ic('cloud-arrow-up')} Unggah Foto</button></div>
      <div class="note" style="margin-bottom:16px">${ic('shield-check')}<span class="small">Foto hanya bisa ditampilkan di publik bila <b>semua anak</b> yang tampil sudah tercatat persetujuan orang tuanya (atau foto tidak menampilkan wajah anak).</span></div>
      ${l.length ? `<div class="gal-g">${l.map(g => { const ids = String(g.SiswaIDs || '').split(',').filter(x => x && x !== 'TANPA_ANAK'); const bad = ids.filter(i => (ix('siswa')[i] || {}).IzinFoto !== 'Ya'); return `<div class="card-x pad0 hover"><div style="aspect-ratio:4/3;position:relative;overflow:hidden;background:var(--soft)">${g.Publik === 'Ya' && g.FileId ? imgOrPh(g.FileId, 500, 'image', g.Judul) : `<div class="ph" style="width:100%;height:100%;flex-direction:column;gap:6px">${ic(g.FileId ? 'lock' : 'image')}${g.FileId ? `<button class="btn btn-white sm" data-act="preview" data-id="${esc(g.FileId)}" data-t="${esc(g.Judul)}">Pratinjau</button>` : ''}</div>`}<span style="position:absolute;top:10px;left:10px">${bdg(g.Publik === 'Ya' ? 'Tampil di publik' : 'Privat', g.Publik === 'Ya' ? 'g' : 's')}</span></div><div style="padding:12px 14px"><b>${esc(g.Judul)}</b><div class="xs muted">${fmtD(g.Tanggal)} · ${esc(g.Kategori || '')} · oleh ${esc(g.Pengunggah || '-')}</div><div class="xs" style="margin-top:6px">${g.SiswaIDs === 'TANPA_ANAK' ? 'Tanpa wajah anak' : (ids.length ? ids.length + ' anak tampil' + (bad.length ? ` · <span style="color:var(--r-tx)">${bad.length} belum ada persetujuan</span>` : ' · semua disetujui') : '<span class="muted">Anak belum ditandai</span>')}</div><div class="row-gap" style="margin-top:10px;gap:4px"><button class="btn btn-soft sm" data-act="galPublik" data-id="${esc(g.ID)}">${g.Publik === 'Ya' ? 'Tarik dari publik' : 'Tampilkan'}</button><button class="ibtn" data-act="galEdit" data-id="${esc(g.ID)}" aria-label="Ubah">${ic('pencil')}</button><button class="ibtn danger" data-act="galDel" data-id="${esc(g.ID)}" aria-label="Hapus">${ic('trash3')}</button></div></div></div>`; }).join('')}</div>` : emptyBox('images', 'Belum ada foto', 'Unggah foto kegiatan sekolah.', `<button class="btn btn-pri" data-act="galAdd">${ic('cloud-arrow-up')} Unggah Foto</button>`)}`;
  }
}
function beritaForm(b) {
  const v = b || { Kategori: 'Kegiatan', Status: 'Draf', Tanggal: todayStr() }; delete S.files.bfoto;
  formModal({ title: b ? 'Ubah Berita' : 'Tambah Berita', size: 'lg', body: `${field('Judul', 'Judul', { req: 1, value: v.Judul, attrs: 'maxlength="150"', msg: 'Judul wajib diisi.' })}<div class="grid3">${field('Kategori', 'Kategori', { type: 'select', options: ['Prestasi', 'Kegiatan', 'Pengumuman'], value: v.Kategori })}${field('Tanggal', 'Tanggal', { type: 'date', value: v.Tanggal, req: 1 })}${field('Status', 'Status', { type: 'select', options: [['Draf', 'Draf (belum tampil)'], ['Terbit', 'Terbitkan']], value: v.Status })}</div>${field('Ringkasan', 'Ringkasan (tampil di kartu berita)', { req: 1, type: 'textarea', rows: 2, value: v.Ringkasan, attrs: 'maxlength="300"', msg: 'Ringkasan wajib diisi.' })}${field('Isi', 'Isi berita', { type: 'textarea', rows: 7, value: v.Isi, attrs: 'maxlength="8000"', help: 'Pisahkan paragraf dengan satu baris kosong.' })}${dz('bfoto', b && b.FotoFileId ? 'Ganti foto (biarkan kosong untuk mempertahankan)' : 'Foto berita', { opt: 1, imageOnly: 1 })}
    <label class="chk"><input type="checkbox" name="konfirmasiFoto"><span class="small">Saya memastikan foto pada berita ini <b>tidak menampilkan anak tanpa persetujuan orang tua</b> (wajib dicentang saat menerbitkan berita berfoto).</span></label>`,
    onSubmit: async d => {
      const rec = { ID: b ? b.ID : 'bt-' + uid(), Judul: d.Judul, Kategori: d.Kategori, Tanggal: d.Tanggal, Status: d.Status, Ringkasan: d.Ringkasan, Isi: d.Isi };
      const r = await api('beritaSave', { rec, file: fileOf('bfoto'), konfirmasiFoto: !!d.konfirmasiFoto }); if (!r.success) { toast(r.message, 'err'); return false; }
      clearFiles('bfoto'); upsertLocal('berita', r.data); refreshView(true); toast(r.message, 'ok'); S.ver.berita = ''; resync(); } });
}
ACT.beritaAdd = () => beritaForm(null); ACT.beritaEdit = el => beritaForm(ix('berita')[el.dataset.id]);
ACT.beritaToggle = async el => {
  const b = ix('berita')[el.dataset.id]; const ke = b.Status === 'Terbit' ? 'Draf' : 'Terbit'; let konf = false;
  if (ke === 'Terbit' && b.FotoFileId) { if (!await confirmBox({ title: 'Terbitkan berita?', text: 'Pastikan foto pada berita ini tidak menampilkan anak tanpa persetujuan orang tua.', ok: 'Ya, terbitkan', danger: false })) return; konf = true; }
  const r = await api('beritaSave', { rec: Object.assign({}, b, { Status: ke }), konfirmasiFoto: konf }); if (!r.success) { toast(r.message, 'err'); return; }
  upsertLocal('berita', r.data); refreshView(true); toast(r.message, 'ok'); S.ver.berita = ''; resync();
};
ACT.beritaDel = async el => { const b = ix('berita')[el.dataset.id]; if (!await confirmBox({ title: 'Hapus berita?', text: `<b>${esc(b.Judul)}</b> akan dihapus permanen.`, ok: 'Hapus' })) return; mutate('beritaDelete', { ids: [b.ID] }, () => { S.db.berita = D('berita').filter(x => x.ID !== b.ID); }); toast('Berita dihapus.', 'ok'); };
function galeriForm(g) {
  const v = g || { Tanggal: todayStr(), Kategori: 'Kegiatan', Publik: 'Tidak' }; delete S.files.gfoto2;
  const ids = String(v.SiswaIDs || '').split(',').filter(Boolean); const tanpa = ids.indexOf('TANPA_ANAK') >= 0;
  formModal({ title: g ? 'Ubah Foto Kegiatan' : 'Unggah Foto Kegiatan', size: 'lg', body: `<div class="grid2">${field('Judul', 'Judul kegiatan', { req: 1, value: v.Judul, attrs: 'maxlength="120"', msg: 'Judul wajib diisi.' })}${field('Kategori', 'Kategori', { value: v.Kategori, attrs: 'maxlength="40"' })}${field('Tanggal', 'Tanggal', { type: 'date', value: v.Tanggal, req: 1 })}${field('Publik', 'Tampilkan di situs publik?', { type: 'select', options: [['Tidak', 'Tidak (privat)'], ['Ya', 'Ya, tampilkan']], value: v.Publik })}</div>${dz('gfoto2', g ? 'Ganti foto (opsional)' : 'Foto', { req: !g, opt: !!g, imageOnly: 1 }).replace('data-dz="gfoto2"', g ? 'data-dz="gfoto2"' : 'data-dz="gfoto2" data-req="1"')}
    <div class="fld"><label>Anak yang tampil di foto</label><label class="chk" style="margin-bottom:8px"><input type="checkbox" name="tanpaAnak" id="tanpaAnak" ${tanpa ? 'checked' : ''}><span class="small">Foto tidak menampilkan wajah anak</span></label><div class="chipbox" id="anakFoto" style="${tanpa ? 'opacity:.4;pointer-events:none' : ''}">${activeSiswa().map(s => `<label class="chip ${ids.indexOf(s.ID) >= 0 ? 'on' : ''}" style="cursor:pointer" title="${s.IzinFoto === 'Ya' ? 'Persetujuan tercatat' : 'Belum ada persetujuan'}"><input type="checkbox" value="${esc(s.ID)}" ${ids.indexOf(s.ID) >= 0 ? 'checked' : ''} hidden>${s.IzinFoto === 'Ya' ? ic('check-circle-fill') : ic('exclamation-triangle')} ${esc(s.Nama)}</label>`).join('')}</div><div class="help">Ikon ${'⚠'} berarti persetujuan orang tua belum tercatat; foto tidak dapat ditampilkan di publik.</div></div>`,
    onOpen: h => { h.el.addEventListener('click', e => { const c = e.target.closest('#anakFoto .chip'); if (c) setTimeout(() => c.classList.toggle('on', c.querySelector('input').checked), 0); }); $('#tanpaAnak', h.el).addEventListener('change', e => { const b = $('#anakFoto', h.el); b.style.opacity = e.target.checked ? .4 : 1; b.style.pointerEvents = e.target.checked ? 'none' : ''; }); },
    onSubmit: async (d, f) => {
      const sel = $$('#anakFoto input:checked', f).map(i => i.value); const siswaIDs = d.tanpaAnak ? 'TANPA_ANAK' : sel.join(',');
      if (d.Publik === 'Ya' && !d.tanpaAnak) { if (!sel.length) { toast('Pilih anak yang tampil di foto, atau centang "Foto tidak menampilkan wajah anak".', 'warn'); return false; } const bad = sel.filter(i => (ix('siswa')[i] || {}).IzinFoto !== 'Ya'); if (bad.length) { toast('Persetujuan orang tua belum tercatat untuk: ' + bad.map(siswaNama).join(', ') + '.', 'err'); return false; } }
      const r = await api('galeriSave', { rec: { ID: g ? g.ID : undefined, Judul: d.Judul, Kategori: d.Kategori, Tanggal: d.Tanggal, Publik: d.Publik, SiswaIDs: siswaIDs }, file: fileOf('gfoto2') }); if (!r.success) { toast(r.message, 'err'); return false; }
      clearFiles('gfoto2'); upsertLocal('galeri', r.data); refreshView(true); toast(r.message, 'ok'); S.ver.galeri = ''; resync(); } });
}
ACT.galAdd = () => galeriForm(null); ACT.galEdit = el => galeriForm(ix('galeri')[el.dataset.id]);
ACT.galPublik = async el => { const g = ix('galeri')[el.dataset.id]; const ya = g.Publik !== 'Ya'; busy(el, true, '…'); const r = await api('galeriPublik', { id: g.ID, publik: ya, siswaIds: g.SiswaIDs }); busy(el, false); if (!r.success) { toast(r.message, 'err'); return; } upsertLocal('galeri', r.data); refreshView(true); toast(r.message, 'ok'); S.ver.galeri = ''; resync(); };
ACT.galDel = async el => { const g = ix('galeri')[el.dataset.id]; if (!await confirmBox({ title: 'Hapus foto?', text: `<b>${esc(g.Judul)}</b> akan dihapus permanen.`, ok: 'Hapus' })) return; mutate('galeriDelete', { ids: [g.ID] }, () => { S.db.galeri = D('galeri').filter(x => x.ID !== g.ID); }); toast('Foto dihapus.', 'ok'); };

const PPDB_ST = ['Baru', 'Diverifikasi', 'Berkas Kurang', 'Diterima', 'Tidak Diterima'];
function usia(tgl) { if (!tgl) return ''; const a = new Date(tgl + 'T00:00:00Z'), b = new Date(todayStr() + 'T00:00:00Z'); let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth(); if (b.getUTCDate() < a.getUTCDate()) m--; return `${Math.floor(m / 12)} th ${m % 12} bln`; }
const gelNama = id => (D('gelombang').find(g => g.ID === id) || {}).Nama || '-';
VIEWS.ppdb = {
  panel: true, role: ['admin'], deps: ['pendaftar', 'gelombang', 'ppdbInfo'],
  render() {
    const u = S.ui.ppdb = S.ui.ppdb || { gel: '', st: '', q: '', page: 1, sel: '' }; const all = D('pendaftar'); const gl = D('gelombang'); const cnt = s => all.filter(p => p.Status === s).length;
    return `<div class="page-h"><div><span class="kicker">Penerimaan Siswa Baru</span><h1 style="margin-top:8px">Pendaftar PPDB ${esc(prof().tahunAjaran || '')}</h1></div><div class="row-gap"><button class="btn btn-soft" data-act="ppdbCsv">${ic('download')} Unduh Data (CSV)</button><button class="btn btn-pri" data-act="ppdbSetup">${ic('calendar2-week')} Atur Jadwal & Info</button></div></div>
    <div class="stats">${statCard('Total formulir', `<span class="tnum">${all.length}</span>`, 'Semua gelombang', 'folder2-open', 'mint')}${statCard('Perlu tindakan', `<span class="tnum">${cnt('Baru')}</span>`, 'Baru masuk', 'envelope-exclamation-fill', 'yellow')}${statCard('Diverifikasi', `<span class="tnum">${cnt('Diverifikasi') + cnt('Diterima')}</span>`, 'Lolos verifikasi/diterima', 'shield-check', 'mint')}${statCard('Berkas kurang', `<span class="tnum">${cnt('Berkas Kurang')}</span>`, 'Perlu dilengkapi', 'file-earmark-x-fill', 'coral')}</div>
    <div class="split"><div class="card-x pad0"><div style="padding:16px 18px 4px"><div class="filters"><div class="inp-ic">${ic('search')}<input class="inp" data-bind="ppdbQ" value="${esc(u.q)}" placeholder="Cari no. registrasi atau nama…" aria-label="Cari pendaftar"></div><select class="inp" data-chg="ppdbGel" aria-label="Gelombang"><option value="">Semua gelombang</option>${gl.map(g => `<option value="${esc(g.ID)}" ${u.gel === g.ID ? 'selected' : ''}>${esc(g.Nama)}</option>`).join('')}</select></div>
      <div class="filters">${[''].concat(PPDB_ST).map(s => `<button class="chip ${u.st === s ? 'on' : ''}" data-act="ppdbSt" data-s="${esc(s)}">${s || 'Semua status'} <span class="n">${s ? cnt(s) : all.length}</span></button>`).join('')}</div></div><div id="ppdbTbl"></div></div><aside class="card-x hide-m" id="ppdbDetail" style="position:sticky;top:84px" aria-live="polite"></aside></div>`;
  },
  after() { drawPpdb(); }
};
function ppdbList() { const u = S.ui.ppdb; return D('pendaftar').filter(p => (!u.gel || p.GelombangID === u.gel) && (!u.st || p.Status === u.st) && statusSearch(u.q, p.NoReg, p.NamaSiswa, p.NamaOrtu)).sort((a, b) => String(b.Tgl).localeCompare(a.Tgl)); }
function drawPpdb() {
  const u = S.ui.ppdb; const pg = paginate(ppdbList(), u.page, 8); if (!u.sel && pg.items[0] && window.innerWidth >= 1100) u.sel = pg.items[0].ID;
  $('#ppdbTbl').innerHTML = pg.total ? `<div class="tbl-w"><table class="tbl"><thead><tr><th>No. Reg</th><th>Calon siswa</th><th class="hide-m">Gelombang</th><th>Status</th></tr></thead><tbody>${pg.items.map(p => `<tr class="${u.sel === p.ID ? 'sel' : ''}" style="cursor:pointer" data-act="ppdbSel" data-id="${esc(p.ID)}" tabindex="0"><td class="mono xs">${esc(p.NoReg)}</td><td><b>${esc(p.NamaSiswa)}</b><div class="xs muted">${usia(p.TglLahir)} · ${fmtD(String(p.Tgl).slice(0, 10))}</div></td><td class="hide-m small">${esc(gelNama(p.GelombangID))}</td><td>${bdg(p.Status, null, true)}</td></tr>`).join('')}</tbody></table></div>${pager('ppdb', pg, 'pendaftar')}` : emptyBox('inbox', 'Belum ada pendaftar', 'Pendaftar yang mengisi formulir akan tampil di sini.');
  const d = $('#ppdbDetail'); if (d) d.innerHTML = u.sel && ix('pendaftar')[u.sel] ? ppdbDetailHtml(ix('pendaftar')[u.sel]) : emptyBox('hand-index', 'Pilih pendaftar', 'Klik baris untuk melihat detail dan memverifikasi berkas.');
}
REDRAW.ppdb = drawPpdb;
function ppdbDetailHtml(p) {
  const files = [['KK', 'Kartu Keluarga', p.FileKK, 1], ['Bukti', 'Bukti Bayar', p.FileBukti, 1], ['Akta', 'Akta Kelahiran', p.FileAkta, 0], ['Ijazah', 'Ijazah / SKL', p.FileIjazah, 0]];
  return `<div class="card-h"><div><div class="mono xs muted">${esc(p.NoReg)}</div><h3>${esc(p.NamaSiswa)}</h3></div>${bdg(p.Status, null, true)}</div>
    <dl class="kv" style="grid-template-columns:110px 1fr"><dt>TTL</dt><dd>${esc(p.TempatLahir)}, ${fmtD(p.TglLahir)} <span class="muted">(${usia(p.TglLahir)})</span></dd><dt>Jenis kelamin</dt><dd>${esc(p.JK || '-')}</dd><dt>Asal sekolah</dt><dd>${esc(p.AsalSekolah || '-')}</dd><dt>Alamat</dt><dd>${esc(p.Alamat)}</dd><dt>Orang tua</dt><dd>${esc(p.NamaOrtu)}${p.Pekerjaan ? ' · ' + esc(p.Pekerjaan) : ''}</dd><dt>WhatsApp</dt><dd><a href="${esc(waLink(p.WA, 'Assalamualaikum, kami dari panitia PPDB mengenai pendaftaran ' + p.NamaSiswa + ' (' + p.NoReg + ')'))}" target="_blank" rel="noopener">${esc(p.WA)}</a></dd>${p.Email ? `<dt>Email</dt><dd>${esc(p.Email)}</dd>` : ''}<dt>Gelombang</dt><dd>${esc(gelNama(p.GelombangID))}</dd></dl>
    <h4 style="margin:16px 0 8px;font-size:14px">Berkas diunggah</h4>${files.map(f => `<div class="row-gap" style="padding:7px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><span class="grow small">${ic(f[2] ? 'file-earmark-check' : 'file-earmark-x')} ${f[1]} ${f[3] ? '' : '<span class="muted xs">(opsional)</span>'}</span>${f[2] ? `<button class="btn btn-ghost sm" data-act="preview" data-id="${esc(f[2])}" data-t="${esc(f[1] + ' — ' + p.NamaSiswa)}">Buka</button>` : (f[3] ? bdg('Belum ada', 'r') : '<span class="xs muted">—</span>')}</div>`).join('')}
    <div class="fld" style="margin-top:14px"><label for="pCat">Catatan internal panitia</label><textarea class="inp" id="pCat" rows="2" maxlength="500" placeholder="mis. KK asli dibawa saat daftar ulang">${esc(p.Catatan || '')}</textarea></div>
    <div class="row-gap"><button class="btn btn-pri grow" data-act="ppdbSet" data-id="${esc(p.ID)}" data-s="Diverifikasi">${ic('check2-circle')} Diverifikasi</button><button class="btn btn-soft grow" data-act="ppdbSet" data-id="${esc(p.ID)}" data-s="Berkas Kurang">${ic('exclamation-triangle')} Berkas Kurang</button></div>
    <div class="row-gap" style="margin-top:8px"><button class="btn btn-ghost sm" data-act="ppdbSet" data-id="${esc(p.ID)}" data-s="Diterima">Diterima</button><button class="btn btn-ghost sm" data-act="ppdbSet" data-id="${esc(p.ID)}" data-s="Tidak Diterima">Tidak diterima</button><button class="btn btn-ghost sm" data-act="ppdbSet" data-id="${esc(p.ID)}" data-s="Baru">Reset ke Baru</button><span class="grow"></span><button class="ibtn danger" data-act="ppdbDel" data-id="${esc(p.ID)}" aria-label="Hapus pendaftar">${ic('trash3')}</button></div>`;
}
ACT.ppdbSel = el => { S.ui.ppdb.sel = el.dataset.id; if (window.innerWidth < 1100) { const p = ix('pendaftar')[el.dataset.id]; openModal({ title: 'Detail Pendaftar', drawer: true, body: ppdbDetailHtml(p) }); } else drawPpdb(); };
ACT.ppdbSt = el => { S.ui.ppdb.st = el.dataset.s; S.ui.ppdb.page = 1; $$('.filters .chip').forEach(c => c.classList.toggle('on', c === el)); drawPpdb(); };
BIND.ppdbQ = debounce(t => { S.ui.ppdb.q = t.value; S.ui.ppdb.page = 1; drawPpdb(); }, 180); BIND.ppdbGel = t => { S.ui.ppdb.gel = t.value; S.ui.ppdb.page = 1; drawPpdb(); };
ACT.ppdbSet = el => {
  const p = ix('pendaftar')[el.dataset.id]; const st = el.dataset.s; const cat = ($('#pCat', el.closest('aside,.mo-b')) || {}).value;
  mutate('ppdbSetStatus', { id: p.ID, status: st, catatan: cat !== undefined ? cat : p.Catatan }, () => { p.Status = st; if (cat !== undefined) p.Catatan = cat; }); toast(`Status diubah: ${st}.`, 'ok');
  const m = el.closest('.mo'); if (m) { const h = _modals.find(x => x.el === m); if (h) h.close(); }
};
ACT.ppdbDel = async el => { const p = ix('pendaftar')[el.dataset.id]; if (!await confirmBox({ title: 'Hapus pendaftar?', text: `<b>${esc(p.NamaSiswa)}</b> (${esc(p.NoReg)}) dihapus dari daftar. Berkas di Drive tetap tersimpan.`, ok: 'Hapus' })) return; mutate('ppdbDelete', { ids: [p.ID] }, () => { S.db.pendaftar = D('pendaftar').filter(x => x.ID !== p.ID); S.ui.ppdb.sel = ''; }); toast('Pendaftar dihapus dari daftar.', 'ok'); const m = el.closest('.mo'); if (m) { const h = _modals.find(x => x.el === m); if (h) h.close(); } };
ACT.ppdbCsv = () => downloadCSV('pendaftar-ppdb-' + todayStr() + '.csv', [['No Reg', 'Tgl Daftar', 'Gelombang', 'Nama', 'JK', 'Tempat Lahir', 'Tgl Lahir', 'Alamat', 'Asal Sekolah', 'Orang Tua', 'Pekerjaan', 'WA', 'Email', 'Status', 'Catatan']].concat(ppdbList().map(p => [p.NoReg, p.Tgl, gelNama(p.GelombangID), p.NamaSiswa, p.JK, p.TempatLahir, p.TglLahir, p.Alamat, p.AsalSekolah, p.NamaOrtu, p.Pekerjaan, p.WA, p.Email, p.Status, p.Catatan])));
let _setupH = null;
ACT.ppdbSetup = () => { _setupH = openModal({ title: 'Atur Jadwal & Informasi PPDB', size: 'lg', body: '', onClose: () => { _setupH = null; } }); drawSetup(); };
function drawSetup() {
  if (!_setupH) return; const info = D('ppdbInfo').slice().sort((a, b) => (a.Tipe + (100 + a.Urut)).localeCompare(b.Tipe + (100 + b.Urut)));
  $('.mo-b', _setupH.el).innerHTML = `<div class="card-h"><h3>Gelombang pendaftaran</h3><button class="btn btn-pri sm" data-act="gelAdd">${ic('plus-lg')} Tambah</button></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Gelombang</th><th>Buka</th><th>Tutup</th><th class="num">Kuota</th><th>Status</th><th class="act">Aksi</th></tr></thead><tbody>${D('gelombang').map(g => `<tr><td><b>${esc(g.Nama)}</b><div class="xs muted">${esc(g.Label || '')}</div></td><td class="small">${fmtD(g.Buka)}</td><td class="small">${fmtD(g.Tutup)}</td><td class="num">${g.Kuota || '-'}</td><td>${bdg(gelStatus(g), null, true)}</td><td class="act"><button class="ibtn" data-act="gelEdit" data-id="${esc(g.ID)}" aria-label="Ubah">${ic('pencil')}</button><button class="ibtn danger" data-act="gelDel" data-id="${esc(g.ID)}" aria-label="Hapus">${ic('trash3')}</button></td></tr>`).join('') || '<tr><td colspan="6" class="muted center">Belum ada gelombang.</td></tr>'}</tbody></table></div>
    <div class="card-h" style="margin-top:24px"><div><h3>Informasi di halaman PPDB</h3><div class="sub">Poin keunggulan, jadwal penting, tahapan, dan FAQ</div></div><button class="btn btn-pri sm" data-act="infoAdd">${ic('plus-lg')} Tambah</button></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Jenis</th><th>Judul</th><th class="num">Urut</th><th class="act">Aksi</th></tr></thead><tbody>${info.map(i => `<tr><td>${bdg(i.Tipe, 'm')}</td><td>${esc(i.Judul)}</td><td class="num">${i.Urut}</td><td class="act"><button class="ibtn" data-act="infoEdit" data-id="${esc(i.ID)}" aria-label="Ubah">${ic('pencil')}</button><button class="ibtn danger" data-act="infoDel" data-id="${esc(i.ID)}" aria-label="Hapus">${ic('trash3')}</button></td></tr>`).join('') || '<tr><td colspan="4" class="muted center">Belum ada informasi.</td></tr>'}</tbody></table></div>`;
}
function gelForm(g) {
  const v = g || { Kuota: 24 };
  formModal({ title: g ? 'Ubah Gelombang' : 'Tambah Gelombang', size: 'sm', body: `${field('Nama', 'Nama gelombang', { req: 1, value: v.Nama, ph: 'Gelombang 1', msg: 'Nama wajib diisi.' })}${field('Label', 'Label', { value: v.Label, ph: 'Periode Pertama' })}<div class="grid2">${field('Buka', 'Tanggal buka', { type: 'date', req: 1, value: v.Buka, msg: 'Tanggal buka wajib diisi.' })}${field('Tutup', 'Tanggal tutup', { type: 'date', req: 1, value: v.Tutup, msg: 'Tanggal tutup wajib diisi.' })}</div>${field('Kuota', 'Kuota kursi', { type: 'number', value: v.Kuota, attrs: 'min="0"' })}${field('Catatan', 'Catatan', { value: v.Catatan })}`,
    onSubmit: d => { if (d.Tutup < d.Buka) { toast('Tanggal tutup tidak boleh sebelum tanggal buka.', 'err'); return false; } const rec = { ID: g ? g.ID : 'gv-' + uid(), Nama: d.Nama, Label: d.Label, Buka: d.Buka, Tutup: d.Tutup, Kuota: Number(d.Kuota) || 0, Catatan: d.Catatan }; mutate('gelSave', { rec }, () => upsertLocal('gelombang', rec)); drawSetup(); toast('Gelombang disimpan.', 'ok'); } });
}
ACT.gelAdd = () => gelForm(null); ACT.gelEdit = el => gelForm(ix('gelombang')[el.dataset.id]);
ACT.gelDel = async el => { const g = ix('gelombang')[el.dataset.id]; if (!await confirmBox({ title: 'Hapus gelombang?', text: `<b>${esc(g.Nama)}</b> akan dihapus.`, ok: 'Hapus' })) return; mutate('gelDelete', { ids: [g.ID] }, () => { S.db.gelombang = D('gelombang').filter(x => x.ID !== g.ID); }); drawSetup(); };
function infoForm(i) {
  const v = i || { Tipe: 'poin', Urut: D('ppdbInfo').length + 1, Warna: 'mint' };
  formModal({ title: i ? 'Ubah Informasi' : 'Tambah Informasi', size: 'sm', body: `${field('Tipe', 'Jenis', { type: 'select', options: [['poin', 'Poin keunggulan PPDB'], ['jadwal', 'Jadwal penting'], ['langkah', 'Tahapan pendaftaran'], ['faq', 'Tanya jawab (FAQ)']], value: v.Tipe })}${field('Judul', 'Judul / pertanyaan', { req: 1, value: v.Judul, attrs: 'maxlength="120"' })}${field('Isi', 'Isi / jawaban', { type: 'textarea', rows: 3, value: v.Isi, attrs: 'maxlength="600"' })}<div class="grid2">${field('Tanggal', 'Keterangan waktu (untuk jadwal)', { value: v.Tanggal })}${field('Urut', 'Urutan', { type: 'number', value: v.Urut, attrs: 'min="0"' })}</div>${field('Warna', 'Warna titik (jadwal)', { type: 'select', options: ['mint', 'coral', 'yellow', 'blue'], value: v.Warna || 'mint' })}`,
    onSubmit: d => { const rec = { ID: i ? i.ID : 'in-' + uid(), Tipe: d.Tipe, Judul: d.Judul, Isi: d.Isi, Tanggal: d.Tanggal, Urut: Number(d.Urut) || 0, Warna: d.Warna }; mutate('infoSave', { rec }, () => upsertLocal('ppdbInfo', rec)); drawSetup(); toast('Informasi disimpan.', 'ok'); } });
}
ACT.infoAdd = () => infoForm(null); ACT.infoEdit = el => infoForm(ix('ppdbInfo')[el.dataset.id]);
ACT.infoDel = async el => { const i = ix('ppdbInfo')[el.dataset.id]; if (!await confirmBox({ title: 'Hapus informasi?', text: `<b>${esc(i.Judul)}</b> akan dihapus.`, ok: 'Hapus' })) return; mutate('infoDelete', { ids: [i.ID] }, () => { S.db.ppdbInfo = D('ppdbInfo').filter(x => x.ID !== i.ID); }); drawSetup(); };

const ST_LIST = [['Hadir', 'h'], ['Izin', 'i'], ['Sakit', 's'], ['Alpa', 'a']];
const absKey = () => `abs_${S.user.kelasId}_${S.abs.tanggal}`;
function absInit(tgl) {
  const k = S.user.kelasId; const sis = activeSiswa().slice().sort((a, b) => a.Nama.localeCompare(b.Nama, 'id'));
  const srv = {}; D('absensi').filter(r => r.t === tgl).forEach(r => { srv[r.s] = { st: r.st, c: r.c || '' }; });
  S.abs = { tanggal: tgl, q: '', filled: Object.keys(srv).length > 0, rows: {} };
  const dr = LS.get(absKey(), null);
  sis.forEach(s => { S.abs.rows[s.ID] = (dr && dr[s.ID]) || srv[s.ID] || { st: 'Hadir', c: '' }; });
  S.abs.draft = !!dr;
}
VIEWS.absensi = {
  panel: true, role: ['guru'], deps: ['absensi', 'siswa'],
  render() {
    const k = S.user.kelasId; if (!k) return emptyBox('person-x', 'Anda belum ditetapkan sebagai wali kelas', 'Minta admin mengisi kelas yang Anda ampu.');
    if (!S.abs || !S.abs.rows || Object.keys(S.abs.rows).length !== activeSiswa().length) absInit(S.abs && S.abs.tanggal ? S.abs.tanggal : todayStr());
    const a = S.abs; const sis = activeSiswa().slice().sort((x, y) => x.Nama.localeCompare(y.Nama, 'id'));
    return `<div class="page-h"><div><h1>Absensi Kelas ${esc(kelasNama(k))}</h1><p class="sub">${hariD(a.tanggal)}, ${fmtD(a.tanggal)} · ${a.filled ? bdg('Sudah diisi', 'g') : bdg('Belum diisi', 'a')}${a.draft ? ' ' + bdg('Draf belum dikirim', 'b') : ''}</p></div>
      <div class="row-gap"><div class="fld" style="margin:0"><label class="sr" for="absTgl">Tanggal</label><input type="date" id="absTgl" class="inp" value="${a.tanggal}" min="${addDays(todayStr(), -31)}" max="${todayStr()}" data-chg="absTgl"></div><button class="btn btn-soft" data-act="absAllH">${ic('check2-all')} Tandai Semua Hadir</button></div></div>
    <div class="card-x pad0"><div style="padding:14px 18px 2px"><div class="inp-ic" style="max-width:360px">${ic('search')}<input class="inp" data-bind="absQ" placeholder="Cari nama siswa…" aria-label="Cari siswa"></div></div>
    <div class="tbl-w"><table class="tbl abs-row"><thead><tr><th style="width:44px">No</th><th>Siswa</th><th class="hide-m">Catatan</th><th>Status kehadiran</th></tr></thead><tbody id="absBody">${sis.map((s, i) => { const r = a.rows[s.ID]; return `<tr data-n="${esc(s.Nama.toLowerCase())}"><td class="muted tnum">${String(i + 1).padStart(2, '0')}</td><td><div class="row-gap" style="gap:10px;flex-wrap:nowrap">${avatar(s.Nama, s.FotoThumb, 'sm')}<div><b>${esc(s.Nama)}</b><div class="xs muted">NIS ${esc(s.NIS)}</div></div></div></td><td class="hide-m"><input class="inp" style="min-height:38px" maxlength="120" placeholder="Catatan (opsional)" value="${esc(r.c)}" data-bind="absNote" data-id="${esc(s.ID)}" aria-label="Catatan ${esc(s.Nama)}"></td><td><div class="seg" role="radiogroup" aria-label="Status ${esc(s.Nama)}">${ST_LIST.map(x => `<label><input type="radio" name="st-${esc(s.ID)}" value="${x[0]}" ${r.st === x[0] ? 'checked' : ''} data-chg="absSt" data-id="${esc(s.ID)}"><span class="${x[1]}">${x[0]}</span></label>`).join('')}</div></td></tr>`; }).join('')}</tbody></table></div></div>
    <div class="sum-bar"><div class="row-gap" id="absSum"></div><div class="row-gap"><button class="btn btn-ghost" data-act="absReset">Batal / Reset</button><button class="btn btn-pri lg" data-act="absSave">${ic('cloud-check')} Simpan Absensi</button></div></div>`;
  },
  after() { absSum(); }
};
function absSum() {
  const c = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0 }; Object.keys(S.abs.rows).forEach(id => { c[S.abs.rows[id].st]++; }); const n = Object.keys(S.abs.rows).length;
  const el = $('#absSum'); if (el) el.innerHTML = `${bdg('Hadir: ' + c.Hadir, 'g', 1)}${bdg('Izin: ' + c.Izin, 'a', 1)}${bdg('Sakit: ' + c.Sakit, 'b', 1)}${bdg('Alpa: ' + c.Alpa, 'r', 1)}<span class="small muted">Total <b>${n}</b> siswa</span>`;
}
const absDraftSave = debounce(() => { LS.set(absKey(), S.abs.rows); }, 300);
BIND.absSt = t => { S.abs.rows[t.dataset.id].st = t.value; absSum(); absDraftSave(); S.abs.draft = true; };
BIND.absNote = t => { S.abs.rows[t.dataset.id].c = t.value; absDraftSave(); };
BIND.absQ = debounce(t => { const q = t.value.toLowerCase(); $$('#absBody tr').forEach(tr => { tr.hidden = q && tr.dataset.n.indexOf(q) < 0; }); }, 150);
BIND.absTgl = t => { if (!t.value) return; absInit(t.value); rerender(); };
ACT.absAllH = () => { Object.keys(S.abs.rows).forEach(id => { S.abs.rows[id].st = 'Hadir'; }); absDraftSave(); renderView(false); };
ACT.absReset = async () => { if (!await confirmBox({ title: 'Reset perubahan?', text: 'Perubahan yang belum disimpan akan dibuang.', ok: 'Reset', danger: false })) return; LS.del(absKey()); absInit(S.abs.tanggal); renderView(false); toast('Perubahan dibuang.', 'info'); };
ACT.absSave = () => {
  const a = S.abs; const k = S.user.kelasId; const rows = Object.keys(a.rows).map(id => ({ siswaId: id, status: a.rows[id].st, catatan: a.rows[id].c }));
  const tgl = a.tanggal; const key = absKey();
  mutate('absensiSave', { tanggal: tgl, kelasId: k, rows }, () => {
    S.db.absensi = D('absensi').filter(r => r.t !== tgl).concat(rows.map(r => ({ t: tgl, s: r.siswaId, st: r.status, c: r.catatan })));
    a.filled = true; a.draft = false; LS.del(key);
  }, { ok: () => toast('Absensi tersinkron ke server.', 'ok'), fail: () => { a.draft = true; LS.set(key, a.rows); } });
  toast('Absensi disimpan. Mengirim ke server di latar belakang…', 'ok');
};

const hitungAkhir = r => { const v = [r.tp1, r.tp2, r.tp3, r.sts].map(num); return v.some(isNaN) ? NaN : Math.round((v[0] + v[1] + v[2] + 2 * v[3]) / 5 * 10) / 10; };
const mapelList = () => { try { return JSON.parse(prof().mapel || '[]'); } catch (e) { return []; } };
function nilInit(mapel) {
  const sis = activeSiswa(); const srv = {}; D('nilai').filter(n => n.Mapel === mapel).forEach(n => { srv[n.SiswaID] = n; });
  const key = `nil_${S.user.kelasId}_${mapel}`; const dr = LS.get(key, null); S.nil = { mapel, rows: {}, key, status: {} };
  sis.forEach(s => { const n = srv[s.ID]; S.nil.status[s.ID] = n ? n.Status : ''; S.nil.rows[s.ID] = (dr && dr[s.ID]) || { tp1: n ? n.TP1 : '', tp2: n ? n.TP2 : '', tp3: n ? n.TP3 : '', sts: n ? n.STS : '' }; });
}
VIEWS.nilai = {
  panel: true, role: ['guru'], deps: ['nilai', 'siswa', 'profil'],
  render() {
    const k = S.user.kelasId; if (!k) return emptyBox('person-x', 'Anda belum ditetapkan sebagai wali kelas', 'Minta admin mengisi kelas yang Anda ampu.');
    const ml = mapelList(); if (!ml.length) return emptyBox('journal-x', 'Belum ada mata pelajaran', 'Admin perlu mengisi daftar mata pelajaran di Pengaturan.');
    if (!S.nil || ml.indexOf(S.nil.mapel) < 0) nilInit(ml[0]);
    const sis = activeSiswa().slice().sort((a, b) => a.Nama.localeCompare(b.Nama, 'id')); const kkm = Number(prof().kkm || 70);
    return `<div class="page-h"><div><span class="kicker">Kurikulum Merdeka</span><h1 style="margin-top:8px">Buku Nilai — Kelas ${esc(kelasNama(k))}</h1><p class="sub">Semester ${esc(prof().semester)} · TA ${esc(prof().tahunAjaran)} · Nilai akhir = (TP1 + TP2 + TP3 + 2×STS) ÷ 5</p></div></div>
    <div class="card-x" style="margin-bottom:16px"><div class="row-gap">${field('mapel', 'Mata pelajaran', { type: 'select', options: ml, value: S.nil.mapel, cls: 'grow' }).replace('<select', '<select data-chg="nilMapel"')}<span class="bdg m">${ic('bullseye')} KKM ${kkm}</span><span class="bdg b">${ic('people')} ${sis.length} siswa</span></div></div>
    <div class="card-x pad0"><div class="note" style="border-radius:16px 16px 0 0">${ic('keyboard')}<span class="small">Tekan <b>Enter</b> untuk pindah ke siswa berikutnya pada kolom yang sama. Perubahan tersimpan otomatis sebagai draf di perangkat ini.</span></div><div class="tbl-w"><table class="tbl"><thead><tr><th style="width:44px">No</th><th>Siswa</th><th class="center">TP-1</th><th class="center">TP-2</th><th class="center">TP-3</th><th class="center">STS</th><th class="center">Nilai akhir</th><th>Status</th></tr></thead><tbody>${sis.map((s, i) => { const r = S.nil.rows[s.ID]; return `<tr><td class="muted tnum">${String(i + 1).padStart(2, '0')}</td><td><div class="row-gap" style="gap:10px;flex-wrap:nowrap">${avatar(s.Nama, s.FotoThumb, 'sm')}<div><b>${esc(s.Nama)}</b><div class="xs muted">NIS ${esc(s.NIS)}</div></div></div></td>${['tp1', 'tp2', 'tp3', 'sts'].map((f, c) => `<td class="center"><input class="cell" type="number" min="0" max="100" step="0.1" inputmode="decimal" data-bind="nilCell" data-id="${esc(s.ID)}" data-f="${f}" data-r="${i}" data-c="${c}" value="${r[f] === '' ? '' : esc(r[f])}" aria-label="${f.toUpperCase()} ${esc(s.Nama)}"></td>`).join('')}<td class="center" id="ak-${esc(s.ID)}">${akhirHtml(r)}</td><td>${S.nil.status[s.ID] ? bdg(S.nil.status[s.ID]) : bdg('Belum diisi', 's')}</td></tr>`; }).join('')}</tbody></table></div></div>
    <div class="stats" style="margin-top:16px;grid-template-columns:repeat(3,1fr)" id="nilStat"></div>
    <div class="sum-bar"><span class="small muted">${ic('cloud-check')} Draf tersimpan otomatis di perangkat. <b>Terbitkan</b> agar nilai tampil ke orang tua.</span><div class="row-gap"><button class="btn btn-soft" data-act="nilSave" data-t="0">Simpan Draf</button><button class="btn btn-pri" data-act="nilSave" data-t="1">${ic('send-check')} Terbitkan Nilai</button></div></div>`;
  },
  after() { nilStat(); }
};
function akhirHtml(r) { const a = hitungAkhir(r); const kkm = Number(prof().kkm || 70); return isNaN(a) ? '<span class="akhir na">–</span>' : `<span class="akhir ${a < kkm ? 'low' : ''}">${a}</span>`; }
function nilStat() {
  const kkm = Number(prof().kkm || 70); const v = Object.keys(S.nil.rows).map(id => hitungAkhir(S.nil.rows[id])).filter(x => !isNaN(x));
  const el = $('#nilStat'); if (!el) return; const avg = v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length * 10) / 10 : '–';
  el.innerHTML = statCard('Rata-rata kelas', `<span class="tnum">${avg}</span>`, `${v.length} dari ${Object.keys(S.nil.rows).length} siswa lengkap`, 'star-fill', 'mint') + statCard('Tuntas KKM', `<span class="tnum">${v.filter(x => x >= kkm).length}</span>`, `${v.length ? pct(v.filter(x => x >= kkm).length, v.length) : 0}% dari yang dinilai`, 'patch-check-fill', 'mint') + statCard('Perlu remedial', `<span class="tnum">${v.filter(x => x < kkm).length}</span>`, 'Di bawah KKM', 'exclamation-diamond-fill', 'coral');
}
const nilDraft = debounce(() => LS.set(S.nil.key, S.nil.rows), 300);
BIND.nilCell = t => { const r = S.nil.rows[t.dataset.id]; r[t.dataset.f] = t.value; const n = num(t.value); t.classList.toggle('bad', t.value !== '' && (isNaN(n) || n < 0 || n > 100)); const c = $('#ak-' + t.dataset.id); if (c) c.innerHTML = akhirHtml(r); nilStat(); nilDraft(); };
BIND.nilMapel = t => { nilInit(t.value); renderView(false); };
document.addEventListener('keydown', e => { const t = e.target; if (e.key === 'Enter' && t.matches && t.matches('.cell')) { e.preventDefault(); const nx = $(`.cell[data-r="${Number(t.dataset.r) + 1}"][data-c="${t.dataset.c}"]`); (nx || t).focus(); if (nx) nx.select(); } });
ACT.nilSave = async el => {
  const terbit = el.dataset.t === '1'; const bad = $$('.cell.bad'); if (bad.length) { toast('Perbaiki nilai yang tidak valid (0–100).', 'err'); bad[0].focus(); return; }
  const rows = Object.keys(S.nil.rows).map(id => ({ siswaId: id, tp1: S.nil.rows[id].tp1, tp2: S.nil.rows[id].tp2, tp3: S.nil.rows[id].tp3, sts: S.nil.rows[id].sts })).filter(r => [r.tp1, r.tp2, r.tp3, r.sts].some(v => v !== ''));
  if (!rows.length) { toast('Belum ada nilai yang diisi.', 'warn'); return; }
  if (terbit && !await confirmBox({ title: 'Terbitkan nilai?', text: `Nilai <b>${esc(S.nil.mapel)}</b> akan terlihat oleh orang tua masing-masing siswa.`, ok: 'Ya, terbitkan', danger: false })) return;
  const m = S.nil.mapel; const key = S.nil.key; const sem = prof().tahunAjaran + '-' + prof().semester;
  mutate('nilaiSave', { kelasId: S.user.kelasId, mapel: m, rows, terbit }, () => {
    const keep = D('nilai').filter(n => n.Mapel !== m || rows.every(r => r.siswaId !== n.SiswaID));
    S.db.nilai = keep.concat(rows.map(r => ({ ID: r.siswaId + '~' + m + '~' + sem, SiswaID: r.siswaId, KelasID: S.user.kelasId, Mapel: m, Semester: sem, TP1: r.tp1 === '' ? '' : Number(r.tp1), TP2: r.tp2 === '' ? '' : Number(r.tp2), TP3: r.tp3 === '' ? '' : Number(r.tp3), STS: r.sts === '' ? '' : Number(r.sts), Akhir: hitungAkhir(r) || '', Status: terbit ? 'Terbit' : 'Draf', Waktu: nowLocal() })));
    LS.del(key); rows.forEach(r => { S.nil.status[r.siswaId] = terbit ? 'Terbit' : 'Draf'; });
  }, { ok: () => toast(terbit ? 'Nilai terbit & tersinkron.' : 'Draf nilai tersinkron.', 'ok') });
  toast(terbit ? 'Nilai diterbitkan.' : 'Draf nilai disimpan.', 'ok');
};
const nowLocal = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 19).replace('T', ' ');

const METODE = ['Tunai', 'Transfer Bank', 'QRIS'];
function bulanOpsi() { const t = todayStr(); const out = []; for (let i = -8; i <= 3; i++) { const d = new Date(t.slice(0, 7) + '-01T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + i); const b = d.toISOString().slice(0, 7); out.push([b, fmtBulan(b)]); } return out; }
function sppRows() {
  const u = S.ui.spp; const m = {}; D('spp').filter(r => r.Bulan === u.bulan).forEach(r => { m[r.SiswaID] = r; });
  return activeSiswa().map(s => { const r = m[s.ID]; return { s, r: r || null, st: r ? r.Status : 'Belum', ada: !!r }; })
    .filter(x => (!u.kelas || x.s.KelasID === u.kelas) && (!u.st || x.st === u.st) && statusSearch(u.q, x.s.Nama, x.s.NIS))
    .sort((a, b) => (kelasNama(a.s.KelasID) + a.s.Nama).localeCompare(kelasNama(b.s.KelasID) + b.s.Nama, 'id'));
}
VIEWS.spp = {
  panel: true, role: ['bendahara'], deps: ['spp', 'siswa', 'profil'],
  render() {
    const u = S.ui.spp = S.ui.spp || { bulan: thisMonth(), kelas: '', st: '', q: '', page: 1 };
    const all = activeSiswa(); const rs = D('spp').filter(r => r.Bulan === u.bulan); const by = {}; rs.forEach(r => { by[r.SiswaID] = r; });
    const lunas = rs.filter(r => r.Status === 'Lunas'); const total = lunas.reduce((a, b) => a + Number(b.Jumlah || 0), 0); const nominal = Number(prof().sppNominal) || 150000;
    const mng = rs.filter(r => r.Status === 'Menunggu').length; const belum = all.length - lunas.length - mng; const tak = all.filter(s => !by[s.ID]).length;
    return `<div class="page-h"><div><span class="kicker">Tahun Ajaran ${esc(prof().tahunAjaran || '')}</span><h1 style="margin-top:8px">Manajemen & Rekap SPP</h1><p class="sub">Catat pembayaran, verifikasi bukti transfer, dan pantau tunggakan.</p></div><div class="row-gap"><button class="btn btn-soft" data-act="sppCsv">${ic('download')} Unduh Rekap (CSV)</button><button class="btn btn-pri" data-act="sppAdd">${ic('plus-circle')} Catat Pembayaran</button></div></div>
    <div class="stats">${statCard('Terkumpul ' + fmtBulan(u.bulan), `<span class="tnum" style="font-size:24px">${rp(total)}</span>`, `Target ${rp(all.length * nominal)}`, 'cash-stack', 'mint')}${statCard('Siswa lunas', `<span class="tnum">${lunas.length}</span>`, `dari ${all.length} siswa · ${pct(lunas.length, all.length)}%`, 'check-circle-fill', 'mint')}${statCard('Menunggu verifikasi', `<span class="tnum">${mng}</span>`, mng ? 'Periksa bukti transfer' : 'Tidak ada', 'hourglass-split', 'yellow')}${statCard('Belum bayar', `<span class="tnum">${belum}</span>`, tak ? `${tak} belum punya tagihan` : 'Semua sudah ditagih', 'exclamation-circle-fill', 'coral')}</div>
    <div class="card-x" style="margin-bottom:16px"><div class="bar"><i style="width:${pct(lunas.length, all.length)}%"></i></div><div class="small muted" style="margin-top:6px">Ketercapaian pembayaran ${pct(lunas.length, all.length)}%</div></div>
    <div class="card-x pad0"><div style="padding:16px 18px 4px"><div class="filters"><div class="inp-ic">${ic('search')}<input class="inp" data-bind="sppQ" value="${esc(u.q)}" placeholder="Cari nama siswa atau NIS…" aria-label="Cari siswa"></div><select class="inp" data-chg="sppBulan" aria-label="Bulan">${bulanOpsi().map(b => `<option value="${b[0]}" ${u.bulan === b[0] ? 'selected' : ''}>${b[1]}</option>`).join('')}</select><select class="inp" data-chg="sppKelas" aria-label="Kelas">${kelasOpts(true).map(k => `<option value="${esc(k[0])}" ${u.kelas === k[0] ? 'selected' : ''}>${esc(k[1])}</option>`).join('')}</select></div>
      <div class="filters">${[['', 'Semua'], ['Menunggu', 'Menunggu verifikasi'], ['Belum', 'Belum bayar'], ['Lunas', 'Lunas']].map(s => `<button class="chip ${u.st === s[0] ? 'on' : ''}" data-act="sppSt" data-s="${s[0]}">${s[1]}</button>`).join('')}<span class="grow"></span>${tak ? `<button class="btn btn-soft sm" data-act="sppGen">${ic('receipt')} Buat ${tak} tagihan ${esc(fmtBulan(u.bulan))}</button>` : ''}${mng ? `<button class="btn btn-pri sm" data-act="sppVerAll">${ic('check2-all')} Verifikasi ${mng} menunggu</button>` : ''}</div></div><div id="sppTbl"></div></div>`;
  },
  after() { drawSpp(); }
};
function drawSpp() {
  const u = S.ui.spp; const l = sppRows(); const pg = paginate(l, u.page, 10);
  const act = x => x.st === 'Menunggu' ? `<button class="btn btn-pri sm" data-act="sppVer" data-id="${esc(x.r.ID)}">Verifikasi</button>` : (x.st === 'Belum' ? `<button class="btn btn-soft sm" data-act="sppEdit" data-s="${esc(x.s.ID)}">Catat bayar</button>` : `<button class="ibtn" data-act="sppEdit" data-s="${esc(x.s.ID)}" aria-label="Ubah">${ic('pencil')}</button>`);
  $('#sppTbl').innerHTML = pg.total ? `<div class="tbl-w"><table class="tbl"><thead><tr><th>Siswa</th><th>Nominal</th><th class="hide-m">Metode</th><th class="hide-m">Tgl bayar</th><th>Bukti</th><th>Status</th><th class="act">Aksi</th></tr></thead><tbody>${pg.items.map(x => `<tr><td><b>${esc(x.s.Nama)}</b><div class="xs muted">NIS ${esc(x.s.NIS)} · Kelas ${esc(kelasNama(x.s.KelasID))}</div></td><td class="tnum">${rp(x.r ? x.r.Jumlah : (Number(prof().sppNominal) || 150000))}</td><td class="hide-m small">${esc(x.r ? x.r.Metode || '-' : '-')}</td><td class="hide-m small">${x.r && x.r.TglBayar ? fmtD(x.r.TglBayar) : '-'}</td><td>${x.r && x.r.Bukti ? `<button class="btn btn-ghost sm" data-act="sppBukti" data-id="${esc(x.r.ID)}">${ic('image')} Lihat</button>` : '<span class="muted xs">—</span>'}</td><td>${bdg(x.ada ? x.st : 'Belum', x.ada ? null : 'r', 1)}${x.ada ? '' : '<div class="xs muted">belum ditagih</div>'}</td><td class="act">${act(x)}</td></tr>`).join('')}</tbody></table></div>${pager('spp', pg, 'siswa')}` : emptyBox('cash-coin', 'Tidak ada data', 'Ubah filter atau buat tagihan bulan ini.');
}
REDRAW.spp = drawSpp;
BIND.sppQ = debounce(t => { S.ui.spp.q = t.value; S.ui.spp.page = 1; drawSpp(); }, 180);
BIND.sppBulan = t => { S.ui.spp.bulan = t.value; S.ui.spp.page = 1; rerender(); }; BIND.sppKelas = t => { S.ui.spp.kelas = t.value; S.ui.spp.page = 1; drawSpp(); };
ACT.sppSt = el => { S.ui.spp.st = el.dataset.s; S.ui.spp.page = 1; $$('.filters .chip').forEach(c => c.classList.toggle('on', c === el)); drawSpp(); };
ACT.sppCsv = () => downloadCSV('spp-' + S.ui.spp.bulan + '.csv', [['NIS', 'Nama', 'Kelas', 'Bulan', 'Nominal', 'Status', 'Metode', 'Tgl Bayar']].concat(sppRows().map(x => [x.s.NIS, x.s.Nama, kelasNama(x.s.KelasID), S.ui.spp.bulan, x.r ? x.r.Jumlah : '', x.st, x.r ? x.r.Metode : '', x.r ? x.r.TglBayar : ''])));
ACT.sppBukti = async el => { const r = await api('buktiSpp', { id: el.dataset.id }); if (!r.success) { toast(r.message, 'err'); return; } previewFile(r.data.id, 'Bukti Pembayaran'); };
ACT.sppVer = el => { const r = ix('spp')[el.dataset.id]; mutate('sppSet', { ids: [r.ID], status: 'Lunas' }, () => { r.Status = 'Lunas'; r.TglBayar = r.TglBayar || todayStr(); }); toast('Pembayaran diverifikasi: Lunas.', 'ok'); };
ACT.sppVerAll = async () => { const ids = D('spp').filter(r => r.Bulan === S.ui.spp.bulan && r.Status === 'Menunggu').map(r => r.ID); if (!await confirmBox({ title: 'Verifikasi semua?', text: `<b>${ids.length} pembayaran</b> menunggu akan ditandai Lunas.`, ok: 'Ya, verifikasi', danger: false })) return; mutate('sppSet', { ids, status: 'Lunas' }, () => D('spp').forEach(r => { if (ids.indexOf(r.ID) >= 0) { r.Status = 'Lunas'; r.TglBayar = r.TglBayar || todayStr(); } })); toast(ids.length + ' pembayaran diverifikasi.', 'ok'); };
ACT.sppGen = async el => { busy(el, true, 'Membuat…'); const r = await api('sppGenerate', { bulan: S.ui.spp.bulan }); busy(el, false); if (!r.success) { toast(r.message, 'err'); return; } toast(r.message, 'ok'); S.ver.spp = ''; await resync(); };
ACT.sppAdd = () => sppForm(null, ''); ACT.sppEdit = el => sppForm(el.dataset.s);
function sppForm(sid) {
  const u = S.ui.spp; const sis = activeSiswa().slice().sort((a, b) => a.Nama.localeCompare(b.Nama, 'id')); const rec0 = sid ? D('spp').find(r => r.SiswaID === sid && r.Bulan === u.bulan) : null; delete S.files.bukti;
  formModal({ title: rec0 && rec0.Status !== 'Belum' ? 'Ubah Pembayaran SPP' : 'Catat Pembayaran SPP', body: `${field('SiswaID', 'Siswa', { req: 1, type: 'select', options: [['', 'Pilih siswa…']].concat(sis.map(s => [s.ID, `${s.Nama} — Kelas ${kelasNama(s.KelasID)}`])), value: sid || '', msg: 'Pilih siswa.' })}<div class="grid2">${field('Bulan', 'Bulan tagihan', { type: 'select', options: bulanOpsi(), value: u.bulan })}${field('Jumlah', 'Nominal (Rp)', { req: 1, type: 'number', value: rec0 ? rec0.Jumlah : (Number(prof().sppNominal) || 150000), attrs: 'min="1000" step="1000"', msg: 'Isi nominal pembayaran.' })}${field('Metode', 'Metode bayar', { type: 'select', options: METODE, value: rec0 && rec0.Metode ? rec0.Metode : 'Tunai' })}${field('TglBayar', 'Tanggal bayar', { type: 'date', value: rec0 && rec0.TglBayar ? rec0.TglBayar : todayStr(), attrs: `max="${todayStr()}"` })}</div>${field('Status', 'Status', { type: 'select', options: [['Lunas', 'Lunas'], ['Menunggu', 'Menunggu verifikasi'], ['Belum', 'Belum bayar']], value: rec0 ? rec0.Status : 'Lunas' })}${field('Catatan', 'Catatan', { value: rec0 ? rec0.Catatan : '', attrs: 'maxlength="200"' })}${dz('bukti', 'Bukti pembayaran', { opt: 1 })}`,
    onSubmit: async d => {
      const ex = D('spp').find(r => r.SiswaID === d.SiswaID && r.Bulan === d.Bulan); const id = ex ? ex.ID : 'sp-' + uid();
      const rec = { ID: id, SiswaID: d.SiswaID, Bulan: d.Bulan, Jumlah: Number(d.Jumlah), TglBayar: d.Status === 'Belum' ? '' : (d.TglBayar || todayStr()), Metode: d.Metode, Status: d.Status, Catatan: d.Catatan };
      if (fileOf('bukti')) { const r = await api('sppSave', { rec, bukti: fileOf('bukti') }); if (!r.success) { toast(r.message, 'err'); return false; } rec.Bukti = 1; upsertLocal('spp', rec); clearFiles('bukti'); refreshView(true); toast(r.message, 'ok'); S.ver.spp = ''; resync(); return; }
      mutate('sppSave', { rec }, () => upsertLocal('spp', Object.assign({ Bukti: ex ? ex.Bukti : 0 }, rec))); toast('Pembayaran dicatat.', 'ok');
    } });
}

VIEWS.rekap = {
  panel: true, role: ['admin', 'kepsek'], deps: ['absensiAgg', 'absensiSiswa', 'nilaiAgg', 'sppAgg', 'ppdbAgg', 'kelas', 'guru'],
  render() {
    const u = S.ui.rekap = S.ui.rekap || { tab: 'absensi', kelas: '', bulan: '' };
    const bln = Array.from(new Set(D('absensiAgg').map(d => d.t.slice(0, 7)))).sort().reverse();
    return `<div class="page-h"><div><span class="kicker">${S.user.role === 'kepsek' ? 'Ringkasan Eksekutif' : 'Laporan'}</span><h1 style="margin-top:8px">Rekap & Laporan</h1><p class="sub">TA ${esc(prof().tahunAjaran || '')} · Semester ${esc(prof().semester || '')} · data hanya-baca</p></div><div class="row-gap no-print"><button class="btn btn-soft" data-act="rekapCsv">${ic('download')} Unduh CSV</button><button class="btn btn-pri" onclick="window.print()">${ic('printer')} Cetak / PDF</button></div></div>
    <div class="row-gap no-print" style="margin-bottom:16px;justify-content:space-between"><div class="tabs" role="tablist">${[['absensi', 'Absensi'], ['nilai', 'Nilai'], ['spp', 'SPP'], ['ppdb', 'PPDB']].map(t => `<button class="tab ${u.tab === t[0] ? 'on' : ''}" role="tab" aria-selected="${u.tab === t[0]}" data-act="rekapTab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
      <div class="row-gap" id="rekapFilter"><select class="inp" style="width:auto" data-chg="rekapKelas" aria-label="Kelas">${kelasOpts(true).map(k => `<option value="${esc(k[0])}" ${u.kelas === k[0] ? 'selected' : ''}>${esc(k[1])}</option>`).join('')}</select><select class="inp" style="width:auto" data-chg="rekapBulan" aria-label="Bulan"><option value="">Semua bulan</option>${bln.map(b => `<option value="${b}" ${u.bulan === b ? 'selected' : ''}>${fmtBulan(b)}</option>`).join('')}</select></div></div><div id="rekapBody"></div>`;
  },
  after() { drawRekap(); }
};
ACT.rekapTab = el => { S.ui.rekap.tab = el.dataset.t; $$('.tabs .tab').forEach(t => { t.classList.toggle('on', t === el); t.setAttribute('aria-selected', t === el); }); $('#rekapFilter').style.display = (el.dataset.t === 'absensi' || el.dataset.t === 'nilai') ? '' : 'none'; killCharts(); drawRekap(); };
BIND.rekapKelas = t => { S.ui.rekap.kelas = t.value; killCharts(); drawRekap(); }; BIND.rekapBulan = t => { S.ui.rekap.bulan = t.value; killCharts(); drawRekap(); };
let _rekapRows = [];
function drawRekap() {
  const u = S.ui.rekap; const b = $('#rekapBody'); if (!b) return; const f = $('#rekapFilter'); if (f) f.style.display = (u.tab === 'absensi' || u.tab === 'nilai') ? '' : 'none';
  if (u.tab === 'absensi') rekapAbs(b); else if (u.tab === 'nilai') rekapNilai(b); else if (u.tab === 'spp') rekapSpp(b); else rekapPpdb(b);
}
function rekapAbs(b) {
  const u = S.ui.rekap; const days = D('absensiAgg').filter(d => (!u.kelas || d.k === u.kelas) && (!u.bulan || d.t.startsWith(u.bulan)));
  if (!days.length) { b.innerHTML = emptyBox('calendar-x', 'Belum ada data absensi', 'Ubah filter atau tunggu guru mengisi absensi.'); _rekapRows = []; return; }
  const sum = { h: 0, s: 0, i: 0, a: 0 }; days.forEach(d => { sum.h += d.h; sum.s += d.s; sum.i += d.i; sum.a += d.a; }); const tot = sum.h + sum.s + sum.i + sum.a; const tgl = Array.from(new Set(days.map(d => d.t))).length;
  const perK = {}; days.forEach(d => { const o = perK[d.k] || (perK[d.k] = { h: 0, s: 0, i: 0, a: 0 }); o.h += d.h; o.s += d.s; o.i += d.i; o.a += d.a; });
  const t0 = todayStr(); const todayDone = {}; D('absensiAgg').filter(d => d.t === t0).forEach(d => { todayDone[d.k] = d.w; });
  const rows = D('kelas').filter(k => perK[k.ID]).map(k => { const o = perK[k.ID]; return { k, o, p: absPct(o), wali: (ix('guru')[k.WaliID] || {}).Nama || '-' }; });
  _rekapRows = [['Kelas', 'Wali kelas', 'Hadir', 'Izin', 'Sakit', 'Alpa', 'Kehadiran %']].concat(rows.map(r => [r.k.Nama, r.wali, r.o.h, r.o.i, r.o.s, r.o.a, r.p]));
  const low = rows.slice().sort((a, c) => a.p - c.p)[0];
  b.innerHTML = `<div class="stats">${statCard('Rata-rata kehadiran', `<span class="tnum">${pct(sum.h, tot)}%</span>`, `${tgl} hari tercatat`, 'graph-up-arrow', 'mint')}${statCard('Sakit', `<span class="tnum">${sum.s}</span>`, 'hari-siswa', 'thermometer-half', 'blue')}${statCard('Izin', `<span class="tnum">${sum.i}</span>`, 'hari-siswa', 'envelope-paper', 'yellow')}${statCard('Alpa', `<span class="tnum">${sum.a}</span>`, 'hari-siswa', 'x-octagon-fill', 'coral')}</div>
    ${low && low.p < 95 ? `<div class="note bad" style="margin-bottom:16px">${ic('exclamation-triangle')}<span><b>Perhatian:</b> kehadiran Kelas ${esc(low.k.Nama)} ${low.p}% — di bawah ambang 95%. Tindak lanjut wali kelas.</span></div>` : ''}
    <div class="two eq"><div class="card-x"><div class="card-h"><h3>Kehadiran per kelas</h3></div>${cv('chRk')}</div><div class="card-x"><div class="card-h"><h3>Tren harian</h3></div>${cv('chRt')}</div></div>
    <div class="card-x pad0" style="margin-bottom:20px"><div class="card-h" style="padding:16px 18px 0"><div><h3>Rangkuman per kelas</h3><div class="sub">Presensi hari ini: ${t0 && fmtD(t0)}</div></div></div><div class="tbl-w"><table class="tbl"><thead><tr><th>Kelas</th><th>Wali kelas</th><th class="num">Hadir</th><th class="num">Izin</th><th class="num">Sakit</th><th class="num">Alpa</th><th>Kehadiran</th><th>Presensi hari ini</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>Kelas ${esc(r.k.Nama)}</b></td><td>${esc(r.wali)}</td><td class="num tnum">${r.o.h}</td><td class="num tnum">${r.o.i}</td><td class="num tnum">${r.o.s}</td><td class="num tnum">${r.o.a}</td><td style="min-width:130px"><div class="row-gap" style="gap:8px;flex-wrap:nowrap"><div class="bar sm grow ${r.p < 95 ? 'coral' : ''}"><i style="width:${r.p}%"></i></div><b class="tnum small">${r.p}%</b></div></td><td>${todayDone[r.k.ID] !== undefined ? bdg('Sudah ' + String(todayDone[r.k.ID]).slice(11, 16), 'g') : bdg('Belum', 'a')}</td></tr>`).join('')}</tbody></table></div></div>
    ${S.user.role === 'admin' ? `<div class="card-x pad0"><div class="card-h" style="padding:16px 18px 0"><div><h3>Rincian per siswa</h3><div class="sub">${u.kelas ? 'Kelas ' + esc(kelasNama(u.kelas)) : 'Semua kelas'} · ${u.bulan ? fmtBulan(u.bulan) : 'semua bulan'}</div></div></div><div id="rekapSis"></div></div>` : ''}`;
  drawChart('chRk', { type: 'bar', data: { labels: rows.map(r => r.k.Nama), datasets: [{ label: 'Kehadiran (%)', data: rows.map(r => r.p), backgroundColor: rows.map(r => r.p < 95 ? cssVar('--coral') : cssVar('--pri')), borderRadius: 8 }] }, options: { scales: { y: { min: Math.max(0, Math.min(...rows.map(r => r.p)) - 10), max: 100 } }, plugins: { legend: { display: false } } } });
  const byD = {}; days.forEach(d => { const o = byD[d.t] || (byD[d.t] = { h: 0, s: 0, i: 0, a: 0 }); o.h += d.h; o.s += d.s; o.i += d.i; o.a += d.a; }); const ds = Object.keys(byD).sort().slice(-30);
  drawChart('chRt', { type: 'line', data: { labels: ds.map(d => d.slice(8) + ' ' + MON[+d.slice(5, 7) - 1]), datasets: [{ label: 'Kehadiran (%)', data: ds.map(d => absPct(byD[d])), borderColor: cssVar('--pri'), backgroundColor: 'rgba(21,138,115,.14)', fill: true, tension: .3, pointRadius: 2 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { min: Math.max(0, Math.min(...ds.map(d => absPct(byD[d]))) - 8), max: 100 } } } });
  if (S.user.role === 'admin') {
    const sd = D('absensiSiswa'); const sis = D('siswa').filter(s => s.Status === 'Aktif' && (!u.kelas || s.KelasID === u.kelas)).map(s => { const m = (sd[s.ID] || {}).m || {}; const c = [0, 0, 0, 0]; Object.keys(m).forEach(k => { if (!u.bulan || k === u.bulan) for (let i = 0; i < 4; i++) c[i] += m[k][i]; }); const t = c[0] + c[1] + c[2] + c[3]; return { s, c, p: t ? pct(c[0], t) : null }; }).sort((a, c) => (a.p === null ? 101 : a.p) - (c.p === null ? 101 : c.p));
    const pg = paginate(sis, (S.ui.rekapSis = S.ui.rekapSis || { page: 1 }).page, 10); REDRAW.rekapSis = () => drawRekap(); _rekapRows = _rekapRows.concat([[], ['Siswa', 'Kelas', 'Hadir', 'Izin', 'Sakit', 'Alpa', 'Kehadiran %']], sis.map(x => [x.s.Nama, kelasNama(x.s.KelasID), x.c[0], x.c[2], x.c[1], x.c[3], x.p === null ? '' : x.p]));
    $('#rekapSis').innerHTML = `<div class="tbl-w"><table class="tbl"><thead><tr><th>Siswa</th><th>Kelas</th><th class="num">Hadir</th><th class="num">Izin</th><th class="num">Sakit</th><th class="num">Alpa</th><th class="num">%</th></tr></thead><tbody>${pg.items.map(x => `<tr><td><div class="row-gap" style="gap:8px;flex-wrap:nowrap">${avatar(x.s.Nama, x.s.FotoThumb, 'sm')}<b>${esc(x.s.Nama)}</b></div></td><td>${esc(kelasNama(x.s.KelasID))}</td><td class="num tnum">${x.c[0]}</td><td class="num tnum">${x.c[2]}</td><td class="num tnum">${x.c[1]}</td><td class="num tnum">${x.c[3]}</td><td class="num tnum"><b>${x.p === null ? '–' : x.p + '%'}</b></td></tr>`).join('')}</tbody></table></div>${pager('rekapSis', pg, 'siswa')}`;
  }
}
function rekapNilai(b) {
  const u = S.ui.rekap; const l = D('nilaiAgg').filter(n => !u.kelas || n.kelasId === u.kelas); const kkm = Number(prof().kkm || 70);
  if (!l.length) { b.innerHTML = emptyBox('journal-x', 'Belum ada nilai terbit', 'Nilai muncul setelah guru menerbitkannya.'); _rekapRows = []; return; }
  const perK = {}; l.forEach(n => { const o = perK[n.kelasId] || (perK[n.kelasId] = { n: 0, sum: 0 }); o.n += n.n; o.sum += n.avg * n.n; });
  const all = l.reduce((a, n) => ({ n: a.n + n.n, s: a.s + n.avg * n.n, t: a.t + n.tuntas }), { n: 0, s: 0, t: 0 });
  _rekapRows = [['Kelas', 'Mapel', 'Semester', 'Siswa dinilai', 'Rata-rata', 'Tuntas KKM']].concat(l.map(n => [kelasNama(n.kelasId), n.mapel, n.semester, n.n, n.avg, n.tuntas]));
  b.innerHTML = `<div class="stats" style="grid-template-columns:repeat(3,1fr)">${statCard('Rata-rata nilai', `<span class="tnum">${Math.round(all.s / all.n * 10) / 10}</span>`, `${all.n} penilaian`, 'star-fill', 'mint')}${statCard('Ketuntasan (KKM ' + kkm + ')', `<span class="tnum">${pct(all.t, all.n)}%</span>`, `${all.t} dari ${all.n}`, 'patch-check-fill', 'mint')}${statCard('Perlu remedial', `<span class="tnum">${all.n - all.t}</span>`, 'di bawah KKM', 'exclamation-diamond-fill', 'coral')}</div>
    <div class="two eq"><div class="card-x"><div class="card-h"><h3>Rata-rata nilai per kelas</h3></div>${cv('chNk')}</div><div class="card-x pad0"><div class="tbl-w"><table class="tbl"><thead><tr><th>Kelas</th><th>Mapel</th><th class="num">Dinilai</th><th class="num">Rata-rata</th><th class="num">Tuntas</th></tr></thead><tbody>${l.map(n => `<tr><td>${esc(kelasNama(n.kelasId))}</td><td>${esc(n.mapel)}</td><td class="num tnum">${n.n}</td><td class="num tnum"><span class="akhir ${n.avg < kkm ? 'low' : ''}">${n.avg}</span></td><td class="num tnum">${pct(n.tuntas, n.n)}%</td></tr>`).join('')}</tbody></table></div></div></div>`;
  const ks = Object.keys(perK); drawChart('chNk', { type: 'bar', data: { labels: ks.map(kelasNama), datasets: [{ label: 'Rata-rata', data: ks.map(k => Math.round(perK[k].sum / perK[k].n * 10) / 10), backgroundColor: cssVar('--pri'), borderRadius: 8 }] }, options: { scales: { y: { min: 0, max: 100 } }, plugins: { legend: { display: false } } } });
}
function rekapSpp(b) {
  const l = D('sppAgg'); if (!l.length) { b.innerHTML = emptyBox('cash-stack', 'Belum ada data SPP', 'Bendahara membuat tagihan bulanan.'); _rekapRows = []; return; }
  const tot = l.reduce((a, x) => a + x.total, 0); const last = l[l.length - 1];
  _rekapRows = [['Bulan', 'Lunas', 'Menunggu', 'Belum bayar', 'Terkumpul (Rp)', 'Target (Rp)']].concat(l.map(x => [x.bulan, x.lunas, x.menunggu, x.belum, x.total, x.target]));
  b.innerHTML = `<div class="stats" style="grid-template-columns:repeat(3,1fr)">${statCard('Total terkumpul', `<span class="tnum" style="font-size:24px">${rp(tot)}</span>`, `${l.length} bulan tercatat`, 'cash-stack', 'mint')}${statCard('Realisasi ' + fmtBulan(last.bulan), `<span class="tnum">${pct(last.total, last.target)}%</span>`, `${rp(last.total)} dari ${rp(last.target)}`, 'graph-up-arrow', 'mint')}${statCard('Belum lunas ' + MON[+last.bulan.slice(5) - 1], `<span class="tnum">${last.belum + last.menunggu}</span>`, `${last.menunggu} menunggu verifikasi`, 'exclamation-circle-fill', 'coral')}</div>
    <div class="two eq"><div class="card-x"><div class="card-h"><h3>Penerimaan per bulan</h3></div>${cv('chSp')}</div><div class="card-x pad0"><div class="tbl-w"><table class="tbl"><thead><tr><th>Bulan</th><th class="num">Lunas</th><th class="num">Belum</th><th class="num">Terkumpul</th></tr></thead><tbody>${l.slice().reverse().map(x => `<tr><td>${fmtBulan(x.bulan)}</td><td class="num tnum">${x.lunas}</td><td class="num tnum">${x.belum + x.menunggu}</td><td class="num tnum">${rp(x.total)}</td></tr>`).join('')}</tbody></table></div></div></div>`;
  drawChart('chSp', { type: 'bar', data: { labels: l.map(x => MON[+x.bulan.slice(5) - 1]), datasets: [{ label: 'Terkumpul (Rp)', data: l.map(x => x.total), backgroundColor: cssVar('--pri'), borderRadius: 8 }, { label: 'Target (Rp)', data: l.map(x => x.target), backgroundColor: cssVar('--chart-grid'), borderRadius: 8 }] }, options: { scales: { y: { ticks: { callback: v => (v / 1e6) + ' jt' } } } } });
}
function rekapPpdb(b) {
  const gl = D('gelombang'); const ag = D('ppdbAgg'); const total = ag.reduce((a, x) => a + x.n, 0);
  if (!total && !gl.length) { b.innerHTML = emptyBox('person-plus', 'Belum ada data PPDB', 'Data muncul setelah ada pendaftar.'); _rekapRows = []; return; }
  const n = (g, s) => ag.filter(x => x.gelombangId === g && (!s || x.status === s)).reduce((a, x) => a + x.n, 0);
  _rekapRows = [['Gelombang', 'Kuota', 'Pendaftar', 'Baru', 'Diverifikasi', 'Berkas kurang', 'Diterima']].concat(gl.map(g => [g.Nama, g.Kuota, n(g.ID), n(g.ID, 'Baru'), n(g.ID, 'Diverifikasi'), n(g.ID, 'Berkas Kurang'), n(g.ID, 'Diterima')]));
  b.innerHTML = `<div class="stats" style="grid-template-columns:repeat(3,1fr)">${statCard('Total pendaftar', `<span class="tnum">${total}</span>`, 'semua gelombang', 'person-lines-fill', 'mint')}${statCard('Diverifikasi/diterima', `<span class="tnum">${ag.filter(x => x.status === 'Diverifikasi' || x.status === 'Diterima').reduce((a, x) => a + x.n, 0)}</span>`, 'lolos verifikasi', 'shield-check', 'mint')}${statCard('Berkas kurang', `<span class="tnum">${ag.filter(x => x.status === 'Berkas Kurang').reduce((a, x) => a + x.n, 0)}</span>`, 'perlu dilengkapi', 'file-earmark-x-fill', 'coral')}</div>
    <div class="card-x pad0"><div class="tbl-w"><table class="tbl"><thead><tr><th>Gelombang</th><th>Periode</th><th class="num">Kuota</th><th class="num">Pendaftar</th><th class="num">Baru</th><th class="num">Diverifikasi</th><th class="num">Berkas kurang</th><th>Status</th></tr></thead><tbody>${gl.map(g => `<tr><td><b>${esc(g.Nama)}</b></td><td class="small">${fmtD(g.Buka)} – ${fmtD(g.Tutup)}</td><td class="num tnum">${g.Kuota || '-'}</td><td class="num tnum"><b>${n(g.ID)}</b></td><td class="num tnum">${n(g.ID, 'Baru')}</td><td class="num tnum">${n(g.ID, 'Diverifikasi')}</td><td class="num tnum">${n(g.ID, 'Berkas Kurang')}</td><td>${bdg(gelStatus(g), null, 1)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
ACT.rekapCsv = () => { if (!_rekapRows.length) { toast('Tidak ada data untuk diunduh.', 'warn'); return; } downloadCSV(`rekap-${S.ui.rekap.tab}-${todayStr()}.csv`, _rekapRows); };

const ST_CODE = { H: 'Hadir', S: 'Sakit', I: 'Izin', A: 'Alpa' };
VIEWS.anak = {
  panel: true, role: ['ortu', 'siswa'], deps: ['siswa', 'nilai', 'absensiSiswa', 'guru', 'kelas', 'profil'],
  render() {
    const kids = D('siswa'); if (!kids.length) return `<div class="page-h"><div><h1>Anak Saya</h1></div></div>${emptyBox('person-x', 'Belum ada anak yang terhubung', 'Hubungi Tata Usaha agar akun Anda dihubungkan dengan data anak Anda.')}`;
    const u = S.ui.anak = S.ui.anak || { id: '', tab: 'nilai' }; if (!ix('siswa')[u.id]) u.id = kids[0].ID; const s = ix('siswa')[u.id];
    const kelas = ix('kelas')[s.KelasID] || {}; const wali = (D('guru').find(g => g.ID === kelas.WaliID)) || null; const sd = (D('absensiSiswa')[s.ID]) || { m: {}, r: [] };
    const bln = thisMonth(); const m = sd.m[bln] || [0, 0, 0, 0]; const mt = m[0] + m[1] + m[2] + m[3]; const nl = D('nilai').filter(n => n.SiswaID === s.ID && n.Akhir !== '');
    const avg = nl.length ? Math.round(nl.reduce((a, n) => a + Number(n.Akhir), 0) / nl.length * 10) / 10 : null; const kkm = Number(prof().kkm || 70);
    return `<div class="card-x" style="background:linear-gradient(135deg,var(--soft),var(--soft2));margin-bottom:20px"><div class="row-gap" style="gap:18px;flex-wrap:nowrap;align-items:center">${avatar(s.Nama, s.FotoThumb, 'lg')}<div class="grow"><span class="kicker">Ruang Tumbuh Ananda</span><h1 style="font-size:26px;margin-top:6px">${esc(s.Nama)}</h1><div class="small muted">NIS ${esc(s.NIS)} · Kelas ${esc(kelas.Nama || '-')} ${wali ? '· Wali kelas: ' + esc(wali.Nama) : ''}</div></div>${wali && wali.WA ? `<a class="btn btn-wa hide-m" href="${esc(waLink(wali.WA, 'Assalamualaikum, saya orang tua ' + s.Nama + ' (Kelas ' + (kelas.Nama || '') + ')'))}" target="_blank" rel="noopener">${ic('whatsapp')} Hubungi Wali Kelas</a>` : ''}</div>
      ${kids.length > 1 ? `<div class="filters" style="margin:14px 0 0">${kids.map(k => `<button class="chip ${k.ID === s.ID ? 'on' : ''}" data-act="anakPilih" data-id="${esc(k.ID)}">${esc(k.Nama.split(' ')[0])}</button>`).join('')}</div>` : ''}${wali && wali.WA ? `<div class="sp"></div><a class="btn btn-wa block" style="display:none" id="waMobile" href="#">WA</a>` : ''}</div>
    <div class="stats" style="grid-template-columns:repeat(3,1fr)">${statCard('Kehadiran ' + MONF[+bln.slice(5) - 1], `<span class="tnum">${mt ? pct(m[0], mt) + '%' : '–'}</span>`, mt ? `${m[0]} hadir · ${m[1]} sakit · ${m[2]} izin · ${m[3]} alpa` : 'Belum ada catatan bulan ini', 'calendar-check-fill', 'mint')}${statCard('Rata-rata nilai', `<span class="tnum">${avg === null ? '–' : avg}</span>`, avg === null ? 'Belum ada nilai terbit' : (avg >= kkm ? 'Di atas KKM ' + kkm : 'Di bawah KKM ' + kkm), 'journal-bookmark-fill', avg !== null && avg < kkm ? 'coral' : 'yellow')}${statCard('Foto di situs publik', s.IzinFoto === 'Ya' ? 'Diizinkan' : 'Tidak', s.IzinFoto === 'Ya' ? 'Persetujuan ' + fmtD(s.TglIzinFoto) : 'Belum ada surat persetujuan', 'patch-check-fill', 'blue')}</div>
    <div class="tabs" role="tablist" style="margin-bottom:16px">${[['nilai', 'Nilai'], ['absensi', 'Absensi']].map(t => `<button class="tab ${u.tab === t[0] ? 'on' : ''}" role="tab" aria-selected="${u.tab === t[0]}" data-act="anakTab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="card-x pad0">${u.tab === 'nilai' ? (nl.length ? `<div class="tbl-w"><table class="tbl"><thead><tr><th>Mata pelajaran</th><th class="num">TP-1</th><th class="num">TP-2</th><th class="num">TP-3</th><th class="num">STS</th><th class="num">Nilai akhir</th></tr></thead><tbody>${nl.map(n => `<tr><td><b>${esc(n.Mapel)}</b><div class="xs muted">${esc(String(n.Semester).replace('-', ' · '))}</div></td><td class="num tnum">${n.TP1}</td><td class="num tnum">${n.TP2}</td><td class="num tnum">${n.TP3}</td><td class="num tnum">${n.STS}</td><td class="num"><span class="akhir ${Number(n.Akhir) < kkm ? 'low' : ''}">${n.Akhir}</span></td></tr>`).join('')}</tbody></table></div>` : emptyBox('journal', 'Belum ada nilai', 'Nilai akan tampil setelah diterbitkan wali kelas.')) :
      `<div style="padding:18px"><div class="stats" style="grid-template-columns:repeat(4,1fr);margin-bottom:12px">${['Hadir', 'Izin', 'Sakit', 'Alpa'].map((x, i) => statCard(x, `<span class="tnum">${m[[0, 2, 1, 3][i]]}</span>`, MONF[+bln.slice(5) - 1], 'dot', 'mint').replace(/<span class="icon-c[^>]*>.*?<\/span>/, bdg(x, null, 1))).join('')}</div><h4 style="margin-bottom:10px">Riwayat terbaru</h4>${sd.r.length ? sd.r.slice().reverse().slice(0, 20).map(r => `<div class="row-gap" style="padding:9px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><span class="small" style="width:110px">${hariD(r[0])}, ${fmtD(r[0])}</span>${bdg(ST_CODE[r[1]], null, 1)}<span class="small muted grow">${esc(r[2])}</span></div>`).join('') : emptyBox('calendar-x', 'Belum ada riwayat', 'Catatan kehadiran akan tampil di sini.')}</div>`}</div>
    <p class="small muted center" style="margin-top:18px">${ic('shield-lock')} Anda hanya dapat melihat data yang menjadi hak Anda.</p>`;
  }
};
ACT.anakPilih = el => { S.ui.anak.id = el.dataset.id; refreshView(true); }; ACT.anakTab = el => { S.ui.anak.tab = el.dataset.t; refreshView(true); };

const IKON = [['book', 'Buku'], ['heart', 'Hati'], ['palette', 'Seni'], ['trophy', 'Piala'], ['stars', 'Bintang'], ['globe2', 'Dunia'], ['music-note-beamed', 'Musik'], ['laptop', 'Komputer'], ['tree', 'Pohon'], ['people', 'Komunitas']];
VIEWS.pengaturan = {
  panel: true, role: ['admin'], deps: ['profil'],
  render() {
    const u = S.ui.set = S.ui.set || { tab: 'profil' };
    return `<div class="page-h"><div><h1>Pengaturan</h1><p class="sub">Profil sekolah, akademik, PPDB, tampilan beranda, impor data, dan sistem.</p></div></div>
    <div class="tabs" role="tablist" style="margin-bottom:18px">${[['profil', 'Profil Sekolah'], ['akademik', 'Akademik'], ['ppdb', 'PPDB'], ['beranda', 'Beranda'], ['impor', 'Impor Data'], ['lisensi', 'Lisensi & Penyimpanan'], ['sistem', 'Sistem']].map(t => `<button class="tab ${u.tab === t[0] ? 'on' : ''}" role="tab" aria-selected="${u.tab === t[0]}" data-act="setTab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="setBody"></div>`;
  },
  after() { drawSet(); }
};
ACT.setTab = el => { S.ui.set.tab = el.dataset.t; $$('.tabs .tab').forEach(t => { t.classList.toggle('on', t === el); t.setAttribute('aria-selected', t === el); }); drawSet(); };
const P = () => prof();
function drawSet() {
  const t = S.ui.set.tab; const b = $('#setBody'); if (!b) return;
  if (t === 'lisensi') { drawLisensiTab(b); return; } const p = P(); let kun = []; try { kun = JSON.parse(p.keunggulan || '[]'); } catch (e) {   }
  const save = '<div class="sticky-bar"><span class="muted xs">Perubahan tampil di situs publik setelah disimpan.</span><button class="btn btn-pri" type="submit">' + ic('check-lg') + ' Simpan Pengaturan</button></div>';
  if (t === 'profil') b.innerHTML = `<form data-submit="setProfil" novalidate class="card-x"><div class="grid2">${field('namaSekolah', 'Nama sekolah', { req: 1, value: p.namaSekolah, attrs: 'maxlength="100"' })}${field('tagline', 'Slogan', { value: p.tagline, attrs: 'maxlength="100"' })}${field('alamat', 'Alamat', { value: p.alamat, attrs: 'maxlength="200"' })}${field('telepon', 'Telepon', { value: p.telepon })}${field('email', 'Email sekolah', { type: 'email', value: p.email })}${field('whatsapp', 'WhatsApp sekolah', { type: 'tel', value: p.whatsapp, attrs: 'pattern="^(\\+?62|0)8[0-9]{8,12}$"', msg: 'Nomor WhatsApp tidak valid.' })}${field('instagram', 'Tautan Instagram', { type: 'url', value: p.instagram, ph: 'https:\/\/instagram.com/…' })}${field('youtube', 'Tautan YouTube', { type: 'url', value: p.youtube })}${field('facebook', 'Tautan Facebook', { type: 'url', value: p.facebook })}</div><div class="grid2">${dz('logo', 'Logo sekolah (opsional)', { opt: 1, imageOnly: 1, maxDim: 400 })}${dz('heroFoto', 'Foto utama beranda (opsional)', { opt: 1, imageOnly: 1, maxDim: 1400 })}</div><div class="note">${ic('info-circle')}<span class="small">Logo dan foto utama ditampilkan di situs publik — pastikan tidak memuat wajah anak tanpa persetujuan orang tua.</span></div>${save}</form>`;
  else if (t === 'akademik') b.innerHTML = `<form data-submit="setAkademik" novalidate class="card-x"><div class="grid2">${field('tahunAjaran', 'Tahun ajaran', { req: 1, value: p.tahunAjaran, attrs: 'pattern="\\d{4}/\\d{4}"', ph: '2026/2027', msg: 'Format: 2026/2027' })}${field('semester', 'Semester aktif', { type: 'select', options: ['Ganjil', 'Genap'], value: p.semester })}${field('kkm', 'KKM (0–100)', { req: 1, type: 'number', value: p.kkm, attrs: 'min="0" max="100"' })}${field('sppNominal', 'Nominal SPP per bulan (Rp)', { req: 1, type: 'number', value: p.sppNominal, attrs: 'min="0" step="1000"' })}</div>${field('mapel', 'Daftar mata pelajaran (satu per baris)', { type: 'textarea', rows: 8, value: mapelList().join('\n'), help: 'Dipakai guru pada Buku Nilai.' })}<div class="note warn">${ic('exclamation-triangle')}<span class="small">Mengganti tahun ajaran/semester memulai buku nilai baru untuk periode tersebut. Nilai periode lama tetap tersimpan.</span></div>${save}</form>`;
  else if (t === 'ppdb') b.innerHTML = `<form data-submit="setPpdb" novalidate class="card-x"><div class="grid2">${field('ppdbBiaya', 'Biaya pendaftaran (Rp)', { type: 'number', value: p.ppdbBiaya, attrs: 'min="0" step="1000"' })}${field('ppdbBank', 'Nama bank', { value: p.ppdbBank })}${field('ppdbRekening', 'Nomor rekening', { value: p.ppdbRekening, attrs: 'inputmode="numeric"' })}${field('ppdbAtasNama', 'Atas nama', { value: p.ppdbAtasNama })}</div>${dz('ppdbQris', 'Gambar QRIS pembayaran (opsional)', { opt: 1, imageOnly: 1, maxDim: 700 })}<div class="row-gap" style="margin-top:6px"><button type="button" class="btn btn-soft" data-act="ppdbSetup">${ic('calendar2-week')} Atur gelombang, jadwal & FAQ</button></div>${save}</form>`;
  else if (t === 'beranda') b.innerHTML = `<form data-submit="setBeranda" novalidate class="card-x">${field('heroJudul', 'Judul utama beranda', { req: 1, value: p.heroJudul, attrs: 'maxlength="140"', help: 'Beri tanda *kata* untuk menampilkannya berwarna koral.' })}${field('heroSub', 'Subjudul', { type: 'textarea', rows: 3, value: p.heroSub, attrs: 'maxlength="300"' })}<h4 style="margin:10px 0 12px">Keunggulan (maks. 4 ditampilkan rapi)</h4>${[0, 1, 2, 3].map(i => { const k = kun[i] || {}; return `<div class="card-x flat" style="margin-bottom:10px;padding:14px"><div class="grid3" style="grid-template-columns:1fr 2fr 1fr">${field('k' + i + 'i', 'Ikon', { type: 'select', options: IKON, value: k.ikon || IKON[i][0] })}${field('k' + i + 'j', 'Judul', { value: k.judul, attrs: 'maxlength="60"' })}${field('k' + i + 'w', 'Warna', { type: 'select', options: [['mint', 'Mint'], ['coral', 'Koral'], ['yellow', 'Kuning'], ['blue', 'Biru']], value: k.warna || ['mint', 'coral', 'yellow', 'blue'][i] })}</div>${field('k' + i + 's', 'Deskripsi singkat', { value: k.isi, attrs: 'maxlength="200"' })}</div>`; }).join('')}${save}</form>`;
  else if (t === 'impor') b.innerHTML = `<div class="card-x"><h3 style="margin-bottom:6px">${ic('file-earmark-spreadsheet')} Impor Data Siswa dari CSV</h3><p class="muted small" style="margin-bottom:14px">Pindahkan data lama dari Excel: simpan sebagai <b>CSV</b>, lalu unggah. Kolom: <span class="mono">NIS, Nama, JK, Kelas, TempatLahir, TglLahir (YYYY-MM-DD), Alamat, NamaOrtu, EmailOrtu, WA</span>.</p>
    <div class="row-gap" style="margin-bottom:14px"><label class="btn btn-soft" style="cursor:pointer">${ic('upload')} Pilih berkas CSV<input type="file" id="csvIn" accept=".csv,text/csv,text/plain" hidden></label><button class="btn btn-ghost" data-act="csvTpl">${ic('download')} Unduh template</button></div><div id="csvPrev"></div></div>`;
  else b.innerHTML = `${themeCard()}
    ${p.demo === '1' ? `<div class="card-x" style="border-color:var(--yel)"><h3 style="margin-bottom:6px">${ic('eraser')} Data Contoh Aktif</h3><p class="muted small" style="margin-bottom:12px">Aplikasi berisi data contoh (siswa, guru, nilai, dsb. berawalan "d-") dan akun contoh @example.com. Hapus sebelum dipakai sungguhan. Data asli yang Anda tambahkan tidak ikut terhapus.</p><button class="btn btn-danger" data-act="clearDemo">${ic('trash3')} Hapus Data Contoh</button></div>` : ''}`;
  if (t === 'impor') { const i = $('#csvIn'); if (i) i.addEventListener('change', csvLoad); }
  if (t === 'sistem') BIND.execUrl(null);
}
BIND.execUrl = t => { const u = ((t || $('#execUrl') || {}).value || '').trim(); const c = $('#execCode'); if (!c) return; c.value = u && /^https:\/\/script\.google\.com\/.+\/exec/.test(u) ? `<iframe src="${u}" style="width:100%;height:100dvh;min-height:720px;border:0" allow="clipboard-write" loading="lazy" title="Aplikasi Sekolah"></iframe>` : '\/\/ Tempel URL /exec di atas untuk membuat kode iframe'; };
ACT.copyIframe = () => { const v = ($('#execCode') || {}).value || ''; if (v.indexOf('<iframe') < 0) { toast('Isi URL /exec terlebih dahulu.', 'warn'); return; } copyText(v); };
async function saveProfil(map, files, btn) {
  busy(btn, true, 'Menyimpan…'); const r = await api('profilSave', { map, files }); busy(btn, false);
  if (!r.success) { toast(r.message, 'err'); return false; } Object.assign(S.db.profil || (S.db.profil = {}), r.data); S.ix = {}; clearFiles('logo', 'heroFoto', 'ppdbQris'); toast(r.message, 'ok'); S.ver.profil = ''; await resync(); refreshPubSoon(['profil'], true); chromePanel(); return true;
}
SUBMIT.setProfil = f => { if (!validate(f)) return; const d = formData(f); const map = {}; ['namaSekolah', 'tagline', 'alamat', 'telepon', 'email', 'whatsapp', 'instagram', 'youtube', 'facebook'].forEach(k => { map[k] = d[k]; }); saveProfil(map, { logo: fileOf('logo'), heroFoto: fileOf('heroFoto') }, $('button[type=submit]', f)); };
SUBMIT.setAkademik = f => { if (!validate(f)) return; const d = formData(f); saveProfil({ tahunAjaran: d.tahunAjaran, semester: d.semester, kkm: d.kkm, sppNominal: d.sppNominal, mapel: d.mapel.split('\n').map(x => x.trim()).filter(Boolean) }, {}, $('button[type=submit]', f)); };
SUBMIT.setPpdb = f => { if (!validate(f)) return; const d = formData(f); saveProfil({ ppdbBiaya: d.ppdbBiaya, ppdbBank: d.ppdbBank, ppdbRekening: d.ppdbRekening, ppdbAtasNama: d.ppdbAtasNama }, { ppdbQris: fileOf('ppdbQris') }, $('button[type=submit]', f)); };
SUBMIT.setBeranda = f => { if (!validate(f)) return; const d = formData(f); const kun = [0, 1, 2, 3].map(i => ({ ikon: d['k' + i + 'i'], judul: d['k' + i + 'j'], isi: d['k' + i + 's'], warna: d['k' + i + 'w'] })).filter(k => k.judul); saveProfil({ heroJudul: d.heroJudul, heroSub: d.heroSub, keunggulan: kun }, {}, $('button[type=submit]', f)); };
ACT.clearDemo = async el => { if (!await confirmBox({ title: 'Hapus data contoh?', text: 'Semua data contoh dan akun @example.com dihapus. Data asli tetap aman.', ok: 'Ya, hapus' })) return; busy(el, true, 'Menghapus…'); const r = await api('clearDemo', {}); busy(el, false); if (!r.success) { toast(r.message, 'err'); return; } toast(r.message, 'ok'); S.ver = {}; await resync(); refreshView(true); };

function parseCSV(text) {
  const first = (text.split(/\r?\n/)[0] || ''); const del = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ','; const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) { const c = text[i]; if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; } else if (c === '"') q = true; else if (c === del) { row.push(cur); cur = ''; } else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (c !== '\r') cur += c; }
  if (cur || row.length) { row.push(cur); rows.push(row); } return rows.filter(r => r.some(x => x.trim()));
}
let _csvRows = [];
function csvLoad(e) {
  const f = e.target.files[0]; if (!f) return; if (f.size > 2 * 1024 * 1024) { toast('Berkas CSV terlalu besar (maks. 2 MB).', 'err'); return; }
  const rd = new FileReader(); rd.onload = () => {
    const rows = parseCSV(String(rd.result).replace(/^\ufeff/, '')); if (rows.length < 2) { toast('CSV kosong atau tidak berisi data.', 'err'); return; }
    const key = h => String(h).toLowerCase().replace(/[^a-z]/g, ''); const map = { nis: 'NIS', nama: 'Nama', jk: 'JK', jeniskelamin: 'JK', kelas: 'Kelas', tempatlahir: 'TempatLahir', tgllahir: 'TglLahir', tanggallahir: 'TglLahir', alamat: 'Alamat', namaortu: 'NamaOrtu', orangtua: 'NamaOrtu', emailortu: 'EmailOrtu', wa: 'WA', whatsapp: 'WA' };
    const hd = rows[0].map(h => map[key(h)] || ''); if (hd.indexOf('NIS') < 0 || hd.indexOf('Nama') < 0) { toast('Kolom NIS dan Nama wajib ada pada baris pertama.', 'err'); return; }
    _csvRows = rows.slice(1).map(r => { const o = {}; hd.forEach((k, i) => { if (k) o[k] = (r[i] || '').trim(); }); return o; }).filter(o => o.NIS || o.Nama);
    const kl = D('kelas'); const nis = {}; D('siswa').forEach(s => { nis[s.NIS] = 1; });
    const chk = _csvRows.map(o => { if (!o.NIS || !o.Nama) return 'NIS/Nama kosong'; if (nis[o.NIS]) return 'NIS sudah ada'; if (!kl.some(k => k.ID === o.Kelas || String(k.Nama).toLowerCase() === String(o.Kelas || '').toLowerCase())) return 'Kelas tidak dikenal'; return ''; });
    const okN = chk.filter(x => !x).length;
    $('#csvPrev').innerHTML = `<div class="note ${okN === _csvRows.length ? '' : 'warn'}" style="margin-bottom:12px">${ic('clipboard-data')}<span><b>${_csvRows.length} baris dibaca</b> · ${okN} siap diimpor · ${_csvRows.length - okN} akan dilewati</span></div><div class="tbl-w" style="max-height:340px;overflow:auto"><table class="tbl"><thead><tr><th>#</th><th>NIS</th><th>Nama</th><th>Kelas</th><th>Keterangan</th></tr></thead><tbody>${_csvRows.slice(0, 40).map((o, i) => `<tr><td>${i + 1}</td><td>${esc(o.NIS)}</td><td>${esc(o.Nama)}</td><td>${esc(o.Kelas || '')}</td><td>${chk[i] ? bdg(chk[i], 'r') : bdg('Siap', 'g')}</td></tr>`).join('')}</tbody></table></div><div class="row-gap" style="margin-top:14px"><button class="btn btn-pri" data-act="csvGo" ${okN ? '' : 'disabled'}>${ic('cloud-arrow-up')} Impor ${okN} siswa</button></div>`;
  }; rd.readAsText(f);
}
ACT.csvTpl = () => downloadCSV('template-impor-siswa.csv', [['NIS', 'Nama', 'JK', 'Kelas', 'TempatLahir', 'TglLahir', 'Alamat', 'NamaOrtu', 'EmailOrtu', 'WA'], ['2026101', 'Contoh Siswa', 'Perempuan', '1A', 'Bandung', '2019-05-20', 'Jl. Melati 1', 'Bapak Contoh', 'ortu@gmail.com', '081234567890']]);
ACT.csvGo = async el => { busy(el, true, 'Mengimpor…'); let added = 0; const skip = []; for (let i = 0; i < _csvRows.length; i += 200) { const r = await api('siswaImport', { rows: _csvRows.slice(i, i + 200) }); if (!r.success) { toast(r.message, 'err'); break; } added += r.data.added; skip.push(...r.data.skipped); } busy(el, false); toast(`${added} siswa diimpor${skip.length ? ', ' + skip.length + ' dilewati' : ''}.`, added ? 'ok' : 'warn'); S.ver.siswa = ''; await resync(); $('#csvPrev').innerHTML = `<div class="note">${ic('check-circle')}<span><b>${added} siswa berhasil diimpor.</b> ${skip.length ? skip.length + ' baris dilewati.' : ''}</span></div>${skip.length ? `<ul class="small" style="margin-top:10px">${skip.slice(0, 15).map(s => `<li>Baris ${s.baris}: ${esc(s.nama)} — ${esc(s.alasan)}</li>`).join('')}</ul>` : ''}`; _csvRows = []; };

// ════════════════════════════════════════════════════════
// v2.0 — Lisensi, demo, tema, LMS, responsif (© Arraihan Academy)
// ════════════════════════════════════════════════════════
S.lic = LS.get('lic', null);
const VND = () => (S.lic && S.lic.vendor) || CFG.VENDOR || { nama: 'Arraihan Academy' };
const vwa = (txt) => { const v = VND(); const n = String(v.wa || '').replace(/\D/g, ''); return n ? `https://wa.me/${n}?text=${encodeURIComponent(txt)}` : ''; };

// ── Tema: Terang / Gelap / Otomatis (ikut sistem) ──
const sysDark = () => !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
function themePref() { try { const t = localStorage.getItem('as_theme'); return t === 'light' || t === 'dark' ? t : 'auto'; } catch (e) { return 'auto'; } }
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', t === 'dark' ? '#0B1715' : '#158A73');
}
function themeChanged() {
  const v = VIEWS[S.view]; if (v && v.after && S.view) { killCharts(); try { v.after(S.params || {}); } catch (e) {   } }
  if (S.user) chromePanel(); chromePub();
}
function setThemePref(p) {
  try { if (p === 'auto') localStorage.removeItem('as_theme'); else localStorage.setItem('as_theme', p); } catch (e) {   }
  applyTheme(p === 'auto' ? (sysDark() ? 'dark' : 'light') : p); themeChanged();
  if (S.view === 'pengaturan' && $('#setBody')) drawSet();
}
ACT.themePref = el => setThemePref(el.dataset.p);
try { const mq = window.matchMedia('(prefers-color-scheme: dark)'); const f = () => { if (themePref() === 'auto') { applyTheme(sysDark() ? 'dark' : 'light'); themeChanged(); } }; if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f); } catch (e) {   }
const themeCard = () => { const p = themePref(); return `<div class="card-x" style="margin-bottom:16px"><h3 style="margin-bottom:6px">${ic('palette')} Tampilan</h3><p class="muted small" style="margin-bottom:12px">Pilih mode terang, gelap, atau ikuti pengaturan perangkat Anda.</p><div class="seg" role="radiogroup" aria-label="Mode tampilan">${[['light', 'sun', 'Terang'], ['dark', 'moon-stars', 'Gelap'], ['auto', 'circle-half', 'Otomatis']].map(t => `<button type="button" role="radio" aria-checked="${p === t[0]}" class="${p === t[0] ? 'on' : ''}" data-act="themePref" data-p="${t[0]}">${ic(t[1])} ${t[2]}</button>`).join('')}</div></div>`; };

// ── Lisensi, demo, aktivasi ──
function licBarHtml() {
  const l = S.lic; if (!l) return '';
  if (l.mode === 'demo') return `<div class="licbar demo" role="status"><span>${ic('stopwatch')} <b>Mode Demo</b> — sisa <b>${l.sisa} hari</b> (berakhir ${fmtD(l.exp)}). Data contoh hanya untuk uji coba.</span><button class="btn sm btn-white" data-go="aktivasi">${ic('key')} Aktivasi lisensi</button></div>`;
  if (l.mode === 'aktif' && l.sisa !== null && l.sisa !== undefined && l.sisa <= 14) return `<div class="licbar warn" role="status"><span>${ic('exclamation-triangle')} Lisensi berakhir dalam <b>${l.sisa} hari</b> (${fmtD(l.exp)}). Hubungi ${esc(VND().nama)} untuk perpanjangan.</span><button class="btn sm btn-white" data-go="aktivasi">${ic('key')} Masukkan kunci</button></div>`;
  return '';
}
function drawLicBars() { const a = $('#licBarApp'), p = $('#licBarPub'); const h = licBarHtml(); if (a) a.innerHTML = h; if (p) p.innerHTML = h; }
function setLic(l) {
  if (!l) return; const was = !!(S.lic && S.lic.locked); S.lic = l; LS.set('lic', l); drawLicBars();
  if (l.locked && !was && S.view !== 'aktivasi') go('aktivasi', {}, { noHist: true });
}
function licenseLocked() {
  setLic(Object.assign({}, S.lic || {}, { locked: true, mode: 'habis' }));
  rpc('lisensiStatus').then(r => { if (r && r.success) { S.lic = r.data; LS.set('lic', r.data); if (S.view === 'aktivasi') refreshView(true); } }).catch(() => {   });
}
const _chromePanel = chromePanel;
chromePanel = function () {
  _chromePanel(); drawLicBars();
  const sf = $('#side .side-f'); if (sf && !$('.vcr', sf)) sf.insertAdjacentHTML('beforeend', `<div class="vcr">${ic('patch-check')} Berlisensi <b>${esc(VND().nama)}</b></div>`);
};
const _chromePub = chromePub;
chromePub = function () {
  _chromePub(); drawLicBars();
  const cp = $('#pubFoot .cp'); if (cp && !$('.vcr-f', cp)) cp.insertAdjacentHTML('beforeend', `<span class="vcr-f">Aplikasi berlisensi ${esc(VND().nama)}</span>`);
};
const _navBadge = navBadge;
navBadge = function (k) { if (k === 'lms' && isStaffU()) { const n = LMD().kumpul.filter(x => x.Status === 'Dikumpulkan').length; return n || ''; } return _navBadge(k); };

const _loginRender = VIEWS.login.render;
VIEWS.login.render = function (p) {
  const h = _loginRender.call(this, p); const l = S.lic; let extra = '';
  if (l && l.demo) extra += `<div class="card-x demo-card"><h3>${ic('play-circle')} Coba dengan akun demo <small>(sisa ${l.sisa} hari)</small></h3><p class="small muted" style="margin:4px 0 12px">Pilih peran untuk mengisi email dan kode otomatis. Kode demo: <b class="mono">${esc(l.demo.kode)}</b></p><div class="chips">${l.demo.akun.map(a => `<button type="button" class="chip" data-act="demoFill" data-e="${esc(a.email)}" data-k="${esc(l.demo.kode)}">${esc(a.label)}</button>`).join('')}</div></div>`;
  extra += `<p class="small muted center vcr-l">${ic('patch-check')} Aplikasi berlisensi <b>${esc(VND().nama)}</b> · <button type="button" class="linkbtn" data-go="aktivasi">Aktivasi lisensi</button></p>`;
  return h.replace(/<\/div>\s*$/, extra + '</div>');
};
ACT.demoFill = el => { const e = $('#f-email'), k = $('#f-kode'); if (e) e.value = el.dataset.e; if (k) { k.value = el.dataset.k; k.type = 'text'; } const b = $('#loginErr'); if (b) b.hidden = true; const sb = $('button[type=submit]', e ? e.form : document); if (sb) sb.focus(); };

const EULA = ['Pemberi lisensi adalah <b>Arraihan Academy</b>. Aplikasi ini adalah perangkat lunak berlisensi, bukan perangkat lunak yang dijual putus.',
  'Lisensi bersifat terbatas, tidak eksklusif, dan tidak dapat dipindahtangankan, untuk <b>satu instalasi</b> (sesuai ID Instalasi) dan <b>satu lembaga</b> pengguna.',
  'Masa demo berlaku <b>7 hari</b> sejak instalasi. Setelah itu aplikasi terkunci sampai kunci lisensi yang sah dimasukkan.',
  'Dilarang menggandakan, menjual, menyewakan, atau mengedarkan aplikasi; menghapus atau mengubah identitas Arraihan Academy; serta merekayasa balik atau menghindari mekanisme demo dan lisensi.',
  'Data (siswa, nilai, keuangan, berkas) adalah milik lembaga pengguna. Pengguna bertanggung jawab menjaga kerahasiaan akun, kode akses, dan mencadangkan data.',
  'Aplikasi disediakan apa adanya. Tanggung jawab Arraihan Academy terbatas pada nilai lisensi yang dibayarkan. Pelanggaran dapat mengakibatkan pencabutan lisensi.',
  'Naskah lengkap tersedia pada berkas LICENSE.txt di paket aplikasi.'];
ACT.eula = () => openModal({ title: 'Ringkasan Lisensi Penggunaan', size: 'md', body: `<ol class="eula">${EULA.map(x => `<li>${x}</li>`).join('')}</ol><p class="small muted">${esc(VND().hak || '© Arraihan Academy')}</p>` });
ACT.copyId = el => copyText(el.dataset.v);

function licStatusCard(l) {
  const map = { demo: ['stopwatch', 'a', 'Mode Demo'], aktif: ['patch-check-fill', 'g', 'Lisensi Aktif'], habis: ['lock-fill', 'r', 'Terkunci'] }; const m = map[l.mode] || map.habis;
  const rows = [['ID Instalasi', `<span class="mono">${esc(l.id || '-')}</span> <button type="button" class="ibtn" style="width:30px;height:30px" data-act="copyId" data-v="${esc(l.id || '')}" aria-label="Salin ID">${ic('copy')}</button>`]];
  if (l.mode === 'aktif') { rows.push(['Dilisensikan kepada', esc(l.nama || '-')], ['Paket', esc(l.paket || '-')], ['Berlaku sampai', l.exp === 'SELAMANYA' ? 'Selamanya' : `${fmtD(l.exp)} (${l.sisa} hari lagi)`]); }
  else if (l.mode === 'demo') rows.push(['Masa demo', `${l.demoDays || 7} hari · sisa <b>${l.sisa} hari</b> (sampai ${fmtD(l.exp)})`]);
  else if (l.catatan) rows.push(['Keterangan', esc(l.catatan)]);
  rows.push(['Pemberi lisensi', esc(VND().nama)]);
  return `<div class="card-x lic-card"><div class="row-gap" style="margin-bottom:12px"><span class="icon-c ${l.mode === 'aktif' ? 'mint' : (l.mode === 'demo' ? 'yellow' : 'coral')}">${ic(m[0])}</span><div><h3>${m[2]}</h3><div class="small muted">Status lisensi aplikasi</div></div></div><dl class="kv">${rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl></div>`;
}
function licKeyForm(l, cls) {
  const wa = vwa(`Halo ${VND().nama}, saya ingin aktivasi lisensi Aplikasi Sekolah.\nID Instalasi: ${l.id}\nNama sekolah: ${pubP().namaSekolah || ''}`);
  return `<div class="card-x ${cls || ''}"><h3 style="margin-bottom:6px">${ic('key')} Masukkan Kunci Lisensi</h3>
    <ol class="steps-l small"><li>Salin <b>ID Instalasi</b> di atas.</li><li>Kirim ke ${esc(VND().nama)} untuk mendapatkan <b>kunci lisensi</b> ${wa ? `(<a href="${esc(wa)}" target="_blank" rel="noopener">hubungi lewat WhatsApp</a>)` : ''}.</li><li>Tempel kunci (diawali <span class="mono">AA1.</span>) pada kotak di bawah, lalu klik Aktifkan.</li></ol>
    <form data-submit="aktivasi" novalidate><div class="fld"><label for="f-key">Kunci lisensi <span class="req">*</span></label><textarea class="inp mono" id="f-key" name="key" rows="4" required spellcheck="false" autocomplete="off" placeholder="AA1.eyJ2Ijox…" data-msg="Tempel kunci lisensi Anda."></textarea><div class="fld-msg">Tempel kunci lisensi Anda.</div></div>
    <div id="licErr" class="note bad" hidden role="alert" style="margin-bottom:12px"></div><div class="row-gap"><button class="btn btn-pri" type="submit">${ic('shield-check')} Aktifkan</button><button type="button" class="btn btn-ghost" data-act="eula">${ic('file-text')} Ketentuan lisensi</button></div></form></div>`;
}
SUBMIT.aktivasi = async f => {
  if (!validate(f)) return; const b = $('button[type=submit]', f); busy(b, true, 'Memeriksa kunci…'); const er = $('#licErr', f); if (er) er.hidden = true;
  let r; try { r = await rpc('lisensiAktivasi', f.elements.key.value); } catch (e) { r = { success: false, message: e.message }; }
  busy(b, false);
  if (r && r.success) { S.lic = r.data; LS.set('lic', r.data); drawLicBars(); toast(r.message, 'ok'); if (S.user && S.view !== 'aktivasi') { if (S.view === 'pengaturan') drawSet(); } else go('login', {}, { noHist: true }); refreshPub(); }
  else if (er) { er.hidden = false; er.innerHTML = `${ic('exclamation-triangle')}<span>${esc((r && r.message) || 'Gagal mengaktifkan.')}</span>`; }
};
VIEWS.aktivasi = {
  render() {
    const l = S.lic || { mode: 'habis', id: '-', catatan: 'Memuat status…' };
    return `<div class="wrap" style="padding:30px 20px 64px;max-width:820px"><button class="btn btn-ghost sm" data-go="home" style="margin-left:-12px">${ic('arrow-left')} Kembali ke Beranda</button>
      <h1 style="margin:10px 0 6px;font-size:30px">Aktivasi Lisensi</h1><p class="muted" style="margin-bottom:20px">${l.locked ? `<b>Aplikasi terkunci.</b> ${esc(l.catatan || '')} Masukkan kunci lisensi untuk membuka kembali seluruh fitur. Data Anda tetap aman.` : 'Kelola dan perpanjang lisensi aplikasi sekolah Anda.'}</p>
      <div class="grid2" style="gap:18px;align-items:start">${licStatusCard(l)}${licKeyForm(l)}</div>
      <p class="small muted center" style="margin-top:22px">${ic('patch-check')} ${esc(VND().hak || '© Arraihan Academy')}</p></div>`;
  },
  after() { if (!S.lic || S.lic.id === undefined) rpc('lisensiStatus').then(r => { if (r && r.success) { S.lic = r.data; refreshView(true); } }).catch(() => {   }); }
};

async function drawLisensiTab(b) {
  b.innerHTML = '<div class="card-x center" style="padding:40px"><span class="spin"></span></div>';
  const r = await api('lisensiInfo', {});
  if (!$('#setBody') || S.ui.set.tab !== 'lisensi') return;
  if (!r.success) { b.innerHTML = `<div class="note bad">${ic('exclamation-triangle')}<span>${esc(r.message)}</span></div>`; return; }
  const d = r.data, l = d.lic, st = d.storage || {}; S.lic = l; LS.set('lic', l); drawLicBars();
  const okb = (v, t) => `<span class="bdg ${v ? 'g' : 'r'}">${ic(v ? 'check-lg' : 'x-lg')} ${t}</span>`;
  b.innerHTML = `<div class="grid2" style="gap:16px;align-items:start;margin-bottom:16px">${licStatusCard(l)}${licKeyForm(l)}</div>
  ${l.mode === 'demo' || d.demoAkunAktif ? `<div class="card-x" style="margin-bottom:16px;border-color:var(--yel)"><h3 style="margin-bottom:6px">${ic('stopwatch')} Akun & Data Demo</h3><p class="muted small" style="margin-bottom:12px">${d.demoAkunAktif} akun demo masih aktif (kode seragam, diketahui publik selama masa demo). <b>Nonaktifkan akun demo dan hapus data contoh sebelum memasukkan data asli sekolah.</b></p><div class="row-gap"><button class="btn btn-soft" data-act="demoOff">${ic('person-x')} Nonaktifkan akun demo</button><button class="btn btn-ghost" data-act="clearDemo">${ic('eraser')} Hapus data contoh</button></div></div>` : ''}
  <div class="card-x" style="margin-bottom:16px"><h3 style="margin-bottom:6px">${ic('folder2-open')} Penyimpanan Satu Folder</h3><p class="muted small" style="margin-bottom:12px">Database, berkas unggahan, cadangan, dan skrip aplikasi disimpan dalam satu folder Google Drive.</p>
    ${st.galat ? `<div class="note bad">${ic('exclamation-triangle')}<span>${esc(st.galat)}</span></div>` : `<div class="row-gap" style="margin-bottom:12px">${okb(st.dbDiFolder, 'Database')}${okb(st.skripDiFolder, 'Skrip aplikasi')}${Object.keys(st.subfolder || {}).map(n => okb(st.subfolder[n], esc(n))).join('')}</div>
    <div class="row-gap">${st.folderUrl ? `<a class="btn btn-soft sm" href="${esc(st.folderUrl)}" target="_blank" rel="noopener">${ic('folder2-open')} Buka folder</a>` : ''}${st.dbUrl ? `<a class="btn btn-soft sm" href="${esc(st.dbUrl)}" target="_blank" rel="noopener">${ic('table')} Buka database</a>` : ''}<button class="btn btn-ghost sm" data-act="rapikan">${ic('wrench-adjustable')} Rapikan penyimpanan</button></div>
    ${st.skripDiFolder ? '' : `<p class="small muted" style="margin-top:10px">Skrip belum berada di folder. Klik <b>Rapikan</b>; bila tetap gagal, pindahkan proyek skrip secara manual lewat drive.google.com.</p>`}`}</div>
  <div class="card-x" style="margin-bottom:16px"><h3 style="margin-bottom:6px">${ic('cloud-arrow-down')} Cadangan Database</h3><p class="muted small" style="margin-bottom:12px">Cadangan otomatis tiap Minggu dini hari (disimpan ${8} terakhir) di subfolder Cadangan.</p><button class="btn btn-soft sm" data-act="cadang">${ic('plus-lg')} Cadangkan sekarang</button>
    ${(st.cadangan || []).length ? `<ul class="clean" style="margin-top:12px">${st.cadangan.map(c => `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.nama)}</a> <span class="xs muted">· ${esc(c.tgl)}</span></li>`).join('')}</ul>` : ''}</div>
  ${(d.riwayat || []).length ? `<div class="card-x"><h3 style="margin-bottom:10px">${ic('clock-history')} Riwayat Lisensi</h3><div class="tbl-w"><table class="tbl keep"><thead><tr><th>Waktu</th><th>Nama</th><th>Paket</th><th>Berlaku</th></tr></thead><tbody>${d.riwayat.map(x => `<tr><td>${esc(x.Waktu)}</td><td>${esc(x.Nama)}</td><td>${esc(x.Paket)}</td><td>${esc(x.Berlaku)}</td></tr>`).join('')}</tbody></table></div></div>` : ''}`;
}
ACT.demoOff = async el => { if (!await confirmBox({ title: 'Nonaktifkan akun demo?', text: 'Semua akun demo tidak bisa masuk lagi. Akun admin dan akun asli sekolah tidak terpengaruh.', ok: 'Nonaktifkan' })) return; busy(el, true, 'Memproses…'); const r = await api('demoMatikan', {}); busy(el, false); toast(r.message, r.success ? 'ok' : 'err'); S.ver.pengguna = ''; drawLisensiTab($('#setBody')); };
ACT.rapikan = async el => { busy(el, true, 'Merapikan…'); const r = await api('penyimpananRapikan', {}); busy(el, false); toast(r.message, r.success ? 'ok' : 'err'); drawLisensiTab($('#setBody')); };
ACT.cadang = async el => { busy(el, true, 'Mencadangkan…'); const r = await api('cadanganSekarang', {}); busy(el, false); toast(r.message, r.success ? 'ok' : 'err'); drawLisensiTab($('#setBody')); };

// ── Tabel responsif: di layar sempit baris tabel menjadi kartu ──
function enhanceTables() {
  $$('table.tbl:not(.keep)').forEach(t => {
    const hs = $$('thead th', t).map(h => h.textContent.trim());
    if (!hs.length) return; t.classList.add('rsp');
    $$('tbody tr', t).forEach(tr => { Array.prototype.forEach.call(tr.children, (td, i) => { if (hs[i] && td.getAttribute('data-l') !== hs[i]) td.setAttribute('data-l', hs[i]); }); });
  });
}
try { const mo = new MutationObserver(debounce(enhanceTables, 50)); mo.observe(document.body, { childList: true, subtree: true }); } catch (e) {   }

// ════════════════════════════════════════════════════════
// LMS — Kelas Belajar
// ════════════════════════════════════════════════════════
const LMD = () => Object.assign({ kursus: [], materi: [], tugas: [], kumpul: [], peserta: [], kelas: [] }, D('lms'));
const isStaffU = () => !!S.user && (S.user.role === 'admin' || S.user.role === 'guru');
const ownKursus = k => !!S.user && (S.user.role === 'admin' || (S.user.role === 'guru' && String(k.GuruEmail).toLowerCase() === S.user.email));
const lmsSid = () => { const kids = D('siswa'); if (!kids.length) return ''; const u = S.ui.lms = S.ui.lms || { q: '', st: '' }; if (!kids.some(k => k.ID === u.sid)) u.sid = kids[0].ID; return u.sid; };
const kumpulOf = (tid, sid) => LMD().kumpul.find(x => x.TugasID === tid && x.SiswaID === sid);
const nowWIB = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
const lewat = t => !!t.Tenggat && nowWIB() > t.Tenggat;
const fmtTenggat = t => t ? `${fmtD(t.slice(0, 10))}, ${t.slice(11, 16) || '23:59'} WIB` : 'Tanpa batas waktu';
const WCOL = { mint: ['var(--soft)', 'var(--ink)'], coral: ['var(--r-bg)', 'var(--r-tx)'], yellow: ['var(--a-bg)', 'var(--a-tx)'], blue: ['var(--b-bg)', 'var(--b-tx)'] };
const MIKON = { Teks: 'file-text', Tautan: 'link-45deg', Video: 'play-btn', Berkas: 'paperclip' };
const nl2br = s => esc(s).replace(/\n/g, '<br>');
const kelasLms = id => { const k = LMD().kursus.find(x => x.KelasID === id); return (k && k.KelasNama) || (ix('kelas')[id] || {}).Nama || id || '-'; };
BADGE.Dikumpulkan = 'a'; BADGE.Dinilai = 'g'; BADGE.Arsip = 's'; BADGE.Terbit = 'g'; BADGE.Draf = 's'; BADGE.Ditutup = 'r';

async function lmsReload() {
  try { const r = await rpc('sync', S.token, Object.assign({}, S.ver, { lms: '' })); if (r && r.code === 'LICENSE') { licenseLocked(); return; } if (r && r.success) { S.serverDate = r.data.serverDate; mergeData(r.data.data, r.data.ver); if (r.data.lic) setLic(r.data.lic); } } catch (e) {   }
  S.ix = {}; refreshView(true);
}
async function lmsCall(action, payload, quiet) {
  const r = await api(action, payload);
  if (!r.success) { toast(r.message, 'err'); return null; }
  await lmsReload(); if (!quiet) toast(r.message || 'Tersimpan.', 'ok'); return r;
}
async function lmsPreview(kind, id, title) {
  const h = openModal({ title: title || 'Pratinjau Berkas', size: 'lg', body: '<div class="center" style="padding:40px"><span class="spin"></span><p class="muted" style="margin-top:12px">Memuat berkas…</p></div>' });
  const r = await api('lmsFile', { kind, id }); if (!h.el.isConnected) return; const body = $('.mo-b', h.el);
  if (!r.success) { body.innerHTML = `<div class="note bad">${ic('exclamation-triangle')}<span>${esc(r.message)}</span></div>`; return; }
  const bin = atob(r.data.b64); const arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([arr], { type: r.data.mime })); const old = h.close; h.close = v => { URL.revokeObjectURL(url); old(v); };
  body.innerHTML = (r.data.mime === 'application/pdf' ? `<iframe src="${url}" title="PDF" style="width:100%;height:68dvh;border:1px solid var(--line);border-radius:12px"></iframe>` : `<div class="center"><img src="${url}" alt="${esc(r.data.name)}" style="max-height:70dvh;border-radius:12px"></div>`) + `<div class="center" style="margin-top:12px"><a class="btn btn-soft sm" href="${url}" download="${esc(r.data.name)}">${ic('download')} Unduh</a></div>`;
}
ACT.lmsFile = el => lmsPreview(el.dataset.kind, el.dataset.id, el.dataset.t);

VIEWS.lms = {
  panel: true, role: ['admin', 'guru', 'siswa', 'ortu'], deps: ['lms', 'siswa', 'kelas'],
  render() {
    const L = LMD(), staff = isStaffU(), u = S.ui.lms = S.ui.lms || { q: '', st: '' }; const sid = staff ? '' : lmsSid(); const kid = staff ? null : ix('siswa')[sid];
    const kids = staff ? [] : D('siswa');
    const mine = L.kursus.filter(k => staff || (kid && k.KelasID === kid.KelasID));
    const q = (u.q || '').toLowerCase();
    const ks = mine.filter(k => (!u.st || k.Status === u.st) && (!q || (k.Judul + ' ' + k.Mapel + ' ' + k.GuruNama).toLowerCase().indexOf(q) >= 0));
    let stats;
    if (staff) {
      const ids = mine.map(k => k.ID); const pend = L.kumpul.filter(x => x.Status === 'Dikumpulkan').length;
      stats = [statCard('Kursus', `<span class="tnum">${mine.length}</span>`, `${mine.filter(k => k.Status === 'Aktif').length} aktif`, 'easel2', 'mint'), statCard('Materi', `<span class="tnum">${L.materi.length}</span>`, 'bahan ajar', 'journal-richtext', 'blue'), statCard('Tugas & Kuis', `<span class="tnum">${L.tugas.length}</span>`, 'diberikan', 'clipboard-check', 'yellow'), statCard('Perlu dinilai', `<span class="tnum">${pend}</span>`, pend ? 'menunggu penilaian' : 'semua sudah dinilai', 'hourglass-split', pend ? 'coral' : 'mint')];
    } else {
      const tg = L.tugas.filter(t => mine.some(k => k.ID === t.KursusID) && t.Status === 'Terbit'); const done = tg.filter(t => kumpulOf(t.ID, sid)).length; const nv = L.kumpul.filter(x => x.SiswaID === sid && x.Nilai !== '' && x.Nilai !== null);
      const avg = nv.length ? Math.round(nv.reduce((a, x) => { const t = L.tugas.find(y => y.ID === x.TugasID); return a + (t ? Number(x.Nilai) / t.Poin * 100 : 0); }, 0) / nv.length * 10) / 10 : null;
      stats = [statCard('Kursus saya', `<span class="tnum">${mine.length}</span>`, kid ? 'Kelas ' + esc(kelasLms(kid.KelasID)) : '', 'easel2', 'mint'), statCard('Tugas & kuis', `<span class="tnum">${done}/${tg.length}</span>`, 'sudah dikerjakan', 'clipboard-check', 'blue'), statCard('Belum dikerjakan', `<span class="tnum">${tg.length - done}</span>`, tg.length - done ? 'segera dikerjakan' : 'semua beres', 'alarm', tg.length - done ? 'coral' : 'mint'), statCard('Rata-rata nilai', `<span class="tnum">${avg === null ? '–' : avg}</span>`, 'dari tugas yang dinilai', 'trophy', 'yellow')];
    }
    return `<div class="page-h"><div><h1>Kelas Belajar (LMS)</h1><p class="sub">${staff ? 'Kelola kursus, materi, tugas, dan kuis untuk siswa Anda.' : 'Materi, tugas, dan kuis dari guru.'}</p></div>${staff ? `<button class="btn btn-pri" data-act="kursusAdd">${ic('plus-lg')} Buat Kursus</button>` : ''}</div>
    ${kids.length > 1 ? `<div class="filters">${kids.map(k => `<button class="chip ${k.ID === sid ? 'on' : ''}" data-act="lmsAnak" data-id="${esc(k.ID)}">${esc(k.Nama.split(' ')[0])}</button>`).join('')}</div>` : ''}
    <div class="stats">${stats.join('')}</div>
    <div class="filters"><div class="inp-ic">${ic('search')}<input class="inp" data-bind="lmsQ" value="${esc(u.q)}" placeholder="Cari kursus, mapel, atau guru…" aria-label="Cari kursus"></div>${staff ? `<select class="inp" data-chg="lmsSt" aria-label="Status"><option value="">Semua status</option>${['Aktif', 'Draf', 'Arsip'].map(s => `<option ${u.st === s ? 'selected' : ''}>${s}</option>`).join('')}</select>` : ''}</div>
    <div id="lmsGrid">${lmsGrid(ks, sid, staff, mine.length)}</div>`;
  }
};
function lmsGrid(ks, sid, staff, total) {
  if (!ks.length) return emptyBox('easel2', total ? 'Tidak ada kursus yang cocok' : (staff ? 'Belum ada kursus' : 'Belum ada kursus untuk kelas ini'), staff ? 'Buat kursus pertama Anda, lalu tambahkan materi dan tugas.' : 'Guru akan menampilkan kursus di sini.', staff && !total ? `<button class="btn btn-pri" data-act="kursusAdd">${ic('plus-lg')} Buat Kursus</button>` : '');
  const L = LMD();
  return `<div class="lms-grid">${ks.map(k => {
    const c = WCOL[k.Warna] || WCOL.mint; const mat = L.materi.filter(m => m.KursusID === k.ID).length; const tg = L.tugas.filter(t => t.KursusID === k.ID && t.Status !== 'Draf');
    let foot;
    if (staff) { const pend = L.kumpul.filter(x => x.KursusID === k.ID && x.Status === 'Dikumpulkan').length; foot = `<span class="xs muted">${mat} materi · ${tg.length} tugas/kuis</span>${pend ? bdg(pend + ' perlu dinilai', 'a') : ''}`; }
    else { const done = tg.filter(t => kumpulOf(t.ID, sid)).length; const p = tg.length ? Math.round(done / tg.length * 100) : 0; foot = `<div class="prog" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div><span class="xs muted">${done}/${tg.length} tugas selesai</span>`; }
    return `<button class="card-x hover lms-card" ${goAttr('lms-detail', { id: k.ID })}><span class="lms-band" style="background:${c[0]};color:${c[1]}">${ic('easel2')}<b>${esc(k.Mapel || 'Kursus')}</b>${k.Status !== 'Aktif' ? bdg(k.Status) : ''}</span><span class="lms-t">${esc(k.Judul)}</span><span class="xs muted">${ic('person')} ${esc(k.GuruNama || '-')} · Kelas ${esc(k.KelasNama || kelasLms(k.KelasID))}</span><span class="lms-f">${foot}</span></button>`;
  }).join('')}</div>`;
}
BIND.lmsQ = debounce(t => { S.ui.lms.q = t.value; const L = LMD(), staff = isStaffU(), u = S.ui.lms; const sid = staff ? '' : lmsSid(); const kid = staff ? null : ix('siswa')[sid]; const mine = L.kursus.filter(k => staff || (kid && k.KelasID === kid.KelasID)); const q = (u.q || '').toLowerCase(); $('#lmsGrid').innerHTML = lmsGrid(mine.filter(k => (!u.st || k.Status === u.st) && (!q || (k.Judul + ' ' + k.Mapel + ' ' + k.GuruNama).toLowerCase().indexOf(q) >= 0)), sid, staff, mine.length); }, 180);
BIND.lmsSt = t => { S.ui.lms.st = t.value; refreshView(true); };
ACT.lmsAnak = el => { S.ui.lms.sid = el.dataset.id; refreshView(true); };

VIEWS['lms-detail'] = {
  panel: true, role: ['admin', 'guru', 'siswa', 'ortu'], deps: ['lms', 'siswa', 'kelas'],
  render(p) {
    const L = LMD(), k = L.kursus.find(x => x.ID === p.id), staff = isStaffU();
    if (!k) return `<div class="page-h"><div><h1>Kursus</h1></div></div>${emptyBox('easel2', 'Kursus tidak ditemukan', 'Kursus mungkin sudah dihapus atau belum tersedia untuk Anda.', `<button class="btn btn-pri" ${goAttr('lms')}>Kembali ke daftar</button>`)}`;
    const u = S.ui.lmsd = (S.ui.lmsd && S.ui.lmsd.id === k.ID) ? S.ui.lmsd : { id: k.ID, tab: 'materi' }; const own = ownKursus(k); const c = WCOL[k.Warna] || WCOL.mint;
    const tabs = [['materi', 'Materi'], ['tugas', 'Tugas & Kuis'], ['nilai', staff ? 'Penilaian' : 'Nilai Saya']];
    return `<button class="btn btn-ghost sm" ${goAttr('lms')} style="margin:-6px 0 8px -12px">${ic('arrow-left')} Semua kursus</button>
    <div class="card-x lms-head" style="background:${c[0]}"><div><div class="xs" style="color:${c[1]};font-weight:800;text-transform:uppercase;letter-spacing:.05em">${esc(k.Mapel || 'Kursus')} · Kelas ${esc(k.KelasNama || kelasLms(k.KelasID))} ${k.Status !== 'Aktif' ? bdg(k.Status) : ''}</div><h1 style="margin:4px 0 6px;font-size:26px">${esc(k.Judul)}</h1><p class="small" style="color:var(--tx)">${esc(k.Deskripsi || '')}</p><div class="xs muted" style="margin-top:8px">${ic('person')} ${esc(k.GuruNama || '-')}</div></div>
      ${own ? `<div class="row-gap"><button class="btn btn-soft sm" data-act="kursusEdit" data-id="${esc(k.ID)}">${ic('pencil')} Ubah</button><button class="btn btn-ghost sm danger" data-act="kursusDel" data-id="${esc(k.ID)}">${ic('trash3')} Hapus</button></div>` : ''}</div>
    <div class="tabs" role="tablist" style="margin:16px 0">${tabs.map(t => `<button class="tab ${u.tab === t[0] ? 'on' : ''}" role="tab" aria-selected="${u.tab === t[0]}" data-act="lmsTab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
    ${u.tab === 'materi' ? lmsMateri(k, staff, own) : (u.tab === 'tugas' ? lmsTugas(k, staff, own) : (staff ? lmsNilaiStaff(k) : lmsNilaiSiswa(k)))}`;
  }
};
ACT.lmsTab = el => { S.ui.lmsd.tab = el.dataset.t; refreshView(true); };

function lmsMateri(k, staff, own) {
  const ms = LMD().materi.filter(m => m.KursusID === k.ID);
  const add = own ? `<button class="btn btn-pri sm" data-act="materiAdd" data-k="${esc(k.ID)}">${ic('plus-lg')} Tambah Materi</button>` : '';
  if (!ms.length) return emptyBox('journal-richtext', 'Belum ada materi', own ? 'Tambahkan teks, tautan, video, atau berkas PDF/gambar.' : 'Materi akan tampil di sini setelah guru menambahkannya.', add);
  return `${own ? `<div class="row-gap" style="margin-bottom:12px;justify-content:flex-end">${add}</div>` : ''}<div class="stack">${ms.map(m => `<article class="card-x mat"><div class="mat-h"><span class="icon-c mint">${ic(MIKON[m.Tipe] || 'file-text')}</span><div class="grow"><b>${esc(m.Judul)}</b><div class="xs muted">${esc(m.Tipe)} · ${fmtD(m.Tanggal)} ${m.Terbit === 'Tidak' ? bdg('Draf', 's') : ''}</div></div>${own ? `<button class="ibtn" data-act="materiEdit" data-id="${esc(m.ID)}" aria-label="Ubah materi">${ic('pencil')}</button><button class="ibtn danger" data-act="materiDel" data-id="${esc(m.ID)}" aria-label="Hapus materi">${ic('trash3')}</button>` : ''}</div>
    ${m.Isi ? `<div class="mat-b">${nl2br(m.Isi)}</div>` : ''}<div class="row-gap">${m.Url ? `<a class="btn btn-soft sm" href="${esc(m.Url)}" target="_blank" rel="noopener noreferrer">${ic('box-arrow-up-right')} Buka ${m.Tipe === 'Video' ? 'video' : 'tautan'}</a>` : ''}${m.Berkas ? `<button class="btn btn-soft sm" data-act="lmsFile" data-kind="materi" data-id="${esc(m.ID)}" data-t="${esc(m.Judul)}">${ic('eye')} Lihat berkas</button>` : ''}</div></article>`).join('')}</div>`;
}
function lmsTugas(k, staff, own) {
  const L = LMD(); const ts = L.tugas.filter(t => t.KursusID === k.ID); const sid = staff ? '' : lmsSid();
  const add = own ? `<button class="btn btn-pri sm" data-act="tugasAdd" data-k="${esc(k.ID)}">${ic('plus-lg')} Tambah Tugas / Kuis</button>` : '';
  if (!ts.length) return emptyBox('clipboard-check', 'Belum ada tugas atau kuis', own ? 'Buat tugas uraian atau kuis pilihan ganda yang dinilai otomatis.' : 'Tugas akan tampil di sini setelah dibuat guru.', add);
  const peserta = L.peserta.filter(x => x.KelasID === k.KelasID).length;
  return `${own ? `<div class="row-gap" style="margin-bottom:12px;justify-content:flex-end">${add}</div>` : ''}<div class="stack">${ts.map(t => {
    const ks = L.kumpul.filter(x => x.TugasID === t.ID); let right;
    if (staff) right = `<div class="xs muted">${ks.length}/${peserta} mengumpulkan · ${ks.filter(x => x.Status === 'Dinilai').length} dinilai</div>`;
    else { const x = kumpulOf(t.ID, sid); right = x ? `${bdg(x.Status)} ${x.Status === 'Dinilai' ? `<b class="tnum">${x.Nilai}/${t.Poin}</b>` : ''}` : (t.Status === 'Ditutup' || lewat(t) ? bdg('Terlambat', 'r') : bdg('Belum dikerjakan', 'a')); }
    return `<article class="card-x tg"><div class="tg-h"><span class="icon-c ${t.Tipe === 'Kuis' ? 'yellow' : 'blue'}">${ic(t.Tipe === 'Kuis' ? 'patch-question' : 'clipboard-check')}</span><div class="grow"><b>${esc(t.Judul)}</b> ${bdg(t.Tipe, t.Tipe === 'Kuis' ? 'a' : 'b')} ${staff && t.Status !== 'Terbit' ? bdg(t.Status) : ''}<div class="xs muted">${ic('alarm')} ${esc(fmtTenggat(t.Tenggat))}${t.Tenggat && lewat(t) ? ' · <b style="color:var(--r-tx)">sudah lewat</b>' : ''} · ${t.Poin} poin</div></div><div class="tg-r">${right}</div></div>
      ${t.Instruksi ? `<div class="mat-b">${nl2br(t.Instruksi)}</div>` : ''}<div class="row-gap">${staff ? (own ? `<button class="btn btn-soft sm" data-act="tugasEdit" data-id="${esc(t.ID)}">${ic('pencil')} Ubah</button><button class="btn btn-ghost sm danger" data-act="tugasDel" data-id="${esc(t.ID)}">${ic('trash3')} Hapus</button>` : '') + `<button class="btn btn-soft sm" data-act="lmsTabNilai">${ic('card-checklist')} Penilaian</button>` : tugasBtn(t, sid)}</div></article>`;
  }).join('')}</div>`;
}
function tugasBtn(t, sid) {
  const x = kumpulOf(t.ID, sid);
  if (t.Tipe === 'Kuis') return x ? `<button class="btn btn-soft sm" data-act="lmsLihat" data-id="${esc(t.ID)}">${ic('eye')} Lihat hasil</button>` : (t.Status !== 'Terbit' || lewat(t) ? '' : `<button class="btn btn-pri sm" data-act="lmsKerjakan" data-id="${esc(t.ID)}">${ic('play-fill')} Mulai kuis</button>`);
  if (x && x.Status === 'Dinilai') return `<button class="btn btn-soft sm" data-act="lmsLihat" data-id="${esc(t.ID)}">${ic('eye')} Lihat nilai</button>`;
  if (t.Status !== 'Terbit' || lewat(t)) return x ? `<button class="btn btn-soft sm" data-act="lmsLihat" data-id="${esc(t.ID)}">${ic('eye')} Lihat jawaban</button>` : '';
  return `<button class="btn btn-pri sm" data-act="lmsKerjakan" data-id="${esc(t.ID)}">${ic('send')} ${x ? 'Ubah jawaban' : 'Kerjakan'}</button>`;
}
ACT.lmsTabNilai = () => { S.ui.lmsd.tab = 'nilai'; refreshView(true); };

function lmsNilaiStaff(k) {
  const L = LMD(); const ts = L.tugas.filter(t => t.KursusID === k.ID && t.Status !== 'Draf'); const ps = L.peserta.filter(x => x.KelasID === k.KelasID).sort((a, b) => String(a.Nama).localeCompare(b.Nama));
  if (!ts.length) return emptyBox('card-checklist', 'Belum ada tugas untuk dinilai', 'Buat tugas atau kuis terlebih dahulu.');
  if (!ps.length) return emptyBox('people', 'Belum ada siswa aktif di kelas ini', 'Tambahkan siswa pada menu Data Siswa.');
  const rows = ps.map(s => {
    let sum = 0, n = 0;
    const cells = ts.map(t => { const x = L.kumpul.find(y => y.TugasID === t.ID && y.SiswaID === s.ID); if (!x) return `<td class="num"><span class="muted">–</span></td>`; if (x.Status === 'Dinilai') { sum += Number(x.Nilai) / t.Poin * 100; n++; return `<td class="num"><button class="cellbtn ok" data-act="lmsGrade" data-id="${esc(x.ID)}">${x.Nilai}</button></td>`; } return `<td class="num"><button class="cellbtn wait" data-act="lmsGrade" data-id="${esc(x.ID)}" title="Perlu dinilai">${ic('hourglass-split')}</button></td>`; }).join('');
    return `<tr><td><b>${esc(s.Nama)}</b></td>${cells}<td class="num tnum"><b>${n ? Math.round(sum / n * 10) / 10 : '–'}</b></td></tr>`;
  }).join('');
  return `<div class="card-x pad0"><div class="tbl-w"><table class="tbl keep"><thead><tr><th>Siswa</th>${ts.map(t => `<th class="num" title="${esc(t.Judul)}">${esc(t.Judul.length > 14 ? t.Judul.slice(0, 13) + '…' : t.Judul)}<div class="xs" style="font-weight:500">/${t.Poin}</div></th>`).join('')}<th class="num">Rerata %</th></tr></thead><tbody>${rows}</tbody></table></div></div><p class="small muted" style="margin-top:10px">${ic('info-circle')} Klik angka atau ikon jam pasir untuk melihat jawaban dan memberi nilai. Kuis dinilai otomatis.</p>`;
}
function lmsNilaiSiswa(k) {
  const L = LMD(); const sid = lmsSid(); const ts = L.tugas.filter(t => t.KursusID === k.ID && t.Status !== 'Draf');
  if (!ts.length) return emptyBox('card-checklist', 'Belum ada nilai', 'Nilai akan tampil setelah kamu mengerjakan tugas atau kuis.');
  return `<div class="card-x pad0"><div class="tbl-w"><table class="tbl"><thead><tr><th>Tugas / kuis</th><th>Status</th><th class="num">Nilai</th><th>Umpan balik guru</th></tr></thead><tbody>${ts.map(t => { const x = kumpulOf(t.ID, sid); return `<tr><td><b>${esc(t.Judul)}</b><div class="xs muted">${esc(t.Tipe)}</div></td><td>${x ? bdg(x.Status) : bdg('Belum dikerjakan', 'a')}</td><td class="num tnum">${x && x.Status === 'Dinilai' ? `<b>${x.Nilai}</b>/${t.Poin}` : '–'}</td><td class="small">${esc((x && x.Umpan) || '')}</td></tr>`; }).join('')}</tbody></table></div></div>`;
}

// ── Form kursus ──
function kursusForm(k) {
  const L = LMD(); const v = k || { Status: 'Aktif', Warna: 'mint' }; const kel = (L.kelas.length ? L.kelas : D('kelas')).map(x => [x.ID, 'Kelas ' + x.Nama]); const admin = S.user.role === 'admin';
  const gurus = D('guru').filter(g => g.Email && g.Status !== 'Nonaktif');
  formModal({ title: k ? 'Ubah Kursus' : 'Buat Kursus', size: 'md', body: `${field('Judul', 'Judul kursus', { req: 1, value: v.Judul, attrs: 'maxlength="100"', msg: 'Judul wajib diisi.' })}<div class="grid2">${field('Mapel', 'Mata pelajaran', { value: v.Mapel, attrs: 'maxlength="60" list="mapelList"' })}${field('KelasID', 'Kelas', { type: 'select', req: 1, options: [['', 'Pilih kelas']].concat(kel), value: v.KelasID, msg: 'Pilih kelas.' })}</div><datalist id="mapelList">${(prof().mapel ? (() => { try { return JSON.parse(prof().mapel); } catch (e) { return []; } })() : []).map(m => `<option>${esc(m)}</option>`).join('')}</datalist>
    ${field('Deskripsi', 'Deskripsi singkat', { type: 'textarea', value: v.Deskripsi, attrs: 'maxlength="600"' })}<div class="grid2">${field('Status', 'Status', { type: 'select', options: ['Aktif', 'Draf', 'Arsip'], value: v.Status, help: 'Siswa hanya melihat kursus berstatus Aktif.' })}${field('Warna', 'Warna kartu', { type: 'select', options: [['mint', 'Hijau mint'], ['coral', 'Koral'], ['yellow', 'Kuning'], ['blue', 'Biru']], value: v.Warna })}</div>
    ${admin ? field('GuruEmail', 'Guru pengampu', { type: 'select', options: [['', 'Saya sendiri (admin)']].concat(gurus.map(g => [g.Email, g.Nama])), value: v.GuruEmail && v.GuruEmail !== S.user.email ? v.GuruEmail : '' }) : ''}`,
    onSubmit: async d => { const rec = Object.assign({}, d, k ? { ID: k.ID } : {}); const r = await lmsCall('lmsKursusSave', { rec }); if (!r) return false; if (!k) go('lms-detail', { id: r.data.ID }); } });
}
ACT.kursusAdd = () => kursusForm(null);
ACT.kursusEdit = el => kursusForm(LMD().kursus.find(x => x.ID === el.dataset.id));
ACT.kursusDel = async el => { const k = LMD().kursus.find(x => x.ID === el.dataset.id); if (!await confirmBox({ title: 'Hapus kursus?', text: `<b>${esc(k.Judul)}</b> beserta seluruh materi, tugas, dan pengumpulan siswa akan dihapus permanen.`, ok: 'Hapus' })) return; const r = await lmsCall('lmsKursusDelete', { id: k.ID }); if (r) go('lms', {}, { noHist: true }); };

// ── Form materi ──
function materiForm(kid, m) {
  const v = m || { Tipe: 'Teks', Terbit: 'Ya' };
  const h = formModal({ title: m ? 'Ubah Materi' : 'Tambah Materi', size: 'md', body: `${field('Judul', 'Judul materi', { req: 1, value: v.Judul, attrs: 'maxlength="120"', msg: 'Judul wajib diisi.' })}<div class="grid2">${field('Tipe', 'Jenis materi', { type: 'select', options: [['Teks', 'Teks / penjelasan'], ['Tautan', 'Tautan (web / Google Drive)'], ['Video', 'Video (tautan YouTube dll.)'], ['Berkas', 'Berkas PDF / gambar']], value: v.Tipe })}${field('Terbit', 'Tampil ke siswa', { type: 'select', options: [['Ya', 'Ya, tampilkan'], ['Tidak', 'Tidak (draf)']], value: v.Terbit })}</div>
    ${field('Isi', 'Isi / penjelasan', { type: 'textarea', rows: 5, value: v.Isi, attrs: 'maxlength="8000"' })}<div id="matUrl">${field('Url', 'Alamat tautan', { value: v.Url, type: 'url', ph: 'https://…', attrs: 'maxlength="500"', msg: 'Isi alamat yang diawali https://' })}</div><div id="matFile">${dz('matf', 'Berkas materi', { opt: 1 })}${m && m.Berkas ? '<p class="small muted">Sudah ada berkas. Unggah lagi hanya bila ingin menggantinya.</p>' : ''}</div>`,
    onOpen: hh => { const sync = () => { const t = $('#f-Tipe', hh.el).value; $('#matUrl', hh.el).hidden = !(t === 'Tautan' || t === 'Video'); $('#matFile', hh.el).hidden = t !== 'Berkas'; $('#f-Url', hh.el).required = (t === 'Tautan' || t === 'Video'); }; sync(); $('#f-Tipe', hh.el).addEventListener('change', sync); clearFiles('matf'); },
    onSubmit: async d => { if (d.Tipe === 'Berkas' && !fileOf('matf') && !(m && m.Berkas)) { toast('Unggah berkas materi terlebih dulu.', 'warn'); return false; } const rec = Object.assign({}, d, { KursusID: kid }, m ? { ID: m.ID, Urut: m.Urut } : {}); const r = await lmsCall('lmsMateriSave', { rec, file: d.Tipe === 'Berkas' ? fileOf('matf') : null }); clearFiles('matf'); if (!r) return false; } });
  return h;
}
ACT.materiAdd = el => materiForm(el.dataset.k, null);
ACT.materiEdit = el => { const m = LMD().materi.find(x => x.ID === el.dataset.id); materiForm(m.KursusID, m); };
ACT.materiDel = async el => { const m = LMD().materi.find(x => x.ID === el.dataset.id); if (!await confirmBox({ title: 'Hapus materi?', text: `<b>${esc(m.Judul)}</b> akan dihapus.`, ok: 'Hapus' })) return; lmsCall('lmsMateriDelete', { id: m.ID }); };

// ── Form tugas / kuis ──
function tugasForm(kid, t) {
  const v = t || { Tipe: 'Tugas', Status: 'Terbit', Poin: 100 };
  let qs; try { qs = t && t.Soal ? JSON.parse(t.Soal) : []; } catch (e) { qs = []; } if (!qs.length) qs = [{ q: '', o: ['', ''], k: 0 }];
  const locked = t && t.Tipe === 'Kuis' && LMD().kumpul.some(x => x.TugasID === t.ID);
  const draw = hh => {
    const box = $('#qBox', hh.el); if (!box) return;
    box.innerHTML = qs.map((q, i) => `<div class="qb"><div class="row-gap" style="margin-bottom:8px"><b>Soal ${i + 1}</b><span class="grow"></span>${qs.length > 1 && !locked ? `<button type="button" class="ibtn danger" data-qdel="${i}" aria-label="Hapus soal">${ic('trash3')}</button>` : ''}</div><input class="inp" data-qq="${i}" value="${esc(q.q)}" placeholder="Tulis pertanyaan" maxlength="400" ${locked ? 'disabled' : ''}>${q.o.map((o, j) => `<label class="qopt"><input type="radio" name="qk${i}" data-qk="${i}:${j}" ${q.k === j ? 'checked' : ''} ${locked ? 'disabled' : ''} aria-label="Jadikan kunci jawaban"><input class="inp" data-qo="${i}:${j}" value="${esc(o)}" placeholder="Pilihan ${String.fromCharCode(65 + j)}" maxlength="200" ${locked ? 'disabled' : ''}></label>`).join('')}${q.o.length < 5 && !locked ? `<button type="button" class="btn btn-ghost sm" data-qadd="${i}">${ic('plus')} Pilihan</button>` : ''}</div>`).join('') + (qs.length < 40 && !locked ? `<button type="button" class="btn btn-soft sm" data-qnew="1">${ic('plus-lg')} Tambah soal</button>` : '');
  };
  formModal({ title: t ? 'Ubah Tugas / Kuis' : 'Tambah Tugas / Kuis', size: 'lg', body: `<div class="grid2">${field('Tipe', 'Jenis', { type: 'select', options: [['Tugas', 'Tugas (jawaban uraian / berkas)'], ['Kuis', 'Kuis pilihan ganda (nilai otomatis)']], value: v.Tipe, attrs: t ? 'disabled' : '' })}${field('Status', 'Status', { type: 'select', options: [['Terbit', 'Terbit (tampil ke siswa)'], ['Draf', 'Draf'], ['Ditutup', 'Ditutup']], value: v.Status })}</div>${field('Judul', 'Judul', { req: 1, value: v.Judul, attrs: 'maxlength="120"', msg: 'Judul wajib diisi.' })}${field('Instruksi', 'Instruksi untuk siswa', { type: 'textarea', rows: 3, value: v.Instruksi, attrs: 'maxlength="4000"' })}<div class="grid2">${field('Tenggat', 'Batas waktu (opsional)', { type: 'datetime-local', value: v.Tenggat ? v.Tenggat.replace(' ', 'T') : '', help: 'Waktu WIB. Setelah lewat, siswa tidak dapat mengumpulkan.' })}${field('Poin', 'Poin maksimal', { type: 'number', value: v.Poin, attrs: 'min="1" max="1000" step="1"' })}</div>
    <div id="qWrap"><h4 style="margin:6px 0 10px">${ic('patch-question')} Soal kuis</h4>${locked ? `<div class="note warn" style="margin-bottom:10px">${ic('lock')}<span>Soal terkunci karena sudah ada siswa yang mengerjakan.</span></div>` : '<p class="small muted" style="margin-bottom:10px">Pilih tombol bulat di samping jawaban yang benar.</p>'}<div id="qBox"></div></div>`,
    onOpen: hh => { const sync = () => { $('#qWrap', hh.el).hidden = $('#f-Tipe', hh.el).value !== 'Kuis'; }; sync(); draw(hh); $('#f-Tipe', hh.el).addEventListener('change', sync);
      hh.el.addEventListener('input', e => { const a = e.target; if (a.dataset.qq !== undefined) qs[+a.dataset.qq].q = a.value; if (a.dataset.qo) { const p = a.dataset.qo.split(':'); qs[+p[0]].o[+p[1]] = a.value; } });
      hh.el.addEventListener('change', e => { const a = e.target; if (a.dataset.qk) { const p = a.dataset.qk.split(':'); qs[+p[0]].k = +p[1]; } });
      hh.el.addEventListener('click', e => { const b = e.target.closest('[data-qdel],[data-qadd],[data-qnew]'); if (!b) return; if (b.dataset.qdel !== undefined) qs.splice(+b.dataset.qdel, 1); else if (b.dataset.qadd !== undefined) qs[+b.dataset.qadd].o.push(''); else qs.push({ q: '', o: ['', ''], k: 0 }); draw(hh); }); },
    onSubmit: async d => { const tipe = t ? t.Tipe : d.Tipe; const rec = { KursusID: kid, Tipe: tipe, Status: d.Status, Judul: d.Judul, Instruksi: d.Instruksi, Tenggat: d.Tenggat, Poin: d.Poin }; if (t) rec.ID = t.ID; if (tipe === 'Kuis') rec.Soal = qs; const r = await lmsCall('lmsTugasSave', { rec }); if (!r) return false; } });
}
ACT.tugasAdd = el => tugasForm(el.dataset.k, null);
ACT.tugasEdit = el => { const t = LMD().tugas.find(x => x.ID === el.dataset.id); tugasForm(t.KursusID, t); };
ACT.tugasDel = async el => { const t = LMD().tugas.find(x => x.ID === el.dataset.id); if (!await confirmBox({ title: 'Hapus tugas / kuis?', text: `<b>${esc(t.Judul)}</b> beserta seluruh jawaban dan nilai siswa akan dihapus.`, ok: 'Hapus' })) return; lmsCall('lmsTugasDelete', { id: t.ID }); };

// ── Siswa / orang tua: mengerjakan ──
ACT.lmsKerjakan = el => {
  const t = LMD().tugas.find(x => x.ID === el.dataset.id); const sid = lmsSid(); const old = kumpulOf(t.ID, sid);
  if (t.Tipe === 'Kuis') {
    let qs = []; try { qs = JSON.parse(t.Soal || '[]'); } catch (e) { /* kosong */ }
    formModal({ title: t.Judul, size: 'md', ok: 'Kirim jawaban', body: `<p class="muted small" style="margin-bottom:12px">${qs.length} soal · satu kali pengerjaan · ${t.Poin} poin. Jawab semua soal lalu kirim.</p>${qs.map((q, i) => `<fieldset class="qb"><legend><b>${i + 1}. ${esc(q.q)}</b></legend>${q.o.map((o, j) => `<label class="qopt pick"><input type="radio" name="a${i}" value="${j}" required><span>${esc(o)}</span></label>`).join('')}</fieldset>`).join('')}`,
      onSubmit: async (d, f) => { const jw = qs.map((q, i) => { const c = f.querySelector(`[name=a${i}]:checked`); return c ? Number(c.value) : null; }); if (jw.some(x => x === null)) { toast('Jawab semua soal terlebih dahulu.', 'warn'); return false; } const r = await lmsCall('lmsKumpul', { tugasId: t.ID, siswaId: sid, jawaban: jw }, true); if (!r) return false; toast(r.message, 'ok'); } });
  } else {
    formModal({ title: t.Judul, size: 'md', ok: 'Kirim', body: `${t.Instruksi ? `<div class="note" style="margin-bottom:12px">${ic('info-circle')}<span>${nl2br(t.Instruksi)}</span></div>` : ''}${field('jawaban', 'Jawaban', { type: 'textarea', rows: 6, value: old ? old.Jawaban : '', attrs: 'maxlength="4000"' })}${dz('tgsf', 'Lampiran jawaban (foto pekerjaan / PDF)', { opt: 1 })}${old && old.Berkas ? '<p class="small muted">Lampiran sebelumnya sudah tersimpan. Unggah lagi hanya bila ingin menggantinya.</p>' : ''}`,
      onOpen: () => clearFiles('tgsf'),
      onSubmit: async d => { if (!d.jawaban.trim() && !fileOf('tgsf') && !(old && old.Berkas)) { toast('Tulis jawaban atau unggah lampiran.', 'warn'); return false; } const r = await lmsCall('lmsKumpul', { tugasId: t.ID, siswaId: sid, jawaban: d.jawaban, file: fileOf('tgsf') }); clearFiles('tgsf'); if (!r) return false; } });
  }
};
ACT.lmsLihat = el => {
  const t = LMD().tugas.find(x => x.ID === el.dataset.id); const x = kumpulOf(t.ID, lmsSid()); if (!x) return;
  openModal({ title: t.Judul, size: 'md', body: `<div class="row-gap" style="margin-bottom:12px">${bdg(x.Status)} ${x.Status === 'Dinilai' ? `<b class="tnum" style="font-size:20px">${x.Nilai}/${t.Poin}</b>` : ''}</div><p class="xs muted">Dikirim ${esc(fmtDT(x.Tgl))}</p>${t.Tipe === 'Tugas' && x.Jawaban ? `<div class="mat-b" style="margin-top:8px">${nl2br(x.Jawaban)}</div>` : ''}${x.Berkas ? `<button class="btn btn-soft sm" data-act="lmsFile" data-kind="kumpul" data-id="${esc(x.ID)}" data-t="Lampiran jawaban">${ic('eye')} Lihat lampiran</button>` : ''}${x.Umpan ? `<div class="note" style="margin-top:12px">${ic('chat-left-text')}<span><b>Umpan balik:</b> ${esc(x.Umpan)}</span></div>` : ''}` });
};

// ── Guru: menilai ──
ACT.lmsGrade = el => {
  const L = LMD(); const x = L.kumpul.find(y => y.ID === el.dataset.id); const t = L.tugas.find(y => y.ID === x.TugasID); const s = L.peserta.find(y => y.ID === x.SiswaID) || { Nama: x.SiswaID };
  let jw = esc(x.Jawaban || ''); if (t.Tipe === 'Kuis') { let qs = [], a = []; try { qs = JSON.parse(t.Soal || '[]'); a = JSON.parse(x.Jawaban || '[]'); } catch (e) { /* abaikan */ } jw = qs.map((q, i) => `<div class="small" style="margin-bottom:6px"><b>${i + 1}. ${esc(q.q)}</b><br>${a[i] === q.k ? ic('check-circle-fill') : ic('x-circle-fill')} ${esc(q.o[a[i]] !== undefined ? q.o[a[i]] : '(kosong)')}${a[i] !== q.k ? ` <span class="muted">· kunci: ${esc(q.o[q.k])}</span>` : ''}</div>`).join(''); } else jw = nl2br(x.Jawaban || '') || '<span class="muted">(tanpa teks)</span>';
  formModal({ title: `${s.Nama} — ${t.Judul}`, size: 'md', ok: 'Simpan nilai', body: `<p class="xs muted" style="margin-bottom:8px">Dikirim ${esc(fmtDT(x.Tgl))}</p><div class="mat-b" style="margin-bottom:10px">${jw}</div>${x.Berkas ? `<button type="button" class="btn btn-soft sm" data-act="lmsFile" data-kind="kumpul" data-id="${esc(x.ID)}" data-t="Lampiran jawaban">${ic('eye')} Lihat lampiran</button>` : ''}<div class="grid2" style="margin-top:12px">${field('nilai', `Nilai (0–${t.Poin})`, { req: 1, type: 'number', value: x.Nilai, attrs: `min="0" max="${t.Poin}" step="0.1"`, msg: `Isi angka 0–${t.Poin}.` })}</div>${field('umpan', 'Umpan balik untuk siswa', { type: 'textarea', value: x.Umpan, attrs: 'maxlength="1000"' })}`,
    onSubmit: async d => { const r = await lmsCall('lmsNilai', { id: x.ID, nilai: d.nilai, umpan: d.umpan }); if (!r) return false; } });
};

async function refreshPub() {
  try { const r = await rpc('publicData'); if (r && r.success) { S.pub = r.data; LS.set('pub', S.pub); if (VIEWS[S.view] && !VIEWS[S.view].panel) refreshView(); else chromePanel(); } } catch (e) {   }
}
const refreshPubSoon = (names, now) => { if (S.user && S.user.role === 'admin' && (now || names.some(n => ['berita', 'galeri', 'profil', 'gelombang', 'ppdbInfo'].indexOf(n) >= 0))) { clearTimeout(refreshPubSoon.t); refreshPubSoon.t = setTimeout(refreshPub, now ? 50 : 600); } };
function hideBoot() { const t = $('#boot'); if (t) { t.classList.add('off'); setTimeout(() => t.remove(), 300); } }
function boot() {
  const pub = LS.get('pub', null); if (pub) S.pub = pub;
  const tok = LS.get('token', null); const snap = LS.get('snap', null);
  if (tok) { S.token = tok; if (snap && snap.user) { S.user = snap.user; S.db = snap.db || {}; S.ver = snap.ver || {}; } }
  const showNow = !tok || S.user || S.pub;
  if (showNow) go(S.user ? LANDING[S.user.role] : 'home', {}, { noHist: true });
  rpc('init', tok || '').then(res => {
    if (!res || !res.success) throw new Error((res && res.message) || 'Gagal memuat.');
    S.pub = res.data.pub; LS.set('pub', S.pub); if (res.data.lic) setLic(res.data.lic);
    if (res.data.session) {
      const first = !S.user; const same = S.user && S.user.email === res.data.session.user.email;
      if (same) { S.user = res.data.session.user; S.serverDate = res.data.session.serverDate; mergeData(res.data.session.data, res.data.session.ver); }
      else applySession(res.data.session);
      startPolling(); Outbox.flush(); if (first || !VIEWS[S.view]) go(LANDING[S.user.role], {}, { noHist: true });
    } else if (res.data.badToken) { const was = !!S.user; resetClient(); if (was) go('login', { msg: 'Sesi Anda berakhir. Silakan masuk kembali.' }, { noHist: true }); }
    if (!S.view) go('home', {}, { noHist: true }); else refreshView();
    setSync(); hideBoot();
  }).catch(err => {
    console.warn('init gagal:', err); setSync('off'); const em = (err && err.message) || String(err);
    if (!S.view) go(S.user ? LANDING[S.user.role] : 'home', {}, { noHist: true });
    if (!S.pub && !S.user) { const el = $('#pubView'); if (el) el.innerHTML = `<div class="wrap" style="padding:60px 20px">${emptyBox('wifi-off', 'Data belum dapat dimuat', esc(em) + '<br><span class="small muted">Periksa koneksi internet. Bila Anda pemilik aplikasi: pastikan <b>setupAppEnvironment</b> sudah dijalankan dan deployment memakai Versi baru.</span>', '<button class="btn btn-pri" onclick="location.reload()">Muat ulang</button>')}</div>`; }
    hideBoot();
    if (S.user) { startPolling(); }
  });
  setTimeout(() => { if (!S.view) { go('home', {}, { noHist: true }); } hideBoot(); }, 7000);
}
let _booted = false;
const bootOnce = () => { if (_booted) return; _booted = true; boot(); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootOnce); else bootOnce();

(function () {
  let shown = 0;
  function fatal(msg) {
    if (!msg || /ResizeObserver|Script error\.?$/i.test(msg) || shown >= 2) return; shown++;
    const d = document.createElement('div'); d.setAttribute('role', 'alert');
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;background:#7F1D1D;color:#fff;padding:12px 14px;border-radius:12px;font:13px/1.45 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35)';
    d.innerHTML = '<b>Terjadi kesalahan pada aplikasi.</b><br>' + String(msg).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '<br><small>Muat ulang halaman. Jika berulang, kirim pesan ini ke pengembang.</small> <button style="margin-left:8px;border:0;border-radius:8px;padding:4px 10px" onclick="this.parentNode.remove()">Tutup</button>';
    document.body.appendChild(d);
  }
  window.addEventListener('error', e => fatal(e.message + (e.filename ? '' : '')));
  window.addEventListener('unhandledrejection', e => fatal((e.reason && e.reason.message) || String(e.reason)));
})();

window.__AS_LOADED = true;
})();
