export default function RequestPromise (url, type){
    return new Promise(function(resolve, reject){
      let request = new XMLHttpRequest()

      request.open('GET', url, true)
      request.responseType = type ? type : ''


      request.onload = function() {
        resolve(request.response)
      }
      
      request.onerror = err => reject(err)

      request.send()
    })
}