import { View } from 'react-native';

export default function FormContainer({ children, style }) {
    return (
        <View style={[{ flex: 1 }, style]}>
            {children}
        </View>
    );
}