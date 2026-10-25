import Button from "@mui/material/Button";
import Icone from "../Icone/index.jsx";

export default function BotaoReiniciar({
  onClick,
  children,
  variant = "outlined",
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      startIcon={<Icone nome="reiniciar" tamanho={18} />}
    >
      {children}
    </Button>
  );
}
