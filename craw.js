const { url } = require('inspector')
const {JSDOM} = require('jsdom')

async function crawlPage(baseURL,currentURL,pages){
    console.log(`actively crawling: ${currentURL}`)
    
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    // checks if we are crawling outside the host
    if(baseURLObj.hostname!==currentURLObj.hostname){
        return pages
    }

    const normalizaedCurrentURL = normalizeUrl(currentURL)
    //checks how many times the page has been crawled and incremets counter
    if(pages[normalizaedCurrentURL]>0){
        pages[normalizaedCurrentURL]++
        return pages
    }
    
    pages[normalizaedCurrentURL] = 1
    console.log(`crawling ${currentURL}`)
    let htmlBody =''

    try{
        const res = await fetch(currentURL)
        //check for error responses
        if(res.status>399){
            console.log(`error in fetch with status code: ${res.status} on page: ${currentURL}`)
            return pages
        }

        const contentType = res.headers.get('content-type')
        // check if the content type is HTML
        if(!contentType.includes('text/html')){
            console.log(`non html response, content type: ${contentType}, on page ${currentURL}`)
            return pages
        }

        htmlBody = await res.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for(const nextURL of nextURLs){
            pages = await crawlPage(baseURL,nextURL, pages)
        }

    }catch(err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    return pages
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