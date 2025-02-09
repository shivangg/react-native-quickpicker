// @flow

import React from "react";
import {
  StyleSheet,
  Animated,
  View,
  Text,
  Picker,
  Platform,
  DatePickerIOS,
  FlatList,
  Dimensions,
  DatePickerAndroid,
  TimePickerAndroid,
} from "react-native";
import Touchable from "@appandflow/touchable";

const DEFAULT_BACKGROUNDCOLOR = "#E2E2E2";

const subscribers = [];
let uniqueId = 0;

let isOpen = false;
let onValueChange = () => null;
let onTapOut = null;
let onPressDone = null;
let items = [];
let selectedValue = null;
let backgroundColor = DEFAULT_BACKGROUNDCOLOR;
let topRow = null;
let textStyle = null;
let doneButtonText = "Done";
let doneButtonTextStyle = null;
let androidModalStyle = null;
let itemStyleAndroid = null;
let selectedItemStyleAndroid = null;
let useNativeDriver = false;
let pickerType = "normal";
let mode = Platform.OS === "ios" ? "date" : "default";
let date = null;
let minimumDate = null;
let maximumDate = null;
let locale = null;
let timeZoneOffsetInMinutes = null;
let minuteInterval = null;
let disableTopRow = false;

type StateType = {
  isOpen: boolean,
  onValueChange: Function,
  onTapOut: ?Function,
  onPressDone: ?Function,
  items: Array<string>,
  selectedValue: ?string | ?Date,
  backgroundColor: string,
  topRow: any,
  textStyle: ?Object,
  doneButtonText: ?string,
  doneButtonTextStyle: ?Object,
  androidModalStyle: ?Object,
  itemStyleAndroid: ?Object,
  selectedItemStyleAndroid: ?Object,
  useNativeDriver: boolean,
  pickerType: "normal" | "date",
  mode: "date" | "time" | "datetime" | "calendar" | "spinner" | "default",
  minimumDate: ?Date,
  maximumDate: ?Date,
  disableTopRow?: boolean,

  locale: ?string,
  timeZoneOffsetInMinutes: ?Number,
  minuteInterval: ?Number,
};

