import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

const SIGNALS = [
  {
    id: 'taiwan',
    country: 'Taiwan Strait',
    time: '14 min ago',
    title: 'PLA naval drills expand to 200-mile exclusion zone',
    severity: 9.1,
    tagColor: 'red',
    tag2: 'Semiconductors',
    tag2Color: 'amber',
    coordinate: { latitude: 24.5, longitude: 122.0 },
    ripple: [
      { label: 'TSMC fab output at risk', impact: '-12%', up: false },
      { label: 'Apple / Nvidia supply chain', impact: '-6%', up: false },
      { label: 'US defense stocks', impact: '+8%', up: true },
      { label: 'Bitcoin safe haven flow', impact: '+4%', up: true },
    ],
    tickers: [
      { symbol: 'AAPL', direction: 'down', signal: 'WATCH', impact: '-6%', reason: 'TSMC manufactures 92% of Apple chips. A blockade halts production within 3 weeks.', horizon: '2–4 weeks' },
      { symbol: 'NVDA', direction: 'down', signal: 'SELL', impact: '-12%', reason: 'Nvidia H100 chips are TSMC-exclusive. Export controls + supply disruption = double risk.', horizon: '1–3 weeks' },
      { symbol: 'TSM', direction: 'down', signal: 'SELL', impact: '-18%', reason: 'Direct exposure. TSMC is the epicenter of this risk. Historically drops 15-20% on strait escalations.', horizon: 'Immediate' },
      { symbol: 'LMT', direction: 'up', signal: 'BUY', impact: '+8%', reason: 'Lockheed benefits from Taiwan tensions. Defense spending accelerates. F-35 orders likely to increase.', horizon: '1–6 months' },
      { symbol: 'BTC', direction: 'up', signal: 'WATCH', impact: '+4%', reason: 'Bitcoin historically sees safe haven inflows during geopolitical crises. Pattern held in 2022 Ukraine conflict.', horizon: '48–72 hrs' },
    ],
  },
  {
    id: 'russia',
    country: 'Russia / Black Sea',
    time: '1 hr ago',
    title: 'Grain export corridor suspended — 3rd incident this week',
    severity: 6.4,
    tagColor: 'amber',
    tag2: 'Agriculture',
    tag2Color: 'blue',
    coordinate: { latitude: 43.0, longitude: 34.0 },
    ripple: [
      { label: 'Wheat / corn futures spike', impact: '+9%', up: true },
      { label: 'US ag stocks ADM, BG', impact: '+5%', up: true },
      { label: 'Emerging market inflation', impact: '-3%', up: false },
    ],
    tickers: [
      { symbol: 'ADM', direction: 'up', signal: 'BUY', impact: '+5%', reason: 'Archer-Daniels-Midland is a direct beneficiary of grain supply shocks. Higher prices = higher margins.', horizon: '2–6 weeks' },
      { symbol: 'BG', direction: 'up', signal: 'BUY', impact: '+5%', reason: 'Bunge Global is one of the largest grain traders. Black Sea disruptions historically boost BG.', horizon: '2–6 weeks' },
      { symbol: 'WEAT', direction: 'up', signal: 'BUY', impact: '+9%', reason: 'Wheat ETF directly tracks wheat futures. Corridor suspension is an immediate catalyst.', horizon: 'Immediate' },
      { symbol: 'EEM', direction: 'down', signal: 'WATCH', impact: '-3%', reason: 'Emerging markets are most exposed to food inflation from grain supply shocks.', horizon: '1–3 months' },
    ],
  },
  {
    id: 'indonesia',
    country: 'Indonesia',
    time: '3 hr ago',
    title: 'New nickel export regulation quietly passed',
    severity: 5.2,
    tagColor: 'green',
    tag2: 'Hidden Signal',
    tag2Color: 'blue',
    coordinate: { latitude: -2.5, longitude: 118.0 },
    ripple: [
      { label: 'EV battery cost increase', impact: '+7%', up: false },
      { label: 'Tesla / Rivian margins', impact: '-4%', up: false },
      { label: 'Nickel mining stocks', impact: '+11%', up: true },
    ],
    tickers: [
      { symbol: 'TSLA', direction: 'down', signal: 'WATCH', impact: '-4%', reason: 'Tesla batteries require nickel. Supply restriction raises production costs, compressing margins.', horizon: '1–3 months' },
      { symbol: 'RIVN', direction: 'down', signal: 'SELL', impact: '-6%', reason: 'Rivian is more exposed than Tesla — less supply chain diversification and thinner margins.', horizon: '1–3 months' },
      { symbol: 'VALE', direction: 'up', signal: 'BUY', impact: '+11%', reason: 'Vale is a major nickel producer. Indonesian export restrictions increase demand for Vale supply.', horizon: '2–8 weeks' },
    ],
  },
];

