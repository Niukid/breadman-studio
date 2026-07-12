import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactSubmission",
  title: "Mensaje de contacto",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectType",
      title: "Tipo de proyecto",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Mensaje",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Recibido",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
});
