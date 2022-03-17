process.env.NODE_ENV = "production";
process.env.NODE_PWA = "true";

const webpack = require('webpack');
const path = require("path");
const util = require("util");
const express = require('express');
const https = require('https');
const fs = require('fs');

const { pki } = forge = require("node-forge");
const { hashElement } = require('folder-hash');
const defaultGateway = require("default-gateway");
const ipaddr = require("ipaddr.js");

const app = express();
const hashoptions = {
    folders: { exclude: ['.*'] },
    files: { include: ['*.*'] },
};
const certfile = "cert.crt";

(async () => {
    const projroot = path.resolve(__dirname, "..")
    const projapppath = path.resolve(projroot, "app")
    const foldhash = (await hashElement(projapppath, hashoptions)).hash;
    await require("../input/extract.js");

    process.chdir(path.resolve(__dirname, "../"));
    console.log(process.cwd())
    if ((await hashElement(projapppath, hashoptions)).hash !== foldhash && !fs.existsSync(path.resolve(projroot, "dist", "index.html"))) {
        console.log("compiling")
        const wpout = await util.promisify(webpack)(require('../webpack.config'))
        console.log(wpout.toJson("minimal"))
    }

    const addr = await findIp(defaultGateway)

    console.log("serving...")
    const { pem_pkey, pem_cert } = generateCert(addr);
    app.get(`/${certfile}`, (req, res) => { 
        res.setHeader('Content-disposition', `attachment; filename=${certfile}`);
        res.setHeader('Content-type', 'application/x-x509-ca-cert');
        res.send(pem_cert);
    })
    app.use("/", express.static(path.resolve(__dirname, "..", "dist")));

    let server = https.createServer({
        cert: pem_cert, 
        key: pem_pkey
    }, app);
    const servecb = () => {
        console.log(`Tape served at: https://${addr}:${server.address().port}/`)
        console.log(`Before installation, please install the HTTPS certificate on your device at: https://${addr}:${server.address().port}/${certfile}`)
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
    return { pem_pkey, pem_cert }
}

// https://github.com/webpack/webpack-dev-server/blob/dc2d6f77aede59de6a44aa5fa80a91958943b571/lib/Server.js#L320
async function findIp(gateway) {
    const { networkInterfaces } = require('os');
    const gatewayIp = ipaddr.parse((await gateway.v4()).gateway);

    // Look for the matching interface in all local interfaces.
    for (const addresses of Object.values(networkInterfaces())) {
      for (const { cidr } of /** @type {NetworkInterfaceInfo[]} */ (
        addresses
      )) {
        const net = ipaddr.parseCIDR(/** @type {string} */ (cidr));

        if (
          net[0] &&
          net[0].kind() === gatewayIp.kind() &&
          gatewayIp.match(net)
        ) {
          return net[0].toString();
        }
      }
    }
}