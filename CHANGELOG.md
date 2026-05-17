# Changelog

[0.1.6]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.6
[0.1.5]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.5
[0.1.4]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.4
[0.1.3]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.3
[0.1.2]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.2
[0.1.1]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.1
[0.1.0]: https://github.com/johnarp/challenge-chess/releases/tag/v0.1.0

## [0.1.6] - 2026-05-17

### Added

- Click to move
- Website icon

### Changed

- AI's final sentence is now a statement, not a question

### Fixed

- Font now successfully loads

## [0.1.5] - 2026-05-14

### Changed

- Fonts
- GitHub link to an icon
- Small UI improvements
- README running locally note

## [0.1.4] - 2026-05-11

### Changed

- Player's role is highlighted in the challenge popup
- Turn text and challenge button is hidden when the game is over

### Fixed

- Rare issue. When a piece that is attacking a king is captured, the move can be challenged. If the move is undone, the attacking piece can capture the king. This used to not end the game or allow players to move. Now, the game ends

## [0.1.3] - 2026-05-06

### Added

- Game code displayed in-game

### Changed

- Player IDs are now random UUIDs stored in localStorage instead of hardcoded strings, enabling game rejoining
- Chessboard tile colors

### Fixed

- Errors in README

## [0.1.2] - 2026-05-05

### Added

- Judge console error checking
- Meta tags

### Changed

- Mobile UI improvements
- README overhaul
- AI message is no longer trimmed
- Increased max tokens
- Prompt is more strict about length
- Separate system message, prompt and temperature changes to force a verdict
- .env.example with Groq

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