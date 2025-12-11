import { Task, TASK_STATUS } from 'models/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TaskState = {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
  markComplete: (task: Task) => void;
  markUnComplete: (task: Task) => void;
  refetchTask: boolean;
  setRefetch: (status: boolean) => void;
  setTaskData: (data: Omit<TaskState, 'setTaskData'>) => void;
};

export const useTaskStore = create(
  persist<TaskState>(
    (set) => ({
      tasks: [],
      addTask: (item) =>
        set((state) => {
          const tasks = [...state.tasks];

          tasks.push(item);

          console.log(tasks);
          return {
            ...state,
            tasks: tasks,
          };
        }),
      refetchTask: false,
      setRefetch: (status) =>
        set((state) => {
          return {
            ...state,
            refetchTask: status,
          };
        }),

      deleteTask: (item) =>
        set((state) => {
          const tasks = [...state.tasks];
          const position = tasks.findIndex((to) => to.id === item.id);
          tasks.splice(position, 1);
          return {
            ...state,
            tasks: tasks,
          };
        }),
      markComplete: (item) =>
        set((state) => {
          const tasks = [...state.tasks];
          console.log(tasks);
          const position = tasks.findIndex((to) => to.id === item.id);
          const task = tasks[position];
          task.status = TASK_STATUS.COMPLETED;
          console.log(tasks);
          return {
            ...state,
            tasks: tasks,
          };
        }),
      markUnComplete: (item) =>
        set((state) => {
          const tasks = [...state.tasks];
          console.log(tasks);
          const position = tasks.findIndex((to) => to.id === item.id);
          const task = tasks[position];
          task.status = TASK_STATUS.PENDING;
          console.log(tasks);
          return {
            ...state,
            Tasks: tasks,
          };
        }),
      setTaskData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
    }),
    {
      name: 'tasks',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

// export const selectTask = (state: TaskState) => ({
//   Tasks: state.Tasks,
//   setTaskData: state.setTaskData,
//   add: state.add,
// });
