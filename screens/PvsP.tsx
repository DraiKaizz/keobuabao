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

type PvPNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PvsP'>;

type Props = {
  navigation: PvPNavigationProp;
};

type Choice = {
  name: 'Kéo' | 'Búa' | 'Bao';
  icon: 'hand-scissors' | 'hand-rock' | 'hand-paper';
  color: string;
};

type HistoryEntry = {
  player1: Choice['name'];
  player2: Choice['name'];
  result: string;
  time: string;
};

const choices: Choice[] = [
  { name: 'Kéo', icon: 'hand-scissors', color: '#e74c3c' },
  { name: 'Búa', icon: 'hand-rock', color: '#7f8c8d' },
  { name: 'Bao', icon: 'hand-paper', color: '#2980b9' },
];

export default function PvP({ navigation }: Props): React.JSX.Element {
  const [player1Choice, setPlayer1Choice] = useState<Choice | null>(null);
  const [player2Choice, setPlayer2Choice] = useState<Choice | null>(null);
  const [player1Confirmed, setPlayer1Confirmed] = useState(false);
  const [player2Confirmed, setPlayer2Confirmed] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  const [confirmingPlayer, setConfirmingPlayer] = useState<'P1' | 'P2' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedP1, setDisplayedP1] = useState<Choice | null>(null);
  const [displayedP2, setDisplayedP2] = useState<Choice | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const getResult = (p1: Choice['name'], p2: Choice['name']): string => {
    if (p1 === p2) return 'Hòa rồi 😅';
    if (
      (p1 === 'Búa' && p2 === 'Kéo') ||
      (p1 === 'Kéo' && p2 === 'Bao') ||
      (p1 === 'Bao' && p2 === 'Búa')
    ) {
      return 'Người chơi 1 thắng 🎉';
    }
    return 'Người chơi 2 thắng 🎉';
  };

  const handleCompare = () => {
    setIsSpinning(true);
    let index = 0;

    const spinInterval = setInterval(() => {
      setDisplayedP1(choices[index % choices.length]);
      setDisplayedP2(choices[(index + 1) % choices.length]);
      index++;
    }, 150);

    setTimeout(() => {
      clearInterval(spinInterval);
      setDisplayedP1(player1Choice);
      setDisplayedP2(player2Choice);
      const gameResult = getResult(player1Choice!.name, player2Choice!.name);
      setResult(gameResult);
      setIsSpinning(false);

      const newEntry: HistoryEntry = {
        player1: player1Choice!.name,
        player2: player2Choice!.name,
        result: gameResult,
        time: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 10));
    }, 2000);
  };

  const resetGame = () => {
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setPlayer1Confirmed(false);
    setPlayer2Confirmed(false);
    setPendingChoice(null);
    setConfirmingPlayer(null);
    setShowConfirmModal(false);
    setResult('');
    setDisplayedP1(null);
    setDisplayedP2(null);
  };

  const openConfirmModal = (choice: Choice, player: 'P1' | 'P2') => {
    setPendingChoice(choice);
    setConfirmingPlayer(player);
    setShowConfirmModal(true);
  };

  const confirmChoice = () => {
    if (confirmingPlayer === 'P1') {
      setPlayer1Choice(pendingChoice);
      setPlayer1Confirmed(true);
    } else {
      setPlayer2Choice(pendingChoice);
      setPlayer2Confirmed(true);
    }
    setShowConfirmModal(false);
    setPendingChoice(null);
    setConfirmingPlayer(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>← Quay lại</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.historyButton} onPress={() => setShowHistory(true)}>
        <Text style={styles.historyButtonText}>📜 Lịch sử đấu</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 Chơi với bạn</Text>
        <Text style={styles.headerSubtitle}>Kéo Búa Bao GO!</Text>
      </View>

      {!player1Confirmed ? (
        <>
          <Text style={styles.title}>👤 Người chơi 1 chọn</Text>
          <View style={styles.row}>
            {choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={styles.choice}
                onPress={() => openConfirmModal(choice, 'P1')}
              >
                <FontAwesome5 name={choice.icon} size={40} color={choice.color} />
                <Text style={styles.choiceLabel}>{choice.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.hiddenBox}>
          <Text style={styles.hiddenText}>👤 Người chơi 1 đã chọn</Text>
          <FontAwesome5 name="question" size={40} color="#7f8c8d" />
        </View>
      )}

      {!player2Confirmed ? (
        <>
          <Text style={styles.title}>👤 Người chơi 2 chọn</Text>
          <View style={styles.row}>
            {choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={styles.choice}
                onPress={() => openConfirmModal(choice, 'P2')}
              >
                <FontAwesome5 name={choice.icon} size={40} color={choice.color} />
                <Text style={styles.choiceLabel}>{choice.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.hiddenBox}>
          <Text style={styles.hiddenText}>👤 Người chơi 2 đã chọn</Text>
          <FontAwesome5 name="question" size={40} color="#7f8c8d" />
        </View>
      )}

      {player1Confirmed && player2Confirmed && result === '' && !isSpinning && (
        <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
          <Text style={styles.compareText}>🔍 So kết quả</Text>
        </TouchableOpacity>
      )}

      {(isSpinning || result !== '') && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {isSpinning ? '🔄 Đang so kết quả...' : '🎯 Kết quả'}
          </Text>
          <View style={styles.row}>
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>Người chơi 1</Text>
              {displayedP1 && (
                <FontAwesome5 name={displayedP1.icon} size={50} color={displayedP1.color} />
              )}
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>Người chơi 2</Text>
              {displayedP2 && (
                <FontAwesome5 name={displayedP2.icon} size={50} color={displayedP2.color} />
              )}
            </View>
          </View>
          {result !== '' && <Text style={styles.finalResult}>{result}</Text>}
          {result !== '' && (
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <Text style={styles.resetText}>🔄 Chơi lại</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* Modal xác nhận lựa chọn */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Bạn có chắc chắn chọn {pendingChoice?.name} không?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalConfirm} onPress={confirmChoice}>
                <Text style={styles.modalButtonText}>✅ Đồng ý</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setShowConfirmModal(false);
                  setPendingChoice(null);
                  setConfirmingPlayer(null);
                }}
              >
                <Text style={styles.modalButtonText}>❌ Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal lịch sử đấu */}
      <Modal visible={showHistory} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowHistory(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.historyTitle}>⏱ 10 trận gần nhất:</Text>
            {history.length === 0 ? (
              <Text style={styles.historyItem}>Chưa có trận nào</Text>
            ) : (
              history.map((item, index) => (
                <Text key={index} style={styles.historyItem}>
                  [{item.time}] P1: {item.player1} – P2: {item.player2} → {item.result}
                </Text>
              ))
            )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2c3e50',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 10,
  },
  choice: {
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 16,
    width: 90,
  },
  choiceLabel: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  hiddenBox: {
    alignItems: 'center',
    marginVertical: 20,
  },
  hiddenText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  compareButton: {
    marginTop: 20,
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  compareText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
  },
  resultItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  finalResult: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e67e22',
    marginTop: 10,
  },
  resetButton: {
    marginTop: 15,
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalConfirm: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCancel: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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