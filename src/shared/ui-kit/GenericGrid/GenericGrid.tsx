import styled, { css } from 'styled-components'

// example
// const columnsCountBreakPoints = {
//     900: 2,
//     1200: 3,
//     1400: 4,
//   };

const createResponsiveColumnsMediaQueries = (columnsCountBreakPoints: Record<number, number>) =>
  Object.entries(columnsCountBreakPoints).map(
    ([minWidth, numberOfColumns]) =>
      css`
        @media (min-width: ${minWidth}px) {
          grid-template-columns: repeat(${numberOfColumns}, minmax(0, 1fr));
        }
      `
  );

export const GenericGrid = styled.div<{ columnsCountBreakPoints: Record<number, number> }>`
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  ${p => createResponsiveColumnsMediaQueries(p.columnsCountBreakPoints)}
`;
