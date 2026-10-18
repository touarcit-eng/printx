/**
 * Optional Google Apps Script endpoint for recording confirmed order requests.
 * Deploy as a Web app, then set the resulting URL in a future client integration.
 */
const SHEET_NAME = 'Commandes';
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData && e.postData.contents || '{}');
    if (!payload.name || !payload.phone || !Array.isArray(payload.items) || !payload.items.length) {
      return response_({ ok: false, error: 'Données de commande incomplètes.' });
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Créez une feuille nommée « ' + SHEET_NAME + ' ».');
    sheet.appendRow([new Date(), payload.id || Utilities.getUuid(), payload.name, payload.phone,
      payload.address || '', payload.note || '', JSON.stringify(payload.items), payload.total || '', 'NOUVELLE']);
    return response_({ ok: true });
  } catch (error) {
    return response_({ ok: false, error: error.message });
  }
}
function response_(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(['Horodatage','ID','Nom','Téléphone','Adresse','Note','Articles','Total estimé','Statut']);
  sheet.setFrozenRows(1);
}
