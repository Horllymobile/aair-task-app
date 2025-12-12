import { formatDate } from 'date-fns';
import { Task, TASK_STATUS } from 'models/Task';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, IconButton, List, MD3Colors, Menu } from 'react-native-paper';

type TasktaskProps = {
  task: Task;
  deleteTask: (task: Task) => void;
  complete: (task: Task) => void;
  unComplete: (task: Task) => void;
};

export default function TaskItem({ task, deleteTask, complete, unComplete }: TasktaskProps) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const isDue = (dueDate: string, status: TASK_STATUS) => {
    const now = new Date();
    const date = new Date(dueDate);

    return now > date && status === TASK_STATUS.PENDING;
  };

  const getStatusColor = (task: Task) => {
    if (task.status === TASK_STATUS.COMPLETED) return '#b4f1cb';
    else if (task.dueDate && isDue(task.dueDate, task.status)) return MD3Colors.error90;
    else return '#f0d69b';
  };

  return (
    <View
      style={{
        backgroundColor: getStatusColor(task),
        // paddingVertical: 2,
        marginTop: 5,
      }}>
      <List.Item
        title={task.title}
        description={() => (
          <View style={{ gap: 5 }}>
            {task.description ? <Text>{task.description}</Text> : null}
            {task.dueDate ? (
              <Text className="text-xs" style={{ fontSize: 12 }}>
                Due On: {formatDate(task.dueDate, 'dd MMM, yyyy hh:mm a')}
              </Text>
            ) : null}

            {task.dueDate ? (
              <Text className="text-xs" style={{ fontSize: 12 }}>
                Status: {task.status}
              </Text>
            ) : null}
          </View>
        )}
        right={() => (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="dots-horizontal"
                iconColor={MD3Colors.error50}
                size={20}
                onPress={() => openMenu()}
              />
            }>
            <Menu.Item onPress={() => deleteTask(task)} leadingIcon={'delete'} title="Delete" />
            <Divider />
            <Menu.Item
              onPress={() =>
                task.status === TASK_STATUS.PENDING ? complete(task) : unComplete(task)
              }
              leadingIcon={task.status === TASK_STATUS.PENDING ? 'check' : 'cancel'}
              title={task.status === TASK_STATUS.PENDING ? 'Complete' : 'Undo'}
            />
          </Menu>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 550,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  trigger: {
    marginTop: 8,
  },
});