const pickerStore = {
  closePicker: () => {
    isOpen = false;

    setTimeout(() => {
      if (Platform.OS === "ios") {
        onValueChange = () => null;
        onTapOut = null;
        onPressDone = null;
        // textStyle = null;
        // doneButtonTextStyle = null;
        // backgroundColor = DEFAULT_BACKGROUNDCOLOR;
        items = [];
        selectedValue = null;
        // useNativeDriver = false;
        pickerType = "normal";
        mode = Platform.OS === "ios" ? "date" : "default";
        minimumDate = null;
        maximumDate = null;
        locale = null;
        timeZoneOffsetInMinutes = null;
        minuteInterval = null;
        disableTopRow = false;
      } else {
        onValueChange = () => null;
        onTapOut = null;
        onPressDone = null;
        // textStyle = null;
        // doneButtonTextStyle = null;
        // backgroundColor = DEFAULT_BACKGROUNDCOLOR;
        items = [];
        selectedValue = null;
        // useNativeDriver = false;
        pickerType = "normal";
        mode = Platform.OS === "ios" ? "date" : "default";
        minimumDate = null;
        maximumDate = null;
        disableTopRow = false;
      }

      pickerStore.updateSubscriber();
    }, 250);

    pickerStore.updateSubscriber();
  },
  openPicker: (
    newitems: ?Array<string>,
    newselectedValue: ?string | ?Date,
    newonValueChange: ?Function,
    newbackgroundColor: ?string,
    newtopRow: any,
    newonPressDone: ?Function,
    newonTapOut: ?Function,
    newtextStyle: ?Object,
    newdoneButtonText: ?string,
    newdoneButtonTextStyle: ?Object,
    newandroidModalStyle: ?Object,
    newitemStyleAndroid: ?Object,
    newselectedItemStyleAndroid: ?Object,
    newuseNativeDriver: boolean,
    newpickerType: ?("normal" | "date"),
    newmode: ?(
      | "date"
      | "time"
      | "datetime"
      | "calendar"
      | "spinner"
      | "default"
    ),
    newminimumDate: ?Date,
    newmaximumDate: ?Date,
    newlocale: ?string,
    newtimeZoneOffsetInMinutes: ?Number,
    newminuteInterval: ?Number,
    newdisableTopRow: ?boolean,
  ) => {
    items = newitems;
    selectedValue = newselectedValue;
    onValueChange = (newValue: ?string) => {
      pickerStore.updateSelectedValue(newValue);
      if (newonValueChange) {
        newonValueChange(newValue);
      }
    };

    if (newonPressDone) {
      onPressDone = () => {
        newonPressDone(selectedValue);
      };
    }

    if (newonTapOut) {
      onTapOut = () => {
        newonTapOut(selectedValue);
      };
    }
    if (newbackgroundColor) {
      backgroundColor = newbackgroundColor;
    }
    if (newtopRow) {
      topRow = newtopRow;
    }
    if (newtextStyle) {
      textStyle = newtextStyle;
    }
    if (newdoneButtonText) {
      doneButtonText = newdoneButtonText;
    }
    if (newdoneButtonTextStyle) {
      doneButtonTextStyle = newdoneButtonTextStyle;
    }
    if (newandroidModalStyle) {
      androidModalStyle = newandroidModalStyle;
    }
    if (newitemStyleAndroid) {
      itemStyleAndroid = newitemStyleAndroid;
    }
    if (newselectedItemStyleAndroid) {
      selectedItemStyleAndroid = newselectedItemStyleAndroid;
    }
    if (newuseNativeDriver) {
      useNativeDriver = newuseNativeDriver;
    }
    if (newpickerType) {
      pickerType = newpickerType;
    }
    if (newmode) {
      mode = newmode;
    }
    if (newminimumDate) {
      minimumDate = newminimumDate;
    }
    if (newmaximumDate) {
      maximumDate = newmaximumDate;
    }

    if (newlocale) {
      locale = newlocale;
    }

    if (newtimeZoneOffsetInMinutes) {
      timeZoneOffsetInMinutes = newtimeZoneOffsetInMinutes;
    }

    if (newminuteInterval) {
      minuteInterval = newminuteInterval;
    }

    if (newdisableTopRow) {
      disableTopRow = newdisableTopRow;
    }

    isOpen = true;
    pickerStore.updateSubscriber();
  },
  updateSelectedValue: (newselectedValue: ?string) => {
    selectedValue = newselectedValue;
    pickerStore.updateSubscriber();
  },
  updateSubscriber: () => {
    const state: StateType = {
      isOpen,
      items,
      selectedValue,
      onValueChange,
      backgroundColor,
      topRow,
      onPressDone,
      onTapOut,
      textStyle,
      doneButtonText,
      doneButtonTextStyle,
      androidModalStyle,
      itemStyleAndroid,
      selectedItemStyleAndroid,
      useNativeDriver,
      pickerType,
      mode,
      minimumDate,
      maximumDate,
      locale,
      timeZoneOffsetInMinutes,
      minuteInterval,
      disableTopRow,
    };
    subscribers.forEach(sub => sub.action(state));
  },
  addSubscription: (fonc: Function) => {
    uniqueId += 1;
    subscribers.push({ id: uniqueId, action: fonc });
    return uniqueId;
  },
  removeSubscription: (id: any) => {
    const index = subscribers.findIndex(e => e.id === id);
    subscribers.splice(index, 1);
  },
  isOpen: () => isOpen,
};

type GlobalPickerParams = {
  items: ?Array<string>,
  selectedValue: ?string,
  onValueChange: ?Function,
  backgroundColor: ?string,
  topRow: any,
  textStyle: ?Object,
  doneButtonText: ?string,
  doneButtonTextStyle: ?Object,
  androidModalStyle: ?Object,
  itemStyleAndroid: ?Object,
  selectedItemStyleAndroid: ?Object,
  useNativeDriver?: boolean,
  pickerType: "normal" | "date",
  mode: "date" | "time" | "datetime" | "calendar" | "spinner" | "default",
  minimumDate: ?Date,
  maximumDate: ?Date,
  locale: ?string,
  timeZoneOffsetInMinutes: ?Number,
  minuteInterval: ?Number,
  disableTopRow: ?boolean,
};

