/** PrintX — base de commandes Google Sheets / Google Apps Script
 * Déployer cette application web en exécutant en tant que propriétaire.
 * La feuille créée reste privée dans le Drive du propriétaire.
 */
const PRINTX = {
  SPREADSHEET_PROPERTY: 'PRINTX_SPREADSHEET_ID',
  SHEET_NAME: 'Commandes',
  HEADERS: [
    'N° commande', 'Date (UTC)', 'Statut', 'Nom', 'Téléphone', 'Wilaya / ville',
    'Réception', 'Précisions', 'Articles (JSON)', 'Total estimatif (DA)', 'Devise', 'Source'
  ],
  MAX_ITEMS: 30,
  MAX_ORDERS_PER_PHONE_PER_10_MIN: 5,
  // Prix indicatifs de référence : synchroniser avec le catalogue si les tarifs changent.
  PRODUCT_PRICES: { folders: 35, presentation: 90, prescription: 25, cards: 1800, envelopes: 30, letterhead: 18, invoice: 15, delivery: 15, custom: 0 },
  PRODUCT_NAMES: { folders: 'Sous-chemises personnalisées', presentation: 'Chemises à rabats', prescription: 'Chemises d’ordonnance', cards: 'Cartes de visite', envelopes: 'Enveloppes personnalisées', letterhead: 'Papier à en-tête', invoice: 'Factures & devis', delivery: 'Bons de livraison', custom: 'Imprimé sur mesure' }
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('PrintX — Impression professionnelle')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** À exécuter une seule fois depuis l'éditeur Apps Script, puis autoriser. */
function setupPrintX() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(PRINTX.SPREADSHEET_PROPERTY);
  let ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('PrintX — Base des commandes');
    props.setProperty(PRINTX.SPREADSHEET_PROPERTY, ss.getId());
  }
  let sheet = ss.getSheetByName(PRINTX.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(PRINTX.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, PRINTX.HEADERS.length).setValues([PRINTX.HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, PRINTX.HEADERS.length).setFontWeight('bold');
    sheet.getRange('B:B').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.getRange('J:J').setNumberFormat('#,##0 "DA"');
    sheet.autoResizeColumns(1, PRINTX.HEADERS.length);
  }
  Logger.log('Base PrintX créée/prête : ' + ss.getUrl());
  return ss.getUrl();
}

/** Appelée par le site uniquement après clic sur « Envoyer par WhatsApp ». */
function saveOrderToSheet(input) {
  if (!input || typeof input !== 'object') throw new Error('Données de commande invalides.');
  const order = normalizeOrder_(input);
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty(PRINTX.SPREADSHEET_PROPERTY);
  if (!spreadsheetId) throw new Error('La base PrintX n’est pas initialisée. Exécutez setupPrintX().');

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName(PRINTX.SHEET_NAME);
    if (!sheet) throw new Error('Feuille Commandes introuvable. Exécutez setupPrintX().');

    // Une relance réseau avec le même identifiant ne crée pas une seconde ligne.
    if (sheet.getLastRow() > 1) {
      const found = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
        .createTextFinder(order.id).matchEntireCell(true).findNext();
      if (found) return { ok: true, duplicate: true, orderId: order.id };
    }

    // Limitation simple par numéro de téléphone pour réduire le spam accidentel.
    const phoneKey = 'PX_RATE_' + Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, order.phone)
    ).slice(0, 32);
    const cache = CacheService.getScriptCache();
    const count = Number(cache.get(phoneKey) || 0);
    if (count >= PRINTX.MAX_ORDERS_PER_PHONE_PER_10_MIN) {
      throw new Error('Trop de commandes récentes pour ce numéro. Réessayez dans quelques minutes.');
    }

    const row = [
      order.id,
      new Date(),
      'Enregistrée — WhatsApp à envoyer',
      safeCell_(order.name),
      safeCell_(order.phone),
      safeCell_(order.city),
      order.delivery,
      safeCell_(order.notes),
      JSON.stringify(order.items),
      order.total,
      'DA',
      'Site PrintX'
    ];
    sheet.appendRow(row);
    cache.put(phoneKey, String(count + 1), 600);
    return { ok: true, duplicate: false, orderId: order.id };
  } finally {
    lock.releaseLock();
  }
}

function normalizeOrder_(input) {
  const id = safeText_(input.id, 30);
  if (!/^PX-[0-9]{13}$/.test(id)) throw new Error('Numéro de commande invalide. Actualisez la page et réessayez.');
  const name = safeText_(input.name, 120);
  const phone = safeText_(input.phone, 40);
  const city = safeText_(input.city, 120);
  const notes = safeText_(input.notes, 1500);
  const delivery = input.delivery === 'pickup' ? 'Retrait' : 'Livraison (à confirmer)';
  if (!name || !phone || !city) throw new Error('Nom, téléphone et ville sont obligatoires.');
  if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > PRINTX.MAX_ITEMS) {
    throw new Error('Le panier doit contenir entre 1 et ' + PRINTX.MAX_ITEMS + ' lignes.');
  }
  const items = input.items.map(function (item) {
    const productId = safeText_(item.id, 60);
    if (!Object.prototype.hasOwnProperty.call(PRINTX.PRODUCT_PRICES, productId)) {
      throw new Error('Un produit du panier n’est pas reconnu. Actualisez le catalogue et réessayez.');
    }
    const qty = Math.floor(Number(item.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 100000) throw new Error('Quantité invalide.');
    // Ne jamais faire confiance aux prix ou totaux envoyés par le navigateur.
    const unitPrice = PRINTX.PRODUCT_PRICES[productId];
    const quoteRequired = productId === 'custom';
    const total = quoteRequired ? 0 : unitPrice * qty;
    if (!Number.isSafeInteger(total) || total < 0 || total > 10000000000) throw new Error('Montant estimatif invalide.');
    return {
      name: PRINTX.PRODUCT_NAMES[productId],
      productId: productId,
      quantity: qty,
      quantityUnit: productId === 'cards' ? 'lot de 100' : (productId === 'letterhead' || productId === 'invoice' || productId === 'delivery' ? 'feuille' : 'pièce'),
      format: safeText_(item.format, 100),
      option: safeText_(item.option, 200),
      design: safeText_(item.design, 1000),
      unitPrice: unitPrice,
      total: total,
      quoteRequired: quoteRequired
    };
  });
  const total = items.reduce(function (sum, item) { return sum + item.total; }, 0);
  if (!Number.isSafeInteger(total) || total > 10000000000) throw new Error('Montant estimatif invalide.');
  return { id: id, name: name, phone: phone, city: city, notes: notes, delivery: delivery, items: items, total: total };
}

function safeText_(value, maxLength) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim().slice(0, maxLength);
}

// Empêche les champs utilisateur de devenir des formules Google Sheets.
function safeCell_(value) {
  const text = safeText_(value, 5000);
  return /^[=+@\-]/.test(text) ? "'" + text : text;
}