import { Store } from 'flummox'

export default class ApplicationStore extends Store {
  constructor(flux) {
    super()

    // Set Initial State
    this.state = {}


    /*
      Event Registration
    */ 

    // Get actions
    const AppActionIds = flux.getActionIds('app')

    // Reigster handlers
    // this.register(keyboardActionIds.KEY_UP,       this.handleKeyUp)
    // this.register(keyboardActionIds.KEY_DOWN,     this.handleKeyDown)

    // // Bind to MIDI (OMG!!! MIDI in the browser! WTF!)
    // midi.on('ON', (note, velocity) => this.handleKeyDown(note, velocity, true) )
    // midi.on('OFF', note            => this.handleKeyUp(note, true) )


    /*
      Event Registration
    */ 
  }
}