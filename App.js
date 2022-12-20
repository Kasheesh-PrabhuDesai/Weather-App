import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Weather from "./components/Weather";
import { API_KEY } from "./utils/WeatherAPIKey";
import Device from "expo-device";
import * as Location from "expo-location";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [temperature, setTemperature] = useState(null);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Device.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      setLoading(true);

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        lon: location["coords"]["longitude"],
        lat: location["coords"]["latitude"],
      });
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${location["lat"]}&lon=${location["lon"]}&APPID=${API_KEY}&units=metric`
      )
        .then(res => res.json())
        .then(json => {
          setTemperature(json.main.temp);
          setWeather(json.weather[0].main);
        })
        .catch(err => console.log(err));
      setLoading(false);
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <Text style={styles.text}>
            Fetching real time data.....please wait!
          </Text>
        </>
      ) : (
        <Weather temperature={temperature} weather={weather} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
