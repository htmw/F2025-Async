import csv
import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from services.process_music_data import process_music_data


class TestProcessMusicData(unittest.TestCase):
    def setUp(self):
        """Set up a dummy CSV file for testing."""
        self.test_filename = "test_music_data.csv"
        self.test_data = [
            {
                "name": "Artist A",
                "area_name": "Tenenesse",
                "begin_area_name": "Memphis",
                "tag": "rock",
            },
            {
                "name": "Artist B",
                "area_name": "Florida",
                "begin_area_name": "Miami",
                "tag": "pop",
            },
            {
                "name": "Artist A",
                "area_name": "Area 3",
                "begin_area_name": "New York City",
                "tag": "jazz",
            },  # Duplicate name
            {
                "name": "Artist C",
                "area_name": "Area 4",
                "begin_area_name": "Los Angeles",
                "tag": "",
            },
            {
                "name": "Artist D",
                "area_name": "Area 5",
                "begin_area_name": "Begin Area 5",
                "tag": "hip hop",
            },
            {
                "name": "",
                "area_name": "Area 6",
                "begin_area_name": "Begin Area 6",
                "tag": "techno",
            },  # Missing name
            {
                "name": "Artist E",
                "area_name": "Area 7",
                "begin_area_name": "Begin Area 7",
                "tag": "",
            },  # Missing tag
            {
                "name": "Artist G",
                "area_name": "Area 4",
                "begin_area_name": "Los Angeles",
                "tag": "classical",
            },
            {
                "name": "Artist R&B",
                "area_name": "Area 8",
                "begin_area_name": "Begin Area 8",
                "tag": "r&b",
            },  # Unallowed tag
        ]
        with open(self.test_filename, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["name", "area_name", "begin_area_name", "tag"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(self.test_data)

    def tearDown(self):
        """Remove the dummy CSV file after tests."""
        if os.path.exists(self.test_filename):
            os.remove(self.test_filename)

    def test_processing(self):
        """Test the main functionality of the process_music_data function."""
        result = process_music_data(self.test_filename)

        self.assertIsInstance(result, dict)
        self.assertTrue(result)
        self.assertIn("rock", result)
        self.assertNotIn("Banana", result)
        self.assertEqual(
            result["rock"],
            [{"name": "Artist A", "country": "Tenenesse", "city": "Memphis"}],
        )

        # Check that duplicate artist name 'Artist A' with 'jazz' tag did not overwrite the first one.
        self.assertNotEqual(
            result["jazz"][0],
            [{"name": "Artist A", "country": "Tenenesse", "city": "Memphis"}],
        )

        # Check that artists with empty name, empty tag, or unallowed tags are ignored.
        self.assertNotIn("Artist C", result)  # Empty tag
        self.assertNotIn("", result)  # Empty name
        self.assertNotIn("r&b", result)  # Unallowed tag 'r&b'

    def test_file_not_found(self):
        """Test the case where the file does not exist."""
        result = process_music_data("non_existent_file.csv")
        self.assertEqual(result, {})


if __name__ == "__main__":
    unittest.main()
