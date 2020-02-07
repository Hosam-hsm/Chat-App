import { action, observable } from 'mobx';
import React from 'react';
import firebase from "@firebase/app";

export default class ObservableStore {
    constructor() {
        this.database = firebase.database()
      }

    
  @observable messages: [];

  @action setMessage = (newMessage: string) => {
    this.messages = this.messages.push(newMessage);
  }
}

const observableStore = new ObservableStore();