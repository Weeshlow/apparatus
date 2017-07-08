'use strict'

// core modules, shared between all phases
const nodeSelection = require('./nodeSelection.js')
const coseLayout = require('./coseLayout.js')
const save = require('./save.js')
const load = require('./load.js')
const totalNodes = require('./totalNodes.js')

// highlights only the selected node class
const selectionNode = cy => {
  const select = document.getElementById('selection-id')
  select.addEventListener('change', e => {
    nodeSelection(cy, e.target.value)
  })
}
const showNeighbor = (cy, selectedNode) => {
  // show the neighbors of a tapped node
  const buttonNeighbor = document.getElementById('neighbors-button')
  buttonNeighbor.addEventListener('click', () => {
    // selectedNode from cy.on tap node function
    const neighborhood = selectedNode.out.neighborhood().add(selectedNode.out)
    cy.elements().addClass('faded')
    neighborhood.removeClass('faded')
  })
}
// holds the deleted nodes
let deletedNodes = []
const deleteEl = (cy, selectedNode, selectedEdge) => {
  const buttonDelete = document.getElementById('delete')
  buttonDelete.addEventListener('click', () => {
    if (
      Object.keys(selectedNode.out).length === 0 &&
      Object.keys(selectedEdge.out).length !== 0
    ) {
      selectedEdge.out.remove()
    }
    if (
      Object.keys(selectedEdge.out).length === 0 &&
      Object.keys(selectedNode.out).length !== 0
    ) {
      deletedNodes.push(selectedNode.out)
      selectedNode.out.remove()
    }
    totalNodes(cy) // global module
  })
}
// cose layout
const layout = cy => {
  const buttonLayout = document.getElementById('layout-button')
  buttonLayout.addEventListener('click', () => {
    coseLayout(cy)
  })
}
// enable label buttons
const labels = cy => {
  const hideLabelsButton = document.getElementById('hide-label')
  hideLabelsButton.addEventListener('click', () => {
    cy.nodes().removeClass('label-nodes')
    cy.edges().removeClass('label-edges')
  })
  const showLabelsButton = document.getElementById('show-label')
  showLabelsButton.addEventListener('click', () => {
    cy.nodes().addClass('label-nodes')
    cy.edges().addClass('label-edges')
  })
  const showLabelNodeButton = document.getElementById('show-label-node')
  showLabelNodeButton.addEventListener('click', () => {
    cy.nodes().addClass('label-nodes')
  })
  const showLabelEdgeButton = document.getElementById('show-label-edge')
  showLabelEdgeButton.addEventListener('click', () => {
    cy.edges().addClass('label-edges')
  })
}
// save graph
const saveGraph = (cy, path) => {
  // save graph
  const buttonSave = document.getElementById('save-button')
  buttonSave.addEventListener('click', () => {
    save(cy, path)
  })
}
// loads a graph
const loadGraph = (cy, graphModel, cytoscape, graphStyle) => {
  const buttonLoad = document.getElementById('load-button')
  buttonLoad.addEventListener('click', () => {
    load(cy, graphModel, cytoscape, graphStyle)
  })
}
const restoreNode = () => {
  if (deletedNodes.length !== 0) {
    deletedNodes.pop().restore()
  }
}

module.exports = {
  selectionNode: selectionNode,
  layout: layout,
  deleteEl: deleteEl,
  showNeighbor: showNeighbor,
  labels: labels,
  saveGraph: saveGraph,
  restoreNode: restoreNode,
  loadGraph: loadGraph
}
