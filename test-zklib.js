const ZKLib = require('node-zklib');

(async () => {
  const zk = new ZKLib('192.168.1.117', 4370, 10000, 4000);

  try {
    // Conectar
    await zk.createSocket();
    console.log('✅ Conectado al iClock880');

    // Leer info del dispositivo
    const info = await zk.getInfo();
    console.log('📟 Info del dispositivo:', info);

    // Leer usuarios
    const users = await zk.getUsers();
    console.log('👤 Usuarios registrados:', users);

    // Leer logs
    const logs = await zk.getAttendances();
    console.log('📝 Logs almacenados en el dispositivo:', logs);

    // Activar logs en tiempo real
    zk.getRealTimeLogs((data) => {
      console.log('📡 Log en tiempo real:', data);
    });

  } catch (err) {
    console.error('❌ Error conectando:', err);
  }
})();
