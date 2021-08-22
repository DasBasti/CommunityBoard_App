import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { Client, Message } from "react-native-paho-mqtt";
import PcbPanel from "./PcbPanel";
import { ScreenOrientation } from "expo";

export default function App() {
  //Set up an in-memory alternative to global localStorage
  const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key];
    },
  };

  const [pcbString, setPcbString] = useState(
    "gggggggggwgwggwggwggwgwggwgggwwggwggwgwggggwggwggogwggwggggggggg"
  );

  const client = new Client({
    uri: "wss://platinenmacher.tech/mqtt",
    clientId: "pcbapp-" + Constants.deviceId,
    storage: myStorage,
  });
  client.on("connectionLost", (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log(responseObject.errorMessage);
    }
  });
  client.on("messageReceived", (message) => {
    setPcbString(message.payloadString);
    console.log(message.payloadString);
  });

  console.log(Constants.deviceId);
  // connect the client
  client.connect().then(() => {
    return client.subscribe("pcb/all/stream/enc");
  });

  return (
    <View style={styles.container}>
      <PcbPanel str={pcbString} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#243b4a",
    alignItems: "center",
    justifyContent: "center",
  },
});
