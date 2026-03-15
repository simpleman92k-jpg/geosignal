import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3 new</Text>
        </View>
      </View>
      <ScrollView style={styles.list}>

        <View style={[styles.alertCard, styles.alertHigh]}>
          <View style={styles.alertRow}>
            <View style={[styles.dot, styles.dotRed]} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>AAPL — High geo-risk</Text>
              <Text style={styles.alertSub}>Taiwan Strait escalation directly threatens your Apple position. TSMC produces 92% of Apple's chips.</Text>
            </View>
            <Text style={styles.alertTime}>14m</Text>
          </View>
        </View>

        <View style={[styles.alertCard, styles.alertHigh]}>
          <View style={styles.alertRow}>
            <View style={[styles.dot, styles.dotRed]} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>NVDA — Chip export watch</Text>
              <Text style={styles.alertSub}>Secondary sanction risk emerging. Commerce Dept review of H100 exports flagged.</Text>
            </View>
            <Text style={styles.alertTime}>1h</Text>
          </View>
        </View>

        <View style={[styles.alertCard, styles.alertMed]}>
          <View style={styles.alertRow}>
            <View style={[styles.dot, styles.dotAmber]} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>TSLA — Hidden signal</Text>
              <Text style={styles.alertSub}>Indonesia nickel regulation may raise EV battery costs 7%. Not yet covered by mainstream media.</Text>
            </View>
            <Text style={styles.alertTime}>3h</Text>
          </View>
        </View>

        <View style={[styles.alertCard, styles.alertLow]}>
          <View style={styles.alertRow}>
            <View style={[styles.dot, styles.dotGreen]} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>BTC — Safe haven signal</Text>
              <Text style={styles.alertSub}>Geopolitical risk spike historically correlates with Bitcoin inflows. Watch for +4–8% move.</Text>
            </View>
            <Text style={styles.alertTime}>14m</Text>
          </View>
        </View>

        <View style={[styles.alertCard, styles.alertLow]}>
          <View style={styles.alertRow}>
            <View style={[styles.dot, styles.dotGreen]} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>LMT — Tailwind forming</Text>
              <Text style={styles.alertSub}>Taiwan tensions accelerating defense budget discussions in Congress. Lockheed well positioned.</Text>
            </View>
            <Text style={styles.alertTime}>2h</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#fff' },
  badge: { backgroundColor: '#ef4444', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  list: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  alertCard: { borderRadius: 12, padding: 14, marginBottom: 10 },
  alertHigh: { backgroundColor: '#1a0f0f' },
  alertMed: { backgroundColor: '#1a150a' },
  alertLow: { backgroundColor: '#111' },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  dotRed: { backgroundColor: '#ef4444' },
  dotAmber: { backgroundColor: '#f59e0b' },
  dotGreen: { backgroundColor: '#4ade80' },
  alertBody: { flex: 1 },
  alertTitle: { fontSize: 13, fontWeight: '500', color: '#fff', marginBottom: 4 },
  alertSub: { fontSize: 12, color: '#888', lineHeight: 17 },
  alertTime: { fontSize: 11, color: '#555' },
});