import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quizzes: any[] = [];
  searchInput: string = '';
  duePage!: number;
  total!: number;
  constructor(
    private http: HttpService,
    private router: Router
  ) {}

  viewResults(quiz: any): void {
    if (!quiz?.id) {
      return;
    }

    this.router.navigate(['/admin/quiz/results', quiz.id]);
  }

  ngOnInit(): void {
    this.getAllQuizzes();
  }

  async getAllQuizzes() {
    try {
      const res: any = await this.http.get('/quiz', true).toPromise();
      const rawList =
        res?.data?.data ??
        res?.data ??
        res?.quizzes ??
        res?.quiz ??
        [];

      this.quizzes = Array.isArray(rawList)
        ? rawList.map((quiz: any) => ({
            ...quiz,
            questions: this.normalizeQuestions(quiz?.questions)
          }))
        : [];

      this.total = this.quizzes.length;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      this.quizzes = [];
      this.total = 0;
    }
  }

  private normalizeQuestions(questions: any): any[] {
    if (Array.isArray(questions)) {
      return questions;
    }

    if (typeof questions === 'string') {
      try {
        const parsed = JSON.parse(questions);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing quiz questions:', error);
      }
    }

    return [];
  }

}
