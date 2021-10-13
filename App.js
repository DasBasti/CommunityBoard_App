import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { Client, Message } from "react-native-paho-mqtt";
import PcbPanel from "./PcbPanel";
import { ScreenOrientation } from "expo";

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

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
    "sssssssssssssbsswsssssbsswssssbssswgsbssssgggbsssssgbsbssssssbss"
  );
  const [connectionState, updateConnectionState] = useState(false);
  const [connectionInfoString, setConnectionInfoString] = useState("");
  const deviceId = guidGenerator();
  const client = new Client({
    uri: "wss://platinenmacher.tech/mqtt",
    clientId: "pcbapp-" + deviceId,
    storage: myStorage,
  });
  client.on("connectionLost", (responseObject) => {
    if (responseObject.errorCode !== 0) {
      //setConnectionInfoString(responseObject.errorMessage);
      console.log(responseObject.errorMessage);
    }
    updateConnectionState(false);
  });
  client.on("messageReceived", (message) => {
    setPcbString(message.payloadString);
    console.log(message.payloadString);
  });

  // connect the client
  client
    .connect()
    .then(() => {
      return client.subscribe("pcb/all/stream/enc");
    })
    .then(() => {
      updateConnectionState(true);
    })
    .catch((responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        setConnectionInfoString(responseObject.errorMessage);
      }
    });

  let scale = Math.floor(Dimensions.get("window").width / 80);

  return (
    <View style={styles.container}>
      <Text>{connectionState ? "online" : "offline"}</Text>
      <PcbPanel scale={scale} str={pcbString} />
      <Text>{connectionInfoString}</Text>
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