type Ticker = {
  symbol: string;
  direction: string;
  signal: string;
  impact: string;
  reason: string;
  horizon: string;
};

export default function MapScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTicker, setActiveTicker] = useState<Ticker | null>(null);

  const getTag = (color: string, text: string) => {
    const s = color === 'red' ? styles.tagRed : color === 'amber' ? styles.tagAmber : color === 'green' ? styles.tagGreen : styles.tagBlue;
    return <Text style={s}>{text}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GeoSignal</Text>
        <Text style={styles.headerSub}>{SIGNALS.length} active signals</Text>
      </View>

      <MapView
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={{ latitude: 20, longitude: 60, latitudeDelta: 80, longitudeDelta: 100 }}>
        {SIGNALS.map(s => (
          <View key={s.id}>
            <Circle
              center={s.coordinate}
              radius={500000}
              fillColor={s.tagColor === 'red' ? 'rgba(239,68,68,0.15)' : s.tagColor === 'amber' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)'}
              strokeColor={s.tagColor === 'red' ? '#ef4444' : s.tagColor === 'amber' ? '#f59e0b' : '#22c55e'}
              strokeWidth={1}
            />
            <Marker
              coordinate={s.coordinate}
              onPress={() => setSelected(selected === s.id ? null : s.id)}>
              <View style={[styles.markerDot, { backgroundColor: s.tagColor === 'red' ? '#ef4444' : s.tagColor === 'amber' ? '#f59e0b' : '#22c55e' }]} />
            </Marker>
          </View>
        ))}
      </MapView>

      <ScrollView style={styles.signals}>
        <Text style={styles.sectionLabel}>LIVE SIGNALS</Text>
        {SIGNALS.map(signal => (
          <View key={signal.id}>
            <TouchableOpacity
              style={[styles.signalCard, selected === signal.id && styles.signalCardSelected]}
              onPress={() => setSelected(selected === signal.id ? null : signal.id)}>
              <View style={styles.signalHeader}>
                <Text style={styles.country}>{signal.country}</Text>
                <Text style={styles.time}>{signal.time}</Text>
              </View>
              <Text style={styles.signalTitle}>{signal.title}</Text>
              <View style={styles.tags}>
                {getTag(signal.tagColor, `Severity ${signal.severity}`)}
                {getTag(signal.tag2Color, signal.tag2)}
              </View>
            </TouchableOpacity>

            {selected === signal.id && (
              <View style={styles.ripplePanel}>
                <Text style={styles.rippleTitle}>RIPPLE CHAIN</Text>
                {signal.ripple.map((r, i) => (
                  <View key={i} style={styles.rippleRow}>
                    <View style={[styles.rippleDot, { backgroundColor: r.up ? '#22c55e' : '#ef4444' }]} />
                    <Text style={styles.rippleLabel}>{r.label}</Text>
                    <Text style={[styles.rippleImpact, { color: r.up ? '#22c55e' : '#ef4444' }]}>{r.impact}</Text>
                  </View>
                ))}
                <Text style={styles.tickerSectionLabel}>TAP A TICKER FOR DETAILS</Text>
                <View style={styles.tickerRow}>
                  {signal.tickers.map(t => (
                    <TouchableOpacity key={t.symbol} onPress={() => setActiveTicker(t)}>
                      <Text style={[styles.ticker, { borderColor: t.direction === 'up' ? '#22c55e' : '#ef4444', color: t.direction === 'up' ? '#22c55e' : '#ef4444' }]}>
                        {t.symbol}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={activeTicker !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {activeTicker && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTicker}>{activeTicker.symbol}</Text>
                  <View style={[styles.signalBadge, { backgroundColor: activeTicker.signal === 'BUY' ? '#14532d' : activeTicker.signal === 'SELL' ? '#450a0a' : '#1c1917' }]}>
                    <Text style={[styles.signalBadgeText, { color: activeTicker.signal === 'BUY' ? '#4ade80' : activeTicker.signal === 'SELL' ? '#f87171' : '#a8a29e' }]}>
                      {activeTicker.signal}
                    </Text>
                  </View>
                  <Text style={[styles.modalImpact, { color: activeTicker.direction === 'up' ? '#4ade80' : '#f87171' }]}>
                    {activeTicker.impact}
                  </Text>
                </View>
                <Text style={styles.modalReason}>{activeTicker.reason}</Text>
                <View style={styles.modalFooter}>
                  <Text style={styles.modalHorizonLabel}>Time horizon</Text>
                  <Text style={styles.modalHorizon}>{activeTicker.horizon}</Text>
                </View>
                <TouchableOpacity style={styles.modalClose} onPress={() => setActiveTicker(null)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4ade80' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#1e2a1e' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#0a0a0a' },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#4ade80' },
  headerSub: { fontSize: 13, color: '#666', marginTop: 2 },
  map: { height: 220 },
  markerDot: { width: 12, height: 12, borderRadius: 6 },
  signals: { flex: 1, paddingHorizontal: 12 },
  sectionLabel: { fontSize: 11, color: '#666', marginTop: 12, marginBottom: 8, letterSpacing: 1 },
  signalCard: { backgroundColor: '#111', borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 0.5, borderColor: '#222' },
  signalCardSelected: { borderColor: '#4ade80', borderWidth: 1.5 },
  signalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  country: { fontSize: 13, fontWeight: '500', color: '#fff' },
  time: { fontSize: 11, color: '#555' },
  signalTitle: { fontSize: 13, color: '#999', marginBottom: 8, lineHeight: 18 },
  tags: { flexDirection: 'row', gap: 6 },
  tagRed: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, backgroundColor: '#fee2e2', color: '#991b1b' },
  tagAmber: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, backgroundColor: '#fef3c7', color: '#92400e' },
  tagGreen: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, backgroundColor: '#dcfce7', color: '#166534' },
  tagBlue: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, backgroundColor: '#dbeafe', color: '#1e40af' },
  ripplePanel: { backgroundColor: '#0d1117', borderRadius: 12, padding: 14, marginBottom: 10, marginTop: -4, borderWidth: 0.5, borderColor: '#1e2a1e' },
  rippleTitle: { fontSize: 11, color: '#4ade80', fontWeight: '500', marginBottom: 10, letterSpacing: 1 },
  rippleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rippleDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  rippleLabel: { fontSize: 12, color: '#999', flex: 1 },
  rippleImpact: { fontSize: 12, fontWeight: '500' },
  tickerSectionLabel: { fontSize: 10, color: '#555', marginTop: 10, marginBottom: 6, letterSpacing: 1 },
  tickerRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  ticker: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: '#111', borderWidth: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, borderWidth: 0.5, borderColor: '#222' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  modalTicker: { fontSize: 28, fontWeight: '600', color: '#fff' },
  signalBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  signalBadgeText: { fontSize: 13, fontWeight: '600' },
  modalImpact: { fontSize: 22, fontWeight: '600', marginLeft: 'auto' },
  modalReason: { fontSize: 14, color: '#999', lineHeight: 22, marginBottom: 20 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 0.5, borderTopColor: '#222', marginBottom: 20 },
  modalHorizonLabel: { fontSize: 12, color: '#555' },
  modalHorizon: { fontSize: 13, color: '#fff', fontWeight: '500' },
  modalClose: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 14, alignItems: 'center' },
  modalCloseText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});