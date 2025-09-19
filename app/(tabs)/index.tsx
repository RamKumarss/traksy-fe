import * as BackgroundTask from "expo-background-task";
import { Image } from "expo-image";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import React from "react";
import { Alert, Button, Platform, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchDistanceData, sendLocationData } from "@/services/api";

const BACKGROUND_TASK = "daily-location-task";

const fetchLocationData = async () => {
  try {
    console.log("Background task running...");

    // // Call Google API
    const googleRes = await fetchDistanceData();

    // Send to sendLocationData API
    await sendLocationData(googleRes);
    // return BackgroundTask.Result.NewData;
  } catch (err) {
    console.error("Background task error:", err);
    // return BackgroundTask.Result.Failed;
  }
};
// Background task definition
TaskManager.defineTask(BACKGROUND_TASK, async () => {
  fetchLocationData();
});

export default function AdminTrackerScreen() {

  const askPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need location permission to continue."
      );
      return;
    }

    if (Platform.OS === "web") {
      fetchLocationData();
    } else {
      // Ask for background permission
      let bgStatus = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus.status !== "granted") {
        Alert.alert(
          "Background permission denied",
          "Enable background location for full features."
        );
        return;
      }

      // Register background task
      await BackgroundTask.registerTaskAsync(BACKGROUND_TASK, {
        minimumInterval: 30,
      });

      Alert.alert("Success", "Background task scheduled!");
    }
  };

  // if (loading) return <Text>Loading...</Text>;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={{
            uri: "https://www.airindia.com/content/dam/air-india/newsroom/press-releases/images/AirIndiaA350.png",
          }}
          style={styles.reactLogo}
          contentFit="cover"
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Location Tracker</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Button
          title="Enable Daily Location Tracking"
          onPress={askPermission}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
