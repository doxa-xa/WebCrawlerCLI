const { url } = require('inspector')
const {JSDOM} = require('jsdom')



function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for(const linkElement of linkElements){
        if(linkElement.href.slice(0,1)==='/'){
            //relative
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`) 
                urls.push(urlObj.href)
            }catch(err){
                console.log(`error with relative url: ${err.message}`)
            }

        }else{
            //absolute
            try{
                const urlObj = new URL(linkElement.href) 
                urls.push(urlObj.href)
            }catch(err){
                console.log(`error with abolute url: ${err.message}`)
            } 
        }
        
    }
    return urls
}

function normalizeUrl(urlString){
    const urlObj = new URL(urlString)
    const hostpath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostpath.length>0 && hostpath.slice(-1)==='/'){
        return hostpath.slice(0,-1)
    }else{
        return hostpath
    }

}

module.exports = {
    normalizeUrl,
    getURLsFromHTML
}