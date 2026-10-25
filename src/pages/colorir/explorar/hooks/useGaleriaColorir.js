import { useEffect, useState } from "react";
import { useColorir } from "../../../../contexts/colorir/index.js";

export function useGaleriaColorir() {
  const { listar } = useColorir();
  const [pinturas, setPinturas] = useState({}),
    [aviso, setAviso] = useState("");

  useEffect(() => {
    let ativa = true;
    const urls = [];
    listar()
      .then((registros) => {
        if (!ativa) return;
        const entradas = registros
          .filter((r) => r.miniatura instanceof Blob)
          .map((r) => {
            const url = URL.createObjectURL(r.miniatura);
            urls.push(url);
            return [
              r.id,
              {
                url,
                titulo: r.titulo || "",
                iniciada: Boolean(r.acoes?.length),
              },
            ];
          });
        setPinturas(Object.fromEntries(entradas));
      })
      .catch(() => {
        if (ativa)
          setAviso(
            "O progresso salvo está indisponível. Você ainda pode colorir e baixar sua pintura.",
          );
      });
    return () => {
      ativa = false;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [listar]);

  return { pinturas, aviso };
}
