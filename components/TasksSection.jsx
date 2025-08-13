import React, { memo, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@constants/Colors';
import LoadingErrorWrapper from '@components/common/LoadingErrorWrapper';
import TaskCard from '@components/tasks/TaskCard';

const TasksSection = memo(({ 
  tasks, 
  loading, 
  error, 
  onRetry, 
  onTaskPress, 
  onTaskComplete, 
  onTaskDelete,
  difficultyColors,
  styles 
}) => {
  const renderTask = useCallback(({ item }) => (
    <TaskCard
      item={item}
      onPress={onTaskPress}
      onComplete={onTaskComplete}
      onDelete={onTaskDelete}
      difficultyColors={difficultyColors}
    />
  ), [onTaskPress, onTaskComplete, onTaskDelete, difficultyColors]);

  const EmptyListComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={48} color={Colors.dark.textSecondary} />
      <Text style={styles.emptyText}>No tasks yet</Text>
      <Text style={styles.emptySubtext}>
        Add your first task to get started
      </Text>
    </View>
  ), [styles]);

  return (
    <View style={styles.tasksSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <View style={styles.taskCount}>
          <Text style={styles.taskCountText}>
            {tasks?.length || 0} items
          </Text>
        </View>
      </View>

      <LoadingErrorWrapper
        loading={loading}
        error={error}
        onRetry={onRetry}
        loadingText="Loading tasks..."
      >
        <FlatList
          data={tasks || []}
          keyExtractor={(item) => item.$id}
          renderItem={renderTask}
          scrollEnabled={false}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          ListEmptyComponent={EmptyListComponent}
        />
      </LoadingErrorWrapper>
    </View>
  );
});

TasksSection.displayName = 'TasksSection';

export default TasksSection;