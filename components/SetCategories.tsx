import useMarketStore, { addANewCategory, deleteCategory } from "@/components/store/marketStore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Chip,
    Divider,
    HelperText,
    IconButton,
    Snackbar,
    Text,
    TextInput
} from "react-native-paper";

const SetCategories = () => {
  const categories = useMarketStore((state: any) => state.categories);
  const numberCategoryLimit = useMarketStore((state: any) => state.numberCategoryLimit);
  const [categoryKey, setCategoryKey] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const hasErrors = () => {
    const regex = /^[a-z]+$/gi;
    return !regex.test(categoryKey);
    //return false;
  };
  const saving = () => {
    if (hasErrors()) return;
    if(Object.keys.length===numberCategoryLimit){
        Alert.alert("Error","Limit reached",[{text:"ok",onPress:()=>console.log("limit reached")}]);
        return;
    }
    addANewCategory(categoryKey.toLowerCase(), categoryValue);
    setCategoryKey("");
    setCategoryValue("");
    onToggleSnackBar();

  };
  const alertMessage=(content:string)=>(Alert.alert("Display value",content,
    [{text:"ok",onPress:()=>console.log("look at")}]))
  useEffect(()=>{

    return()=>{

    }
  },[categories,categoryKey])
  return (
    <ScrollView style={{flex:1}}>
    <View style={styles.maincontainer}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 1,
          marginBottom: 3,

        }}
      >
        {Object.keys(categories).map((item: string, index) => (
            <Chip key={index} rippleColor="gray" icon="check-circle" 
            style={{margin:1}} onPress={()=>alertMessage(item)} 
            closeIcon="close-circle"
            onClose={()=>deleteCategory(item)}
            mode="outlined"
            >
                {item}
                {/*<IconButton style={{borderWidth:1}} icon="close-circle" size={13} iconColor="red" onPress={()=>deleteCategory(item)}/>*/}
            </Chip>
        ))}
      </View>
      <Divider style={{ marginTop: 10 }} />
      <View style={styles.form}>
        <Text style={{ margin: 10,color:"#504e4eff" }} variant="headlineMedium">
          Add a new category Key
        </Text>
        <TextInput
          label="Key"
          placeholder="put the key name"
          value={categoryKey}
          onChangeText={(e) => setCategoryKey(e)}
          style={{ width: "95%", marginBottom: 5 }}
          keyboardType="ascii-capable"
        />
        <HelperText type="error" visible={hasErrors()} style={{marginBottom:20}}>
          The key should not have a special character
        </HelperText>

        <TextInput
          label="Value"
          placeholder="put the key value"
          value={categoryValue}
          onChangeText={(e) => setCategoryValue(e)}
          style={{ width: "95%", marginBottom: 20 }}
        />
        <Button onPress={()=>saving()} mode="contained" icon="content-save" style={{ width: "90%" }}>
          Save
        </Button>
        <Snackbar
        style={{position:"fixed",left:0, top:"85%"}}
        duration={2000}
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: '',
          onPress: () => {
            onDismissSnackBar()
          },
        }}>
        operation succeed!
      </Snackbar>
      </View>
    </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  maincontainer: {
    paddingTop: 50,
    height: 650,
    padding: 5,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#e9e5e5ff",
    backgroundColor: "#4e4c4cff",
    textAlign: "center",
    borderRadius: 5,
    padding: 3,
    height:40,
    margin: 6,
    flex:1,
    borderWidth:1,
    flexDirection:"row"
  },
});

export default SetCategories;
