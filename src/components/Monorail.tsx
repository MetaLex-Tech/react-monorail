"use client";

import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { atom, Provider, useAtom, useSetAtom } from "jotai";
import type React from "react";
import {
  Children,
  cloneElement,
  type FC,
  forwardRef,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn";

// Atoms. Note these are internal to each monorail due to the Jotai Provider.
const activeIndexAtom = atom<number | null>(0);
const hoveredIndexAtom = atom<number | null>(null);

/* -------------------------------------------------------------------------- */
/*                                  Monorail                                  */
/* -------------------------------------------------------------------------- */

type MonorailProps = {
  className?: string;
  style?: React.CSSProperties;
  /** MonorailCar should be passed as children. NOTE: They can not be abstracted into components, they need to be passed as direct children. */
  children:
    | ReactElement<MonorailCarProps>
    | (ReactElement<MonorailCarProps> | null)[];
  /** Pass if you want to control active index yourself, if set then component is controlled */
  activeIndex?: number;
  /** Set the initial active index, component stays uncontrolled */
  initialActiveIndex?: number;
  /** Disable width transitions of monorail cars */
  disableTransitions?: boolean;
  /** Called when active index changes */
  onActiveIndexChange?: (index: number) => void;
};

/**
 * The main Monorail component that wraps MonorailCar items.
 * It provides a Jotai Provider and handles the default active index.
 */
export const Monorail: React.FC<MonorailProps> = ({
  className,
  style,
  children,
  initialActiveIndex: defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  disableTransitions = false,
  onActiveIndexChange,
}) => {
  const setActiveIndex = useSetAtom(activeIndexAtom);

  useLayoutEffect(() => {
    if (controlledActiveIndex != null) {
      setActiveIndex(controlledActiveIndex);
    } else {
      setActiveIndex(defaultActiveIndex ?? null);
    }
  }, [controlledActiveIndex, defaultActiveIndex, setActiveIndex]);

  // Add index and totalItems props to each child.
  const childrenWithIndices = Children.map(children, (child, index) =>
    child
      ? cloneElement(child, {
          index,
          disableTransitions,
          totalItems: Children.count(children),
          onActiveIndexChange,
          activeIndex: controlledActiveIndex,
        })
      : null,
  );

  return (
    <Provider>
      <div
        className={cn("monorail flex flex-row items-center gap-0.5", className)}
        style={style}
      >
        {childrenWithIndices}
      </div>
      {(controlledActiveIndex != null || defaultActiveIndex != null) && (
        <ActiveIndexUpdater
          controlledActiveIndex={controlledActiveIndex}
          defaultActiveIndex={defaultActiveIndex}
        />
      )}
    </Provider>
  );
};

export type MonorailCarProps = {
  index?: number;
  disableTransitions?: boolean;
  hasHoverEffect?: boolean;
  isActive?: boolean;
  isButton?: boolean;
  children: (state: {
    isActive: boolean;
    isHovered: boolean;
    isOtherHovered: boolean;
  }) => ReactNode;
  icon?: ReactNode;
  className?: string;
  activeClassName?: string;
  childrenWrapperClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  totalItems?: number;
  key?: string;
  onActiveIndexChange?: (index: number) => void;
  onClick?: (index: number) => void;
  activeIndex?: number;
  style?: HTMLAttributes<HTMLDivElement>["style"];
};

const ActiveIndexUpdater = ({
  controlledActiveIndex,
  defaultActiveIndex,
}: {
  controlledActiveIndex?: number;
  defaultActiveIndex?: number;
}) => {
  const setActiveIndex = useSetAtom(activeIndexAtom);
  useLayoutEffect(() => {
    setActiveIndex(controlledActiveIndex ?? defaultActiveIndex ?? null);
  }, [controlledActiveIndex, defaultActiveIndex, setActiveIndex]);
  return null;
};

/* -------------------------------------------------------------------------- */
/*                                 MonorailCar                                */
/* -------------------------------------------------------------------------- */

/**
 * The MonorailCar component represents an individual item in the Monorail. It
 * handles its own active and hover states, and renders children based on these
 * states.
 */

const BASE_CAR_HEIGHT_PX = 28;

/** Right-side chevron clip vars, scaled from the 28px base height. */
export function augRightClipVars(heightPx: number): React.CSSProperties {
  const height = heightPx > 0 ? heightPx : BASE_CAR_HEIGHT_PX;
  const extra = height - BASE_CAR_HEIGHT_PX;
  const inset = 4 + extra * 0.5;
  return {
    "--aug-tr-inset1": `${inset}px`,
    "--aug-br-inset2": `${inset}px`,
    "--aug-tr1-width": "6px",
    "--aug-br1-width": "6px",
    "--aug-br1-height": "5px",
    "--aug-tr1-height": "5px",
  } as React.CSSProperties;
}

const monorailCarVariants = cva(
  cn(
    "relative appearance-none min-w-4 px-2 py-[1px]",
    "-ml-1.5 pl-[14px]",
    "h-[28px] text-xs",
    "bg-[rgb(var(--monorail-bg))] text-[rgb(var(--monorail-text))]",
    "[--aug-border-all:2px] [--aug-border-bg:rgb(var(--monorail-bg))]",
  ),
  {
    variants: {
      transitions: {
        true: "transition-colors",
      },
      hasIcon: {
        true: "",
        false: "",
      },
      position: {
        middle: "",
        first:
          "rounded-l-[4px] pr-[4px] ml-0 pl-[8px] [--aug-tl1:4px] [--aug-bl1:4px]",
        last: "rounded-r-[4px] pr-[6px] [--aug-tr1:4px] [--aug-br1:4px]",
        single: "rounded-[4px] pr-[0px] pl-[8px] ml-0",
      },
      active: {
        true: "bg-[rgb(var(--monorail-active-bg))] [--aug-border-bg:rgb(var(--monorail-active-bg))] text-[rgb(var(--monorail-active-text))]",
      },
    },
    compoundVariants: [
      {
        hasIcon: true,
        position: ["first", "single"],
        className: "!pl-0.5",
      },
      {
        hasIcon: true,
        position: ["last", "middle"],
        className: "!pl-2",
      },
      {
        position: ["last", "middle"],
        className:
          "[--aug-l1-width:6px] [--aug-l2-width:6px] [--aug-l1-height:5px] [--aug-l2-height:5px] [--aug-l-extend1:12px]",
      },
    ],
    defaultVariants: {
      position: "middle",
      active: false,
      hasIcon: false,
    },
  },
);

export const MonorailCar = forwardRef<
  HTMLDivElement | HTMLButtonElement,
  MonorailCarProps
>(
  (
    {
      index,
      disableTransitions = false,
      hasHoverEffect = false,
      isActive = false,
      isButton = true,
      children,
      icon,
      className,
      activeClassName,
      childrenWrapperClassName,
      contentClassName,
      iconClassName,
      totalItems,
      onActiveIndexChange,
      onClick,
      activeIndex: controlledActiveIndex,
      style,
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useAtom(activeIndexAtom);
    const [hoveredIndex, setHoveredIndex] = useAtom(hoveredIndexAtom);
    const isControlled = controlledActiveIndex !== undefined;
    const carRef = useRef<HTMLDivElement | HTMLButtonElement | null>(null);
    const [height, setHeight] = useState(BASE_CAR_HEIGHT_PX);

    const setCarRef = useCallback(
      (node: HTMLDivElement | HTMLButtonElement | null) => {
        carRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useLayoutEffect(() => {
      const el = carRef.current;
      if (!el) {
        return;
      }

      const updateHeight = () => {
        const next = el.getBoundingClientRect().height;
        setHeight(next > 0 ? next : BASE_CAR_HEIGHT_PX);
      };

      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      observer.observe(el);
      return () => observer.disconnect();
    }, [isButton]);

    const rightClipStyle = useMemo(() => augRightClipVars(height), [height]);

    const itemState = useMemo(
      () => ({
        isActive: isActive || activeIndex === index,
        isHovered: hoveredIndex === index,
        isOtherHovered: hoveredIndex != null && hoveredIndex !== index,
      }),
      [activeIndex, isActive, hoveredIndex, index],
    );

    const isFirst = index === 0;
    const isLast = !totalItems || index === totalItems - 1;
    const isSingle = isFirst && isLast;
    const hasIcon = !!icon;

    let position: "middle" | "first" | "last" | "single" = "middle";
    if (isSingle) {
      position = "single";
    } else if (isFirst) {
      position = "first";
    } else if (isLast) {
      position = "last";
    }

    interface ElementProps
      extends React.HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
      [key: `data-${string}`]: string | boolean;
    }

    const handleButtonClick = (): void => {
      if (isControlled) {
        onClick?.(index!);

        return;
      }

      setActiveIndex(index!);
      onActiveIndexChange?.(index!);
    };

    const elementProps: ElementProps = {
      className: cn(
        monorailCarVariants({
          position,
          hasIcon,
          active: itemState.isActive || (hasHoverEffect && itemState.isHovered),
          [`${activeClassName}`]:
            itemState.isActive || (hasHoverEffect && itemState.isHovered),
          transitions: !disableTransitions,
        }),
        className,
      ),
      "data-augmented-ui": `
        ${!isLast && "tr-clip-y br-clip-y"}
        ${!isFirst && "l-clip-y"}
        ${isFirst && !isSingle && "tl-round bl-round"}
        ${isLast && !isSingle && "tr-round br-round"}`,
      "data-active": itemState.isActive,
      "data-hovered": itemState.isHovered,
      style: { ...rightClipStyle, ...style },
      onMouseEnter: () => setHoveredIndex(index!),
      onMouseLeave: () => setHoveredIndex(null),
    };

    const monorailContentProps: MonorailContentProps = {
      disableTransitions,
      iconClassName,
      childrenWrapperClassName,
      className: contentClassName,
      isActive: itemState.isActive,
      isFirst,
      isHovered: itemState.isHovered,
      icon,
    };

    if (!isButton) {
      return (
        <div {...elementProps} ref={setCarRef as React.Ref<HTMLDivElement>}>
          <MonorailContent {...monorailContentProps}>
            {children(itemState)}
          </MonorailContent>
        </div>
      );
    }

    return (
      <button
        {...elementProps}
        ref={setCarRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={handleButtonClick}
      >
        <MonorailContent {...monorailContentProps}>
          {children(itemState)}
        </MonorailContent>
      </button>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                               MonorailContent                              */
/* -------------------------------------------------------------------------- */

type MonorailContentProps = {
  className?: string;
  childrenWrapperClassName?: string;
  iconClassName?: string;
  disableTransitions?: boolean;
  isActive?: boolean;
  isFirst?: boolean;
  isHovered?: boolean;
  icon?: ReactNode;
};

const MonorailContent: FC<PropsWithChildren<MonorailContentProps>> = ({
  className,
  childrenWrapperClassName,
  iconClassName,
  disableTransitions,
  isActive,
  isFirst,
  children,
  icon,
}) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) {
      return;
    }

    const updateWidth = () => {
      setWidth(el.getBoundingClientRect().width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // This div is used to smoothly animate changing content widths.
    <motion.div
      {...(!disableTransitions && {
        initial: false,
        animate: { width: width === undefined ? "auto" : width },
      })}
      className={cn(
        "flex overflow-hidden h-full",
        { "w-fit": disableTransitions },
        className,
      )}
    >
      {/* This div is just used to measure the dynamic contents */}
      <div
        ref={measureRef}
        className="flex w-max shrink-0 items-center gap-1 whitespace-nowrap"
      >
        {icon && (
          <div
            className={cn([
              "flex items-center justify-center w-6 h-6 rounded-[4px] overflow-hidden",
              {
                "bg-gradient-to-r from-[rgba(var(--monorail-text)/0.11)] to-[rgba(var(--monorail-text)/0)]":
                  isActive && isFirst,
              },
              iconClassName,
            ])}
          >
            {icon}
          </div>
        )}

        {children ? (
          // This just adds additional space to the right when there are
          // children, allowing empty items to be smaller.
          <div
            className={cn(
              "mr-2 flex items-center h-full",
              childrenWrapperClassName,
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};
