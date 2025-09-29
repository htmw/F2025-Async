from dataclass import dataclass

@dataclass(frozen=True)
class MusicQuery:
    genre: str
    country: str
    city: str