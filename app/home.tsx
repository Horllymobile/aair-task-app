import {
  Appbar,
  Button,
  FAB,
  IconButton,
  MD3Colors,
  Modal,
  PaperProvider,
  Portal,
} from 'react-native-paper';
import { Dimensions, FlatList, Platform, Text, TextInput, View } from 'react-native';
import { List } from 'react-native-paper';
import { StyleSheet } from 'react-native';

import { useTaskStore } from 'libs/store/taskStore';
import { Task, TASK_STATUS } from 'models/Task';
import { router } from 'expo-router';
import EmptyState from 'components/EmptyState';
import SearchBar from 'components/SearchBar';
import { formatDate } from 'date-fns';
import { useEffect, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TaskItem from 'components/TaskItem';
const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
export default function TaskList() {
  const { tasks, deleteTask, markComplete, markUnComplete } = useTaskStore();
  const [status, setStatus] = useState(TASK_STATUS.PENDING);
  const [searchedTask, setSearchedTask] = useState<Task[]>(sortByStatus(status));
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search) {
      setSearchedTask(
        tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
      );
    } else {
      setSearchedTask(tasks);
    }
  }, [search]);

  useEffect(() => {
    setSearchedTask(sortByStatus(TASK_STATUS.PENDING));
  }, [tasks]);

  function sortByStatus(status: TASK_STATUS) {
    return tasks.sort((a, b) => {
      if (a.status === status && b.status !== status) return -1;
      if (a.status !== status && b.status === status) return 1;
      return 0;
    });
  }

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [showPicker, setShowPicker] = useState(false);
  const showDatepicker = () => {
    setShowPicker(true);
  };

  const [dueDate, setDueDate] = useState<Date | undefined>();

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    if (selectedDate) {
      setShowPicker(Platform.OS === 'ios'); // On iOS, keep picker open until explicitly closed
      setDueDate(currentDate);
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Tasks" />
        <Appbar.Action icon="filter" onPress={showModal} />
      </Appbar.Header>

      <SearchBar
        width={initialLayout.width}
        onChange={(text) => setSearch(text)}
        text={search}
        placeholder={'Search tasks'}
      />
      {searchedTask.length > 0 ? (
        <FlatList
          data={searchedTask}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              deleteTask={deleteTask}
              complete={markComplete}
              unComplete={markUnComplete}
            />
          )}
        />
      ) : (
        <EmptyState label="No Tasks" />
      )}
      <FAB
        icon="microphone-outline"
        style={styles.voiceFab}
        onPress={() => router.navigate('/add-via-voice')}
      />
      <FAB icon="plus" style={styles.plusFab} onPress={() => router.navigate('/add-task')} />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            width: '100%',
            // marginHorizontal: 20,
          }}>
          <View>
            <Text>Filter</Text>
          </View>
          <View>
            <Button onPress={showDatepicker}>
              {dueDate ? formatDate(dueDate, 'dd MMM, yyyy') : 'Due Date'}
            </Button>
            {showPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dueDate ?? new Date()}
                mode="date" // Can be 'date', 'time', or 'datetime'
                is24Hour={true}
                display="default" // Or 'spinner' for iOS, 'calendar' or 'clock' for Android
                onChange={(event, date) => onChange(event, date)}
              />
            )}
          </View>
        </Modal>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  plusFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
  voiceFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
