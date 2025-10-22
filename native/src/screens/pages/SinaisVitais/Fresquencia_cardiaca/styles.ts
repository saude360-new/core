import { StyleSheet } from "react-native";

export default StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  bottomIcon: {
    width: 26,
    height: 26,
  },
  titulo: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
    fontWeight: "600",
    color: "#e60000",
  },
  grafico: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
  },
  indicadorContainer: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  indicadorLabel: {
    fontSize: 16,
    color: "#555",
  },
  indicadorValor: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#e60000",
  },
});
