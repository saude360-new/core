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
    borderRadius: 40,
    marginRight: 15,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },

  buttonsContainer: {
    marginBottom: 20,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  buttonIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },

  avisosTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDD",
    borderRadius: 12,
    padding: 15,
  },

  alertIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },

  alertText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },

  // --- Gráfico ---
  titulo: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
    fontWeight: "600",
    color: "#000",
  },

  grafico: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
  },

  // --- Bottom Bar ---
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

  // --- Modal ---
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  closeButton: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
