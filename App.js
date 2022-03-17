import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Client, Message } from "react-native-paho-mqtt";
import PcbPanel from "./PcbPanel";
import { ScreenOrientation } from "expo";
import { FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import uuid from "react-native-uuid";

const storageID = "PCB-App-UUID";

export default function App() {
  function guidGenerator() {
    SecureStore.getItemAsync(storageID).then(
      (stored_id) => {
        setDeviceId(stored_id);
      },
      () => {
        const id = uuid.v4().substring(0, 8);
        SecureStore.setItemAsync(storageID, id).then(() => {
          setDeviceId(id);
        });
      }
    );
  }
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
  const [deviceId, setDeviceId] = useState(undefined);

  useEffect(() => {
    guidGenerator();
  }, []);

  useEffect(() => {
    if (!deviceId) {
      return;
    }
    const client = new Client({
      uri: "wss://platinenmacher.tech/mqtt",
      clientId: "pcbapp-" + deviceId,
      storage: myStorage,
    });
    client.on("connectionLost", (responseObject) => {
      if (responseObject.errorCode !== 0) {
        //setConnectionInfoString(responseObject.errorMessage);
        console.log(
          "Connection Lost",
          responseObject.errorCode,
          responseObject.errorMessage
        );
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
          setConnectionInfoString(responseObject.errorMessage);
        }
      });
  }, [deviceId]);

  let scale = Math.floor(Dimensions.get("window").width / 80);

  return (
    <View style={styles.container}>
      <Text style={styles.head}>platinenmacher.tech/pcb</Text>
      <PcbPanel scale={scale} str={pcbString} />
      <Text style={styles.status}>
        {connectionState ? "online" : "offline"}
      </Text>
      <TouchableOpacity onPress={() => {}}>
        <FontAwesome5 name="twitch" size={50} color="black" />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#243b4a",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  head: {
    fontSize: 25,
  },
  status: {
    fontSize: 15,
    color: "darkslategrey",
  },
});
