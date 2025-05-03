/* config.js */

// 1) Define la configuración global
window.configuracion = {
  WebSocketClient: {
    host:      "ws://localhost:2500",
    url:       "MonitorSasmex",
    protocolo: "public"
  }
};

// 2) Auto-arranque tras cargar sasmexlib.min.js
(function() {
  function arrancar() {
    if (!window.sasmexlib || !sasmexlib.WsClientService) {
      return setTimeout(arrancar, 50);
    }

    const cfg = window.configuracion.WebSocketClient;
    console.log('[config] Configuración WS:', cfg);

    // 3) Crear cliente WS (conecta internamente)
    console.log('[config] Iniciando WebSocket:', cfg.host);
    const wsClientService = new sasmexlib.WsClientService({
      host:      cfg.host,
      url:       cfg.url,
      protocolo: cfg.protocolo
    });

    // 4) Diagnóstico de socket si existe
    if (wsClientService.socket) {
      wsClientService.socket.onopen = () => console.log('[WS] Conectado a', cfg.host);
      wsClientService.socket.onerror = err => console.error('[WS] Error de conexión:', err);
      wsClientService.socket.onclose = ev => console.warn('[WS] Conexión cerrada:', ev);
      wsClientService.socket.onmessage = m => console.log('[WS] Mensaje recibido:', m.data);
    } else {
      console.warn('[config] No se encontró socket en wsClientService');
    }

    // 5) Crear procesador de paquetes
    const ps = new sasmexlib.ProcessServicePublic();

    // 6) Pasa ambos a PaqueteCires
    new sasmexlib.PaqueteCires({
      ws:    wsClientService,
      decod: paquete => ps.procesar(paquete)
    });

    // 7) Exponer el procesador globalmente
    window.procesarService = ps;
  }

  arrancar();
})();
