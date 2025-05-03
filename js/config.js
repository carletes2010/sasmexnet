/* config.js */

// 1) Define la configuración global
window.configuracion = {
  WebSocketClient: {
    host:      "ws://localhost:2500",
    url:       "MonitorSasmex",
    protocolo: "public"
  }
};

// 2) Auto-arranque: se ejecuta después de cargar sasmexlib.min.js
(function() {
  // Espera hasta que la librería exista
  function arrancar() {
    if (!window.sasmexlib || !sasmexlib.WsClientService) {
      return setTimeout(arrancar, 50);
    }

    const cfg = window.configuracion.WebSocketClient;

    // Crea el cliente WS (en esta versión construye y conecta)
    const wsClientService = new sasmexlib.WsClientService({
      host:      cfg.host,
      url:       cfg.url,
      protocolo: cfg.protocolo
    });

    // Crea el procesador de paquetes
    const ps = new sasmexlib.ProcessServicePublic();

    // Pasa ambos a PaqueteCires
    new sasmexlib.PaqueteCires({
      ws:    wsClientService,
      decod: paquete => ps.procesar(paquete)
    });

    // Exponer el procesador globalmente
    window.procesarService = ps;
  }

  arrancar();
})();
