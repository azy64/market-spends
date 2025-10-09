import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system/legacy';
import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist as persistStorage,
} from "zustand/middleware";

export type Item = {
  id: string;
  value: number;
  label: string;
  addedDate: string;
  category: string;
};
export type ShoppingList = {
  id: string;
  name: string;
  items: Array<Item>;
  createdAt: string;
  totalAmount: number;
};
const initShoppingList: ShoppingList = {
  id: "",
  name: "",
  items: [],
  createdAt: "",
  totalAmount: 0,
};
const initItem: Item = {
  id: "",
  value: 0,
  label: "",
  addedDate: "",
  category: "",
};

const useMarketStore = create(
  devtools(
    persistStorage(
      (set, get) => ({
        currentShoppingListId: initShoppingList,
        cureentItemId: initItem,
        numberCategoryLimit:10,
        market: {
          incomes: [] as Array<Item>,
          rentAndBills: [] as Array<Item>,
          foods: [] as Array<Item>,
          others: [] as Array<Item>,
          medecins: [] as Array<Item>,
          cloths: [] as Array<Item>,
          leisure: [] as Array<Item>,
        },
        shoppingLists: [] as Array<ShoppingList>,
        categories: {
          incomes: "Incomes",
          rentAndBills: "Rent and Bills",
          foods: "Foods",
          others: "Others",
          medecins: "Medecins",
          cloths: "Cloths",
          leisure: "Leisure",
        },
        defaultCategories: [
          "incomes",
          "rentAndBills",
          "foods",
          "others",
          "medecins",
          "cloths",
          "leisure",
        ],
        totalOfSpending: 0,
        totalOfIncomes: 0,
        restAfterPaidBills: 0,

        setIncomes: (incomes: Array<Item>) => {
          set({ incomes: incomes });
        },
        setCurrentShoppingList: (shoppingList: ShoppingList | null) => {
          set({ currentShoppingListId: shoppingList });
        },
        setCureentItem: (item: Item | null) => {
          set({ cureentItemId: item });
        },
      }),
      { name: "market-storage", storage: createJSONStorage(() => AsyncStorage) }
    )
  )
);

export const getRandomHexColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, "0");
};

const toCapitalLetter = (str: string) => {
  const lower = str.toLowerCase().split(" ");
  const capitalized = lower.map(
    (s) => s.charAt(0).toUpperCase() + s.substring(1)
  );
  return capitalized.join("");
};
/* Function to add a new category if it doesn't already exist */
export const addANewCategory = (categoryKey:string,category: string) => {
  const stateStore: any = useMarketStore.getState();
  const categoriesLabel = Object.values(stateStore.categories);
  const categoriesKeys = Object.keys(stateStore.categories);
  if (!categoriesLabel.includes(category) && !categoriesKeys.includes(categoryKey)) {
    category= toCapitalLetter(category);
    useMarketStore.setState((state: any) => ({
      ...state,
      market: { ...state.market, [categoryKey]: [] },
      categories: { ...state.categories, [categoryKey]: category },
    }));
  }
};

/* Function to delete an item from a specific category */
export const deleteAnItem = (itemId: string, category: string) => {
  const stateStore: any = useMarketStore.getState();
  const categoriesLabel = Object.values(stateStore.market.categories);
  if (categoriesLabel.includes(category)) {
    const categoryKey: string = toCapitalLetter(category);
    const updatedItems = stateStore.market[categoryKey].filter(
      (item: Item) => item.id !== itemId
    );
    useMarketStore.setState((state: any) => ({
      ...state,
      market: { ...state.market, [categoryKey]: updatedItems },
    }));
  }
};
export const deleteItemsRelatedToACategory=(categoryKey:string):Array<ShoppingList>=>{
  const state:any= useMarketStore.getState();
  const shoppingLists:Array<ShoppingList> = state.shoppingLists;
  const categories = state.categories;
  const newShoppingLists:Array<ShoppingList>=shoppingLists.map((shopList: ShoppingList)=>{
    const shopItems=shopList.items.filter((item:Item)=>item.category!==categories[categoryKey])
    shopList.items=shopItems;
    //console.log("items after:",shopItems, "\n")
    return shopList;
  });
  return newShoppingLists;
}

export const deleteAShoppingListById=(id:string)=>{
  const stateStore: any = useMarketStore.getState();
  const shoppingLists= stateStore.shoppingLists;
  const newShoppingLists = shoppingLists.filter((shop:ShoppingList)=>shop.id!==id);
  useMarketStore.setState((state:any)=>({
    ...state,
    shoppingLists:[...newShoppingLists]
  }))
}

/* Function to delete a category if it exists and is not "Incomes" */
export const deleteCategory = (categoryKey: string) => {
  const stateStore: any = useMarketStore.getState();
  const defaultCategories = stateStore.defaultCategories;
  const categoriesOld= stateStore.categories;
  const categoriesKeys = Object.keys(stateStore.categories);
  if (
    categoriesKeys.includes(categoryKey) &&
    !defaultCategories.includes(categoryKey)
  ) {
    const shops= deleteItemsRelatedToACategory(categoryKey);
    const filtredshops = shops.filter((item:ShoppingList)=>item.items.length>0);
    delete categoriesOld[categoryKey];
    useMarketStore.setState((state: any) => ({
      ...state,
      categories:{...categoriesOld},
      shoppingLists:[...filtredshops]
    }));
    //deleteItemsRelatedToACategory(categoryKey);
    console.log("updated!")
  }
  
};

