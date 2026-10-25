import styled from "styled-components";

export const Menu = styled.div`
  grid-column: 1 / -1;
  min-width: 0;
  width: 100%;
`;

export const Nav = styled.nav`
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  a:focus-visible {
    outline-offset: 1px;
  }
`;

export const Itens = styled.div`
  display: flex;
  gap: 5px;
  width: max-content;
  min-width: 100%;
  padding: 5px;

  > a {
    flex-shrink: 0;
  }
`;
