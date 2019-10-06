import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons, MaterialIcons, Foundation, Octicons } from '@expo/vector-icons';

const flashModeOrder = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
};

const flashIcons = {
    off: 'flash-off',
    on: 'flash-on',
    auto: 'flash-auto',
    torch: 'highlight'
};


const wbIcons = {
    auto: 'wb-auto',
    sunny: 'wb-sunny',
    cloudy: 'wb-cloudy',
    shadow: 'beach-access',
    fluorescent: 'wb-iridescent',
    incandescent: 'wb-incandescent',
};

class Cam extends Component{
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        ratio: '16:9',
    };
    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    getRatios = async () => {
        const ratios = await this.camera.getSupportedRatios();
        return ratios;
    };

    toggleFlash = () => this.setState({ flash: flashModeOrder[this.state.flash] });
    setRatio = ratio => this.setState({ ratio });
    toggleFocus = () => this.setState({ autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on' });
    zoomIn = () => this.setState({ zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1 });
    takePicture = () => {
        if (this.camera) {
            this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
        }
    };
    handleMountError = ({ message }) => console.error(message);

    renderTopBar = () =>
        <View
            style={styles.topBar}>
            <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFacing}>
                <Ionicons name="ios-reverse-camera" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
                <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
                <Text style={[styles.autoFocusLabel, { color: this.state.autoFocus === 'on' ? "white" : "#6b6b6b" }]}>AF</Text>
            </TouchableOpacity>
        </View>

    renderBottomBar = () =>
        <View
            style={styles.bottomBar}>
            <TouchableOpacity style={styles.bottomButton} onPress={this.toggleMoreOptions}>
                <Octicons name="kebab-horizontal" size={30} color="white" />
            </TouchableOpacity>
            <View style={{ flex: 0.4 }}>
                <TouchableOpacity
                    onPress={this.takePicture}
                    style={{ alignSelf: 'center' }}
                >
                    <Ionicons name="ios-radio-button-on" size={70} color="white" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.bottomButton} onPress={this.toggleView}>
                <View>
                    <Foundation name="thumbnails" size={30} color="white" />
                    {this.state.newPhotos && <View style={styles.newPhotosDot} />}
                </View>
            </TouchableOpacity>
        </View>


    render(){
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Sin acceso a la camara</Text>;
        } else {
            return (
                <View style={styles.container}>
                    <Camera ref={ref => {
                        this.camera = ref;
                    }}
                            style={styles.flex1}
                            type={this.state.type}
                            flashMode={this.state.flash}
                            autoFocus={this.state.autoFocus}
                            zoom={this.state.zoom}
                            ratio={this.state.ratio}
                    >
                        {this.renderTopBar()}
                        {this.renderBottomBar()}
                    </Camera>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignContent:'space-around',
        marginTop: 25,

    },
    flex1:{
        flex:1,

    },

    topBar: {
        flex:1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',

        //paddingTop: Constants.statusBarHeight / 2,
    },
    /*toggleButton: {
      flex: 0.25,
      height: 40,
      marginHorizontal: 2,
      marginBottom: 10,
      marginTop: 20,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },*/



    bottomBar:{
        flex:1,
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        alignContent:'center',

    }
});

export default Cam
