import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { createJSONStorage, devtools, persist as persistStorage } from "zustand/middleware";

export type Item = {
    id:string;
    value: number;
    label: string;
    addedDate: string;
    category: string;
}
export type ShoppingList = {
    id: string;
    name: string;
    items: Array<Item>;
    createdAt: string;
    totalAmount: number;
}
const initShoppingList: ShoppingList = { id: "", name: "", items: [], createdAt: "", totalAmount: 0 };
const initItem: Item = { id: "", value: 0, label: "", addedDate: "", category: "" };
const useMarketStore = create(devtools(persistStorage((set, get) => ({
    currentShoppingListId: initShoppingList,
    cureentItemId: initItem,
    market: {
        incomes: [] as Array<Item>,
        rentAndBills: [] as Array<Item>,
        foods: [] as Array<Item>,
        others: [] as Array<Item>,
        medecins: [] as Array<Item>,
        cloths: [] as Array<Item>,
        leisure: [] as Array<Item>
    },
    shoppingLists: [] as Array<ShoppingList>,
    categories: {
        incomes: "Incomes",
        rentAndBills: "Rent and Bills",
        foods: "Foods",
        others: "Others",
        medecins: "Medecins",
        cloths: "Cloths",
        leisure:"Leisure"
    },
    defaultCategories: ["Incomes", "Rent and Bills", "Foods", "Others", "Medecins", "Cloths","Leisure"],
    totalOfSpending: 0,
    totalOfIncomes: 0,
    restAfterPaidBills: 0,

    setIncomes: (incomes: Array<Item>) => {
        set({ incomes: incomes })
    },
    setCurrentShoppingList: (shoppingList: ShoppingList | null) => {
        set({ currentShoppingListId: shoppingList });
    },
    setCureentItem: (item: Item | null) => {
        set({ cureentItemId: item });
    }
}),
    { name: "market-storage", storage: createJSONStorage(() => AsyncStorage) }
)));

const toCapitalLetter = (str: string) => {
    const lower = str.toLowerCase().split(" ");
    const capitalized = lower.map((s) => s.charAt(0).toUpperCase() + s.substring(1));
    return capitalized.join("");
}
/* Function to add a new category if it doesn't already exist */
export const addANewCategory = (category: string) => {
    const stateStore: any = useMarketStore.getState();
    const categoriesLabel = Object.values(stateStore.market.categories);
    if (!categoriesLabel.includes(category)) {
        const categoryKey: string = toCapitalLetter(category);
        useMarketStore.setState((state: any) => ({
            ...state,
            market: { ...state.market, [categoryKey]: [] },
            categories: { ...state.market.categories, [categoryKey]: category }
        }));
    }
}

/* Function to delete an item from a specific category */
export const deleteAnItem = (itemId: string, category: string) => {
    const stateStore: any = useMarketStore.getState();
    const categoriesLabel = Object.values(stateStore.market.categories);
    if (categoriesLabel.includes(category)) {
        const categoryKey: string = toCapitalLetter(category);
        const updatedItems = stateStore.market[categoryKey].filter((item: Item) => item.id !== itemId);
        useMarketStore.setState((state: any) => ({
            ...state,
            market: { ...state.market, [categoryKey]: updatedItems }
        }));
    }
}

/* Function to delete a category if it exists and is not "Incomes" */
export const deleteCategory = (category: string) => {
    const stateStore: any = useMarketStore.getState();
    const defaultCategories = stateStore.defaultCategories;
    const categoriesLabel = Object.values(stateStore.market.categories);
    if (categoriesLabel.includes(category) && !defaultCategories.includes(category)) {
        const categoryKey: string = toCapitalLetter(category);
        const updatedMarket = { ...stateStore.market };
        const updatedCategories = { ...stateStore.market.categories };
        delete updatedMarket[categoryKey];
        delete updatedCategories[categoryKey];
        useMarketStore.setState((state: any) => ({
            ...state,
            market: updatedMarket,
            categories: updatedCategories
        }));
    }
}

// Function to calculate the sum of all spending categories
export const summOfSpending = (addedDate: string) => {
    const stateStore: any = useMarketStore.getState();
    // Exclude 'incomes' from spending calculation
    const marketKeys = Object.keys(stateStore.market).filter(key => key !== 'incomes'); 
    let total = 0;
    marketKeys.forEach((key) => {
        const items: Array<Item> = stateStore.market[key];
        items.forEach((item) => {
            if(addedDate && item.addedDate === addedDate)
                total += item.value;
            else if(!addedDate)
                total += item.value;
        });
    });
    return total;
}
// Function to calculate the remaining amount after paying bills
export const restAfterPaidBillsFunc = (addedDate: string) => {
    const stateStore: any = useMarketStore.getState();
    const totalOfIncomes = stateStore.market.incomes.reduce((sum: number, item: Item) => {
        if(addedDate && item.addedDate === addedDate)
            return sum + item.value;
        else if(!addedDate)
            return sum + item.value;
        return sum;
    }, 0);
    const totalOfSpending = summOfSpending(addedDate);
    return totalOfIncomes - totalOfSpending;
}

// Function to add an item to a specific category
export const addTo = (item: Item, category: string) => {
    const stateStore: any = useMarketStore.getState();
    const categoriesLabel = Object.values(stateStore.market.categories);
    if (categoriesLabel.includes(category)) {
        const categoryKey: string = toCapitalLetter(category);
        useMarketStore.setState((state: any) => ({
            ...state,
            market:{...state.market,[categoryKey]:[...state.market[categoryKey],item]}
            //[categoryKey]: [...state[categoryKey]: item]
        }));
    }
}

export const addShoppingList = (shoppingList: ShoppingList) => {
    const stateStore: any = useMarketStore.getState();
    const exists = stateStore.shoppingLists.some((list: ShoppingList) => list.id === shoppingList.id);
    if (exists){
        const newShoppingLists = stateStore.shoppingLists.filter((list: ShoppingList) => list.id !== shoppingList.id);
        useMarketStore.setState((state: any) => ({
            ...state,
            shoppingLists: [...newShoppingLists, shoppingList]
        }));
        return;
    } // Avoid adding duplicates
    useMarketStore.setState((state: any) => ({
        ...state,
        shoppingLists: [...state.shoppingLists, shoppingList]
    }));
}
// Function to delete a shopping list by its ID
export const deleteShoppingList = (shoppingListId: string) => {
    const stateStore: any = useMarketStore.getState();
    const updatedLists = stateStore.shoppingLists.filter((list: ShoppingList) => list.id !== shoppingListId);
    useMarketStore.setState((state: any) => ({
        ...state,
        shoppingLists: updatedLists
    }));
}   

export default useMarketStore;