process.env.NODE_ENV = "production";
process.env.NODE_PWA = "true";

const webpack = require('webpack');
const path = require("path");
const util = require("util");
const express = require('express');
const https = require('https');
const app = express();
const { pki } = forge = require("node-forge");

(async () => {
    require("../input/extract.js");

    process.chdir(path.resolve(__dirname, "../"));
    console.log(process.cwd())
    // const wpout = await util.promisify(webpack)(require('../webpack.config'))
    // console.log(wpout.toJson("minimal"))

    const { networkInterfaces } = require('os');
    const addr = Object.values(networkInterfaces()).flat().find(i => i.family == 'IPv4' && !i.internal).address;

    console.log("serving...")
    console.log(addr)
    const { pem_pkey, pem_cert } = generateCert(addr);
    app.get("/cert.crt", (req, res) => { 
        res.setHeader('Content-disposition', 'attachment; filename=cert.crt');
          
        res.send(pem_cert);
    })
    app.use("/", express.static(path.resolve(__dirname, "..", "dist")));

    let server = https.createServer({
        cert: pem_cert, 
        key: pem_pkey
    }, app);
    const servecb = () => {
        console.log(`App served on port: https://${addr}:${server.address().port}/`)
    }
    try {
        server = server.listen(8080, "0.0.0.0", servecb)
    } 
    catch {
        try {
            server = app.listen(0, "0.0.0.0", servecb)
        }
        catch (err) {
            console.error(err)
            process.exit(1)
        }
    }
    
})()

function generateCert(addr) {
    var keys = pki.rsa.generateKeyPair(2048);
    var cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var attrs = [{
        name: 'commonName',
        value: 'example.org'
    }, {
    name: 'countryName',
    value: 'US'
    }, {
    shortName: 'ST',
    value: 'Virginia'
    }, {
    name: 'localityName',
    value: 'Blacksburg'
    }, {
    name: 'organizationName',
    value: 'Test'
    }, {
    shortName: 'OU',
    value: 'Test'
    }];
    cert.setExtensions([
        {
            name : 'basicConstraints',
            cA : true
        },
        {
            name: "subjectAltName",
            altNames: [
                {
                    type: 7,
                    ip: addr
                }
            ]
        }
    ]);
    cert.setSubject(attrs);
    // alternatively set subject from a csr
    //cert.setSubject(csr.subject.attributes);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);
    const pem_cert = pki.certificateToPem(cert);
    const pem_pkey = pki.privateKeyToPem(keys.privateKey);
    console.log(pem_cert, pem_pkey)
    return { pem_pkey, pem_cert }
}
