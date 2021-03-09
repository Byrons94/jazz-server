const https = require('https');
const parseStringPromise = require('xml2js').parseStringPromise;

module.exports = {
    get (url) {
      return xmlToJson(url).then(response => {
        return response;
      })
      .catch(error => {
        throw error;
      });
    },
};

function xmlToJson (url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let xml = '';
        res.on('data', (chunk) => {
          xml += chunk;
        });
        res.on('end', () => {
          try {
            parseStringPromise(xml, {explicitRoot: false}).then(function (response){ 
              resolve(response);
            });
          } catch (e) {
            reject(e.message);
          }
        });
      }).on('error', (e) => {
        reject(`Got error: ${e.message}`);
      });
    });
  }
  