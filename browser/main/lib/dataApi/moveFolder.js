const _ = require('lodash')
const path = require('path')
const resolveStorageData = require('./resolveStorageData')
const CSON = require('@rokt33r/season')

/**
 * @param {String} storageKey
 * @param {Array} folders

 * @return {Object}
 * ```
 * {
 *   storage: Object
 * }
 * ```
 */

function moveFolder (storageKey, folders) {
  let rawStorages
  let targetStorage
  try {
    rawStorages = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(rawStorages)) throw new Error('Target storage doesn\'t exist.')

    targetStorage = _.find(rawStorages, {key: storageKey})
    if (targetStorage == null) throw new Error('Target storage doesn\'t exist.')
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(targetStorage)
    .then(function moveFolder (storage) {
      storage.folders = folders

      CSON.writeFileSync(path.join(storage.path, 'boostnote.json'), _.pick(storage, ['folders', 'version']))

      return {
        storage
      }
    })
}
module.exports = moveFolder
