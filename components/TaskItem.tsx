import { formatDate } from 'date-fns';
import { Task, TASK_STATUS } from 'models/Task';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, IconButton, List, MD3Colors, Menu } from 'react-native-paper';

type TasktaskProps = {
  task: Task;
  deleteTask: (task: Task) => void;
  markComplete: (task: Task) => void;
  markUnComplete: (task: Task) => void;
};

export default function TaskItem({
  task,
  deleteTask,
  markComplete,
  markUnComplete,
}: TasktaskProps) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const isDue = (dueDate: string, status: TASK_STATUS) => {
    const now = new Date();
    const date = new Date(dueDate);

    return now > date && status === TASK_STATUS.PENDING;
  };

  const getStatusColor = (task: Task) => {
    if (task.dueDate && isDue(task.dueDate, task.status)) return MD3Colors.error90;
    else if (
      task.dueDate &&
      !isDue(task.dueDate, task.status) &&
      task.status === TASK_STATUS.PENDING
    )
      return '#f0d69b';
    else return '#b4f1cb';
  };

  return (
    <List.Item
      title={task.title}
      style={{
        backgroundColor: getStatusColor(task),
        marginTop: 5,
      }}
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
      right={(props) => (
        <View className="flex flex-row" style={{ display: 'flex', flexDirection: 'row' }}>
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
                task.status === TASK_STATUS.PENDING ? markComplete(task) : markUnComplete(task)
              }
              leadingIcon={task.status === TASK_STATUS.PENDING ? 'check' : 'cancel'}
              title={task.status === TASK_STATUS.PENDING ? 'Complete' : 'Undo'}
            />
          </Menu>

          {/* 

                          <IconButton
                    icon="dots-horizontal"
                    iconColor={MD3Colors.error50}
                    size={20}
                    onPress={() => deleteTask(item)}
                  />

            //       {/* <IconButton
            //         icon={item.status === TASK_STATUS.PENDING ? 'check' : 'cancel'}
            //         iconColor={MD3Colors.primary50}
            //         size={20}
            //         onPress={() =>
                      // item.status === TASK_STATUS.PENDING
                      //   ? markComplete(item)
                      //   : markUnComplete(item)
            //         }
          
          <IconButton
                    icon={task.status === TASK_STATUS.PENDING ? 'check' : 'cancel'}
                    iconColor={MD3Colors.primary50}
                    size={20}
                    onPress={() =>
                      task.status === TASK_STATUS.PENDING
                        ? markComplete(task)
                        : markUnComplete(task)
                    }
                  /> */}
        </View>
      )}
    />
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
