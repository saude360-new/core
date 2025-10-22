import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import styles from "./styles";

export default function Home() {
  const navigation = useNavigation();

  // Estados da detecção de quedas
  const [dadosQueda, setDadosQueda] = useState<number[]>([]);
  const [registroQuedas, setRegistroQuedas] = useState<
    { data: string; horario: string; intensidade: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔧 Substitua pelo IP e porta do seu ESP32
        const response = await fetch(
          "http://192.168.3.131:2602"
        );
        const data = await response.json();

        if (Array.isArray(data.valores)) {
          setDadosQueda(data.valores);

          // 🚨 Detecção de quedas
          const novaQueda = detectarQueda(data.valores);
          if (novaQueda) {
            const agora = new Date();
            const novaEntrada = {
              data: agora.toLocaleDateString("pt-BR"),
              horario: agora.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              intensidade: novaQueda,
            };
            setRegistroQuedas((prev) => [novaEntrada, ...prev.slice(0, 4)]); // mantém últimas 5
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  // Função simples de detecção de quedas
  const detectarQueda = (dados: number[]) => {
    if (dados.length < 2) return null;
    const ultima = dados[dados.length - 1];
    const penultima = dados[dados.length - 2];
    const diferenca = Math.abs(ultima - penultima);

    if (diferenca > 15 && diferenca <= 25) return "Leve";
    if (diferenca > 25) return "Grave";
    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image
            source={require("../../../imgs/usuario.png")}
            style={styles.userIcon}
          />
          <Text style={styles.headerTitle}>Olá João!</Text>
        </View>

        {/* Botões principais */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Freq_Cardiaca")}
          >
            <Image
              source={require("../../../imgs/coracao.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Frequência cardíaca</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Image
              source={require("../../../imgs/termometro.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Temperatura</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Image
              source={require("../../../imgs/saturacao.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Saturação de oxigênio</Text>
          </TouchableOpacity>
        </View>

        {/* Avisos */}
        <Text style={styles.avisosTitulo}>Avisos</Text>
        <TouchableOpacity style={styles.alertCard}>
          <Image
            source={require("../../../imgs/termometro.png")}
            style={styles.alertIcon}
          />
          <Text style={styles.alertText}>Temperatura</Text>
        </TouchableOpacity>

        {/* ------------------ Seção de Quedas ------------------ */}
        <Text style={styles.titulo}>Quedas 🧍‍♂️</Text>

        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text style={{ fontSize: 16, color: "#555" }}>Detecção de Queda</Text>
        </View>

        {/* Gráfico de intensidade */}
        <LineChart
          data={{
            labels: ["1", "2", "3", "4", "5", "6"],
            datasets: [
              {
                data: dadosQueda.length ? dadosQueda : [0, 0, 0, 0, 0, 0],
                color: () => `rgba(0, 0, 0, 0.5)`,
              },
            ],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: () => `#000`,
            labelColor: () => "#555",
            style: { borderRadius: 16 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#000",
            },
          }}
          bezier
          style={styles.grafico}
        />

        {/* Registro de Quedas */}
        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Registro de Quedas
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 5,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Data</Text>
            <Text style={{ fontWeight: "bold" }}>Horário</Text>
            <Text style={{ fontWeight: "bold" }}>Intensidade</Text>
          </View>

          {registroQuedas.length === 0 ? (
            <Text style={{ marginTop: 10, color: "#666" }}>
              Nenhuma queda registrada
            </Text>
          ) : (
            registroQuedas.map((q, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 6,
                  borderBottomWidth: 0.5,
                  borderColor: "#eee",
                  alignItems: "center",
                }}
              >
                <Text>{q.data}</Text>
                <Text>{q.horario}</Text>
                <View
                  style={{
                    backgroundColor:
                      q.intensidade === "Grave" ? "#e60000" : "#00c896",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {q.intensidade}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
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
