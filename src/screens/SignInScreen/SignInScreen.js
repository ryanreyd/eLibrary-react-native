import React, {useContext, useEffect, useState} from 'react';
import { 
    View, 
    ScrollView,
    Image, 
    StyleSheet,
    useWindowDimensions, 
    Dimensions,
    ToastAndroid,
    Text,
    StatusBar} from 'react-native';
import Logo from '../../../assets/images/test_logo.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation , useIsFocused} from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../navigation/AuthProvider';
import auth from '@react-native-firebase/auth'
import Warnigs from '../../components/Warnings/Warnigs';
import Verify from '../../components/Verify/Verify';
import appLogo from '../../../assets/images/appIcon.png'

//Login page/screen
const { height, width } = Dimensions.get('window');
const SignInScreen = ({route, navigation}) => {
   
    const {control, handleSubmit, watch} = useForm(''); //control Text intput

    const {login,logout, showModal, setShowModal, messageToUnverifiedUser, setUserEmail,}= useContext(AuthContext); // access method provided by auth context
    const watchPassword = watch('password'); //get updated value of the password Text intput
    const watchEmail = watch('email');  //get updated value of the email Text intput
    const [errMsg, setErrMsg] = useState('') 
    const [showErrMsg, setShowErrMsg] = useState(false);
    const isFocused = useIsFocused();
    
    const loginInPressed = async() => {
        const result  = await login(watchEmail, watchPassword) //get email and password then login
        const userCreate = auth().currentUser; //get user authentication state 
       // setShowModal(true)
        if(result instanceof Error){
            // make the first letter capital, fro error message
            setErrMsg(result.code.charAt(0).toUpperCase()+result.code.slice(1)); 
            setShowErrMsg(true);
        }else if(!userCreate.emailVerified) { 
            setUserEmail(watchEmail);
            setShowModal(true);
            // can't log in if user email address is not verified
            logout()// logout not verified user
            //alert('Please verfiy your email address first. Email verfication link is sent to '+watchEmail);

        }
    };

    useEffect(()=>{
        if (!isFocused) {
            setShowModal(false)
        }

    },[])
    
    //navigate to create account page 1 if press
    const createAccountPressed =() =>{
        setShowErrMsg(false)
        setShowModal(false)
        navigation.navigate('SignUpPage1')
   };
   //navigate to create forgot password  screen if press
    const forgotPasswordPressed =() =>{
        setShowErrMsg(false)
        setShowModal(false)
        navigation.navigate('ForgotPasswordScreen');
    };

    const LoginHeaderView = () =>{
        return(
            <View style={styles.loginHeader}>
                <View>
                    <Text style={styles.headerText}>Hello, Welcome to </Text>
                    <Text style={styles.appName}>eLibrary</Text>
                    <Text style={styles.headerTextSm}>"Read books with no boundaries."</Text>
                </View>
                 <View style={styles.logo}>
                     <Image source={appLogo} style={{height: 500, width: 700 }} resizeMode="contain" /> 
                </View>   
            </View> 
        )
    }

/*     const LoginBodyView = () =>{
        return(
            
        )
    }
 */
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <StatusBar backgroundColor='#14C38E' barStyle={'light-content'}/>
            <Verify showModal={showModal} message={messageToUnverifiedUser}/>
            <View style={styles.root}>
                <View style={styles.headOuterWrapper}>
                    <View style={styles.logo}>
                        <Image source={appLogo} style={{height: 500, width: 700 }} resizeMode="contain" /> 
                    </View>   
                    <View style={styles.headInnerWrapper}>
                        <View style={styles.head}>
                            <LoginHeaderView/>
                        </View>
                    </View>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.body}>
                        <View style={styles.errorArea}>
                            <Warnigs showError={showErrMsg} errorMessage={errMsg}/>
                        </View>
                        <View style={styles.logInBody}>
                           <Text style={styles.loginText}>Sign in to your account</Text>
                            <CustomInput
                                name="email"
                                control={control}
                                placeholder="Enter your email"
                                icon1="email-remove"
                                icon2="email-check"
                                rules={{required: "Please enter your email"}} //if no input 
                            />
                            <CustomInput
                                name="password"
                                control={control}
                                placeholder="Enter your password"
                                icon1="account-lock"
                                icon2="account-lock-open"
                                secureTextEntry={true}
                                rules={{
                                    required: "Please enter your password",//if no input 
                                }}
                            />
                            <View style={styles.buttons}>
                                <View style={styles.login}>
                                    <CustomButton text="Login"  onPress={handleSubmit(loginInPressed)}/>
                                </View>
                                <View style={styles.create}>
                                    <CustomButton text="Create an account" onPress={createAccountPressed} type="SECONDARY"/>
                                </View>
                                <View style={styles.forgot}>
                                    <CustomButton text="Forgot Password?" onPress={forgotPasswordPressed} type="TERTIARY"/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root:{
        display: 'flex',
        width: width *1,
        height: height *1,
        backgroundColor: 'white',
    },
    headInnerWrapper:{
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 0,
    },
    headOuterWrapper:{
        flex: 4,
        backgroundColor: '#14C38E',
        paddingBottom: 45,
    },
    head:{
        flex : 1,
    },
    bodyWrapper:{
        flex: 8,
        position:"relative",
    },
    body:{
        justifyContent: 'center',
        flex: 1,
        display: 'flex',
        backgroundColor: 'white',
        borderTopStartRadius: 50,
        position: 'absolute',
        top: -45,
    },
    loginHeader:{
        flex: 1,
        backgroundColor: "#14C38E",
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderBottomEndRadius: 50,
        overflow: 'hidden',
    },
    headerText:{
        fontSize: 20,
        fontWeight: 400,
        color: 'white',
        textAlign: 'left',
        lineHeight : 50,
    },
    headerTextSm:{
        fontSize: 16,
        fontWeight: 200,
        color: 'white',
        textAlign: 'left',
        lineHeight : 100,
        fontStyle: 'italic'
    },
    appName:{
        fontSize: 30,
        fontWeight: 700,
        lineHeight : 40,
        color: 'white',
        textAlign: 'left'
    },
    errorArea:{
        flex: 1,
        paddingVertical: 20,
    },
    logInBody:{
        alignItems: 'center',
        padding: 30,
        flex: 1,
    },
    logo:{
       position: 'absolute',
       zIndex: -1,
       right: -170,
       bottom: -240,
       overflow: 'hidden',
       opacity: 0.2
    },
    loginText:{
        display: 'flex',
        alignSelf: 'stretch',
        flexDirection: 'row',
        fontSize: 20,
        fontWeight: 700,
        paddingVertical: 5,
    },
    buttons:{
        width: '100%',
        marginTop: 10,
    },
    login:{
        maxHeight: 50,
        marginBottom: 10,
    },
    create:{
        maxHeight: 51,
        marginBottom: 10,
    },
    forgot:{
        maxHeight: 50,
        marginBottom: 10,
    },
});

export default SignInScreen;