export default class GlobalPicker extends React.Component {
  static open(params: GlobalPickerParams) {
    const items = params && params.items;
    const selectedValue = params && params.selectedValue;
    const onValueChange = params && params.onValueChange;
    const backgroundColor = params && params.backgroundColor;
    const topRow = params && params.topRow;
    const onTapOut = params && params.onTapOut;
    const onPressDone = params && params.onPressDone;
    const textStyle = params && params.textStyle;
    const doneButtonText = params && params.doneButtonText;
    const doneButtonTextStyle = params && params.doneButtonTextStyle;
    const androidModalStyle = params && params.androidModalStyle;
    const itemStyleAndroid = params && params.itemStyleAndroid;
    const selectedItemStyleAndroid = params && params.selectedItemStyleAndroid;
    const useNativeDriver = params && params.useNativeDriver;

    const pickerType = params && params.pickerType;
    const mode = params && params.mode;
    const minimumDate = params && params.minimumDate;
    const maximumDate = params && params.maximumDate;

    const locale = params && params.locale;
    const timeZoneOffsetInMinutes = params && params.timeZoneOffsetInMinutes;
    const minuteInterval = params && params.minuteInterval;
    const disableTopRow = params && params.disableTopRow;

    pickerStore.openPicker(
      items,
      selectedValue,
      onValueChange,
      backgroundColor,
      topRow,
      onPressDone,
      onTapOut,
      textStyle,
      doneButtonText,
      doneButtonTextStyle,
      androidModalStyle,
      itemStyleAndroid,
      selectedItemStyleAndroid,
      useNativeDriver,
      pickerType,
      mode,
      minimumDate,
      maximumDate,
      locale,
      timeZoneOffsetInMinutes,
      minuteInterval,
      disableTopRow,
    );
  }

  static close = () => {
    pickerStore.closePicker();
  };

  props: Props;
  state = {
    isOpen: false,
    items: [],
    onValueChange: () => null,
    onPressDone: null,
    onTapOut: null,
    selectedValue: null,
    backgroundColor: DEFAULT_BACKGROUNDCOLOR,
    topRow: null,
    textStyle: null,
    doneButtonText: "Done",
    doneButtonTextStyle: null,
    androidModalStyle: null,
    itemStyleAndroid: null,
    selectedItemStyleAndroid: null,
    useNativeDriver: null,
    pickerType: "normal",
    mode: Platform.OS === "ios" ? "date" : "default",
    minimumDate: null,
    maximumDate: null,
    locale: null,
    timeZoneOffsetInMinutes: null,
    minuteInterval: null,
    disableTopRow: false,
  };
  _pickerStoreId = null;

  componentDidMount() {
    this._pickerStoreId = pickerStore.addSubscription(state =>
      this.setState({
        items: state.items,
        onValueChange: state.onValueChange,
        isOpen: state.isOpen,
        selectedValue: state.selectedValue,
        backgroundColor: state.backgroundColor,
        topRow: state.topRow,
        onTapOut: state.onTapOut,
        onPressDone: state.onPressDone,
        textStyle: state.textStyle,
        doneButtonText: state.doneButtonText,
        doneButtonTextStyle: state.doneButtonTextStyle,
        androidModalStyle: state.androidModalStyle,
        itemStyleAndroid: state.itemStyleAndroid,
        selectedItemStyleAndroid: state.selectedItemStyleAndroid,
        useNativeDriver: state.useNativeDriver,
        pickerType: state.pickerType,
        mode: state.mode,
        minimumDate: state.minimumDate,
        maximumDate: state.maximumDate,

        locale: state.locale,
        timeZoneOffsetInMinutes: state.timeZoneOffsetInMinutes,
        minuteInterval: state.minuteInterval,
        disableTopRow: state.disableTopRow,
      }),
    );
  }

  componentWillUnmount() {
    pickerStore.removeSubscription(this._pickerStoreId);
  }

