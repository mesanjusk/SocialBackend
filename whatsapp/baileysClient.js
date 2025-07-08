const { default: makeWASocket, DisconnectReason, useMongoDBAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');

let sock;

async function initWhatsApp(db) {
  const { state, saveCreds } = await useMongoDBAuthState(db.collection('wa_auth'));

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('WhatsApp connection closed:', lastDisconnect?.error);
      if (shouldReconnect) initWhatsApp(db);
    } else if (connection === 'open') {
      console.log('WhatsApp connection opened');
    }
  });
}

async function sendMessage(jid, text) {
  if (!sock) throw new Error('WhatsApp not initialised');
  await sock.sendMessage(jid, { text });
}

module.exports = { initWhatsApp, sendMessage };
