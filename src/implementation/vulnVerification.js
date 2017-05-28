'use scrict'

const printChat = require('../printChat.js')

// checks if a node vulnerability has a connection to a node constraint
module.exports = function vulnVerification (cy) {
  let arrVulnerability = [] // array with all threats
  let arrMitigated = [] // array with mitigated threats
  let result = '' // posted on the nodeInfo div

  cy.nodes().map((node) => {
    // checks in node is threat and adds to arrVulnerability
    if (node.data().info.concept === 'vulnerability') {
      node.addClass('attention')
      arrVulnerability.push(node.data().id)

      // stores the neigborring nodes of the vulnerabilities
      const neighborNodes = node.neighborhood()
      const neighborInfo = neighborNodes.data().info

      // check which vulnerability has a constraint neighbor
      Object.keys(neighborInfo).map((i) => {
        if (neighborInfo[i] === 'mechanism') {
          arrMitigated.push(node.data().id)
          result = `${result} • Vulnerability ${node.data().id} is mitigated by mechanism ${neighborNodes.data().id}\n`
        }
      })
    }
    if (node.data().info.concept === 'mechanism') {
      node.addClass('protect')
    }
  })
  // checks the arrays to see which vulnerability is not mitigated
  const setMitigated = new Set(arrMitigated)
  // const vulnerabilities = new Set([...arrVulnerability].filter(vuln => !setMitigated.has(vuln)))
  const vulnerabilities = new Set([...arrVulnerability].filter((vuln) => {
    !setMitigated.has(vuln)
  }))

  vulnerabilities.forEach((i) => {
    result = `${result} • Vulnerability ${i} is not mitigated\n`
  })

  // result will be displayed at info-for-nodes div
  result = `${result} • Vulnerabilities total: ${arrVulnerability.length}\n`
  result = `${result} • Mitigated total: ${arrMitigated.length}\n`
  printChat(result)
}