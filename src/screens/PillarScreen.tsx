import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PILLAR_THEMES, isNeurogenesisOptimal } from '../utils/pillarStyles';

const THEME = PILLAR_THEMES.HEART;

const HeartScreen = () => {
  const navigation = useNavigation();
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [isOptimal, setIsOptimal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [gaugeLevel, setGaugeLevel] = useState(65);

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const optimal = isNeurogenesisOptimal('HEART');
    const time = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setIsOptimal(optimal);
    setCurrentTime(time);
    setGaugeLevel(optimal ? Math.floor(Math.random() * 25) + 75 : Math.floor(Math.random() * 40) + 30);
  };

  const saveNote = () => {
    LayoutAnimation.easeInEaseOut();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderGaugeBar = () => {
    const color = gaugeLevel > 70 ? THEME.gradients[0] : gaugeLevel > 40 ? THEME.gradients[1] : THEME.gradients[2];
    
    return (
      <View style={styles.gaugeContainer}>
        <View style={styles.gaugeTrack}>
          <View 
            style={[
              styles.gaugeFill,
              { 
                width: `${gaugeLevel}%`,
                backgroundColor: color,
                shadowColor: color,
              }
            ]} 
          />
        </View>
        <Text style={styles.gaugeText}>{gaugeLevel}% EMOTIONAL BALANCE</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Digital Terminal Header */}
      <View style={styles.terminalHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00FF88" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.terminalTitle}>{THEME.name} TERMINAL</Text>
          <Text style={styles.sanskritTitle}>{THEME.sanskrit}</Text>
        </View>
        
        <View style={styles.statusDisplay}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <View style={[styles.statusDot, { backgroundColor: isOptimal ? '#00FF88' : '#FFB800' }]} />
        </View>
      </View>

      {/* Neurogenesis Peak Banner */}
      {isOptimal && (
        <View style={styles.peakBanner}>
          <Text style={styles.peakText}>⚡ NEUROGENESIS PEAK TIME - OPTIMAL FOR HEART</Text>
        </View>
      )}

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Status Panel */}
        <View style={[styles.statusPanel, isOptimal && styles.optimalPanel]}>
          <View style={styles.panelHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={THEME.icon as any} size={32} color={THEME.baseColor} />
            </View>
            <Text style={styles.statusText}>
              {isOptimal ? 'OPTIMAL' : 'ACTIVE'}
            </Text>
          </View>
          
          {renderGaugeBar()}
          
          <View style={styles.terminalLines}>
            <View style={styles.terminalLine} />
            <View style={styles.terminalLine} />
            <View style={styles.terminalLine} />
          </View>
        </View>

        {/* Journal Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>EMOTIONAL SYSTEM LOG</Text>
          <Text style={styles.inputSubtitle}>
            Relationships, feelings, gratitude, love, compassion, connections
          </Text>
          
          <TextInput
            style={styles.terminalInput}
            placeholder="Enter emotional state, relationship insights, gratitude notes..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={12}
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
          
          <View style={styles.inputFooter}>
            <Text style={styles.wordCount}>
              {note.split(' ').filter(w => w.length > 0).length} WORDS
            </Text>
            <Text style={styles.systemStatus}>HEART SPACE OPEN</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.saveButton, saved && styles.savedButton]}
          onPress={saveNote}
        >
          <Ionicons name="save" size={20} color="#000" />
          <Text style={styles.saveButtonText}>
            {saved ? 'DATA SAVED' : 'SAVE TO SYSTEM'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Terminal Bar */}
      <View style={styles.terminalFooter}>
        <Text style={styles.footerText}>HEART OPTIMIZATION SYSTEM ACTIVE</Text>
        <View style={styles.scanLine} />
      </View>
    </View>
  );
};

// Same styles as previous screens
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  terminalHeader: {
    backgroundColor: '#1A1A1A', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#333'
  },
  backButton: { padding: 8 },
  headerCenter: { flex: 1, alignItems: 'center' },
  terminalTitle: {
    fontSize: 20, fontWeight: '700', color: '#00FF88',
    fontFamily: 'monospace', letterSpacing: 2
  },
  sanskritTitle: { fontSize: 14, color: '#BBB', fontFamily: 'serif', marginTop: 2 },
  statusDisplay: { alignItems: 'flex-end' },
  timeText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', fontFamily: 'monospace' },
  statusDot: {
    width: 8, height: 8, borderRadius: 4, marginTop: 4,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4
  },
  peakBanner: { backgroundColor: '#00FF88', paddingVertical: 12, paddingHorizontal: 20 },
  peakText: {
    fontSize: 14, fontWeight: '700', color: '#000', fontFamily: 'monospace',
    textAlign: 'center', letterSpacing: 1
  },
  scrollContainer: { flex: 1 },
  scrollContent: { padding: 20 },
  statusPanel: {
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 20,
    borderWidth: 1, borderColor: '#333', marginBottom: 20
  },
  optimalPanel: {
    borderColor: '#00FF88', shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8
  },
  panelHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16
  },
  iconContainer: {
    width: 50, height: 50, borderRadius: 8, backgroundColor: '#2A2A2A',
    justifyContent: 'center', alignItems: 'center'
  },
  statusText: {
    fontSize: 14, fontWeight: '600', color: '#888',
    fontFamily: 'monospace', letterSpacing: 1
  },
  gaugeContainer: { marginBottom: 20 },
  gaugeTrack: { height: 10, backgroundColor: '#333', borderRadius: 5, overflow: 'hidden' },
  gaugeFill: {
    height: '100%', borderRadius: 5,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 6
  },
  gaugeText: {
    fontSize: 12, color: '#CCC', fontFamily: 'monospace',
    marginTop: 8, textAlign: 'right', letterSpacing: 1
  },
  terminalLines: { marginBottom: 8 },
  terminalLine: { height: 1, backgroundColor: '#333', marginBottom: 4, opacity: 0.5 },
  inputSection: {
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 20,
    borderWidth: 1, borderColor: '#333', marginBottom: 20
  },
  inputLabel: {
    fontSize: 16, fontWeight: '600', color: '#00FF88',
    fontFamily: 'monospace', marginBottom: 8, letterSpacing: 1
  },
  inputSubtitle: {
    fontSize: 12, color: '#888', fontFamily: 'monospace',
    marginBottom: 16, lineHeight: 16
  },
  terminalInput: {
    backgroundColor: '#000', borderRadius: 8, padding: 16, color: '#00FF88',
    fontFamily: 'monospace', fontSize: 14, minHeight: 200,
    borderWidth: 1, borderColor: '#333', textAlignVertical: 'top'
  },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  wordCount: { fontSize: 10, color: '#666', fontFamily: 'monospace' },
  systemStatus: { fontSize: 10, color: '#00FF88', fontFamily: 'monospace' },
  saveButton: {
    backgroundColor: '#00FF88', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20
  },
  savedButton: { backgroundColor: '#FFB800' },
  saveButtonText: {
    fontSize: 14, fontWeight: '700', color: '#000',
    fontFamily: 'monospace', marginLeft: 8, letterSpacing: 1
  },
  terminalFooter: {
    backgroundColor: '#1A1A1A', paddingVertical: 16, paddingHorizontal: 20,
    borderTopWidth: 1, borderTopColor: '#333', position: 'relative'
  },
  footerText: {
    fontSize: 12, color: '#00FF88', fontFamily: 'monospace',
    letterSpacing: 1, textAlign: 'center'
  },
  scanLine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 1, backgroundColor: '#00FF88', opacity: 0.8
  },
});

export default HeartScreen;
