import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Returns the list of movies and sets the movies state to the JSON file returned 
   * @function getAllMovies
   * @returns an array holding all movies objects 
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Returns a dialog containing information about a director from the DirectorComponent 
   * @param name 
   * @param bio 
   * @param birthday 
   * @returns director object 
   */
  openDirectorDialog(name: string, bio: string, birthday: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birthday,
      },
      // Assign dialog width
      width: '500px',
    });
  }

  /**
   * Returns a dialog containing information about a genre from the GenreComponent 
   * @param name 
   * @param description 
   * @retutns genre object 
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      // Assign dialog width
      width: '500px',
    });
  }

  /**
   * Returns a dialog containing information about the synopsis of a movie from the synopsisComponent 
   * @param title 
   * @param description 
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
      // Assign dialog width
      width: '500px',
    });
  }

  /**
   * Returns a users list of favorite movies 
   * @function getFavoriteMovies
   * @returns array holding the ids of a user's favorite movies 
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp;
      console.log(this.favoriteMovies);
      return this.favoriteMovies;
    });
  }

  /**
   * Checks whether a movie is included in a user's list of favorite movies 
   * @param id 
   * @returns returns "true" or "false" depending on whether a movie is included in a user's list of favorits or not
   */
  isFav(id: string): boolean {
    return this.favoriteMovies.includes(id);
  }

  /**
   * Add a movie to a user's list of favorite movies 
   * @param id 
   * @function addToFavoriteMovies
   */
  addToFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }

  /**
   * Remove a movie from a user's list of favorite movies 
   * @param id 
   * @function removeFavoriteMovie
   */
  removeFromFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.removeFavoriteMovie(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }
}