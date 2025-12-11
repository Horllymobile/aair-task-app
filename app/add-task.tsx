import { Appbar, Button, PaperProvider, TextInput } from 'react-native-paper';
import { Alert, Platform, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { useTaskStore } from 'libs/store/taskStore';
import { TASK_STATUS } from 'models/Task';
import { router } from 'expo-router';
import { formatDate } from 'date-fns';

export default function AddTask() {
  const { addTask, setRefetch } = useTaskStore();

  const [taskForm, setTaskForm] = useState<{
    title: string;
    description: string;
    dueDate: Date | undefined;
  }>({ title: '', description: '', dueDate: undefined });
  const [showPicker, setShowPicker] = useState(false);
  const showDatepicker = () => {
    setShowPicker(true);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || taskForm.dueDate;
    setShowPicker(Platform.OS === 'ios'); // On iOS, keep picker open until explicitly closed
    setTaskForm({
      ...taskForm,
      dueDate: currentDate,
    });
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Create" />
      </Appbar.Header>

      <View
        className="flex flex-col gap-y-5 p-5"
        style={{ display: 'flex', rowGap: 20, padding: 10 }}>
        <TextInput
          label="Title"
          value={taskForm.title}
          onChangeText={(text) => setTaskForm({ ...taskForm, title: text })}
        />
        <TextInput
          label="Description(Optional)"
          value={taskForm.description}
          onChangeText={(text) => setTaskForm({ ...taskForm, description: text })}
        />

        <View>
          <Button onPress={showDatepicker}>
            {taskForm.dueDate ? formatDate(taskForm.dueDate, 'dd MMM, yyyy') : 'Select Due Date'}
          </Button>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={taskForm.dueDate ?? new Date()}
              mode="date" // Can be 'date', 'time', or 'datetime'
              is24Hour={true}
              display="default" // Or 'spinner' for iOS, 'calendar' or 'clock' for Android
              onChange={(event, date) => onChange(event, date)}
            />
          )}
        </View>

        <Button
          mode="contained"
          onPress={() => {
            if (taskForm.title && taskForm.dueDate) {
              addTask({
                title: taskForm.title,
                description: taskForm.description,
                dueDate: taskForm.dueDate.toISOString(),
                createdDate: taskForm.dueDate.toISOString(),
                id: Date.now().toString(),
                status: TASK_STATUS.PENDING,
              });
              router.back();
              setRefetch(true);
            } else {
              Alert.alert('Error', 'Enter task title or select due date');
            }
          }}>
          Create
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
