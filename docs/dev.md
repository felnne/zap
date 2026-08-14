# Zap - Development

## Local development environment

Requirements:

- [Git](https://git-scm.com)
- [UV](https://docs.astral.sh/uv/)
- [Pre-commit](https://pre-commit.com)
- [1Password CLI](https://developer.1password.com/docs/cli/get-started/)
  - with access to the *Shared* and *Infrastructure* vaults in the MAGIC team account

Setup:

1. install tools (`brew install git uv pre-commit 1password-cli`)
1. clone and setup project [1]
1. [Generate](/docs/config.md#generate-an-environment-config-file) an `.env` file
1. initialise pre-commit hook (`pre-commit install`)

[1]

```shell
% git clone https://gitlab.data.bas.ac.uk/felnne/zap.git
% cd zap/
% uv sync --all-groups
% uv run playwright install
```

### Development server

The `run` [Development Task](#development-tasks) runs the Streamlit [App](/docs/architecture.md#app) as a Starlette
ASGI application using [Uvicorn](https://www.uvicorn.org/).

This task includes loading secrets to set [Config Options](/docs/config.md#config-options).

### PyCharm configurations

For [Tests](#pytest):

- type: *pytest*
- run type: *script*
- run target: *./tests*
- working directory: *./*

For [Development Server](#development-server):

- type: *python*
- run type: *script*
- run target: *./tasks/run.py*
- working directory: *./*

## Development tasks

[Taskipy](https://github.com/taskipy/taskipy?tab=readme-ov-file#general) is used to define development tasks, such as
running tests. These tasks are akin to NPM scripts or similar concepts.

Run `task --list` (or `uv run task --list`) for available commands.

Run `task [task]` (`uv run task [task]`) to run a specific task.

See [Adding development tasks](#adding-development-tasks) for how to add new tasks.

> [!TIP]
> If offline, use `uv run --offline task ...` to avoid lookup errors trying to the unconstrained build system
> requirements in `pyproject.toml`, which is a [Known Issue](https://github.com/astral-sh/uv/issues/5190) within UV.

## Contributing

All changes except minor tweaks (typos, comments, etc.) MUST:

- be included in the [Change Log](/CHANGELOG.md)

### Conventions

- all deployable code should be contained in the `zap` package

### Adding configuration options

> [!WARNING]
> This section is Work in Progress (WIP) and may not be complete/accurate.

In the [Configuration](/docs/config.md) documentation:

- add to the [Options Table](/docs/config.md#config-options) (in alphabetical order)
- if needed, add a subsection to explain the option in more detail
- update the `.env.tpl` template and any existing `.env` files
- update the `[tool.pytest_env]` section in `pyproject.toml`
- update or create any tests as needed

### Adding development tasks

See the [Taskipy](https://github.com/taskipy/taskipy?tab=readme-ov-file#adding-tasks) documentation.

## Python version

The minimum Python version is 3.14 for consistency with related projects.

## Dependencies

### Vulnerability scanning

The [`uv audit`](https://docs.astral.sh/uv/reference/cli/#uv-audit) command checks for known vulnerabilities in
packages using a range of sources, including GitHub and the
[Python Packaging Advisory Database](https://github.com/pypa/advisory-database.

> [!WARNING]
> As with all security tools, `uv audit` is a tool for detecting well-known vulnerabilities, not a guarantee of
> secure dependencies. While `uv audit` is experimental, it's data source is not.

Checks are run automatically in [Continuous Integration](#continuous-integration) when code changes via a commit and
periodically via a scheduled pipeline. Failed checks raise a warning (rather than error) if vulnerabilities are found
to allow fixing in a standalone MR.

> [!TIP]
> To check locally run the `audit` [Development Task](#development-tasks).

To upgrade a specific (in)direct dependency to address a vulnerability (typically via a patch release):

- create an issue and switch to branch
- run `uv lock --upgrade-package $PKG==$FIX_VERSION` (e.g. `uv lock --upgrade-package foo==1.2.3`)
- run `uv sync --all-groups` to apply upgrades
- commit changes

> [!TIP]
> If the fix version has been released within a cool off period, verify the release is safe and add an override under
> `tool.uv.audit` in `pyproject.toml`.

If a vulnerability cannot feasibly/reasonabily be resolved, exceptions CAN be added in `pyproject.toml`:

```toml
[tool.uv.audit]
ignore = [
    # $PKG < x.xx (reason)
    "XXX"
]
```

> [!NOTE]
> A task to revisit any exceptions within a reasonable timeframe MUST be recorded and carried out, repeatedly if needed.

### Updating dependencies

To upgrade direct dependencies (including major and minor versions changing functionality):

- create an issue and switch to branch
- run the `outdated` [Development Task](#development-tasks) to list outdated direct packages
- follow https://docs.astral.sh/uv/concepts/projects/sync/#upgrading-locked-package-versions
- note upgrades in the issue
- review any major/breaking upgrades
- run `uv sync --all-groups` to apply upgrades
- run [Tests](#testing) manually
- commit changes

> [!TIP]
> If playwright is upgraded, run `uv playwright install` locally and update CI image to match new version.
>
> To list all (direct and indirect) outdated dependencies, run `uv tree --outdated`.

## Linting

### Ruff

[Ruff](https://docs.astral.sh/ruff/) is used to lint and format Python files. Specific checks and config options are
set in [`pyproject.toml`](/pyproject.toml). Linting checks are run automatically in
[Continuous Integration](#continuous-integration) and the [Pre-Commit Hook](#pre-commit-hook).

> [!TIP]
> To check linting manually run the `lint` [Development Task](#development-tasks), for formatting run the `format` task.

### Static security analysis

[Ruff](#ruff) is configured to run [Bandit](https://github.com/PyCQA/bandit), a static analysis tool for Python.

> [!WARNING]
> As with all security tools, Bandit is an aid for spotting common mistakes, not a guarantee of secure code.
> In particular this tool can't check for issues that are only detectable when running code.

### Markdown

[PyMarkdown](https://pymarkdown.readthedocs.io/en/latest/) is used to lint Markdown files. Specific checks and config
options are set in [`pyproject.toml`](/pyproject.toml). Linting checks are run automatically in
[Continuous Integration](#continuous-integration) and the [Pre-Commit Hook](#pre-commit-hook).

> [!TIP]
> To check linting manually run the `markdown` [Development Task](#development-tasks).

Wide tables will fail rule `MD013` (max line length). Wrap such tables with pragma disable/enable exceptions:

```markdown
<!-- pyml disable md013 -->
| Header | Header |
|--------|--------|
| Value  | Value  |
<!-- pyml enable md013 -->
```

Stacked admonitions will fail rule `MD028` (blank lines in blockquote) as it's ambiguous whether a new blockquote has
started where another element isn't in between. Wrap such instances with pragma disable/enable exceptions:

```markdown
<!-- pyml disable md028 -->
> [!NOTE]
> ...

> [!NOTE]
> ...
<!-- pyml enable md028 -->
```

### Editorconfig

For consistency, it's strongly recommended to configure your IDE or other editor to use the
[EditorConfig](https://editorconfig.org/) settings defined in `.editorconfig`.

### Pre-commit hook

A [Pre-Commit](https://pre-commit.com) hook is configured in `.pre-commit-config.yaml`.

To update Pre-Commit and configured hooks:

```shell
% pre-commit autoupdate
```

> [!TIP]
> To run pre-commit checks against all files manually run the `pre-commit` [Development Task](#development-tasks).

## Testing

### Pytest

[pytest](https://docs.pytest.org) with a number of plugins is used for testing the application. Config options are set
in `pyproject.toml`. Tests are defined in the `tests` package.

Tests are run automatically in [Continuous Integration](#continuous-integration).

<!-- pyml disable md028 -->
> [!TIP]
> To run tests manually, run the `test` [Development Task](#development-tasks).

> [!TIP]
> To run a specific test:
>
> ```shell
> % uv run pytest tests/path/to/test_module.py::<class>.<method>
> ```
<!-- pyml enable md028 -->

### Pytest fast fail

> [!TIP]
> If a tests fail with a `NotImplementedError` exception run the `test-reset` [Development Task](#development-tasks).

This occurs where:

- a test fails and the failed test is then renamed or parameterised options changed
- the reference to the previously failed test has been cached to enable the `--failed-first` runtime option
- the cached reference no longer exists triggering an error which isn't handled by the `pytest-random-order` plugin

Running this task clears Pytest's cache and re-runs all tests, skipping the `--failed-first` option.

### Pytest fixtures

Fixtures SHOULD be defined in `tests.conftest` prefixed with `fx_` to indicate they are a fixture when used in tests.

> [!NOTE]
> This applies to fixtures used or needed for slow tests, which imports all fixtures from the main suite automatically.

### Pytest-env

[pytest-env](https://pypi.org/project/pytest-env/) sets environment variables for
[Config Options](/docs/config.md#config-options) to fake values when testing. Values are configured in the
`[tool.pytest_env]` section of `pyproject.toml`.

### Streamlit tests

The Streamlit [App Testing](https://docs.streamlit.io/develop/api-reference/app-testing) framework is used to check
the Streamlit app behaves as expected in a synthetic environment.

The app testing framework provides methods to modify session state and programmatically run the app to ensure elements
refact as expected. It has some limitations in the elements that can be inspected.

### Playwright tests

[Playwright](https://playwright.dev/) is used to verify the behaviour of the Streamlit app overall within a browser.

To run a specific test file with visible output:

```shell
% uv run pytest --headed tests/browser/test_item.py
```

Playwright requires a real website to test against, which is provided by the `fx_app` fixture. This runs a real
Streamlit instance as a ASGI application but on a non-standard port to avoid clashing with a local development instance.

### Continuous Integration

All commits will trigger Continuous Integration using GitLab's CI/CD platform, configured in `.gitlab-ci.yml`.
