import useMarketStore, { addShoppingList } from "@/components/store/marketStore";
import ItemTemplate from "@/components/ui/ItemTemplate";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Snackbar } from 'react-native-paper';

const buttonWidth = Dimensions.get("window").width * 55 / 100;
const createShoppingScreen = () => {
    const nav = useRouter();
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);
    const [numberOfItems,setNumberOfItems]= useState(0);
    const currentShoppingListId = useMarketStore((state:any) => state.currentShoppingListId);
    const setCurrentShoppingList = useMarketStore((state:any) => state.setCurrentShoppingList);
    
    const deleteItem=(id:string)=>{
        if(currentShoppingListId){
            const newItems=currentShoppingListId.items.filter((item:any)=>item.id!==id);
            const newOne={...currentShoppingListId, items:newItems,
            totalAmount: currentShoppingListId.totalAmount - (currentShoppingListId.items.find((item:any)=>item.id===id)?.value || 0)
            };
            setCurrentShoppingList(newOne);
            addShoppingList(newOne); // update the shopping list in the store
            console.log("deleted item id:",id,"\n new shopping list:",newOne);
            //setVisible(true);
        }
    }
    useEffect(() => {
        if(currentShoppingListId)
            if(currentShoppingListId.items.length!==numberOfItems){
            setNumberOfItems(currentShoppingListId.items.length);
            //setVisible(true);
        }
        console.log("createShopping mounted");
        return () => {
            console.log("createShopping unmounted");
        };
    }, [currentShoppingListId,numberOfItems]);
    return (
    <View>
        <View style={styles.containerButton}>
            <Button style={styles.btn} icon="cart-plus" mode="contained" onPress={() => nav.push("/ItemForms")}>
                new item
            </Button>
        </View>
        <View>
            <Text style={{ margin: 10, fontWeight: "bold", fontSize: 20,}}>
                Total Amount: <Text style={{fontFamily:"DancingScript_700Bold", fontSize:10}}>€</Text>
                {currentShoppingListId.totalAmount.toFixed(2)} 
                </Text>
                <ScrollView style={{height:Dimensions.get("window").height*75/100}}>
            {currentShoppingListId.items && 
            currentShoppingListId.items.map((item:any,index:number)=>(
                <ItemTemplate key={index} 
                label={item.label} 
                amount={item.value} 
                createdAt={item.addedDate}
                category={item.category}
                onDelete={()=>deleteItem(item.id)}
                />
            ))}
            </ScrollView>
        </View>
        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
          },
        }}>
        Hey there! I'm a Snackbar.
      </Snackbar>
    </View>
    );
}
const styles = StyleSheet.create({
    containerButton: { flexDirection: 'row', justifyContent: 'space-between', margin: 25 },
    btn: { width: buttonWidth, margin: "auto", marginTop: 20 }
});
export default createShoppingScreen;