import React from 'react'
import { GOOGLE_MAP_API_KEY } from '../../configs'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default GooglePlacesInput = ({ value, onChange, handleClick, onBlur }) => {

    const handleOnPress = (data, details) => {
        let address = {
            location: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng
            }
        };
        if (handleClick) handleClick(address)
    }

    return (
        <GooglePlacesAutocomplete
            placeholder="Type a place"
            query={{
                key: GOOGLE_MAP_API_KEY,
                components: 'country:in',
                language: 'en',
                type: 'geocode',
            }}
            fetchDetails={true}
            debounce={100}
            textInputProps={{
                placeholderTextColor: '#A6A9B1',
            }}
            disableScroll={true}
            enablePoweredByContainer={false}
            onPress={handleOnPress}
            onFail={error => console.log(36,error)}
            onNotFound={() => console.log('no results')}
            styles={{
                container: {
                    flex: 0,
                },
                description: {
                    color: 'red',
                    fontSize: 16,
                },
                row: {
                    backgroundColor: 'black'
                },
                textInput: {
                    borderColor: 'green',
                    borderWidth: 1,
                    height: 56,
                    fontSize: 14,
                    color: 'red',
                    backgroundColor: 'black',
                    marginBottom: 16
                },

            }}
        />
    );
};
