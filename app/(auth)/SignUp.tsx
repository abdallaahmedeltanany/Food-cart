import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmitForm = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password) {
      return Alert.alert("Error", "please enter valid email and password");
    }
    setIsSubmitting(true);
    try {
      await createUser({ email, name, password });
      router.replace("/SignIn");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="bg-white rounded-lg p-5 mt-5 gap-6">
      <CustomInput
        label="Name"
        placeholder="please enter name"
        value={form.name}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, name: text }));
        }}
        secureTextEntry={false}
        keyboardType="email-address"
      />
      <CustomInput
        label="email"
        placeholder="please enter email"
        value={form.email}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, email: text }));
        }}
        secureTextEntry={false}
        keyboardType="email-address"
      />
      <CustomInput
        label="password"
        placeholder="please enter password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign Up"
        onPress={handleSubmitForm}
        isLoading={isSubmitting}
      />
      <View className="flex justify-center flex-row gap-2">
        <Text className="base-regular text-gray-100">
          already have an account?
        </Text>
        <Link href="/SignIn" className="base-bold text-primary">
          Signin
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
