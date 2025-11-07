# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-11-07

### Fixed
- **TypeScript type definitions not found**: Restructured build output so type definitions are correctly located at `dist/index.d.ts` instead of `dist/src/index.d.ts`
- Moved CLI from `bin/kevinify.ts` to `src/cli.ts` for cleaner build structure
- Updated all example files to use new import paths

### Changed
- Build output now places files directly in `dist/` instead of `dist/src/`
- Updated `tsconfig.json` to set `rootDir: "src"` for proper output structure

## [0.1.0] - 2025-11-07

### Added
- Initial release of kevinify
- Token reduction for LLM prompts
- Abbreviations for common words (please → pls, thanks → thx, etc.)
- Stopword removal (a, an, the, just, really, etc.)
- Vowel compression for long words (information → informatn)
- Smart preservation of URLs, emails, @mentions, #hashtags, and numbers
- CLI tool with flags: `--keep-stopwords`, `--no-preserve`, `--keep-case`, `--no-shorten`
- TypeScript support with full type definitions
- Zero dependencies

