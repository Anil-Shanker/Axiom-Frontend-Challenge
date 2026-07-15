import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Token } from "../types";
import { TokenRow } from "./TokenRow";

interface TokenListProps {
  tokens: Token[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Must match `.row { height: 52px }` in index.css — fixed at every viewport width. */
const ROW_HEIGHT_PX = 52;

export function TokenList({
  tokens,
  selectedId,
  onSelect,
}: TokenListProps): JSX.Element {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tokens.length,
    getScrollElement: (): HTMLDivElement | null => parentRef.current,
    estimateSize: (): number => ROW_HEIGHT_PX,
    getItemKey: (index: number): string => tokens[index].id,
    overscan: 8,
  });

  return (
    <div className="feed__list" ref={parentRef}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const token = tokens[virtualItem.index];
          return (
            <TokenRow
              key={virtualItem.key}
              token={token}
              selected={token.id === selectedId}
              onSelect={onSelect}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
