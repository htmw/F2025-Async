from whoosh.qparser import MultifieldParser, OrGroup
from whoosh.index import open_dir

def search_artists(query_string):
    ix = open_dir("indexdir")

    parser = MultifieldParser(
        ["name", "genre", "location", "summary"],
        schema=ix.schema,
        group=OrGroup.factory(0.9)
    )

    query = parser.parse(query_string)

    with ix.searcher() as searcher:
        results = searcher.search(query, limit=50)
        return [dict(r) for r in results]
