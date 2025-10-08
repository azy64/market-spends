import { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Button, Checkbox, Icon } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import useMarketStore, { daily, monthly } from "../store/marketStore";
import Legende from "./Legende";

type rangeProps = {
  startDate: CalendarDate;
  endDate: CalendarDate;
};
const Stats = () => {
  const shoppingLists = useMarketStore((state: any) => state.shoppingLists);
  const categories = useMarketStore((state: any) => state.categories);
  const currentShoppingListId = useMarketStore(
    (state: any) => state.currentShoppingListId
  );
  const categoriesValues: Array<string> = Object.values(categories);
  const [recolt, setRecolt] = useState<any>(daily());
  const [monthlyDate, setMonthlyDate] = useState([]);
  const [check, setCheck] = useState(false);
  const [range, setRange] = useState<rangeProps>({
    startDate: undefined,
    endDate: undefined,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRecolt(daily());
    if(monthly.length>0) onConfirm(range);
    //daily();
    return () => {
      setRecolt(daily());
    };
  }, [shoppingLists, currentShoppingListId,categories]);
  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }: rangeProps) => {
      setOpen(false);
      setRange({ startDate, endDate });
      if (startDate && endDate) {
        const result: any = monthly(
          startDate?.toISOString().split("T")[0],
          endDate?.toISOString().split("T")[0]
        );
        setMonthlyDate(result);
      }
    },
    [setOpen, setRange,currentShoppingListId,shoppingLists,categories]
  );
  return (
    <View>
      <View style={{ marginTop: 20 }}>
        <Checkbox.Item
          status={check ? "checked" : "unchecked"}
          onPress={() => {
            setCheck(!check);
          }}
          label="Daily"
        />
        <Button
          icon="calendar-month"
          onPress={() => setOpen(true)}
          style={{ width: 200, margin: "auto" }}
          uppercase={false}
          mode="contained"
        >
          Pick range
        </Button>
        <DatePickerModal
          locale="en"
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
        />
      </View>
      <ScrollView
        style={{
          height: (Dimensions.get("window").height * 82) / 100,
          marginTop: 10,
          padding: 10,
        }}
      >
        <View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {check && (
                <>
              <PieChart
                data={recolt}
                donut
                showText
                textColor="black"
                animationDuration={5}
                isAnimated
                shadow
                focusOnPress
                shadowColor="gray"
                shadowWidth={10}
                innerCircleColor="#414141"
                innerCircleBorderWidth={4}
                innerCircleBorderColor={"white"}
                showValuesAsLabels={true}
                centerLabelComponent={() => {
                  return (
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          textAlign: "center",
                        }}
                      >
                        <Icon source="currency-eur" size={20} color="white" />
                        {recolt.reduce(
                          (acc:Number, item: any) => acc + item.value,
                          0
                        )}
                      </Text>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          textAlign: "center",
                        }}
                      >
                        Total
                      </Text>
                    </View>
                  );
                }}
              />
              <Legende data={recolt}/>
              </>
              
            )}
          </View>
          <View>
            {monthlyDate.length > 0 && (
              <View>
                <View
                  style={{
                    flex: 1 / 3,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.text}>
                    <Icon size={30} source="calendar-month" />
                    {range.startDate?.toDateString()}
                  </Text>
                  <Icon source="arrow-right-thin" size={30} />
                  <Text style={styles.text}>
                    <Icon size={30} source="calendar-month" />{" "}
                    {range.endDate?.toDateString()}
                  </Text>
                </View>
                <View style={{ alignContent: "center", alignItems: "center" }}>
                  <PieChart
                    data={monthlyDate}
                    donut
                    showText
                    textColor="black"
                    animationDuration={5}
                    isAnimated
                    shadow
                    focusOnPress
                    shadowColor="gray"
                    shadowWidth={10}
                    textSize={13}
                    textBackgroundRadius={100}
                    innerCircleColor="#414141"
                    innerCircleBorderWidth={4}
                    innerCircleBorderColor={"white"}
                    showValuesAsLabels={true}
                    centerLabelComponent={() => {
                      return (
                        <View>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 18,
                              textAlign: "center",
                            }}
                          >
                            <Icon
                              source="currency-eur"
                              size={20}
                              color="white"
                            />
                            {monthlyDate.reduce(
                              (acc, item: any) => acc + item.value,
                              0
                            )}
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 18,
                              textAlign: "center",
                            }}
                          >
                            Total
                          </Text>
                        </View>
                      );
                    }}
                  />
                   <Legende data={monthlyDate}/>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    backgroundColor: "#ccc",
    padding: 5,
    margin: 5,
    color: "#444242ff",
    textAlign: "center",
    height: 40,
    textAlignVertical: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
export default Stats;
