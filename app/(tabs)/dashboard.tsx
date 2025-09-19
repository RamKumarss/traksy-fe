import { getUserData, usersArrivalData } from "@/services/api";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState<null | boolean>(false); // null until checked
  const [arrivalData, setArrivalData] = useState<any[]>([]);

  const getArrivalData = async () => {
    const response = await usersArrivalData();
    setArrivalData(response || []);
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const user = await getUserData();
      if (user?.role === "admin") {
        setIsAdmin(true);
        getArrivalData();
      } else {
        setIsAdmin(false);
      }
    };

    checkUserRole();
  }, []); // Re-run when userName changes

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={[styles.cell, styles.headerCell]}>
          Access Denied: Admins Only
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        {/* Header Row */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>Name</Text>
          <Text style={[styles.cell, styles.headerCell]}>Distance</Text>
          <Text style={[styles.cell, styles.headerCell]}>Expected Time</Text>
        </View>

        {/* Data Rows */}
        {arrivalData.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
          >
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.distance}</Text>
            <Text style={styles.cell}>{item.duration}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width, // full width with margin
    paddingTop: 20,
    overflow: "hidden",
    backgroundColor: "#1c1c1e", // dark theme background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: "#333",
  },
  evenRow: {
    backgroundColor: "#2a2a2a",
  },
  oddRow: {
    backgroundColor: "#1f1f1f",
  },
  cell: {
    flex: 1,
    padding: 12,
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#00ff9d", // highlight header text with neon green
  },
});
