'use strict'

function Track (terminal) {
  this.data = []

  this.new = function () {
    this.clear()
  }

  // Command

  this.getCommand = function (track, cell) {
    if (this.data.commands[track] === null) { console.warn(`Unknown channel ${channel}`); return }
    if (this.data.commands[track][cell] === null) { console.warn(`Unknown cell ${cell}`); return }
    return this.data.commands[track][cell]
  }

  this.setCommand = function (track, cell, val) {
    if (this.data.commands[track] === null) { console.warn(`Unknown channel ${channel}`); return }
    if (this.data.commands[track][cell] === null) { console.warn(`Unknown cell ${cell}`); return }
    this.data.commands[track][cell] = val
  }

  // Loop

  this.get = function (channel, loop) {
    return this.data.channels[channel].loops[loop]
  }

  this.set = function (channel, loop, val) {
    this.data.channels[channel].loops[loop] = clamp(val, 0, 15)
  }

  // Note

  this.write = function (channel, loop, cell, val) {
    if (this.data.channels[channel] === null) { console.warn(`Unknown channel ${channel}`); return }
    if (this.data.channels[channel].tracks[loop] === null) { console.warn(`Unknown loop ${loop}`); return }
    if (this.data.channels[channel].tracks[loop][cell] === null) { console.warn(`Unknown cell ${cell}`); return }
    this.data.channels[channel].tracks[loop][cell] = val
  }

  this.read = function (channel, loop, cell) {
    if (this.data.channels[channel] === null) { console.warn(`Unknown channel ${channel}`); return }
    if (this.data.channels[channel].tracks[loop] === null) { console.warn(`Unknown loop ${loop}`); return }
    if (this.data.channels[channel].tracks[loop][cell] === null) { console.warn(`Unknown cell ${cell}`); return }
    return this.data.channels[channel].tracks[loop][cell]
  }

  this.clear = function () {
    const channels = []
    const commands = []
    for (let c = 0; c < 16; c++) {
      channels[c] = { loops: [], tracks: [], commands: [] }
      commands[c] = []
      for (let t = 0; t < 16; t++) {
        channels[c].loops.push(0)
        channels[c].tracks.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
        commands[c].push('')
      }
    }
    this.data.channels = channels
    this.data.commands = commands
  }

  this.stack = function () {
    const a = []
    for (const channel in this.data) {
      const loop = this.get(channel, terminal.cursor.pos.t)
      const data = this.read(channel, loop, terminal.cursor.pos.y)
      const octave = data.substr(0, 1)
      const note = data.substr(1, 1)
      a.push(`${channel}${octave}${note}`)
    }
    return a
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Track
