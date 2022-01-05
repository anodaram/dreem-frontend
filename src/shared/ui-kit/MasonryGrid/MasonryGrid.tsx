import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 1,
  900: 2,
  1200: 3,
  1440: 4,
};

type MasonryGridProps<T> = {
  data: T[];
  renderItem: (data: T, index: number) => React.ReactNode;
  columnsCountBreakPoints?: object;
  gutter?: string;
};

export const MasonryGrid = <T extends unknown>({
  data,
  renderItem,
  columnsCountBreakPoints = COLUMNS_COUNT_BREAK_POINTS,
  gutter = "20px",
}: MasonryGridProps<T>) => (
  <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
    <Masonry gutter={gutter}>
      {data.map((item, index) => (
        <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
      ))}
    </Masonry>
  </ResponsiveMasonry>
);
