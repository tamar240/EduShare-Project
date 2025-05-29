// import { Component } from '@angular/core';
// import { UsersService } from '../../services/users.service';
// import { MatTableModule } from '@angular/material/table';
// import { MatCardModule } from '@angular/material/card';
// import { MatDividerModule } from '@angular/material/divider';
// import { CommonModule } from '@angular/common';
// import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

// @Component({
//   selector: 'app-users-page',
//   standalone: true,
//   imports: [  MatTableModule,
//     MatCardModule,
//     MatDividerModule,
//     CommonModule,
//   MatIconModule],
//   templateUrl: './users-page.component.html',
//   styleUrl: './users-page.component.css'
// })


// export class UsersPageComponent {

//   constructor(private usersService: UsersService,
//   ) {}

//   displayedColumns: string[] = ['id', 'name', 'email', 'createdAt', 'isDeleted', 'actions'];
//   users: User[] = [];

//    ngOnInit(): void {
//     this.usersService.getAllUsers().subscribe((response: { users: User[] }) => {
//       this.users = response as unknown as User[];
     
//     });
//    }
//    deleteUser(userId: number): void {
//     this.usersService.deleteUser(userId).subscribe(() => {
//       this.users = this.users.map(user =>
//         user.id === userId ? { ...user, isDeleted: true } : user
//       );
//     });
//   }

//   restoreUser(userId: number): void {
//    console.log("kk");
   
//   }
//   hardDeleteUser(userId: number): void {
//     if (confirm("האם אתה בטוח שברצונך למחוק סופית את המשתמש?")) {
//       this.usersService.hardDeleteUser(userId).subscribe(() => {
//         this.users = this.users.filter(user => user.id !== userId);
//       });
//     }
//   }
  
// }

// export type User = {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   createdAt : Date;
//   updatedAt : Date;
//   isDeleted: boolean;
// };
import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {

  displayedColumns: string[] = ['id', 'name', 'email', 'createdAt', 'actions'];
  users: User[] = [];
  showDeleted: boolean = false;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe((response: { users: User[] }) => {
      this.users = response as unknown as User[];
    });
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => user.isDeleted === this.showDeleted);
  }

  deleteUser(userId: number): void {
    this.usersService.deleteUser(userId).subscribe(() => {
      this.users = this.users.map(user =>
        user.id === userId ? { ...user, isDeleted: true } : user
      );
    });
  }

  hardDeleteUser(userId: number): void {
    if (confirm("האם אתה בטוח שברצונך למחוק סופית את המשתמש?")) {
      this.usersService.hardDeleteUser(userId).subscribe(() => {
        this.users = this.users.filter(user => user.id !== userId);
      });
    }
  }
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};
