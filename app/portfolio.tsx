import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio Risk</Text>
        <Text style={styles.score}>72 <Text style={styles.scoreLabel}>High</Text></Text>
        <Text style={styles.headerSub}>3 active threats affecting your holdings</Text>
      </View>
      <ScrollView style={styles.list}>
        <Text style={styles.sectionLabel}>YOUR HOLDINGS</Text>

        <View style={styles.holdingCard}>
          <View style={styles.holdingRow}>
            <Text style={styles.ticker}>AAPL</Text>
            <Text style={styles.holdingName}>Apple Inc.</Text>
            <Text style={styles.riskHigh}>High</Text>
          </View>
          <Text style={styles.holdingReason}>Taiwan Strait risk — TSMC supply chain exposure</Text>
        </View>

        <View style={styles.holdingCard}>
          <View style={styles.holdingRow}>
            <Text style={styles.ticker}>NVDA</Text>
            <Text style={styles.holdingName}>Nvidia Corp.</Text>
            <Text style={styles.riskHigh}>High</Text>
          </View>
          <Text style={styles.holdingReason}>Taiwan Strait + chip export controls</Text>
        </View>

        <View style={styles.holdingCard}>
          <View style={styles.holdingRow}>
            <Text style={styles.ticker}>BTC</Text>
            <Text style={styles.holdingName}>Bitcoin</Text>
            <Text style={styles.riskLow}>Low</Text>
          </View>
          <Text style={styles.holdingReason}>Safe haven inflow during Taiwan event</Text>
        </View>

        <View style={styles.holdingCard}>
          <View style={styles.holdingRow}>
            <Text style={styles.ticker}>TSLA</Text>
            <Text style={styles.holdingName}>Tesla Inc.</Text>
            <Text style={styles.riskMed}>Medium</Text>
          </View>
          <Text style={styles.holdingReason}>Indonesia nickel regulation — battery cost risk</Text>
        </View>

        <View style={styles.holdingCard}>
          <View style={styles.holdingRow}>
            <Text style={styles.ticker}>LMT</Text>
            <Text style={styles.holdingName}>Lockheed Martin</Text>
            <Text style={styles.riskLow}>Low</Text>
          </View>
          <Text style={styles.holdingReason}>Taiwan tensions = defense spending tailwind</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 20, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  headerTitle: { fontSize: 13, color: '#666', marginBottom: 4 },
  score: { fontSize: 36, fontWeight: '600', color: '#fff' },
  scoreLabel: { fontSize: 18, color: '#f87171' },
  headerSub: { fontSize: 12, color: '#666', marginTop: 4 },
  list: { flex: 1, paddingHorizontal: 12 },
  sectionLabel: { fontSize: 11, color: '#666', marginTop: 12, marginBottom: 8, letterSpacing: 1 },
  holdingCard: { backgroundColor: '#111', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: '#222' },
  holdingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ticker: { fontSize: 15, fontWeight: '600', color: '#fff', width: 52 },
  holdingName: { fontSize: 13, color: '#999', flex: 1 },
  holdingReason: { fontSize: 12, color: '#555', lineHeight: 17 },
  riskHigh: { fontSize: 12, fontWeight: '500', color: '#f87171' },
  riskMed: { fontSize: 12, fontWeight: '500', color: '#fbbf24' },
  riskLow: { fontSize: 12, fontWeight: '500', color: '#4ade80' },
});