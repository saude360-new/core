import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import styles from "./styles";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";


export default function Temperatura() {
  const [dadosTemp, setDadosTemp] = useState<number[]>([]);
  const [tempAtual, setTempAtual] = useState<number | null>(null);
  const navigation = useNavigation();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔧 Substitua pelo IP e porta corretos do seu ESP32
        const response = await fetch("http://192.168.3.131:2602/sinais-vitais/temperatura");
        const data = await response.json();

        if (Array.isArray(data.valores)) {
          setDadosTemp(data.valores);
          setTempAtual(data.valores[data.valores.length - 1]); // último valor
        }
      } catch (error) {
        console.error("Erro ao buscar dados de temperatura:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.titulo}>Temperatura Corporal 🌡️</Text>

        {/* Indicador em tempo real */}
        <View style={styles.indicadorContainer}>
          <Text style={styles.indicadorLabel}>Temperatura Atual</Text>
          <Text style={[styles.indicadorValor, { color: "#ff6600" }]}>
            {tempAtual !== null ? `${tempAtual.toFixed(1)} °C` : "--"}
          </Text>
        </View>

        {/* Gráfico */}
        <LineChart
          data={{
            labels: ["1", "2", "3", "4", "5", "6"],
            datasets: [
              {
                data: dadosTemp.length ? dadosTemp : [0, 0, 0, 0, 0, 0],
                color: () => `rgba(255, 165, 0, 0.6)`, // laranja
              },
            ],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          yAxisSuffix=" °C"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: () => "#ff6600",
            labelColor: () => "#555",
            style: { borderRadius: 16 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#ff6600",
            },
          }}
          bezier
          style={styles.grafico}
        />
      </ScrollView>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
        >
          <Image source={require("../../../../imgs/home.png")} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate("Configuracoes")}
        >
          <Image source={require("../../../../imgs/engrenagem.png")} style={styles.bottomIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
