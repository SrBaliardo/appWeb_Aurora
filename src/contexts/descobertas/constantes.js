import {
  descreverObjeto as objeto,
  descreverForma as forma,
} from "./builders/conteudo.js";

export const FIGURAS = [
  objeto("abelha", "ABELHA", "🐝", [
    "É um inseto.",
    "Visita flores.",
    "Produz mel.",
  ]),
  objeto("bola", "BOLA", "⚽", [
    "É um brinquedo.",
    "Rola e quica.",
    "Pode ser usada no futebol.",
  ]),
  objeto("bala", "BALA", "🍬", [
    "É uma guloseima.",
    "Pode vir embrulhada.",
    "É um doce pequenino.",
  ]),
  objeto("suco", "SUCO", "🧃", [
    "É uma bebida.",
    "Pode ser feito de frutas.",
    "Pode acompanhar um lanche.",
  ]),
  objeto("mala", "MALA", "🧳", [
    "Guarda objetos.",
    "Pode ter rodinhas.",
    "Leva roupas na viagem.",
  ]),
  objeto("banana", "BANANA", "🍌", [
    "É uma fruta.",
    "Tem casca amarela quando madura.",
    "É comprida e curva.",
  ]),
  objeto("gato", "GATO", "🐱", ["É um animal.", "Tem bigodes.", "Faz miau."]),
  objeto("pato", "PATO", "🦆", [
    "É uma ave.",
    "Gosta de nadar.",
    "Faz quá-quá.",
  ]),
  objeto("flor", "FLOR", "🌼", [
    "Faz parte de uma planta.",
    "Pode ser perfumada.",
    "Tem pétalas.",
  ]),
  objeto("pao", "PÃO", "🍞", [
    "É um alimento.",
    "Pode estar no café da manhã.",
    "Pode virar um sanduíche.",
  ]),
  objeto(
    "oculos",
    "ÓCULOS",
    "👓",
    ["É usado no rosto.", "Tem duas lentes.", "A Raposa usa um par."],
    "dificil",
  ),
  objeto(
    "lanterna",
    "LANTERNA",
    "🔦",
    [
      "Ilumina quando está escuro.",
      "Pode ser levada na mão.",
      "A turma a usa no passeio noturno.",
    ],
    "dificil",
  ),
  objeto(
    "mochila",
    "MOCHILA",
    "🎒",
    ["Carrega objetos nas costas.", "Tem alças.", "A Capivara usa uma verde."],
    "dificil",
  ),
  objeto(
    "borboleta",
    "BORBOLETA",
    "🦋",
    ["É um inseto de asas largas.", "Pode visitar flores.", "Voa pelo bosque."],
    "dificil",
  ),
  objeto(
    "sanduiche",
    "SANDUÍCHE",
    "🥪",
    ["É um lanche feito com pão.", "Tem recheio.", "Pode levar alface."],
    "dificil",
  ),
  objeto(
    "guarda-chuva",
    "GUARDA-CHUVA",
    "☂️",
    [
      "Ajuda a ficar seco na chuva.",
      "Pode ser aberto e fechado.",
      "É segurado por um cabo.",
    ],
    "dificil",
  ),
  objeto(
    "microscopio",
    "MICROSCÓPIO",
    "🔬",
    [
      "Ajuda a observar coisas bem pequenas.",
      "Usa lentes.",
      "É encontrado em laboratórios.",
    ],
    "dificil",
  ),
  objeto(
    "telescopio",
    "TELESCÓPIO",
    "🔭",
    [
      "Ajuda a observar coisas distantes.",
      "Pode ser apontado para o céu.",
      "Ajuda a ver estrelas e planetas.",
    ],
    "dificil",
  ),
  forma("circulo", "CÍRCULO", [
    "Não tem cantos.",
    "É redondo.",
    "Lembra a face de uma moeda.",
  ]),
  forma("quadrado", "QUADRADO", [
    "Tem quatro lados.",
    "Todos os lados têm o mesmo tamanho.",
    "Tem quatro cantos retos.",
  ]),
  forma("triangulo", "TRIÂNGULO", [
    "Tem lados retos.",
    "Tem três cantos.",
    "Tem três lados.",
  ]),
  forma("retangulo", "RETÂNGULO", [
    "Tem quatro lados.",
    "Lembra uma porta.",
    "Tem quatro cantos retos e dois lados mais compridos.",
  ]),
  forma(
    "pentagono",
    "PENTÁGONO",
    [
      "É um polígono de cinco lados.",
      "Tem cinco cantos.",
      "Conte seus cinco lados.",
    ],
    "dificil",
  ),
  forma(
    "hexagono",
    "HEXÁGONO",
    [
      "É um polígono de seis lados.",
      "Lembra um alvéolo de colmeia.",
      "Conte seus seis lados.",
    ],
    "dificil",
  ),
  forma(
    "octogono",
    "OCTÓGONO",
    [
      "É um polígono de oito lados.",
      "Tem oito cantos.",
      "Lembra o contorno da placa de pare.",
    ],
    "dificil",
  ),
  forma(
    "trapezio",
    "TRAPÉZIO",
    [
      "Tem quatro lados e apenas um par de lados paralelos.",
      "Suas bases têm tamanhos diferentes.",
      "Observe o lado de cima menor que o de baixo.",
    ],
    "dificil",
  ),
  forma(
    "losango",
    "LOSANGO",
    [
      "Tem quatro lados iguais, com cantos inclinados.",
      "Lembra uma pipa.",
      "Os lados opostos são paralelos.",
    ],
    "dificil",
  ),
];

export const NUMEROS = [
  "ZERO",
  "UM",
  "DOIS",
  "TRÊS",
  "QUATRO",
  "CINCO",
  "SEIS",
  "SETE",
  "OITO",
  "NOVE",
  "DEZ",
  "ONZE",
  "DOZE",
  "TREZE",
  "CATORZE",
  "QUINZE",
  "DEZESSEIS",
  "DEZESSETE",
  "DEZOITO",
  "DEZENOVE",
  "VINTE",
];

export const DEZENAS = {
  30: "TRINTA",
  40: "QUARENTA",
  50: "CINQUENTA",
  60: "SESSENTA",
  70: "SETENTA",
  80: "OITENTA",
  90: "NOVENTA",
  100: "CEM",
};