  render() {
    const {
      isOpen,
      selectedValue,
      onValueChange,
      items,
      backgroundColor,
      topRow,
      onPressDone,
      onTapOut,
      textStyle,
      doneButtonText,
      doneButtonTextStyle,
      androidModalStyle,
      itemStyleAndroid,
      selectedItemStyleAndroid,
      useNativeDriver,
      pickerType,
      mode,
      minimumDate,
      maximumDate,
      locale,
      timeZoneOffsetInMinutes,
      minuteInterval,
      disableTopRow,
    } = this.state;
    return (
      <Pick
        isOpen={isOpen}
        onPressDone={onPressDone || GlobalPicker.close}
        onTapOut={onTapOut || GlobalPicker.close}
        selectedValue={
          selectedValue ||
          (pickerType === "normal" || pickerType === "multi"
            ? null
            : new Date())
        }
        onValueChange={onValueChange || null}
        items={items || []}
        backgroundColor={backgroundColor}
        topRow={topRow}
        textStyle={textStyle}
        doneButtonText={doneButtonText}
        doneButtonTextStyle={doneButtonTextStyle}
        androidModalStyle={androidModalStyle}
        itemStyleAndroid={itemStyleAndroid}
        selectedItemStyleAndroid={selectedItemStyleAndroid}
        useNativeDriver={useNativeDriver || false}
        pickerType={pickerType || "normal"}
        mode={mode}
        minimumDate={minimumDate || null}
        maximumDate={maximumDate || null}
        locale={locale || null}
        timeZoneOffsetInMinutes={timeZoneOffsetInMinutes || null}
        minuteInterval={minuteInterval || null}
        disableTopRow={disableTopRow}
      />
    );
  }
}

const HEIGHT = 250;

type PickProps = {
  isOpen: boolean,
  onPressDone: Function,
  onTapOut: Function,
  selectedValue: any,
  onValueChange: Function,
  items: Array<string>,
  backgroundColor: ?string,
  topRow: any,
  textStyle: ?Object,
  doneButtonText: ?string,
  doneButtonTextStyle: ?Object,
  androidModalStyle: ?Object,
  itemStyleAndroid: ?Object,
  selectedItemStyleAndroid: ?Object,
  useNativeDriver: boolean,
  pickerType: string,
  mode: string,
  minimumDate: ?Date,
  maximumDate: ?Date,

  locale: ?string,
  timeZoneOffsetInMinutes: ?Number,
  minuteInterval: ?Number,
  disableTopRow: ?boolean,
};

class Pick extends React.Component {
  state = {
    deltaY: new Animated.Value(0),
    opacity: new Animated.Value(0),
    showMask: false,
    selectedValues: [],
    androidDate: new Date(),
    androidTime: new Date(),
  };
  props: PickProps;
  _maskTimeout = null;

  _checkPickerType = () => {
    if (this.props.pickerType === "multi") {
      const selectedValues = Array.isArray(this.props.selectedValue)
        ? this.props.selectedValue
        : [this.props.selectedValue];

      this.setState({ selectedValues });
    }
  };

  componentWillUnmount() {
    clearTimeout(this._maskTimeout);
  }

  _Open = () => {
    Animated.timing(this.state.deltaY, {
      toValue: -HEIGHT,
      duration: 250,
      useNativeDriver: this.props.useNativeDriver,
    }).start();
  };

