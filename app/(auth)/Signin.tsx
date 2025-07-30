import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmitForm = async () => {
    const { email, password } = form;
    if (!email || !password) {
      return Alert.alert("Error", "please enter valid email and password");
    }
    setIsSubmitting(true);
    try {
      await signIn({ email, password });
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="bg-white rounded-lg p-5 mt-5 gap-10">
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
        title="Sign In"
        onPress={handleSubmitForm}
        isLoading={isSubmitting}
        textStyle="text-white paragraph-bold"
      />
      <View className="flex justify-center flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Dont have an account?
        </Text>
        <Link href="/SignUp" className="base-bold text-primary">
          Signup
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
