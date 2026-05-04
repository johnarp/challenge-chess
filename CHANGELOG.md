# Changelog

[unreleased]: https://github.com/johnarp/challenge-chess/releases/tag/HEAD
[0.1.1]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.1
[0.1.0]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.0

## [Unreleased]

### Added

- Judge console error checking

### Changed

- Increased max tokens
- Prompt is more strict about length
- Separate system message, prompt and temperature changes to force a verdict

## [0.1.1] - 2026-05-04

### Added

- Fallback for when AI fails
- Groq API option

### Changed

- AI API is now server-side

### Fixed

- Defender not getting free move when challenge fails

## [0.1.0] - 2026-05-03

### Added

- Creating and joining games via a sharable 6-character code
- Real-time multiplayer chess synced through Firebase Firestore
- Turn enforcement
- Capture detection with a challenge button
- Challenge system where both players submit arguments
- AI judge powered by Gemini
- Move undo when the challenger wins
- 3 challenges per player, per game