  _Close = () => {
    Animated.timing(this.state.deltaY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: this.props.useNativeDriver,
    }).start();
  };

  _fadeIn = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0.4,
      duration: 250,
      useNativeDriver: this.props.useNativeDriver,
    }).start();
  };

  _fadeOut = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: this.props.useNativeDriver,
    }).start();
    this._maskTimeout = setTimeout(
      () => this.setState({ showMask: false }),
      250,
    );
  };

  componentWillReceiveProps(newProps: Props) {
    if (this.props.isOpen !== newProps.isOpen) {
      if (newProps.isOpen) {
        this.setState({ showMask: true }, () => {
          if (
            Platform.OS !== "ios" &&
            (this.props.mode === "date" ||
              this.props.mode === "time" ||
              this.props.mode === "datetime")
          ) {
            this._handleAndroidDateOrTime();
          } else {
            this._checkPickerType();
            this._Open();
            this._fadeIn();
          }
        });
      } else {
        this._fadeOut();
        this._Close();
      }
    }
  }

  _handleAndroidDateOrTime = async () => {
    const {
      backgroundColor,
      topRow,
      onTapOut,
      onPressDone,
      textStyle,
      doneButtonText,
      doneButtonTextStyle,
      androidModalStyle,
      itemStyleAndroid,
      selectedItemStyleAndroid,
      pickerType,
      mode,
      selectedValue,
      minimumDate,
      maximumDate,
    } = this.props;

    if (mode === "date") {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: selectedValue || new Date(),
          minDate: minimumDate || undefined,
          maxDate: maximumDate || undefined,
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          const dateRes = new Date(year, month, day);
          this.props.onValueChange(dateRes);
        }
        if (action === DatePickerAndroid.dismissedAction) {
          onTapOut();
        }
      } catch ({ code, message }) {
        console.warn("Cannot open date picker", message);
      }
    } else if (mode === "time") {
      try {
        const { action, hour, minute } = await TimePickerAndroid.open({
          minute: selectedValue
            ? selectedValue.getMinutes()
            : new Date().getMinutes(),
          hour: selectedValue
            ? selectedValue.getHours()
            : new Date().getHours(),
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          const actualDate = new Date();
          const dateRes = new Date(
            actualDate.getFullYear(),
            actualDate.getMonth(),
            actualDate.getDate(),
            hour,
            minute,
          );
          this.props.onValueChange(dateRes);
        }
        if (action === DatePickerAndroid.dismissedAction) {
          onTapOut();
        }
      } catch ({ code, message }) {
        console.warn("Cannot open date picker", message);
      }
    } else if (mode === "datetime") {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: selectedValue || new Date(),
          minDate: minimumDate || undefined,
          maxDate: maximumDate || undefined,
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          const dateRes = new Date(year, month, day);

          const { action, hour, minute } = await TimePickerAndroid.open({
            minute: selectedValue
              ? selectedValue.getMinutes()
              : new Date().getMinutes(),
            hour: selectedValue
              ? selectedValue.getHours()
              : new Date().getHours(),
          });
          if (action !== TimePickerAndroid.dismissedAction) {
            const dateResFinal = new Date(
              dateRes.getFullYear(),
              dateRes.getMonth(),
              dateRes.getDate(),
              hour,
              minute,
            );
            this.props.onValueChange(dateResFinal);
          }
        }
        if (action === DatePickerAndroid.dismissedAction) {
          onTapOut();
        }
      } catch ({ code, message }) {
        console.warn("Cannot open date picker", message);
      }
    }
  };

  _keyExtractor = item => item;

  _renderItem = ({ item, index }) => {
    const { selectedValues } = this.state;

    const isSelected = selectedValues.find(a => a === item);

    return (
      <Touchable
        feedback="none"
        style={[
          styles.flatlistButton,
          index + 1 === this.props.items.length ? { borderBottomWidth: 0 } : {},
        ]}
        onPress={() => this._multiPickerOnValueChange(item)}
      >
        <Text
          style={[
            styles.flatlistCheck,
            isSelected && {
              color: Platform.OS === "ios" ? "#0076FF" : "rgb(21,149,135)",
            },
          ]}
        >
          {isSelected && "✓ "}
        </Text>
        <Text
          style={[
            styles.flatlistButtonText,
            isSelected && {
              color: Platform.OS === "ios" ? "#0076FF" : "rgb(21,149,135)",
            },
          ]}
        >
          {item}
        </Text>
      </Touchable>
    );
  };

  _multiPickerOnValueChange = selectedValueFromPicker => {
    const itemIndex = this.state.selectedValues.findIndex(
      a => a === selectedValueFromPicker,
    );
    const newselectedValues = this.state.selectedValues.slice();
    if (itemIndex !== -1) {
      newselectedValues.splice(itemIndex, 1);
      this.setState({ selectedValues: newselectedValues });
    } else {
      newselectedValues.push(selectedValueFromPicker);
      this.setState({ selectedValues: newselectedValues });
    }

    this.props.onValueChange(newselectedValues);
  };

  _renderPickerBasedOnType = () => {
    const {
      backgroundColor,
      topRow,
      onTapOut,
      onPressDone,
      textStyle,
      doneButtonText,
      doneButtonTextStyle,
      androidModalStyle,
      itemStyleAndroid,
      selectedItemStyleAndroid,
      pickerType,
      mode,
      minimumDate,
      maximumDate,
      locale,
      timeZoneOffsetInMinutes,
      minuteInterval,
      disableTopRow,
    } = this.props;

    if (pickerType === "multi") {
      return (
        <View
          style={[
            styles.bottomContainerFlatList,
            { backgroundColor },
            disableTopRow ? { height: HEIGHT } : {},
          ]}
        >
          <FlatList
            style={{ flex: 1 }}
            data={items}
            extraData={this.props}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor },
          disableTopRow ? { height: HEIGHT } : {},
        ]}
      >
        {pickerType === "normal" ? (
          <Picker
            selectedValue={this.props.selectedValue}
            onValueChange={itemValue => {
              this.props.onValueChange(itemValue);
            }}
            itemStyle={textStyle}
          >
            {this.props.items.map(item => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        ) : Platform.OS === "ios" ? (
          <DatePickerIOS
            date={selectedValue}
            mode={mode}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onDateChange={date => this.props.onValueChange(date)}
            locale={locale}
            timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
            minuteInterval={minuteInterval}
          />
        ) : (
          this._renderAndroidTimePickerBasedOnMode()
        )}
      </View>
    );
  };

  _androidCalculateNewDateTime = () => {
    const { androidDate, androidTime } = this.state;

    const dateRes = new Date(
      androidDate.getFullYear(),
      androidDate.getMonth(),
      androidDate.getDate(),
      androidTime.getHours(),
      androidTime.getMinutes(),
    );

    this.props.onValueChange(dateRes);
  };

  _renderAndroidTimePickerBasedOnMode = () => {
    const {
      backgroundColor,
      topRow,
      onTapOut,
      onPressDone,
      textStyle,
      doneButtonText,
      doneButtonTextStyle,
      androidModalStyle,
      itemStyleAndroid,
      selectedItemStyleAndroid,
      pickerType,
      mode,
      selectedValue,
      minimumDate,
      maximumDate,
    } = this.props;

    if (mode === "datetime") {
      return (
        <View style={{ flex: 1 }}>
          <Touchable
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderColor: "lightgray",
            }}
            hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
            feedback="opacity"
            onPress={async () => {
              try {
                const {
                  action,
                  year,
                  month,
                  day,
                } = await DatePickerAndroid.open({
                  date: selectedValue || new Date(),
                  minDate: minimumDate || undefined,
                  maxDate: maximumDate || undefined,
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                  const dateRes = new Date(year, month, day);
                  this.setState(
                    { androidDate: dateRes },
                    this._androidCalculateNewDateTime,
                  );
                }
              } catch ({ code, message }) {
                console.warn("Cannot open date picker", message);
              }
            }}
          >
            <Text style={styles.doneButton}>Select Date</Text>
            {selectedValue ? (
              <Text style={[styles.doneButton, { marginTop: 5 }]}>
                {selectedValue.toLocaleDateString("en-US")}
              </Text>
            ) : null}
          </Touchable>

          <Touchable
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
            feedback="opacity"
            onPress={async () => {
              try {
                const { action, hour, minute } = await TimePickerAndroid.open({
                  minute: selectedValue
                    ? selectedValue.getMinutes()
                    : new Date().getMinutes(),
                  hour: selectedValue
                    ? selectedValue.getHours()
                    : new Date().getHours(),
                });
                if (action !== TimePickerAndroid.dismissedAction) {
                  const actualDate = new Date();
                  const dateRes = new Date(
                    actualDate.getFullYear(),
                    actualDate.getMonth(),
                    actualDate.getDate(),
                    hour,
                    minute,
                  );
                  this.setState(
                    { androidTime: dateRes },
                    this._androidCalculateNewDateTime,
                  );
                }
              } catch ({ code, message }) {
                console.warn("Cannot open date picker", message);
              }
            }}
          >
            <Text style={styles.doneButton}>Select Time</Text>
            {selectedValue ? (
              <Text style={[styles.doneButton, { marginTop: 5 }]}>
                {selectedValue.toLocaleTimeString("en-US")}
              </Text>
            ) : null}
          </Touchable>
        </View>
      );
    }
    return <View />;
  };

  _keyExtractorAndroidNormal = (item, index) => item + String(index);

  render() {
    const {
      backgroundColor,
      topRow,
      onTapOut,
      onPressDone,
      textStyle,
      doneButtonText,
      doneButtonTextStyle,
      androidModalStyle,
      itemStyleAndroid,
      selectedItemStyleAndroid,
      pickerType,
      mode,
      minimumDate,
      maximumDate,
      disableTopRow,
    } = this.props;
    if (!this.state.showMask) {
      return null;
    }

    if (Platform.OS === "android" && pickerType === "normal") {
      return (
        <View style={styles.mainContainer}>
          <Touchable
            feedback="none"
            native={false}
            style={{ flex: 1 }}
            onPress={onTapOut}
          >
            <Animated.View
              style={[
                styles.mask,
                {
                  opacity: this.state.opacity,
                },
              ]}
            />
          </Touchable>
          <View
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              bottom: "6%",
              top: "6%",
              flexDirection: "row",
            }}
          >
            <FlatList
              style={[
                {
                  alignSelf: "center",
                  backgroundColor: "white",
                  borderRadius: 2,
                },
                androidModalStyle,
              ]}
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 12,
              }}
              keyExtractor={this._keyExtractorAndroidNormal}
              data={this.props.items}
              renderItem={({ item }) => (
                <Touchable
                  feedback="none"
                  native={false}
                  style={{ minHeight: 40, justifyContent: "center" }}
                  onPress={() => {
                    this.props.onValueChange(item);
                    setTimeout(GlobalPicker.close, 10);
                  }}
                >
                  <Text
                    style={[
                      {
                        fontSize: 22,
                        color:
                          this.props.selectedValue === item
                            ? "rgb(21,149,135)"
                            : "black",
                      },
                      itemStyleAndroid,
                      this.props.selectedValue === item
                        ? selectedItemStyleAndroid
                        : null,
                    ]}
                  >
                    {item}
                  </Text>
                </Touchable>
              )}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mainContainer}>
        <Touchable
          feedback="none"
          native={false}
          style={{ flex: 1 }}
          onPress={onTapOut}
        >
          <Animated.View
            style={[
              styles.mask,
              {
                opacity: this.state.opacity,
              },
            ]}
          />
        </Touchable>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  translateY: this.state.deltaY,
                },
              ],
            },
          ]}
        >
          <View
            style={{
              height: disableTopRow ? 0 : BORDERHEIGHT,
              backgroundColor: "#F1F1F1",
            }}
          >
            {topRow ? (
              topRow
            ) : (
              <View
                style={[
                  styles.borderContainer,
                  disableTopRow ? { height: 0 } : {},
                ]}
              >
                <Touchable feedback="opacity" onPress={onPressDone}>
                  <Text style={[styles.doneButton, doneButtonTextStyle]}>
                    {doneButtonText}
                  </Text>
                </Touchable>
              </View>
            )}
          </View>
          {this._renderPickerBasedOnType()}
        </Animated.View>
      </View>
    );
  }
}

