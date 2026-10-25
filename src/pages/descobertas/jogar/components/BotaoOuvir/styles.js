import styled, { keyframes } from "styled-components";

const falando = keyframes`0%,100% { opacity: 1; } 50% { opacity: .45; }`;

export const Botao = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  border: 0;
  color: #315f34;
  background: transparent;

  &::before {
    content: "";
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    border: 1px solid #b9d6a1;
    background: ${({ $ativo }) => ($ativo ? "#bde886" : "#eef8dd")};
  }

  svg {
    position: relative;
    animation: ${({ $ativo }) => ($ativo ? falando : "none")} 1s ease-in-out
      infinite;
  }

  &:hover:not(:disabled)::before {
    background: #d6efb6;
  }

  &:disabled {
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      animation: none;
    }
  }
`;
