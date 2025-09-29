import useMarketStore, { addShoppingList, Item, ShoppingList } from '@/components/store/marketStore';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, HelperText, Icon, RadioButton, Text, TextInput } from 'react-native-paper';

const buttonWidth = Dimensions.get("window").width * 50 / 100;
const ItemFormsScreen = () => {
  const itemscheme : Item={ id: "", value: 0, label: "", 
    addedDate: "", category: "" };
  const shoppingModel: ShoppingList={ id: "", name: "", items: [], 
    createdAt: "", totalAmount: 0 };
  const setCurrentShoppingList = useMarketStore((state: any) => state.setCurrentShoppingList);
  const currentShoppingListId = useMarketStore((state: any) => state.currentShoppingListId);
  const[updatedShoppingList, setUpdatedShoppingList]= React.useState(shoppingModel);
  const nav = useRouter();
  const [item, setItem] = React.useState(itemscheme);
  const [value, setValue] = React.useState("0");
  const [label, setLabel] = React.useState("");
  const [category, setCategory] = React.useState("");
  const categories = useMarketStore((state: any) => state.categories);
  const [itemId, setItemId] = React.useState(Crypto.randomUUID());
  React.useEffect(() => {
    setUpdatedShoppingList(currentShoppingListId);
    console.log("ItemForms mounted", currentShoppingListId);
    return () => {
      console.log("ItemForms unmounted");
    };
  }, [currentShoppingListId]);
  const hasErrors = () => {
    return !(value.length>0 && parseFloat(value)>0);
  };
  const hasErrorsLabel = () => {
    return !(label.length>0 );
  };
  const hasErrorsCategory = () => {
    return !(category.length>0 );
  };
  /**
   * 
   * @returns void
   * save the item to the store
   */
  const saveItem = ()=>{
    if(hasErrors() || hasErrorsLabel() || hasErrorsCategory()) return;
    const createdDate=new Date().toISOString();
    const temporaryItem= { id: itemId, value: parseFloat(value), label: label, 
      addedDate: createdDate.split("T")[0], category: category }
    setItem(temporaryItem);
    console.log("save item:",item,"\n to shopping list:",currentShoppingListId);
    if (currentShoppingListId) {
      const newOne: ShoppingList= {...currentShoppingListId,
        items: [...currentShoppingListId.items,temporaryItem],
       totalAmount: currentShoppingListId.totalAmount+parseFloat(value)
      };
      setCurrentShoppingList(newOne);
      addShoppingList(newOne); // add or update the shopping list in the store
      console.log("updatedShoppingList",newOne,"\n current:",currentShoppingListId);
    }
    // go back to the previous screen
    nav.back();
  }
  return (
    <View>
      <Text style={styles.header}>
        <Icon
          source="cart-variant"
          size={20}
        />
        Add Item
      </Text>
      <View>
        <View style={styles.textContainer} >
          <TextInput label="Item ID" value={itemId} disabled />
        </View>
        <View style={styles.textContainer} >
          <TextInput label="name" value={label.toString()} 
          onChangeText={(text: string) => setLabel(text)} />
          <HelperText type="error" visible={hasErrorsLabel()}>
            The label should not be empty!
           </HelperText>
        </View>
        <View style={styles.textContainer} >
          <TextInput keyboardType='numeric' label="Price" value={value.toString()}
          onChangeText={(text: string) => setValue(text)} />
          <HelperText type="error" visible={hasErrors()}>
            The price should be superior to 0 and not empty!
           </HelperText>
        </View>
        
        <View style={styles.textContainer} >
          <RadioButton.Group onValueChange={newValue => setCategory(newValue)} 
          value={category}>
            {Object.keys(categories).map((key: string) => 
              key !== "incomes" ? (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value={categories[key]} />
                  <Text>{categories[key]}</Text>
                </View>
              ) : null
            )}
          </RadioButton.Group>
          <HelperText type="error" visible={hasErrorsCategory()}>
            Please select a category!
           </HelperText>
        </View>
      </View>
      <Button style={styles.btn} icon="cart-arrow-down" mode="contained" onPress={saveItem}>
        save item
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: 'bold', margin: 20, textAlign: 'center' },
  textContainer: { marginBottom: 10 },
  btn: { width: buttonWidth, margin: "auto", marginTop: 20 }
});

export default ItemFormsScreen;