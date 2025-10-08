import { View } from "react-native";
import { Text } from "react-native-paper";

type LegendProps = {
  data: Array<any>;
};
const Legende = ({ data }: LegendProps) => {
  const total = data.reduce((acc: Number, item: any) => acc + item.value, 0);
  const renderDot = (color: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 5,
        }}
      />
    );
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        margin: "auto",
        marginBottom: 10,
        width: "90%",
        height: 100,
        flexWrap:"wrap",
      }}
    >
      {data.length > 0 &&
        data.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "41.5%",
              marginRight: 20,
            }}
          >
            {renderDot(item.color)}
            <Text variant="bodySmall" style={{ color: "black" }}>
              {item.text}: {total>0?((item.value / total) * 100).toFixed(1):0}%
            </Text>
          </View>
        ))}
    </View>
  );
};
export default Legende;
