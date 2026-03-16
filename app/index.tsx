import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { supabase } from '../lib/supabase';

type Ticker = {
  symbol: string;
  direction: string;
  signal: string;
  impact: string;
  reason: string;
  horizon: string;
};

type Signal = {
  id: number;
  country: string;
  time?: string;
  title: string;
  severity: number;
  tag1: string;
  tag2: string;
  tagColor?: string;
  tag2Color?: string;
  latitude: number;
  longitude: number;
  ripple: { label: string; impact: string; up: boolean }[];
  tickers: Ticker[];
};

export default function MapScreen() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTicker, setActiveTicker] = useState<Ticker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals();
  }, []);

  async function fetchSignals() {
    const { data, error } = await supabase.from('signals').select('*').order('created_at', { ascending: false });
    if (data) {
      const mapped = data.map(s => ({
        ...s,
        time: new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tagColor: s.severity >= 8 ? 'red' : s.severity >= 6 ? 'amber' : 'green',
        tag2Color: 'blue',
      }));
      setSignals(mapped);
    }
    setLoading(false);
  }

  const getTag = (color: string, text: string) => {
    const s = color === 'red' ? styles.tagRed : color === 'amber' ? styles.tagAmber : color === 'green' ? styles.tagGreen : styles.tagBlue;
    return <Text style={s}>{text}</Text>;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#4ade80" size="large" />
        <Text style={{ color: '#4ade80', marginTop: 12 }}>Loading signals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GeoSignal</Text>
        <Text style={styles.headerSub}>{signals.length} active signals</Text>
      </View>

      <MapView
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={{ latitude: 20, longitude: 60, latitudeDelta: 80, longitudeDelta: 100 }}>
        {signals.map(s => (
          <View key={s.id}>
            <Circle
              center={{ latitude: s.latitude, longitude: s.longitude }}
              radius={500000}
              fillColor={s.tagColor === 'red' ? 'rgba(239,68,68,0.15)' : s.tagColor === 'amber' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)'}
              strokeColor={s.tagColor === 'red' ? '#ef4444' : s.tagColor === 'amber' ? '#f59e0b' : '#22c55e'}
              strokeWidth={1}
            />
            <Marker
              coordinate={{ latitude: s.latitude, longitude: s.longitude }}
              onPress={() => setSelected(selected === String(s.id) ? null : String(s.id))}>
              <View style={[styles.markerDot, { backgroundColor: s.tagColor === 'red' ? '#ef4444' : s.tagColor === 'amber' ? '#f59e0b' : '#22c55e' }]} />
            </Marker>
          </View>
        ))}
      </MapView>

      <ScrollView style={styles.signals}>
        <Text style={styles.sectionLabel}>LIVE SIGNALS</Text>
        {signals.map(signal => (
          <View key={signal.id}>
            <TouchableOpacity
              style={[styles.signalCard, selected === String(signal.id) && styles.signalCardSelected]}
              onPress={() => setSelected(selected === String(signal.id) ? null : String(signal.id))}>
              <View style={styles.signalHeader}>
                <Text style={styles.country}>{signal.country}</Text>
                <Text style={styles.time}>{signal.time}</Text>
              </View>
              <Text style={styles.signalTitle}>{signal.title}</Text>
              <View style={styles.tags}>
                {getTag(signal.tagColor || 'green', signal.tag1)}
                {getTag(signal.tag2Color || 'blue', signal.tag2)}
              </View>
            </TouchableOpacity>

            {selected === String(signal.id) && (
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