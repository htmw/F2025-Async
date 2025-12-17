from whoosh.fields import Schema, TEXT, ID
from whoosh.index import create_in
from whoosh.analysis import StemmingAnalyzer
import os
import json

def build_index():
    schema = Schema(
        id=ID(stored=True, unique=True),
        name=TEXT(stored=True, analyzer=StemmingAnalyzer()),
        genre=TEXT(stored=True, analyzer=StemmingAnalyzer()),
        location=TEXT(stored=True, analyzer=StemmingAnalyzer()),
        summary=TEXT(stored=True, analyzer=StemmingAnalyzer())
    )

    if not os.path.exists("indexdir"):
        os.mkdir("indexdir")

    ix = create_in("indexdir", schema)
    writer = ix.writer()

    with open("resources/audioDB_200_in_order.json", "r") as f:
        data = json.load(f)

    for genre, artist_list in data.items():
        for artist in artist_list:
            writer.add_document(
                id=artist.get("name", ""),
                name=artist.get("name", ""),
                genre=genre,
                location=artist.get("location", ""),
                summary=artist.get("summary", "")
            )

    writer.commit()

if __name__ == "__main__":
    build_index()
