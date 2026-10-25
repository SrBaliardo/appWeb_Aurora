import styled, { css, keyframes } from "styled-components";
const surgir = keyframes`from { transform: translateY(-8px) scale(.8); opacity: .2; } to { transform: translateY(0) scale(1); opacity: 1; }`;

export const Palavra = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(4px, 1vw, 10px);
  margin: 26px 0;
  flex-wrap: wrap;
`;

export const Letra = styled.span`
  display: grid;
  place-items: center;
  width: clamp(27px, 7vw, 57px);
  height: clamp(45px, 10vw, 66px);
  font-size: clamp(20px, 4.5vw, 31px);
  font-weight: 800;
  border-radius: 10px 10px 5px 5px;
  color: ${({ $revelada }) => ($revelada ? "#247332" : "#7d8056")};
  background: ${({ $revelada }) => ($revelada ? "#daf4a6" : "#fff3cc")};
  border-bottom: 3px solid
    ${({ $revelada }) => ($revelada ? "#65ac3c" : "#e1c465")};

  & > span {
    animation: ${surgir} 0.3s ease;
  }
  ${({ $separador }) =>
    $separador &&
    css`
      width: 14px;
      background: transparent;
      border-bottom: 0;
    `}
`;
