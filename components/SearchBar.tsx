import { TextInput, View } from 'react-native';
import { Icon, MD3Colors } from 'react-native-paper';

type SearchBar = {
  width: number;
  text: string;
  onChange?: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ width, text, onChange, placeholder }: SearchBar) {
  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 0.5,
          borderRadius: 30,
          backgroundColor: 'white',
          borderColor: MD3Colors.primary50,
          paddingHorizontal: 10,
          height: 46,
          width: width * 0.9, // 90% of screen width
        }}>
        {/* <Search style={{ marginRight: 8 }} /> */}
        <Icon source="magnify" color={MD3Colors.primary50} size={20} />
        <TextInput
          onChangeText={onChange}
          value={text}
          style={{
            flex: 1,
            fontSize: 16,
            width: width,
            color: '',
          }}
          placeholder={placeholder}
          // placeholderTextColor={THEME.colors.background + '99'}
        />
      </View>
    </View>
  );
}
