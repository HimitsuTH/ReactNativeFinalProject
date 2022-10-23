import { StyleSheet } from "react-native";

export 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  textTile: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    textAlignVertical: "top",
    backgroundColor: "#1F1B24",
    width: 350,
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  inputDetail: {
    height: 200,
  },
  inputBox: {
    flexDirection: "column",
    justifyContent: "center",
    margin: 10,
  },
  buttonSubmit: {
    backgroundColor: "#0782f9",
  },
  button: {
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 10,
    width: 150,
  },
  buttonOutline: {
    borderColor: "#eee",
    borderWidth: 2,
  },
  lebelText: {
    fontSize: 22,
    fontWeight: "700",
  },
  textColor: {
    color: "#fff",
  },
  uploadView: {
    width: "90%",
    backgroundColor: "#1F1B24",
    height: 250,
    marginVertical: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#eee",
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
