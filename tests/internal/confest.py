import pytest
from faker import Faker

fake = Faker()

@pytest.fixture
def random_url():
    base = fake.url()
    param_key = fake.word()
    param_val = fake.word()
    return f"{base}?{param_key}={param_val}&id={fake.random_int()}"