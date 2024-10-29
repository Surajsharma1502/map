import { SafeAreaView, StatusBar, Text, useColorScheme, View } from 'react-native';
import GooglePlacesAutocomplete from './src/components/GooglePlacesInput'
import GoogleMap from './src/components/GoogleMap';
function App() {




  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={'light-content'} />
        {/* <GooglePlacesAutocomplete /> */}
        <GoogleMap />
    </SafeAreaView>
  );
}

export default App;
