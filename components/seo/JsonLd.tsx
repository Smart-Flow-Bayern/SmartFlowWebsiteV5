/** Ein Objekt mit @graph statt eines Arrays: Manche Leser (z. B. Browser-Erweiterungen) erwarten oben ein @context. */
export function JsonLd({ data }: { data: object[] }) {
  const graph = { '@context': 'https://schema.org', '@graph': data }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  )
}
