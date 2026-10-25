import styled, { css, keyframes } from "styled-components";

const respirar = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.09); }
`;
const comemorar = keyframes`
  0% { transform: translateY(0) scale(1); }
  35% { transform: translateY(-7px) scale(1.1); }
  65% { transform: translateY(2px) scale(.97); }
  100% { transform: translateY(0) scale(1); }
`;

export const Moldura = styled.div`
  width: ${({ $tamanho }) => $tamanho}px;
  max-width: 100%;
  aspect-ratio: 1;
  padding: ${({ $tamanho }) => Math.round($tamanho * 0.12)}px;
  margin: 14px auto 25px;
  border-radius: ${({ $tamanho }) => Math.round($tamanho * 0.25)}px;
  display: grid;
  place-items: center;
  line-height: 1;
  font-size: ${({ $tamanho }) => Math.round($tamanho * 0.6)}px;
  background: ${({ $fundo }) => $fundo};
  border: ${({ $tracejada, $borda }) =>
    `2px ${$tracejada ? "dashed" : "solid"} ${$borda}`};
  transform: rotate(${({ $angulo }) => $angulo}deg);
  transform-origin: center;
`;

export const Conteudo = styled.div`
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  place-items: center;
  transform: rotate(${({ $angulo }) => -$angulo}deg);
  transform-origin: center;
`;

export const Animacao = styled.div`
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;

  > svg {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }
  ${({ $efeito }) =>
    $efeito === "respirar" &&
    css`
      animation: ${respirar} 2.2s ease-in-out infinite;
    `}
  ${({ $efeito }) =>
    $efeito === "comemorar" &&
    css`
      animation: ${comemorar} 0.65s ease-out;
    `}
    
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
