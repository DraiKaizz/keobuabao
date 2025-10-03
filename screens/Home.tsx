import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/index';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function Home({ navigation }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.title}>Kéo Búa Bao GO!</Text>
      </View>

      {/* Icon Choices */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => console.log('Kéo')}>
          <FontAwesome5 name="hand-scissors" size={50} color="#e67e22" />
          <Text style={styles.iconLabel}>Kéo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => console.log('Búa')}>
          <FontAwesome5 name="hand-rock" size={50} color="#7f8c8d" />
          <Text style={styles.iconLabel}>Búa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => console.log('Bao')}>
          <FontAwesome5 name="hand-paper" size={50} color="#2980b9" />
          <Text style={styles.iconLabel}>Bao</Text>
        </TouchableOpacity>
      </View>

      {/* Rules Box */}
      <View style={styles.rulesBox}>
        <View style={styles.rulesHeader}>
          <Text style={styles.rulesIcon}>📘</Text>
          <Text style={styles.rulesTitle}>Luật chơi</Text>
        </View>
        <Text style={styles.rulesText}>Chọn một trong ba: Kéo, Búa, Bao.</Text>
        <Text style={styles.rulesText}>
          Máy tính cũng sẽ chọn một nước đi và sau đó so sánh để tìm ra người thắng!
        </Text>
        <Text style={styles.rulesText}>✊ Búa thắng ✌️ Kéo</Text>
        <Text style={styles.rulesText}>✌️ Kéo thắng 🤚 Bao</Text>
        <Text style={styles.rulesText}>🤚 Bao thắng ✊ Búa</Text>

        {/* Mode Switch moved here */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.homeButton, styles.vsBot]}
            onPress={() => navigation.navigate('Session')}
          >
            <Text style={styles.buttonIcon}>🤖</Text>
            <Text style={styles.buttonText}>Chơi với máy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homeButton, styles.vsFriend]}
            onPress={() => navigation.navigate('PvsP')}
          >
            <Text style={styles.buttonIcon}>👥</Text>
            <Text style={styles.buttonText}>Chơi với bạn</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6e3',
    alignItems: 'center',
    paddingTop: 40,
  },
navbar: {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: width * 0.9,
  paddingVertical: 15,
  backgroundColor: '#f39c12', // màu cam nổi bật
  borderRadius: 20,           // bo tròn góc
  marginTop: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 5,
},
  logo: {
    fontSize: 24,
  },
title: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#ffffff', // trắng nổi bật
  textAlign: 'center',
},

  modeSwitch: {
    flexDirection: 'row',
  },
  modeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ecf0f1',
    marginLeft: 5,
  },
  modeButtonActive: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#3498db',
    marginLeft: 5,
  },
  modeText: {
    color: '#2c3e50',
  },
  modeTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    marginVertical: 30,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  rulesBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: width * 0.9,
    elevation: 3,
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rulesIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  rulesText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#34495e',
  },
  newGameButton: {
    marginTop: 20,
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  newGameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modeSwitchBottom: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 20,
},

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    width: '100%',
  },
  homeButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '40%',
    elevation: 5,
  },
  vsBot: {
    backgroundColor: '#3498db',
  },
  vsFriend: {
    backgroundColor: '#e67e22',
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },


});