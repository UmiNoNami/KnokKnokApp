import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';

export default function AppScreen({ children, padded = true }) {
  return (
    <LinearGradient colors={['#F7F1E8', '#FFF8F1', '#F3E7D8']} style={styles.background}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={[styles.shell, padded && styles.padded]}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  shell: {
    flex: 1,
    backgroundColor: colors.panel,
  },
  padded: {
    marginHorizontal: 18,
    marginTop: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#4A3422',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 10,
  },
});
