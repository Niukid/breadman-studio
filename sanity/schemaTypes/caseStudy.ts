import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: "caseStudy",
  title: "Caso de portafolio",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "caseStudy" }),
    defineField({
      name: "title",
      title: "Nombre del proyecto",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Disciplinas",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Branding", value: "branding" },
          { title: "Web", value: "web" },
          { title: "Audio", value: "audio" },
          { title: "Motion", value: "motion" },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "summary",
      title: "Texto corto (tarjeta de portafolio)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: "body",
      title: "Texto largo (página de detalle)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "coverImage",
      title: "Foto de la caja (tarjeta de portafolio)",
      description: "La imagen que se ve en la tarjeta escalonada del listado de portafolio",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description: "Describe la imagen para SEO y accesibilidad",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "backgroundDesktop",
      title: "Foto de fondo — Desktop",
      description: "Imagen de fondo de la página de detalle del caso, versión escritorio",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description: "Describe la imagen para SEO y accesibilidad",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "backgroundMobile",
      title: "Foto de fondo — Mobile",
      description: "Imagen de fondo de la página de detalle del caso, versión mobile (puede ser un recorte distinto al de desktop)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description: "Describe la imagen para SEO y accesibilidad",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "backgroundVideoDesktop",
      title: "Video de fondo — Desktop",
      description: "Opcional. Si lo cargas, reemplaza la foto de fondo de escritorio y se reproduce en loop, sin sonido.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "backgroundVideoMobile",
      title: "Video de fondo — Mobile",
      description: "Opcional. Si lo cargas, reemplaza la foto de fondo mobile y se reproduce en loop, sin sonido.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "gallery",
      title: "Galería de fotos (página de detalle)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              description: "Describe la imagen para SEO y accesibilidad",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "videoFile",
      title: "Video — archivo subido",
      description: "Úsalo para clips cortos. Para videos pesados, mejor usa el link externo de abajo.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "videoUrl",
      title: "Video — link externo (YouTube / Vimeo)",
      type: "url",
    }),
    defineField({
      name: "audioFile",
      title: "Audio — archivo subido (mp3)",
      type: "file",
      options: { accept: "audio/*" },
    }),
    defineField({
      name: "audioEmbedUrl",
      title: "Audio — link externo (Spotify / SoundCloud)",
      type: "url",
    }),
    defineField({
      name: "externalUrl",
      title: "Link externo (ej. NIUKID, Claroscuro Records)",
      description: "Déjalo vacío si el caso no lleva a un sitio propio",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Destacar en Home",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      tags: "tags",
    },
    prepare({ title, media, tags }) {
      return {
        title,
        subtitle: (tags || []).join(" · "),
        media,
      };
    },
  },
});
