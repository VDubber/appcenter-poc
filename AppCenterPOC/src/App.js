/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import codePush from "react-native-code-push";
import Analytics from "appcenter-analytics";
import Crashes from "appcenter-crashes";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class App extends Component {

  constructor() {
    super();
    this.state = {
      codePushMessage: "",
      receivedBytes: null,
      totalBytes: null
    }
  }

  sendEvent = () => {
    Analytics.trackEvent("Custom event", { firstName: "Sam", lastName: "Po"});
  };

  nativeCrash = () => {
    await Crashes.generateTestCrash();
  };

  wrapJsCrash = () => {
    this.wrapper1();
  };

  wrapper1() {
    this.wrapper2();
  }

  wrapper2() {
    this.jsCrash();
  }

  jsCrash() {
    throw new Error("JS CRASHED");
  }


  codePushSync = () => {
    codePush.sync({
        updateDialog: true,
        installMode: codePush.InstallMode.IMMEDIATE
      },
      (status) => {
       console.warn("syncStatusChangedCallback");
        switch (status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            this.setState({codePushMessage: "Checking for updates..."});
            break;
          case codePush.SyncStatus.UP_TO_DATE:
            this.setState({codePushMessage: "Up to date!"});
            break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.setState({codePushMessage: "Fetching parcels..."});
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            this.setState({codePushMessage: "Opening & installing parcels...", receivedBytes: null, totalBytes: null});
            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        console.warn("downloadProgressCallback");
        this.setState({receivedBytes, totalBytes});
      },
      () => {
        console.warn("handleBinaryVersionMismatchCallback");
        // Called when there are any binary updates available.
        this.setState({codePushMessage: "Please fetch the app overhaul from the app store."});
      });
  };

  render() {
    const { codePushMessage, receivedBytes, totalBytes } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to App Center POC!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="Send Event" onPress={this.sendEvent} />
        <Button title="Native Crash" onPress={this.nativeCrash} />
        <Button title="JS Crash" onPress={this.wrapJsCrash} />
        <Button title="CodePush Sync" onPress={this.codePushSync} />
        <Text>{codePushMessage}</Text>
        {totalBytes && <Text>Progress {receivedBytes} / {totalBytes}</Text>}

        <Text>Added with CodePush Magic</Text>
        <Text>Added with CodePush Magic 2</Text>
      </View>
    );
  }
}

export default App; // = codePush(App); // This does the automagic stuff. No need to call sync if you use the wrapper method.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
