import styled, { keyframes } from "styled-components";

const quedas = Array.from({ length: 8 }, (_, ordem) =>
  keyframes({
    [`0%, ${10 + ordem * 7}%`]: {
      opacity: 1,
      transform: "translate(0, 0) rotate(0)",
    },
    [`${17 + ordem * 7}%, 82%`]: {
      opacity: 0,
      transform: "translate(10px, 30px) rotate(18deg)",
    },
    "90%, 100%": {
      opacity: 1,
      transform: "translate(0, 0) rotate(0)",
    },
  }),
);

export const Overlay = styled.div`
  position: ${({ $local }) => ($local ? "absolute" : "fixed")};
  inset: 0;
  z-index: 1500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(8, 43, 30, 0.48);
  backdrop-filter: blur(3px);
  color: #fffbea;

  &:focus {
    outline: none;
  }
`;

export const Flor = styled.svg`
  width: 92px;
  height: 108px;
  overflow: visible;
  filter: drop-shadow(0 5px 9px #123c2555);
`;

export const Petala = styled.g`
  transform-box: view-box;
  transform-origin: 60px 59px;
  animation: ${({ $ordem }) => quedas[$ordem]} 3.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Legenda = styled.span`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 5px #123c2555;
`;