const BORDERHEIGHT = 50;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: "absolute",
  },
  mask: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    position: "absolute",
    bottom: 0 - HEIGHT,
    right: 0,
    left: 0,
    height: HEIGHT,
    borderTopWidth: 1,
    borderColor: "lightgray",
  },
  borderContainer: {
    height: BORDERHEIGHT,
    paddingHorizontal: 17,
    justifyContent: "center",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  bottomContainer: {
    backgroundColor: "#E2E2E2",
    height: HEIGHT - BORDERHEIGHT,
  },
  bottomContainerFlatList: {
    backgroundColor: "#E2E2E2",
    height: HEIGHT - BORDERHEIGHT,
    alignItems: "center",
    paddingVertical: 10,
  },
  doneButton: {
    fontWeight: "600",
    fontSize: 20,
    color: Platform.OS === "ios" ? "#0076FF" : "rgb(21,149,135)",
  },
  flatlistButton: {
    minHeight: 58,
    alignItems: "center",
    flexDirection: "row",
    width: Dimensions.get("window").width,
    borderBottomWidth: 1,
    borderColor: "lightgray",
    paddingLeft: 15,
  },
  flatlistButtonText: {
    fontSize: 22,
    color: "gray",
    maxWidth: Dimensions.get("window").width - 40 - 30,
  },
  flatlistCheck: {
    fontSize: 22,
    width: 40,
  },
});
