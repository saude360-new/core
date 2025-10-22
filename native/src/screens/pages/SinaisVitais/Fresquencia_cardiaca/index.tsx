import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import styles from "./styles";
import { LineChart } from "react-native-chart-kit";

export default function Freq_Cardiaca() {
  const [dadosBPM, setDadosBPM] = useState<number[]>([]);
  const [bpmAtual, setBpmAtual] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔧 Substitua pelo IP e porta do seu servidor ou ESP32
        const response = await fetch("http://192.168.3.131:2602/sinais-vitais/frequencia-cardiaca");
        const data = await response.json();

        if (Array.isArray(data.valores)) {
          setDadosBPM(data.valores);
          setBpmAtual(data.valores[data.valores.length - 1]); // último valor
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.titulo}>Frequência Cardíaca 💓</Text>

        {/* Indicador em tempo real */}
        <View style={styles.indicadorContainer}>
          <Text style={styles.indicadorLabel}>Batimentos Atuais</Text>
          <Text style={styles.indicadorValor}>
            {bpmAtual !== null ? `${bpmAtual} BPM` : "--"}
          </Text>
        </View>

        {/* Gráfico */}
        <LineChart
          data={{
            labels: ["1", "2", "3", "4", "5", "6"],
            datasets: [
              {
                data: dadosBPM.length ? dadosBPM : [0, 0, 0, 0, 0, 0],
                color: () => `rgba(255, 0, 0, 0.6)`,
              },
            ],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          yAxisSuffix=" BPM"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => `#e60000`,
            labelColor: () => "#555",
            style: { borderRadius: 16 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#e60000",
            },
          }}
          bezier
          style={styles.grafico}
        />
      </ScrollView>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Image source={require("../../../../imgs/home.png")} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../../../../imgs/engrenagem.png")} style={styles.bottomIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
