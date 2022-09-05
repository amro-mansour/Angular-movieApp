import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { EditProfileComponent } from '../edit-profile/edit-profile.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Returns information about a single user with an api call 
   * @function getUser
   * @returns user obeject holding personal information
   */
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      return this.user;
    });
  }

  /**
   * Opens the edit profile dialog from EditProfileComponent to allow user to edit their personal information 
   */
  openEditProfileDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '300px',
    });
  }

  /**
   * Deletes the user profile, then redirects to the welcome screen
   * @function deleteUser
   */
  deleteProfile(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This cannnot be undone.'
      )
    ) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account!',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}