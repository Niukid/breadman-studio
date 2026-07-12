import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Bio corta",
      type: "string",
      initialValue: "Breadman — estudio de diseño. Valle del Aconcagua, Chile.",
    }),
    defineField({
      name: "footerNote",
      title: "Nota de footer",
      type: "string",
      initialValue: "Hecho con método y tiempo. Valle del Aconcagua.",
    }),
    defineField({
      name: "email",
      title: "Correo de contacto",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Redes sociales",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Nombre", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    }),
  ],
});
