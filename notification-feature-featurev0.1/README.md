# STEPS TO RUN NOTIFICATION SERVICE UNIT TESTING
---

To ensure the code is working as expected, we have tests set up using pytest. We also use coverage to understand how much of our codebase is covered by these tests.

This README will guide you through setting up your environment locally and running the tests.

## Prerequisites
You'll need the following tools:

- Python
- pip
- virtualenv

## Setting Up Your Environment

1. Clone the repository:
```bash
git clone https://github.com/ikarus-nest/notification.git
```

2. Change directory into the project folder:
```bash
cd notification
```

3. Change branch into the tests folder:
```bash
git checkout feature/tests
```

4. Set up a Python virtual environment:
```bash
pip install virtualenv
python -m venv .\venv
.\venv\Scripts\activate
```

5. Install the project's dependencies:
```bash
pip install -r requirements.txt
```

6. Add `secrets.yaml` file to config folder
   
7. Add `__init__.py` file to all required folders if not already present

## Running Tests

We use pytest as our test runner. To run the tests, use the following command:
```bash
pytest
```
To get more information about errors increase the verbosity level
```bash
pytest -vv
```

## Coverage Reports
To see how much of the codebase is covered by tests, we use the coverage tool. To generate a coverage report, run the following command:

```bash
coverage run -m pytest
coverage report
```

To generate an HTML report, you can use:
```bash
coverage html
```
By default, coverage report files are stored in the `htmlcov/index.html` directory. However, for this project, these files are located in the `coverage_html_report/index.html` directory. Learn more about coverage configurations and reporting in the [coverage documentation](https://coverage.readthedocs.io/en/latest/index.html).

## Run notification service
`[Optional]` To run the notification service, use the following command:
```bash
python .\run.py
```
However, the execution of tests for the `notification` service, conducted using `pytest` and `coverage`, is independent of whether the service is currently running or not.
