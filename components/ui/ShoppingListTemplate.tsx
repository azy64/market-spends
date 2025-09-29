import { ShoppingList } from "@/components/store/marketStore";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Icon, IconButton } from 'react-native-paper';


const buttonWidth = Dimensions.get("window").width * 55 / 100;
type ShoppingListTempalteProps={
    item:ShoppingList,
    onDelete:Function,
    onViewItem:Function,
}
const ShoppingListTemplate = ({item,onDelete,onViewItem }:ShoppingListTempalteProps) => {
    const nav = useRouter();
    return (
        <TouchableOpacity
            onPressOut={() => console.log("press out")}
            style={{ margin: 10, padding: 5, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)", backgroundColor: "white" }}>
            <View style={{
                flexDirection: "row", height: 10, alignItems: "center",
                padding: 10, borderColor: "#e2dfdfff",
                justifyContent: "flex-end", borderBottomWidth: 1, marginBottom: 2
            }}>
                <IconButton icon="delete" iconColor="red" size={20} onPress={() => onDelete()} />
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{item.name.toUpperCase()}</Text>
            <Text style={{
                backgroundColor: "#e2dfdfff",
                padding: 3, borderRadius: 5,
                margin: 6,
                marginLeft: 0,
                textAlign: "left",
                color: "#615f5fff"
            }}>
                <Icon source="identifier" size={20} />
                {item.id}</Text>
            <Text style={{
                backgroundColor: "#e2dfdfff",
                width: "25%", padding: 3, borderRadius: 5,
                textAlign: "center",
                color: "#615f5fff"
            }}>
                <Icon source="calendar" size={14} />
                {item.createdAt}
            </Text>
            <Text
                style={{
                    backgroundColor: "#e2dfdfff",
                    width: "25%", padding: 3, borderRadius: 5,
                    textAlign: "center",
                    margin: 6,
                    marginLeft: 0,
                    color: "#615f5fff"
                }}
            ><Text style={{ fontFamily: "DancingScript_700Bold", fontSize: 10 }}>
                    <Icon source="currency-eur" size={14} />
                </Text>
                {item.totalAmount.toFixed(2)}</Text>
            <Button icon="cart" mode="outlined" onPress={() => onViewItem()}>
                View Items
            </Button>
        </TouchableOpacity>

    );
}
const styles = StyleSheet.create({
    containerButton: { flexDirection: 'row', justifyContent: 'space-between', margin: 25 },
    btn: { width: buttonWidth, margin: "auto", marginTop: 20 }
});
export default ShoppingListTemplate;