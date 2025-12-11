import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Appbar, IconButton, MD3Colors, PaperProvider, Button } from 'react-native-paper';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';
import { Audio } from 'expo-av';

export default function AddTaskViaVoice() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [started, setStarted] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [playbackMillis, setPlaybackMillis] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState<number | null>(null);

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const onStartRecord = async () => {
    setAudioUri(null);
    setStarted(true);
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setAudioUri(audioRecorder.uri);
    setStarted(false);
  };

  const playAudio = async () => {
    if (!audioUri) return;

    // If a sound was already loaded, unload it first
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true }
    );

    newSound.setOnPlaybackStatusUpdate((status: any) => {
      if (!status.isLoaded) return;

      setIsPlaying(status.isPlaying);
      setPlaybackMillis(status.positionMillis);
      setPlaybackDuration(status.durationMillis ?? null);

      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });

    setSound(newSound);
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Action icon="arrow-left" onPress={() => {}} />
        <Appbar.Content title="Create" />
      </Appbar.Header>

      <View
        style={{
          display: 'flex',
          rowGap: 20,
          padding: 10,
          height: 550,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {!started ? (
          <IconButton
            style={{ width: 150, height: 150 }}
            size={150}
            iconColor={MD3Colors.primary50}
            onPress={onStartRecord}
            icon={'microphone-outline'}
          />
        ) : (
          <IconButton
            style={{ width: 150, height: 150 }}
            size={150}
            iconColor={MD3Colors.error50}
            onPress={stopRecording}
            icon={'microphone-off'}
          />
        )}

        {started && (
          <Text style={{ fontSize: 28 }}>{formatTime(recorderState.durationMillis || 0)}</Text>
        )}

        {!started && audioUri && (
          <View style={{ alignItems: 'center', gap: 10 }}>
            <Text>
              {isPlaying
                ? `Playing: ${formatTime(playbackMillis)}`
                : `Recorded: ${formatTime(recorderState.durationMillis || 0)}`}
              {playbackDuration != null ? ` / ${formatTime(playbackDuration)}` : ''}
            </Text>

            {!isPlaying ? (
              <Button icon="play" mode="contained" onPress={playAudio}>
                Play Recording
              </Button>
            ) : (
              <Button icon="pause" mode="contained" onPress={pauseAudio}>
                Pause
              </Button>
            )}
          </View>
        )}
      </View>
    </PaperProvider>
  );
}
