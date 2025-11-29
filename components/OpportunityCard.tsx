import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';

// Define colors if you don't have the Colors file
const Colors = {
  blueColor: '#007AFF',
  greenColor: '#34C759',
  orangeColor: '#FF9500',
  primaryColor: '#000000',
  secondaryColor: '#666666',
  webBackgroundColor: '#FFFFFF',
  mobileSearchColor: '#F2F2F7',
  mobileBackgroundColor: '#F8F9FD',
};

interface OpportunityCardProps {
  type: string;
  title: string;
  company: string;
  duration?: string;
  stipend?: string;
  amount?: string;
  deadline: string;
  description?: string;
  tags: string[];
  onCardPress?: () => void;
  id?: string; // Add id for Firebase document reference
}

const OpportunityCard = ({
  type,
  title,
  company,
  duration,
  stipend,
  amount,
  deadline,
  description,
  tags,
  onCardPress,
  id,
}: OpportunityCardProps) => {
  const { user } = useUser();
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applicationCount, setApplicationCount] = useState(0);

  const handleApply = () => {
    if (type !== 'Achievement') {
      Alert.alert(
        'Apply for Opportunity',
        `Apply for ${title} at ${company}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Apply', 
            onPress: async () => {
              try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // In a real app, you would call databaseService here
                // await databaseService.applyForOpportunity(id, user.uid, {
                //   title,
                //   company,
                //   type,
                //   applicantName: user.username,
                //   applicantEmail: user.email
                // });
                
                setIsApplied(true);
                setApplicationCount(prev => prev + 1);
                Alert.alert('Success', 'Application submitted successfully!');
              } catch (error) {
                Alert.alert('Error', 'Failed to submit application');
              }
            }
          },
        ]
      );
    }
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would call databaseService here
      // if (isSaved) {
      //   await databaseService.unsavePost(id, user.uid);
      // } else {
      //   await databaseService.savePost(id, user.uid);
      // }
      
      setIsSaved(!isSaved);
      Alert.alert(isSaved ? 'Removed from saved' : 'Saved to favorites');
    } catch (error) {
      Alert.alert('Error', 'Failed to save opportunity');
    }
  };

  const handleCardPress = () => {
    if (onCardPress) {
      onCardPress();
    } else {
      // Default behavior if no onCardPress provided
      Alert.alert(
        'Opportunity Details', 
        `${title}\n\n${company}\n\n${description || 'No description available'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'Internship':
        return Colors.blueColor;
      case 'Scholarship':
        return Colors.greenColor;
      case 'Achievement':
        return Colors.orangeColor;
      default:
        return Colors.blueColor;
    }
  };

  const buildDetailItem = (icon: string, text: string) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );

  const getTypeEmoji = () => {
    switch (type) {
      case 'Internship':
        return '💼';
      case 'Scholarship':
        return '🎓';
      case 'Achievement':
        return '🏆';
      default:
        return '📌';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeEmoji}>{getTypeEmoji()}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor() },
            ]}
          >
            <Text style={styles.typeText}>{type}</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveIcon}>{isSaved ? '🔖' : '📑'}</Text>
          </TouchableOpacity>
          
          {type !== 'Achievement' && (
            <TouchableOpacity 
              style={[
                styles.applyButton,
                isApplied && styles.appliedButton
              ]} 
              onPress={handleApply}
              disabled={isApplied}
            >
              <Text style={styles.applyText}>
                {isApplied ? '✓ Applied' : 'Apply Now'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Clickable content area */}
      <TouchableOpacity 
        style={styles.clickableArea}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.company}>{company}</Text>

        {(duration || stipend || amount) && (
          <View style={styles.detailsRow}>
            {duration && buildDetailItem('⏱️', duration)}
            {stipend && buildDetailItem('💰', stipend)}
            {amount && buildDetailItem('💵', amount)}
          </View>
        )}

        {description && (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        )}

        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.deadline}>
          <Text style={styles.deadlineIcon}>📅</Text>
          <Text style={styles.deadlineText}>Deadline: {deadline}</Text>
        </View>

        {applicationCount > 0 && (
          <Text style={styles.applicationCount}>
            {applicationCount} {applicationCount === 1 ? 'person has' : 'people have'} applied
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.webBackgroundColor,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.mobileSearchColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.mobileSearchColor,
  },
  saveIcon: {
    fontSize: 18,
  },
  applyButton: {
    backgroundColor: Colors.greenColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  appliedButton: {
    backgroundColor: Colors.secondaryColor,
  },
  applyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  clickableArea: {
    flex: 1,
  },
  title: {
    color: Colors.primaryColor,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 24,
  },
  company: {
    color: Colors.secondaryColor,
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  detailText: {
    color: Colors.secondaryColor,
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    color: Colors.primaryColor,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.mobileSearchColor,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    color: Colors.primaryColor,
    fontSize: 12,
    fontWeight: '500',
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deadlineIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  deadlineText: {
    color: Colors.secondaryColor,
    fontSize: 14,
    fontWeight: '500',
  },
  applicationCount: {
    color: Colors.blueColor,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default OpportunityCard;