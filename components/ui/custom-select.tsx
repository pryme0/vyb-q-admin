"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onScrollToBottom?: () => void;
  isLoadingMore?: boolean;
}

interface CustomSelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
  children,
  className,
  onScrollToBottom,
  isLoadingMore = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!dropdownRef.current || !onScrollToBottom) return;

      const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
      
      // If scrolled to within 50px of the bottom
      if (scrollHeight - scrollTop - clientHeight < 50 && !isLoadingMore) {
        onScrollToBottom();
      }
    };

    const dropdown = dropdownRef.current;
    if (dropdown && isOpen) {
      dropdown.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (dropdown) {
        dropdown.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen, onScrollToBottom, isLoadingMore]);

  // Extract items and other children from children
  const processChildren = (children: React.ReactNode): { items: any[]; otherElements: React.ReactNode[] } => {
    const items: any[] = [];
    const otherElements: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // Check if this element has a 'value' prop, which indicates it's a select item
        if ('value' in child.props && child.props.value !== undefined) {
          items.push(child);
        } else if (child.type === React.Fragment || (typeof child.type === 'symbol')) {
          // Handle fragments - recursively process their children
          const fragmentResult = processChildren(child.props.children);
          items.push(...fragmentResult.items);
          otherElements.push(...fragmentResult.otherElements);
        } else if (Array.isArray(child)) {
          // Handle arrays
          const arrayResult = processChildren(child);
          items.push(...arrayResult.items);
          otherElements.push(...arrayResult.otherElements);
        } else {
          // It's some other element (like a div with Load More button)
          otherElements.push(child);
        }
      } else if (Array.isArray(child)) {
        // Handle arrays directly
        const arrayResult = processChildren(child);
        items.push(...arrayResult.items);
        otherElements.push(...arrayResult.otherElements);
      }
    });

    return { items, otherElements };
  };

  const { items, otherElements } = processChildren(children);

  const selectedItem = items.find((item) => item.props.value === value);
  const displayText = selectedItem ? selectedItem.props.children : placeholder;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          !selectedItem && "text-muted-foreground"
        )}
      >
        <span className="block truncate">{displayText}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 max-h-[300px] w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
          style={{ top: "100%" }}
        >
          <div className="p-1">
            {items.map((item) => {
              const isSelected = item.props.value === value;
              const isDisabled = item.props.disabled;

              return (
                <button
                  key={item.props.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      onValueChange(item.props.value);
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    isDisabled && "pointer-events-none opacity-50",
                    isSelected && "bg-accent"
                  )}
                >
                  {isSelected && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  <span className="block truncate">{item.props.children}</span>
                </button>
              );
            })}
            {otherElements}
            {isLoadingMore && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Loading more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomSelectItem({
  value,
  children,
  disabled = false,
}: CustomSelectItemProps) {
  // This component is just a marker for the parent CustomSelect
  // It doesn't render anything itself
  return null;
}

CustomSelectItem.displayName = "CustomSelectItem";

