import { DancingScript_400Regular, DancingScript_700Bold, useFonts } from '@expo-google-fonts/dancing-script';
import { useRef} from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Icon, IconButton, Text } from 'react-native-paper';
import { Item } from '../store/marketStore';

type ItemTemplateProps = {
    onDelete?: () => void;
    onSwipeableOpen?: Function;
    item: Item;
    lastSelectedItem?: any;
    setLastSelectedItem?: (selected: { id: string, ref: any }) => void;
};
const marginLeft = 0;

const ItemTemplate = ({ item, onDelete, onSwipeableOpen,lastSelectedItem,setLastSelectedItem }: ItemTemplateProps) => {
    const [fontsLoaded, error] = useFonts({
        DancingScript_400Regular,
        DancingScript_700Bold
    });
    const swipeRef = useRef<SwipeableMethods|null>(null);
    /*const handlerSwipeSelected = (id: string) => {
        if (lastSelectedItem)
            if (lastSelectedItem.id !== id) lastSelectedItem.ref?.close();
        setLastSelectedItem && setLastSelectedItem({ id: id, ref: swipeRef.current });
        console.log("affectation reusiite...", ReanimatedSwipeable.name);
    }
    */
    //const [marginLeftState, setMarginLeftState] = useState(marginLeft);
    return (
        
        <ReanimatedSwipeable
            ref={swipeRef}
            onSwipeableOpen={(e) =>{
                onSwipeableOpen && onSwipeableOpen(e);
                swipeRef.current?.close();
            }}
            renderLeftActions={() =>
                <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                    <Icon source="delete" size={33} color='red' />
                </View>
            }
            leftThreshold={20}
        >
            <TouchableOpacity style={[styles.container]} >
                <View style={styles.transversal}>
                    <IconButton icon="close-thick"
                        iconColor="red"
                        size={16}
                        onPress={() => onDelete && onDelete()}
                    />
                </View>
                <View style={styles.body}>
                    <Text style={styles.textFocusLeft}>{item.label}</Text>
                    <Text style={styles.textFocusRight}>
                        <Text style={{ fontFamily: 'DancingScript_700Bold', fontStyle: 'italic', fontSize: 13 }}>€</Text>
                        {item.value.toFixed(2)}</Text>
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerTextLeft}>
                        <Text style={styles.textLeft}> {item.category}</Text>
                    </View>
                    <View style={styles.footerTextRight}>
                        <Text style={styles.textRight} > {item.addedDate}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        </ReanimatedSwipeable>
    );
}
const styles = StyleSheet.create({
    container: {
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        width: "93%",
        margin: "auto",
        marginBottom: 8,
        padding: 1,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc"
    },
    transversal: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        margin: 0,
        padding: 0,
        height: 18,
    },
    body: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    footer: {
        fontSize: 9,
        flexDirection: "row",
        alignItems: "center",
        margin: 5,
        padding: 0
    },
    textFocusLeft: {
        fontSize: 18,
        textAlign: "left",
        fontWeight: "bold",
        fontStyle: "italic",
        paddingLeft: 8,
        flex: 3,
        fontFamily: "DancingScript_700Bold",
    },
    textFocusRight: {
        fontSize: 25,
        flex: 1,
        paddingRight: 8,
        textAlign: "right",
        fontWeight: "bold",
        fontFamily: "DancingScript_400Regular",
    },
    footerTextLeft: {
        flex: 1,
    },
    footerTextRight: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end"

    },
    textLeft: {
        fontSize: 12,
        textAlign: "center",
        borderRadius: 6,
        backgroundColor: "#ccc",
        color: "#3d3b3bff",
        padding: 2,
        width: "50%",
    },
    textRight: {
        fontSize: 12,
        textAlign: "center",
        backgroundColor: "#ccc",
        color: "#3d3b3bff",
        borderRadius: 6,
        padding: 2,
        width: 65,
    }
});
export default ItemTemplate;