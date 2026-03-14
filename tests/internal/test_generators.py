import string
import pytest
from app.utils.generators import get_random_url_string

def test_default_length():
    assert len(get_random_url_string()) == 8

def test_custom_length():
    assert len(get_random_url_string(length=10)) == 10

def test_minimum_length_enforced():
    assert len(get_random_url_string(length=2)) == 8

def test_invalid_length_type():
    assert len(get_random_url_string(length="abc")) == 8

def test_prefix():
    result = get_random_url_string(length=6, prefix="go-")
    assert result.startswith("go-")

def test_suffix():
    result = get_random_url_string(length=6, suffix="-url")
    assert result.endswith("-url")

def test_uniqueness():
    results = {get_random_url_string() for _ in range(100)}
    assert len(results) == 100

def test_allowed_characters():
    allowed = set(string.ascii_letters + string.digits)
    result = get_random_url_string(length=20)
    assert all(c in allowed for c in result)