import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik, validateYupSchema } from 'formik';
import * as Yup from 'yup';

const LoginScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email').required('Required'),
                    password: Yup.string().min(6, 'Too Short!').required('Required'),
                })}
                onSubmit={(values) => {
                    navigation.navigate('TabApp')
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.viewStyle}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    viewStyle:{ width:'100%', padding:10},
    input: { width: '100%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ccc' },
    button: { backgroundColor: '#6200ea', padding: 15, borderRadius: 5, marginTop: 10 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    link: { color: '#6200ea', marginTop: 20 },
    error: { color: 'red', fontSize: 12 },
});

export default LoginScreen;
