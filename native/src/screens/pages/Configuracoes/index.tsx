import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ScrollView 
} from "react-native";
import styles from "./styles";

export default function Configuracoes({ navigation }: any) {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceIP] = useState("http://192.168.3.131:2602"); // IP do ESP32
  const [usuario] = useState({
    nome: "João",
    cuidador: "Victor Luiz",
    idade: 72,
  });

  const conectarDispositivo = async () => {
    Alert.alert("Conectando...", "Verificando comunicação com o dispositivo.");

    try {
      const response = await fetch(`${deviceIP}/status`);
      const data = await response.json();

      if (data?.status === "online") {
        setIsConnected(true);
        Alert.alert("Conectado!", "O HealthWatch está online via Wi-Fi.");
      } else {
        throw new Error("Resposta inválida do dispositivo");
      }

    } catch (error) {
      console.log("Erro ao conectar:", error);
      Alert.alert("Falha", "Não foi possível comunicar com o dispositivo.\nVerifique o Wi-Fi.");
    }
  };

  const desconectarDispositivo = () => {
    setIsConnected(false);
    Alert.alert("Desconectado", "Você desconectou do dispositivo.");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../../imgs/usuario.png")}
            style={styles.userIcon}
          />
          <Text style={styles.welcome}>Olá {usuario.nome}!</Text>
        </View>

        {/* Dados Pessoais */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Dados Pessoais</Text>
          <Text style={styles.subText}>Idade: {usuario.idade} anos</Text>
        </TouchableOpacity>

        {/* Conexão via WiFi */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            { borderColor: isConnected ? "#34A853" : "#000" },
          ]}
          onPress={!isConnected ? conectarDispositivo : desconectarDispositivo}
        >
          <Text
            style={[
              styles.optionText,
              { color: isConnected ? "#34A853" : "#000" },
            ]}
          >
            {isConnected
              ? "Conectado ao HealthWatch (Toque para desconectar)"
              : "Conectar ao HealthWatch via Wi-Fi"}
          </Text>

          {isConnected && (
            <Text style={{ color: "#34A853", textAlign: "center" }}>
              IP: {deviceIP}
            </Text>
          )}
        </TouchableOpacity>

        {/* Cuidador */}
        <View style={styles.cuidadorBox}>
          <Image
            source={require("../../../imgs/usuario.png")}
            style={styles.iconSmall}
          />
          <View>
            <Text style={styles.cuidadorLabel}>Cuidador</Text>
            <Text style={styles.cuidadorNome}>{usuario.cuidador}</Text>
          </View>
        </View>

        {/* Sair */}
        <TouchableOpacity
          style={[styles.optionButton, { borderColor: "#ff4d4d" }]}
          onPress={() => Alert.alert("Logout", "Você saiu da conta.")}
        >
          <Text style={[styles.optionText, { color: "#ff4d4d" }]}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../../../imgs/home.png")}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../../imgs/engrenagem.png")}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
