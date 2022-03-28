import {httpRequest, httpResponse} from '../protocols/http'

export interface Controller {
  handle(httpRequest: httpRequest): Promise<httpResponse> 

}