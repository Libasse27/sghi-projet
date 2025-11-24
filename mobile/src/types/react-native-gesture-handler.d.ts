declare module 'react-native-gesture-handler' {
  import { Component, ComponentType } from 'react';
  import { ViewProps, ViewStyle } from 'react-native';

  export interface GestureHandlerRootViewProps extends ViewProps {
    style?: ViewStyle;
  }

  export class GestureHandlerRootView extends Component<GestureHandlerRootViewProps> {}

  export const Directions: {
    RIGHT: number;
    LEFT: number;
    UP: number;
    DOWN: number;
  };

  export interface GestureEvent {
    nativeEvent: {
      x: number;
      y: number;
      absoluteX: number;
      absoluteY: number;
      state: number;
    };
  }

  export interface PanGestureHandlerProps extends ViewProps {
    onGestureEvent?: (event: GestureEvent) => void;
    onHandlerStateChange?: (event: GestureEvent) => void;
    enabled?: boolean;
    minDist?: number;
    minPointers?: number;
    maxPointers?: number;
    avgTouches?: boolean;
  }

  export class PanGestureHandler extends Component<PanGestureHandlerProps> {}

  export interface TapGestureHandlerProps extends ViewProps {
    onHandlerStateChange?: (event: GestureEvent) => void;
    numberOfTaps?: number;
    maxDurationMs?: number;
    maxDelayMs?: number;
  }

  export class TapGestureHandler extends Component<TapGestureHandlerProps> {}

  export const State: {
    UNDETERMINED: number;
    FAILED: number;
    BEGAN: number;
    CANCELLED: number;
    ACTIVE: number;
    END: number;
  };

  export function gestureHandlerRootHOC<P>(
    Component: ComponentType<P>,
    containerStyles?: ViewStyle
  ): ComponentType<P>;

  export const Swipeable: any;
  export const DrawerLayout: any;
  export const FlatList: any;
  export const ScrollView: any;
}
