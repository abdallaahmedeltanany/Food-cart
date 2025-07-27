import { TabBarIconProps } from "@/type";
import cn from "clsx";
import { Image, Text, View } from "react-native";

const TabIcon = ({ icon, title, focused }: TabBarIconProps) => {
  return (
    <View className="tab-icon">
      <Image
        source={icon}
        className="size-7"
        resizeMode="contain"
        tintColor={focused ? "#fe8c00" : "#5d5f6d"}
      />
      <Text
        className={cn(
          "text-sm font-bold w-fit",
          focused ? "text-primary" : "text-gray-200"
        )}
      >
        {title}
      </Text>
    </View>
  );
};

export default TabIcon;
