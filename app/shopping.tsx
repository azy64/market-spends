import SetCategories from "@/components/SetCategories";
import useMarketStore, {
  createTheContentFile,
  Item,
  ShoppingList,
} from "@/components/store/marketStore";
import ShoppingListTemplate from "@/components/ui/ShoppingListTemplate";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
//import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { AnimatedFAB, Button, Chip } from "react-native-paper";

const buttonWidth = (Dimensions.get("window").width * 55) / 100;
const fabPosition = (Dimensions.get("window").width * 5) / 100;
const Shopping = () => {
  const setCurrentShoppingList = useMarketStore(
    (state: any) => state.setCurrentShoppingList
  );
  const currentShoppingListId = useMarketStore(
    (state: any) => state.currentShoppingListId
  );
  const showppingLists = useMarketStore((state: any) => state.shoppingLists);
  const [extended, setExtended] = useState(false);
  const nav = useRouter();
  const [lastShoppingSelected, setLastShoppingSelected] = useState<{
    id: string;
    ref: any;
  }>({ id: "", ref: null });
  const [currentSelectedId, setCurrentSelectedId] = useState("");
  const [scroller, setScroller] = useState(0);
  const download = () => {
    const fileName = "tunaweza-" + new Date().getTime() + ".csv";
    let lignes: string =
      "shoppingLidId,totalamount,createdAt,itemId,itemLabel,itemValue,itemCategory,itemCreatedAt\n";
    showppingLists.map((shop: ShoppingList) => {
      shop.items.map((item: Item) => {
        lignes += `${shop.id},${shop.totalAmount},${shop.createdAt}`;
        lignes += `${item.id},${item.label},${item.value},${item.category},${item.addedDate}\n`;
      });
    });
    try {
      createTheContentFile(fileName, lignes);
      alert("file:" + fileName + " has been created");
    } catch (error) {
      console.error(error);
    }
  };
  const onscroll = useCallback(
    (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      if (scroller > y) setExtended(true);
      else setExtended(false);
      setScroller(y);
    },
    [scroller]
  );
  const deleteShoppingList = (id: string) => {
    if (!id) return;
    const newShoppingLists = showppingLists.filter(
      (list: any) => list.id !== id
    );
    useMarketStore.setState((state: any) => ({
      ...state,
      shoppingLists: newShoppingLists,
    }));
    // if the deleted shopping list is the current one, reset it
    if (currentShoppingListId && currentShoppingListId.id === id) {
      setCurrentShoppingList(shopItem);
    }
  };
  const swipeableDirection = (elementId: string, direction: string) => {
    if (direction.includes("right")) deleteShoppingList(elementId);
    //handlerSwipeSlected(elementId);
  };
  const shopItem: ShoppingList = {
    id: "",
    name: "",
    items: [],
    createdAt: "",
    totalAmount: 0,
  };
  const [shoppingList, setShoppingList] = useState(shopItem);
  useEffect(() => {
    if (currentShoppingListId) {
      setShoppingList(currentShoppingListId);
    }
    return () => {};
  }, [currentShoppingListId, showppingLists]);
  const goToItemForms = () => {
    createShoppingList();
    nav.push("/ItemForms");
  };
  const createShoppingList = () => {
    const id = Crypto.randomUUID();
    const oneShoppingList: ShoppingList = {
      id: id,
      name: "shopping list " + new Date().getDate(),
      items: [],
      createdAt: new Date().toISOString().split("T")[0],
      totalAmount: 0,
    };
    setShoppingList(oneShoppingList);
    setCurrentShoppingList(oneShoppingList);
    nav.push("/createShopping");
  };

  const modifyShoppingListAndGotoTheNextScreen = (item: ShoppingList) => {
    setCurrentShoppingList(item);
    nav.push("/createShopping");
  };
  return (
    <View>
      <View style={styles.containerButton}>
        <Button
          style={styles.btn}
          icon="plus"
          mode="contained"
          onPress={() => goToItemForms()}
        >
          new shopping list
        </Button>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Chip
          mode="outlined"
          icon="currency-eur"
          style={{ width: 300, margin: "auto" }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {showppingLists &&
              showppingLists
                .reduce(
                  (acc: number, item: ShoppingList) => acc + item.totalAmount,
                  0
                )
                .toFixed(2)}
          </Text>
        </Chip>
      </View>
      <ScrollView
        onScroll={onscroll}
        style={{ height: (Dimensions.get("window").height * 75) / 100 }}
      >
        <View>
          {showppingLists &&
            showppingLists.map((item: any, index: number) => (
              <ShoppingListTemplate
                item={item}
                key={index}
                onSwipeableOpen={(e) => swipeableDirection(item.id, e)}
                onDelete={() => deleteShoppingList(item.id)}
                onViewItem={() => modifyShoppingListAndGotoTheNextScreen(item)}
              />
            ))}
        </View>
      </ScrollView>
      <AnimatedFAB
        icon="download-circle"
        label={"Download"}
        animateFrom={"left"}
        iconMode={"dynamic"}
        extended={extended}
        onPress={() => download()}
        style={{ position: "fixed", bottom: 130, right: -fabPosition }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 25,
  },
  btn: { width: buttonWidth, margin: "auto", marginTop: 20 },
});
export default Shopping;
