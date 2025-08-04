// src/screens/TimerScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GlassPanel from '../components/GlassPanel';

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const startTimer = () => { setSeconds(60); setRunning(true); };
  const stopTimer = () => { setRunning(false); clearInterval(intervalRef.current!); };
  const resetTimer = () => { setSeconds(60); setRunning(false); clearInterval(intervalRef.current!); };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <GlassPanel style={styles.glassContainer}>
        <Text style={styles.timeLabel}>{formatTime(seconds)}</Text>
        <View style={styles.buttonRow}>
          <Button title="Start" onPress={startTimer} disabled={running} color="#00BB88" />
          <Button title="Stop" onPress={stopTimer} disabled={!running} color="#FF5555" />
          <Button title="Reset" onPress={resetTimer} color="#444" />
        </View>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dde5ee' },
  glassContainer: { width: 320, height: 160, padding: 20, justifyContent: 'center', alignItems: 'center' },
  timeLabel: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});
