import styled from "styled-components";

export const Cabecalho = styled.header`
  margin: 30px 0;

  h1 {
    font-size: clamp(27px, 4vw, 40px);
  }

  p {
    color: #677553;
  }
`;

export const Voltar = styled.button`
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 13px;
  border: 2px solid #b6d68c;
  background: #f1fad8;
  color: #315e36;
  font-weight: 800;
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
`;

export const Desenho = styled.button`
  padding: 10px;
  min-width: 0;
  border: 2px solid #cfdea4;
  border-radius: 18px;
  background: #fffdf6;
  box-shadow: 0 4px 0 #d9dca4;
  transition: transform 0.2s;
  color: #315a36;

  &:hover,
  &:focus-visible {
    transform: scale(1.055) rotate(-1deg);
    position: relative;
    z-index: 1;
  }

  img {
    width: 100%;
    aspect-ratio: 3/2;
    display: block;
    object-fit: contain;
    border-radius: 10px;
    background: white;
  }

  strong {
    display: block;
    margin: 10px 0 6px;
  }

  span {
    font-size: 12px;
  }
`;
