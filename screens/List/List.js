import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Modal,
    Pressable,
    Image,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import axios from 'axios';

export default function List(datas) {
    const [data, setData] = useState([]);
    const [dataTimeDetail, setDataTimeDetail] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [timeTotal, setTimeTotal] = useState(null);
    console.log(datas);
    // useLayoutEffect(() => {
    // console.log('Ok');
    // });
    useEffect(() => {
        axios.get('http://192.168.18.27:8888/api/times').then(response => {
            const getData = response.data;
            setData(getData);
            console.log(getData?.DateTime_Create);
        });
    }, []);

    const openModal = async (id, Time_Total) => {
        setSelectedId(id); // Lưu id của mục được chọn
        setTimeTotal(Time_Total)
        setModalVisible(true);
        try {
            const response = await axios.get(
                `http://192.168.18.27:8888/api/time/${id}`,
            );
            const getData = response.data;
            // Handle data as needed, e.g., setData(getData)
            console.log(getData);
            setDataTimeDetail(getData);
        } catch (error) {
            console.error(`Error fetching data for id ${id}:`, error);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                    }}>
                    <View>
                        <Text style={{ color: 'white', fontSize: 25 }}>Danh sách đã lưu</Text>
                    </View>

                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingHorizontal: 10,
                        padding: 10,
                    }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 22, color: 'white' }}>Tổng thời gian</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 22, color: 'white' }}>Thời gian tạo</Text>
                    </View>
                </View>
                {data?.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => openModal(item?.Id, item?.Time_Total)}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                paddingHorizontal: 10,
                                padding: 5,
                            }}>
                            <View style={{ width: '50%' }}>
                                <Text style={{ color: 'white', fontSize: 20 }}>
                                    {item?.Time_Total}
                                </Text>
                            </View>
                            <View style={{ width: '50%' }}>
                                <Text style={{ color: 'white', fontSize: 20 }}>
                                    {item?.DateTime_Create}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View
                style={{
                    backgroundColor: 'red',
                    flex: 1,
                    width: '100%',
                    height: '100%',
                }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: modalVisible ? 'rgba(39, 39, 39, 0.8)' : '',
                        }}>
                        <View
                            style={{
                                width: '90%',
                                height: '80%',
                                margin: 20,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                padding: 35,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}>
                            <View>
                                <View style={{ alignItems: 'center', padding: 10 }}><Text style={{ fontWeight: '500', color: '#272727', fontSize: 50 }}>{timeTotal}</Text></View>
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                    }}>
                                    <View>
                                        <Text style={{ color: '#34c0f1', fontSize: 20 }}>Lap</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: '#34c0f1', fontSize: 20 }}>Save_Time</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: '#34c0f1', fontSize: 20 }}>Total_Time</Text>
                                    </View>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false} >
                                    {dataTimeDetail.map((item, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                width: '100%',
                                                flexDirection: 'row',
                                                marginTop: 10, padding: 10
                                            }}>
                                            <View style={{ width: '10%', alignItems: 'flex-end', }}>
                                                <Text style={{ fontSize: 18, color: '#272727' }}>{item?.Lap}</Text>
                                            </View>
                                            <View style={{ width: '42%', alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 18, color: '#272727' }}>{item.Save_Time}</Text>
                                            </View>
                                            <View style={{ width: '42%', alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 18, color: '#272727' }}>{item.Total_Time}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={{ position: 'absolute', right: 15, top: 15 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setSelectedId(null); // Đặt lại selectedId khi đóng Modal
                                    }}>
                                    <Image
                                        style={{ width: 25, height: 25 }}
                                        source={require('../../img/close_.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}
