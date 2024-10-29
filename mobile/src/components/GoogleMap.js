import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { clearWatchId, getCurrentCoordinate, getPermissions, watchCurrentCoordinates } from '../service/GoogleMap.service'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_API_KEY } from '../../configs';
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GoogleMap = () => {
    const [sourceLocation, setSourceLocation] = useState()
    const [watchId, setWatchId] = useState()
    const [destinationLocation, setDestinationLocation] = useState({
        latitude: 29.474893500243727,
        latitudeDelta: LATITUDE_DELTA,
        longitude: 77.52696472256892,
        longitudeDelta: LONGITUDE_DELTA,
    })
    const [isFetchingLocation, setIsFetchingLocation] = useState(true)
    const getCurrentLocation = async () => {
        try {
            setIsFetchingLocation(true)
            const isPermissionGranted = await getPermissions()
            if (isPermissionGranted) {
                const coordinate = await getCurrentCoordinate()
                setSourceLocation({
                    ...coordinate,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                })
                const googleWatchId = watchCurrentCoordinates(handleRealTimeCoordinates)
                setWatchId(googleWatchId)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsFetchingLocation(false)
        }
    }

    const handleRealTimeCoordinates = ({ coords }) => {
        setSourceLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        })
    }
    useEffect(() => {
        getCurrentLocation()
        return () => {
            if (watchId)
                clearWatchId(watchId)
        }
    }, [])
    return (
        <View style={styles.container}>
            {isFetchingLocation ? <Text>Loading Please Wait</Text> :
                <View style={styles.mapContainer}>
                    {sourceLocation && <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={sourceLocation}
                    >
                        {sourceLocation && <Marker coordinate={sourceLocation}
                            image={require('../../assets/images/location.png')}
                        />}
                        {destinationLocation && <Marker coordinate={destinationLocation}>
                            <Callout>
                                <View style={{}}>
                                    <Text style={{ fontWeight: "bold" }}>Destination</Text>
                                </View>
                            </Callout>
                        </Marker>}
                        <MapViewDirections
                            origin={sourceLocation}
                            destination={destinationLocation}
                            apikey={GOOGLE_MAP_API_KEY}
                            tappable={true}
                            strokeWidth={5}
                            strokeColor={'blue'}
                            mode={'DRIVING'}
                        />
                    </MapView>}
                </View>}
        </View>
    )
}

export default GoogleMap
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%'

    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});