// import { Component, OnInit } from '@angular/core';
// import { Lesson } from '../../services/lessons.service';
// import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
// import { NgChartsModule } from 'ng2-charts';

// @Component({
//   selector: 'app-graphs-page',
//   standalone: true,
//   imports: [NgChartsModule],
//   templateUrl: './graphs-page.component.html',
//   styleUrl: './graphs-page.component.css'
// })
// export class GraphsPageComponent implements OnInit {
//   constructor(private lessonService: Lesson) {}

//   public pieChartType: ChartType = 'pie';

//   public pieChartData: ChartData<'pie', number[], string> = {
//     labels: [],
//     datasets: [
//       {
//         data: [],
//         backgroundColor: ['#42A5F5', '#66BB6A'], // צבעים יפים
//       }
//     ]
//   };

//   public pieChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top'
//       },
//       title: {
//         display: true,
//         text: 'התפלגות שיעורים לפי הרשאות'
//       }
//     }
//   };

//   ngOnInit(): void {
//     this.lessonService.getLessonPermissionsSummary().subscribe(data => {
//       this.pieChartData = {
//         labels: ['ציבורי', 'פרטי'],
//         datasets: [
//           {
//             data: [data.publicLessons, data.privateLessons],
//             backgroundColor: ['#42A5F5', '#66BB6A']
//           }
//         ]
//       };
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';  // יש להוסיף את השם הנכון של השירות
import { Lesson } from '../../services/lessons.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-graphs-page',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './graphs-page.component.html',
  styleUrls: ['./graphs-page.component.css']
})
export class GraphsPageComponent implements OnInit {
  
  constructor(private lessonService: Lesson, private usersService: UsersService) {}

  // הגדרת הדיאגרמה העוגה (Pie chart)
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#42A5F5', '#66BB6A'], // צבעים יפים
      }
    ]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'התפלגות שיעורים לפי הרשאות'
      }
    }
  };

  // הגדרת דיאגרמת העמודות (Bar chart)
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar', number[], string> = {
    labels: [],  // חודשים
    datasets: [
      {
        data: [],  // מספר המשתמשים
        label: 'מספר נרשמים לכל חודש',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 1
      }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'פילוח נרשמים לפי חודש'
      }
    }
  };

  ngOnInit(): void {
    // קריאה למידע על שיעורים והתפלגות הרשאות
    this.lessonService.getLessonPermissionsSummary().subscribe(data => {
      this.pieChartData = {
        labels: ['ציבורי', 'פרטי'],
        datasets: [
          {
            data: [data.publicLessons, data.privateLessons],
            backgroundColor: ['#42A5F5', '#66BB6A']
          }
        ]
      };
    });

    // קריאה למידע על מספר נרשמים לכל חודש
    this.usersService.getUsersPerMonth().subscribe(data => {
      const months = [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
      ];
      this.barChartData = {
        labels: months, // החודשים
        datasets: [
          {
            data: data, // הנתונים שהתקבלו מהמאגרים
            label: 'מספר נרשמים לכל חודש',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 1
          }
        ]
      };
    });
  }
}
