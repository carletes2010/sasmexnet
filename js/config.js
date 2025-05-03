/* config.js */

// 1) Define la configuración global
document.addEventListener('DOMContentLoaded', () => {
  window.configuracion = {
    WebSocketClient: {
      host:      "ws://localhost:2500",
      url:       "MonitorSasmex",
      protocolo: "public"
    }
  };

  const cfg = window.configuracion.WebSocketClient;
  console.log('[config] WS config:', cfg);

  // 2) Crear WebSocket nativo
  const socket = new WebSocket(cfg.host);
  socket.addEventListener('open',    () => console.log('[WS] Connected to', cfg.host));
  socket.addEventListener('error',   err => console.error('[WS] Error:', err));
  socket.addEventListener('close',   ev  => console.warn('[WS] Closed:', ev));
  socket.addEventListener('message', m   => console.log('[WS] Message:', m.data));

  // 3) Instanciar procesador y PaqueteCires con socket manual
  const ps = new sasmexlib.ProcessServicePublic();
  new sasmexlib.PaqueteCires({
    ws: {
      send: msg => socket.send(JSON.stringify(msg)),
      onmessage: handler => socket.addEventListener('message', ev => handler(JSON.parse(ev.data)))
    },
    decod: paquete => ps.procesar(paquete)
  });

  window.procesarService = ps;
});
