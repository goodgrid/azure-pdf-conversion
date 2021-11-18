import axios from 'axios'
import fs from 'fs'
import path from 'path'
import Config from './config.js'

class Graph {
    constructor() {}

    getToken() {
        const params = new URLSearchParams()
        params.append('grant_type', Config["graph:GrantType"])
        params.append('client_id', Config["graph:ClientId"])
        params.append('client_secret', Config["graph:ClientSecret"])
        params.append('scope', Config["graph:Scope"])
        params.append('resource', Config["graph:Resource"])
        
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }        

        return axios.post(`${Config.authBaseurl}/${Config["graph:TenantId"]}/oauth2/token`,params, config)
        .then(response => {
            //console.log("Setting token to", response.data.access_token)
            this.token = response.data.access_token
            
        })
        .catch(error => {
            console.log("Error getting token", error.response.status)
            throw new Error(error)
        })
    }

    async uploadFile(filePath) {

        return fs.promises.readFile(filePath)
        .then(buffer => {
            const fileName = path.basename(filePath)
            const urlPath = `${Config.graphBaseUrl}sites/${Config["spSiteId"]}/drive/items/root:/${fileName}:/content`
            console.log(urlPath)
            const config = {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
            return axios.put(urlPath,buffer,config)
        })
        .then(response => {
            console.log(response.data.id)
            return response.data.id
        })
        .catch(error => {
            console.log("Error uploading file", error.response.status)
            throw new Error(error)
        })

    }

    async convertFile(fileId) {
        const p = `${Config.graphBaseUrl}sites/${Config["spSiteId"]}/drive/items/${fileId}/content?format=pdf`
        console.log(p)
        const config = {
            responseType: 'arraybuffer',
            headers: {
                Authorization: `Bearer ${this.token}`,
            }
        }
        return axios.get(p,config)
        .then(response => {
            
            return Buffer.from(response.data)
        })
        .catch(error => {
            console.log("Error getting converted file", error.response?error.response.status:error)
            throw new Error(error)
        })
    }
}
export default Graph