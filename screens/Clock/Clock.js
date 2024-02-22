import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import FontIcon6 from 'react-native-vector-icons/FontAwesome6';
import AntIcon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

export default function Clock() {
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapTime, setElapTime] = useState(0);
    const [timeMarkers, setTimeMarkers] = useState([]);
    const [totalTimes, setTotalTimes] = useState([]);
    const [isShow, setIsShow] = useState(false)

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                const now = new Date().getTime();
                setElapTime(now - startTime);
            }, 100);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning, startTime]);
    const handleRun = () => {
        console.log('ok');
        if (isRunning) {
            setIsRunning(false);
        } else {
            const now = new Date().getTime();
            setStartTime(now - elapTime);
            setIsRunning(true);
        }
    };
    const handleSaveTime = () => {
        if (isRunning) {
            const currentElapsedTime = new Date().getTime() - startTime;
            const elapsedTimeSinceLastSave =
                currentElapsedTime - timeMarkers.reduce((acc, time) => acc + time, 0);
            setTimeMarkers([...timeMarkers, elapsedTimeSinceLastSave]);
            setElapTime(0);
            setIsShow(true)
            setTotalTimes([...totalTimes, currentElapsedTime]);
        }
    };
    const saveTimeAPI = async () => {
        try {
            console.log('vo');

            const res = await axios.get('http://192.168.18.27:8888/api/times');
            console.log(res?.data);

        } catch (error) {
            console.log(error.message);
        }
    }
    const handleStop = () => {
        setIsRunning(false);
        setElapTime(0);
        setTimeMarkers([]);
        setTotalTimes([]);
        setIsShow(false)
    };
    const createTimeAPI = async () => {
        const postData = {
            Time_Total: formatTime(elapTime),
            Laps: timeMarkers.map((lap, index) => ({
                lap: index + 1,
                time: formatTime(lap),
                total: formatTime(timeMarkers.slice(0, index + 1).reduce((acc, time) => acc + time, 0)),
            })),
        };
        console.log(totalTimes);
        console.log(postData);
        try {
            console.log('vo');
            const res = await axios.post('http://192.168.18.27:8888/api/times', postData);
            console.log(res?.data);
        } catch (error) {
            console.log(error.message);
        }
        setIsRunning(false);
        setElapTime(0);
        setTimeMarkers([]);
        setTotalTimes([]);
        setIsShow(false)

    }
    useEffect(() => {
        saveTimeAPI()
    }, [])
    const formatTime = milliseconds => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(milliseconds % 1000)
            .padStart(3, '0')
            .slice(0, 2);
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
    };
    return (
        <SafeAreaView style={{ backgroundColor: '#272727', height: '100%' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={styled.textShow}>{formatTime(elapTime)}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 40,
                        alignItems: 'center',
                        marginTop: 10,
                    }}>
                    <TouchableOpacity onPress={handleRun}>
                        <View>
                            {isRunning ? (
                                <View style={{ backgroundColor: '#c992d3', width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                                    <FontIcon6 color='#121212' size={30} name="pause"></FontIcon6>
                                </View>
                            ) : (
                                <View style={{ backgroundColor: '#c992d3', width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                                    <FontIcon6 size={25} name="play"></FontIcon6>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveTime} disabled={!isRunning}>
                        <View style={{ backgroundColor: '#303030', width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                            <FontIcon6 color='#7b7b7b' size={25} name="flag"></FontIcon6>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStop}>
                        <View style={{ backgroundColor: '#303030', width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                            <AntIcon color='#7b7b7b' size={25} name="back"></AntIcon>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <SafeAreaView>
                <View>
                    {
                        isShow ? (<View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 40, borderBottomWidth: 1, borderBottomColor: '#3e3542', marginBottom: 10, paddingBottom: 10 }}>
                            <Text style={[styled.textView, { width: '18%' }]} >Lap</Text>
                            <Text style={[styled.textView, { width: '40%' }]}>Time</Text>
                            <Text style={[styled.textView, { width: '35%' }]}>Total</Text>
                        </View>) : ''
                    }
                </View>
                <ScrollView style={{ height: '60%', width: '100%' }}>
                    <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center' }}>
                        <View style={{ gap: 10 }}>
                            {timeMarkers
                                .map((mark, index) => (
                                    <View key={index}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    fontSize: 20,
                                                    marginRight: 20,
                                                    width: 30,
                                                }}>
                                                {index + 1}
                                            </Text>
                                            <View style={{ width: 120 }}>
                                                <Text style={{ color: '#FFFFFF', fontSize: 20 }}>
                                                    {formatTime(mark)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                                .reverse()}
                        </View>
                        <View style={{ gap: 10 }}>
                            {totalTimes
                                .map((total, index) => (
                                    <Text key={index} style={{ color: '#FFFFFF', fontSize: 20 }}>
                                        {formatTime(total)}
                                    </Text>
                                ))
                                .reverse()}
                        </View>
                    </View>
                </ScrollView>
                <View>
                    {isShow ? (<View style={{ borderTopWidth: 1, borderTopColor: "#3e3542", height: 60, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => createTimeAPI()}>
                            <View>
                                <Text style={{ color: '#FFFFFF', fontSize: 20 }}>
                                    Lưu
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>) : ''}
                </View>
            </SafeAreaView>
        </SafeAreaView>
    );
}
const styled = StyleSheet.create({
    textShow: {
        color: '#FFFFFF',
        fontSize: 60,
    },
    textView: {
        color: '#FFFFFF',
        fontSize: 20,
    },
});
