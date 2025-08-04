import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimerSession {
  id: string;
  pillar: string;
  duration: number;
  type: 'FOCUS' | 'BREAK' | 'LONG_BREAK';
  startTime: number;
  endTime?: number;
}

interface FocusTimerProps {
  visible: boolean;
  onClose: () => void;
  pillar: string;
  neurogenesisOptimal: boolean;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ visible, onClose, pillar, neurogenesisOptimal }) => {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'FOCUS' | 'BREAK' | 'LONG_BREAK'>('FOCUS');
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timerPresets = {
    FOCUS: neurogenesisOptimal ? 1800 : 1500, // 30 min optimal, 25 min standard
    BREAK: 300, // 5 minutes
    LONG_BREAK: 900 // 15 minutes
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (sessionType === 'FOCUS') {
      setSessionCount(prev => prev + 1);
      const nextType = sessionCount > 0 && (sessionCount + 1) % 4 === 0 ? 'LONG_BREAK' : 'BREAK';
      Alert.alert(
        'FOCUS SESSION COMPLETE',
        `Excellent work on ${pillar}! Time for a ${nextType === 'LONG_BREAK' ? 'long' : 'short'} break.`,
        [
          { text: 'START BREAK', onPress: () => startBreak(nextType) },
          { text: 'CONTINUE FOCUS', onPress: () => resetTimer('FOCUS') }
        ]
      );
    } else {
      Alert.alert(
        'BREAK COMPLETE',
        'Ready to return to focused work?',
        [
          { text: 'START FOCUS', onPress: () => resetTimer('FOCUS') },
          { text: 'EXTEND BREAK', onPress: () => resetTimer(sessionType) }
        ]
      );
    }
  };

  const startBreak = (type: 'BREAK' | 'LONG_BREAK') => {
    setSessionType(type);
    setTimeLeft(timerPresets[type]);
    setIsRunning(true);
  };

  const resetTimer = (type: 'FOCUS' | 'BREAK' | 'LONG_BREAK') => {
    setSessionType(type);
    setTimeLeft(timerPresets[type]);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    switch (sessionType) {
      case 'FOCUS': return neurogenesisOptimal ? '#00FF88' : '#FFB800';
      case 'BREAK': return '#4ECDC4';
      case 'LONG_BREAK': return '#AA55FF';
      default: return '#FFB800';
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.timerContainer}>
          {/* Terminal Header */}
          <View style={styles.timerHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#00FF88" />
            </TouchableOpacity>
            <Text style={styles.timerTitle}>FOCUS TERMINAL</Text>
            <View style={styles.sessionCounter}>
              <Text style={styles.sessionText}>#{sessionCount + 1}</Text>
            </View>
          </View>

          {/* Pillar Info */}
          <View style={styles.pillarInfo}>
            <Text style={styles.pillarName}>{pillar} FOCUS SESSION</Text>
            <Text style={styles.sessionTypeText}>
              {sessionType} {neurogenesisOptimal && sessionType === 'FOCUS' ? '• NEUROGENESIS OPTIMAL' : ''}
            </Text>
          </View>

          {/* Timer Display */}
          <View style={[styles.timerDisplay, { borderColor: getTimerColor() }]}>
            <Text style={[styles.timeText, { color: getTimerColor() }]}>
              {formatTime(timeLeft)}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${((timerPresets[sessionType] - timeLeft) / timerPresets[sessionType]) * 100}%`,
                    backgroundColor: getTimerColor()
                  }
                ]} 
              />
            </View>
          </View>

          {/* Timer Controls */}
          <View style={styles.timerControls}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.resetButton]}
              onPress={() => resetTimer(sessionType)}
            >
              <Ionicons name="refresh" size={20} color="#666" />
              <Text style={styles.controlText}>RESET</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, styles.playButton, { backgroundColor: getTimerColor() }]}
              onPress={toggleTimer}
            >
              <Ionicons name={isRunning ? "pause" : "play"} size={24} color="#000" />
              <Text style={[styles.controlText, { color: '#000' }]}>
                {isRunning ? 'PAUSE' : 'START'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, styles.skipButton]}
              onPress={handleTimerComplete}
            >
              <Ionicons name="play-forward" size={20} color="#666" />
              <Text style={styles.controlText}>SKIP</Text>
            </TouchableOpacity>
          </View>

          {/* Session Stats */}
          <View style={styles.sessionStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>COMPLETED</Text>
              <Text style={styles.statValue}>{sessionCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>NEXT BREAK</Text>
              <Text style={styles.statValue}>
                {(sessionCount + 1) % 4 === 0 ? 'LONG' : 'SHORT'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>OPTIMIZATION</Text>
              <Text style={styles.statValue}>
                {neurogenesisOptimal ? 'HIGH' : 'STD'}
              </Text>
            </View>
          </View>

          {/* Terminal Footer */}
          <View style={styles.timerFooter}>
            <Text style={styles.footerText}>
              {sessionType === 'FOCUS' 
                ? `${pillar} FOCUS MODE ACTIVE • DEEP WORK PROTOCOL` 
                : 'NEURAL RECOVERY MODE • REST PROTOCOL'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#333',
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00FF88',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  sessionCounter: {
    backgroundColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sessionText: {
    fontSize: 12,
    color: '#00FF88',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  pillarInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pillarName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  sessionTypeText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  timerDisplay: {
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 8,
    padding: 30,
    marginBottom: 30,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  playButton: {
    flex: 2,
  },
  resetButton: {
    backgroundColor: '#333',
  },
  skipButton: {
    backgroundColor: '#333',
  },
  controlText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
    letterSpacing: 1,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 14,
    color: '#00FF88',
    fontFamily: 'monospace',
    fontWeight: '600',
    marginTop: 4,
  },
  timerFooter: {
    backgroundColor: '#0A0A0A',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#00FF88',
    fontFamily: 'monospace',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default FocusTimer;
