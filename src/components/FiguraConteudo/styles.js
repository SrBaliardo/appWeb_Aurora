import styled from "styled-components";

export const Figura = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  font-size: inherit;
  line-height: 1;
  text-align: center;
  font-family:
    "Segoe UI Emoji", "Apple Color Emoji", "Trebuchet MS", sans-serif;

  svg {
    display: block;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: inherit;
  }
`;

export const Numero = styled.span`
  display: block;
  max-width: 100%;
  line-height: 1;
  text-align: center;
  font-family: "Trebuchet MS", sans-serif;
  font-variant-numeric: tabular-nums;
  color: #634398;
  font-weight: 800;
  font-size: ${({ $digitos }) =>
    $digitos > 2 ? ".68em" : $digitos > 1 ? ".82em" : "1em"};
`;
