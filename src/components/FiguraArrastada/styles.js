import styled from "styled-components";

export const Fantasma = styled.div.attrs(({ $arrasto, $usarDimensoes }) => ({
  style: {
    transform: `translate3d(${$arrasto.x - ($usarDimensoes ? ($arrasto.offsetX ?? 36) : 36)}px, ${$arrasto.y - ($usarDimensoes ? ($arrasto.offsetY ?? 36) : 36)}px, 0)`,
    ...($usarDimensoes
      ? {
          width: `${$arrasto.largura || 72}px`,
          height: `${$arrasto.altura || 72}px`,
        }
      : {}),
  },
}))`
  position: fixed;
  top: 0;
  left: 0;
  width: 72px;
  height: 72px;
  z-index: 1600;
  pointer-events: none;
  display: grid;
  place-items: center;
  font-size: 52px;
  background: #fffbe8e8;
  border-radius: 16px;
  box-shadow: 0 8px 15px #294a2844;
`;
