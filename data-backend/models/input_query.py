from dataclasses import dataclass

@dataclass(frozen=True)
class InputQuery:
    genre: str
    country: str
    city: str