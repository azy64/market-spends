import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist as persistStorage, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shallow } from "zustand/shallow";

type Item = {
    id:string;
    value: number;
    description: string;
    addedDate: string;
    category: string;
}
const useMarketStore = create(devtools(persistStorage((set, get) => ({
    market: {
        incomes: [],
        rentAndBills: [],
        foods: [],
        others: [],
        medecins: [],
        clothsAndLeisure: [],
    },
    categories: {
        incomes: "Incomes",
        rentAndBills: "Rent and Bills",
        foods: "Foods",
        others: "Others",
        medecins: "Medecins",
        clothsAndLeisure: "Cloths and Leisure"
    },
    defaultCategories: ["Incomes", "Rent and Bills", "Foods", "Others", "Medecins", "Cloths and Leisure"],
    totalOfSpending: 0,
    totalOfIncomes: 0,
    restAfterPaidBills: 0,

    setIncomes: (incomes: Array<Item>) => {
        set({ incomes: incomes })
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

export default useMarketStore;