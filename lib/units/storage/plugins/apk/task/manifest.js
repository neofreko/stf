var ApkReader = require('adbkit-apkreader')
const PkgReader = require('isomorphic-pkg-reader')

module.exports = function(file) {
  if (/\.apk$/.test(file.path)) {
    return ApkReader.open(file.path).then(function(reader) {
      return reader.readManifest()
    })
  } else if (/\.ipa$/.test(file.path)) {
    const reader = new PkgReader(file.path, 'ipa')
    return new Promise(function (resolve, reject) {
      reader.parse(function(err, pkgInfo) {
        if (err) {
          reject(err)
        } else
          //console.log(pkgInfo)
          resolve(pkgInfo);
      });
    }) 
  }
}
