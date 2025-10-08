import useMarketStore, { ShoppingList } from "@/components/store/marketStore";
import ShoppingListTemplate from "@/components/ui/ShoppingListTemplate";
import * as Crypto from 'expo-crypto';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
//import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Button, Icon } from 'react-native-paper';

const buttonWidth = Dimensions.get("window").width * 55 / 100;
const Shopping = () => {
    const setCurrentShoppingList = useMarketStore((state: any) => state.setCurrentShoppingList);
    const currentShoppingListId = useMarketStore((state: any) => state.currentShoppingListId);
    const showppingLists = useMarketStore((state: any) => state.shoppingLists);
    const nav = useRouter();
    const [lastShoppingSelected, setLastShoppingSelected] = useState<{ id: string, ref: any }>({ id: "", ref: null });
    const [currentSelectedId, setCurrentSelectedId] = useState("");
    const deleteShoppingList = (id: string) => {
        if (!id) return;
        const newShoppingLists = showppingLists.filter((list: any) => list.id !== id);
        useMarketStore.setState((state: any) => ({
            ...state,
            shoppingLists: newShoppingLists
        }));
        // if the deleted shopping list is the current one, reset it
        if (currentShoppingListId && currentShoppingListId.id === id) {
            setCurrentShoppingList(shopItem);
        }
    }
    const swipeableDirection = (elementId: string, direction: string) => {
        if (direction.includes("right")) deleteShoppingList(elementId);
        //handlerSwipeSlected(elementId);
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
        return () => {
        };
    }, [currentShoppingListId,showppingLists]);
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
        nav.push("/createShopping");
    }

    const modifyShoppingListAndGotoTheNextScreen = (item: ShoppingList) => {
        setCurrentShoppingList(item);
        nav.push("/createShopping");
    }
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
                        <ShoppingListTemplate item={item}
                            key={index}
                            onSwipeableOpen={(e) => swipeableDirection(item.id, e)}
                            onDelete={() => deleteShoppingList(item.id)}
                            onViewItem={() => modifyShoppingListAndGotoTheNextScreen(item)}
                        />
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