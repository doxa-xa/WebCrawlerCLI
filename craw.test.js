const {normalizeUrl, getURLsFromHTML} = require('./craw.js')
const {test, expect} = require('@jest/globals')

test('normalizeUrl strip protocol',()=>{
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)
})
test('normalizeUrl strip trailing slash',()=>{
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)
})
test('normalizeUrl capitals',()=>{
    const input = 'https://BLOG.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)
})
test('normalizeUrl strip http',()=>{
    const input = 'http://BLOG.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected ='blog.boot.dev/path'
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML absolute',()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/"> Boot.dev Blog</a>
        </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLbody,inputBaseURL)
    const expected =['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML relative',()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="/path/"> Boot.dev Blog</a>
        </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLbody,inputBaseURL)
    const expected =['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML both',()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path1/"> Boot.dev Blog Path 2</a>
            <a href="/path2/"> Boot.dev Blog Path 2</a>
        </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLbody,inputBaseURL)
    const expected =['https://blog.boot.dev/path1/','https://blog.boot.dev/path2/']
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML invalid URL',()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="invalid"> Invalid URL</a>
        </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLbody,inputBaseURL)
    const expected =[]
    expect(actual).toEqual(expected)
})