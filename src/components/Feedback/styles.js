import styled, { keyframes } from "styled-components";

const aparecer = keyframes`from { opacity: .4; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); }`;
const saltar = keyframes`0%,100% { transform: translateY(0) rotate(0); } 40% { transform: translateY(-8px) rotate(-8deg); } 70% { transform: translateY(-3px) rotate(8deg); }`;

export const Mensagem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 60px;
  padding: 14px 18px;
  border-radius: 18px;
  text-align: center;
  font-weight: 700;
  line-height: 1.5;
  animation: ${aparecer} 0.25s ease both;
  color: ${({ $tipo }) => ($tipo === "erro" ? "#925322" : "#28634e")};
  background: ${({ $tipo }) =>
    $tipo === "erro" ? "#ffe8bf" : $tipo === "neutro" ? "#f3f7df" : "#d9f6b6"};
`;

export const Simbolo = styled.span`
  font-size: 25px;
  flex-shrink: 0;
  animation: ${({ $festa }) => ($festa ? saltar : "none")} 0.7s ease 2;
`;
