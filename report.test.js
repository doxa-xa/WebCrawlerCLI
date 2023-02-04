const {sortPages} = require('./report.js')
const {test, expect} = require('@jest/globals')

test('sortPages',()=>{
    const input = {
        'https://wagslene.dev/path':1,
        'https://wagslene.dev':3
    }
    const actual = sortPages(input)
    const expected =[
        ['https://wagslene.dev',3],
        ['https://wagslene.dev/path',1]
    ]
    expect(actual).toEqual(expected)
})
test('sortPages 5 pages',()=>{
    const input = {
        'https://wagslene.dev/path':1,
        'https://wagslene.dev':3,
        'https://wagslene.dev/path1':5,
        'https://wagslene.dev/path2':2,
        'https://wagslene.dev/path3':9
    }
    const actual = sortPages(input)
    const expected =[
        ['https://wagslene.dev/path3',9],
        ['https://wagslene.dev/path1',5],
        ['https://wagslene.dev',3],
        ['https://wagslene.dev/path2',2],
        ['https://wagslene.dev/path',1]
    ]
    expect(actual).toEqual(expected)
})