require('dotenv').config();
const oracledb = require('oracledb');
const path = require('path');

async function testConnection() {
  try {
    // Set the Oracle client path and config directory
    oracledb.initOracleClient({
        libDir: process.env.HOME + '/Downloads/instantclient_23_3',
        configDir: path.join(__dirname, 'wallet')
      });

    console.log("Tentative de connexion avec :");
    console.log("Username:", process.env.ORACLE_USERNAME);
    
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USERNAME,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
      ssl: true
    });
    
    console.log("Connexion réussie !");
    const result = await connection.execute('SELECT 1 FROM DUAL');
    console.log("Query test réussie:", result);
    
    await connection.close();
  } catch (err) {
    console.error("Erreur détaillée:", err);
  }
}

testConnection();