// Function to calculate the sum of all spending categories
export const summOfSpending = (addedDate: string) => {
  const stateStore: any = useMarketStore.getState();
  // Exclude 'incomes' from spending calculation
  const marketKeys = Object.keys(stateStore.market).filter(
    (key) => key !== "incomes"
  );
  let total = 0;
  marketKeys.forEach((key) => {
    const items: Array<Item> = stateStore.market[key];
    items.forEach((item) => {
      if (addedDate && item.addedDate === addedDate) total += item.value;
      else if (!addedDate) total += item.value;
    });
  });
  return total;
};
// Function to calculate the remaining amount after paying bills
export const restAfterPaidBillsFunc = (addedDate: string) => {
  const stateStore: any = useMarketStore.getState();
  const totalOfIncomes = stateStore.market.incomes.reduce(
    (sum: number, item: Item) => {
      if (addedDate && item.addedDate === addedDate) return sum + item.value;
      else if (!addedDate) return sum + item.value;
      return sum;
    },
    0
  );
  const totalOfSpending = summOfSpending(addedDate);
  return totalOfIncomes - totalOfSpending;
};

// Function to add an item to a specific category
export const addTo = (item: Item, category: string) => {
  const stateStore: any = useMarketStore.getState();
  const categoriesLabel = Object.values(stateStore.market.categories);
  if (categoriesLabel.includes(category)) {
    const categoryKey: string = toCapitalLetter(category);
    useMarketStore.setState((state: any) => ({
      ...state,
      market: {
        ...state.market,
        [categoryKey]: [...state.market[categoryKey], item],
      },
      //[categoryKey]: [...state[categoryKey]: item]
    }));
  }
};

export const addShoppingList = (shoppingList: ShoppingList) => {
  const stateStore: any = useMarketStore.getState();
  const exists = stateStore.shoppingLists.some(
    (list: ShoppingList) => list.id === shoppingList.id
  );
  if (exists) {
    const newShoppingLists = stateStore.shoppingLists.filter(
      (list: ShoppingList) => list.id !== shoppingList.id
    );
    useMarketStore.setState((state: any) => ({
      ...state,
      shoppingLists: [...newShoppingLists, shoppingList],
    }));
    return;
  } // Avoid adding duplicates
  useMarketStore.setState((state: any) => ({
    ...state,
    shoppingLists: [...state.shoppingLists, shoppingList],
  }));
};
// Function to delete a shopping list by its ID
export const deleteShoppingList = (shoppingListId: string) => {
  const stateStore: any = useMarketStore.getState();
  const updatedLists = stateStore.shoppingLists.filter(
    (list: ShoppingList) => list.id !== shoppingListId
  );
  useMarketStore.setState((state: any) => ({
    ...state,
    shoppingLists: updatedLists,
  }));
};

export const daily = (): Array<any> => {
  const createdDate = new Date().toISOString().split("T")[0];
  const recolt: any = [];
  const state: any = useMarketStore.getState();
  const categoriesValues: Array<string> = Object.values(state.categories);
  const shoppingLists = state.shoppingLists;
  //const k = recolt;
  categoriesValues.map((cat: string) => {
    let accum = 0;
    shoppingLists.map((shopping: ShoppingList) => {
      if (shopping.createdAt === createdDate)
        accum += shopping.items
          .filter((item: Item) => item.category === cat)
          .reduce((acc: number, el: Item) => acc + el.value, 0);
    });
    const value = { text: cat, value: accum, color: getRandomHexColor() };
    recolt.push(value);
  });
  return recolt;
};
export const monthly = (monthFrom: string, monthTo: string): Array<any> => {
  const dateFrom = new Date(monthFrom).getTime();
  const dateTo = new Date(monthTo).getTime();
  const recolt: any = [];
  const state: any = useMarketStore.getState();
  const categoriesValues: Array<string> = Object.values(state.categories);
  const shoppingLists = state.shoppingLists;
  if (dateFrom > dateTo) return recolt;

  categoriesValues.map((cat: string) => {
    let accum = 0;
    shoppingLists.map((shopping: ShoppingList) => {
      const shoppingDate = new Date(shopping.createdAt).getTime();
      if (shoppingDate >= dateFrom && shoppingDate <= dateTo)
        accum += shopping.items
          .filter((item: Item) => item.category === cat)
          .reduce((acc: number, el: Item) => acc + el.value, 0);
    });
    const value = { text: cat, value: accum, color: getRandomHexColor() };
    recolt.push(value);
  });
  return recolt;
};
export const createTheContentFile= async(fileName:string, content:string)=>{
  const fileUri = FileSystem.documentDirectory+fileName;
  FileSystem.writeAsStringAsync(fileUri,content);
  console.log("file created:", fileUri);
}

export default useMarketStore;
