import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import styles from "./styles";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";


export default function Saturacao() {
  const [dadosSPO2, setDadosSPO2] = useState<number[]>([]);
  const [spo2Atual, setSpo2Atual] = useState<number | null>(null);
  const navigation = useNavigation();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔧 Substitua pelo IP e porta corretos do seu ESP32
        const response = await fetch("http://192.168.3.131:2602/sinais-vitais/saturacao");
        const data = await response.json();

        if (Array.isArray(data.valores)) {
          setDadosSPO2(data.valores);
          setSpo2Atual(data.valores[data.valores.length - 1]); // último valor
        }
      } catch (error) {
        console.error("Erro ao buscar dados de saturação:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.titulo}>Saturação de Oxigênio 🩵</Text>

        {/* Indicador em tempo real */}
        <View style={styles.indicadorContainer}>
          <Text style={styles.indicadorLabel}>Nível Atual</Text>
          <Text style={[styles.indicadorValor, { color: "#0077ff" }]}>
            {spo2Atual !== null ? `${spo2Atual.toFixed(0)} %` : "--"}
          </Text>
        </View>

        {/* Gráfico */}
        <LineChart
          data={{
            labels: ["1", "2", "3", "4", "5", "6"],
            datasets: [
              {
                data: dadosSPO2.length ? dadosSPO2 : [0, 0, 0, 0, 0, 0],
                color: () => `rgba(0, 119, 255, 0.6)`, // azul suave
              },
            ],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          yAxisSuffix=" %"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#0077ff",
            labelColor: () => "#555",
            style: { borderRadius: 16 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#0077ff",
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
