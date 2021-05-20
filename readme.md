# nodejs ffmpeg cut-merge

simple app to cut multimedia file into pieces and merge them

## Requirements

- nodejs >= 8
- ffmpeg
- multimedia file: mp3, wav, mp4, vob, etc

## Usage

If you have a audio file called `/foo/bar/source.mp3` and you just need these intervals:

- from 00:20 to 00:25
- from 00:25 to 00:30
- from 00:30 to 00:35

And the output file should be: `/foo/baz/output.mp3`, execute the following command

```
node app.js "00:20->00:25 00:25->00:30 00:30->00:35" "/foo/bar/source.mp3" "/foo/baz/output.mp3"
```

After that you will have a new file `/foo/baz/output.mp3` which is the union of all intervals.

## Todo

- Buffer to string
- Use arguments parser
