import { Injectable }            from '@angular/core';
import { Http, Response }        from '@angular/http';
import { Observable }            from 'rxjs/Observable';
import 'rxjs/add/operator/do'  // for debugging

@Injectable()
export class NewsService {

  /**
   * Creates a new News Service with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(): Observable<string[]> {
    return this.http.get('assets/data.json')
                    .map((res: Response) => res.json())
                    .do(data => console.log('server data:', data))  // debug
                    .catch(this.handleError)
  }

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg)
  }
}
