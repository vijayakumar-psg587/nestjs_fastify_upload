#Base64.js

A simple Base64 encode & decode

##Install

`npm install base64js`

##API

###**decode**( base64String, fileName, next )

* `base64String`: the string you want to decode
* `filename`: the filename you want to save
* `next`: the callback when decoding is finished, The callback will be given one argument ( `err` )

You can alse use `decodeSync` for synchronization usage.

###**encode**( filename, next )

`filename`: the name of the file you want to encode
`next`: the callback when encoding is finished. The callback will be given two arguments ( `err`, `base64String` ), where `base64String` is the encoded string.

You can alse use `encodeSync` for synchronization usage.

##License
(The MIT License)

Copyright (c) 2012 Neekey <ni184775761@gmail.com>;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.