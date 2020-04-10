var manifestOf = require("../../lib/units/storage/plugins/apk/task/manifest.js")

var chai = require('chai')
const expect = chai.expect
const fs = require('fs')
const path = require('path')
const apkPath = path.join(__dirname, 'sample.apk')
const ipaPath = path.join(__dirname, 'sample.ipa')
const request = require('request');

async function downloadUrl(url, asName) {
    let file = fs.createWriteStream(asName);
    return await new Promise((resolve, reject) => {
        var stream = request({
            url
        })
        .pipe(file)
        .on('finish', () => { resolve(asName)} )
        .on('error', reject)
    })
}

async function getApkFile() {
    if (fs.existsSync(apkPath)) {
        return apkPath
    } else {
        return await downloadUrl('https://github.com/openstf/STFService.apk/releases/download/v2.4.3/STFService.apk', apkPath)
    }
}

async function getIpaFile() {
    if (fs.existsSync(ipaPath)) {
        return ipaPath
    } else {
        return await downloadUrl('https://github.com/bitbar/testdroid-samples/raw/master/xcode/ipa/calculator.ipa', ipaPath)
    }
}

describe('storage', function() {
  describe('plugin', function() {
    it('manifest can read apk', async function() {
        const apkFilePath = await getApkFile()
        const apkManifest = await manifestOf({path: apkFilePath})
        expect(apkManifest).to.have.property("versionName", "2.4.3")
    })

    it('manifest can read ipa', async function() {
        const ipaFilePath = await getIpaFile()
        const ipaManifest = await manifestOf({path: ipaFilePath})
        expect(ipaManifest).to.have.property("CFBundleIdentifier", "com.petri.calculator.calculator")
    })
  })
})