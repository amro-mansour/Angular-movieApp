import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://amro-mansour-movie-api.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  /**
   * Calls the API endpoint to register a user 
   * @param userDetails 
   * @returns a new user object in a JSON format 
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Calls the API endpoint to login a user 
   * @param userDetails 
   * @returns user object in a JSON format 
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handles errors
   * @param error 
   * @returns error message 
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.log('Some error occurred:', error.error.message);
    } else {
      console.log(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  /**
   * Calls API endpoint to get data about all movies in the datbase 
   * @returns Array of all movies in JSON format
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Calls API endpoint to get data about a single movie by its title 
   * @param title 
   * @returns movie object in a JSON format 
   */
  getMovie(title: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Calls API endpoint to get data about a specific director by his/ her name
   * @param name 
   * @returns director object in a JSON format
   */
  getDirector(name: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/directors/${name}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Calls API endpoint to get data about a specific genre by its name 
   * @param genre 
   * @returns genre object in a JSON format 
   */
  getGenre(genre: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/genres/${genre}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Calls API endpoint to get data about a single user 
   * @returns user object in a JSON format 
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .get(`${apiUrl}users/${user}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // User registration  
  // registerUser(): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.post(apiUrl + `/users`, {
  //     headers: new HttpHeaders(
  //       {
  //         Authorization: 'Bearer ' + token,
  //       })
  //   }).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }


  // User Login  
  // loginUser(): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http.post(apiUrl + `/login`, {
  //     headers: new HttpHeaders(
  //       {
  //         Authorization: 'Bearer ' + token,
  //       })
  //   }).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Calls API to get a user's list of favorite movies 
   * @returns array containing a user's list of favorite movies 
   */
  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    // Get Username stored in local storage
    const username = localStorage.getItem('user');
    return this.http.get(`${apiUrl}users/${username}/movies`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Calls API endpoint to add a movie to the user's list of favorite movies 
   * @param movieID 
   * @returns user object updated with the new movie added
   */
  addFavoriteMovie(movieID: any): Observable<any> {
    const token = localStorage.getItem('token');
    // Get Username stored in local storage
    const username = localStorage.getItem('user');
    return this.http
      .post(
        `${apiUrl}users/${username}/movies/${movieID}`,
        { FavouriteMovies: movieID },
        {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
        }
      )
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * Calls API endpoint to delete a movie from the user's list of favorite movies
   * @param movieID 
   * @returns user object updated without the movie deleted 
   */
  removeFavoriteMovie(movieID: any): Observable<any> {
    const token = localStorage.getItem('token');
    // Get Username stored in local storage
    const username = localStorage.getItem('user');
    return this.http
      .delete(`${apiUrl}users/${username}/movies/${movieID}`, {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * Calls API endpoint to allow users to update their personal information 
   * @param username 
   * @returns User object with the updated information 
   */
  editUser(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + `/users/${username}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Calls API endpoint to deregister a user 
   * @returns A success message indicating that the profile was successfully deleted
   */
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.delete(apiUrl + `/users/${user}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * extracts response data from HTTP response
   * @param res
   * @returns response body or empty object
   */
  private extractResponseData(res: Response | object): any {
    const body = res;
    return body || {};
  }
}