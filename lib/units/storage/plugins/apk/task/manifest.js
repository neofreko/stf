var ApkReader = require('adbkit-apkreader')
const PkgReader = require('isomorphic-pkg-reader')
var logger = require('../../../../../util/logger')
const log = logger.createLogger('storage:temp')

module.exports = async function(file) {
    let result 
    try {
      result = await ApkReader.open(file.path).then(function(reader) {
        const manifest =  reader.readManifest()
        log.info(manifest)
        return manifest
      })
    } catch (error) {
      log.info("Probably not .ipa, let's assume it's .ipa", error)
      const reader = new PkgReader(file.path, 'ipa')
      result = new Promise(function (resolve, reject) {
        reader.parse(function(err, pkgInfo) {
          if (err) {
            reject(err)
          } else
            //console.log(pkgInfo)
            resolve(pkgInfo);
        });
      }) 
    }

    return result
}
