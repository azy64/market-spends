import useMarketStore, { ShoppingList } from "@/components/store/marketStore";
import ShoppingListTemplate from "@/components/ui/ShoppingListTemplate";
import * as Crypto from 'expo-crypto';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Button, Icon, IconButton } from 'react-native-paper';

const buttonWidth = Dimensions.get("window").width * 55 / 100;
const Shopping = () => {
    const setCurrentShoppingList = useMarketStore((state: any) => state.setCurrentShoppingList);
    const currentShoppingListId = useMarketStore((state: any) => state.currentShoppingListId);
    const showppingLists = useMarketStore((state: any) => state.shoppingLists);
    const nav = useRouter();
    const [currentSelectedId, setCurrentSelectedId] = useState("");
    const deleteShoppingList = (id: string) => {
        if (!id) return;
        const newShoppingLists = showppingLists.filter((list: any) => list.id !== id);
        console.log("deleted shopping list id:", id, "\n new shopping lists:", newShoppingLists);
        useMarketStore.setState((state: any) => ({
            ...state,
            shoppingLists: newShoppingLists
        }));
        // if the deleted shopping list is the current one, reset it
        if (currentShoppingListId && currentShoppingListId.id === id) {
            setCurrentShoppingList(shopItem);
        }
    }
    const swipeableDirection=(elementId:string,direction:string)=>{
        if(direction.includes("right"))deleteShoppingList(elementId);
    }
    const shopItem: ShoppingList = {
        id: "", name: "", items: [],
        createdAt: "", totalAmount: 0
    };
    const [shoppingList, setShoppingList] = useState(shopItem);
    useEffect(() => {
        if (currentShoppingListId) {
            setShoppingList(currentShoppingListId);
        }
        console.log("Shopping mounted");
        return () => {
            console.log("Shopping unmounted");
        };
    }, [currentShoppingListId]);
    const goToItemForms = () => {
        createShoppingList();
        nav.push("/ItemForms");
    }
    const createShoppingList = () => {
        const id = Crypto.randomUUID();
        const oneShoppingList: ShoppingList = {
            id: id,
            name: "shopping list " + (new Date().getDate()),
            items: [], createdAt: new Date().toISOString().split("T")[0],
            totalAmount: 0
        };
        setShoppingList(oneShoppingList);
        setCurrentShoppingList(oneShoppingList);
        console.log("oneshoppingList", oneShoppingList);
        //
        nav.push("/createShopping");
    }
    
    const modifyShoppingListAndGotoTheNextScreen=(item:ShoppingList)=>{
        setCurrentShoppingList(item);
        nav.push("/createShopping");
    }
    console.log("buttonWidth", buttonWidth);
    return (
        <View>
            <View style={styles.containerButton}>
                <Button style={styles.btn} icon="plus" mode="contained" onPress={() => goToItemForms()}>
                    new shopping list
                </Button>
            </View>
            <View>
                <Text style={{ margin: 25 }}>Shopping List Screen:
                    <Icon source="currency-eur" size={14} />
                    {showppingLists && showppingLists.reduce((acc: number, item: ShoppingList) => acc + item.totalAmount, 0).toFixed(2)}
                </Text>
            </View>
            <ScrollView style={{ height: Dimensions.get("window").height * 75 / 100 }}>
                <View>
                    {showppingLists && showppingLists.map((item: any, index: number) => (
                        <ReanimatedSwipeable
                        onSwipeableOpen={(e)=>swipeableDirection(item.id,e)}
                        rightThreshold={50}
                        key={index}
                        renderLeftActions={()=>
                            <View style={{flex:1,backgroundColor:"green",justifyContent:"center",alignItems:"center"}}>
                                <Icon source="delete" size={33} />
                            </View>
                        }
                        >
                            <TouchableOpacity
                                onPressOut={() => console.log("press out")}
                                style={{ margin: 10, padding: 5, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",backgroundColor:"white" }}>
                                <View style={{
                                    flexDirection: "row", height: 10, alignItems: "center",
                                    padding: 10, borderColor: "#e2dfdfff",
                                    justifyContent: "flex-end", borderBottomWidth: 1, marginBottom: 2
                                }}>
                                    <IconButton icon="delete" iconColor="red" size={20} onPress={() => {
                                        // delete the shopping list
                                        const newShoppingLists = showppingLists.filter((list: any) => list.id !== item.id);
                                        console.log("deleted shopping list id:", item.id, "\n new shopping lists:", newShoppingLists);
                                        useMarketStore.setState((state: any) => ({
                                            ...state,
                                            shoppingLists: newShoppingLists
                                        }));
                                        // if the deleted shopping list is the current one, reset it
                                        if (currentShoppingListId && currentShoppingListId.id === item.id) {
                                            setCurrentShoppingList(shopItem);
                                        }
                                    }} />
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
                                <Button icon="cart" mode="outlined" onPress={() => {
                                    setCurrentShoppingList(item);
                                    nav.push("/createShopping");
                                }}>
                                    View Items
                                </Button>
                            </TouchableOpacity>
                            <ShoppingListTemplate item={item}
                            onDelete={()=>deleteShoppingList(item.id)}
                            onViewItem={()=>modifyShoppingListAndGotoTheNextScreen(item)}
                            />
                        </ReanimatedSwipeable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    containerButton: { flexDirection: 'row', justifyContent: 'space-between', margin: 25 },
    btn: { width: buttonWidth, margin: "auto", marginTop: 20 }
});
export default Shopping;