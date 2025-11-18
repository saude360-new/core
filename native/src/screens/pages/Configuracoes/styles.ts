import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 10,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
  },
  optionButton: {
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    color: "#555",
    marginTop: 4,
  },
  cuidadorBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 15,
    padding: 12,
    marginBottom: 18,
  },
  iconSmall: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  cuidadorLabel: {
    color: "#555",
  },
  cuidadorNome: {
    fontWeight: "bold",
    color: "#000",
  },
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
});
