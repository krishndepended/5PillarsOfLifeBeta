// src/components/PillarCorrelationMatrix.tsx - CORRELATION HEATMAP BETWEEN PILLARS
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryScatter, VictoryAxis } from 'victory-native';

const { width } = Dimensions.get('window');

interface CorrelationData {
  pillar1: string;
  pillar2: string;
  correlation: number;
  color: string;
}

const PillarCorrelationMatrix: React.FC = () => {
  // Sample correlation data between pillars
  const correlationData: CorrelationData[] = [
    { pillar1: 'BODY', pillar2: 'MIND', correlation: 0.85, color: '#10B981' },
    { pillar1: 'BODY', pillar2: 'HEART', correlation: 0.72, color: '#3B82F6' },
    { pillar1: 'BODY', pillar2: 'SPIRIT', correlation: 0.68, color: '#8B5CF6' },
    { pillar1: 'BODY', pillar2: 'DIET', correlation: 0.91, color: '#EF4444' },
    { pillar1: 'MIND', pillar2: 'HEART', correlation: 0.78, color: '#EC4899' },
    { pillar1: 'MIND', pillar2: 'SPIRIT', correlation: 0.82, color: '#F59E0B' },
    { pillar1: 'MIND', pillar2: 'DIET', correlation: 0.65, color: '#06B6D4' },
    { pillar1: 'HEART', pillar2: 'SPIRIT', correlation: 0.88, color: '#84CC16' },
    { pillar1: 'HEART', pillar2: 'DIET', correlation: 0.59, color: '#F97316' },
    { pillar1: 'SPIRIT', pillar2: 'DIET', correlation: 0.71, color: '#6366F1' },
  ];

  const chartData = correlationData.map((item, index) => ({
    x: index + 1,
    y: item.correlation,
    fill: item.color,
    size: item.correlation * 100,
    label: `${item.pillar1}-${item.pillar2}`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pillar Correlation Analysis</Text>
      <Text style={styles.subtitle}>How your 5 pillars influence each other</Text>
      
      <VictoryChart
        width={width - 40}
        height={200}
        padding={{ left: 60, top: 20, right: 40, bottom: 60 }}
      >
        <VictoryAxis dependentAxis tickFormat={() => ''} />
        <VictoryAxis tickFormat={() => ''} />
        
        <VictoryScatter
          data={chartData}
          style={{
            data: { 
              fill: ({ datum }) => datum.fill,
              opacity: 0.8,
            }
          }}
          size={({ datum }) => datum.size / 10}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
      </VictoryChart>
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Correlation Strength:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Strong (0.8+)</Text>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>Moderate (0.6-0.8)</Text>
          <View style={[styles.legendDot, { backgroundColor: '#6B7280' }]} />
          <Text style={styles.legendText}>Weak (&lt;0.6)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  legendContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    marginLeft: 12,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
  },
});

export default PillarCorrelationMatrix;
