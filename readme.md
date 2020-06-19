# novem · [![npm version][npm badge]][npm url]

| **solution type**    | **examples**                |
|----------------------|-----------------------------|
| undefined            | `[][[]]`                    |
| numeric              | `![]`, `!![]`               |
| weak numeric         | `+[]`, `+!![]`, `!![]+!![]` |
| object               | `[]`                        |
| string               | `[]+[]`, `([]+![])[+[]]`    |
| prefixed string      | `![]+([]+![])[+[]]`         |
| weak prefixed string | `+[]+([]+![])[+[]]`         |

[npm badge]: https://badge.fury.io/js/novem.svg
[npm url]: https://www.npmjs.com/package/novem
