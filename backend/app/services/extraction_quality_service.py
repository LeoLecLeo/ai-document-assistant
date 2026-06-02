from dataclasses import dataclass


@dataclass
class ExtractionQualityReport:
    total_pages: int
    total_characters: int
    average_characters_per_page: float
    empty_pages: list[int]
    weak_pages: list[int]
    empty_pages_ratio: float
    should_use_vision: bool
    pages_to_analyze: list[int]


def normalize_extracted_text(text: str) -> str:
    return " ".join(text.split())


def evaluate_extraction_quality(
    pages_text: list[str],
    empty_page_character_threshold: int,
    weak_page_character_threshold: int,
    min_average_characters_per_page: int,
    max_empty_pages_ratio: float,
    max_pages_to_analyze: int,
) -> ExtractionQualityReport:
    total_pages = len(pages_text)

    if total_pages == 0:
        return ExtractionQualityReport(
            total_pages=0,
            total_characters=0,
            average_characters_per_page=0,
            empty_pages=[],
            weak_pages=[],
            empty_pages_ratio=1,
            should_use_vision=True,
            pages_to_analyze=[],
        )

    normalized_pages = [normalize_extracted_text(text) for text in pages_text]
    character_counts = [len(text) for text in normalized_pages]

    total_characters = sum(character_counts)
    average_characters_per_page = total_characters / total_pages

    empty_pages = [
        page_number
        for page_number, character_count in enumerate(character_counts, start=1)
        if character_count < empty_page_character_threshold
    ]

    weak_pages = [
        page_number
        for page_number, character_count in enumerate(character_counts, start=1)
        if character_count < weak_page_character_threshold
    ]

    empty_pages_ratio = len(empty_pages) / total_pages

    should_use_vision = (
        average_characters_per_page < min_average_characters_per_page
        or empty_pages_ratio > max_empty_pages_ratio
    )

    pages_sorted_by_lowest_text = [
        page_number
        for page_number, _character_count in sorted(
            enumerate(character_counts, start=1),
            key=lambda item: item[1],
        )
    ]

    pages_to_analyze = []

    if should_use_vision:
        pages_to_analyze = [
            page_number
            for page_number in pages_sorted_by_lowest_text
            if character_counts[page_number - 1] < min_average_characters_per_page
        ][:max_pages_to_analyze]

    return ExtractionQualityReport(
        total_pages=total_pages,
        total_characters=total_characters,
        average_characters_per_page=average_characters_per_page,
        empty_pages=empty_pages,
        weak_pages=weak_pages,
        empty_pages_ratio=empty_pages_ratio,
        should_use_vision=should_use_vision,
        pages_to_analyze=pages_to_analyze,
    )