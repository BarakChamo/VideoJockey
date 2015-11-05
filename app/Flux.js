import { Flummox } from 'flummox'

import AppActions from './actions/AppActions'
import AppStore from './stores/AppStore'

import KeyboardActions from './actions/KeyboardActions'
import KeyboardStore from './stores/KeyboardStore'

export default class Flux extends Flummox {
  constructor() {
    super()

    /*
      Initialize Action Creators
    */ 

    this.createActions('app',      AppActions)
    this.createActions('keyboard', KeyboardActions)


    /*
      Initialize Stores
    */ 

    this.createStore('app',      AppStore, this)
    this.createStore('keyboard', KeyboardStore, this)
  }
}