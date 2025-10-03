import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/index';

const { width } = Dimensions.get('window');

type SessionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Session'>;

type Props = {
  navigation: SessionScreenNavigationProp;
};

type Choice = {
  name: 'Kéo' | 'Búa' | 'Bao';
  icon: 'hand-scissors' | 'hand-rock' | 'hand-paper';
  color: string;
};

type HistoryEntry = {
  player: Choice['name'];
  computer: Choice['name'];
  result: string;
  time: string;
};

const choices: Choice[] = [
  { name: 'Kéo', icon: 'hand-scissors', color: '#e74c3c' },
  { name: 'Búa', icon: 'hand-rock', color: '#7f8c8d' },
  { name: 'Bao', icon: 'hand-paper', color: '#2980b9' },
];

export default function Session({ navigation }: Props): React.JSX.Element {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const playGame = (playerMove: Choice) => {
    setPlayerChoice(playerMove);
    setIsSpinning(true);
    setResult('');
    setComputerChoice(null);

    let index = 0;
    const spinInterval = setInterval(() => {
      setComputerChoice(choices[index % choices.length]);
      index++;
    }, 150);

    setTimeout(() => {
      clearInterval(spinInterval);
      const randomIndex = Math.floor(Math.random() * choices.length);
      const compMove = choices[randomIndex];
      setComputerChoice(compMove);
      const gameResult = getResult(playerMove.name, compMove.name);
      setResult(gameResult);
      setIsSpinning(false);

      setHistory((prev) => {
        const newEntry: HistoryEntry = {
          player: playerMove.name,
          computer: compMove.name,
          result: gameResult,
          time: new Date().toLocaleTimeString(),
        };
        const updated = [newEntry, ...prev];
        return updated.slice(0, 10);
      });
    }, 2000);
  };

  const getResult = (player: Choice['name'], computer: Choice['name']): string => {
    if (player === computer) return 'Hòa rồi 😅';
    if (
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Bạn Thắng 🎉';
    }
    return 'Bạn Thua 😢';
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>← Quay lại</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 Chơi với Máy</Text>
        <Text style={styles.headerSubtitle}>Kéo Búa Bao GO!</Text>
      </View>

      {/* Nút lịch sử */}
      <TouchableOpacity style={styles.historyButton} onPress={() => setShowHistory(true)}>
        <Text style={styles.historyButtonText}>📜 Lịch sử đấu</Text>
      </TouchableOpacity>

      {/* Chọn tay */}
      <Text style={styles.title}>Chọn một nước đi</Text>
      <View style={styles.row}>
        {choices.map((choice, index) => {
          const isSelected = playerChoice?.name === choice.name;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.choice, isSelected && styles.selectedChoice]}
              onPress={() => playGame(choice)}
              disabled={isSpinning}
            >
              <View style={styles.iconCircle}>
                <FontAwesome5 name={choice.icon} size={40} color={choice.color} />
              </View>
              <Text style={styles.choiceLabel}>{choice.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Kết quả */}
      {playerChoice && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Bạn chọn: {playerChoice.name}</Text>
          {computerChoice && (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={styles.resultText}>Máy chọn:</Text>
              <FontAwesome5
                name={computerChoice.icon}
                size={70}
                color={computerChoice.color}
              />
              <Text style={styles.resultText}>{computerChoice.name}</Text>
            </View>
          )}
          {result !== '' && <Text style={styles.finalResult}>{result}</Text>}
        </View>
      )}

      {/* Modal lịch sử */}
      <Modal visible={showHistory} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowHistory(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.historyTitle}>⏱ 10 trận gần nhất:</Text>
            {history.map((item, index) => (
              <Text key={index} style={styles.historyItem}>
                [{item.time}] Bạn: {item.player} – Máy: {item.computer} → {item.result}
              </Text>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6e3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  header: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: width * 0.9,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fdf6e3',
    marginTop: 5,
  },
  historyButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#27ae60',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 20,
  },
  choice: {
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 16,
    width: 90,
  },
  selectedChoice: {
    backgroundColor: '#dff9fb',
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  iconCircle: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  choiceLabel: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  resultBox: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#34495e',
  },
  finalResult: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#e67e22',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#34495e',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
});