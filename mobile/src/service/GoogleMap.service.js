import { PermissionsAndroid } from "react-native";
import Geolocation from 'react-native-geolocation-service';

const getPermissions = async () => {
    const fineLocation = await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION')
    const corsLocation = await PermissionsAndroid.request('android.permission.ACCESS_COARSE_LOCATION')
    if (fineLocation === 'granted' && corsLocation === 'granted')
        return true
    return false
}
const getCurrentCoordinate = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition((position) => {
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, (error) => {
            reject(error);
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
    })
}

const watchCurrentCoordinates = (callBack) => {
    const watchId = Geolocation.watchPosition(callBack, (error) => {
        reject(error);
    }, {
        interval: 100,
        distanceFilter: 1,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
    })
    return watchId
}
const clearWatchId=(watchId)=>{
    Geolocation.clearWatch(watchId)
}


export {
    getCurrentCoordinate,
    getPermissions,
    watchCurrentCoordinates,
    clearWatchId
}