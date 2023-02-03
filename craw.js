const { url } = require('inspector')
const {JSDOM} = require('jsdom')

async function crawlPage(currentURL){
    console.log(`actively crawling: ${currentURL}`)
    
    try{
        const res = await fetch(currentURL)

        if(res.status>399){
            console.log(`error in fetch with status code: ${res.status} on page: ${currentURL}`)
            return
        }
        
        const contentType = res.headers.get('content-type')
        if(!contentType.includes('text/html')){
            console.log(`non html response, content type: ${contentType}, on page ${currentURL}`)
            return
        }

        console.log(await res.text())
    }catch(err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    
}

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
    getURLsFromHTML,
    crawlPage
}