import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  quizzes = []; // fetch from backend
  searchInput = '';
  isDrawerOpen = false;
  isEditing = false;
  quizForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpService) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([])
    });

    this.fetchQuizzes();
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  fetchQuizzes() {
    // replace with your backend API
    this.http.get('/api/quiz', true).subscribe((res: any) => {
      this.quizzes = res.data;
    });
  }

  openDrawer(mode: string) {
    this.isEditing = mode === 'edit';
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.quizForm.reset();
    this.questions.clear();
  }

  addQuestion() {
    const q = this.fb.group({
      question_text: ['', Validators.required],
      type: ['single', Validators.required],
      options: this.fb.array([])
    });
    this.questions.push(q);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  addOption(qIndex: number) {
    const options = this.questions.at(qIndex).get('options') as FormArray;
    const opt = this.fb.group({
      label: ['', Validators.required],
      option_key: ['', Validators.required],
      next_question_key: ['']
    });
    options.push(opt);
  }

  removeOption(qIndex: number, oIndex: number) {
    const options = this.questions.at(qIndex).get('options') as FormArray;
    options.removeAt(oIndex);
  }

  editQuiz(quiz) {
    this.isEditing = true;
    this.isDrawerOpen = true;
    this.quizForm.patchValue({ title: quiz.title });
    this.questions.clear();

    quiz.questions.forEach(q => {
      const questionGroup = this.fb.group({
        question_text: [q.question_text, Validators.required],
        type: [q.type, Validators.required],
        options: this.fb.array([])
      });

      const optionsArray = questionGroup.get('options') as FormArray;
      q.options.forEach(opt => optionsArray.push(this.fb.group(opt)));

      this.questions.push(questionGroup);
    });
  }

  saveQuiz() {
    // if (this.quizForm.invalid) return;

    const payload = this.quizForm.value;
    this.http.post('/api/quiz/create', payload, true).subscribe((res) => {
      console.log(res);
      this.closeDrawer();
      this.fetchQuizzes();
    });
  }

  // deleteQuiz(id: number) {
  //   this.http.delete(`/api/quiz/${id}`).subscribe(() => {
  //     this.fetchQuizzes();
  //   });
  // }
}