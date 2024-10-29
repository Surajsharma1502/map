import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { clearWatchId, decodePolyline, getCurrentCoordinate, getPermissions, watchCurrentCoordinates } from '../service/GoogleMap.service'
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_API_KEY } from '../../configs';
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GoogleMap = () => {
    const [sourceLocation, setSourceLocation] = useState()
    const [watchId, setWatchId] = useState()
    const [routeCoordinate, setRouteCoordinate] = useState([])
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
                await getDirectionApi(coordinate, destinationLocation)
                // const googleWatchId = watchCurrentCoordinates(handleRealTimeCoordinates)
                // setWatchId(googleWatchId)
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
    const getDirectionApi = async (origin, destination) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAP_API_KEY}`
            );
            const data = await response.json();
            const coordinates = decodePolyline(data.routes[0].overview_polyline.points)
            setRouteCoordinate(coordinates)
            moveLocation(coordinates)
        } catch (error) {
            console.log(error)
        }
    }

    const moveLocation = (coordinate) => {
        var i = 0

        let timeInterval=setInterval(() => {
            if(i>=coordinate.length){
                clearInterval(timeInterval)

            }else{
                setSourceLocation((old) => ({ ...old, ...coordinate[i] }))
                setRouteCoordinate(old=>old.slice(1))
                i++
            }
        }, 1000)
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
                        {routeCoordinate.length ? <Polyline
                            coordinates={routeCoordinate}
                            fillColor='blue'
                            strokeColor='blue'
                            strokeWidth={5}
                        />:<></>}
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