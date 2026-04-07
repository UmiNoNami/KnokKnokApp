import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppScreen from '../components/AppScreen';
import ScreenHeader from '../components/ScreenHeader';
import { conversations } from '../data/mockData';
import { colors } from '../theme/colors';

export default function MessagesScreen({ navigation }) {
  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Messages"
          title="Keep matches moving"
          subtitle="Direct messaging sits at the center of the experience so people can move from swiping to real conversations."
          onPressAction={() => navigation.navigate('Settings')}
        />

        <View style={styles.quickActions}>
          <Pressable style={styles.primaryAction}>
            <Text style={styles.primaryActionLabel}>Start new chat</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction}>
            <Text style={styles.secondaryActionLabel}>Unread only</Text>
          </Pressable>
        </View>

        {conversations.map((conversation) => (
          <View key={conversation.id} style={styles.threadCard}>
            <View style={styles.threadTopRow}>
              <Text style={styles.threadName}>{conversation.name}</Text>
              <Text style={styles.threadTime}>{conversation.time}</Text>
            </View>
            <Text style={styles.threadMessage}>{conversation.lastMessage}</Text>
          </View>
        ))}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 28,
    gap: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },
  primaryActionLabel: {
    color: '#FFF8F1',
    fontWeight: '800',
  },
  secondaryAction: {
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.secondarySoft,
  },
  secondaryActionLabel: {
    color: colors.secondary,
    fontWeight: '800',
  },
  threadCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFF8F2',
    borderWidth: 1,
    borderColor: colors.border,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  threadName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  threadTime: {
    color: colors.mutedText,
    fontSize: 12,
  },
  threadMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.mutedText,
  },
});
