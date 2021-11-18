import fs from 'fs'
import Graph from './graph.js'


const graph = new Graph()

graph.getToken()
.then(async () => {
    return graph.uploadFile("/Users/kbonnet/Downloads/MicrosoftTeams-image (4).png")
})
.then(async (fileId) => {
    
    return graph.convertFile(fileId)
})
.then(file => {
    fs.promises.writeFile("./converted.pdf",file)
})
.catch(error => {
    console.log(error)
})


