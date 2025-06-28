import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

type ChallengeCardProps = {
  label: string;
  image: any;
  selected: boolean;
  onPress: () => void;
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({ label, image, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.icon} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    padding: 18,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});

export default ChallengeCard;
