import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Contenido")
    .items([
      orderableDocumentListDeskItem({
        type: "caseStudy",
        title: "Casos de portafolio",
        S,
        context,
      }),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "caseStudy"
      ),
    ]);
